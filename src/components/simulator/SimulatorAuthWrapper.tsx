import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface SimulatorAuthWrapperProps {
  children: React.ReactNode;
}

const SimulatorAuthWrapper: React.FC<SimulatorAuthWrapperProps> = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [accessTier, setAccessTier] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          if (mounted) navigate('/signup');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('access_tier')
          .eq('id', session.user.id)
          .single();

        if (profile && mounted) {
          setAccessTier(profile.access_tier);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session) {
        if (mounted) navigate('/signup');
      } else if (mounted) {
        checkAuth();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950 text-white text-lg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          Loading Simulator...
        </div>
      </div>
    );
  }

  // If waitlisted
  if (accessTier === 'waitlist' || accessTier === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 px-4 text-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10 glass-panel p-8 md:p-12 rounded-3xl max-w-lg w-full border border-white/10 shadow-2xl backdrop-blur-md bg-black/40">
          <div className="w-20 h-20 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-[0_0_30px_rgba(234,88,12,0.3)]">
            ⏳
          </div>
          <h2 className="text-3xl font-black text-white mb-4">You're on the Waitlist</h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Thank you for joining GeoHY. The Lithospheric Simulator requires high compute resources, so we approve access in batches. An administrator will review your request shortly.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)]"
          >
            Return to Homepage
          </button>
        </div>
        
        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            navigate('/signup');
          }}
          className="relative z-10 mt-8 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  // explorer, pro, admin
  return <>{children}</>;
};

export default SimulatorAuthWrapper;
