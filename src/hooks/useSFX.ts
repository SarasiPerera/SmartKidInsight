import { useCallback } from "react";
import confetti from "canvas-confetti";
import { getAudioContext, unlockAudio } from "../lib/audioUnlock";

export function useSFX() {
  const playTone = useCallback(
    (freq: number, type: OscillatorType, durationMs: number, delayMs = 0) => {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = type;
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + durationMs / 1000);
        }, delayMs);
      } catch (e) {
        console.warn("Web Audio API error", e);
      }
    },
    []
  );

  const playCorrectChime = useCallback(() => {
    unlockAudio();
    // Happy double arpeggio chime (C5 -> E5 -> G5)
    playTone(523.25, "sine", 150, 0); // C5
    playTone(659.25, "sine", 180, 100); // E5
    playTone(783.99, "sine", 250, 200); // G5

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#F97316", "#3B82F6", "#22C55E", "#EC4899", "#EAB308"],
      });
    } catch {}
  }, [playTone]);

  const playWrongBuzz = useCallback(() => {
    unlockAudio();
    playTone(164.81, "triangle", 180, 0);
    playTone(155.56, "triangle", 220, 120);
  }, [playTone]);

  const playFanfare = useCallback(() => {
    unlockAudio();
    playTone(523.25, "triangle", 150, 0);   // C5
    playTone(659.25, "triangle", 150, 120); // E5
    playTone(783.99, "triangle", 150, 240); // G5
    playTone(1046.5, "triangle", 400, 360); // C6

    try {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
      });
    } catch {}
  }, [playTone]);

  const playWelcomeJingle = useCallback(() => {
    unlockAudio();
    playTone(392.00, "sine", 180, 0);   // G4
    playTone(523.25, "sine", 180, 150); // C5
    playTone(659.25, "sine", 250, 300); // E5
  }, [playTone]);

  return {
    playCorrectChime,
    playWrongBuzz,
    playFanfare,
    playWelcomeJingle,
    unlockAudio,
  };
}
