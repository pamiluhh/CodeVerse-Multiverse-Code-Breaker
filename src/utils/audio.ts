/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private musicInterval: any = null;
  private isMusicPlaying: boolean = false;
  private sfxEnabled: boolean = true;
  private musicEnabled: boolean = false;

  private init() {
    if (!this.ctx) {
      // @ts-ignore
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  // Play a simple retro synth beep
  public playBeep(freq: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.error(e);
    }
  }

  // Correct Answer (ascending chime)
  public playSuccess() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.06, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.2);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Wrong Answer (buzz / descending chime)
  public playFailure() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [220.00, 146.83]; // A3, D3
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);
        gain.gain.setValueAtTime(0.08, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.35);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Alarm Tone (flashing laboratory alert)
  public playAlarm(times = 3) {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      for (let i = 0; i < times; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        // Pitch siren modulation
        osc.frequency.setValueAtTime(440, now + i * 0.4);
        osc.frequency.linearRampToValueAtTime(880, now + i * 0.4 + 0.2);
        osc.frequency.linearRampToValueAtTime(440, now + i * 0.4 + 0.4);

        gain.gain.setValueAtTime(0.04, now + i * 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.4 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.4);
        osc.stop(now + i * 0.4 + 0.4);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Explosion (Bomb explosion or formula burst)
  public playExplosion() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 0.8;
      
      // Noise buffer
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Filter to make it a low rumble
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(10, now + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch (e) {
      // Fallback if BufferSource fails
      this.playBeep(100, 0.5, 'sawtooth');
    }
  }

  // Laser Zap or Alien sound
  public playLaser() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {
      console.error(e);
    }
  }

  // Zombie Growl sound
  public playZombieGrowl() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      // Wobble
      osc.frequency.linearRampToValueAtTime(120, now + 0.1);
      osc.frequency.linearRampToValueAtTime(70, now + 0.3);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.45);
    } catch (e) {
      console.error(e);
    }
  }

  // Magical Spell cast
  public playSpellCast() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73]; // A major arpeggio
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.05, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.4);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Play continuous background retro cyberpunk theme music loop
  private startMusic() {
    if (!this.musicEnabled || this.isMusicPlaying) return;
    this.init();
    if (!this.ctx) return;

    this.isMusicPlaying = true;
    let step = 0;

    // Simple bassline and drum arpeggios
    // Notes: Am - F - C - G
    const patterns = [
      [110, 110, 110, 110], // A2
      [87.31, 87.31, 87.31, 87.31], // F2
      [130.81, 130.81, 130.81, 130.81], // C3
      [98.00, 98.00, 98.00, 98.00] // G2
    ];

    const melody = [
      [220, 261, 329, 440],
      [174, 220, 261, 349],
      [261, 329, 392, 523],
      [196, 246, 293, 392]
    ];

    const beatInterval = 280; // ms per step (approx 107 BPM)

    this.musicInterval = setInterval(() => {
      if (!this.musicEnabled) {
        this.stopMusic();
        return;
      }
      try {
        const chordIdx = Math.floor(step / 4) % 4;
        const noteIdx = step % 4;
        const now = this.ctx!.currentTime;

        // Play bass note
        const bassOsc = this.ctx!.createOscillator();
        const bassGain = this.ctx!.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(patterns[chordIdx][noteIdx], now);
        bassGain.gain.setValueAtTime(0.03, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx!.destination);
        bassOsc.start();
        bassOsc.stop(now + 0.25);

        // Standard hi-hat/blip sync
        if (step % 2 === 0) {
          const tickOsc = this.ctx!.createOscillator();
          const tickGain = this.ctx!.createGain();
          tickOsc.type = 'sine';
          tickOsc.frequency.setValueAtTime(melody[chordIdx][noteIdx], now);
          tickGain.gain.setValueAtTime(0.015, now);
          tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          tickOsc.connect(tickGain);
          tickGain.connect(this.ctx!.destination);
          tickOsc.start();
          tickOsc.stop(now + 0.12);
        }

        step++;
      } catch (e) {
        console.error("Music playback issue", e);
      }
    }, beatInterval);
  }

  private stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const audio = new AudioEngine();
export default audio;
