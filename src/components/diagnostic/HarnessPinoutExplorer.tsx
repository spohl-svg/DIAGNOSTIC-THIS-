import React, { useState } from 'react';
import { useRideWire } from '../../context/RideWireContext';
import {
  Layers,
  Zap,
  Info,
  CheckCircle,
  AlertCircle,
  Cpu,
  ChevronRight,
  Maximize2,
  Sliders,
} from 'lucide-react';
import { WireCircuit } from '../../types';

export const HarnessPinoutExplorer: React.FC = () => {
  const { circuits, selectedCircuit, selectCircuit, updateCircuit } = useRideWire();
  const [activeConnector, setActiveConnector] = useState<'C175B_ECM' | 'DLC_OBD' | 'IPDM_RELAY'>('C175B_ECM');
  const [filterQuery, setFilterQuery] = useState('');

  const filteredCircuits = circuits.filter(
    (c) =>
      c.circuitNumber.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.colorName.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
              Topology & Pinout
            </span>
            <span className="text-xs text-slate-400">TXL/GXL Automotive Mil-Spec Schematics</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Interactive Wire Harness & Pinout Matrix
          </h2>
          <p className="text-xs text-slate-400">
            Pin-by-pin breakout, signal tracing, gauge analysis, and connector mating verification.
          </p>
        </div>

        {/* Connector Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {[
            { id: 'C175B_ECM', label: 'ECM Conn C175B (64-Pin)' },
            { id: 'DLC_OBD', label: 'DLC Port C250 (16-Pin)' },
            { id: 'IPDM_RELAY', label: 'Relay Block R3' },
          ].map((conn) => (
            <button
              key={conn.id}
              onClick={() => setActiveConnector(conn.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeConnector === conn.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {conn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Harness SVG Schematic Visualizer */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>PRIMARY HARNESS ROUTING: BATTERY → FIREWALL GROMMET → ECM / DLC</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Nominal
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Voltage Drop / Resistance
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Short / Fault
            </span>
          </div>
        </div>

        {/* SVG Schematic Canvas */}
        <div className="w-full overflow-x-auto py-2">
          <svg className="w-full min-w-[750px] h-[220px]" viewBox="0 0 800 220">
            {/* Background bus channels */}
            <rect x="20" y="20" width="120" height="180" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <text x="80" y="45" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">
              DLC PORT C250
            </text>
            <text x="80" y="60" fill="#64748b" fontSize="9" textAnchor="middle">
              Cabin Under-Dash
            </text>

            {/* Firewall Grommet Divider */}
            <rect x="360" y="10" width="40" height="200" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <text x="380" y="110" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90 380 110)">
              FIREWALL GROMMET
            </text>

            {/* ECM Module Box */}
            <rect x="620" y="20" width="150" height="180" rx="10" fill="#0f172a" stroke="#0ea5e9" strokeWidth="2" />
            <text x="695" y="45" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
              ECM C175B
            </text>
            <text x="695" y="60" fill="#64748b" fontSize="9" textAnchor="middle">
              Engine Bay IPDM
            </text>

            {/* Wire Traces */}
            {circuits.map((c, i) => {
              const y = 80 + i * 22;
              const isSelected = selectedCircuit?.id === c.id;
              const strokeWidth = c.gaugeAWG <= 14 ? 4 : c.gaugeAWG <= 18 ? 3 : 2;

              return (
                <g
                  key={c.id}
                  className="cursor-pointer transition-all hover:opacity-100"
                  onClick={() => selectCircuit(c.id)}
                >
                  {/* Glowing halo when selected */}
                  {isSelected && (
                    <path
                      d={`M 140 ${y} C 250 ${y}, 340 ${y}, 360 ${y} L 400 ${y} C 460 ${y}, 550 ${y}, 620 ${y}`}
                      fill="none"
                      stroke={c.colorCode}
                      strokeWidth={strokeWidth + 6}
                      strokeOpacity="0.4"
                    />
                  )}

                  {/* Wire Path */}
                  <path
                    d={`M 140 ${y} C 250 ${y}, 340 ${y}, 360 ${y} L 400 ${y} C 460 ${y}, 550 ${y}, 620 ${y}`}
                    fill="none"
                    stroke={c.colorCode}
                    strokeWidth={strokeWidth}
                    strokeDasharray={c.status === 'HIGH_RESISTANCE' ? '8 4' : undefined}
                  />

                  {/* Pin endpoints */}
                  <circle cx="140" cy={y} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="620" cy={y} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />

                  {/* Pin label texts */}
                  <text x="130" y={y + 3} fill="#cbd5e1" fontSize="9" fontFamily="monospace" textAnchor="end">
                    {c.pinFrom}
                  </text>
                  <text x="630" y={y + 3} fill="#cbd5e1" fontSize="9" fontFamily="monospace" textAnchor="start">
                    {c.pinTo}
                  </text>

                  {/* Midline wire tag */}
                  <text x="260" y={y - 4} fill={c.colorCode} fontSize="9" fontWeight="bold">
                    {c.circuitNumber} ({c.gaugeAWG}AWG)
                  </text>

                  {/* Status indicator badge on wire */}
                  {c.status !== 'HEALTHY' && (
                    <circle cx="280" cy={y} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Circuit Detail Pill */}
        {selectedCircuit && (
          <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className="w-5 h-5 rounded-full border border-white/30 shadow-lg shrink-0"
                style={{ backgroundColor: selectedCircuit.colorCode }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white font-mono">{selectedCircuit.circuitNumber}</h4>
                  <span className="text-xs text-slate-300">({selectedCircuit.name})</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      selectedCircuit.status === 'HEALTHY'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {selectedCircuit.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Path: <span className="text-cyan-300 font-mono">{selectedCircuit.pinFrom}</span> →{' '}
                  <span className="text-cyan-300 font-mono">{selectedCircuit.pinTo}</span> via {selectedCircuit.connectorName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right text-xs font-mono">
                <span className="text-slate-400">Live Reading: </span>
                <span className="text-cyan-300 font-bold">{selectedCircuit.measuredVoltage.toFixed(2)}V</span> •{' '}
                <span className="text-slate-400">{selectedCircuit.measuredResistance}Ω</span>
              </div>
              <button
                onClick={() =>
                  updateCircuit(selectedCircuit.id, {
                    status: selectedCircuit.status === 'HEALTHY' ? 'HIGH_RESISTANCE' : 'HEALTHY',
                    measuredVoltage: selectedCircuit.status === 'HEALTHY' ? 9.8 : 13.8,
                  })
                }
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
              >
                Toggle Test State
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pinout Specification Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            Complete Pinout & Harness Wire Schedule
          </h3>
          <input
            type="text"
            placeholder="Search circuit, pin, or wire color..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full sm:w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Circuit ID</th>
                <th className="p-3">Wire Color & Gauge</th>
                <th className="p-3">Source Pin</th>
                <th className="p-3">Destination Pin</th>
                <th className="p-3">Expected Spec</th>
                <th className="p-3">Live Measured</th>
                <th className="p-3">Status</th>
                <th className="p-3">Diagnostic Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredCircuits.map((c) => {
                const isSelected = selectedCircuit?.id === c.id;
                return (
                  <tr
                    key={c.id}
                    onClick={() => selectCircuit(c.id)}
                    className={`cursor-pointer transition ${
                      isSelected ? 'bg-slate-800/80 font-medium' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-3 font-mono font-bold text-white flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: c.colorCode }}
                      />
                      {c.circuitNumber}
                    </td>
                    <td className="p-3 text-slate-300">
                      <div>{c.colorName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{c.gaugeAWG} AWG TXL Primary</div>
                    </td>
                    <td className="p-3 font-mono text-cyan-300">{c.pinFrom}</td>
                    <td className="p-3 font-mono text-cyan-300">{c.pinTo}</td>
                    <td className="p-3 font-mono text-slate-400">{c.expectedVoltage}</td>
                    <td className="p-3 font-mono font-bold text-white">
                      {c.measuredVoltage.toFixed(2)}V / {c.measuredResistance}Ω
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          c.status === 'HEALTHY'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : c.status === 'HIGH_RESISTANCE'
                            ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                            : 'bg-red-950 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 max-w-xs text-[11px] truncate">
                      {c.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
