/**
 * Procedural Medieval Forest & Armory Soundscape Engine
 * Powered purely by browser Web Audio API (zero external audio file dependencies)
 */

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isAmbiencePlaying: boolean = false;
  private volume: number = 0.6;

  // Audio nodes for ambient layers
  private masterGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Wind nodes
  private windNode: AudioNode | null = null;
  private windFilter: BiquadFilterNode | null = null;

  // Fireplace nodes
  private fireNode: AudioNode | null = null;

  // Interval timers
  private birdTimer: number | null = null;
  private luteTimer: number | null = null;

  private isBirdsongEnabled: boolean = true;
  private isLuteEnabled: boolean = true;

  constructor() {
    // Lazy initialize on first interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.ambienceGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Start the soothing ambient forest audio loop
   */
  public startAmbience() {
    this.initContext();
    if (!this.ctx || !this.ambienceGain || this.isAmbiencePlaying) return;

    this.isAmbiencePlaying = true;

    // 1. Gentle forest wind
    this.startForestWind();

    // 2. Cozy hearth fire crackle
    this.startHearthFire();

    // 3. Generative woodland birdsong
    this.scheduleBirdsong();

    // 4. Generative medieval lute/harp chords
    this.scheduleLuteNotes();
  }

  public stopAmbience() {
    if (this.windNode) {
      try {
        (this.windNode as AudioBufferSourceNode).stop();
      } catch {
        // ignore
      }
      this.windNode = null;
    }
    if (this.fireNode) {
      try {
        (this.fireNode as AudioBufferSourceNode).stop();
      } catch {
        // ignore
      }
      this.fireNode = null;
    }
    if (this.birdTimer) {
      window.clearTimeout(this.birdTimer);
      this.birdTimer = null;
    }
    if (this.luteTimer) {
      window.clearTimeout(this.luteTimer);
      this.luteTimer = null;
    }
    this.isAmbiencePlaying = false;
  }

  private startForestWind() {
    if (!this.ctx || !this.ambienceGain) return;

    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Pink-like gentle noise
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Resonant low-pass for pine forest canopy
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);
    this.windFilter = filter;

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    // Subtle LFO to simulate gentle gusts
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    whiteNoise.connect(filter);
    filter.connect(windGain);
    windGain.connect(this.ambienceGain);

    whiteNoise.start();
    this.windNode = whiteNoise;
  }

  private startHearthFire() {
    if (!this.ctx || !this.ambienceGain) return;

    // Crackle buffer
    const bufferSize = this.ctx.sampleRate * 3;
    const crackleBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = crackleBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // sparse random crackles
      if (Math.random() > 0.9992) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      } else {
        data[i] = (Math.random() * 2 - 1) * 0.005;
      }
    }

    const crackleSource = this.ctx.createBufferSource();
    crackleSource.buffer = crackleBuffer;
    crackleSource.loop = true;

    const fireFilter = this.ctx.createBiquadFilter();
    fireFilter.type = 'bandpass';
    fireFilter.frequency.setValueAtTime(800, this.ctx.currentTime);
    fireFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const fireGain = this.ctx.createGain();
    fireGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    crackleSource.connect(fireFilter);
    fireFilter.connect(fireGain);
    fireGain.connect(this.ambienceGain);

    crackleSource.start();
    this.fireNode = crackleSource;
  }

  private scheduleBirdsong() {
    if (!this.isAmbiencePlaying || !this.isBirdsongEnabled) return;

    const delay = 4000 + Math.random() * 7000;
    this.birdTimer = window.setTimeout(() => {
      this.playBirdCall();
      this.scheduleBirdsong();
    }, delay);
  }

  private playBirdCall() {
    if (!this.ctx || !this.ambienceGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';

    // Random woodland bird pitch (between 2200 and 3800 Hz)
    const baseFreq = 2400 + Math.random() * 1200;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.15, now + 0.28);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(this.ambienceGain);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  private scheduleLuteNotes() {
    if (!this.isAmbiencePlaying || !this.isLuteEnabled) return;

    const delay = 6000 + Math.random() * 8000;
    this.luteTimer = window.setTimeout(() => {
      this.playLuteArpeggio();
      this.scheduleLuteNotes();
    }, delay);
  }

  private playLuteArpeggio() {
    if (!this.ctx || !this.ambienceGain || this.isMuted) return;

    // Soothing medieval Dorian chords in D (D3, A3, D4, F4, G4, A4, C5)
    const scale = [146.83, 220.00, 293.66, 349.23, 392.00, 440.00, 523.25];
    const numNotes = 2 + Math.floor(Math.random() * 3);
    const now = this.ctx.currentTime;

    for (let i = 0; i < numNotes; i++) {
      const noteFreq = scale[Math.floor(Math.random() * scale.length)];
      const noteTime = now + i * 0.35 + Math.random() * 0.1;

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(noteFreq, noteTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, noteTime);
      filter.frequency.exponentialRampToValueAtTime(300, noteTime + 1.2);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.07, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 1.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambienceGain);

      osc.start(noteTime);
      osc.stop(noteTime + 1.5);
    }
  }

  // --- Sound Effects ---

  public playPick() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.06);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playDrop() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.09);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  public playMatch3() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Ascending chime chord: A4 (440), C#5 (554), E5 (659), A5 (880)
    const notes = [440, 554.37, 659.25, 880];

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = now + idx * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.65);
    });
  }

  public playUndo() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playShuffle() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 5; i++) {
      const t = now + i * 0.04;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300 + Math.random() * 200, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t);
      osc.stop(t + 0.06);
    }
  }

  public playHint() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.25); // A5

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  public playVictory() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Regal victory fanfare chords
    const fanfares = [
      { f: 587.33, t: 0.0 },   // D5
      { f: 739.99, t: 0.12 },  // F#5
      { f: 880.00, t: 0.24 },  // A5
      { f: 1174.66, t: 0.38 }, // D6
      { f: 880.00, t: 0.65 },  // A5
      { f: 1174.66, t: 0.8 },  // D6 (held)
    ];

    fanfares.forEach(({ f, t }) => {
      if (!this.ctx || !this.sfxGain) return;
      const noteTime = now + t;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, noteTime);

      gain.gain.setValueAtTime(0.22, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.65);
    });
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx.currentTime
      );
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getIsAmbienceActive(): boolean {
    return this.isAmbiencePlaying;
  }
}

export const soundscape = new SoundscapeEngine();
