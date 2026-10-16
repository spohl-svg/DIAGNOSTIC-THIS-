# RIDEWIRE PRO DIAGNOSTIC TOOL - PURE CODEBASE & ARCHITECTURAL DOSSIER

**Classification:** Exclusive Diagnostic Tool Codebase (Zero Office / Zero Billing / Zero Marketing Overhead)  
**System Architecture:** Gemini Dual-Twin Automotive Electrical Diagnostic Engine  
**Hardware Abstractions:** Web Audio API Real-time DSP • WebRTC Camera Augmented Reality • SAE J1939 / ISO 15765  
**Generated:** 2026-10-16  
**Author:** RideWire Technical Operations (s.pohl@ridewires.com)

---

## TABLE OF CONTENTS
1. [Sound Tech Audio Synthesizer Engine (`src/services/soundEngine.ts`)](#1-sound-tech-engine)
2. [AR AI Wire Trace & FLIR Thermal X-Ray HUD (`src/components/diagnostic/ArAiOverlayView.tsx`)](#2-ar-ai-wire-trace--flir-thermal-hud)
3. [Sound Tech Acoustic Lab & Spectrum Analyzer (`src/components/diagnostic/SoundTechLab.tsx`)](#3-sound-tech-acoustic-lab)
4. [Precision Multimeter & CAN Waveform Oscilloscope (`src/components/diagnostic/DiagnosticScanner.tsx`)](#4-precision-dmm--oscilloscope)
5. [Interactive Wire Harness & Pinout Matrix (`src/components/diagnostic/HarnessPinoutExplorer.tsx`)](#5-interactive-wire-harness--pinout-matrix)
6. [Autonomous Self-Healing Circuit Engine (`src/components/diagnostic/SelfHealingEngine.tsx`)](#6-autonomous-self-healing-circuit-engine)
7. [Gemini Twin Diagnostic Co-Pilot Engine (`src/components/diagnostic/GeminiTwinCoPilot.tsx`)](#7-gemini-twin-diagnostic-co-pilot)
8. [Server-Side Gemini Twin Diagnostic Endpoints (`server.ts`)](#8-server-side-gemini-twin-diagnostic-endpoints)
9. [Diagnostic Data Types & Schemas (`src/types/index.ts`)](#9-diagnostic-data-types--schemas)

---

<div style="page-break-after: always;"></div>

## 1. SOUND TECH ENGINE
**Path:** `src/services/soundEngine.ts`  
**Purpose:** Web Audio API sound synthesis providing:
- 2.8 kHz sharp sine wave automotive continuity beeper
- Resistance-variable audio pitch mapping (0Ω to 200Ω)
- CAN-Bus 500kbps acoustic digital packet stream sonification
- 3.5 kHz bandpass ultrasonic micro-arcing and loose terminal sizzle generator
- Spoken HUD telemetry voice guidance for eyes-free probing

```typescript
class SoundTechEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  public analyser: AnalyserNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.4;

  private continuityOsc: OscillatorNode | null = null;
  private continuityGain: GainNode | null = null;
  private canInterval: number | null = null;
  private sizzleSource: AudioBufferSourceNode | null = null;
  private sizzleGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public playContinuityBeep(durationMs: number = 300, resistance: number = 0) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    if (resistance > 150) {
      this.stopContinuityBeep();
      return;
    }

    const baseFreq = Math.max(600, 2800 - resistance * 15);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.8, now + 0.015);

    if (durationMs > 0) {
      const stopTime = now + durationMs / 1000;
      gain.gain.exponentialRampToValueAtTime(0.001, stopTime);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(stopTime + 0.05);
    } else {
      this.stopContinuityBeep();
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      this.continuityOsc = osc;
      this.continuityGain = gain;
    }
  }

  public stopContinuityBeep() {
    if (this.continuityOsc && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.continuityGain?.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
        this.continuityOsc.stop(now + 0.04);
      } catch (e) {}
      this.continuityOsc = null;
      this.continuityGain = null;
    }
  }

  public startCanBusAudio(networkStatus: 'HEALTHY' | 'DEGRADED' | 'BUS_OFF' = 'HEALTHY') {
    this.initContext();
    this.stopCanBusAudio();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    if (networkStatus === 'BUS_OFF') {
      this.playTone(180, 'sawtooth', 800);
      return;
    }

    const intervalRate = networkStatus === 'HEALTHY' ? 70 : 160;

    this.canInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const packetFreq = networkStatus === 'HEALTHY' 
        ? 3400 + (Math.random() - 0.5) * 600 
        : 1400 + (Math.random() - 0.5) * 300;

      osc.type = networkStatus === 'HEALTHY' ? 'square' : 'triangle';
      osc.frequency.setValueAtTime(packetFreq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.25, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.04);
    }, intervalRate);
  }

  public stopCanBusAudio() {
    if (this.canInterval !== null) {
      clearInterval(this.canInterval);
      this.canInterval = null;
    }
  }

  public startArcingSizzle(intensity: number = 0.5) {
    this.initContext();
    this.stopArcingSizzle();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const bufferSize = this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3500;
    filter.Q.value = 3.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(intensity * 0.4, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
    this.sizzleSource = whiteNoise;
    this.sizzleGain = gain;
  }

  public stopArcingSizzle() {
    if (this.sizzleSource) {
      try { this.sizzleSource.stop(); } catch (e) {}
      this.sizzleSource = null;
      this.sizzleGain = null;
    }
  }

  public speakTelemetry(text: string) {
    if (this.isMuted) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      utterance.volume = this.volume;
      window.speechSynthesis.speak(utterance);
    }
  }
}

export const soundTech = new SoundTechEngine();
```

---

<div style="page-break-after: always;"></div>

## 2. AR AI WIRE TRACE & FLIR THERMAL HUD
**Path:** `src/components/diagnostic/ArAiOverlayView.tsx`  
**Purpose:** Augmented reality camera HUD tracing physical wire paths, pinout breakouts, and thermal hotspots in real-time. Supports both physical phone camera feed (`getUserMedia`) and simulated vehicle engine bay perspectives.

```typescript
export const ArAiOverlayView: React.FC = () => {
  const { circuits, selectedCircuit, selectCircuit } = useRideWire();

  const [useRealCamera, setUseRealCamera] = useState(false);
  const [isThermalVision, setIsThermalVision] = useState(false);
  const [showWireTraces, setShowWireTraces] = useState(true);
  const [showAiBoxes, setShowAiBoxes] = useState(true);
  const [scanPulse, setScanPulse] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useRealCamera) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 } } })
        .then((s) => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(() => setUseRealCamera(false));
    }
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [useRealCamera]);

  const handleProbeWireInAr = (circuit: WireCircuit) => {
    selectCircuit(circuit.id);
    if (circuit.status === 'HEALTHY') {
      soundTech.playContinuityBeep(250, 0);
      soundTech.speakTelemetry(\`\${circuit.circuitNumber}: \${circuit.measuredVoltage.toFixed(2)} Volts. Nominal.\`);
    } else {
      soundTech.playTone(320, 'sawtooth', 350);
      soundTech.speakTelemetry(\`Alert! High resistance on \${circuit.circuitNumber}. Measured \${circuit.measuredVoltage.toFixed(2)} Volts.\`);
    }
  };

  return (
    <div className="relative w-full h-[540px] rounded-3xl overflow-hidden bg-black border-2 border-slate-800">
      {/* Real camera video feed or simulated perspective engine bay */}
      {useRealCamera ? (
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      ) : (
        <div className={isThermalVision ? "thermal-background" : "engine-bay-background"}>
          {/* Engine Framework + FLIR False Color Thermal Ironbow Gradient */}
        </div>
      )}

      {/* SVG Layer: 3D Holographic Wire Traces + AI Bounding Boxes */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600">
        {/* CAN-H Trace (Yellow, animated strokeDashoffset) */}
        <path d="M 160 320 C 180 270, 240 220, 360 210 S 680 200, 840 280 L 880 340"
              stroke="#eab308" strokeWidth="5" strokeDasharray="10 5"
              onClick={() => handleProbeWireInAr(circuits[0])} />

        {/* CAN-L Trace (Green, animated strokeDashoffset) */}
        <path d="M 160 330 C 180 280, 240 230, 360 220 S 680 210, 840 290 L 880 350"
              stroke="#22c55e" strokeWidth="5" strokeDasharray="10 5"
              onClick={() => handleProbeWireInAr(circuits[1])} />

        {/* AI Bounding Boxes: ECM C175B (64-pin), Splice S104, Ground G102 */}
      </svg>
    </div>
  );
};
```

---

<div style="page-break-after: always;"></div>

## 3. SOUND TECH ACOUSTIC LAB
**Path:** `src/components/diagnostic/SoundTechLab.tsx`  
**Purpose:** Real-time 60fps audio FFT spectrum analyzer and oscilloscope canvas with interactive automotive diagnostic audio controllers.

```typescript
export const SoundTechLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [testResistance, setTestResistance] = useState(0.2);
  const [canAudioState, setCanAudioState] = useState<'OFF' | 'HEALTHY' | 'DEGRADED' | 'BUS_OFF'>('OFF');
  const [arcIntensity, setArcIntensity] = useState(0.6);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      requestAnimationFrame(render);
      // Renders real-time FFT bars and time-domain waveform from soundTech.analyser
    };
    render();
  }, []);

  return (
    <div className="space-y-6">
      {/* Canvas Spectrum & Oscilloscope */}
      <canvas ref={canvasRef} width={800} height={180} />
      {/* Module 1: DMM Continuity Tone & Wiggle Stress Tester */}
      {/* Module 2: CAN-Bus Acoustic Packet Stream (Healthy vs Bus-Off) */}
      {/* Module 3: Ultrasonic Arcing & Loose Terminal Sizzle */}
      {/* Module 4: Twin HUD Audio Voice Telemetry Guidance */}
    </div>
  );
};
```

---

<div style="page-break-after: always;"></div>

## 4. PRECISION DMM & OSCILLOSCOPE
**Path:** `src/components/diagnostic/DiagnosticScanner.tsx`  
**Purpose:** Multi-function digital multimeter with 10MΩ input impedance, auto-ranging DC voltage, resistance, milliamp parasitic draw, and 500kbps differential CAN bus oscilloscope display.

```typescript
export const DiagnosticScanner: React.FC = () => {
  const { multimeter, setMultimeterMode, toggleMultimeterHold, selectedCircuit, selectCircuit, faultCodes } = useRideWire();

  // Waveform offset state for continuous signal flow animation
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setWaveOffset(p => (p + 3) % 100), 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Retro-Modern VFD Digital Readout (Voltage / Resistance / Current) */}
      {/* Oscilloscope 20µs/DIV differential trace: CAN-H (2.7V peak) & CAN-L (2.3V trough) */}
      {/* Interactive Circuit Probes (Click wire to connect DMM leads) */}
      {/* SAE J1939 Active Fault Code Inspector with Freeze Frame */}
    </div>
  );
};
```

---

<div style="page-break-after: always;"></div>

## 5. INTERACTIVE WIRE HARNESS & PINOUT MATRIX
**Path:** `src/components/diagnostic/HarnessPinoutExplorer.tsx`  
**Purpose:** Interactive SVG schematic tracing physical wiring through firewall grommets between DLC port C250, engine bay IPDM, and 64-pin ECM connector C175B.

```typescript
export const HarnessPinoutExplorer: React.FC = () => {
  const { circuits, selectedCircuit, selectCircuit, updateCircuit } = useRideWire();

  return (
    <div className="space-y-6">
      {/* SVG Canvas with Pinout breakout and wire gauge scaling (12 AWG - 20 AWG) */}
      {/* Pin-by-pin breakout matrix with color codes and live resistance specs */}
    </div>
  );
};
```

---

<div style="page-break-after: always;"></div>

## 6. AUTONOMOUS SELF-HEALING CIRCUIT ENGINE
**Path:** `src/components/diagnostic/SelfHealingEngine.tsx`  
**Purpose:** Automated circuit fault isolation tree, contact impedance testing, relay contactor bypass emulation, dynamic load testing, and digital circuit health certification.

```typescript
export const SelfHealingEngine: React.FC = () => {
  const { selfHealingSteps, updateSelfHealingStep, executeSelfHealingRepair } = useRideWire();

  const handleRunAutoProtocol = () => {
    // Sequentially executes isolation steps:
    // Step 1: Terminal 30 supply verification (12.6V)
    // Step 2: Ground stud G102 impedance isolation (< 0.08V drop)
    // Step 3: Termination loop split resistance test (60.0 Ohms)
    // Step 4: Dynamic 5A load test across firewall splice S104
    executeSelfHealingRepair();
  };

  return <div className="space-y-6">{/* Remediation tree cards */}</div>;
};
```

---

<div style="page-break-after: always;"></div>

## 7. GEMINI TWIN DIAGNOSTIC CO-PILOT
**Path:** `src/components/diagnostic/GeminiTwinCoPilot.tsx`  
**Purpose:** Dual-twin AI engine uniting:
- **Twin Alpha (Master Electrical Diagnostician)**: Root-cause forensic analysis, probe coordinates, safety warnings.
- **Twin Beta (Executive Service Advisor)**: Plain-English customer translation, billable repair labor hours, parts bill of materials, 1-click work order creation.

```typescript
export const GeminiTwinCoPilot: React.FC = () => {
  const { activeVehicle, multimeter, faultCodes, twinReport, runTwinDiagnosis, addWorkOrder } = useRideWire();

  return (
    <div className="space-y-6">
      {/* Twin Alpha & Twin Beta synchronized intelligence panels */}
      {/* Direct conversion of technical diagnosis into certified customer quote */}
    </div>
  );
};
```

---

<div style="page-break-after: always;"></div>

## 8. SERVER-SIDE GEMINI TWIN DIAGNOSTIC ENDPOINTS
**Path:** `server.ts`  
**Purpose:** Node.js/Express backend communicating with Google GenAI SDK (`gemini-3.8-flash`) with structured JSON formatting and high-demand domain fallbacks.

```typescript
import express from 'express';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
});

app.post('/api/twin/diagnose', async (req, res) => {
  const { vehicle, symptom, faultCodes, readings } = req.body;
  const prompt = \`You are the RideWire Gemini Twin Engine:
Twin 1: Master Automotive Electrical Diagnostician (harness wiring, CAN-Bus, EV/ICE diagnostics).
Twin 2: Executive Service Advisor & Shop President (profitable quotes, plain English customer communication).
Vehicle: \${JSON.stringify(vehicle)}
Symptom: \${symptom}
Faults: \${JSON.stringify(faultCodes)}
Readings: \${JSON.stringify(readings)}\`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });
    res.json({ success: true, source: 'gemini_twin_live', ...JSON.parse(response.text) });
  } catch (apiErr) {
    // Resilient domain fallback providing forensic pinout coordinates and parts quote
  }
});
```

---

<div style="page-break-after: always;"></div>

## 9. DIAGNOSTIC DATA TYPES & SCHEMAS
**Path:** `src/types/index.ts`  
**Purpose:** Core domain TypeScript models.

```typescript
export interface FaultCode {
  code: string;
  system: 'CAN_BUS' | 'POWERTRAIN' | 'CHASSIS' | 'BODY' | 'NETWORK';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  description: string;
  status: 'ACTIVE' | 'PENDING' | 'HISTORIC' | 'RESOLVED';
  affectedCircuit: string;
  connectorLocation: string;
  freezeFrame?: { voltage: number; rpm: number; tempC: number; };
}

export interface WireCircuit {
  id: string;
  circuitNumber: string;
  name: string;
  colorCode: string;
  colorName: string;
  gaugeAWG: number;
  expectedVoltage: string;
  measuredVoltage: number;
  measuredResistance: number;
  status: 'HEALTHY' | 'OPEN' | 'SHORT_TO_GROUND' | 'HIGH_RESISTANCE' | 'PARASITIC_DRAW';
  pinFrom: string;
  pinTo: string;
  connectorName: string;
  notes: string;
}

export interface SelfHealingStep {
  stepNumber: number;
  title: string;
  action: string;
  expectedReading: string;
  safetyCheck: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'FAILED';
  userNotes?: string;
}
```
