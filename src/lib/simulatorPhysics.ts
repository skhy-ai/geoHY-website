// Shared physics engine for all three Lithographic Reactor Simulators
// Ported from _html-legacy simulator JavaScript

export interface CAPEXParams {
  monthsPerKm: number;
  personnelPerMonth: number;
  travelPerMonth: number;
  equipmentVertical: number;
  equipmentLateral: number;
  suppliesPerKm: number;
  contractualVertical: number;
  contractualLateral: number;
}

export interface OPEXParams {
  personnelBase: number;
  personnelPerKm: number;
  suppliesPerKm: number;
  travelFixed: number;
  contractualFixed: number;
}

export interface DrillSegment {
  id: string;
  drilledYear: number;
  lengthKm: number;
  isVertical: boolean;
  activeYieldKm: number;
  diameterM: number;
  costs: CostBreakdown;
}

export interface CostBreakdown {
  personnel: number;
  travel: number;
  equipment: number;
  supplies: number;
  contractual: number;
  total: number;
  months: number;
}

export interface Intervention {
  year: number;
  type: 'ream' | 'lateral';
  targetId: string;
  newDiameter?: number;
  costs: CostBreakdown;
}

export interface SimulationResult {
  yearlyYield: number[];
  totalVolumeMm3: number;
  hy10Tonnes: number;
  capex: { eq: number; sup: number; per: number; trv: number; con: number; total: number; months: number };
  opex: { per: number; sup: number; trv: number; con: number; total: number };
  totex: number;
  costPerTonne: number;
  avgDecayRate: number;
}

export const SIM_YEARS = 30;
export const BORE_DIAMETER_M = 0.216;
export const MAX_BORE_DIAMETER_M = 0.450;
export const BASE_RATE_STP = 1.2;
export const BASE_DECAY_K = 0.18;

export function calculateCAPEX(
  lengthKm: number,
  isVertical: boolean,
  params: CAPEXParams
): CostBreakdown {
  const months = lengthKm * params.monthsPerKm;
  const personnelCost = months * params.personnelPerMonth;
  const travelCost = months * params.travelPerMonth;
  const equipmentCost = isVertical ? params.equipmentVertical : params.equipmentLateral;
  const suppliesCost = lengthKm * params.suppliesPerKm;
  const contractualCost = isVertical ? params.contractualVertical : params.contractualLateral;
  return {
    personnel: personnelCost,
    travel: travelCost,
    equipment: equipmentCost,
    supplies: suppliesCost,
    contractual: contractualCost,
    total: personnelCost + travelCost + equipmentCost + suppliesCost + contractualCost,
    months,
  };
}

export function calculateAnnualOPEX(activeKm: number, params: OPEXParams) {
  const personnel = params.personnelBase + params.personnelPerKm * activeKm;
  const supplies = params.suppliesPerKm * activeKm;
  const travel = params.travelFixed;
  const contractual = params.contractualFixed;
  return { personnel, supplies, travel, contractual, total: personnel + supplies + travel + contractual };
}

export function isPointInPoly(lat: number, lng: number, coords: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
    const xi = coords[i][0], yi = coords[i][1];
    const xj = coords[j][0], yj = coords[j][1];
    const intersect = yi > lng !== yj > lng && lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function calculateSegmentYield(
  segment: DrillSegment,
  year: number,
  interventions: Intervention[],
  currentMultiplier: number
): { yield: number; decay: number } {
  if (year < segment.drilledYear) return { yield: 0, decay: 0 };

  let lastReamYear = segment.drilledYear;
  let currentDiameter = segment.diameterM;

  interventions.forEach((inv) => {
    if (inv.type === 'ream' && inv.targetId === segment.id && inv.year <= year) {
      lastReamYear = inv.year;
      currentDiameter = inv.newDiameter!;
    }
  });

  const effectiveAge = year - lastReamYear;
  const activeAreaM2 = Math.PI * currentDiameter * (segment.activeYieldKm * 1000);
  const dynamicDecayK = BASE_DECAY_K * Math.sqrt(BORE_DIAMETER_M / currentDiameter);
  const hourlyYieldSTP =
    BASE_RATE_STP * currentMultiplier * (activeAreaM2 / 100) * Math.exp(-dynamicDecayK * effectiveAge);

  return { yield: hourlyYieldSTP, decay: dynamicDecayK };
}

export function runSimulation(
  segments: DrillSegment[],
  interventions: Intervention[],
  currentMultiplier: number,
  opexParams: OPEXParams
): SimulationResult {
  const yearlyYield: number[] = [];
  let totalVolumeM3 = 0;
  let totalCapex = { eq: 0, sup: 0, per: 0, trv: 0, con: 0, total: 0, months: 0 };
  let totalOpex = { per: 0, sup: 0, trv: 0, con: 0, total: 0 };
  let currentAvgDecay = 0;

  segments.forEach((seg) => {
    totalCapex.eq += seg.costs.equipment;
    totalCapex.sup += seg.costs.supplies;
    totalCapex.per += seg.costs.personnel;
    totalCapex.trv += seg.costs.travel;
    totalCapex.con += seg.costs.contractual;
    totalCapex.total += seg.costs.total;
    totalCapex.months += seg.costs.months;
  });

  interventions.forEach((inv) => {
    totalCapex.eq += inv.costs.equipment;
    totalCapex.sup += inv.costs.supplies;
    totalCapex.per += inv.costs.personnel;
    totalCapex.trv += inv.costs.travel;
    totalCapex.con += inv.costs.contractual;
    totalCapex.total += inv.costs.total;
    totalCapex.months += inv.costs.months;
  });

  for (let y = 0; y <= SIM_YEARS; y++) {
    let yearYieldHr = 0;
    let activeKmThisYear = 0;
    let yearDecaySum = 0;
    let activeCount = 0;

    segments.forEach((seg) => {
      const result = calculateSegmentYield(seg, y, interventions, currentMultiplier);
      yearYieldHr += result.yield;
      if (y >= seg.drilledYear && seg.activeYieldKm > 0) {
        activeKmThisYear += seg.activeYieldKm;
        yearDecaySum += result.decay;
        activeCount++;
      }
    });

    yearlyYield.push(yearYieldHr);
    totalVolumeM3 += yearYieldHr * 24 * 365;

    if (y === SIM_YEARS && activeCount > 0) {
      currentAvgDecay = yearDecaySum / activeCount;
    }

    if (y > 0) {
      const yrOpex = calculateAnnualOPEX(activeKmThisYear, opexParams);
      totalOpex.per += yrOpex.personnel;
      totalOpex.sup += yrOpex.supplies;
      totalOpex.trv += yrOpex.travel;
      totalOpex.con += yrOpex.contractual;
      totalOpex.total += yrOpex.total;
    }
  }

  const h2MassKg = totalVolumeM3 * 0.10 * 0.08988;
  const ch4MassKg = totalVolumeM3 * 0.90 * 0.7174;
  const hy10Tonnes = (h2MassKg + ch4MassKg) / 1000;
  const totex = totalCapex.total + totalOpex.total;
  const costPerTonne = hy10Tonnes > 0 ? totex / hy10Tonnes : 0;

  return {
    yearlyYield,
    totalVolumeMm3: totalVolumeM3 / 1e6,
    hy10Tonnes,
    capex: totalCapex,
    opex: totalOpex,
    totex,
    costPerTonne,
    avgDecayRate: currentAvgDecay,
  };
}

export function applyReam(
  segments: DrillSegment[],
  interventions: Intervention[],
  year: number,
  capexParams: CAPEXParams
): Intervention | null {
  for (let i = segments.length - 1; i >= 0; i--) {
    const seg = segments[i];
    if (seg.drilledYear <= year && seg.activeYieldKm > 0) {
      let d = seg.diameterM;
      interventions.forEach((inv) => {
        if (inv.type === 'ream' && inv.targetId === seg.id && inv.year <= year) d = inv.newDiameter!;
      });
      if (d < MAX_BORE_DIAMETER_M - 0.001) {
        const newD = Math.min(d + 0.05, MAX_BORE_DIAMETER_M);
        let reamCosts = calculateCAPEX(seg.lengthKm, false, capexParams);
        reamCosts = { ...reamCosts, equipment: reamCosts.equipment * 0.1, supplies: reamCosts.supplies * 0.2 };
        reamCosts.total = reamCosts.equipment + reamCosts.supplies + reamCosts.personnel + reamCosts.travel + reamCosts.contractual;
        return { year, type: 'ream', targetId: seg.id, newDiameter: newD, costs: reamCosts };
      }
    }
  }
  return null;
}
