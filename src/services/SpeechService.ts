class SpeechService {
  public enabled = true;
  public voiceName = '';
  public rate = 0.9; // Children benefit from slightly slower speech
  public pitch = 1.2; // Slightly higher pitch is friendlier
  public volume = 1.0;

  constructor() {
    // Load default voice if available
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.getVoices();
      };
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !window.speechSynthesis) return [];
    return window.speechSynthesis.getVoices();
  }

  // Cancel any running speech and speak the target text
  public speak(text: string) {
    if (!this.enabled) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Prevent overlapping by canceling any active speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = this.getVoices();

    if (this.voiceName) {
      const selectedVoice = voices.find(v => v.name === this.voiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    } else {
      // Find a friendly sounding English voice by default if possible
      const defaultVoice = voices.find(v => 
        v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural'))
      ) || voices.find(v => v.lang.startsWith('en'));
      if (defaultVoice) {
        utterance.voice = defaultVoice;
      }
    }

    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = this.volume;

    window.speechSynthesis.speak(utterance);
  }

  public stop() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

export const speechService = new SpeechService();
