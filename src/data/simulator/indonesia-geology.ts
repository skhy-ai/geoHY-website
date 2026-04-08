// Indonesia geology data for the Lithographic Reactor Simulator
// Source: Ported from _html-legacy/hy10 lithographic simulator - indonesia.html

export { CAPEX_PARAMS, OPEX_PARAMS } from './us-geology';
export type { GeoPolygon, HeatContour } from './us-geology';

export const MAP_CENTER: [number, number] = [-2.5, 118.0];
export const MAP_ZOOM = 5;
export const REGION_LABEL = "Indonesia";
export const REGION_FLAG = "🇮🇩";
export const SEAL_LABEL = "Salt / Shale Basin";
export const DEFAULT_HEAT = { val: 55, desc: "Regional Avg" };

import type { GeoPolygon, HeatContour } from './us-geology';
import { ultramaficPolygons as usUltramafic, saltBasinPolygons as usSalt, shaleBasins as usShale, heatContours as usHeat } from './us-geology';

const indonesiaUltramafic: GeoPolygon[] = [
  { name: "East Sulawesi Ophiolite", coords: [[-0.5, 120.5], [0.5, 121.0], [0.8, 121.5], [0.5, 122.0], [-0.5, 122.2], [-1.0, 121.5], [-2.0, 121.3], [-2.5, 121.8], [-3.0, 122.2], [-3.5, 122.0], [-2.8, 121.0], [-2.0, 120.5], [-1.0, 120.2]] },
  { name: "Halmahera Basement", coords: [[1.8, 127.8], [1.5, 128.0], [1.0, 128.0], [0.5, 128.2], [0.0, 128.0], [0.2, 127.6], [0.8, 127.5], [1.2, 127.5], [1.5, 127.4]] },
  { name: "Papua Ophiolite Belt", coords: [[-2.0, 137.0], [-2.5, 138.0], [-2.8, 139.0], [-3.2, 140.0], [-3.5, 141.0], [-3.0, 141.0], [-2.5, 140.0], [-2.0, 139.0], [-1.5, 138.0]] },
  { name: "Meratus Mountains", coords: [[-2.5, 115.6], [-3.0, 115.5], [-3.5, 115.3], [-4.0, 115.0], [-3.8, 115.5], [-3.2, 115.8], [-2.6, 115.9]] },
];

const indonesiaShales: GeoPolygon[] = [
  { name: "Kutai Basin", coords: [[1.0, 117.0], [0.5, 117.5], [-0.5, 117.6], [-1.2, 117.2], [-1.5, 116.8], [-1.5, 116.0], [-0.5, 115.8], [0.5, 116.0], [1.0, 116.5]] },
  { name: "South Sumatra Basin", coords: [[-1.5, 103.5], [-2.0, 104.0], [-3.0, 104.8], [-4.0, 105.0], [-4.5, 104.5], [-3.5, 103.0], [-2.5, 102.5], [-1.8, 103.0]] },
  { name: "Tarakan Basin", coords: [[4.2, 117.0], [3.8, 117.5], [3.2, 117.8], [2.8, 117.5], [2.5, 117.0], [3.0, 116.6], [3.5, 116.5], [4.0, 116.8]] },
  { name: "Bintuni Basin", coords: [[-1.8, 132.5], [-2.2, 133.5], [-2.5, 134.0], [-2.8, 133.8], [-2.6, 133.0], [-2.2, 132.2], [-1.9, 132.0]] },
];

const indonesiaHeat: HeatContour[] = [
  { val: 105, desc: "Sumatra Fault Zone", coords: [[5.5, 95.3], [4.5, 96.0], [3.5, 97.2], [2.0, 98.8], [0.5, 100.2], [-1.0, 101.5], [-2.5, 102.8], [-4.0, 104.0], [-5.5, 105.0], [-6.0, 104.5], [-4.5, 103.2], [-3.0, 102.0], [-1.5, 100.5], [0.0, 99.0], [1.5, 97.5], [3.0, 96.2], [4.5, 95.0]] },
  { val: 105, desc: "Java Volcanic Arc", coords: [[-6.5, 105.5], [-7.2, 107.0], [-7.5, 108.5], [-7.8, 110.0], [-8.0, 111.5], [-8.2, 113.0], [-8.5, 114.5], [-8.0, 114.5], [-7.5, 113.0], [-7.2, 111.5], [-7.0, 110.0], [-6.8, 108.5], [-6.5, 107.0], [-6.0, 105.5]] },
  { val: 80, desc: "Sulawesi Fracture Zone", coords: [[1.2, 119.8], [0.5, 119.5], [-0.5, 119.2], [-1.5, 119.5], [-2.5, 119.8], [-3.5, 120.0], [-4.5, 120.2], [-5.5, 120.0], [-5.2, 119.5], [-4.2, 119.2], [-3.2, 119.0], [-2.2, 118.8], [-1.2, 118.8], [-0.2, 119.0], [0.8, 119.2]] },
  { val: 65, desc: "Banda Arc Regional", coords: [[-8.5, 115.0], [-8.8, 116.5], [-9.0, 118.0], [-9.5, 120.0], [-10.2, 122.0], [-10.5, 124.0], [-9.8, 125.5], [-8.5, 127.0], [-7.5, 128.5], [-6.5, 130.0], [-5.5, 131.0], [-5.0, 129.5], [-6.0, 128.0], [-7.0, 126.5], [-8.0, 125.0], [-8.8, 123.5], [-9.2, 122.0], [-8.5, 120.0], [-8.2, 118.0], [-8.0, 116.5], [-8.0, 115.0]] },
];

// Indonesia combines US + Indonesia specific data
export const ultramaficPolygons: GeoPolygon[] = [...usUltramafic, ...indonesiaUltramafic];
export const saltBasinPolygons: GeoPolygon[] = usSalt;
export const shaleBasins: GeoPolygon[] = [...usShale, ...indonesiaShales];
export const heatContours: HeatContour[] = [...usHeat, ...indonesiaHeat];
export const sealPolygons: GeoPolygon[] = [...saltBasinPolygons, ...shaleBasins];
