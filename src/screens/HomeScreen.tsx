import React from "react";
import { ChildProfile, UserProfile } from "../types";
import { SessionStore } from "../lib/sessionStore";
import { OllieOwl } from "../components/OllieOwl";
import {
  Play,
  Plus,
  BarChart2,
  Users,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface HomeScreenProps {
  currentUser: UserProfile;
  currentChild: ChildProfile | null;
  onSelectChild: (child: ChildProfile) => void;
  onCreateChildClick: () => void;
  onStartSession: () => void;
  onNavigate: (screen: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentUser,
  currentChild,
  onSelectChild,
  onCreateChildClick,
  onStartSession,
  onNavigate,
}) => {
  const childrenList = SessionStore.getLocalChildrenList();

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 pb-12">
      {/* Hero Greeting Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sri Lanka Early Childhood Screening</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            ආයුබෝවන්, {currentUser.email.split("@")[0]}!
          </h2>
          <p className="text-xs md:text-sm font-medium text-orange-100 max-w-md">
            Tap-based early literacy & cognitive screening designed for Sinhala preschool children aged 3–6 years.
          </p>

          {currentChild ? (
            <div className="pt-2">
              <button
                onClick={onStartSession}
                className="px-6 py-3 bg-white text-orange-600 hover:bg-orange-50 font-black text-sm rounded-2xl shadow-md transition-all inline-flex items-center gap-2 group"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Screening ({currentChild.nickname})</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <button
                onClick={onCreateChildClick}
                className="px-6 py-3 bg-white text-orange-600 hover:bg-orange-50 font-black text-sm rounded-2xl shadow-md transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Child Profile to Begin</span>
              </button>
            </div>
          )}
        </div>

        {/* Mascot Mascot Ollie Illustration */}
        <div className="shrink-0 flex items-center justify-center">
          <OllieOwl emotion="bounce" size={140} showSpeechBubble={true} speechText="ගොඩක් සාදරයෙන් පිළිගනිමු! 🦉" />
        </div>
      </div>

      {/* Child Profiles Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              <span>Child Screening Profiles</span>
            </h3>
            <p className="text-xs text-slate-500">
              Select or create a child profile to start or continue assessments
            </p>
          </div>
          <button
            onClick={onCreateChildClick}
            className="px-3.5 py-2 bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Child</span>
          </button>
        </div>

        {childrenList.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl p-6">
            <p className="text-4xl mb-2">👶</p>
            <p className="text-sm font-bold text-slate-700">No Child Profile Found</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Create a child profile with nickname, age band, and avatar to launch screening activities.
            </p>
            <button
              onClick={onCreateChildClick}
              className="mt-4 px-4 py-2 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-orange-600 transition-colors"
            >
              + Create First Child Profile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {childrenList.map((c) => {
              const isSelected = currentChild?.child_id === c.child_id;
              return (
                <div
                  key={c.child_id}
                  onClick={() => onSelectChild(c)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "border-orange-500 bg-orange-50/50 shadow-md ring-2 ring-orange-200"
                      : "border-slate-200 bg-white hover:border-orange-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {["🐱", "🐰", "🦁", "🐻", "🐼", "🐸"][c.avatar_index || 0]}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">
                        {c.nickname}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {c.child_id}
                      </p>
                      <p className="text-[10px] text-orange-600 font-bold mt-0.5">
                        Age Band: {c.age_band} Years
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Role Dashboard Shortcut Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Screening Card */}
        <div
          onClick={currentChild ? onStartSession : onCreateChildClick}
          className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-current" />
          </div>
          <h4 className="font-extrabold text-slate-800 text-base">Five Screening Activities</h4>
          <p className="text-xs text-slate-500 mt-1">
            Letters, Word-Picture, Colours, Shapes, & Counting with audio prompts.
          </p>
          <div className="mt-4 text-xs font-bold text-orange-600 flex items-center gap-1">
            <span>Launch Screening</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Dashboard Analytics Card */}
        <div
          onClick={() => onNavigate("dashboard")}
          className="bg-white p-5 rounded-3xl border border-blue-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
            <BarChart2 className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-slate-800 text-base">Research & Teacher Dashboard</h4>
          <p className="text-xs text-slate-500 mt-1">
            Domain accuracy area charts, raw responses table, & JSON dataset exports.
          </p>
          <div className="mt-4 text-xs font-bold text-blue-600 flex items-center gap-1">
            <span>View Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Privacy & Ethics Info Card */}
        <div
          onClick={() => onNavigate("welcome")}
          className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-slate-800 text-base">Ethics & Privacy Standards</h4>
          <p className="text-xs text-slate-500 mt-1">
            Offline queueing, local nickname privacy, & standardized domain metrics.
          </p>
          <div className="mt-4 text-xs font-bold text-emerald-600 flex items-center gap-1">
            <span>Read Privacy Rules</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
