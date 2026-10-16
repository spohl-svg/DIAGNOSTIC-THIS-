import React, { useState, useEffect } from 'react';
import { useRideWire } from '../../context/RideWireContext';
import {
  Activity,
  Zap,
  Radio,
  Gauge,
  AlertOctagon,
  CheckCircle2,
  Lock,
  Unlock,
  RefreshCw,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { WireCircuit } from '../../types';

export const DiagnosticScanner: React.FC = () => {
  const {
    activeVehicle,
    circuits,
    selectedCircuit,
    selectCircuit,
    multimeter,
    setMultimeterMode,
    toggleMultimeterHold,
    faultCodes,
    resolveFaultCode,
    clearAllFaults,
    runTwinDiagnosis,
    isTwinDiagnosing,
  } = useRideWire();

  const [waveOffset, setWaveOffset] = useState(0);

  // Animate oscilloscope wave
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset((prev) => (prev + 3) % 100);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const activeFaults = faultCodes.filter((f) => f.status === 'ACTIVE');
  const resolvedFaults = faultCodes.filter((f) => f.status === 'RESOLVED');

  return (
    <div className="space-y-6">
      {/* Top Banner: Diagnostic Vehicle Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Activity className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded">
                  Active DLC Session
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  VIN: {activeVehicle.vin}
                </span>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
                {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}{' '}
                {activeVehicle.fleetUnitNumber && `(${activeVehicle.fleetUnitNumber})`}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Client: <span className="text-slate-200 font-semibold">{activeVehicle.customerName}</span> •{' '}
                {activeVehicle.companyName || 'Private Owner'} • {activeVehicle.mileage.toLocaleString()} miles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => runTwinDiagnosis()}
              disabled={isTwinDiagnosing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/25 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isTwinDiagnosing ? 'Twin Engine Reasoning...' : 'Run Twin Diagnostic AI'}</span>
            </button>
            <button
              onClick={clearAllFaults}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-300 font-medium transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset DTCs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Digital Multimeter / Scope & Fault Codes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Rugged Automotive Multimeter & Scope (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
          {/* Subtle carbon fiber texture effect */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                RideWire Precision DMM & CAN Wave Analyzer
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                CALIBRATED • 10MΩ IMPEDANCE
              </span>
              <button
                onClick={toggleMultimeterHold}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold font-mono transition ${
                  multimeter.hold
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {multimeter.hold ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                {multimeter.hold ? 'HOLD' : 'LIVE'}
              </button>
            </div>
          </div>

          {/* DMM Digital Display (High-contrast Retro-Modern Vacuum Fluorescent VFD style) */}
          <div className="mt-4 bg-slate-950 border-2 border-slate-800 rounded-xl p-4 shadow-inner relative">
            <div className="flex justify-between items-start text-xs font-mono text-slate-400 mb-1">
              <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                PROBING: {selectedCircuit?.circuitNumber || 'CHASSIS REF'} ({selectedCircuit?.name || 'Unassigned'})
              </span>
              <span>AUTO-RANGE</span>
            </div>

            {/* Huge Digital Readout */}
            <div className="flex items-baseline justify-between py-2">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black font-mono tracking-tight text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                  {multimeter.mode === 'DC_VOLTS' && multimeter.voltage.toFixed(2)}
                  {multimeter.mode === 'OHMS' && multimeter.resistance.toFixed(1)}
                  {multimeter.mode === 'MILLIAMPS' && multimeter.currentMA.toFixed(0)}
                  {multimeter.mode === 'CAN_SCOPE' && `${multimeter.canHigh.toFixed(2)} / ${multimeter.canLow.toFixed(2)}`}
                </span>
                <span className="text-2xl font-bold font-mono text-cyan-400">
                  {multimeter.mode === 'DC_VOLTS' && 'V DC'}
                  {multimeter.mode === 'OHMS' && 'Ω'}
                  {multimeter.mode === 'MILLIAMPS' && 'mA Draw'}
                  {multimeter.mode === 'CAN_SCOPE' && 'V Diff'}
                </span>
              </div>

              {/* Status Indicator Pill */}
              <div className="text-right">
                {selectedCircuit && (
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider font-mono ${
                      selectedCircuit.status === 'HEALTHY'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : selectedCircuit.status === 'HIGH_RESISTANCE'
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        : selectedCircuit.status === 'PARASITIC_DRAW'
                        ? 'bg-purple-950 text-purple-400 border border-purple-500/30'
                        : 'bg-red-950 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {selectedCircuit.status.replace('_', ' ')}
                  </span>
                )}
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Spec: {selectedCircuit?.expectedVoltage || '12.4V - 14.4V'}
                </div>
              </div>
            </div>

            {/* Real-time CAN-Bus / Ripple Oscilloscope Waveform Display */}
            <div className="mt-3 pt-3 border-t border-slate-900 bg-slate-950/80 rounded-lg p-2.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1.5">
                <span className="text-amber-400 font-semibold">OSCILLOSCOPE 500kbps CAN-H / CAN-L TRACE</span>
                <span>TIMEBASE: 20µs/DIV • 1.0V/DIV</span>
              </div>
              <div className="relative h-20 w-full overflow-hidden bg-slate-950 rounded border border-slate-800/80">
                {/* Grid lines */}
                <svg className="absolute inset-0 w-full h-full stroke-slate-800/60" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Simulated Differential CAN Signal */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 80">
                  {/* CAN-High (yellow trace pulses from 2.5V nominal to 3.5V) */}
                  <path
                    d={`M 0 45 Q 15 45 20 20 L 50 20 Q 55 45 65 45 L 90 45 Q 95 20 105 20 L 140 20 Q 145 45 155 45 L 200 45 Q 205 20 215 20 L 250 20 Q 255 45 265 45 L 300 45 Q 305 20 315 20 L 350 20 Q 355 45 365 45 L 400 45`}
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="2"
                    strokeDasharray="400"
                    strokeDashoffset={-waveOffset * 4}
                  />
                  {/* CAN-Low (green trace pulses from 2.5V nominal down to 1.5V) */}
                  <path
                    d={`M 0 45 Q 15 45 20 65 L 50 65 Q 55 45 65 45 L 90 45 Q 95 65 105 65 L 140 65 Q 145 45 155 45 L 200 45 Q 205 65 215 65 L 250 65 Q 255 45 265 45 L 300 45 Q 305 65 315 65 L 350 65 Q 355 45 365 45 L 400 45`}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                    strokeDasharray="400"
                    strokeDashoffset={-waveOffset * 4}
                  />
                  {/* Recessive Midline (2.5V baseline) */}
                  <line x1="0" y1="45" x2="400" y2="45" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                </svg>

                {/* Overlaid Waveform Markers */}
                <div className="absolute top-1 left-2 flex gap-3 text-[9px] font-mono">
                  <span className="text-yellow-400 font-bold">CH1: CAN-H (2.70V Peak)</span>
                  <span className="text-emerald-400 font-bold">CH2: CAN-L (2.30V Trough)</span>
                </div>
              </div>
            </div>
          </div>

          {/* DMM Mode Selector Buttons (Industrial rotary look) */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[
              { id: 'DC_VOLTS', label: 'DC Voltage (V)', icon: Zap },
              { id: 'OHMS', label: 'Resistance (Ω)', icon: Activity },
              { id: 'MILLIAMPS', label: 'Parasitic (mA)', icon: Gauge },
              { id: 'CAN_SCOPE', label: 'CAN Scope (Hz)', icon: Radio },
            ].map((btn) => {
              const Icon = btn.icon;
              const active = multimeter.mode === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => setMultimeterMode(btn.id as any)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-bold transition ${
                    active
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span className="text-[11px]">{btn.label}</span>
                </button>
              );
            })}
          </div>

          {/* Diagnostic Circuit Probe Selector */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Interactive Probe Test Leads (Click Wire to Connect Probes)</span>
              <span className="text-cyan-400 text-[10px] font-mono">6 CIRCUITS MAPPED</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {circuits.map((c) => {
                const isSelected = selectedCircuit?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => selectCircuit(c.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Wire Color Swatch */}
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20 shadow"
                        style={{ backgroundColor: c.colorCode }}
                      />
                      <div className="truncate">
                        <div className="font-bold text-white font-mono text-xs">{c.circuitNumber}</div>
                        <div className="text-[11px] text-slate-400 truncate">{c.name}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-cyan-300 text-xs">
                        {c.measuredVoltage.toFixed(2)}V
                      </div>
                      <div
                        className={`text-[9px] font-bold uppercase ${
                          c.status === 'HEALTHY'
                            ? 'text-emerald-400'
                            : c.status === 'HIGH_RESISTANCE'
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }`}
                      >
                        {c.status.replace('_', ' ')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Fault Codes & Diagnostic Interlock (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Fault Code Central Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  DTC Fault Queue ({activeFaults.length} Active)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">SAE J1939 / ISO 15765</span>
            </div>

            <div className="mt-4 space-y-3">
              {activeFaults.length === 0 ? (
                <div className="p-6 text-center bg-slate-950/50 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">All DTC Codes Cleared & Verified</p>
                  <p className="text-xs text-slate-400 mt-1">
                    CAN-bus communication restored. Signal voltages are within manufacturer specs.
                  </p>
                </div>
              ) : (
                activeFaults.map((fault) => (
                  <div
                    key={fault.code}
                    className="p-3.5 bg-slate-950 border border-red-500/30 rounded-xl relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black font-mono text-red-400 bg-red-950/70 border border-red-500/40 px-2 py-0.5 rounded">
                          {fault.code}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          {fault.system}
                        </span>
                      </div>
                      <button
                        onClick={() => resolveFaultCode(fault.code)}
                        className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 px-2 py-0.5 rounded transition"
                      >
                        Mark Cleared
                      </button>
                    </div>

                    <p className="text-xs font-semibold text-slate-200 mt-2">{fault.description}</p>

                    <div className="mt-2.5 pt-2 border-t border-slate-900 flex flex-col gap-1 text-[11px] text-slate-400">
                      <div>
                        <span className="text-slate-500">Affected Circuit:</span>{' '}
                        <span className="text-amber-300 font-mono">{fault.affectedCircuit}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Connector Loc:</span>{' '}
                        <span className="text-slate-300">{fault.connectorLocation}</span>
                      </div>
                      {fault.freezeFrame && (
                        <div className="flex gap-3 text-[10px] font-mono text-cyan-400 bg-slate-900/80 px-2 py-1 rounded mt-1">
                          <span>VOLT: {fault.freezeFrame.voltage}V</span>
                          <span>RPM: {fault.freezeFrame.rpm}</span>
                          <span>TEMP: {fault.freezeFrame.tempC}°C</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Resolved / Cleared Codes (History) */}
              {resolvedFaults.length > 0 && (
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Historic / Cleared in Session ({resolvedFaults.length})
                  </div>
                  <div className="space-y-1.5">
                    {resolvedFaults.map((f) => (
                      <div
                        key={f.code}
                        className="flex items-center justify-between p-2 bg-slate-950/40 border border-slate-800 rounded-lg text-xs"
                      >
                        <span className="font-mono text-slate-500 line-through">{f.code}</span>
                        <span className="text-slate-500 text-[11px] truncate max-w-[200px]">{f.description}</span>
                        <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Inspection Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Circuit Integrity Summary
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 bg-slate-950 rounded-lg">
                <span className="text-slate-400">Total Circuits Mapped:</span>
                <span className="font-mono font-bold text-white">{circuits.length}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded-lg">
                <span className="text-slate-400">Degraded / High Resistance:</span>
                <span className="font-mono font-bold text-amber-400">
                  {circuits.filter((c) => c.status === 'HIGH_RESISTANCE').length}
                </span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded-lg">
                <span className="text-slate-400">Parasitic Draw Drawers:</span>
                <span className="font-mono font-bold text-purple-400">
                  {circuits.filter((c) => c.status === 'PARASITIC_DRAW').length}
                </span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded-lg">
                <span className="text-slate-400">Self-Healing Interlock:</span>
                <span className="font-mono font-bold text-emerald-400">READY FOR EXECUTION</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
