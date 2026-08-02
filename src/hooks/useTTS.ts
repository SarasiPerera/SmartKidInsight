import { useState, useCallback, useRef } from "react";
import { getAudioContext, unlockAudio } from "../lib/audioUnlock";

const ttsCache = new Map<string, { base64: string; format: string }>();

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = useCallback(() => {
    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop();
      } catch {}
      activeSourceRef.current = null;
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const playBase64Audio = useCallback(
    async (base64Data: string, format = "wav") => {
      unlockAudio();
      stopAudio();

      const ctx = getAudioContext();
      if (ctx) {
        if (ctx.state === "suspended") {
          try {
            await ctx.resume();
          } catch {}
        }

        try {
          // Convert base64 string to ArrayBuffer for Web Audio API decoding
          const binaryString = atob(base64Data);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);

          activeSourceRef.current = source;
          setIsPlaying(true);

          source.onended = () => {
            setIsPlaying(false);
            activeSourceRef.current = null;
          };

          source.start(0);
          return true;
        } catch (err) {
          console.warn("Web Audio API decode failed, attempting HTML5 Audio fallback", err);
        }
      }

      // Fallback to HTML5 Audio element
      try {
        const mimeType = format === "mp3" ? "audio/mp3" : "audio/wav";
        const audio = new Audio(`data:${mimeType};base64,${base64Data}`);
        currentAudioRef.current = audio;
        setIsPlaying(true);

        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);

        await audio.play();
        return true;
      } catch (err) {
        console.warn("HTML5 Audio play failed", err);
        setIsPlaying(false);
        return false;
      }
    },
    [stopAudio]
  );

  const speakSinhala = useCallback(
    async (text: string) => {
      unlockAudio();
      stopAudio();
      if (!text) return;

      setIsLoading(true);

      try {
        // Check in-memory audio cache
        if (ttsCache.has(text)) {
          const cached = ttsCache.get(text)!;
          await playBase64Audio(cached.base64, cached.format);
          setIsLoading(false);
          return;
        }

        // Fetch spoken audio from server /api/tts endpoint
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        const data = await response.json();

        if (data.audioBase64) {
          ttsCache.set(text, { base64: data.audioBase64, format: data.format || "wav" });
          const success = await playBase64Audio(data.audioBase64, data.format || "wav");
          if (!success) {
            speakBrowserTTS(text);
          }
        } else {
          speakBrowserTTS(text);
        }
      } catch (e) {
        console.warn("TTS fetch error, using browser speech synthesis fallback:", e);
        speakBrowserTTS(text);
      } finally {
        setIsLoading(false);
      }
    },
    [playBase64Audio, stopAudio]
  );

  const speakBrowserTTS = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "si-LK"; // Sinhala
      utterance.rate = 0.85;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  return {
    speakSinhala,
    stopAudio,
    isPlaying,
    isLoading,
    unlockAudio,
  };
}
