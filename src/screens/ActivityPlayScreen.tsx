import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ActivityType,
  AgeBand,
  AssessmentResponse,
  AssessmentSession,
  ChildProfile,
  QuestionItem,
  ChoiceOption,
} from "../types";
import { ACTIVITY_INFOS, getQuestionsForActivityAndAge } from "../lib/activityData";
import { SessionStore } from "../lib/sessionStore";
import { DataAPI } from "../db/api";
import { OllieOwl, OllieEmotion } from "../components/OllieOwl";
import { ShapeIcon } from "../components/ShapeIcon";
import { useTTS } from "../hooks/useTTS";
import { useSFX } from "../hooks/useSFX";
import {
  Volume2,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

interface ActivityPlayScreenProps {
  activityType: ActivityType;
  currentChild: ChildProfile;
  session: AssessmentSession;
  onActivityComplete: () => void;
  onBackToMenu: () => void;
}

export const ActivityPlayScreen: React.FC<ActivityPlayScreenProps> = ({
  activityType,
  currentChild,
  session,
  onActivityComplete,
  onBackToMenu,
}) => {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<"none" | "correct" | "incorrect">("none");
  const [mascotEmotion, setMascotEmotion] = useState<OllieEmotion>("cheerful");
  const [attemptNumber, setAttemptNumber] = useState(1);

  const startTimeRef = useRef<number>(Date.now());
  const info = ACTIVITY_INFOS[activityType];

  const { speakSinhala, isPlaying } = useTTS();
  const { playCorrectChime, playWrongBuzz, playFanfare } = useSFX();

  // Load age-tiered questions
  useEffect(() => {
    const qList = getQuestionsForActivityAndAge(activityType, currentChild.age_band);
    setQuestions(qList);
    setCurrentIndex(0);
    setFeedbackState("none");
    setSelectedChoiceId(null);
    setMascotEmotion("cheerful");
    startTimeRef.current = Date.now();
  }, [activityType, currentChild.age_band]);

  const currentQuestion = questions[currentIndex];

  // Auto-play TTS audio prompt when question loads
  const triggerPromptAudio = useCallback(() => {
    if (currentQuestion) {
      setMascotEmotion("speaking");
      speakSinhala(currentQuestion.audio_label_sinhala || currentQuestion.prompt_sinhala);
    }
  }, [currentQuestion, speakSinhala]);

  useEffect(() => {
    if (currentQuestion) {
      triggerPromptAudio();
    }
  }, [currentIndex, currentQuestion, triggerPromptAudio]);

  const handleChoiceTap = async (choice: ChoiceOption) => {
    if (feedbackState !== "none") return; // Prevent double taps during feedback

    const responseTimeMs = Date.now() - startTimeRef.current;
    setSelectedChoiceId(choice.id);

    const isCorrect = choice.is_correct;

    if (isCorrect) {
      setFeedbackState("correct");
      setMascotEmotion("bounce");
      playCorrectChime();
    } else {
      setFeedbackState("incorrect");
      setMascotEmotion("encouraging");
      playWrongBuzz();
    }

    // Record response
    const responseRecord: AssessmentResponse = {
      response_id: "resp_" + Math.random().toString(36).substring(2, 9),
      session_id: session.session_id,
      child_id: currentChild.child_id,
      activity_type: activityType,
      item_id: currentQuestion.id,
      selected_answer: choice.id,
      correct: isCorrect,
      response_time_ms: responseTimeMs,
      attempt_number: attemptNumber,
      timestamp: Date.now(),
    };

    SessionStore.addSessionResponse(responseRecord);
    DataAPI.saveResponse(responseRecord);

    // Transition to next question after 1.4s feedback
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setFeedbackState("none");
        setSelectedChoiceId(null);
        setMascotEmotion("cheerful");
        setAttemptNumber(1);
        startTimeRef.current = Date.now();
      } else {
        // Activity Finished!
        playFanfare();
        onActivityComplete();
      }
    }, 1400);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700">Loading Assessment Items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-5 pb-12">
      {/* Activity Top Bar Navigation & Progress */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <button
          onClick={onBackToMenu}
          className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit</span>
        </button>

        <div className="text-center">
          <h3 className="font-extrabold text-slate-800 text-sm md:text-base leading-tight">
            {info.title_sinhala}
          </h3>
          <p className="text-[11px] font-mono text-slate-500">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>

        <button
          onClick={triggerPromptAudio}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            isPlaying
              ? "bg-orange-500 text-white animate-pulse"
              : "bg-orange-100 text-orange-800 hover:bg-orange-200"
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>🔊 Read</span>
        </button>
      </div>

      {/* Item Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-orange-500 h-full transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Main Question Card with Ollie Mascot */}
      <div className="bg-white rounded-3xl p-6 border-2 border-orange-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full text-xs font-bold text-orange-700">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{currentQuestion.prompt_english}</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-snug">
            {currentQuestion.prompt_sinhala}
          </h2>

          <button
            onClick={triggerPromptAudio}
            className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-700 underline"
          >
            <Volume2 className="w-4 h-4" />
            <span>Tap to replay audio prompt</span>
          </button>
        </div>

        {/* Ollie Mascot Reaction */}
        <div className="shrink-0 flex items-center justify-center">
          <OllieOwl
            emotion={mascotEmotion}
            size={120}
            showSpeechBubble={feedbackState !== "none"}
            speechText={
              feedbackState === "correct"
                ? "නියමයි! හරි! 🎉"
                : feedbackState === "incorrect"
                ? "කමක් නෑ! නැවත උත්සාහ කරමු! 💛"
                : "අහන්න, උත්තරය තෝරන්න 🦉"
            }
          />
        </div>
      </div>

      {/* Tap-Only Answer Tiles (≥96×96dp large touch targets) */}
      <div className="pt-2">
        <p className="text-xs font-bold text-slate-500 mb-3 text-center">
          Tap the matching answer tile ({currentQuestion.choices.length} options for age {currentChild.age_band}):
        </p>

        <div
          className={`grid gap-4 ${
            currentQuestion.choices.length === 2
              ? "grid-cols-2"
              : currentQuestion.choices.length === 3
              ? "grid-cols-3"
              : "grid-cols-2 sm:grid-cols-4"
          }`}
        >
          {currentQuestion.choices.map((choice) => {
            const isSelected = selectedChoiceId === choice.id;
            let tileBg = "bg-white border-slate-200 hover:border-orange-400 hover:shadow-md";

            if (isSelected) {
              if (feedbackState === "correct") {
                tileBg = "bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200 scale-105";
              } else if (feedbackState === "incorrect") {
                tileBg = "bg-rose-100 border-rose-500 ring-4 ring-rose-200";
              }
            }

            return (
              <button
                key={choice.id}
                onClick={() => handleChoiceTap(choice)}
                disabled={feedbackState !== "none"}
                className={`min-h-[110px] p-4 rounded-3xl border-3 flex flex-col items-center justify-center transition-all cursor-pointer select-none active:scale-95 ${tileBg}`}
              >
                {/* 1. Text Choice (Sinhala character / number) */}
                {choice.text && (
                  <span className="text-3xl md:text-4xl font-black text-slate-800">
                    {choice.text}
                  </span>
                )}

                {/* 2. Emoji Choice (Word-Picture Matching) */}
                {choice.emoji && (
                  <span className="text-5xl md:text-6xl select-none">
                    {choice.emoji}
                  </span>
                )}

                {/* 3. Colour Swatch Choice */}
                {choice.color_hex && (
                  <div
                    className="w-16 h-16 rounded-2xl shadow-inner border-2 border-white/80"
                    style={{ backgroundColor: choice.color_hex }}
                  />
                )}

                {/* 4. Shape Choice (SVG ShapeIcon) */}
                {choice.shape_type && (
                  <ShapeIcon
                    shape={choice.shape_type}
                    size={64}
                    color="#3B82F6"
                  />
                )}

                {/* Feedback Badges */}
                {isSelected && feedbackState === "correct" && (
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-black text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" /> Correct
                  </span>
                )}
                {isSelected && feedbackState === "incorrect" && (
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-black text-rose-700">
                    <XCircle className="w-4 h-4" /> Try Next
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
