import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    if (session) {
      setLoading(true);
      supabase
        .from("contact_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            console.error("Supabase fetch error:", error);
            alert("Failed to fetch records. This is likely due to Row Level Security (RLS) policies on your Supabase table.");
          }
          if (data) {
            setData(data);
          }
          setLoading(false);
        });
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 lg:px-8">
        {!session ? (
          <div className="max-w-md mx-auto glass-panel p-8 rounded-2xl mt-12 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin Email"
                required
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-geo-orange"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-geo-orange"
              />
              <button
                type="submit"
                className="w-full bg-geo-orange text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors"
              >
                Secure Login
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">Tracking Hub</h1>
                <div className="text-sm font-mono text-muted-foreground mt-1">
                  Total submissions: {data.length}
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Logout
              </button>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-black/40 text-muted-foreground">
                    <tr>
                      <th className="p-4 font-medium border-b border-white/10">Date</th>
                      <th className="p-4 font-medium border-b border-white/10">Name</th>
                      <th className="p-4 font-medium border-b border-white/10">Email</th>
                      <th className="p-4 font-medium border-b border-white/10">Type</th>
                      <th className="p-4 font-medium border-b border-white/10">Location</th>
                      <th className="p-4 font-medium border-b border-white/10">IP Address</th>
                      <th className="p-4 font-medium border-b border-white/10">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-white">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-muted-foreground">Loading records...</td>
                      </tr>
                    ) : data.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-muted-foreground">No records found.</td>
                      </tr>
                    ) : (
                      data.map((row) => (
                        <tr key={row.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">{new Date(row.created_at).toLocaleString()}</td>
                          <td className="p-4">{row.name}</td>
                          <td className="p-4">{row.email}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-mono lowercase ${
                              row.interest_type === 'Reactor Scene Unlock' ? 'bg-geo-orange/20 text-geo-orange' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {row.interest_type}
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground">{row.location || 'N/A'}</td>
                          <td className="p-4 font-mono text-xs text-muted-foreground">{row.ip_address || 'N/A'}</td>
                          <td className="p-4 text-muted-foreground max-w-xs truncate" title={row.message}>{row.message}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
