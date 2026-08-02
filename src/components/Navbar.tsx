import React, { useState } from "react";
import { UserProfile, ChildProfile } from "../types";
import { OfflineQueue } from "../lib/offlineQueue";
import { unlockAudio, isAudioEnabled } from "../lib/audioUnlock";
import {
  Wifi,
  WifiOff,
  User,
  BarChart2,
  Home,
  LogOut,
  ShieldCheck,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
} from "lucide-react";

interface NavbarProps {
  currentUser: UserProfile;
  currentChild: ChildProfile | null;
  activeScreen: string;
  onNavigate: (screen: string) => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentChild,
  activeScreen,
  onNavigate,
  onSignOut,
}) => {
  const pendingCount = OfflineQueue.getPendingCount();
  const [audioActive, setAudioActive] = useState(() => isAudioEnabled());

  const handleSoundUnlock = () => {
    const success = unlockAudio();
    setAudioActive(success);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-orange-100 shadow-xs px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Owl Logo */}
        <div
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform text-white">
            🦉
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-800 leading-tight">
              SmartKid <span className="text-orange-600">Insight</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold hidden sm:block">
              Sinhala Early Childhood Screening
            </p>
          </div>
        </div>

        {/* Center: "Allow Sound" Banner & "Researcher Mode" Pill */}
        <div className="hidden md:flex items-center gap-3">
          {/* Audio Enable Button */}
          <button
            onClick={handleSoundUnlock}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              audioActive
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse hover:bg-amber-200"
            }`}
            title="Click to ensure audio autoplay permissions are unlocked"
          >
            {audioActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>🔊 Audio Active</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                <span>🔊 Enable Audio</span>
              </>
            )}
          </button>

          {/* Researcher Mode Badge */}
          <div className="flex items-center gap-2 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider">
              Researcher Mode
            </span>
          </div>

          {/* Child Badge if selected */}
          {currentChild && (
            <div
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full px-3 py-1 cursor-pointer transition-colors"
            >
              <span className="text-base">
                {["🐱", "🐰", "🦁", "🐻", "🐼", "🐸"][currentChild.avatar_index || 0]}
              </span>
              <div className="text-xs">
                <p className="font-bold text-slate-800 leading-none">
                  {currentChild.nickname || "Child"}
                </p>
                <p className="text-[9px] text-slate-500 font-mono">
                  {currentChild.child_id}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Quick Unlock Mobile Button */}
          <button
            onClick={handleSoundUnlock}
            className={`md:hidden p-2 rounded-xl text-xs font-bold transition-all flex items-center border ${
              audioActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
            }`}
            title="Toggle Audio"
          >
            {audioActive ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-amber-700" />
            )}
          </button>

          {/* Offline Sync Status */}
          <div
            className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-xl border ${
              pendingCount > 0
                ? "bg-amber-50 text-amber-800 border-amber-200"
                : "bg-emerald-50 text-emerald-800 border-emerald-200"
            }`}
          >
            {pendingCount > 0 ? (
              <>
                <WifiOff className="w-3.5 h-3.5 animate-pulse text-amber-600" />
                <span className="hidden sm:inline">{pendingCount} Queued</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Sync Active</span>
              </>
            )}
          </div>

          {/* Home Nav */}
          <button
            onClick={() => onNavigate("home")}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeScreen === "home"
                ? "bg-orange-500 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Home className="w-4 h-4" />
          </button>

          {/* Dashboard Nav */}
          <button
            onClick={() => onNavigate("dashboard")}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeScreen === "dashboard"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          {/* Sign Out */}
          <button
            onClick={onSignOut}
            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
