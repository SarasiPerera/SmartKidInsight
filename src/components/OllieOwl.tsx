import React from "react";
import { motion } from "motion/react";

export type OllieEmotion = "cheerful" | "bounce" | "speaking" | "encouraging" | "welcome";

interface OllieOwlProps {
  emotion?: OllieEmotion;
  size?: number;
  showSpeechBubble?: boolean;
  speechText?: string;
  onClick?: () => void;
}

export const OllieOwl: React.FC<OllieOwlProps> = ({
  emotion = "cheerful",
  size = 120,
  showSpeechBubble = false,
  speechText = "ආයුබෝවන්! මම ඔලී!",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="relative inline-flex flex-col items-center cursor-pointer select-none group"
      style={{ width: size, height: size }}
    >
      {/* Speech Bubble */}
      {showSpeechBubble && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute -top-16 z-20 bg-white border-2 border-orange-400 text-slate-800 rounded-2xl px-3 py-1.5 shadow-lg text-xs md:text-sm font-bold whitespace-nowrap flex items-center gap-1.5 pointer-events-none"
        >
          <span>{speechText}</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-orange-400" />
        </motion.div>
      )}

      {/* Ollie Body SVG Container */}
      <motion.svg
        viewBox="0 0 200 220"
        width={size}
        height={size}
        className="drop-shadow-md overflow-visible"
        animate={
          emotion === "bounce" || emotion === "welcome"
            ? { y: [0, -12, 0], rotate: [0, -2, 2, 0] }
            : emotion === "speaking"
            ? { scale: [1, 1.03, 1] }
            : { y: [0, -4, 0] }
        }
        transition={{
          duration: emotion === "bounce" ? 0.6 : 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <defs>
          <linearGradient id="owlBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="owlBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#FDE047" />
          </linearGradient>
          <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Ear Tufts / Horns */}
        <path d="M 45 40 Q 20 10 55 55 Z" fill="#C2410C" />
        <path d="M 155 40 Q 180 10 145 55 Z" fill="#C2410C" />

        {/* Main Body Oval */}
        <ellipse cx="100" cy="120" rx="70" ry="80" fill="url(#owlBodyGrad)" />

        {/* Belly Plumas / Feathers */}
        <ellipse cx="100" cy="140" rx="45" ry="50" fill="url(#owlBellyGrad)" />
        {/* Feather Details */}
        <path d="M 85 125 Q 100 135 115 125" stroke="#D97706" strokeWidth="3" fill="none" />
        <path d="M 80 145 Q 100 155 120 145" stroke="#D97706" strokeWidth="3" fill="none" />
        <path d="M 90 165 Q 100 172 110 165" stroke="#D97706" strokeWidth="3" fill="none" />

        {/* Feet / Talons */}
        <ellipse cx="75" cy="195" rx="14" ry="8" fill="#F59E0B" />
        <ellipse cx="125" cy="195" rx="14" ry="8" fill="#F59E0B" />

        {/* Left Wing */}
        <motion.ellipse
          cx="28"
          cy="120"
          rx="18"
          ry="38"
          fill="#C2410C"
          animate={
            emotion === "bounce" || emotion === "speaking"
              ? { rotate: [-10, -25, -10] }
              : { rotate: [-5, 0, -5] }
          }
          transition={{ duration: 0.8, repeat: Infinity }}
        />

        {/* Right Wing */}
        <motion.ellipse
          cx="172"
          cy="120"
          rx="18"
          ry="38"
          fill="#C2410C"
          animate={
            emotion === "bounce" || emotion === "speaking"
              ? { rotate: [10, 25, 10] }
              : { rotate: [5, 0, 5] }
          }
          transition={{ duration: 0.8, repeat: Infinity }}
        />

        {/* Large Eye Circles */}
        <circle cx="65" cy="80" r="30" fill="#FFFFFF" stroke="#F97316" strokeWidth="3" />
        <circle cx="135" cy="80" r="30" fill="#FFFFFF" stroke="#F97316" strokeWidth="3" />

        {/* Eye Pupils */}
        {emotion === "encouraging" ? (
          <>
            {/* Soft closed/gentle smile eyes */}
            <path d="M 50 82 Q 65 70 80 82" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 120 82 Q 135 70 150 82" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            {/* Sparkling Pupil Left */}
            <circle cx="65" cy="80" r="14" fill="#0F172A" />
            <circle cx="60" cy="75" r="5" fill="#FFFFFF" />

            {/* Sparkling Pupil Right */}
            <circle cx="135" cy="80" r="14" fill="#0F172A" />
            <circle cx="130" cy="75" r="5" fill="#FFFFFF" />
          </>
        )}

        {/* Ollie's Scholar Glasses Frame */}
        <circle cx="65" cy="80" r="32" fill="url(#glassGrad)" stroke="#1E3A8A" strokeWidth="4" />
        <circle cx="135" cy="80" r="32" fill="url(#glassGrad)" stroke="#1E3A8A" strokeWidth="4" />
        {/* Glasses Bridge */}
        <path d="M 97 80 L 103 80" stroke="#1E3A8A" strokeWidth="5" strokeLinecap="round" />

        {/* Beak */}
        <motion.polygon
          points="92,95 108,95 100,112"
          fill="#F59E0B"
          animate={
            emotion === "speaking"
              ? { scaleY: [1, 1.3, 1] }
              : { scaleY: 1 }
          }
          transition={{ duration: 0.3, repeat: Infinity }}
        />

        {/* Cute Cheeks */}
        <ellipse cx="45" cy="95" rx="8" ry="5" fill="#F43F5E" opacity="0.4" />
        <ellipse cx="155" cy="95" rx="8" ry="5" fill="#F43F5E" opacity="0.4" />

        {/* Floating Stars/Hearts on Cheer */}
        {emotion === "bounce" && (
          <g>
            <path d="M 20 50 L 23 58 L 30 58 L 24 62 L 26 70 L 20 65 L 14 70 L 16 62 L 10 58 L 17 58 Z" fill="#EAB308" />
            <path d="M 180 50 L 183 58 L 190 58 L 184 62 L 186 70 L 180 65 L 174 70 L 176 62 L 170 58 L 177 58 Z" fill="#EAB308" />
          </g>
        )}
      </motion.svg>
    </div>
  );
};
