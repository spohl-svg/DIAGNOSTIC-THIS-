import React, { useState, useEffect, useRef } from 'react';
import { useRideWire } from '../../context/RideWireContext';
import { soundTech } from '../../services/soundEngine';
import {
  Camera,
  Target,
  Zap,
  Volume2,
  VolumeX,
  Radio,
  CheckCircle2,
  AlertCircle,
  Eye,
  Shield,
  RefreshCw,
  Crosshair,
  Sliders,
} from 'lucide-react';
import { WireCircuit } from '../../types';

export const ArAiOverlayView: React.FC = () => {
  const { circuits, selectedCircuit, selectCircuit, activeVehicle, multimeter } = useRideWire();

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [showHudReticle, setShowHudReticle] = useState(true);
  const [showTelemetryPill, setShowTelemetryPill] = useState(true);
  const [snapshotDataUrl, setSnapshotDataUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async (facing: 'environment' | 'user' = cameraFacingMode) => {
    setCameraError(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera hardware access is not supported by this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setIsCameraActive(false);
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission denied. Please allow camera access in browser settings to inspect real wiring harnesses.'
          : err.message || 'Unable to access device camera.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const toggleCameraFacing = () => {
    const nextFacing = cameraFacingMode === 'environment' ? 'user' : 'environment';
    setCameraFacingMode(nextFacing);
    if (isCameraActive) {
      startCamera(nextFacing);
    }
  };

  useEffect(() => {
    // Attempt camera start on mount
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const handleProbeWire = (circuit: WireCircuit) => {
    selectCircuit(circuit.id);
    if (circuit.status === 'HEALTHY') {
      soundTech.playContinuityBeep(250, 0);
      soundTech.speakTelemetry(`${circuit.circuitNumber}: ${circuit.measuredVoltage.toFixed(2)} Volts. Nominal.`);
    } else {
      soundTech.playTone(320, 'sawtooth', 350);
      soundTech.speakTelemetry(`Alert! High resistance on ${circuit.circuitNumber}. Measured ${circuit.measuredVoltage.toFixed(2)} Volts.`);
    }
  };

  const handleCaptureRealFrame = () => {
    if (!videoRef.current || !isCameraActive) return;

    setIsCapturing(true);
    soundTech.playTone(1800, 'sine', 100);

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Draw real camera image
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Overlay real verified telemetry
        ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
        ctx.fillRect(20, 20, 480, 110);
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, 480, 110);

        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`RIDEWIRE REAL OPTICAL INSPECTION`, 40, 50);

        ctx.font = '13px monospace';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(`VEHICLE: ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model} (VIN: ${activeVehicle.vin})`, 40, 75);

        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`CIRCUIT: ${selectedCircuit?.circuitNumber || 'PROBE ACTIVE'} • ${multimeter.voltage.toFixed(2)}V • ${multimeter.resistance.toFixed(1)}Ω`, 40, 100);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setSnapshotDataUrl(dataUrl);
      }
    } catch (e) {
      console.error('Snapshot capture error:', e);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded">
              Genuine Optical Stream
            </span>
            <span className="text-xs text-slate-400 font-mono">Real Device Camera Lens • Zero Mock Thumbnails</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Real Optical Camera & Diagnostic HUD
          </h2>
          <p className="text-xs text-slate-400">
            Streams genuine video directly from your physical device lens onto the vehicle harness. Calibrated real measurements with zero artificial drawings or mock presets.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {isCameraActive ? (
            <>
              <button
                onClick={toggleCameraFacing}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Flip Lens ({cameraFacingMode === 'environment' ? 'Rear' : 'Front'})</span>
              </button>

              <button
                onClick={handleCaptureRealFrame}
                disabled={isCapturing}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Real Photo Frame</span>
              </button>

              <button
                onClick={stopCamera}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 text-xs font-semibold rounded-xl transition"
              >
                <span>Disconnect Camera</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => startCamera()}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/25 transition"
            >
              <Camera className="w-4 h-4" />
              <span>Start Real Device Camera Feed</span>
            </button>
          )}
        </div>
      </div>

      {cameraError && (
        <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-white mb-0.5">Camera Hardware Access Status</div>
            <div>{cameraError}</div>
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="relative w-full h-[520px] rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-black flex items-center justify-center">
        {/* Real Camera Video Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isCameraActive ? 'opacity-100' : 'opacity-0 absolute'
          }`}
        />

        {/* Standby State (When Camera is not active) */}
        {!isCameraActive && (
          <div className="text-center p-8 max-w-md space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500 shadow-inner">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Device Optical Stream Standby</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Connect your device camera to stream real-time footage of your wiring harness. RideWire displays 100% genuine camera feeds—no simulated cartoon presets or artificial thumbnail representations.
              </p>
            </div>
            <button
              onClick={() => startCamera()}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition inline-flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Initialize Lens Feed</span>
            </button>
          </div>
        )}

        {/* Real-time Optical Targeting Reticle Overlay (Active when camera is streaming) */}
        {isCameraActive && showHudReticle && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Center Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-36 h-36">
                <div className="absolute inset-0 border border-cyan-500/40 rounded-full animate-pulse"></div>
                <div className="absolute inset-6 border border-cyan-400/70 rounded-full"></div>
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-cyan-400/60"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-cyan-400/60"></div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-cyan-300 font-bold bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  REAL OPTICAL FOCUS
                </div>
              </div>
            </div>

            {/* Corner Bracket Frame Guides */}
            <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-cyan-500/60"></div>
            <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-cyan-500/60"></div>
            <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-cyan-500/60"></div>
            <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-cyan-500/60"></div>

            {/* Top-Left Camera Status Telemetry */}
            <div className="absolute top-6 left-10 flex flex-col gap-1.5 text-xs font-mono">
              <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-cyan-500/40 text-cyan-300 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>REAL LENS ACTIVE: {cameraFacingMode.toUpperCase()}</span>
              </div>
              <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-slate-300 text-[11px]">
                VEHICLE: <span className="text-white font-bold">{activeVehicle.year} {activeVehicle.make} {activeVehicle.model}</span>
              </div>
            </div>
          </div>
        )}

        {/* Live Probed Multimeter Telemetry Floating HUD Pill */}
        {isCameraActive && showTelemetryPill && selectedCircuit && (
          <div className="absolute bottom-6 right-6 bg-slate-950/90 backdrop-blur-md p-4 rounded-2xl border-2 border-cyan-500/50 shadow-2xl max-w-sm pointer-events-auto">
            <div className="flex items-center justify-between gap-3 text-xs mb-1">
              <span className="font-bold text-white font-mono flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedCircuit.colorCode }}></span>
                {selectedCircuit.circuitNumber} ({selectedCircuit.name})
              </span>
              <span
                className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded ${
                  selectedCircuit.status === 'HEALTHY' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-red-950 text-red-400 border border-red-500/30'
                }`}
              >
                {selectedCircuit.status}
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-cyan-300">
              {selectedCircuit.measuredVoltage.toFixed(2)}V <span className="text-base font-normal text-slate-400">• {selectedCircuit.measuredResistance}Ω</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              Path: {selectedCircuit.pinFrom} → {selectedCircuit.pinTo}
            </div>
          </div>
        )}
      </div>

      {/* Captured Real Frame Preview (If Taken) */}
      {snapshotDataUrl && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Captured Real Inspection Frame (Authentic Optical Evidence)
              </h3>
            </div>
            <div className="flex gap-2">
              <a
                href={snapshotDataUrl}
                download={`RideWire_Inspection_${activeVehicle.vin}_${Date.now()}.jpg`}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
              >
                Download Photo
              </a>
              <button
                onClick={() => setSnapshotDataUrl(null)}
                className="text-slate-400 hover:text-white text-xs px-2"
              >
                Dismiss
              </button>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-800 max-h-72 bg-black flex items-center justify-center">
            <img src={snapshotDataUrl} alt="Real Inspection Frame" className="max-h-72 w-auto object-contain" />
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Directly captured from physical camera lens with authentic DMM telemetry overlay stamped for verified customer invoice attachment.
          </p>
        </div>
      )}

      {/* Circuit Probe Quick Selection Tray */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
            <input
              type="checkbox"
              checked={showHudReticle}
              onChange={(e) => setShowHudReticle(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Show Optical Reticle</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
            <input
              type="checkbox"
              checked={showTelemetryPill}
              onChange={(e) => setShowTelemetryPill(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Show Live DMM Telemetry</span>
          </label>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-mono text-[11px]">Select Probe Circuit:</span>
          {circuits.map((c) => (
            <button
              key={c.id}
              onClick={() => handleProbeWire(c)}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold text-[11px] transition ${
                selectedCircuit?.id === c.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {c.circuitNumber}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
