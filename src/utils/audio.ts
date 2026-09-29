/**
 * Web Audio API procedural sound synthesizer for TimberCraft.
 * Generates crisp, satisfying audio effects without any external sound assets.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  // Satisfying wood chop sound (hollow wooden thud + splinter crackle)
  public playChop(intensity: number = 1.0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.4 * Math.min(intensity, 1.4), now);
      masterGain.connect(this.ctx.destination);

      // Low wooden thud
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 + Math.random() * 30, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.09);

      oscGain.gain.setValueAtTime(1, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.11);

      // High wooden snap/crack
      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snapOsc.type = 'sawtooth';
      snapOsc.frequency.setValueAtTime(450 + Math.random() * 80, now);
      snapOsc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

      snapGain.gain.setValueAtTime(0.6, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      snapOsc.connect(snapGain);
      snapGain.connect(masterGain);
      snapOsc.start(now);
      snapOsc.stop(now + 0.07);
    } catch {
      // Audio context might be restricted before gesture
    }
  }

  // Critical chop hit
  public playCrit() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      this.playChop(1.4);
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      gain.gain.setValueAtTime(this.volume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // Ignore audio restriction
    }
  }

  // Tree felled sound: long groaning creak and deep rustling thud
  public playTreeFall() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.45, now);
      masterGain.connect(this.ctx.destination);

      // Creaking pitch bend
      const creakOsc = this.ctx.createOscillator();
      const creakGain = this.ctx.createGain();
      creakOsc.type = 'sawtooth';
      creakOsc.frequency.setValueAtTime(220, now);
      creakOsc.frequency.exponentialRampToValueAtTime(60, now + 0.35);

      creakGain.gain.setValueAtTime(0.3, now);
      creakGain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

      creakOsc.connect(creakGain);
      creakGain.connect(masterGain);
      creakOsc.start(now);
      creakOsc.stop(now + 0.4);

      // Deep ground impact
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'triangle';
      thudOsc.frequency.setValueAtTime(95, now + 0.28);
      thudOsc.frequency.exponentialRampToValueAtTime(25, now + 0.55);

      thudGain.gain.setValueAtTime(0, now);
      thudGain.gain.setValueAtTime(0.8, now + 0.28);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      thudOsc.connect(thudGain);
      thudGain.connect(masterGain);
      thudOsc.start(now + 0.28);
      thudOsc.stop(now + 0.62);
    } catch {
      // Ignore
    }
  }

  // House upgrade / landmark completion fanfare
  public playHouseUpgrade() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99]; // C major chord arpeggio
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        const startTime = now + idx * 0.08;
        const duration = 0.35;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(this.volume * 0.3, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      });
    } catch {
      // Ignore
    }
  }

  // Blacksmith anvil strike for tool upgrades
  public playAnvil() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1320, now); // E6
      osc.frequency.exponentialRampToValueAtTime(1174, now + 0.2);

      gain.gain.setValueAtTime(this.volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Ignore
    }
  }

  // Gold coin drop / trade
  public playCoin() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.06); // E6

      gain.gain.setValueAtTime(this.volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.21);
    } catch {
      // Ignore
    }
  }

  // Sawmill buzz sound
  public playSaw() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.linearRampToValueAtTime(280, now + 0.08);
      osc.frequency.linearRampToValueAtTime(220, now + 0.16);

      gain.gain.setValueAtTime(this.volume * 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.19);
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundEngine();
