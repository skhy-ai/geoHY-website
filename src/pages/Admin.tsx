import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

type TabId = "contacts" | "simulator_users";

interface ContactRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company?: string;
  interest_type?: string;
  location?: string;
  ip_address?: string;
  message?: string;
  user_id?: string;
}

interface ProfileRow {
  id: string;
  created_at: string;
  name: string;
  company?: string;
  access_tier: string;
}

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<any>(null);
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [simulatorUsers, setSimulatorUsers] = useState<ContactRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("contacts");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    setLoading(true);

    Promise.all([
      supabase
        .from("contact_requests")
        .select("*")
        .order("created_at", { ascending: false }),
    ]).then(([contactsRes]) => {
      if (contactsRes.data) {
        const allContacts: ContactRow[] = contactsRes.data;
        setContacts(allContacts);
        setSimulatorUsers(
          allContacts.filter((r) => r.interest_type === "Lithographic Simulator Access")
        );
      }
      if (contactsRes.error) console.error("Contacts error:", contactsRes.error);
      setLoading(false);
    });

    // Fetch profiles if table exists
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setProfiles(data as ProfileRow[]);
      });
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  const handleLogout = async () => supabase.auth.signOut();

  const badgeClass = (type?: string) => {
    if (!type) return "bg-gray-500/20 text-gray-400";
    if (type === "Reactor Scene Unlock") return "bg-geo-orange/20 text-geo-orange";
    if (type === "Lithographic Simulator Access") return "bg-green-500/20 text-green-400";
    return "bg-blue-500/20 text-blue-400";
  };

  const tierBadge = (tier: string) => {
    if (tier === "admin") return "bg-red-500/20 text-red-400";
    if (tier === "pro") return "bg-purple-500/20 text-purple-400";
    return "bg-teal-500/20 text-teal-400";
  };

  const TABS: { id: TabId; label: string; count?: number }[] = [
    { id: "contacts", label: "All Contacts", count: contacts.length },
    { id: "simulator_users", label: "🗺️ Simulator Users", count: simulatorUsers.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 lg:px-8">
        {!session ? (
          <div className="max-w-md mx-auto glass-panel p-8 rounded-2xl mt-12 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin Email" required
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-geo-orange"
              />
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" required
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-geo-orange"
              />
              <button type="submit" className="w-full bg-geo-orange text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">
                Secure Login
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">Tracking Hub</h1>
                <div className="text-sm font-mono text-muted-foreground mt-1">
                  {contacts.length} total contacts · {simulatorUsers.length} simulator users · {profiles.length} profiles
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/simulator"
                  className="bg-green-600/20 border border-green-500/30 hover:bg-green-600/30 text-green-400 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  🗺️ Open Simulator
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Contacts", value: contacts.length, color: "text-orange-400" },
                { label: "Simulator Signups", value: simulatorUsers.length, color: "text-green-400" },
                { label: "Verified Profiles", value: profiles.length, color: "text-teal-400" },
                {
                  label: "Explorer Tier",
                  value: profiles.filter((p) => p.access_tier === "explorer").length,
                  color: "text-blue-400",
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="glass-panel rounded-xl p-4 border border-white/10">
                  <div className={`text-3xl font-black mb-1 ${color}`}>{value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-black/40 p-1 rounded-xl border border-white/10 w-fit">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-geo-orange text-white shadow-md"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20" : "bg-white/10"}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Contact Requests Table */}
            {(activeTab === "contacts" || activeTab === "simulator_users") && (
              <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-black/40 text-muted-foreground">
                      <tr>
                        <th className="p-4 font-medium border-b border-white/10">Date</th>
                        <th className="p-4 font-medium border-b border-white/10">Name</th>
                        <th className="p-4 font-medium border-b border-white/10">Email</th>
                        <th className="p-4 font-medium border-b border-white/10">Company</th>
                        <th className="p-4 font-medium border-b border-white/10">Type</th>
                        <th className="p-4 font-medium border-b border-white/10">Location</th>
                        <th className="p-4 font-medium border-b border-white/10">IP</th>
                        {activeTab === "contacts" && (
                          <th className="p-4 font-medium border-b border-white/10">Message</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-white">
                      {loading ? (
                        <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Loading records...</td></tr>
                      ) : (activeTab === "contacts" ? contacts : simulatorUsers).length === 0 ? (
                        <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No records found.</td></tr>
                      ) : (
                        (activeTab === "contacts" ? contacts : simulatorUsers).map((row) => (
                          <tr key={row.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-muted-foreground text-xs">{new Date(row.created_at).toLocaleString()}</td>
                            <td className="p-4 font-medium">{row.name}</td>
                            <td className="p-4 text-blue-300">{row.email}</td>
                            <td className="p-4 text-muted-foreground">{row.company || '—'}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs font-mono lowercase ${badgeClass(row.interest_type)}`}>
                                {row.interest_type || 'N/A'}
                              </span>
                            </td>
                            <td className="p-4 text-muted-foreground text-xs">{row.location || '—'}</td>
                            <td className="p-4 font-mono text-xs text-muted-foreground">{row.ip_address || '—'}</td>
                            {activeTab === "contacts" && (
                              <td className="p-4 text-muted-foreground max-w-xs truncate" title={row.message}>{row.message}</td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Profiles Table (inside simulator_users tab, below signups) */}
            {activeTab === "simulator_users" && profiles.length > 0 && (
              <div className="mt-8 glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                <div className="p-4 border-b border-white/10 bg-black/40">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">🔐 Verified Profiles (accounts confirmed)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-black/30 text-muted-foreground">
                      <tr>
                        <th className="p-4 font-medium border-b border-white/10">Signup Date</th>
                        <th className="p-4 font-medium border-b border-white/10">Name</th>
                        <th className="p-4 font-medium border-b border-white/10">Company</th>
                        <th className="p-4 font-medium border-b border-white/10">Access Tier</th>
                        <th className="p-4 font-medium border-b border-white/10">User ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-white">
                      {profiles.map((p) => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 text-muted-foreground text-xs">{new Date(p.created_at).toLocaleString()}</td>
                          <td className="p-4 font-medium">{p.name}</td>
                          <td className="p-4 text-muted-foreground">{p.company || '—'}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-mono ${tierBadge(p.access_tier)}`}>
                              {p.access_tier}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-xs text-muted-foreground truncate max-w-[200px]">{p.id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
