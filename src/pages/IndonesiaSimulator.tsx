import React from 'react';
import { Link } from 'react-router-dom';
import LithographicSimulatorMap from '@/components/simulator/LithographicSimulatorMap';
import SimulatorAuthWrapper from '@/components/simulator/SimulatorAuthWrapper';
import type { SimulatorConfig } from '@/components/simulator/LithographicSimulatorMap';
import {
  ultramaficPolygons,
  sealPolygons,
  heatContours,
  MAP_CENTER,
  MAP_ZOOM,
  CAPEX_PARAMS,
  OPEX_PARAMS,
  DEFAULT_HEAT,
} from '@/data/simulator/indonesia-geology';

const indonesiaConfig: SimulatorConfig = {
  mapCenter: MAP_CENTER,
  mapZoom: MAP_ZOOM,
  regionLabel: 'Indonesia',
  regionFlag: '🇮🇩',
  defaultHeat: DEFAULT_HEAT,
  capexParams: CAPEX_PARAMS,
  opexParams: OPEX_PARAMS,
  ultramaficPolygons,
  sealPolygons,
  heatContours,
};

const IndonesiaSimulator: React.FC = () => {
  return (
    <SimulatorAuthWrapper>
      <div className="h-screen w-screen relative overflow-hidden bg-gray-950 text-gray-200" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1100] flex items-center gap-2 bg-gray-900/90 backdrop-blur border border-gray-700 rounded-full px-4 py-2 shadow-xl">
        <span className="text-xs text-gray-400 mr-1">Region:</span>
        <Link to="/simulator" className="px-3 py-1 rounded-full text-xs font-bold text-gray-300 hover:bg-gray-700 transition-colors">🇺🇸 United States</Link>
        <Link to="/simulator/indonesia" className="px-3 py-1 rounded-full text-xs font-bold bg-orange-600 text-white">🇮🇩 Indonesia</Link>
        <Link to="/simulator/japan" className="px-3 py-1 rounded-full text-xs font-bold text-gray-300 hover:bg-gray-700 transition-colors">🇯🇵 Japan</Link>
      </div>
      <LithographicSimulatorMap config={indonesiaConfig} />
      </div>
    </SimulatorAuthWrapper>
  );
};

export default IndonesiaSimulator;
