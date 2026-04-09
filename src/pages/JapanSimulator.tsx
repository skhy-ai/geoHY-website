import React from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import LithographicSimulatorMap from '@/components/simulator/LithographicSimulatorMap';
import SimulatorAuthWrapper from '@/components/simulator/SimulatorAuthWrapper';
import type { SimulatorConfig } from '@/components/simulator/LithographicSimulatorMap';
import {
  ultramaficPolygons,
  mudstoneBasins,
  accretionaryPrisms,
  heatContours,
  faultData,
  geothermalWells,
  MAP_CENTER,
  MAP_ZOOM,
  CAPEX_PARAMS,
  OPEX_PARAMS,
  DEFAULT_HEAT,
  MAX_DRILL_DEPTH_KM,
} from '@/data/simulator/japan-geology';
import { isPointInPoly } from '@/lib/simulatorPhysics';

// Merge mudstone + accretionary prisms as "seal" polygons
const japanSealPolygons = [...mudstoneBasins, ...accretionaryPrisms];

// Japan-specific heat resolver uses gradient field
const resolveJapanHeat = (lat: number, lng: number) => {
  let heat = { ...DEFAULT_HEAT };
  heatContours.forEach((zone) => {
    if (isPointInPoly(lat, lng, zone.coords)) heat = zone;
  });
  return heat;
};

// Japan additional layers: fault lines and geothermal wells
const addJapanLayers = (map: L.Map) => {
  const faultLayer = L.layerGroup().addTo(map);
  faultData.forEach((fault) => {
    const isTransmissive = fault.type === 'transmissive';
    L.polyline(fault.path as [number, number][], {
      color: isTransmissive ? '#facc15' : '#ffffff',
      weight: isTransmissive ? 3 : 4,
      opacity: 0.9,
      dashArray: isTransmissive ? '10, 10' : undefined,
    })
      .on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        L.popup()
          .setLatLng(e.latlng)
          .setContent(`<b>${fault.name}</b><br>Type: ${isTransmissive ? 'Transmissive (Conduit)' : 'Sealed (Trap)'}<br>${fault.desc}`)
          .openOn(map);
      })
      .addTo(faultLayer);
  });

  const wellsLayer = L.layerGroup().addTo(map);
  geothermalWells.forEach((well) => {
    L.circleMarker([well.lat, well.lng], {
      radius: 6, fillColor: '#0ea5e9', color: '#0284c7', weight: 2, opacity: 1, fillOpacity: 0.8,
    })
      .on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        L.popup()
          .setLatLng(e.latlng)
          .setContent(`<b>🏭 ${well.name}</b><br>Depth: ${well.depth} km<br><i>${well.desc}</i>`)
          .openOn(map);
      })
      .addTo(wellsLayer);
  });
};

const japanConfig: SimulatorConfig = {
  mapCenter: MAP_CENTER,
  mapZoom: MAP_ZOOM,
  regionLabel: 'Japan',
  regionFlag: '🇯🇵',
  defaultHeat: DEFAULT_HEAT,
  capexParams: CAPEX_PARAMS,
  opexParams: OPEX_PARAMS,
  ultramaficPolygons,
  sealPolygons: japanSealPolygons,
  heatContours: heatContours as any,
  maxDrillDepthKm: MAX_DRILL_DEPTH_KM,
  resolveHeat: resolveJapanHeat,
  additionalLayers: addJapanLayers,
};

const JapanSimulator: React.FC = () => {
  return (
    <SimulatorAuthWrapper>
      <div className="h-screen w-screen relative overflow-hidden bg-gray-950 text-gray-200" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1100] flex items-center gap-2 bg-gray-900/90 backdrop-blur border border-gray-700 rounded-full px-4 py-2 shadow-xl">
        <span className="text-xs text-gray-400 mr-1">Region:</span>
        <Link to="/simulator" className="px-3 py-1 rounded-full text-xs font-bold text-gray-300 hover:bg-gray-700 transition-colors">🇺🇸 United States</Link>
        <Link to="/simulator/indonesia" className="px-3 py-1 rounded-full text-xs font-bold text-gray-300 hover:bg-gray-700 transition-colors">🇮🇩 Indonesia</Link>
        <Link to="/simulator/japan" className="px-3 py-1 rounded-full text-xs font-bold bg-orange-600 text-white">🇯🇵 Japan</Link>
      </div>
      {/* Seismic warning banner for Japan */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1100] bg-amber-900/80 border border-amber-600/60 text-amber-200 text-xs px-4 py-2 rounded-lg max-w-lg text-center shadow">
        ⚠️ <b>Induced Seismicity Risk</b>: Fluid injection in island arc crust requires strict microseismic monitoring. Keep injection pressures below the local fracturing threshold.
      </div>
      <LithographicSimulatorMap config={japanConfig} />
      </div>
    </SimulatorAuthWrapper>
  );
};

export default JapanSimulator;
