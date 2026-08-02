import React from "react";
import { AssessmentResponse, ChildProfile } from "../types";
import { computeDomainScores, formatTimeSeconds } from "../lib/scoring";
import { OllieOwl } from "../components/OllieOwl";
import {
  Award,
  CheckCircle2,
  Clock,
  BarChart2,
  Home,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface ResultsScreenProps {
  currentChild: ChildProfile;
  responses: AssessmentResponse[];
  onGoHome: () => void;
  onViewDashboard: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  currentChild,
  responses,
  onGoHome,
  onViewDashboard,
}) => {
  const domainScores = computeDomainScores(responses);
  const totalQuestions = responses.length;
  const correctCount = responses.filter((r) => r.correct).length;
  const overallAccuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const totalMs = responses.reduce((acc, r) => acc + (r.response_time_ms || 0), 0);
  const avgMs = totalQuestions > 0 ? Math.round(totalMs / totalQuestions) : 0;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 pb-12">
      {/* Results Header Card */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 rounded-3xl p-6 md:p-8 text-white shadow-lg text-center relative overflow-hidden">
        <div className="flex justify-center mb-3">
          <OllieOwl emotion="bounce" size={130} showSpeechBubble={true} speechText="සුබ පැතුම්! නියමයි! 🎉" />
        </div>

        <h2 className="text-2xl md:text-3xl font-black tracking-tight">
          Screening Summary for {currentChild.nickname}
        </h2>
        <p className="text-xs text-orange-100 font-mono mt-1">
          Child ID: {currentChild.child_id} • Age Band: {currentChild.age_band} Years
        </p>

        {/* Big Overall Metric Badge */}
        <div className="mt-6 inline-flex items-center gap-6 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
          <div>
            <p className="text-3xl font-black">{overallAccuracy}%</p>
            <p className="text-[10px] text-orange-100 font-bold uppercase tracking-wider">
              Overall Accuracy
            </p>
          </div>
          <div className="w-px h-8 bg-white/30" />
          <div>
            <p className="text-3xl font-black">{correctCount} / {totalQuestions}</p>
            <p className="text-[10px] text-orange-100 font-bold uppercase tracking-wider">
              Items Correct
            </p>
          </div>
          <div className="w-px h-8 bg-white/30" />
          <div>
            <p className="text-3xl font-black">{formatTimeSeconds(avgMs)}</p>
            <p className="text-[10px] text-orange-100 font-bold uppercase tracking-wider">
              Avg Response Time
            </p>
          </div>
        </div>
      </div>

      {/* Per-Domain Performance Breakdown */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-orange-500" />
          <span>Domain Performance Breakdown</span>
        </h3>

        <div className="space-y-4">
          {domainScores.map((score) => {
            const isStrong = score.performance_level === "Strong";
            const isDeveloping = score.performance_level === "Developing";

            const levelBg = isStrong
              ? "bg-emerald-500"
              : isDeveloping
              ? "bg-orange-500"
              : "bg-rose-500";

            const badgeBg = isStrong
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : isDeveloping
              ? "bg-orange-50 text-orange-700 border-orange-200"
              : "bg-rose-50 text-rose-700 border-rose-200";

            return (
              <div
                key={score.activity_type}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">
                      {score.title_sinhala} ({score.title_english})
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Correct: {score.correct_count} / {score.total_questions} • Avg Time: {formatTimeSeconds(score.avg_time_ms)}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full border ${badgeBg}`}
                  >
                    {score.performance_level} ({score.accuracy_percent}%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${levelBg} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${score.accuracy_percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend & Guidance */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-1">
        <p className="font-bold text-slate-800">Scoring Guidelines:</p>
        <div className="flex items-center gap-4 text-[11px] pt-1">
          <span className="flex items-center gap-1 font-bold text-emerald-700">
            🟢 Strong (≥ 80%)
          </span>
          <span className="flex items-center gap-1 font-bold text-orange-700">
            🟠 Developing (50–79%)
          </span>
          <span className="flex items-center gap-1 font-bold text-rose-700">
            🔴 Weak (&lt; 50%)
          </span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          onClick={onGoHome}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Home</span>
        </button>

        <button
          onClick={onViewDashboard}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2"
        >
          <BarChart2 className="w-4 h-4" />
          <span>View Researcher Dashboard</span>
        </button>
      </div>
    </div>
  );
};
