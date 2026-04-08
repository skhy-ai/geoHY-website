import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import { Waves, MagnetStraight, Lightning, Cpu, Target } from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const InversionScene = lazy(() => import("@/components/three/InversionScene"));

const AIInversion = () => {
  const [scanDepth, setScanDepth] = useState("-4.50 km");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24 max-w-4xl mx-auto px-6 lg:px-8">
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-geo-orange/10 text-geo-orange text-xs font-bold uppercase tracking-widest mb-6 border border-geo-orange/30">
            Technical Specification Document
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
            Deep Crustal Target Acquisition via <span className="text-gradient-orange">Artificial Intelligence-Driven Geophysical Inversion</span>
          </h1>
          <p className="text-xl text-foreground/70">An analysis of algorithmic methodologies for the identification and delineation of unreacted ultramafic formations.</p>
        </div>

        {/* 3D Sim */}
        <section className="mb-16">
          <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-geo-orange/30 bg-black shadow-[0_0_40px_rgba(234,88,12,0.15)] cursor-move">
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading simulation...</div>}>
              <InversionScene onDepthChange={setScanDepth} />
            </Suspense>

            {/* HUD */}
            <div className="absolute top-4 left-4 glass-panel p-3 rounded text-xs font-mono w-64 pointer-events-none z-10">
              <div className="text-geo-orange font-bold border-b border-white/10 pb-1 mb-2">TENSOR ANALYSIS: ACTIVE</div>
              <div className="flex justify-between gap-4 mb-1"><span className="text-muted-foreground">ALGORITHM:</span> <span className="text-white">GAN / 3D-CNN</span></div>
              <div className="flex justify-between gap-4 mb-1"><span className="text-muted-foreground">RESOLUTION:</span> <span className="text-foreground/70">15m³ Voxels</span></div>
              <div className="flex justify-between gap-4 mb-1"><span className="text-muted-foreground">SCAN PLANE:</span> <span className="text-blue-400 font-bold">{scanDepth}</span></div>
              <div className="flex justify-between gap-4 mt-2 pt-2 border-t border-white/10">
                <span className="text-muted-foreground">TARGET ACQUIRED:</span> <span className="text-green-400 animate-pulse">TRUE</span>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 glass-panel p-3 rounded text-[10px] font-mono pointer-events-none z-10">
              <div className="font-bold text-muted-foreground mb-2 uppercase tracking-widest">Seismic Velocity Matrix</div>
              <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 bg-red-500 rounded-sm" /> <span className="text-foreground/70">Vp &lt; 5.5 km/s (Altered/Spent)</span></div>
              <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 bg-yellow-500 rounded-sm" /> <span className="text-foreground/70">Vp 5.5 - 7.9 km/s (Transition)</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-sm shadow-[0_0_8px_#22c55e]" /> <span className="text-foreground/70 font-bold">Vp &gt; 8.0 km/s (Pristine Core)</span></div>
            </div>

            <div className="absolute bottom-4 right-4 text-[10px] text-muted-foreground tracking-widest uppercase bg-black/50 px-2 py-1 rounded pointer-events-none z-10">
              Interactive Simulation: Drag to rotate
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="prose-geo">
          <h2>1. Introduction to the Geochemical Identification Paradigm</h2>
          <p>
            The successful deployment and continuous operation of a lithospheric reactor are fundamentally contingent upon the precise identification of an optimal geological formation. The requisite conditions encompass specific geothermal gradients, an impermeable caprock seal, and, most critically, massive volumes of unaltered ultramafic rock. Drilling operations directed into lithologies that have previously undergone natural serpentinization present a severe economic and operational risk, colloquially termed the "Serpentinite Trap."
          </p>
          <p>
            To circumvent the prohibitive capital expenditure associated with non-productive vertical boreholes, advanced artificial intelligence (AI) methodologies are deployed. Specifically, deep learning algorithms are utilized to perform multiphysics geophysical inversion, parsing massive datasets to isolate pristine, high-iron olivine cores (e.g., dunite and harzburgite) from surrounding altered materials.
          </p>

          <h2>2. Architectural Block Diagram: Multi-Modal Processing</h2>
          <p>
            The implementation of AI geophysical inversion relies upon the simultaneous integration and processing of disparate datatypes, which traditional analytical models frequently fail to correlate with the requisite spatial resolution.
          </p>

          {/* Block Diagram */}
          <div className="my-10 p-8 glass-panel rounded-2xl bg-black/40">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <div className="diagram-node">
                <Waves weight="bold" className="text-geo-orange mx-auto mb-2" size={28} />
                <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Seismic Tomography</h4>
                <p className="text-xs text-muted-foreground m-0">Acoustic Velocity (Vp/Vs)</p>
              </div>
              <div className="diagram-node">
                <MagnetStraight weight="bold" className="text-geo-orange mx-auto mb-2" size={28} />
                <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Gravimetric Survey</h4>
                <p className="text-xs text-muted-foreground m-0">Density Gradiometry (Δρ)</p>
              </div>
              <div className="diagram-node">
                <Lightning weight="bold" className="text-geo-orange mx-auto mb-2" size={28} />
                <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Magnetotellurics (MT)</h4>
                <p className="text-xs text-muted-foreground m-0">Subsurface Resistivity (Ω)</p>
              </div>
            </div>

            <div className="flex justify-around mb-2 px-12">
              <div className="diagram-arrow-down" />
              <div className="diagram-arrow-down" />
              <div className="diagram-arrow-down" />
            </div>

            <div className="diagram-node mb-2 !border-blue-500/40 bg-blue-900/10">
              <h4 className="text-sm font-bold text-blue-400 mb-2 uppercase tracking-wider">Data Normalization & Tensor Alignment</h4>
              <p className="text-xs text-muted-foreground m-0">Filtering background noise and aligning disparate spatial resolutions into a unified, multi-dimensional tensor matrix.</p>
            </div>

            <div className="diagram-arrow-down mb-2" style={{ background: "#0EA5E9" }} />

            <div className="diagram-node mb-2 !border-purple-500/40 bg-purple-900/10">
              <Cpu weight="bold" className="text-purple-400 mx-auto mb-2" size={28} />
              <h4 className="text-base font-bold text-white mb-2 uppercase tracking-wider">3D-CNN / GAN Inversion Engine</h4>
              <div className="flex flex-col md:flex-row justify-center gap-6 text-xs text-muted-foreground">
                <span><strong>Generator:</strong> Synthesizes predictive lithological models.</span>
                <span><strong>Discriminator:</strong> Evaluates synthetic models against empirical field data.</span>
              </div>
            </div>

            <div className="diagram-arrow-down mb-2" style={{ background: "#A855F7" }} />

            <div className="diagram-node !border-green-500/40 bg-green-900/10">
              <Target weight="bold" className="text-green-400 mx-auto mb-2" size={28} />
              <h4 className="text-base font-bold text-white mb-1 uppercase tracking-wider">Probabilistic Target Acquisition</h4>
              <p className="text-xs text-green-300/70 m-0 font-mono">Output: Confirmed Vp &gt; 8.0 km/s continuous volumetric domain.</p>
            </div>
          </div>

          <h2>3. Modality Specifics and Execution</h2>

          <h3>3.1. Seismic Velocity Discrimination</h3>
          <p>
            Acoustic wave propagation provides the most definitive metric for assessing rock alteration. Unaltered, dense olivine exhibits high compressional wave velocities (Vp &gt; 8.0 km/s). Conversely, hydrothermally altered, spongy serpentinite registers significantly lower velocities (Vp &lt; 5.5 km/s). Convolutional neural networks (CNNs) process 3D seismic tomography data to map high-velocity anomalies within the target depth range (3 to 5 kilometers).
          </p>

          <h3>3.2. Gravimetric Anomaly Detection</h3>
          <p>
            Density variances provide secondary verification of unreacted mass. Pristine peridotite constitutes an exceptionally dense lithology, generally exceeding 3.2 g/cm³. As the rock undergoes serpentinization and subsequent volumetric expansion, its bulk density decreases to approximately 2.5 g/cm³. The AI systems perform high-resolution gravimetric inversion to pinpoint localized mass concentrations.
          </p>

          <h3>3.3. Magnetotelluric (MT) Conductivity Mapping</h3>
          <p>
            Magnetotelluric surveys measure the Earth's subsurface electrical resistivity. Altered serpentinite boundaries frequently exhibit higher conductivity due to the presence of interconnected magnetite veins and saline fluid inclusions. The inversion algorithms map these conductive boundaries to delineate the spatial extent of the alteration front.
          </p>
        </section>

        <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Document ID: GEO-AI-01-INV</span>
          <Link to="/autonomous-robotics" className="text-geo-orange font-bold hover:underline">Next: Autonomous Robotics →</Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AIInversion;
