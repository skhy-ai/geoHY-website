import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import LithographicSimulatorMap from '@/components/simulator/LithographicSimulatorMap';

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

const JapanSimulator: React.FC = () => {
  const { t } = useTranslation();

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
        color: isTransmissive ? '#facc15' : 'currentColor',
        weight: isTransmissive ? 3 : 4,
        opacity: 0.9,
        dashArray: isTransmissive ? '10, 10' : undefined,
      })
        .on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          L.popup()
            .setLatLng(e.latlng)
            .setContent(`<b>${fault.name}</b><br>${t('simulator.fault_type')}: ${isTransmissive ? t('simulator.fault_conduit') : t('simulator.fault_trap')}<br>${fault.desc}`)
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
            .setContent(`<b>🏭 ${well.name}</b><br>${t('simulator.well_depth')}: ${well.depth} km<br><i>${well.desc}</i>`)
            .openOn(map);
        })
        .addTo(wellsLayer);
    });
  };

  const japanConfig: SimulatorConfig = {
    mapCenter: MAP_CENTER,
    mapZoom: MAP_ZOOM,
    regionLabel: t('simulator.jp'),
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

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-background text-foreground">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1100] flex items-center gap-2 bg-card/90 backdrop-blur border border-border rounded-full px-4 py-2 shadow-xl">
        <span className="text-xs text-muted-foreground mr-1">{t('simulator.region')}:</span>
        <Link to="/simulator" className="px-3 py-1 rounded-full text-xs font-bold text-muted-foreground hover:bg-muted transition-colors">🇺🇸 {t('simulator.us')}</Link>
        <Link to="/simulator/indonesia" className="px-3 py-1 rounded-full text-xs font-bold text-muted-foreground hover:bg-muted transition-colors">🇮🇩 {t('simulator.id')}</Link>
        <Link to="/simulator/japan" className="px-3 py-1 rounded-full text-xs font-bold bg-geo-orange text-white">🇯🇵 {t('simulator.jp')}</Link>
      </div>
      
      {/* Seismic warning banner for Japan */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1100] bg-amber-500/10 backdrop-blur-md border border-amber-500/50 text-amber-600 dark:text-amber-400 text-xs px-4 py-2 rounded-lg max-w-lg text-center shadow-lg">
        ⚠️ <b>{t('simulator.seismic_warning')}</b>
      </div>
      
      <LithographicSimulatorMap config={japanConfig} />
    </div>
  );
};

export default JapanSimulator;
