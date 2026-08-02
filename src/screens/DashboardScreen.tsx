import React, { useState, useEffect } from "react";
import {
  AssessmentResponse,
  AssessmentSession,
  ChildProfile,
  DomainScore,
} from "../types";
import { DataAPI } from "../db/api";
import { computeDomainScores, formatTimeSeconds } from "../lib/scoring";
import { ACTIVITY_INFOS } from "../lib/activityData";
import {
  BarChart2,
  TrendingUp,
  Table,
  List,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Search,
  Sparkles,
  RefreshCw,
} from "lucide-react";

// Recharts imports for domain progress area line charts
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DashboardTab = "overview" | "progress" | "responses" | "sessions";

export const DashboardScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [sessions, setSessions] = useState<AssessmentSession[]>([]);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [selectedChildFilter, setSelectedChildFilter] = useState<string>("all");
  const [selectedActivityFilter, setSelectedActivityFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const ses = await DataAPI.fetchAllSessions();
    const resp = await DataAPI.fetchAllResponses();
    setSessions(ses);
    setResponses(resp);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered dataset
  const filteredResponses = responses.filter((r) => {
    if (selectedChildFilter !== "all" && r.child_id !== selectedChildFilter) return false;
    if (selectedActivityFilter !== "all" && r.activity_type !== selectedActivityFilter) return false;
    return true;
  });

  const uniqueChildIds = Array.from(new Set(responses.map((r) => r.child_id)));

  // Compute aggregate domain scores
  const domainScores = computeDomainScores(filteredResponses);

  // JSON Export Handler
  const handleExportJSON = async () => {
    const exportData = await DataAPI.exportJSONData();
    if (exportData) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `smartkid_research_export_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  // Prepare Recharts trend data for Progress Tab
  const prepareTrendData = (actType: string) => {
    const actResponses = responses.filter(
      (r) =>
        r.activity_type === actType &&
        (selectedChildFilter === "all" || r.child_id === selectedChildFilter)
    );

    // Group by session
    const sessionMap = new Map<string, { total: number; correct: number; date: string }>();

    actResponses.forEach((r) => {
      const dateStr = new Date(r.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!sessionMap.has(r.session_id)) {
        sessionMap.set(r.session_id, { total: 0, correct: 0, date: dateStr });
      }
      const entry = sessionMap.get(r.session_id)!;
      entry.total += 1;
      if (r.correct) entry.correct += 1;
    });

    const result: { session: string; accuracy: number; date: string }[] = [];
    let idx = 1;
    sessionMap.forEach((val, key) => {
      const acc = val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0;
      result.push({
        session: `S${idx++}`,
        accuracy: acc,
        date: val.date,
      });
    });

    return result;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 pb-16">
      {/* Dashboard Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Researcher & Teacher Dashboard</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            SmartKid Insight Data Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Real-time screening metrics, domain progress charts, raw response tables & research JSON export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold flex items-center gap-1 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Raw JSON</span>
          </button>
        </div>
      </div>

      {/* 4 Tabs Header */}
      <div className="flex bg-slate-100 rounded-2xl p-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 min-w-[100px] py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "overview"
              ? "bg-white text-slate-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("progress")}
          className={`flex-1 min-w-[100px] py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "progress"
              ? "bg-white text-slate-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Progress Charts</span>
        </button>

        <button
          onClick={() => setActiveTab("responses")}
          className={`flex-1 min-w-[100px] py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "responses"
              ? "bg-white text-slate-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Raw Responses</span>
        </button>

        <button
          onClick={() => setActiveTab("sessions")}
          className={`flex-1 min-w-[100px] py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "sessions"
              ? "bg-white text-slate-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <List className="w-4 h-4" />
          <span>Sessions</span>
        </button>
      </div>

      {/* Global Child Filter Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
        <Filter className="w-4 h-4 text-orange-500" />
        <span className="text-xs font-bold text-slate-700">Filter Dataset by Child ID:</span>
        <select
          value={selectedChildFilter}
          onChange={(e) => setSelectedChildFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Anonymised Children ({uniqueChildIds.length})</option>
          {uniqueChildIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </div>

      {/* --- TAB 1: OVERVIEW --- */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-xs">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Sessions
              </p>
              <p className="text-3xl font-black text-slate-800 mt-1">{sessions.length}</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Item Responses
              </p>
              <p className="text-3xl font-black text-slate-800 mt-1">{responses.length}</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Overall Accuracy Rate
              </p>
              <p className="text-3xl font-black text-emerald-600 mt-1">
                {responses.length > 0
                  ? Math.round(
                      (responses.filter((r) => r.correct).length / responses.length) * 100
                    )
                  : 0}
                %
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-xs">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Unique Anonymised Children
              </p>
              <p className="text-3xl font-black text-purple-600 mt-1">
                {uniqueChildIds.length}
              </p>
            </div>
          </div>

          {/* Domain Breakdown Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-800">Domain Performance Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                    <th className="pb-3">Domain</th>
                    <th className="pb-3">Questions</th>
                    <th className="pb-3">Correct</th>
                    <th className="pb-3">Accuracy %</th>
                    <th className="pb-3">Performance Level</th>
                    <th className="pb-3">Avg Response Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {domainScores.map((score) => (
                    <tr key={score.activity_type} className="hover:bg-slate-50/80">
                      <td className="py-3.5 font-bold">
                        {score.title_sinhala} ({score.title_english})
                      </td>
                      <td className="py-3.5">{score.total_questions}</td>
                      <td className="py-3.5 font-bold text-emerald-700">{score.correct_count}</td>
                      <td className="py-3.5 font-extrabold">{score.accuracy_percent}%</td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                            score.performance_level === "Strong"
                              ? "bg-emerald-100 text-emerald-800"
                              : score.performance_level === "Developing"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {score.performance_level}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono">{formatTimeSeconds(score.avg_time_ms)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: PROGRESS CHARTS --- */}
      {activeTab === "progress" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-2">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span>Per-Domain Accuracy Progress Charts Across Sessions</span>
            </h3>
            <p className="text-xs text-slate-500">
              Area line charts plotting domain performance percentage across consecutive assessment sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(
              [
                "sinhala_letters",
                "word_picture",
                "color_rec",
                "shape_rec",
                "number_rec",
              ] as const
            ).map((actType) => {
              const info = ACTIVITY_INFOS[actType];
              const chartData = prepareTrendData(actType);

              return (
                <div
                  key={actType}
                  className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">
                        {info.title_sinhala} ({info.title_english})
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {chartData.length} Session Data Points
                      </p>
                    </div>
                  </div>

                  <div className="h-48 w-full pt-2">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id={`grad_${actType}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={info.color_theme} stopOpacity={0.4} />
                              <stop offset="95%" stopColor={info.color_theme} stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="session" stroke="#94a3b8" fontSize={11} />
                          <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} unit="%" />
                          <Tooltip
                            formatter={(value: any) => [`${value}% Accuracy`, "Domain Score"]}
                          />
                          <Area
                            type="monotone"
                            dataKey="accuracy"
                            stroke={info.color_theme}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill={`url(#grad_${actType})`}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs font-bold text-slate-400">
                        No Session Data Recorded Yet
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TAB 3: RAW RESPONSES TABLE --- */}
      {activeTab === "responses" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-800">
              Raw Assessment Responses ({filteredResponses.length} records)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Child ID</th>
                  <th className="pb-3">Session ID</th>
                  <th className="pb-3">Activity</th>
                  <th className="pb-3">Item ID</th>
                  <th className="pb-3">Correct</th>
                  <th className="pb-3">Response Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-800">
                {filteredResponses.map((r) => (
                  <tr key={r.response_id} className="hover:bg-slate-50/80">
                    <td className="py-3 text-slate-500">
                      {new Date(r.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 font-bold text-purple-700">{r.child_id}</td>
                    <td className="py-3 text-slate-500">{r.session_id}</td>
                    <td className="py-3 font-bold capitalize text-slate-700">
                      {r.activity_type.replace("_", " ")}
                    </td>
                    <td className="py-3 text-slate-600">{r.item_id}</td>
                    <td className="py-3 font-bold">
                      {r.correct ? (
                        <span className="text-emerald-600 flex items-center gap-1 font-extrabold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1 font-extrabold">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </td>
                    <td className="py-3">{r.response_time_ms} ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 4: SESSIONS --- */}
      {activeTab === "sessions" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-800">
            Assessment Sessions List ({sessions.length})
          </h3>

          <div className="space-y-3">
            {sessions.map((s) => (
              <div
                key={s.session_id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <p className="font-extrabold text-slate-800 text-sm">
                    Session ID: {s.session_id}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Child ID: {s.child_id} • Age Band: {s.age_band} Yrs
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Start: {new Date(s.start_time).toLocaleString()}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black ${
                      s.is_complete
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {s.is_complete ? "✓ Completed" : "In Progress"}
                  </span>
                  <p className="text-[10px] font-bold text-slate-600">
                    Activities: {s.completed_activities.length} / 5
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
