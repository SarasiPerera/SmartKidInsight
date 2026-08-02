import {
  ActivityType,
  AssessmentResponse,
  DomainScore,
  PerformanceLevel,
} from "../types";
import { ACTIVITY_INFOS } from "./activityData";

export function getPerformanceLevel(accuracyPercent: number): PerformanceLevel {
  if (accuracyPercent >= 80) return "Strong";
  if (accuracyPercent >= 50) return "Developing";
  return "Weak";
}

export function computeDomainScores(
  responses: AssessmentResponse[]
): DomainScore[] {
  const activities: ActivityType[] = [
    "sinhala_letters",
    "word_picture",
    "color_rec",
    "shape_rec",
    "number_rec",
  ];

  return activities.map((actType) => {
    const actResponses = responses.filter((r) => r.activity_type === actType);
    const total = actResponses.length;
    const correct = actResponses.filter((r) => r.correct).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const totalTime = actResponses.reduce((acc, r) => acc + (r.response_time_ms || 0), 0);
    const avgTime = total > 0 ? Math.round(totalTime / total) : 0;

    const info = ACTIVITY_INFOS[actType];

    return {
      activity_type: actType,
      title_english: info.title_english,
      title_sinhala: info.title_sinhala,
      total_questions: total,
      correct_count: correct,
      accuracy_percent: accuracy,
      performance_level: getPerformanceLevel(accuracy),
      avg_time_ms: avgTime,
    };
  });
}

export function formatTimeSeconds(ms: number): string {
  if (!ms || ms === 0) return "0s";
  return `${(ms / 1000).toFixed(1)}s`;
}
