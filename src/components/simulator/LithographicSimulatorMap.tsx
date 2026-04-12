import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon paths broken by Vite bundler
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
import {
  runSimulation,
  calculateCAPEX,
  isPointInPoly,
  applyReam,
  BORE_DIAMETER_M,
  MAX_BORE_DIAMETER_M,
  SIM_YEARS,
  type DrillSegment,
  type Intervention,
  type SimulationResult,
  type CAPEXParams,
  type OPEXParams,
} from '@/lib/simulatorPhysics';
import SimulatorDashboard from './SimulatorDashboard';
import type { GeoPolygon, HeatContour } from '@/data/simulator/us-geology';

export interface SimulatorConfig {
  mapCenter: [number, number];
  mapZoom: number;
  regionLabel: string;
  regionFlag: string;
  defaultHeat: { val: number; desc: string };
  capexParams: CAPEXParams;
  opexParams: OPEXParams;
  ultramaficPolygons: GeoPolygon[];
  sealPolygons: GeoPolygon[];
  heatContours: HeatContour[];
  sealLabel?: string;
  /** Japan-specific: additional layers rendered by caller */
  additionalLayers?: (map: L.Map) => void;
  /** Japan-specific: custom heat evaluation function */
  resolveHeat?: (lat: number, lng: number) => { val: number; gradient?: number; desc: string };
  /** Japan-specific: depth cap */
  maxDrillDepthKm?: number;
}

interface Props {
  config: SimulatorConfig;
}

function getHeatColor(val: number): string {
  return val >= 150 ? '#4c1d95' : val >= 100 ? '#7f1d1d' : val >= 80 ? '#dc2626' : '#f97316';
}
function getHeatOpacity(val: number): number {
  return val >= 150 ? 0.85 : val >= 100 ? 0.7 : val >= 80 ? 0.5 : 0.2;
}
function getGradientFromHeat(val: number): number {
  return val >= 150 ? 80 : val >= 100 ? 45 : val >= 80 ? 35 : val >= 65 ? 30 : 25;
}

const LithographicSimulatorMap: React.FC<Props> = ({ config }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [modalDepthText, setModalDepthText] = useState('');
  const [pendingSite, setPendingSite] = useState<{
    lat: number; lng: number;
    source: GeoPolygon | null;
    seal: GeoPolygon | null;
    heat: { val: number; gradient?: number; desc: string };
    depthKm: number;
    multiplier: number;
    actualTemp?: number;
    nearestWell?: { name: string; depth: number };
  } | null>(null);

  const [activeSite, setActiveSite] = useState<typeof pendingSite>(null);
  const [initialLatticeKm, setInitialLatticeKm] = useState(1.0);
  const [segments, setSegments] = useState<DrillSegment[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [interventionYear, setInterventionYear] = useState(5);
  const [lateralKmInput, setLateralKmInput] = useState(1.0);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, { zoomControl: false }).setView(
      config.mapCenter,
      config.mapZoom
    );
    mapRef.current = map;

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    const esriTopo = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      { attribution: 'Esri, USGS' }
    ).addTo(map);

    const esriDark = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      { attribution: 'Esri' }
    );

    const esriImagery = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { attribution: 'Esri' }
    );

    // Geology layers
    const ultramaficLayer = L.layerGroup().addTo(map);
    config.ultramaficPolygons.forEach((site) => {
      L.polygon(site.coords, {
        fillColor: '#ea580c', color: '#c2410c', weight: 2, fillOpacity: 0.7, interactive: false,
      }).addTo(ultramaficLayer);
    });

    const sealLayer = L.layerGroup().addTo(map);
    config.sealPolygons.forEach((basin) => {
      L.polygon(basin.coords, {
        fillColor: '#9333ea', color: '#7e22ce', weight: 1, fillOpacity: 0.4, interactive: false,
      }).addTo(sealLayer);
    });

    const heatLayer = L.layerGroup().addTo(map);
    [...config.heatContours].sort((a, b) => a.val - b.val).forEach((zone) => {
      L.polygon(zone.coords, {
        fillColor: getHeatColor(zone.val), color: 'transparent',
        fillOpacity: getHeatOpacity(zone.val), interactive: false,
      }).addTo(heatLayer);
    });

    // Delegate additional layers (Japan faults, wells etc.)
    config.additionalLayers?.(map);

    const overlays: Record<string, L.Layer> = {
      "<span style='color:#ea580c'>■</span> Ultramafic Source": ultramaficLayer,
      "🔥 Thermal Gradients": heatLayer,
      "<span style='color:#9333ea'>■</span> Seal Formations": sealLayer,
    };

    L.control.layers({ 'Topographic': esriTopo, 'Dark Canvas': esriDark, 'Satellite': esriImagery }, overlays, { collapsed: false }).addTo(map);

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;

      if (markerRef.current) map.removeLayer(markerRef.current);
      markerRef.current = L.circleMarker([lat, lng], {
        radius: 6, fillColor: '#fff', color: '#000', weight: 2, fillOpacity: 1,
      }).addTo(map);

      const source = config.ultramaficPolygons.find((p) => isPointInPoly(lat, lng, p.coords)) ?? null;
      const seal = config.sealPolygons.find((p) => isPointInPoly(lat, lng, p.coords)) ?? null;

      let heat: { val: number; gradient?: number; desc: string } = config.defaultHeat;
      if (config.resolveHeat) {
        heat = config.resolveHeat(lat, lng);
      } else {
        config.heatContours.forEach((zone) => {
          if (isPointInPoly(lat, lng, zone.coords)) heat = zone;
        });
      }

      const gradient = (heat as { gradient?: number }).gradient ?? getGradientFromHeat(heat.val);
      const maxDepth = config.maxDrillDepthKm ?? Infinity;
      const idealDepth = (250 - 15) / gradient;
      const depthKm = Math.min(idealDepth, maxDepth);
      const actualTemp = 15 + depthKm * gradient;
      const multiplier = (source ? 1.0 : 0.05) * (heat.val / 65.0);

      setModalDepthText(depthKm.toFixed(2) + ' km');
      setPendingSite({ lat, lng, source, seal, heat, depthKm, multiplier, actualTemp });
      setShowModal(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const confirmDrill = useCallback(() => {
    if (!pendingSite) return;
    setShowModal(false);
    setActiveSite(pendingSite);

    const vertSeg: DrillSegment = {
      id: 'Vertical Bore',
      drilledYear: 0,
      lengthKm: pendingSite.depthKm,
      isVertical: true,
      activeYieldKm: 0.1,
      diameterM: BORE_DIAMETER_M,
      costs: calculateCAPEX(pendingSite.depthKm, true, config.capexParams),
    };
    const newSegments: DrillSegment[] = [vertSeg];

    if (initialLatticeKm > 0) {
      newSegments.push({
        id: 'Initial Lattice',
        drilledYear: 0,
        lengthKm: initialLatticeKm,
        isVertical: false,
        activeYieldKm: initialLatticeKm,
        diameterM: BORE_DIAMETER_M,
        costs: calculateCAPEX(initialLatticeKm, false, config.capexParams),
      });
    }

    setSegments(newSegments);
    setInterventions([]);
    const result = runSimulation(newSegments, [], pendingSite.multiplier, config.opexParams);
    setSimResult(result);
    setShowDashboard(true);
  }, [pendingSite, initialLatticeKm, config]);

  const cancelDrill = useCallback(() => {
    setShowModal(false);
    if (mapRef.current && markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
  }, []);

  const closeDashboard = useCallback(() => {
    setShowDashboard(false);
    if (mapRef.current && markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
  }, []);

  const handleReam = useCallback(() => {
    if (!activeSite) return;
    if (interventions.some((i) => i.year === interventionYear)) {
      alert('Only one intervention allowed per year.');
      return;
    }
    const inv = applyReam(segments, interventions, interventionYear, config.capexParams);
    if (!inv) {
      alert('All boreholes at max diameter. Drill a new lateral.');
      return;
    }
    const newInts = [...interventions, inv].sort((a, b) => a.year - b.year);
    setInterventions(newInts);
    const result = runSimulation(segments, newInts, activeSite.multiplier, config.opexParams);
    setSimResult(result);
  }, [segments, interventions, interventionYear, activeSite, config]);

  const handleLateral = useCallback(() => {
    if (!activeSite) return;
    if (interventions.some((i) => i.year === interventionYear)) {
      alert('Only one intervention allowed per year.');
      return;
    }
    if (lateralKmInput <= 0) return;
    const newSeg: DrillSegment = {
      id: `Lateral ${segments.length}`,
      drilledYear: interventionYear,
      lengthKm: lateralKmInput,
      isVertical: false,
      activeYieldKm: lateralKmInput,
      diameterM: BORE_DIAMETER_M,
      costs: calculateCAPEX(lateralKmInput, false, config.capexParams),
    };
    const newSegs = [...segments, newSeg];
    const newInts = [
      ...interventions,
      { year: interventionYear, type: 'lateral' as const, targetId: newSeg.id, costs: newSeg.costs },
    ].sort((a, b) => a.year - b.year);
    setSegments(newSegs);
    setInterventions(newInts);
    const result = runSimulation(newSegs, newInts, activeSite.multiplier, config.opexParams);
    setSimResult(result);
  }, [segments, interventions, interventionYear, lateralKmInput, activeSite, config]);

  const handleReset = useCallback(() => {
    if (!pendingSite) return;
    confirmDrill();
  }, [pendingSite, confirmDrill]);

  return (
    <div className="relative w-full h-full">
      {/* Map */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      {/* Title Box */}
      <div className="absolute top-4 left-12 z-[1000] bg-gray-900/90 backdrop-blur border border-gray-700 p-4 rounded-xl shadow-2xl max-w-sm pointer-events-auto">
        <h2 className="m-0 text-lg font-bold text-orange-500 uppercase tracking-wide flex items-center gap-2">
          {config.regionFlag} Lithospheric Reactor
        </h2>
        <p className="mt-1 text-xs text-gray-400 leading-relaxed">
          Targeting Geologic Hydrogen & Abiotic Hydrocarbons: Overlap of Source (Ultramafic), Heat, and Seal.
        </p>
        <div className="mt-3 bg-orange-500/20 border border-orange-500/50 text-orange-300 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
          <span className="text-lg">👆</span> Click anywhere on the map to evaluate site and drill.
        </div>
      </div>

      {/* Drill Config Modal */}
      {showModal && (
        <div className="absolute inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-orange-500 mb-2 flex items-center gap-2">
              <span>🎯</span> Target Depth Reached
            </h3>
            <div className="bg-gray-800 p-3 rounded border border-gray-700 mb-4 text-sm">
              {pendingSite?.actualTemp && pendingSite.actualTemp < 250 ? (
                <>
                  <span className="text-red-400 font-bold">⚠️ Cold Region:</span> Maximum drillable depth cannot reach the optimal 250°C reaction temperature.
                  <div className="mt-2 text-white font-bold text-xl">{modalDepthText}</div>
                  <div className="text-red-400">Bottom-Hole Temp: {pendingSite.actualTemp.toFixed(0)}°C</div>
                </>
              ) : (
                <>
                  To reach the critical <b>250°C</b> reaction temperature, drill to:
                  <span className="block text-2xl font-bold text-white mt-1">{modalDepthText}</span>
                </>
              )}
            </div>

            <label className="block text-sm font-semibold text-gray-300 mb-2">Year 1 Lattice Formation (km):</label>
            <p className="text-xs text-gray-500 mb-2">Kilometers of lateral drilling in source rock to increase surface area.</p>
            <div className="flex items-center gap-3 mb-6">
              <input
                type="number"
                value={initialLatticeKm}
                onChange={(e) => setInitialLatticeKm(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white text-lg focus:border-orange-500 focus:outline-none"
                min={0}
                step={0.1}
              />
              <span className="text-gray-400 font-bold">km</span>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={cancelDrill} className="px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={confirmDrill} className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-lg transition-transform hover:-translate-y-0.5">
                Commence Drilling
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulation Dashboard */}
      {activeSite && simResult && (
        <SimulatorDashboard
          visible={showDashboard}
          regionFlag={config.regionFlag}
          activeSite={activeSite}
          simResult={simResult}
          segments={segments}
          interventions={interventions}
          interventionYear={interventionYear}
          lateralKmInput={lateralKmInput}
          onYearChange={setInterventionYear}
          onLateralKmChange={setLateralKmInput}
          onReam={handleReam}
          onLateral={handleLateral}
          onReset={handleReset}
          onClose={closeDashboard}
        />
      )}
    </div>
  );
};

export default LithographicSimulatorMap;
