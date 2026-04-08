import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import type { SimulationResult } from '@/lib/simulatorPhysics';
import type { DrillSegment, Intervention } from '@/lib/simulatorPhysics';
import { SIM_YEARS } from '@/lib/simulatorPhysics';

Chart.register(...registerables);

interface ActiveSite {
  lat: number;
  lng: number;
  source: { name: string } | null;
  seal: { name: string } | null;
  heat: { val: number; desc: string };
  depthKm: number;
  multiplier: number;
  actualTemp?: number;
}

interface Props {
  visible: boolean;
  regionFlag: string;
  activeSite: ActiveSite;
  simResult: SimulationResult;
  segments: DrillSegment[];
  interventions: Intervention[];
  interventionYear: number;
  lateralKmInput: number;
  onYearChange: (y: number) => void;
  onLateralKmChange: (km: number) => void;
  onReam: () => void;
  onLateral: () => void;
  onReset: () => void;
  onClose: () => void;
}

const fmt = (n: number) => `$${(n / 1000).toFixed(1)}k`;
const fmtM = (n: number) => `$${(n / 1e6).toFixed(2)}M`;

const SimulatorDashboard: React.FC<Props> = ({
  visible, regionFlag, activeSite, simResult,
  segments, interventions, interventionYear, lateralKmInput,
  onYearChange, onLateralKmChange, onReam, onLateral, onReset, onClose,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const pointRadii = new Array(SIM_YEARS + 1).fill(0);
    const pointColors = new Array(SIM_YEARS + 1).fill('#ea580c');
    interventions.forEach((inv) => {
      pointRadii[inv.year] = 5;
      pointColors[inv.year] = inv.type === 'ream' ? '#9ca3af' : '#9333ea';
    });

    if (chartInstanceRef.current) {
      chartInstanceRef.current.data.datasets[0].data = simResult.yearlyYield;
      (chartInstanceRef.current.data.datasets[0] as any).pointRadius = pointRadii;
      (chartInstanceRef.current.data.datasets[0] as any).pointBackgroundColor = pointColors;
      chartInstanceRef.current.update();
      return;
    }

    Chart.defaults.color = '#9ca3af';
    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: Array.from({ length: SIM_YEARS + 1 }, (_, i) => `Y${i}`),
        datasets: [{
          data: simResult.yearlyYield,
          borderColor: '#ea580c',
          backgroundColor: 'rgba(234, 88, 12, 0.15)',
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: pointRadii,
          pointBackgroundColor: pointColors,
          pointBorderColor: '#fff',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#374151' }, ticks: { maxTicksLimit: 5 } },
          x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
        },
      },
    });
  }, [simResult, interventions]);

  // Cleanup chart on unmount
  useEffect(() => {
    return () => {
      chartInstanceRef.current?.destroy();
      chartInstanceRef.current = null;
    };
  }, []);

  const downloadCSV = () => {
    const lines: string[][] = [];
    lines.push(['Lithospheric Reactor Simulation Report']);
    lines.push([]);
    lines.push(['Location and Geology']);
    lines.push(['Latitude', activeSite.lat.toFixed(4)]);
    lines.push(['Longitude', activeSite.lng.toFixed(4)]);
    lines.push(['Target Depth (km)', activeSite.depthKm.toFixed(2)]);
    lines.push(['Source Rock', activeSite.source?.name ?? 'Non-Ultramafic']);
    lines.push(['Seal Caprock', activeSite.seal?.name ?? 'None']);
    lines.push(['Heat Flow (mW/m2)', String(activeSite.heat.val)]);
    lines.push([]);
    lines.push(['Financial (USD)']);
    lines.push(['Total CAPEX', fmtM(simResult.capex.total)]);
    lines.push(['Total 30-Yr OPEX', fmtM(simResult.opex.total)]);
    lines.push(['Lifetime TOTEX', fmtM(simResult.totex)]);
    lines.push([]);
    lines.push(['Production (30 Years)']);
    lines.push(['Total Volume STP (Mm³)', simResult.totalVolumeMm3.toFixed(2)]);
    lines.push(['Total Hy10 Mass (Tonnes)', simResult.hy10Tonnes.toFixed(0)]);
    lines.push(['Cost per Tonne (USD)', simResult.costPerTonne.toFixed(0)]);

    const csv = lines.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Hy10_Sim_${activeSite.lat.toFixed(2)}_${activeSite.lng.toFixed(2)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`absolute top-4 right-4 bottom-8 w-[420px] z-[1000] bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl flex flex-col transition-transform duration-300 ease-out pointer-events-auto
        ${visible ? 'translate-x-0' : 'translate-x-[120%]'}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50 rounded-t-xl shrink-0">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          {regionFlag} Well Pad Simulator
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Site Context */}
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-sm">
          {[
            ['Target Depth (250°C)', `${activeSite.depthKm.toFixed(2)} km`, 'text-orange-400'],
            ['Reservoir Pressure', `${(activeSite.depthKm * 10).toFixed(0)} MPa`, 'text-blue-400'],
            ['Geology', activeSite.source?.name ?? 'Non-Ultramafic', activeSite.source ? 'text-orange-400' : 'text-gray-500'],
            ['Seal', activeSite.seal?.name ?? 'None (Leak Risk)', activeSite.seal ? 'text-purple-400' : 'text-red-500'],
          ].map(([label, value, cls]) => (
            <div key={label as string} className="flex justify-between mb-1 last:mb-0">
              <span className="text-gray-400">{label}:</span>
              <span className={`font-bold truncate max-w-[190px] text-right ${cls}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* CAPEX */}
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
          <h3 className="text-[10px] font-bold text-orange-400 uppercase mb-1 tracking-wider border-b border-gray-700 pb-1">
            Capital Expenditures (CAPEX)
          </h3>
          {[
            ['Rig & Equipment', fmt(simResult.capex.eq)],
            ['Drilling Supplies', fmt(simResult.capex.sup)],
            ['Personnel & Ops', fmt(simResult.capex.per)],
            ['Travel & Lodging', fmt(simResult.capex.trv)],
            ['Contractual (Permits)', fmt(simResult.capex.con)],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between text-[0.8rem] py-0.5 border-b border-gray-700/40 text-gray-300">
              <span>{label}</span>
              <span className="font-mono">{val}</span>
            </div>
          ))}
          <div className="flex justify-between text-[0.8rem] py-1 font-bold text-gray-200">
            <span>Total CAPEX</span>
            <span className="font-mono text-orange-400">{fmtM(simResult.capex.total)}</span>
          </div>
          <div className="text-[10px] text-gray-500 italic text-right mb-3">
            Drill Timeline: {simResult.capex.months.toFixed(1)} months
          </div>

          <h3 className="text-[10px] font-bold text-blue-400 uppercase mb-1 tracking-wider border-b border-gray-700 pb-1">
            30-Year OPEX
          </h3>
          {[
            ['Personnel (Ops/Maint)', fmt(simResult.opex.per)],
            ['Injection Supplies', fmt(simResult.opex.sup)],
            ['Contractual', fmt(simResult.opex.con)],
            ['Travel (Inspections)', fmt(simResult.opex.trv)],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between text-[0.8rem] py-0.5 border-b border-gray-700/40 text-gray-300">
              <span>{label}</span>
              <span className="font-mono">{val}</span>
            </div>
          ))}
          <div className="flex justify-between text-[0.8rem] py-1 font-bold text-gray-200">
            <span>Total 30-Yr OPEX</span>
            <span className="font-mono text-blue-400">{fmtM(simResult.opex.total)}</span>
          </div>

          <div className="mt-3 pt-2 border-t-2 border-gray-600 flex justify-between items-center">
            <span className="font-bold text-white text-sm uppercase tracking-wider">Lifetime TOTEX</span>
            <span className="font-bold text-green-400 font-mono text-lg">{fmtM(simResult.totex)}</span>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-3 gap-2">
          {[
            ['30-Yr Vol (STP)', `${simResult.totalVolumeMm3.toFixed(2)} Mm³`, 'text-white'],
            ['Total Hy10 Mass', `${simResult.hy10Tonnes.toFixed(0)} T`, 'text-orange-400'],
            ['Cost per Tonne', simResult.costPerTonne > 0 ? `$${simResult.costPerTonne.toFixed(0)}/T` : 'N/A', 'text-green-400'],
          ].map(([label, val, cls]) => (
            <div key={label as string} className="bg-gray-800 p-2 rounded-lg border border-gray-700 text-center">
              <span className="block text-[9px] text-gray-400 uppercase">{label}</span>
              <span className={`font-bold text-base ${cls}`}>{val}</span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-gray-800 rounded-lg p-2 border border-gray-700 h-40 relative">
          <canvas ref={chartRef} />
        </div>

        {/* Interventions */}
        <div className="pb-4">
          <div className="flex justify-between items-end mb-3 border-b border-gray-700 pb-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reservoir Interventions</h3>
            <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded border border-gray-600">
              Depletion: <span className="text-orange-400 font-bold">{(simResult.avgDecayRate * 100).toFixed(1)}%</span>/yr
            </span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <label className="text-gray-300">Execution Year:</label>
              <span className="text-orange-400 font-bold">Year {interventionYear}</span>
            </div>
            <input
              type="range" min={1} max={29} value={interventionYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="w-full appearance-none bg-gray-600 h-1 rounded cursor-pointer accent-orange-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={onReam}
              className="bg-gray-700 border border-gray-600 hover:border-gray-400 text-white text-xs font-bold py-2 px-3 rounded flex justify-between items-center transition-colors"
            >
              <span>Ream Active Bore (+5cm Ø)</span>
              <span className="text-gray-400 font-normal italic ml-2">Targets newest</span>
            </button>
            <div className="flex gap-2">
              <input
                type="number" value={lateralKmInput} min={0.1} step={0.1}
                onChange={(e) => onLateralKmChange(parseFloat(e.target.value) || 1)}
                className="w-20 bg-gray-800 border border-gray-600 rounded px-2 text-white text-sm focus:border-purple-500 focus:outline-none text-center"
              />
              <button
                onClick={onLateral}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2 px-3 rounded transition-colors shadow"
              >
                Drill New Lateral (km)
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={downloadCSV}
              className="flex-1 border border-blue-500/50 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-bold py-1.5 rounded transition-colors shadow flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
            <button
              onClick={onReset}
              className="flex-1 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold py-1.5 rounded transition-colors shadow"
            >
              Reset Well
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorDashboard;
