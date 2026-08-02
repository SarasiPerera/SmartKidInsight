// Audio unlock helper for mobile web browser auto-play policies
let isAudioUnlocked = false;
let globalAudioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!globalAudioCtx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      globalAudioCtx = new AudioCtx();
    }
  }
  return globalAudioCtx;
}

export function unlockAudio(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume();
    }

    // Play a short silent buffer to unlock iOS Safari & Chrome Web Audio Context
    if (ctx) {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    }

    // Unlock Web Speech Synthesis if available
    if ("speechSynthesis" in window) {
      window.speechSynthesis.resume();
      const testUtterance = new SpeechSynthesisUtterance("");
      testUtterance.volume = 0;
      window.speechSynthesis.speak(testUtterance);
    }

    isAudioUnlocked = true;
    console.log("🔊 Audio Context and Web Speech API unlocked successfully");
    return true;
  } catch (err) {
    console.warn("Error unlocking audio:", err);
    return false;
  }
}

export function isAudioEnabled(): boolean {
  return isAudioUnlocked;
}
