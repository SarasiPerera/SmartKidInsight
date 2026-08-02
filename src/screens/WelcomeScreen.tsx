import React, { useEffect, useState } from "react";
import { OllieOwl } from "../components/OllieOwl";
import { useSFX } from "../hooks/useSFX";
import { useTTS } from "../hooks/useTTS";
import { unlockAudio, isAudioEnabled } from "../lib/audioUnlock";
import { Shield, Volume2, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  const { playWelcomeJingle } = useSFX();
  const { speakSinhala, isPlaying } = useTTS();
  const [audioUnlocked, setAudioUnlocked] = useState(() => isAudioEnabled());

  useEffect(() => {
    playWelcomeJingle();
  }, [playWelcomeJingle]);

  const handleEnableAudioAndGreeting = () => {
    unlockAudio();
    setAudioUnlocked(true);
    speakSinhala("ආයුබෝවන්! ස්මාර්ට්කිට් ඉන්සයිට් වෙත සාදරයෙන් පිළිගනිමු!");
  };

  const handleContinueWithUnlock = () => {
    unlockAudio();
    onContinue();
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-orange-100 p-6 md:p-8 text-center relative overflow-hidden">
        {/* Top Mascot Ollie */}
        <div className="flex justify-center mb-4">
          <OllieOwl
            emotion="welcome"
            size={130}
            showSpeechBubble={true}
            speechText="ආයුබෝවන්! මම ඔලී! 🦉"
            onClick={handleEnableAudioAndGreeting}
          />
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
          SmartKid Insight
        </h2>
        <p className="text-xs md:text-sm font-semibold text-orange-600 mt-1">
          Sinhala Preschool Screening Platform
        </p>

        {/* Audio Enable Action Banner */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-2">
          <div className="text-left space-y-0.5">
            <p className="text-xs font-black text-amber-900 flex items-center gap-1">
              <span>🔊 Audio & Sound Permissions</span>
              {audioUnlocked && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
              )}
            </p>
            <p className="text-[10px] text-amber-700">
              {audioUnlocked
                ? "Web Audio & Sinhala Speech Enabled!"
                : "Tap below to enable Sinhala spoken prompts and sound effects"}
            </p>
          </div>

          <button
            onClick={handleEnableAudioAndGreeting}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
              isPlaying
                ? "bg-orange-500 text-white animate-pulse"
                : "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
            }`}
          >
            {isPlaying ? "Playing..." : "🔊 Enable Sound"}
          </button>
        </div>

        {/* Research Ethics & Privacy Notice */}
        <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Research Ethics & Child Privacy Notice</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            • <strong>Anonymised Identifiers:</strong> Children are assigned encrypted IDs (e.g., <code>KID-XXXXXXXX</code>).
          </p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            • <strong>Local Nicknames:</strong> Child nicknames are stored strictly on this device and never uploaded to server logs.
          </p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            • <strong>Non-Invasive Screening:</strong> All activities are tap-only, play-based screening games designed for ages 3–6.
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinueWithUnlock}
          className="w-full mt-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group"
        >
          <span>Continue to Screening</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
