export type UserRole = "parent" | "teacher" | "researcher";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export type AgeBand = "3-4" | "4-5" | "5-6";

export interface ChildProfile {
  child_id: string; // Anonymised format e.g. KID-7A9B3E2F
  nickname: string; // Local storage ONLY (never sent to backend)
  age_band: AgeBand;
  avatar_index: number;
  owner_id: string;
  created_at: string;
}

export type ActivityType =
  | "sinhala_letters"
  | "word_picture"
  | "color_rec"
  | "shape_rec"
  | "number_rec";

export interface ActivityInfo {
  type: ActivityType;
  title_sinhala: string;
  title_english: string;
  description_sinhala: string;
  icon_name: string;
  color_theme: string;
  bg_gradient: string;
}

export type ShapeType =
  | "circle"
  | "square"
  | "triangle"
  | "rectangle"
  | "star"
  | "oval"
  | "heart";

export interface ChoiceOption {
  id: string;
  text?: string;
  emoji?: string;
  color_hex?: string;
  shape_type?: ShapeType;
  is_correct: boolean;
}

export interface QuestionItem {
  id: string;
  activity_type: ActivityType;
  prompt_sinhala: string;
  prompt_english: string;
  audio_label_sinhala: string;
  age_bands: AgeBand[];
  choices: ChoiceOption[];
}

export interface AssessmentSession {
  session_id: string;
  child_id: string;
  age_band: AgeBand;
  completed_activities: ActivityType[];
  start_time: string;
  end_time?: string;
  is_complete: boolean;
}

export interface AssessmentResponse {
  response_id: string;
  session_id: string;
  child_id: string;
  activity_type: ActivityType;
  item_id: string;
  selected_answer: string;
  correct: boolean;
  response_time_ms: number;
  attempt_number: number;
  timestamp: number;
}

export type PerformanceLevel = "Strong" | "Developing" | "Weak";

export interface DomainScore {
  activity_type: ActivityType;
  title_english: string;
  title_sinhala: string;
  total_questions: number;
  correct_count: number;
  accuracy_percent: number;
  performance_level: PerformanceLevel;
  avg_time_ms: number;
}

export interface OfflineQueueItem {
  id: string;
  type: "response" | "session";
  payload: any;
  created_at: number;
}
