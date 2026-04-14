import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PlasmaScene = lazy(() => import("@/components/three/PlasmaScene"));

const PlasmaDrilling = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24 max-w-4xl mx-auto px-6 lg:px-8">
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6 border border-purple-500/30">
            {t("nav.tech_spec")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
            Expansive Subsurface Geometry via <span className="text-gradient-purple">Directed-Energy Plasma Drilling</span>
          </h1>
          <p className="text-xl text-foreground/70">An examination of artificial intelligence control loops applied to contactless thermal spallation within ultra-hard lithologies.</p>
        </div>

        {/* 3D Sim */}
        <section className="mb-16">
          <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-geo-purple/30 bg-black shadow-[0_0_40px_rgba(168,85,247,0.15)] cursor-move">
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading simulation...</div>}>
              <PlasmaScene />
            </Suspense>

            <div className="absolute top-4 left-4 glass-panel p-3 rounded text-xs font-mono pointer-events-none z-10">
              <div className="text-purple-400 font-bold border-b border-white/10 pb-1 mb-2">TELEMETRY LINK: ACTIVE</div>
              <div className="flex justify-between gap-6 mb-1"><span className="text-muted-foreground">DEPTH:</span> <span className="text-white">4,700m</span></div>
              <div className="flex justify-between gap-6 mb-1"><span className="text-muted-foreground">ROCK:</span> <span className="text-foreground/70">Harzburgite</span></div>
              <div className="flex justify-between gap-6 mb-1"><span className="text-muted-foreground">AI ROBOTICS:</span> <span className="text-blue-400">Stabilized & Active</span></div>
              <div className="flex justify-between gap-6 mb-1"><span className="text-muted-foreground">PLASMA ARC:</span> <span className="text-purple-400 animate-pulse">6,000°C</span></div>
              <div className="flex justify-between gap-6"><span className="text-muted-foreground">ROP:</span> <span className="text-green-400">Optimized</span></div>
            </div>

            <div className="absolute bottom-4 right-4 text-[10px] text-muted-foreground tracking-widest uppercase bg-black/50 px-2 py-1 rounded pointer-events-none z-10">
              Interactive Simulation: Drag to rotate
            </div>
          </div>
        </section>

        {/* Article */}
        <section className="prose-geo">
          <h2>1. Limitations of Mechanical Rotary Methods</h2>
          <p>
            The financial feasibility of the Lithospheric Reactor paradigm is inextricably linked to the volumetric expansion of the subterranean reaction zone. However, conventional mechanical rotary drill bits exhibit unacceptable rates of degradation and significantly diminished Rates of Penetration (ROP) when subjected to the ultra-hard, abrasive conditions inherent to ultramafic lithologies.
          </p>
          <p>
            The operational requirement to repeatedly halt operations and extract the entire drill string to replace worn mechanical components over a 20-kilometer lateral network incurs prohibitive temporal and financial penalties. Consequently, the deployment of next-generation, contactless drilling modalities is considered essential.
          </p>

          <h2>2. Mechanisms of Thermal Spallation</h2>
          <p>
            Operations integrate directed-energy plasma drilling technologies. This methodology eschews mechanical abrasion; instead, it generates a high-voltage plasma arc directly at the tool face. The extreme, localized application of thermal energy induces rapid differential expansion within the crystalline structure of the target rock—a process defined as thermal spallation.
          </p>
          <p>
            By utilizing a contactless mechanism, the operational lifespan of the drilling assembly is exponentially increased. The absence of a mechanical drill bit eliminates the primary vector of tool wear, thereby facilitating uninterrupted, continuous penetration through high-stress geological formations.
          </p>

          <h2>3. AI-Guided Plasma Regulation and Telemetry</h2>
          <p>
            The management of a plasma arc several kilometers beneath the Earth's surface involves a multitude of dynamic variables. Human-in-the-loop control systems lack the requisite response velocity to manage these parameters efficiently due to the latency associated with deep-borehole telemetry.
          </p>

          <h3>3.1. Telemetry Architecture and Data Flow</h3>
          <p>
            The system utilizes a specialized, high-temperature resilient fiber-optic cable integrated into the drill string, rather than traditional, low-bandwidth mud-pulse telemetry.
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6 pl-4 text-justify">
            <li><strong className="text-foreground">Downlink (Surface to Tool):</strong> Transmits macro-level trajectory corrections, power allocation limits, and updated geological models.</li>
            <li><strong className="text-foreground">Uplink (Tool to Surface):</strong> Relays compressed diagnostic data, including plasma arc stability metrics, localized ambient temperature and pressure readings.</li>
          </ul>

          <h3>3.2. Real-Time Feedback Analysis</h3>
          <p>
            An onboard artificial intelligence processor manages the high-frequency plasma pulsing sequence autonomously. The system performs continuous analyses of acoustic, electromagnetic, and thermal feedback emanating from the pulverized rock face.
          </p>

          <h3>3.3. Subsurface Trajectory Optimization</h3>
          <p>
            The AI guidance systems ensure maximum ROP while simultaneously adjusting the micro-directional heading of the plasma stream. This closed-loop regulation guarantees the structural integrity of the complex horizontal grid geometry.
          </p>

          <h3>3.4. Integration with Autonomous Downhole Robotic Assemblies</h3>
          <p>
            The directed-energy plasma spallation effector is mechanically and electronically integrated with an autonomous downhole robotic module positioned immediately uphole from the active plasma arc. This specialized robotic chassis houses the edge-computing processors and solid-state sensor arrays requisite for autonomous operation.
          </p>

          <h2>4. Conclusion</h2>
          <p>
            The integration of AI-regulated plasma drilling represents a critical technological milestone for the commercialization of Orange Hydrogen. The fusion of autonomous thermal spallation, downhole robotics, and high-speed fiber-optic telemetry ensures unprecedented operational efficiency in extreme subterranean environments.
          </p>
        </section>

        <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center text-sm">
          <Link to="/autonomous-robotics" className="text-geo-purple font-bold hover:underline">← {t("nav.prev")}: {t("nav.robotics")}</Link>
          <span className="text-muted-foreground">Document ID: GEO-AI-03-PLM</span>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PlasmaDrilling;
