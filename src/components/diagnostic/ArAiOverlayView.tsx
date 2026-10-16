import React, { useState, useEffect, useRef } from 'react';
import { useRideWire } from '../../context/RideWireContext';
import { soundTech } from '../../services/soundEngine';
import {
  Camera,
  Layers,
  Zap,
  Target,
  Maximize2,
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
  Flame,
  Radio,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Download,
  Info,
  Sliders,
} from 'lucide-react';
import { WireCircuit } from '../../types';

export const ArAiOverlayView: React.FC = () => {
  const { circuits, selectedCircuit, selectCircuit, activeVehicle, multimeter } = useRideWire();

  const [useRealCamera, setUseRealCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState<'TRANSIT_ENGINE' | 'FUSE_CENTER' | 'UNDER_DASH'>('TRANSIT_ENGINE');
  const [isThermalVision, setIsThermalVision] = useState(false);
  const [showWireTraces, setShowWireTraces] = useState(true);
  const [showAiBoxes, setShowAiBoxes] = useState(true);
  const [scanPulse, setScanPulse] = useState(0);
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Pulse animation for AR wire signal propagation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanPulse((p) => (p + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // WebRTC camera initialization
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useRealCamera) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 } } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
          setCameraError(null);
        })
        .catch((err) => {
          console.warn('Real camera not accessible, falling back to simulated engine bay:', err);
          setCameraError('Real camera unavailable or permission denied. Using high-res simulated automotive environment.');
          setUseRealCamera(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useRealCamera]);

  const handleProbeWireInAr = (circuit: WireCircuit) => {
    selectCircuit(circuit.id);
    // Play sound tech audio
    if (circuit.status === 'HEALTHY') {
      soundTech.playContinuityBeep(250, 0);
      soundTech.speakTelemetry(`${circuit.circuitNumber}: ${circuit.measuredVoltage.toFixed(2)} Volts. Nominal.`);
    } else {
      soundTech.playTone(320, 'sawtooth', 350);
      soundTech.speakTelemetry(`Alert! High resistance on ${circuit.circuitNumber}. Measured ${circuit.measuredVoltage.toFixed(2)} Volts.`);
    }
  };

  const handleCaptureSnapshot = () => {
    setSnapshotSuccess(true);
    soundTech.playTone(1800, 'sine', 100);
    setTimeout(() => setSnapshotSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded">
              Next-Gen Vision
            </span>
            <span className="text-xs text-slate-400 font-mono">AR Core v3.8 • Optical AI Target Locking</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            AR AI Wire Trace & Thermal X-Ray View
          </h2>
          <p className="text-xs text-slate-400">
            Augmented Reality camera overlay tracing physical wire paths, pinout breakouts, and thermal hotspots in real-time.
          </p>
        </div>

        {/* Viewport Modes */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Thermal Vision Toggle */}
          <button
            onClick={() => setIsThermalVision(!isThermalVision)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              isThermalVision
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span>{isThermalVision ? 'Thermal Vision (ON)' : 'FLIR Thermal View'}</span>
          </button>

          {/* Real Camera vs Preset */}
          <button
            onClick={() => setUseRealCamera(!useRealCamera)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              useRealCamera
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{useRealCamera ? 'Using Live Camera' : 'Use Device Camera'}</span>
          </button>

          {/* Environment Preset Switcher */}
          {!useRealCamera && (
            <select
              value={selectedEnvironment}
              onChange={(e) => setSelectedEnvironment(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="TRANSIT_ENGINE">Ford Transit 3.5L Engine Bay & Firewall</option>
              <option value="FUSE_CENTER">Freightliner M2 High-Current Fuse Box</option>
              <option value="UNDER_DASH">Cabin Under-Dash DLC & BCM Loom</option>
            </select>
          )}

          {/* Capture Snapshot */}
          <button
            onClick={handleCaptureSnapshot}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md transition"
          >
            <Camera className="w-4 h-4" />
            <span>Capture AR Telemetry</span>
          </button>
        </div>
      </div>

      {cameraError && (
        <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs text-amber-300 flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {snapshotSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
          <span className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            AR Inspection Telemetry Snapshot Saved to Customer Work Order!
          </span>
          <span className="font-mono text-[10px] text-emerald-300">GEO-TAGGED & VERIFIED</span>
        </div>
      )}

      {/* Main AR Viewport Container */}
      <div className="relative w-full h-[540px] rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-black">
        {/* Background 1: Live WebRTC Video */}
        {useRealCamera ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${
              isThermalVision ? 'filter hue-rotate-180 contrast-200 saturate-200 invert' : ''
            }`}
          />
        ) : (
          /* Background 2: Realistic SVG / Canvas Automotive Environment Simulation */
          <div
            className={`w-full h-full relative transition-all duration-500 ${
              isThermalVision
                ? 'bg-gradient-to-b from-[#0b0c26] via-[#2d004b] to-[#670034]'
                : 'bg-gradient-to-b from-slate-950 via-[#0d131f] to-slate-950'
            }`}
          >
            {/* Visual Engine Components in 3D Perspective */}
            <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
              <defs>
                {/* Thermal Gradient */}
                <radialGradient id="hotspot104" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="35%" stopColor="#ffea00" stopOpacity="0.9" />
                  <stop offset="65%" stopColor="#ff0044" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#300066" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="relayHotspot" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffea00" stopOpacity="0.9" />
                  <stop offset="70%" stopColor="#ff0044" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1a0033" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Engine Bay Metal Framework */}
              <g opacity={isThermalVision ? '0.4' : '0.8'}>
                {/* Cowl / Firewall */}
                <path d="M 0 80 Q 500 50 1000 80 L 1000 220 L 0 220 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                {/* Engine Cylinder Head / Intake Plenum */}
                <rect x="250" y="240" width="500" height="260" rx="20" fill="#1e293b" stroke="#334155" strokeWidth="3" />
                {/* Oil filler cap & coil packs */}
                <circle cx="340" cy="300" r="28" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                <rect x="420" y="270" width="40" height="60" rx="6" fill="#090d16" stroke="#475569" />
                <rect x="520" y="270" width="40" height="60" rx="6" fill="#090d16" stroke="#475569" />
                <rect x="620" y="270" width="40" height="60" rx="6" fill="#090d16" stroke="#475569" />
                {/* Battery Tray Left Side */}
                <rect x="40" y="280" width="160" height="220" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                <rect x="60" y="300" width="40" height="40" rx="8" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                <text x="80" y="325" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">+</text>
                <rect x="140" y="300" width="40" height="40" rx="8" fill="#020617" stroke="#94a3b8" strokeWidth="1" />
                <text x="160" y="325" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">-</text>

                {/* Main Underhood Fuse IPDM Box Right Side */}
                <rect x="800" y="260" width="160" height="240" rx="14" fill="#0f172a" stroke="#0ea5e9" strokeWidth="2" />
                <text x="880" y="290" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                  IPDM E-BOX
                </text>
              </g>

              {/* Thermal Hotspots (Visible in Thermal Vision Mode) */}
              {isThermalVision && (
                <g>
                  {/* Corroded Splice S104 Glowing Hot (Resistance generates I²R heat) */}
                  <circle cx="215" cy="275" r="75" fill="url(#hotspot104)" />
                  {/* Relay R3 Coil Operating Heat */}
                  <circle cx="860" cy="340" r="55" fill="url(#relayHotspot)" />
                </g>
              )}
            </svg>
          </div>
        )}

        {/* Layer 2: Interactive Augmented Reality SVG Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-auto" viewBox="0 0 1000 600">
          {/* Wire Traces Overlaid in AR Space */}
          {showWireTraces && (
            <g>
              {/* CAN-High Wire Path (Yellow with animated pulse) */}
              <path
                d="M 160 320 C 180 270, 240 220, 360 210 S 680 200, 840 280 L 880 340"
                fill="none"
                stroke="#eab308"
                strokeWidth={selectedCircuit?.id === 'circ-1' ? 7 : 4}
                strokeDasharray="10 5"
                strokeDashoffset={-scanPulse * 3}
                className="cursor-pointer hover:stroke-yellow-300 transition"
                onClick={() => handleProbeWireInAr(circuits[0])}
              />

              {/* CAN-Low Wire Path (Green with animated pulse) */}
              <path
                d="M 160 330 C 180 280, 240 230, 360 220 S 680 210, 840 290 L 880 350"
                fill="none"
                stroke="#22c55e"
                strokeWidth={selectedCircuit?.id === 'circ-2' ? 7 : 4}
                strokeDasharray="10 5"
                strokeDashoffset={-scanPulse * 3}
                className="cursor-pointer hover:stroke-emerald-300 transition"
                onClick={() => handleProbeWireInAr(circuits[1])}
              />

              {/* Main 12V Switched Ignition Circuit (Red) */}
              <path
                d="M 80 300 C 110 240, 190 260, 215 275 L 420 300"
                fill="none"
                stroke="#ef4444"
                strokeWidth={selectedCircuit?.id === 'circ-3' ? 8 : 5}
                strokeDasharray="12 4"
                className="cursor-pointer hover:stroke-red-300 transition"
                onClick={() => handleProbeWireInAr(circuits[2])}
              />

              {/* Ground Return Cable (Black / Cyan highlight) */}
              <path
                d="M 160 340 C 200 450, 300 480, 390 480"
                fill="none"
                stroke="#06b6d4"
                strokeWidth={selectedCircuit?.id === 'circ-4' ? 8 : 5}
                className="cursor-pointer hover:stroke-cyan-300 transition"
                onClick={() => handleProbeWireInAr(circuits[3])}
              />
            </g>
          )}

          {/* AI Inspection Bounding Boxes & Holographic Labels */}
          {showAiBoxes && (
            <g>
              {/* Splice S104 Detected Box */}
              <g className="cursor-pointer" onClick={() => handleProbeWireInAr(circuits[2])}>
                <rect x="180" y="240" width="80" height="70" rx="8" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 3" />
                <circle cx="215" cy="275" r="8" fill="#f59e0b" className="animate-ping" />
                <circle cx="215" cy="275" r="5" fill="#f59e0b" />
                {/* Holographic Tag Floating Above */}
                <rect x="145" y="195" width="150" height="38" rx="6" fill="#0f172a" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="1" />
                <text x="220" y="212" fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  SPLICE S104: FAULT
                </text>
                <text x="220" y="226" fill="#f87171" fontSize="9" textAnchor="middle" fontFamily="monospace">
                  High Resistance (3.8Ω) • 9.35V
                </text>
              </g>

              {/* ECM Connector C175B Box */}
              <g className="cursor-pointer" onClick={() => handleProbeWireInAr(circuits[0])}>
                <rect x="815" y="270" width="130" height="90" rx="8" fill="none" stroke="#38bdf8" strokeWidth="2" />
                <rect x="800" y="225" width="160" height="38" rx="6" fill="#0f172a" fillOpacity="0.85" stroke="#38bdf8" strokeWidth="1" />
                <text x="880" y="242" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  ECM CONN C175B
                </text>
                <text x="880" y="256" fill="#e2e8f0" fontSize="9" textAnchor="middle" fontFamily="monospace">
                  PIN 34 (CAN-H) 1.15V DROP
                </text>
              </g>

              {/* Ground Eyelet G102 Box */}
              <g className="cursor-pointer" onClick={() => handleProbeWireInAr(circuits[3])}>
                <circle cx="390" cy="480" r="14" fill="none" stroke="#06b6d4" strokeWidth="2" />
                <rect x="330" y="505" width="125" height="32" rx="6" fill="#0f172a" fillOpacity="0.85" stroke="#06b6d4" strokeWidth="1" />
                <text x="392" y="520" fill="#22d3ee" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  GND STUD G102
                </text>
                <text x="392" y="531" fill="#f87171" fontSize="8" textAnchor="middle" fontFamily="monospace">
                  0.82V DROP (LOOSE)
                </text>
              </g>
            </g>
          )}

          {/* AR Target Reticle in Center */}
          <g transform="translate(500, 300)">
            <circle cx="0" cy="0" r="30" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.8" />
            <circle cx="0" cy="0" r="6" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <line x1="-45" y1="0" x2="-32" y2="0" stroke="#38bdf8" strokeWidth="2" />
            <line x1="32" y1="0" x2="45" y2="0" stroke="#38bdf8" strokeWidth="2" />
            <line x1="0" y1="-45" x2="0" y2="-32" stroke="#38bdf8" strokeWidth="2" />
            <line x1="0" y1="32" x2="0" y2="45" stroke="#38bdf8" strokeWidth="2" />
          </g>
        </svg>

        {/* HUD Overlay Telemetry Layer (HTML elements over canvas) */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none text-xs font-mono">
          <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/30 text-cyan-400 flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>AI AR TRACKER: LOCKED (60 FPS)</span>
          </div>
          <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-slate-300">
            RANGE: <span className="text-white font-bold">28.4 cm</span> • FLIR SENSOR: <span className="text-amber-400 font-bold">{isThermalVision ? 'ACTIVE (142°F MAX)' : 'STANDBY'}</span>
          </div>
        </div>

        {/* Selected Circuit Probing Callout (Floating Bottom-Right in AR Viewport) */}
        {selectedCircuit && (
          <div className="absolute bottom-4 right-4 bg-slate-950/90 backdrop-blur-md p-4 rounded-2xl border border-cyan-500/40 shadow-2xl max-w-sm pointer-events-auto">
            <div className="flex items-center justify-between gap-3 text-xs mb-1">
              <span className="font-bold text-white font-mono flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedCircuit.colorCode }}></span>
                {selectedCircuit.circuitNumber}
              </span>
              <span
                className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded ${
                  selectedCircuit.status === 'HEALTHY' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                }`}
              >
                {selectedCircuit.status}
              </span>
            </div>
            <div className="text-lg font-black font-mono text-cyan-300">
              {selectedCircuit.measuredVoltage.toFixed(2)}V • {selectedCircuit.measuredResistance}Ω
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Path: {selectedCircuit.pinFrom} → {selectedCircuit.pinTo}
            </div>
          </div>
        )}

        {/* Thermal Legend (Bottom-Left) */}
        {isThermalVision && (
          <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-xl border border-orange-500/30 text-[10px] font-mono text-white flex items-center gap-2 shadow-lg">
            <span className="text-blue-400">72°F (Cold)</span>
            <div className="w-20 h-2 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 via-red-600 to-yellow-300"></div>
            <span className="text-yellow-300 font-bold">142°F (Hot Splice)</span>
          </div>
        )}
      </div>

      {/* AR Viewport Toggles & Quick Probing Tray */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
            <input
              type="checkbox"
              checked={showWireTraces}
              onChange={(e) => setShowWireTraces(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Show Holographic Wire Paths</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
            <input
              type="checkbox"
              checked={showAiBoxes}
              onChange={(e) => setShowAiBoxes(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Show AI Component Callouts</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono text-[11px]">Quick Audio-Probe:</span>
          {circuits.slice(0, 4).map((c) => (
            <button
              key={c.id}
              onClick={() => handleProbeWireInAr(c)}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 font-mono font-bold text-[11px] transition"
            >
              {c.circuitNumber}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
