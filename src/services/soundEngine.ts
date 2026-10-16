/**
 * RideWire Sound Tech Engine
 * High-precision Web Audio API synthesizer for automotive electrical diagnostics:
 * 1. Milliohm DMM Continuity Tone (2.8 kHz sharp sine wave)
 * 2. Resistance-Variable Audio Pitch (0Ω to 200Ω tone mapping)
 * 3. CAN-Bus 500kbps Acoustic Packet Stream sonification
 * 4. Ultrasonic Micro-Arcing & Loose Terminal Sizzle generator
 * 5. Spoken Telemetry Voice Guidance
 */

class SoundTechEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  public analyser: AnalyserNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.4;

  // Active oscillators / noise nodes
  private continuityOsc: OscillatorNode | null = null;
  private continuityGain: GainNode | null = null;
  private canInterval: number | null = null;
  private sizzleSource: AudioBufferSourceNode | null = null;
  private sizzleGain: GainNode | null = null;

  constructor() {
    // Lazily initialized on first user interaction to satisfy browser autoplay policies
  }

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

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Play standard automotive continuity beep
   * @param durationMs Duration in ms (0 for continuous until stopped)
   * @param resistance Resistance in ohms (0 for 2.8kHz pure tone, higher ohms lower frequency)
   */
  public playContinuityBeep(durationMs: number = 300, resistance: number = 0) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    // Open circuit (> 150 ohms) produces no beep
    if (resistance > 150) {
      this.stopContinuityBeep();
      return;
    }

    // Map resistance to pitch (0Ω = 2800Hz, 50Ω = 1800Hz, 120Ω = 900Hz)
    const baseFreq = Math.max(600, 2800 - resistance * 15);

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);

    // Instant attack, smooth decay
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
      // Continuous until explicit stop
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
      } catch (e) {
        // Ignored
      }
      this.continuityOsc = null;
      this.continuityGain = null;
    }
  }

  /**
   * CAN-Bus Acoustic Packet Sonification
   * Rapid digital chirping pulses mimicking 500kbps differential packets
   */
  public startCanBusAudio(networkStatus: 'HEALTHY' | 'DEGRADED' | 'BUS_OFF' = 'HEALTHY') {
    this.initContext();
    this.stopCanBusAudio();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    if (networkStatus === 'BUS_OFF') {
      // Play low continuous error buzz
      this.playTone(180, 'sawtooth', 800);
      return;
    }

    const intervalRate = networkStatus === 'HEALTHY' ? 70 : 160;

    this.canInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pitch variation per packet
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

  /**
   * Ultrasonic Micro-Arcing & Loose Terminal Sizzle Generator
   * Generates realistic electrical contact noise / crackle
   */
  public startArcingSizzle(intensity: number = 0.5) {
    this.initContext();
    this.stopArcingSizzle();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    // Create 1-second white noise buffer
    const bufferSize = this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Bandpass filter to isolate arcing frequencies (1.5kHz - 6kHz)
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
      try {
        this.sizzleSource.stop();
      } catch (e) {
        // Ignored
      }
      this.sizzleSource = null;
      this.sizzleGain = null;
    }
  }

  /**
   * Play single synthesized tone
   */
  public playTone(freq: number, type: OscillatorType = 'sine', durationMs: number = 200) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.5, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + durationMs / 1000 + 0.02);
  }

  /**
   * Spoken Diagnostic Telemetry (Speech Synthesis)
   * Speaks out pin probing readings like an advanced military HUD
   */
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

  public stopAll() {
    this.stopContinuityBeep();
    this.stopCanBusAudio();
    this.stopArcingSizzle();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundTech = new SoundTechEngine();
