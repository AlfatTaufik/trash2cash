/**
 * Web Audio API Sound Engine for EcoPilah
 * Completely self-contained, zero external audio files needed.
 * Provides tactile, subtle, editorial sound design.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('ecopilah_sound') !== 'false'; // default true
    this.initialized = false;
    this.listeners = [];
  }

  init() {
    if (this.initialized && this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    } catch (e) {
      console.warn('Web Audio not supported', e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('ecopilah_sound', String(this.enabled));
    if (this.enabled) {
      this.ensureContext();
      this.playGrab();
    }
    this.notify();
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.enabled);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.enabled));
  }

  /**
   * Subtle tactile grab sound (light rustle & click)
   */
  playGrab() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Low pop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.08);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);

    // Subtle high crisp click
    const oscClick = this.ctx.createOscillator();
    const gainClick = this.ctx.createGain();
    oscClick.type = 'triangle';
    oscClick.frequency.setValueAtTime(900, t);
    oscClick.frequency.exponentialRampToValueAtTime(220, t + 0.04);

    gainClick.gain.setValueAtTime(0.06, t);
    gainClick.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    oscClick.connect(gainClick);
    gainClick.connect(this.ctx.destination);
    oscClick.start(t);
    oscClick.stop(t + 0.05);
  }

  /**
   * Sound when entering bin proximity zone
   */
  playNearBin() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(440, t + 0.12);

    gain.gain.setValueAtTime(0.03, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  /**
   * Heavy satisfying thud and metallic hollow drop when trash enters the bin
   */
  playDropSuccess() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Air whoosh / suction
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.15, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(150, t + 0.14);
    filter.Q.value = 3.0;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    whiteNoise.start(t);

    // 2. Deep hollow bin resonance thud
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(180, t + 0.04);
    subOsc.frequency.exponentialRampToValueAtTime(45, t + 0.35);

    subGain.gain.setValueAtTime(0.35, t + 0.04);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(t + 0.04);
    subOsc.stop(t + 0.4);

    // 3. Metallic rim ring clatter
    const metalOsc = this.ctx.createOscillator();
    const metalGain = this.ctx.createGain();
    metalOsc.type = 'sine';
    metalOsc.frequency.setValueAtTime(620, t + 0.05);
    metalOsc.frequency.exponentialRampToValueAtTime(120, t + 0.22);

    metalGain.gain.setValueAtTime(0.08, t + 0.05);
    metalGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    metalOsc.connect(metalGain);
    metalGain.connect(this.ctx.destination);
    metalOsc.start(t + 0.05);
    metalOsc.stop(t + 0.25);
  }

  /**
   * Gentle spring rebound whoosh on dropped outside
   */
  playDropFail() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.15);

    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.18);
  }

  /**
   * Minimalist progress tick during loading
   */
  playTick() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);

    gain.gain.setValueAtTime(0.015, t);
    gain.gain.exponentialRampToValueAtTime(0.0005, t + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.025);
  }

  /**
   * Ultra-subtle haptic scroll tick for editorial reading scrub
   * Inspired by high-end mechanical camera wheels & luxury tactile clocks
   */
  playScrollTick(pitchMod = 1.0) {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Very short high crisp transient (14ms)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const baseFreq = 1450 * pitchMod;
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.45, t + 0.014);

    gain.gain.setValueAtTime(0.012, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.014);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.016);
  }

  /**
   * Subtle emerald sparkle sound when manifesto claim is fully unlocked
   */
  playClaimSparkle() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [880, 1108.73, 1318.51, 1760]; // A5 major chord sparkle
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.06);

      gain.gain.setValueAtTime(0.025 / (idx + 1), t + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.06 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.38);
    });
  }

  /**
   * Elegant harmonic completion chime
   */
  playComplete() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Two soft warm harmonic chimes (Eb5 -> Ab5)
    const freqs = [622.25, 830.61, 1244.5];
    const delays = [0, 0.1, 0.22];

    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + delays[i]);

      gain.gain.setValueAtTime(0.08 / (i + 1), t + delays[i]);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delays[i] + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + delays[i]);
      osc.stop(t + delays[i] + 0.65);
    });
  }
}

export const sound = new SoundEngine();
