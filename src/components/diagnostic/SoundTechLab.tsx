import React, { useState, useEffect, useRef } from 'react';
import { useRideWire } from '../../context/RideWireContext';
import { soundTech } from '../../services/soundEngine';
import {
  Volume2,
  VolumeX,
  Radio,
  Zap,
  Activity,
  Sliders,
  Play,
  Square,
  Mic,
  Sparkles,
  Waves,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export const SoundTechLab: React.FC = () => {
  const { selectedCircuit, circuits } = useRideWire();

  const [isMuted, setIsMuted] = useState(soundTech.getIsMuted());
  const [volume, setVolume] = useState(soundTech.getVolume() * 100);

  // Active sound mode states
  const [activeMode, setActiveMode] = useState<'CONTINUITY' | 'CAN_ACOUSTIC' | 'ULTRASONIC_ARC' | 'VOICE_HUD'>('CONTINUITY');
  const [testResistance, setTestResistance] = useState(0.2);
  const [isContinuousBeepActive, setIsContinuousBeepActive] = useState(false);
  const [canAudioState, setCanAudioState] = useState<'OFF' | 'HEALTHY' | 'DEGRADED' | 'BUS_OFF'>('OFF');
  const [arcIntensity, setArcIntensity] = useState(0.6);
  const [isArcingActive, setIsArcingActive] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Real-time Canvas Spectrum & Waveform Analyzer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderSpectrum = () => {
      animationFrameRef.current = requestAnimationFrame(renderSpectrum);

      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (soundTech.analyser && !isMuted) {
        const bufferLength = soundTech.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        soundTech.analyser.getByteFrequencyData(dataArray);

        // Render FFT Frequency bars
        const barWidth = (width / bufferLength) * 2.2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height * 0.75;
          const hue = 180 + (i / bufferLength) * 120; // Cyan to Amber

          ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
          ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);

          x += barWidth;
        }

        // Render Waveform Overlay
        const timeData = new Uint8Array(soundTech.analyser.fftSize);
        soundTech.analyser.getByteTimeDomainData(timeData);

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();

        const sliceWidth = width / timeData.length;
        let waveX = 0;

        for (let i = 0; i < timeData.length; i++) {
          const v = timeData[i] / 128.0;
          const waveY = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(waveX, waveY);
          } else {
            ctx.lineTo(waveX, waveY);
          }
          waveX += sliceWidth;
        }
        ctx.stroke();
      } else {
        // Idle flatline
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }
    };

    renderSpectrum();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMuted]);

  // Clean up sounds on unmount
  useEffect(() => {
    return () => {
      soundTech.stopAll();
    };
  }, []);

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    soundTech.setVolume(newVal / 100);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundTech.setMuted(nextMuted);
    if (nextMuted) {
      soundTech.stopAll();
      setIsContinuousBeepActive(false);
      setIsArcingActive(false);
      setCanAudioState('OFF');
    }
  };

  const handleToggleContinuousBeep = () => {
    if (isContinuousBeepActive) {
      soundTech.stopContinuityBeep();
      setIsContinuousBeepActive(false);
    } else {
      soundTech.playContinuityBeep(0, testResistance);
      setIsContinuousBeepActive(true);
    }
  };

  const handleTriggerCanAudio = (state: 'HEALTHY' | 'DEGRADED' | 'BUS_OFF') => {
    if (canAudioState === state) {
      soundTech.stopCanBusAudio();
      setCanAudioState('OFF');
    } else {
      soundTech.startCanBusAudio(state);
      setCanAudioState(state);
    }
  };

  const handleToggleArcing = () => {
    if (isArcingActive) {
      soundTech.stopArcingSizzle();
      setIsArcingActive(false);
    } else {
      soundTech.startArcingSizzle(arcIntensity);
      setIsArcingActive(true);
    }
  };

  const handleSimulateWiggleTest = () => {
    // Rapidly toggle resistance and play pops mimicking intermittent broken wire strands
    soundTech.playContinuityBeep(80, 0.1);
    setTimeout(() => soundTech.playTone(3400, 'square', 40), 90);
    setTimeout(() => soundTech.playContinuityBeep(120, 4.5), 150);
    setTimeout(() => soundTech.playTone(1800, 'sawtooth', 60), 300);
    setTimeout(() => soundTech.playContinuityBeep(200, 0.2), 400);
  };

  const handleSpeakVoice = (phrase: string) => {
    soundTech.speakTelemetry(phrase);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded">
              Acoustic Forensics
            </span>
            <span className="text-xs text-slate-400 font-mono">Web Audio API • Real-Time DSP</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            RideWire Sound Tech Diagnostic Lab
          </h2>
          <p className="text-xs text-slate-400">
            Precision continuity tone, resistance-variable beeping, CAN acoustic packet chatter, and ultrasonic arc detection.
          </p>
        </div>

        {/* Global Sound Tech Volume & Mute */}
        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-lg transition ${
              isMuted
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            }`}
            title={isMuted ? 'Unmute Sound Tech' : 'Mute Sound Tech'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">VOL:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-24 accent-cyan-400 cursor-pointer"
            />
            <span className="text-cyan-300 w-8 text-right font-bold">{Math.round(volume)}%</span>
          </div>
        </div>
      </div>

      {/* Real-Time Audio Oscilloscope & Spectrum Display Canvas */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Waves className="w-4 h-4 animate-pulse" />
            <span>REAL-TIME ACOUSTIC FFT SPECTRUM & SINE OSCILLOSCOPE</span>
          </div>
          <span className="text-slate-400 text-[10px]">
            {isMuted ? 'AUDIO ENGINE MUTED' : '24-BIT 48kHz DSP ACTIVE'}
          </span>
        </div>

        <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
          <canvas
            ref={canvasRef}
            width={800}
            height={180}
            className="w-full h-full object-cover block"
          />
        </div>
      </div>

      {/* 4 Interactive Audio Diagnostic Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: Precision DMM Continuity Tone */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                DMM Continuity Tone & Wiggle Test
              </h3>
            </div>
            <span className="text-[10px] font-mono text-amber-400 font-bold">0.00Ω – 200Ω</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Real automotive continuity tone. Low resistance (&lt;0.5Ω) sounds a crisp 2.8kHz tone. Higher resistance drops pitch. Open circuit (&gt;150Ω) falls silent.
          </p>

          <div className="space-y-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Simulated Circuit Resistance:</span>
              <span className="font-bold text-amber-400">{testResistance.toFixed(1)} Ω</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="0.5"
              value={testResistance}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTestResistance(val);
                if (isContinuousBeepActive) {
                  soundTech.playContinuityBeep(0, val);
                }
              }}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0Ω (Solid Continuity)</span>
              <span>60Ω (Bus Termination)</span>
              <span>150Ω+ (Open Circuit)</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => soundTech.playContinuityBeep(350, testResistance)}
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition"
            >
              Touch Probes (Tap Beep)
            </button>
            <button
              onClick={handleToggleContinuousBeep}
              className={`flex-1 py-2.5 font-bold rounded-xl text-xs transition ${
                isContinuousBeepActive
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {isContinuousBeepActive ? 'Stop Continuous Tone' : 'Continuous Tone'}
            </button>
          </div>

          <button
            onClick={handleSimulateWiggleTest}
            className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-amber-300 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Simulate Harness Flex & Wiggle Stress Test</span>
          </button>
        </div>

        {/* Module 2: CAN-Bus Acoustic Packet Sonification */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                CAN-Bus Acoustic Packet Stream
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">500 kbps AUDIO</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Sonifies high-speed differential CAN packets into audible rhythmic chirps. An experienced technician can immediately hear packet collisions, frame dropouts, and Bus-Off states by ear.
          </p>

          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { id: 'HEALTHY', label: 'Healthy Bus (500k)', desc: 'Rapid smooth packet rhythm' },
              { id: 'DEGRADED', label: 'Degraded Bus', desc: 'Irregular packet stutter' },
              { id: 'BUS_OFF', label: 'Bus-Off Error', desc: '180Hz collision buzz' },
            ].map((state) => (
              <button
                key={state.id}
                onClick={() => handleTriggerCanAudio(state.id as any)}
                className={`p-3 rounded-xl border text-left transition ${
                  canAudioState === state.id
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">{state.label}</div>
                <div className="text-[10px] mt-1 opacity-80">{state.desc}</div>
              </button>
            ))}
          </div>

          {canAudioState !== 'OFF' && (
            <button
              onClick={() => {
                soundTech.stopCanBusAudio();
                setCanAudioState('OFF');
              }}
              className="w-full py-2 bg-red-950 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Stop CAN Acoustic Stream</span>
            </button>
          )}
        </div>

        {/* Module 3: Ultrasonic Micro-Arcing & Loose Terminal Sizzle */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Ultrasonic Arcing & Sizzle Detector
              </h3>
            </div>
            <span className="text-[10px] font-mono text-purple-400 font-bold">3.5 kHz BANDPASS</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Recreates the acoustic sizzle of microscopic arcing across loose terminal crimps, oxidized fuse blades, and corroded chassis ground eyelets under cranking draw.
          </p>

          <div className="space-y-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Arcing Sizzle Intensity:</span>
              <span className="font-bold text-purple-400">{Math.round(arcIntensity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={arcIntensity}
              onChange={(e) => {
                const val = Number(e.target.value);
                setArcIntensity(val);
                if (isArcingActive) {
                  soundTech.startArcingSizzle(val);
                }
              }}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>

          <button
            onClick={handleToggleArcing}
            className={`w-full py-2.5 font-bold rounded-xl text-xs transition ${
              isArcingActive
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {isArcingActive ? 'Stop Arcing Sizzle Simulation' : 'Start Loose Crimp Arcing Sizzle'}
          </button>
        </div>

        {/* Module 4: Twin HUD Audio Voice Guidance (Spoken Telemetry) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Twin Spoken Telemetry HUD
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">VOICE GUIDANCE</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Hands-free audio callouts so the technician can keep their eyes on the physical wiring harness and probe tips while the Twin Co-Pilot speaks the readings.
          </p>

          <div className="space-y-2 text-xs">
            {[
              {
                label: 'DLC Pin 6 Probed',
                speech: 'DLC Pin 6 High Speed CAN Probed. Voltage 2.68 Volts. Signal Nominal.',
              },
              {
                label: 'Splice S104 Voltage Drop Alert',
                speech: 'Warning! Excessive voltage drop on Splice S104. Measured 9.35 Volts. High resistance detected.',
              },
              {
                label: 'Ground G102 Torque Verified',
                speech: 'Ground G102 re-torqued. Voltage drop 0.02 Volts. Certified spec restored.',
              },
              {
                label: 'Self-Healing Protocol Passed',
                speech: 'RideWire Self Healing verification complete. DTC U0100 cleared.',
              },
            ].map((voice, idx) => (
              <button
                key={idx}
                onClick={() => handleSpeakVoice(voice.speech)}
                className="w-full flex items-center justify-between p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition"
              >
                <span className="font-semibold text-slate-200">{voice.label}</span>
                <span className="text-emerald-400 text-[11px] font-mono">Speak HUD &gt;</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
