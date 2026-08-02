import { ActivityInfo, ActivityType, QuestionItem, AgeBand } from "../types";

export const ACTIVITY_INFOS: Record<ActivityType, ActivityInfo> = {
  sinhala_letters: {
    type: "sinhala_letters",
    title_sinhala: "සිංහල අකුරු",
    title_english: "Sinhala Letters",
    description_sinhala: "අකුර බලලා නිවැරදි අකුර තෝරන්න",
    icon_name: "Aperture",
    color_theme: "#F97316", // Primary Orange
    bg_gradient: "from-orange-100 to-amber-50 border-orange-300",
  },
  word_picture: {
    type: "word_picture",
    title_sinhala: "වචන - රූප ගැළපීම",
    title_english: "Word–Picture Matching",
    description_sinhala: "වචනයට ගැලපෙන රූපය තෝරන්න",
    icon_name: "Image",
    color_theme: "#3B82F6", // Sky Blue
    bg_gradient: "from-blue-100 to-indigo-50 border-blue-300",
  },
  color_rec: {
    type: "color_rec",
    title_sinhala: "පාට හඳුනාගැනීම",
    title_english: "Colour Recognition",
    description_sinhala: "ලබාදී ඇති පාට තෝරන්න",
    icon_name: "Palette",
    color_theme: "#22C55E", // Green
    bg_gradient: "from-emerald-100 to-green-50 border-emerald-300",
  },
  shape_rec: {
    type: "shape_rec",
    title_sinhala: "හැඩතල හඳුනාගැනීම",
    title_english: "Shape Recognition",
    description_sinhala: "නිවැරදි හැඩතලය තෝරන්න",
    icon_name: "Shapes",
    color_theme: "#8B5CF6", // Purple
    bg_gradient: "from-purple-100 to-fuchsia-50 border-purple-300",
  },
  number_rec: {
    type: "number_rec",
    title_sinhala: "ඉලක්කම් සහ ගණන් කිරීම",
    title_english: "Number Recognition",
    description_sinhala: "වස්තු ගණන් කර නිවැරදි ඉලක්කම තෝරන්න",
    icon_name: "Hash",
    color_theme: "#EC4899", // Pink
    bg_gradient: "from-pink-100 to-rose-50 border-pink-300",
  },
};

export const RAW_QUESTIONS: QuestionItem[] = [
  // --- 1. SINHALA LETTERS ---
  {
    id: "let_01",
    activity_type: "sinhala_letters",
    prompt_sinhala: "මෙම අකුර කුමක්ද? 'අ'",
    prompt_english: "Find the letter 'අ' (A)",
    audio_label_sinhala: "අකුර අ තෝරන්න",
    age_bands: ["3-4", "4-5", "5-6"],
    choices: [
      { id: "c1", text: "අ", is_correct: true },
      { id: "c2", text: "ආ", is_correct: false },
      { id: "c3", text: "ඉ", is_correct: false },
      { id: "c4", text: "උ", is_correct: false },
    ],
  },
  {
    id: "let_02",
    activity_type: "sinhala_letters",
    prompt_sinhala: "මෙම අකුර කුමක්ද? 'ක'",
    prompt_english: "Find the letter 'ක' (Ka)",
    audio_label_sinhala: "අකුර ක තෝරන්න",
    age_bands: ["3-4", "4-5", "5-6"],
    choices: [
      { id: "c1", text: "ක", is_correct: true },
      { id: "c2", text: "ත", is_correct: false },
      { id: "c3", text: "ම", is_correct: false },
      { id: "c4", text: "ප", is_correct: false },
    ],
  },
  {
    id: "let_03",
    activity_type: "sinhala_letters",
    prompt_sinhala: "මෙම අකුර කුමක්ද? 'ම'",
    prompt_english: "Find the letter 'ම' (Ma)",
    audio_label_sinhala: "අකුර ම තෝරන්න",
    age_bands: ["3-4", "4-5", "5-6"],
    choices: [
      { id: "c1", text: "ම", is_correct: true },
      { id: "c2", text: "ර", is_correct: false },
      { id: "c3", text: "ග", is_correct: false },
      { id: "c4", text: "ස", is_correct: false },
    ],
  },
  {
    id: "let_04",
    activity_type: "sinhala_letters",
    prompt_sinhala: "මෙම අකුර කුමක්ද? 'ත'",
    prompt_english: "Find the letter 'ත' (Tha)",
    audio_label_sinhala: "අකුර ත තෝරන්න",
    age_bands: ["4-5", "5-6"],
    choices: [
      { id: "c1", text: "ත", is_correct: true },
      { id: "c2", text: "න", is_correct: false },
      { id: "c3", text: "ද", is_correct: false },
      { id: "c4", text: "ල", is_correct: false },
    ],
  },
  {
    id: "let_05",
    activity_type: "sinhala_letters",
    prompt_sinhala: "මෙම අකුර කුමක්ද? 'ප'",
    prompt_english: "Find the letter 'ප' (Pa)",
    audio_label_sinhala: "අකුර ප තෝරන්න",
    age_bands: ["5-6"],
    choices: [
      { id: "c1", text: "ප", is_correct: true },
      { id: "c2", text: "ව", is_correct: false },
      { id: "c3", text: "ය", is_correct: false },
      { id: "c4", text: "ච", is_correct: false },
    ],
  },

  // --- 2. WORD–PICTURE MATCHING ---
  {
    id: "word_01",
    activity_type: "word_picture",
    prompt_sinhala: "ඇපල් (Apple)",
    prompt_english: "Match the word 'ඇපල්' (Apple)",
    audio_label_sinhala: "ඇපල් රූපය තෝරන්න",
    age_bands: ["3-4", "4-5", "5-6"],
    choices: [
      { id: "c1", emoji: "🍎", is_correct: true },
      { id: "c2", emoji: "🍌", is_correct: false },
      { id: "c3", emoji: "🐱", is_correct: false },
      { id: "c4", emoji: "🚗", is_correct: false },
    ],
  },
  {
    id: "word_02",
    activity_type: "word_picture",
    prompt_sinhala: "අලියා (Elephant)",
    prompt_english: "Match the word 'අලියා' (Elephant)",
    audio_label_sinhala: "අලියාගේ රූපය තෝරන්න",
    age_bands: ["3-4", "4-5", "5-6"],
    choices: [
      { id: "c1", emoji: "🐘", is_correct: true },
      { id: "c2", emoji: "🐶", is_correct: false },
      { id: "c3", emoji: "🐟", is_correct: false },
      { id: "c4", emoji: "🦆", is_correct: false },
    ],
  },
  {
    id: "word_03",
    activity_type: "word_picture",
    prompt_sinhala: "මල (Flower)",
    prompt_english: "Match the word 'මල' (Flower)",
    audio_label_sinhala: "මලෙහි රූපය තෝරන්න",
    age_bands: ["3-4", "4-5", "5-6"],
    choices: [
      { id: "c1", emoji: "🌸", is_correct: true },
      { id: "c2", emoji: "🌳", is_correct: false },
      { id: "c3", emoji: "⭐", is_correct: false },
      { id: "c4", emoji: "🎈", is_correct: false },
    ],
  },
  {
    id: "word_04",
    activity_type: "word_picture",
    prompt_sinhala: "මාළුවා (Fish)",
    prompt_english: "Match the word 'මාළුවා' (Fish)",
    audio_label_sinhala: "මාළුවාගේ රූපය තෝරන්න",
    age_bands: ["4-5", "5-6"],
    choices: [
      { id: "c1", emoji: "🐟", is_correct: true },
      { id: "c2", emoji: "🦋", is_correct: false },
      { id: "c3", emoji: "🐸", is_correct: false },
      { id: "c4", emoji: "🐝", is_correct: false },
    ],
  },
  {
    id: "word_05",
    activity_type: "word_picture",
    prompt_sinhala: "පොත (Book)",
    prompt_english: "Match the word 'පොත' (Book)",
    audio_label_sinhala: "පොතෙහි රූපය තෝරන්න",
    age_bands: ["5-6"],
    choices: [
      { id: "c1", emoji: "📚", is_correct: true },
      { id: "c2", emoji: "✏️", is_correct: false },
      { id: "c3", emoji: "🎨", is_correct: false },
      { id: "c4", emoji: "✂️", is_correct: false },
    ],
  },

  // --- 3. COLOUR RECOGNITION ---
  {
    id: "col_01",
    activity_type: "color_rec",
    prompt_sinhala: "රතු පාට (Red)",
    prompt_english: "Identify 'රතු' (Red)",
    audio_label_sinhala: "රතු පාට තෝරන්න",
    age_bands: ["3-4", "4-5", "5-6"],
    choices: [
      { id: "c1", color_hex: "#EF4444", is_correct: true },
      { id: "c2", color_hex: "#3B82F6", is_correct: false },
      { id: "c3", color_hex: "#22C55E", is_correct: false },
      { id: "c4", color_hex: "#EAB308", is_correct: false },
    ],
  },
  {
    id: "col_02",
    activity_type: "color_rec",
    prompt_sinhala: "නිල් පාට (Blue)",
    prompt_english: "Identify 'නිල්' (Blue)",
    audio_label_sinhala: "නිල් පාට තෝරන්න",
    age_bands: ["3-4", "4-5", "5-6"],
    choices: [
      { id: "c1", color_hex: "#3B82F6", is_correct: true },
      { id: "c2", color_hex: "#EF4444", is_correct: false },
      { id: "c3", color_hex: "#A855F7", is_correct: false },
      { id: "c4", color_hex: "#F97316", is_correct: false },
    ],
  },
  {
    id: "col_03",
    activity_type: "color_rec",
    prompt_sinhala: "කොළ පාට (Green)",
    prompt_english: "Identify 'කොළ' (Green)",
    audio_label_sinhala: "කොළ පාට තෝරන්න",
    age_bands: ["3-4", "4-5", "5-6"],
    choices: [
      { id: "c1", color_hex: "#22C55E", is_correct: true },
      { id: "c2", color_hex: "#EAB308", is_correct: false },
      { id: "c3", color_hex: "#3B82F6", is_correct: false },
      { id: "c4", color_hex: "#EC4899", is_correct: false },
    ],
  },
  {
    id: "col_04",
    activity_type: "color_rec",
    prompt_sinhala: "කහ පාට (Yellow)",
    prompt_english: "Identify 'කහ' (Yellow)",
    audio_label_sinhala: "කහ පාට තෝරන්න",
    age_bands: ["4-5", "5-6"],
    choices: [
      { id: "c1", color_hex: "#EAB308", is_correct: true },
      { id: "c2", color_hex: "#F97316", is_correct: false },
      { id: "c3", color_hex: "#10B981", is_correct: false },
      { id: "c4", color_hex: "#6366F1", is_correct: false },
    ],
  },
  {
    id: "col_05",
    activity_type: "color_rec",
    prompt_sinhala: "දම් පාට (Purple)",
    prompt_english: "Identify 'දම්' (Purple)",
    audio_label_sinhala: "දම් පාට තෝරන්න",
    age_bands: ["5-6"],
    choices: [
      { id: "c1", color_hex: "#A855F7", is_correct: true },
      { id: "c2", color_hex: "#EC4899", is_correct: false },
      { id: "c3", color_hex: "#3B82F6", is_correct: false },
      { id: "c4", color_hex: "#14B8A6", is_correct: false },
    ],
  },

  // --- 4. SHAPE RECOGNITION ---
  {
    id: "shp_01",
    activity_type: "shape_rec",
    prompt_sinhala: "වෘත්තය (Circle)",
    prompt_english: "Identify 'වෘත්තය' (Circle)",
    audio_label_sinhala: "වෘත්තය හැඩය තෝරන්න",
    age_bands: ["3-4", "4-5", "5-6"],
    choices: [
      { id: "c1", shape_type: "circle", is_correct: true },
      { id: "c2", shape_type: "square", is_correct: false },
      { id: "c3", shape_type: "triangle", is_correct: false },
      { id: "c4", shape_type: "star", is_correct: false },
    ],
  },
  {
    id: "shp_02",
    activity_type: "shape_rec",
    prompt_sinhala: "සමචතුරස්‍රය (Square)",
    prompt_english: "Identify 'සමචතුරස්‍රය' (Square)",
    audio_label_sinhala: "සමචතුරස්‍රය හැඩය තෝරන්න",
    age_bands: ["3-4", "4-5", "5-6"],
    choices: [
      { id: "c1", shape_type: "square", is_correct: true },
      { id: "c2", shape_type: "circle", is_correct: false },
      { id: "c3", shape_type: "oval", is_correct: false },
      { id: "c4", shape_type: "rectangle", is_correct: false },
    ],
  },
  {
    id: "shp_03",
    activity_type: "shape_rec",
    prompt_sinhala: "ත්‍රිකෝණය (Triangle)",
    prompt_english: "Identify 'ත්‍රිකෝණය' (Triangle)",
    audio_label_sinhala: "ත්‍රිකෝණය හැඩය තෝරන්න",
    age_bands: ["3-4", "4-5", "5-6"],
    choices: [
      { id: "c1", shape_type: "triangle", is_correct: true },
      { id: "c2", shape_type: "square", is_correct: false },
      { id: "c3", shape_type: "heart", is_correct: false },
      { id: "c4", shape_type: "circle", is_correct: false },
    ],
  },
  {
    id: "shp_04",
    activity_type: "shape_rec",
    prompt_sinhala: "තරුව (Star)",
    prompt_english: "Identify 'තරුව' (Star)",
    audio_label_sinhala: "තරුව හැඩය තෝරන්න",
    age_bands: ["4-5", "5-6"],
    choices: [
      { id: "c1", shape_type: "star", is_correct: true },
      { id: "c2", shape_type: "heart", is_correct: false },
      { id: "c3", shape_type: "rectangle", is_correct: false },
      { id: "c4", shape_type: "oval", is_correct: false },
    ],
  },
  {
    id: "shp_05",
    activity_type: "shape_rec",
    prompt_sinhala: "හදවත (Heart)",
    prompt_english: "Identify 'හදවත' (Heart)",
    audio_label_sinhala: "හදවත හැඩය තෝරන්න",
    age_bands: ["5-6"],
    choices: [
      { id: "c1", shape_type: "heart", is_correct: true },
      { id: "c2", shape_type: "oval", is_correct: false },
      { id: "c3", shape_type: "triangle", is_correct: false },
      { id: "c4", shape_type: "square", is_correct: false },
    ],
  },

  // --- 5. NUMBER RECOGNITION & COUNTING ---
  {
    id: "num_01",
    activity_type: "number_rec",
    prompt_sinhala: "🍎🍎 (ඇපල් 2ක්)",
    prompt_english: "Count objects: 🍎🍎 (How many?)",
    audio_label_sinhala: "ඇපල් කීයක් තිබේද? ගණන් කර තෝරන්න",
    age_bands: ["3-4", "4-5", "5-6"],
    choices: [
      { id: "c1", text: "2 (දෙක)", is_correct: true },
      { id: "c2", text: "1 (එක)", is_correct: false },
      { id: "c3", text: "3 (තුන)", is_correct: false },
      { id: "c4", text: "4 (හතර)", is_correct: false },
    ],
  },
  {
    id: "num_02",
    activity_type: "number_rec",
    prompt_sinhala: "🎈🎈🎈 (බැලූන් 3ක්)",
    prompt_english: "Count objects: 🎈🎈🎈 (How many?)",
    audio_label_sinhala: "බැලූන් කීයක් තිබේද? ගණන් කර තෝරන්න",
    age_bands: ["3-4", "4-5", "5-6"],
    choices: [
      { id: "c1", text: "3 (තුන)", is_correct: true },
      { id: "c2", text: "2 (දෙක)", is_correct: false },
      { id: "c3", text: "4 (හතර)", is_correct: false },
      { id: "c4", text: "5 (පහ)", is_correct: false },
    ],
  },
  {
    id: "num_03",
    activity_type: "number_rec",
    prompt_sinhala: "⭐ (තරුව 1යි)",
    prompt_english: "Count objects: ⭐ (How many?)",
    audio_label_sinhala: "තරු කීයක් තිබේද? ගණන් කර තෝරන්න",
    age_bands: ["3-4", "4-5", "5-6"],
    choices: [
      { id: "c1", text: "1 (එක)", is_correct: true },
      { id: "c2", text: "3 (තුන)", is_correct: false },
      { id: "c3", text: "2 (දෙක)", is_correct: false },
      { id: "c4", text: "4 (හතර)", is_correct: false },
    ],
  },
  {
    id: "num_04",
    activity_type: "number_rec",
    prompt_sinhala: "🚗🚗🚗🚗 (කාර් 4ක්)",
    prompt_english: "Count objects: 🚗🚗🚗🚗 (How many?)",
    audio_label_sinhala: "කාර් කීයක් තිබේද? ගණන් කර තෝරන්න",
    age_bands: ["4-5", "5-6"],
    choices: [
      { id: "c1", text: "4 (හතර)", is_correct: true },
      { id: "c2", text: "3 (තුන)", is_correct: false },
      { id: "c3", text: "5 (පහ)", is_correct: false },
      { id: "c4", text: "6 (හය)", is_correct: false },
    ],
  },
  {
    id: "num_05",
    activity_type: "number_rec",
    prompt_sinhala: "🦆🦆🦆🦆🦆 (තාරාවන් 5ක්)",
    prompt_english: "Count objects: 🦆🦆🦆🦆🦆 (How many?)",
    audio_label_sinhala: "තාරාවන් කීයක් තිබේද? ගණන් කර තෝරන්න",
    age_bands: ["5-6"],
    choices: [
      { id: "c1", text: "5 (පහ)", is_correct: true },
      { id: "c2", text: "4 (හතර)", is_correct: false },
      { id: "c3", text: "6 (හය)", is_correct: false },
      { id: "c4", text: "3 (තුන)", is_correct: false },
    ],
  },
];

/**
 * Filter choices by age band rules:
 * - 3–4 years: 2 choices
 * - 4–5 years: 3 choices
 * - 5–6 years: 4 choices
 */
export function getQuestionsForActivityAndAge(
  activityType: ActivityType,
  ageBand: AgeBand
): QuestionItem[] {
  const filtered = RAW_QUESTIONS.filter(
    (q) => q.activity_type === activityType && q.age_bands.includes(ageBand)
  );

  const numChoices = ageBand === "3-4" ? 2 : ageBand === "4-5" ? 3 : 4;

  return filtered.map((q) => {
    const correctChoice = q.choices.find((c) => c.is_correct) || q.choices[0];
    const incorrectChoices = q.choices.filter((c) => !c.is_correct);

    // Pick (numChoices - 1) incorrect choices
    const selectedIncorrect = incorrectChoices.slice(0, numChoices - 1);
    const combinedChoices = [correctChoice, ...selectedIncorrect];

    // Shuffle choices deterministically/randomly
    const shuffled = [...combinedChoices].sort(() => 0.5 - Math.random());

    return {
      ...q,
      choices: shuffled,
    };
  });
}
