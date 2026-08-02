import React from "react";
import { ActivityType, AssessmentSession, ChildProfile } from "../types";
import { ACTIVITY_INFOS } from "../lib/activityData";
import { OllieOwl } from "../components/OllieOwl";
import {
  Aperture,
  Image as ImageIcon,
  Palette,
  Shapes,
  Hash,
  CheckCircle2,
  Play,
  Coffee,
  CheckCheck,
  ArrowRight,
} from "lucide-react";

interface ActivityMenuScreenProps {
  currentChild: ChildProfile;
  session: AssessmentSession;
  onSelectActivity: (activityType: ActivityType) => void;
  onTriggerRestBreak: () => void;
  onFinishSession: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Aperture,
  Image: ImageIcon,
  Palette,
  Shapes,
  Hash,
};

export const ActivityMenuScreen: React.FC<ActivityMenuScreenProps> = ({
  currentChild,
  session,
  onSelectActivity,
  onTriggerRestBreak,
  onFinishSession,
}) => {
  const activitiesList: ActivityType[] = [
    "sinhala_letters",
    "word_picture",
    "color_rec",
    "shape_rec",
    "number_rec",
  ];

  const completedCount = session.completed_activities.length;
  const progressPercent = Math.round((completedCount / activitiesList.length) * 100);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-12">
      {/* Session Progress Header */}
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left flex-1 w-full">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-2xl">
              {["🐱", "🐰", "🦁", "🐻", "🐼", "🐸"][currentChild.avatar_index || 0]}
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-800 leading-tight">
                {currentChild.nickname}'s Session
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                ID: {currentChild.child_id} • Age Band: {currentChild.age_band} Yrs
              </p>
            </div>
          </div>

          {/* Overall Session Progress Bar */}
          <div className="pt-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Overall Assessment Progress</span>
              <span>
                {completedCount} of 5 Completed ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mascot Ollie Cheer */}
        <div className="shrink-0">
          <OllieOwl
            emotion={completedCount >= 2 ? "bounce" : "cheerful"}
            size={110}
            showSpeechBubble={true}
            speechText={
              completedCount === 0
                ? "එන්න! සෙල්ලම් කරමු! 🎈"
                : completedCount >= 4
                ? "තව එක් වැඩක් විතරයි! 🌟"
                : "නියමයි! දිගටම කරගෙන යමු! 👍"
            }
          />
        </div>
      </div>

      {/* Rest Break Banner trigger if >= 2 activities completed */}
      {completedCount >= 2 && (
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sky-900 text-sm">
                Rest & Breathing Break Suggested
              </h4>
              <p className="text-xs text-sky-700">
                Prevent fatigue with Ollie's 30-second Sinhala breathing exercise.
              </p>
            </div>
          </div>
          <button
            onClick={onTriggerRestBreak}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
          >
            Take Rest Break 🌬️
          </button>
        </div>
      )}

      {/* 2-Column Activity Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
          <span>Select Assessment Activity</span>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            Tap to Play
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activitiesList.map((actType) => {
            const info = ACTIVITY_INFOS[actType];
            const isCompleted = session.completed_activities.includes(actType);
            const IconComp = ICON_MAP[info.icon_name] || Aperture;

            return (
              <div
                key={actType}
                onClick={() => onSelectActivity(actType)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
                  isCompleted
                    ? "bg-emerald-50/60 border-emerald-300 hover:border-emerald-400 shadow-xs"
                    : "bg-white border-slate-200 hover:border-orange-400 hover:shadow-md"
                }`}
              >
                {/* Checkmark Ribbon */}
                {isCompleted && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ Done</span>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold shadow-xs group-hover:scale-105 transition-transform shrink-0"
                    style={{ backgroundColor: info.color_theme }}
                  >
                    <IconComp className="w-6 h-6" />
                  </div>

                  <div className="space-y-1 pr-12">
                    <h4 className="font-extrabold text-slate-800 text-base leading-tight">
                      {info.title_sinhala}
                    </h4>
                    <p className="text-xs font-bold text-slate-600">
                      {info.title_english}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {info.description_sinhala}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">
                    Age Band: {currentChild.age_band} Yrs
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      isCompleted ? "text-emerald-700" : "text-orange-600 group-hover:translate-x-1 transition-transform"
                    }`}
                  >
                    <span>{isCompleted ? "Replay Activity" : "Start Activity"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Finish Session & View Results Action */}
      <div className="pt-4 flex justify-center">
        <button
          onClick={onFinishSession}
          className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 group"
        >
          <CheckCheck className="w-5 h-5" />
          <span>Complete Session & View Results</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
