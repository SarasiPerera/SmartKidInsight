import React, { useState } from "react";
import { UserProfile, UserRole } from "../types";
import { SessionStore } from "../lib/sessionStore";
import { unlockAudio } from "../lib/audioUnlock";
import { ShieldCheck, Mail, Lock, UserCheck, ArrowRight, Sparkles, Volume2 } from "lucide-react";
import { OllieOwl } from "../components/OllieOwl";

interface AuthScreenProps {
  onSignInSuccess: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSignInSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("parent@smartkid.lk");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState<UserRole>("parent");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Unlock Web Audio & Speech synthesis audio context
    unlockAudio();

    if (!email || !password) {
      setError("Please fill in email and password.");
      return;
    }

    const userProfile: UserProfile = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email: email.trim(),
      role: isSignUp ? role : (email.includes("teacher") ? "teacher" : email.includes("researcher") ? "researcher" : "parent"),
      created_at: new Date().toISOString(),
    };

    SessionStore.setCurrentUser(userProfile);
    onSignInSuccess(userProfile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-sky-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
        {/* Header Header Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-2 right-2 text-4xl opacity-20 select-none">
            🦉
          </div>

          <div className="flex justify-center mb-2">
            <OllieOwl emotion="welcome" size={90} />
          </div>

          <h2 className="text-2xl font-black tracking-tight">SmartKid Insight</h2>
          <p className="text-xs text-orange-100 font-medium mt-1">
            Sinhala Early Literacy & Cognitive Screening
          </p>
        </div>

        {/* Auth Form */}
        <div className="p-6">
          <div className="flex bg-slate-100 rounded-2xl p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError("");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                !isSignUp ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError("");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                isSignUp ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Role selector shown ONLY on Sign-Up as requested */}
            {isSignUp && (
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Select Your Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["parent", "teacher", "researcher"] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        role === r
                          ? "border-orange-500 bg-orange-50 text-orange-700 font-bold shadow-xs"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <p className="text-xs capitalize">{r}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:from-orange-600 hover:to-amber-600 transition-all flex items-center justify-center gap-2 group mt-2"
            >
              <span>{isSignUp ? "Create Account & Start" : "Sign In Immediately"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Quick Demo Credentials helper */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-500 font-bold mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Quick Demo Quick Roles:
            </p>
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => {
                  setEmail("parent@smartkid.lk");
                  setPassword("demo123");
                  setRole("parent");
                  setIsSignUp(false);
                }}
                className="p-1.5 bg-slate-100 hover:bg-orange-100 text-slate-700 rounded-lg text-center"
              >
                Parent
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("teacher@smartkid.lk");
                  setPassword("demo123");
                  setRole("teacher");
                  setIsSignUp(false);
                }}
                className="p-1.5 bg-slate-100 hover:bg-blue-100 text-slate-700 rounded-lg text-center"
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("researcher@smartkid.lk");
                  setPassword("demo123");
                  setRole("researcher");
                  setIsSignUp(false);
                }}
                className="p-1.5 bg-slate-100 hover:bg-purple-100 text-slate-700 rounded-lg text-center"
              >
                Researcher
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
