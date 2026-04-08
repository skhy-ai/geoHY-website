import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

type Step = 'register' | 'login' | 'success';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('register');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/simulator', { replace: true });
    });
  }, [navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Name is required.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, company } },
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('Signup failed — no user returned.');

      // Insert profile row
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, name, company: company || null, access_tier: 'explorer' });

      if (profileError && profileError.code !== '23505') {
        console.warn('Profile insert issue:', profileError.message);
      }

      // Insert contact_requests row
      await supabase.from('contact_requests').insert({
        name,
        email,
        company: company || null,
        interest_type: 'Lithographic Simulator Access',
        user_id: data.user.id,
      });

      if (data.session) {
        // Auto-confirmed (dev mode), go straight to simulator
        navigate('/simulator', { replace: true });
      } else {
        setStep('success');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) throw loginError;
      navigate('/simulator', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-black text-white tracking-tight">
              Geo<span className="text-orange-500">HY</span>
            </h1>
          </Link>
          <p className="text-gray-400 text-sm mt-1">Geological Hydrogen Platform</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Tab switcher */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => { setStep('register'); setError(''); }}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${step === 'register' || step === 'success' ? 'text-orange-400 border-b-2 border-orange-500 bg-gray-800/40' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Create Account
            </button>
            <button
              onClick={() => { setStep('login'); setError(''); }}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${step === 'login' ? 'text-orange-400 border-b-2 border-orange-500 bg-gray-800/40' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Sign In
            </button>
          </div>

          <div className="p-7">
            {step === 'success' ? (
              <div className="text-center py-4">
                <div className="text-5xl mb-4">✉️</div>
                <h2 className="text-xl font-bold text-white mb-2">Check Your Email</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  We've sent a confirmation link to <span className="text-orange-400 font-medium">{email}</span>. Click it to activate your account, then come back to sign in.
                </p>
                <button
                  onClick={() => setStep('login')}
                  className="mt-6 w-full py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold transition-colors"
                >
                  Go to Sign In
                </button>
              </div>
            ) : step === 'register' ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Explore the Simulator</h2>
                  <p className="text-gray-400 text-xs">Create a free explorer account to access the Lithographic Reactor Simulator.</p>
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-500/50 text-red-300 text-sm px-3 py-2 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium">Full Name *</label>
                    <input
                      type="text" required value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Smith"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium">Organisation</label>
                    <input
                      type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company / University"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Email *</label>
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Password *</label>
                  <input
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Confirm Password *</label>
                  <input
                    type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating Account...</>
                  ) : (
                    'Create Account & Explore'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By signing up, you agree to GeoHY's terms of use. Your data will only be used to provide simulator access.
                </p>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Welcome Back</h2>
                  <p className="text-gray-400 text-xs">Sign in to access the Lithographic Reactor Simulator.</p>
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-500/50 text-red-300 text-sm px-3 py-2 rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Email</label>
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Password</label>
                  <input
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing In...</>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          <Link to="/" className="hover:text-gray-400 transition-colors">← Back to GeoHY</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
