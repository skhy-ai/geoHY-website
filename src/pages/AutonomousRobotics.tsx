import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CaretRight } from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RoboticsScene = lazy(() => import("@/components/three/RoboticsScene"));

const AutonomousRobotics = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24 max-w-4xl mx-auto px-6 lg:px-8">
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-geo-blue/10 text-geo-blue text-xs font-bold uppercase tracking-widest mb-6 border border-geo-blue/30">
            {t("nav.tech_spec")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
            Kinetic Restoration via <span className="text-gradient-blue">Autonomous Downhole Robotic Systems</span>
          </h1>
          <p className="text-xl text-foreground/70">Operational methodologies for mitigating diffusion barriers and managing dynamic thermodynamics in HPHT subterranean environments.</p>
        </div>

        {/* 3D Sim */}
        <section className="mb-16">
          <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-geo-blue/30 bg-black shadow-[0_0_40px_rgba(14,165,233,0.15)] cursor-move">
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading simulation...</div>}>
              <RoboticsScene />
            </Suspense>

            <div className="absolute top-4 left-4 glass-panel p-3 rounded text-xs font-mono w-64 pointer-events-none z-10">
              <div className="text-geo-blue font-bold border-b border-white/10 pb-1 mb-2">EDGE INFERENCE: ACTIVE</div>
              <div className="flex justify-between gap-4 mb-1"><span className="text-muted-foreground">AMB TEMP:</span> <span className="text-red-400">274°C</span></div>
              <div className="flex justify-between gap-4 mb-1"><span className="text-muted-foreground">PRESSURE:</span> <span className="text-white">52.1 MPa</span></div>
              <div className="flex justify-between gap-4 mb-1"><span className="text-muted-foreground">IMPEDANCE:</span> <span className="text-green-400">Nominal</span></div>
              <div className="flex justify-between gap-4 mt-2 pt-2 border-t border-white/10">
                <span className="text-muted-foreground">RIND ABRASION:</span> <span className="text-orange-400 font-bold animate-pulse">5.2 cm</span>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 text-[10px] text-muted-foreground tracking-widest uppercase bg-black/50 px-2 py-1 rounded pointer-events-none z-10">
              Interactive Simulation: Drag to rotate
            </div>
          </div>
        </section>

        {/* Article */}
        <section className="prose-geo">
          <h2>1. The Phenomenon of Kinetic Attenuation</h2>
          <p>
            The economic efficiency of the lithospheric reactor is predicated upon the maximization of horizontal subsurface contact area. However, the exothermic serpentinization reaction inherently precipitates the formation of an oxidized, depleted mineralogical boundary layer—referred to as the "rind"—along the circumference of the lateral boreholes. Over defined temporal operational periods, this rind functions as a severe chemical diffusion barrier.
          </p>
          <p>
            To sustain baseload output parameters, aggressive mechanical intervention is mandated. The prescribed corrective measure involves mechanically reaming the lateral wellbores to abrade the accumulated 5 to 10-centimeter depleted boundary layer, thereby exposing pristine, reactive ferrous iron to the circulating supercritical fluids.
          </p>

          <h2>2. Environmental Constraints on Telemetry and Control</h2>
          <p>
            Executing mechanical interventions at depths exceeding 4.7 kilometers presents formidable engineering challenges. The subterranean environment is characterized by HPHT extremes, routinely exceeding 270°C and 50 MPa. Standard MWD and LWD electronic assemblies suffer catastrophic thermal failure under such parameters.
          </p>

          <h2>3. Architectural Block Diagram: Edge-AI Logic Flow</h2>
          <p>
            To circumvent telemetry limitations, operations are delegated to autonomous downhole robotic units. These systems integrate advanced materials science with edge-computing artificial intelligence.
          </p>

          {/* Flow Diagram */}
          <div className="my-10 p-8 glass-panel rounded-2xl bg-black/40">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flow-node flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center border border-gray-600 text-xs font-bold text-white shrink-0">1</div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Data Acquisition</h4>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 font-mono">
                  <li><span className="text-blue-400">►</span> Acoustic Impedance</li>
                  <li><span className="text-blue-400">►</span> BHT Thermocouples</li>
                  <li><span className="text-blue-400">►</span> Pressure Transducers</li>
                </ul>
              </div>

              <div className="flex items-center justify-center w-10 text-geo-blue md:block hidden"><CaretRight size={24} /></div>
              <div className="flex items-center justify-center h-10 text-geo-blue md:hidden rotate-90"><CaretRight size={24} /></div>

              <div className="flow-node flex-1 !border-purple-500/40 bg-purple-900/10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center border border-gray-600 text-xs font-bold text-white shrink-0">2</div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Edge AI Inference</h4>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 font-mono">
                  <li><span className="text-purple-400">►</span> Calculate Rind Thickness</li>
                  <li><span className="text-purple-400">►</span> Verify HPHT Thresholds</li>
                  <li><span className="text-purple-400">►</span> Establish Trajectory</li>
                </ul>
              </div>

              <div className="flex items-center justify-center w-10 text-geo-blue md:block hidden"><CaretRight size={24} /></div>
              <div className="flex items-center justify-center h-10 text-geo-blue md:hidden rotate-90"><CaretRight size={24} /></div>

              <div className="flow-node flex-1 !border-geo-orange/40 bg-orange-900/10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center border border-gray-600 text-xs font-bold text-white shrink-0">3</div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Actuation & Control</h4>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 font-mono">
                  <li><span className="text-geo-orange">►</span> Modulate ROP / Torque</li>
                  <li><span className="text-geo-orange">►</span> Engage Mechanical Reamer</li>
                  <li><span className="text-geo-orange">►</span> Request Thermal Modulation</li>
                </ul>
              </div>

              <div className="flex items-center justify-center w-10 text-geo-blue md:block hidden"><CaretRight size={24} /></div>
              <div className="flex items-center justify-center h-10 text-geo-blue md:hidden rotate-90"><CaretRight size={24} /></div>

              <div className="flow-node flex-1 !border-green-500/40 bg-green-900/10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center border border-gray-600 text-xs font-bold text-white shrink-0">4</div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Validation Sync</h4>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 font-mono">
                  <li><span className="text-green-400">►</span> Post-Abrasion Scan</li>
                  <li><span className="text-green-400">►</span> Confirm Kinetic Reset</li>
                  <li><span className="text-green-400">►</span> Uplink Compressed Data</li>
                </ul>
              </div>
            </div>
          </div>

          <h2>4. Dynamic Thermal Regulation and Enthalpy Management</h2>
          <p>
            The phenomenon of localized heat generation during subterranean operations presents a critical thermodynamic challenge. If unmanaged, the localized Bottom-Hole Temperature will rapidly exceed the 300°C threshold, thereby shifting the thermodynamic equilibrium away from FTT synthesis and precipitating catalyst degradation.
          </p>
          <p>
            The autonomous systems rely on Dynamic Thermal Regulation. The injected aqueous solution is utilized not merely as a chemical reactant, but as an actively modulated heat sink. By utilizing high-frequency thermocouple data, the edge-computing processors dynamically command surface pumps to adjust the mass flow rate of the circulating fluid.
          </p>

          <h2>5. Economic Implications of Autonomy</h2>
          <p>
            Mathematical modeling indicates that the deployment of autonomous mechanical reaming at scheduled intervals significantly optimizes the lifecycle economics of the facility. The ability to restore peak reaction kinetics independently of heavy surface rig mobilization contributes to an estimated 15% reduction in the Levelized Cost of Energy (LCOE) over a standard 30-year operational period.
          </p>
        </section>

        <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center text-sm">
          <Link to="/ai-inversion" className="text-geo-blue font-bold hover:underline">← {t("nav.prev")}: {t("nav.inversion")}</Link>
          <Link to="/plasma-drilling" className="text-geo-blue font-bold hover:underline">{t("nav.next")}: {t("nav.plasma")} →</Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AutonomousRobotics;
