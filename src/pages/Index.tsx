import { lazy, Suspense } from "react";
import { Cube, Cpu } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Fire, ThermometerHot, Lightning, Broadcast, Robot, ArrowRight, ArrowDown, Leaf, GasPump, Drop } from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

const ReactorScene = lazy(() => import("@/components/three/ReactorScene"));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section id="vision" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-geo-orange/20 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-geo-orange/30 bg-geo-orange/10 text-geo-orange text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-geo-orange animate-pulse" />
            The Future of Baseload Energy
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
            Engineering the Earth into an <br className="hidden lg:block" />
            <span className="text-gradient-orange">Underground Abiotic Refinery.</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
            GeoHy is pioneering Orange Hydrogen. We don't just extract finite resources—we manufacture continuous, high-density carbon-negative fuels directly inside the lithosphere using AI-driven reaction kinetics and advanced lattice structures.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#reactor-3d"
              className="bg-white text-geo-dark px-8 py-3.5 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Cube weight="bold" size={18} /> Explore the 3D Reactor
            </a>
            <a
              href="#ai-innovation"
              className="border border-white/20 bg-white/5 hover:bg-white/10 px-8 py-3.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 text-foreground"
            >
              <Cpu weight="bold" size={18} /> View AI Tech Stack
            </a>
          </div>
        </div>
      </section>

      {/* 3D Reactor Section */}
      <section id="reactor-3d" className="relative w-full h-[100vh] min-h-[800px] bg-black border-y border-white/10">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading 3D Reactor...</div>}>
          <ReactorScene />
        </Suspense>

        {/* Overlay */}
        <div className="absolute inset-0 pointer-events-none p-6 lg:p-12 flex flex-col justify-between z-10">
          <div className="glass-panel p-4 rounded-xl max-w-md pointer-events-auto">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-geo-orange">⬡</span> Lithospheric Reactor
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Explore our engineered closed-loop architecture featuring the high-volume lattice network and surface processing plant. Drag to rotate, scroll to zoom.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-end">
            <div className="glass-panel p-4 rounded-xl w-full lg:w-64 pointer-events-auto hidden md:block shrink-0">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 border-b border-white/10 pb-2">Target Telemetry</h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between"><span className="text-muted-foreground">Depth:</span> <span className="text-white">4.70 km</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Temp:</span> <span className="text-red-400">270°C</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Pressure:</span> <span className="text-blue-400">51.7 MPa</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Geometry:</span> <span className="text-geo-orange">Lattice</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Particle Streams</h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9]" />
                    <span className="text-foreground/70">CO₂ + H₂O Mix <span className="text-[10px] text-muted-foreground">(Down)</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-pulse shadow-[0_0_8px_#EF4444]" />
                    <span className="text-foreground/70">Exothermic FTT <span className="text-[10px] text-muted-foreground">(Lattice)</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
                    <span className="text-foreground/70">Liquid Hydrocarbons <span className="text-[10px] text-muted-foreground">(Up)</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]" />
                    <span className="text-foreground/70">Hy10 Gas <span className="text-[10px] text-muted-foreground">(Up)</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exothermic Co-Generation Section */}
      <section id="co-generation" className="py-24 bg-geo-panel border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 mb-4">
              <span className="text-2xl">⇌</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Exothermic Co-Generation</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Serpentinization is a violently exothermic reaction. By routing the returning supercritical fluids through surface heat exchangers, we strip the thermal energy (ΔH) before separation, driving Organic Rankine Cycle (ORC) turbines to power the entire site.
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
                <h4 className="font-bold text-white text-lg mb-2">1. Downhole Exothermic Heat</h4>
                <p className="text-sm text-muted-foreground">High-volume rock hydration releases extreme thermal energy (&gt;270°C) into the returning extraction fluid mixture.</p>
              </div>

              <div className="hidden md:flex text-muted-foreground"><ArrowRight size={32} /></div>
              <div className="md:hidden text-muted-foreground"><ArrowDown size={32} /></div>

              {/* Step 2 */}
              <div className="text-center w-full md:w-1/3 group">
                <div className="w-24 h-24 mx-auto bg-geo-orange/10 border border-geo-orange/30 group-hover:border-geo-orange/60 rounded-2xl flex items-center justify-center mb-4 transition-all shadow-[0_0_30px_rgba(234,88,12,0.1)] group-hover:shadow-[0_0_30px_rgba(234,88,12,0.3)]">
                  <ThermometerHot weight="fill" className="text-geo-orange" size={40} />
                </div>
                <h4 className="font-bold text-white text-lg mb-2">2. Surface Heat Exchange</h4>
                <p className="text-sm text-muted-foreground">Fluids pass through the primary HX unit, stripping the heat into a closed-loop secondary working fluid before chemical separation.</p>
              </div>

              <div className="hidden md:flex text-muted-foreground"><ArrowRight size={32} /></div>
              <div className="md:hidden text-muted-foreground"><ArrowDown size={32} /></div>

              {/* Step 3 */}
              <div className="text-center w-full md:w-1/3 group">
                <div className="w-24 h-24 mx-auto bg-purple-500/10 border border-purple-500/30 group-hover:border-purple-500/60 rounded-2xl flex items-center justify-center mb-4 transition-all shadow-[0_0_30px_rgba(168,85,247,0.1)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                  <Lightning weight="fill" className="text-purple-400" size={40} />
                </div>
                <h4 className="font-bold text-white text-lg mb-2">3. ORC Turbines</h4>
                <p className="text-sm text-muted-foreground">Organic Rankine Cycle turbines convert the heat into zero-emission electricity to power AI robotics and compression systems.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI & Innovation Section */}
      <section id="ai-innovation" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pioneering with AI & Robotics</h2>
            <p className="text-muted-foreground max-w-3xl text-lg">
              The realization of the Lithospheric Reactor is contingent upon resolving substantial geochemical and engineering challenges. GeoHy utilizes an advanced AI technology stack to mitigate HPHT (High-Pressure, High-Temperature) risks and map expansive lattice structures.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <Link to="/ai-inversion" className="glass-panel p-8 rounded-2xl hover:border-geo-orange/50 transition-colors group block">
              <div className="w-14 h-14 bg-geo-orange/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Broadcast weight="fill" className="text-geo-orange" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Geophysical Inversion</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                To avoid the "Serpentinite Trap" (drilling into spent, oxidized rock), our neural networks process massive seismic and gravimetric datasets to identify pristine olivine.
              </p>
              <ul className="text-xs font-mono text-muted-foreground space-y-2 border-t border-white/10 pt-4">
                <li><span className="text-green-400">Target Vp:</span> &gt; 8.0 km/s (Fresh Olivine)</li>
                <li><span className="text-blue-400">Target Density:</span> &gt; 3.2 g/cm³</li>
                <li><span className="text-purple-400">Avoid Vp:</span> &lt; 5.5 km/s (Altered)</li>
              </ul>
            </Link>

            {/* Feature Card 2 */}
            <Link to="/autonomous-robotics" className="glass-panel p-8 rounded-2xl hover:border-geo-orange/50 transition-colors group block">
              <div className="w-14 h-14 bg-geo-orange/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Robot weight="fill" className="text-geo-orange" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Autonomous Downhole Robotics</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Serpentinization creates a depleted "rind" acting as a severe diffusion barrier within the lattice. We deploy AI-driven robotics capable of operating at 270°C to ream the wellbore.
              </p>
              <ul className="text-xs font-mono text-muted-foreground space-y-2 border-t border-white/10 pt-4">
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
              <h3 className="text-xl font-bold text-white mb-3">Plasma Lattice Drilling</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Conventional mechanical rotary bits exhibit unacceptable wear in ultra-hard ultramafic lithologies. We utilize next-generation contactless directed-energy plasma drilling.
              </p>
              <ul className="text-xs font-mono text-muted-foreground space-y-2 border-t border-white/10 pt-4">
                <li><span className="text-red-400">Constraint:</span> Extreme HPHT environment</li>
                <li><span className="text-red-400">Material:</span> High-nickel CRAs</li>
                <li><span className="text-red-400">Geometry:</span> Intersecting Lattice Grid</li>
              </ul>
            </Link>
          </div>
        </div>
      </section>

      {/* Output Section */}
      <section id="output" className="py-24 bg-[#080B14] relative overflow-hidden border-t border-white/10">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-geo-orange/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Golden Zone Refinery</h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                By targeting depths of 4 to 5 kilometers, we reach extreme hydrostatic pressures (50-80 MPa). The injected H₂O and CO₂ transition into a fiercely supercritical state with near-zero surface tension.
              </p>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                At <strong className="text-foreground">270°C</strong>, the natural Awaruite (Ni₃Fe) and Magnetite catalysts trigger Fischer-Tropsch Type (FTT) synthesis. We don't just extract gas; we manufacture high-density fuels.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30">
                    <Leaf weight="bold" className="text-green-500" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Solid Carbon Mineralization</h4>
                    <p className="text-sm text-muted-foreground mt-1">Supercritical CO₂ reacts with magnesium to form solid Magnesite (MgCO₃), ensuring verifiable, permanent carbon-negative operation.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-500/30">
                    <GasPump weight="bold" className="text-cyan-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Hy10 Baseload Gas</h4>
                    <p className="text-sm text-muted-foreground mt-1">A synthetic blend of 10% Hydrogen and 90% Methane. Safely transportable via existing midstream pipelines, burning cleaner in standard gas turbines.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 border border-yellow-500/30">
                    <Drop weight="bold" className="text-yellow-500" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Abiotic Liquid Hydrocarbons</h4>
                    <p className="text-sm text-muted-foreground mt-1">Secondary cracking produces stable Paraffins and energy-dense Aromatics (C4 to C12) providing the high-thrust energy requisite for aviation and heavy industry.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-white/10 glass-panel p-8">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Thermodynamic Stoichiometry</h3>
              <div className="space-y-6 font-mono text-sm">
                <div>
                  <div className="text-geo-orange mb-2 text-xs uppercase tracking-widest font-bold">1. Hydration & H₂ Release</div>
                  <div className="bg-black/50 p-4 rounded border border-white/5 text-foreground/70">
                    <span className="text-muted-foreground">3Fe₂SiO₄ + 2H₂O →</span><br />
                    <span className="text-white">2Fe₃O₄ + 3SiO₂ + 2H₂ + Heat</span>
                  </div>
                </div>
                <div>
                  <div className="text-blue-400 mb-2 text-xs uppercase tracking-widest font-bold">2. Carbon Sequestration</div>
                  <div className="bg-black/50 p-4 rounded border border-white/5 text-foreground/70">
                    <span className="text-muted-foreground">Mg₂SiO₄ + 2CO₂ →</span><br />
                    <span className="text-white">2MgCO₃ (Magnesite) + SiO₂</span>
                  </div>
                </div>
                <div>
                  <div className="text-yellow-500 mb-2 text-xs uppercase tracking-widest font-bold">3. FTT Synthesis (Abiotic Fuel)</div>
                  <div className="bg-black/50 p-4 rounded border border-white/5 text-foreground/70">
                    <span className="text-muted-foreground">CO₂ + 4H₂ →</span><br />
                    <span className="text-white">CH₄ + 2H₂O</span>
                    <div className="mt-2 text-xs text-muted-foreground italic">Catalyzed natively by Awaruite (Ni₃Fe)</div>
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
