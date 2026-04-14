import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

const IndonesiaSimulator: React.FC = () => {
  const { t } = useTranslation();

  const indonesiaConfig: SimulatorConfig = {
    mapCenter: MAP_CENTER,
    mapZoom: MAP_ZOOM,
    regionLabel: t('simulator.id'),
    regionFlag: '🇮🇩',
    defaultHeat: DEFAULT_HEAT,
    capexParams: CAPEX_PARAMS,
    opexParams: OPEX_PARAMS,
    ultramaficPolygons,
    sealPolygons,
    heatContours,
  };

  return (
    <SimulatorAuthWrapper>
      <div className="h-screen w-screen relative overflow-hidden bg-background text-foreground">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1100] flex items-center gap-2 bg-card/90 backdrop-blur border border-border rounded-full px-4 py-2 shadow-xl">
          <span className="text-xs text-muted-foreground mr-1">{t('simulator.region')}:</span>
          <Link to="/simulator" className="px-3 py-1 rounded-full text-xs font-bold text-muted-foreground hover:bg-muted transition-colors">🇺🇸 {t('simulator.us')}</Link>
          <Link to="/simulator/indonesia" className="px-3 py-1 rounded-full text-xs font-bold bg-geo-orange text-white">🇮🇩 {t('simulator.id')}</Link>
          <Link to="/simulator/japan" className="px-3 py-1 rounded-full text-xs font-bold text-muted-foreground hover:bg-muted transition-colors">🇯🇵 {t('simulator.jp')}</Link>
        </div>
        <LithographicSimulatorMap config={indonesiaConfig} />
      </div>
    </SimulatorAuthWrapper>
  );
};

export default IndonesiaSimulator;
