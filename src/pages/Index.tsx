import { lazy, Suspense, useState, useEffect } from "react";
import { Cube, Cpu } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Fire, ThermometerHot, Lightning, Broadcast, Robot, ArrowRight, ArrowDown, Leaf, GasPump, Drop } from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { supabase } from "@/integrations/supabase/client";

const ReactorScene = lazy(() => import("@/components/three/ReactorScene"));

import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  const [activeTourStep, setActiveTourStep] = useState<number | null>(null);
  const [isTourActive, setIsTourActive] = useState(false);
  const [isReactorUnlocked, setIsReactorUnlocked] = useState(false);
  const [emailValue, setEmailValue] = useState("");

  const tourDescriptions = [
    "Supercritical H₂O and CO₂ are pumped down the primary wellbore at 50+ MPa.",
    "The mixture permeates the hot (270°C+) ultramafic rock lattice. Spontaneous Exothermic Fischer-Tropsch Type (FTT) synthesis begins.",
    "Returning 270°C supercritical fluids pass through the primary heat exchanger, stripping thermal energy into a secondary loop.",
    "Liquid hydrocarbons and Hy10 baseload gas are separated and stored. CO₂ has permanently mineralized as Magnesite underground.",
    "The stripped thermal energy drives Organic Rankine Cycle (ORC) turbines, generating zero-emission electricity to power the site."
  ];

  // Auto-advance tour logic
  useEffect(() => {
    if (!isTourActive || activeTourStep === null) return;
    
    const timer = setTimeout(() => {
      if (activeTourStep < 4) {
        setActiveTourStep(activeTourStep + 1);
      } else {
        setIsTourActive(false);
        setActiveTourStep(null);
      }
    }, 10000); // 10 seconds per step
    
    return () => clearTimeout(timer);
  }, [isTourActive, activeTourStep]);

  const startTour = (step: number) => {
    setIsTourActive(true);
    setActiveTourStep(step);
  };

  const fetchGeoIP = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      return {
        ip: data.ip || null,
        location: data.city && data.country_name ? `${data.city}, ${data.country_name}` : null
      };
    } catch {
      return { ip: null, location: null };
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailValue && emailValue.includes('@')) {
      try {
        const geoInfo = await fetchGeoIP();
        await supabase.from('contact_requests').insert({
          email: emailValue,
          name: 'Reactor Viewer',
          interest_type: 'Reactor Scene Unlock',
          message: 'Requested access to 3D Lithospheric Reactor scene.',
          ip_address: geoInfo.ip,
          location: geoInfo.location,
        });
      } catch (err) {
        console.error("Failed to store email:", err);
      }

      setIsReactorUnlocked(true);
      setTimeout(() => {
        document.getElementById('reactor-3d')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section id="vision" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-geo-orange/20 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-geo-orange/30 bg-geo-orange/10 text-geo-orange text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-geo-orange animate-pulse" />
            {t("hero.badge")}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            {t("hero.title1")} <br className="hidden lg:block" />
            <span className="text-gradient-orange">{t("hero.title2")}</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl md:text-2xl font-medium mb-12 leading-relaxed opacity-90">
            {t("hero.subtitle1")}<br className="hidden md:block"/>
            <span className="text-geo-orange font-bold font-mono text-lg mt-2 block">{t("hero.subtitle2")}</span>
          </p>
          
          <div className="flex flex-col items-center gap-6">
            {!isReactorUnlocked ? (
              <div className="bg-card/50 border border-border p-6 rounded-2xl max-w-lg w-full backdrop-blur-sm shadow-xl">
                <div className="flex items-center gap-2 mb-4 justify-center text-geo-orange font-bold text-lg">
                  <span className="text-2xl">?</span> {t("hero.curious", "Curious How?")}
                </div>
                <form onSubmit={handleUnlock} className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    placeholder={t("hero.placeholder", "Enter work email to unlock...")} 
                    required 
                    className="flex-1 bg-background/50 border border-border rounded-lg px-4 py-3 text-md focus:outline-none focus:border-geo-orange transition-colors" 
                  />
                  <button 
                    type="submit" 
                    className="bg-geo-orange text-white px-6 py-3 rounded-lg text-md font-bold hover:bg-orange-600 transition-colors shadow-[0_0_15px_rgba(234,88,12,0.5)] flex items-center justify-center gap-2"
                  >
                    <Cube weight="fill" /> {t("hero.cta", "Show me how it works")}
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="#reactor-3d"
                  className="bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-bold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                >
                  <Cube weight="bold" size={18} /> {t("hero.explore", "Explore 3D Reactor")}
                </a>
                <a
                  href="#ai-innovation"
                  className="border border-border bg-card/50 hover:bg-card/80 px-8 py-3.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-4"
                >
                  <Cpu weight="bold" size={18} /> {t("hero.techStack", "View Tech Stack")}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {isReactorUnlocked && (
        <section id="reactor-3d" className="relative w-full h-[100vh] min-h-[800px] bg-black border-y border-white/10 animate-in fade-in duration-1000">
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading 3D Reactor...</div>}>
            <ReactorScene activeTourStep={activeTourStep} isTourActive={isTourActive} />
          </Suspense>

          {/* Overlay */}
          <div className="absolute inset-0 pointer-events-none p-6 lg:p-12 flex flex-col justify-between z-10">
            <div className="glass-panel p-4 rounded-xl max-w-md pointer-events-auto">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-geo-orange">⬡</span> {t("reactor_3d.title")}
              </h2>
              <p className="text-sm text-gray-300 mt-2">
                {t("reactor_3d.desc")}
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-end">
              <div className="glass-panel p-4 rounded-xl w-full lg:w-64 pointer-events-auto hidden md:block shrink-0">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 border-b border-white/10 pb-2">{t("reactor_3d.telemetry")}</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between"><span className="text-gray-400">{t("reactor_3d.depth")}:</span> <span className="text-white">4.70 km</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">{t("reactor_3d.temp")}:</span> <span className="text-red-400">270°C</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">{t("reactor_3d.pressure")}:</span> <span className="text-blue-400">51.7 MPa</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">{t("reactor_3d.geometry")}:</span> <span className="text-geo-orange">{t("reactor_3d.lattice")}</span></div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h4 className="text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">{t("reactor_3d.particles")}</h4>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9]" />
                      <span className="text-white/70">{t("reactor_3d.h2o_mix")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-pulse shadow-[0_0_8px_#EF4444]" />
                      <span className="text-white/70">{t("reactor_3d.ftt")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
                      <span className="text-white/70">{t("reactor_3d.oil")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]" />
                      <span className="text-white/70">{t("reactor_3d.gas")}</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Guided Tour Control Panel */}
              <div className="glass-panel p-4 lg:p-6 rounded-xl w-full lg:flex-1 relative overflow-hidden pointer-events-auto shrink-0 mt-4 lg:mt-0">
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                  <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">{t("tour.title")}</h3>
                  <span className="text-xs font-mono text-geo-orange">{isTourActive ? t("tour.status_examining") : t("tour.status_ready")}</span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-4 relative z-10 mb-4">
                  <button onClick={() => startTour(0)} className={`bg-white/5 hover:bg-white/10 border border-white/10 p-2 rounded text-[11px] lg:text-xs font-bold transition-colors text-left border-l-2 border-l-geo-blue ${activeTourStep === 0 ? "bg-white/20" : ""}`}>{t("tour.step1")}</button>
                  <button onClick={() => startTour(1)} className={`bg-white/5 hover:bg-white/10 border border-white/10 p-2 rounded text-[11px] lg:text-xs font-bold transition-colors text-left border-l-2 border-l-red-500 ${activeTourStep === 1 ? "bg-white/20" : ""}`}>{t("tour.step2")}</button>
                  <button onClick={() => startTour(2)} className={`bg-white/5 hover:bg-white/10 border border-white/10 p-2 rounded text-[11px] lg:text-xs font-bold transition-colors text-left border-l-2 border-l-[#EA580C] ${activeTourStep === 2 ? "bg-white/20" : ""}`}>{t("tour.step3")}</button>
                  <button onClick={() => startTour(3)} className={`bg-white/5 hover:bg-white/10 border border-white/10 p-2 rounded text-[11px] lg:text-xs font-bold transition-colors text-left border-l-2 border-l-yellow-500 ${activeTourStep === 3 ? "bg-white/20" : ""}`}>{t("tour.step4")}</button>
                  <button onClick={() => startTour(4)} className={`bg-white/5 hover:bg-white/10 border border-white/10 p-2 rounded text-[11px] lg:text-xs font-bold transition-colors text-left border-l-2 border-l-purple-500 ${activeTourStep === 4 ? "bg-white/20" : ""}`}>{t("tour.step5")}</button>
                </div>

                {/* Dynamic Tour Description */}
                <div className="relative z-10 bg-black/40 border border-white/5 rounded-lg p-3 min-h-[60px] flex items-center">
                  <p className="text-sm text-gray-300">
                    {activeTourStep !== null 
                      ? <><span className="text-geo-orange font-bold mr-2">{t("tour.phase")} {activeTourStep + 1}:</span>{tourDescriptions[activeTourStep]}</>
                      : t("tour.placeholder")}
                  </p>
                </div>
                {/* Progress Bar Background */}
                <div className="absolute top-0 left-0 h-1 bg-white/5 w-full">
                  {isTourActive && (
                    <div key={activeTourStep} className="h-full bg-gradient-to-r from-geo-orange to-yellow-400 w-full animate-[expand_10s_linear]" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Exothermic Co-Generation Section */}
      <section id="co-generation" className="py-24 bg-geo-panel border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 mb-4">
              <span className="text-2xl">⇌</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("cogen.title")}</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              {t("cogen.desc")}
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto bg-geo-dark rounded-2xl p-8 lg:p-12 border border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-purple-500/5 pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              {/* Step 1 */}
              <div className="text-center w-full md:w-1/3 group">
                <div className="w-24 h-24 mx-auto bg-red-500/10 border border-red-500/30 group-hover:border-red-500/60 rounded-2xl flex items-center justify-center mb-4 transition-all shadow-[0_0_30px_rgba(239,68,68,0.1)] group-hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                  <Fire weight="fill" className="text-red-500 animate-pulse" size={40} />
                </div>
                <h4 className="font-bold text-lg mb-2">{t("cogen.step1_title")}</h4>
                <p className="text-sm text-muted-foreground">{t("cogen.step1_desc")}</p>
              </div>

              <div className="hidden md:flex text-muted-foreground"><ArrowRight size={32} /></div>
              <div className="md:hidden text-muted-foreground"><ArrowDown size={32} /></div>

              {/* Step 2 */}
              <div className="text-center w-full md:w-1/3 group">
                <div className="w-24 h-24 mx-auto bg-geo-orange/10 border border-geo-orange/30 group-hover:border-geo-orange/60 rounded-2xl flex items-center justify-center mb-4 transition-all shadow-[0_0_30px_rgba(234,88,12,0.1)] group-hover:shadow-[0_0_30px_rgba(234,88,12,0.3)]">
                  <ThermometerHot weight="fill" className="text-geo-orange" size={40} />
                </div>
                <h4 className="font-bold text-lg mb-2">{t("cogen.step2_title")}</h4>
                <p className="text-sm text-muted-foreground">{t("cogen.step2_desc")}</p>
              </div>

              <div className="hidden md:flex text-muted-foreground"><ArrowRight size={32} /></div>
              <div className="md:hidden text-muted-foreground"><ArrowDown size={32} /></div>

              {/* Step 3 */}
              <div className="text-center w-full md:w-1/3 group">
                <div className="w-24 h-24 mx-auto bg-purple-500/10 border border-purple-500/30 group-hover:border-purple-500/60 rounded-2xl flex items-center justify-center mb-4 transition-all shadow-[0_0_30px_rgba(168,85,247,0.1)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                  <Lightning weight="fill" className="text-purple-400" size={40} />
                </div>
                <h4 className="font-bold text-lg mb-2">{t("cogen.step3_title")}</h4>
                <p className="text-sm text-muted-foreground">{t("cogen.step3_desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI & Innovation Section */}
      <section id="ai-innovation" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("ai.title")}</h2>
            <p className="text-muted-foreground max-w-3xl text-lg">
              {t("ai.desc")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <Link to="/ai-inversion" className="glass-panel p-8 rounded-2xl hover:border-geo-orange/50 transition-colors group block">
              <div className="w-14 h-14 bg-geo-orange/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Broadcast weight="fill" className="text-geo-orange" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{t("ai.inversion_title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {t("ai.inversion_desc")}
              </p>
              <ul className="text-xs font-mono text-muted-foreground space-y-2 border-t border-border pt-4">
                <li><span className="text-green-500">Target Vp:</span> &gt; 8.0 km/s (Fresh Olivine)</li>
                <li><span className="text-blue-500">Target Density:</span> &gt; 3.2 g/cm³</li>
                <li><span className="text-purple-500">Avoid Vp:</span> &lt; 5.5 km/s (Altered)</li>
              </ul>
            </Link>

            {/* Feature Card 2 */}
            <Link to="/autonomous-robotics" className="glass-panel p-8 rounded-2xl hover:border-geo-orange/50 transition-colors group block">
              <div className="w-14 h-14 bg-geo-orange/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Robot weight="fill" className="text-geo-orange" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{t("ai.robotics_title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {t("ai.robotics_desc")}
              </p>
              <ul className="text-xs font-mono text-muted-foreground space-y-2 border-t border-border pt-4">
                <li><span className="text-geo-orange">Action:</span> Scheduled Mechanical Reaming</li>
                <li><span className="text-geo-orange">Effect:</span> Removes 5-10cm depleted layer</li>
                <li><span className="text-geo-orange">Result:</span> Resets ODE reaction kinetics to Year 0</li>
              </ul>
            </Link>

            {/* Feature Card 3 */}
            <Link to="/plasma-drilling" className="glass-panel p-8 rounded-2xl hover:border-geo-orange/50 transition-colors group block">
              <div className="w-14 h-14 bg-geo-orange/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lightning weight="fill" className="text-geo-orange" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{t("ai.plasma_title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {t("ai.plasma_desc")}
              </p>
              <ul className="text-xs font-mono text-muted-foreground space-y-2 border-t border-border pt-4">
                <li><span className="text-red-500">Constraint:</span> Extreme HPHT environment</li>
                <li><span className="text-red-500">Material:</span> High-nickel CRAs</li>
                <li><span className="text-red-500">Geometry:</span> Intersecting Lattice Grid</li>
              </ul>
            </Link>
          </div>
        </div>
      </section>

      {/* Lithographic Simulator CTA Section */}
      <section className="py-20 bg-geo-panel border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-600/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left: Text */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-500 text-xs font-bold uppercase tracking-widest mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {t("simulator.badge")}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("simulator.title")}
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                {t("simulator.desc")}
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["🇺🇸 United States", "🇮🇩 Indonesia", "🇯🇵 Japan"].map((r) => (
                  <span key={r} className="px-3 py-1.5 bg-background/50 border border-border rounded-full text-sm text-foreground/70 font-medium">{r}</span>
                ))}
              </div>
              <Link
                to="/simulator"
                className="inline-flex items-center gap-2 bg-geo-orange hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:shadow-[0_0_40px_rgba(234,88,12,0.5)] hover:-translate-y-0.5"
              >
                <span className="text-xl">🗺️</span> {t("simulator.cta")}
              </Link>
            </div>

            {/* Right: Feature Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {[
                { icon: "⛏️", title: t("simulator.drill_site"), desc: t("simulator.drill_site_desc") },
                { icon: "💰", title: t("simulator.financials"), desc: t("simulator.financials_desc") },
                { icon: "📈", title: t("simulator.yield_engine"), desc: t("simulator.yield_engine_desc") },
                { icon: "🔬", title: t("simulator.interventions"), desc: t("simulator.interventions_desc") },
                { icon: "💎", title: t("economics.title"), desc: t("economics.desc") },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-card/30 border border-border hover:border-geo-orange/30 rounded-xl p-4 transition-colors">
                  <div className="text-2xl mb-2">{icon}</div>
                  <h4 className="text-sm font-bold mb-1">{title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section id="output" className="py-24 bg-background relative overflow-hidden border-t border-border">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-geo-orange/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("products.title")}</h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                {t("products.desc1")}
              </p>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                {t("products.desc2")}
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30">
                    <Leaf weight="bold" className="text-green-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{t("products.carbon_title")}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{t("products.carbon_desc")}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-500/30">
                    <GasPump weight="bold" className="text-cyan-400" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{t("products.gas_title")}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{t("products.gas_desc")}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 border border-yellow-500/30">
                    <Drop weight="bold" className="text-yellow-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{t("products.oil_title")}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{t("products.oil_desc")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-border glass-panel p-8">
              <h3 className="text-xl font-bold mb-6 border-b border-border pb-4">{t("stoichiometry.title")}</h3>
              <div className="space-y-6 font-mono text-sm">
                <div>
                  <div className="text-geo-orange mb-2 text-xs uppercase tracking-widest font-bold">{t("stoichiometry.step1_title")}</div>
                  <div className="bg-card/50 p-4 rounded border border-border text-foreground/70">
                    <span className="text-muted-foreground">3Fe₂SiO₄ + 2H₂O →</span><br />
                    <span className="text-foreground">2Fe₃O₄ + 3SiO₂ + 2H₂ + Heat</span>
                  </div>
                </div>
                <div>
                  <div className="text-blue-400 mb-2 text-xs uppercase tracking-widest font-bold">{t("stoichiometry.step2_title")}</div>
                  <div className="bg-card/50 p-4 rounded border border-border text-foreground/70">
                    <span className="text-muted-foreground">Mg₂SiO₄ + 2CO₂ →</span><br />
                    <span className="text-foreground">2MgCO₃ (Magnesite) + SiO₂</span>
                  </div>
                </div>
                <div>
                  <div className="text-yellow-500 mb-2 text-xs uppercase tracking-widest font-bold">{t("stoichiometry.step3_title")}</div>
                  <div className="bg-card/50 p-4 rounded border border-border text-foreground/70">
                    <span className="text-muted-foreground">CO₂ + 4H₂ →</span><br />
                    <span className="text-foreground">CH₄ + 2H₂O</span>
                    <div className="mt-2 text-xs text-muted-foreground italic">{t("stoichiometry.catalyst")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />

      <Footer />
    </div>
  );
};

export default Index;
