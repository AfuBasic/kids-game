class AudioService {
  private ctx: AudioContext | null = null;
  private musicInterval: any = null;
  private activeOscillators: { [key: string]: OscillatorNode[] } = {};

  // Settings
  public musicEnabled = true;
  public sfxEnabled = true;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play pre-configured cartoon sound effects procedurally
  public play(effect: 'tap' | 'correct' | 'wrong' | 'victory' | 'rocket' | 'pop') {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    switch (effect) {
      case 'tap': {
        // High bouncy pop sound
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.start(now);
        osc.stop(now + 0.12);
        break;
      }
      case 'pop': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }
      case 'correct': {
        // Magical ascending double chime
        const playChime = (freq: number, startDelay: number) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + startDelay);
          gain.gain.setValueAtTime(0, now + startDelay);
          gain.gain.linearRampToValueAtTime(0.2, now + startDelay + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, now + startDelay + 0.4);

          osc.start(now + startDelay);
          osc.stop(now + startDelay + 0.4);
        };
        playChime(523.25, 0); // C5
        playChime(659.25, 0.08); // E5
        playChime(783.99, 0.16); // G5
        playChime(1046.50, 0.24); // C6
        break;
      }
      case 'wrong': {
        // Soft sad descending slide
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.4);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }
      case 'victory': {
        // Happy fanfare
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, C5, E5, G5
        const timing = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
        notes.forEach((freq, i) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + timing[i]);
          gain.gain.setValueAtTime(0.2, now + timing[i]);
          gain.gain.exponentialRampToValueAtTime(0.01, now + timing[i] + 0.35);

          osc.start(now + timing[i]);
          osc.stop(now + timing[i] + 0.35);
        });
        break;
      }
      case 'rocket': {
        // Low rumble frequency sweep for rocket blastoff
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(60, now);
        osc.frequency.linearRampToValueAtTime(20, now + 2.5);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 2.5);

        osc.start(now);
        osc.stop(now + 2.5);
        break;
      }
    }
  }

  // Soft cartoon-like background music synthesized offline
  public startBackgroundMusic() {
    if (!this.musicEnabled) return;
    this.init();
    if (this.musicInterval) return;

    // A simple happy pentatonic background melody loop
    const melody = [261.63, 293.66, 329.63, 392.00, 440.00, 392.00, 329.63, 293.66]; // C4, D4, E4, G4, A4, G4, E4, D4
    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.musicEnabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(melody[noteIndex], now);
      
      // Keep background music very soft
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.start(now);
      osc.stop(now + 0.8);

      noteIndex = (noteIndex + 1) % melody.length;
    };

    // Trigger every 800ms
    this.musicInterval = setInterval(playNextNote, 800);
  }

  public stopBackgroundMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const audioService = new AudioService();
