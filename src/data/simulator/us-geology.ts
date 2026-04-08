// US geology data for the Lithographic Reactor Simulator
// Source: Ported from _html-legacy/hy10 Lithographic simulator.html

export interface GeoPolygon {
  name: string;
  coords: [number, number][];
}

export interface HeatContour {
  val: number;
  desc: string;
  coords: [number, number][];
}

export const MAP_CENTER: [number, number] = [39.8283, -98.5795];
export const MAP_ZOOM = 4;
export const REGION_LABEL = "US";
export const REGION_FLAG = "🇺🇸";
export const SEAL_LABEL = "Salt Seal / Shale Basin";
export const DEFAULT_HEAT = { val: 55, desc: "Continental Avg" };
export const CAPEX_PARAMS = {
  monthsPerKm: 1.5,
  personnelPerMonth: 16000,
  travelPerMonth: 3750,
  equipmentVertical: 1098775,
  equipmentLateral: 85000,
  suppliesPerKm: 150000,
  contractualVertical: 178800,
  contractualLateral: 25000,
};
export const OPEX_PARAMS = {
  personnelBase: 185000,
  personnelPerKm: 30000,
  suppliesPerKm: 147000,
  travelFixed: 44622,
  contractualFixed: 75000,
};

export const ultramaficPolygons: GeoPolygon[] = [
  { name: "Klamath Mountains", coords: [[42.9, -124.2], [42.9, -123.2], [42.5, -123.0], [42.0, -123.5], [41.5, -123.8], [41.2, -122.8], [40.8, -122.8], [40.5, -123.5], [41.0, -124.2], [42.0, -124.5]] },
  { name: "Twin Sisters Dunite", coords: [[48.65, -122.05], [48.75, -121.95], [48.75, -121.85], [48.65, -121.85], [48.60, -121.95]] },
  { name: "Coast Range Ophiolite", coords: [[39.8, -123.8], [39.5, -123.0], [39.0, -122.3], [38.5, -122.2], [38.2, -122.5], [38.8, -123.5], [39.5, -124.0]] },
  { name: "New Idria", coords: [[36.45, -120.75], [36.40, -120.60], [36.30, -120.55], [36.35, -120.45], [36.50, -120.65], [36.55, -120.80]] },
  { name: "Sierra Nevada", coords: [[40.2, -121.6], [39.8, -121.2], [39.0, -121.0], [38.0, -120.6], [37.5, -120.2], [37.0, -119.8], [37.2, -120.5], [38.5, -121.2], [39.5, -121.8]] },
  { name: "Riggins Terrane", coords: [[45.8, -116.8], [45.8, -116.4], [45.4, -116.2], [45.0, -116.3], [44.8, -116.6], [45.2, -116.9]] },
  { name: "State Line Kimberlite", coords: [[41.1, -105.8], [41.2, -105.5], [41.0, -105.3], [40.8, -105.5], [40.8, -105.8], [41.0, -106.0]] },
  { name: "Powderhorn Complex", coords: [[38.35, -107.18], [38.35, -107.05], [38.20, -107.05], [38.15, -107.18], [38.25, -107.25]] },
  { name: "South Pass", coords: [[42.7, -109.0], [42.7, -108.5], [42.5, -108.3], [42.3, -108.5], [42.3, -108.8], [42.5, -109.1]] },
  { name: "Coal Creek", coords: [[30.8, -98.75], [30.8, -98.60], [30.7, -98.55], [30.6, -98.65], [30.65, -98.80]] },
  { name: "Vermont Serpentinites", coords: [[45.0, -72.2], [44.8, -72.4], [44.5, -72.6], [44.0, -72.8], [43.5, -72.7], [44.2, -72.3], [44.8, -72.0]] },
  { name: "State Line (PA/MD)", coords: [[39.80, -76.30], [39.75, -76.10], [39.70, -76.05], [39.65, -76.20], [39.70, -76.40]] },
  { name: "Baltimore Mafic", coords: [[39.65, -76.80], [39.50, -76.50], [39.35, -76.40], [39.30, -76.60], [39.45, -76.90]] },
  { name: "Blue Ridge Belt", coords: [[36.2, -81.8], [35.8, -82.2], [35.5, -82.8], [35.0, -83.5], [35.2, -83.8], [35.8, -83.0], [36.0, -82.0]] },
  { name: "Mid-Continent Rift", coords: [[47.5, -92.5], [46.8, -91.0], [46.5, -90.0], [46.8, -89.0], [47.5, -90.5], [48.0, -92.0]] },
];

export const saltBasinPolygons: GeoPolygon[] = [
  { name: "Gulf Coast Basin", coords: [[33.0, -95.0], [32.5, -91.0], [31.0, -88.0], [29.0, -88.5], [28.0, -90.0], [27.0, -94.0], [26.0, -97.0], [27.0, -98.5], [29.0, -98.0], [31.0, -97.0]] },
  { name: "Paradox Basin", coords: [[39.2, -110.5], [38.8, -108.8], [38.2, -108.2], [37.2, -109.0], [37.2, -110.5], [38.0, -111.0]] },
  { name: "Michigan Basin", coords: [[45.5, -85.0], [45.0, -83.0], [43.5, -82.5], [42.5, -83.0], [42.0, -85.0], [42.5, -86.5], [44.5, -86.5]] },
  { name: "Permian Basin", coords: [[33.5, -103.5], [33.0, -101.5], [31.5, -101.0], [31.0, -102.5], [31.5, -104.5], [32.5, -104.5]] },
];

export const shaleBasins: GeoPolygon[] = [
  { name: "Bakken", coords: [[49.0, -106.0], [49.2, -102.0], [48.5, -100.0], [46.5, -100.5], [46.0, -103.5], [47.0, -106.5], [48.0, -107.0]] },
  { name: "Marcellus", coords: [[43.0, -75.0], [42.0, -74.5], [41.0, -75.5], [39.0, -78.5], [37.5, -82.0], [38.5, -83.0], [40.0, -81.0], [41.5, -79.0], [42.5, -77.0]] },
  { name: "Wolfcamp", coords: [[33.8, -103.0], [33.5, -101.0], [32.0, -100.5], [30.5, -101.5], [30.5, -103.5], [31.5, -104.5], [32.5, -104.5]] },
  { name: "Eagle Ford", coords: [[30.5, -96.5], [29.5, -96.5], [28.5, -98.0], [28.0, -100.0], [28.5, -100.5], [29.5, -99.5], [30.0, -97.5]] },
  { name: "Woodford", coords: [[36.8, -99.5], [36.5, -97.0], [35.5, -96.5], [34.5, -97.5], [34.5, -99.0], [35.5, -100.0]] },
  { name: "Niobrara", coords: [[42.5, -105.0], [42.0, -102.5], [40.0, -103.0], [39.5, -104.5], [40.0, -105.5], [41.5, -105.5]] },
];

export const heatContours: HeatContour[] = [
  { val: 65, desc: "Western Regional Heat", coords: [[49.0, -125.0], [49.0, -114.0], [46.0, -112.0], [45.0, -108.0], [41.0, -105.0], [37.0, -104.0], [32.0, -105.0], [31.5, -108.0], [31.5, -114.0], [32.5, -116.0], [34.0, -121.0], [38.0, -123.0], [42.0, -124.5], [49.0, -125.0]] },
  { val: 65, desc: "Gulf Coast", coords: [[30.5, -97.0], [31.0, -94.0], [30.8, -91.0], [30.5, -89.0], [29.0, -89.0], [28.5, -91.0], [28.0, -94.0], [27.5, -97.0], [28.0, -99.0]] },
  { val: 80, desc: "Basin and Range", coords: [[44.5, -117.0], [43.5, -112.0], [42.5, -111.0], [41.0, -111.5], [39.0, -111.0], [37.0, -112.5], [36.0, -114.5], [35.5, -117.0], [36.5, -118.5], [38.5, -119.5], [41.0, -119.5], [42.5, -118.5]] },
  { val: 75, desc: "Rio Grande Rift", coords: [[39.0, -106.2], [38.0, -105.5], [37.0, -105.5], [36.0, -106.0], [34.0, -106.2], [32.0, -106.0], [31.8, -107.0], [33.0, -107.5], [35.0, -107.0], [37.0, -106.8]] },
  { val: 105, desc: "Yellowstone", coords: [[45.0, -111.2], [45.1, -110.0], [44.4, -109.8], [44.2, -111.0]] },
  { val: 105, desc: "Salton Sea", coords: [[33.8, -116.3], [33.5, -115.3], [32.6, -115.4], [32.9, -116.4]] },
  { val: 105, desc: "The Geysers", coords: [[39.1, -123.0], [38.9, -122.6], [38.7, -122.7], [38.8, -123.1]] },
  { val: 105, desc: "Valles Caldera", coords: [[36.0, -106.7], [36.0, -106.3], [35.8, -106.3], [35.8, -106.7]] },
];

// Seal polygons = salt + shale combined
export const sealPolygons = [...saltBasinPolygons, ...shaleBasins];
