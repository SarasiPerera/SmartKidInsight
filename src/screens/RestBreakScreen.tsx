import React, { useState, useEffect } from "react";
import { OllieOwl } from "../components/OllieOwl";
import { useTTS } from "../hooks/useTTS";
import { Coffee, Wind, Play, CheckCircle2, Volume2 } from "lucide-react";
import { motion } from "motion/react";

interface RestBreakScreenProps {
  onContinueSession: () => void;
  onFinishSession: () => void;
}

export const RestBreakScreen: React.FC<RestBreakScreenProps> = ({
  onContinueSession,
  onFinishSession,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(20);
  const [breathPhase, setBreathPhase] = useState<"in" | "out">("in");
  const { speakSinhala } = useTTS();

  useEffect(() => {
    // Alternate breath phase every 4 seconds
    const breathInterval = setInterval(() => {
      setBreathPhase((prev) => {
        const next = prev === "in" ? "out" : "in";
        speakSinhala(
          next === "in" ? "හුස්ම ගන්න... හෙමින්..." : "හුස්ම පිටකරන්න..."
        );
        return next;
      });
    }, 4000);

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          clearInterval(breathInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(breathInterval);
      clearInterval(timer);
    };
  }, [speakSinhala]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-sky-100 p-6 md:p-8 text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-800 px-3.5 py-1 rounded-full text-xs font-bold">
          <Coffee className="w-4 h-4" />
          <span>Rest & Breathing Break</span>
        </div>

        <h2 className="text-2xl font-black text-slate-800">
          ටිකක් විවේක ගනිමු! (Rest Break)
        </h2>
        <p className="text-xs text-slate-500">
          Follow Ollie the Owl to take 3 deep breaths and relax your eyes.
        </p>

        {/* Animated Expanding/Contracting Breathing Circle */}
        <div className="py-6 flex flex-col items-center justify-center relative">
          <motion.div
            className="w-36 h-36 rounded-full bg-gradient-to-tr from-sky-400 to-teal-300 flex items-center justify-center shadow-lg"
            animate={{
              scale: breathPhase === "in" ? 1.25 : 0.85,
            }}
            transition={{
              duration: 3.8,
              ease: "easeInOut",
            }}
          >
            <div className="text-white text-center">
              <Wind className="w-8 h-8 mx-auto mb-1 animate-pulse" />
              <p className="text-sm font-extrabold capitalize">
                {breathPhase === "in" ? "හුස්ම ගන්න 🌬️" : "පිට කරන්න 🍃"}
              </p>
              <p className="text-[10px] text-sky-100 font-bold">
                {breathPhase === "in" ? "Breathe In" : "Breathe Out"}
              </p>
            </div>
          </motion.div>

          <p className="text-xs font-mono font-bold text-sky-700 mt-6">
            Timer: {secondsLeft}s remaining
          </p>
        </div>

        {/* Ollie Mascot */}
        <div className="flex justify-center">
          <OllieOwl emotion="speaking" size={90} />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={onContinueSession}
            className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Continue Screening Activities</span>
          </button>
          <button
            onClick={onFinishSession}
            className="w-full py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs rounded-2xl transition-colors"
          >
            Finish Session Now
          </button>
        </div>
      </div>
    </div>
  );
};
