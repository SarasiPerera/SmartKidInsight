import React, { useState, useEffect } from "react";
import {
  ActivityType,
  AssessmentResponse,
  AssessmentSession,
  ChildProfile,
  UserProfile,
} from "./types";
import { SessionStore } from "./lib/sessionStore";
import { DataAPI } from "./db/api";
import { Navbar } from "./components/Navbar";
import { unlockAudio } from "./lib/audioUnlock";

// Screen Imports
import { AuthScreen } from "./screens/AuthScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { ProfileCreateScreen } from "./screens/ProfileCreateScreen";
import { ActivityMenuScreen } from "./screens/ActivityMenuScreen";
import { ActivityPlayScreen } from "./screens/ActivityPlayScreen";
import { RestBreakScreen } from "./screens/RestBreakScreen";
import { ResultsScreen } from "./screens/ResultsScreen";
import { DashboardScreen } from "./screens/DashboardScreen";

import { motion, AnimatePresence } from "motion/react";
import { Home, Play, BarChart2, Volume2, Shield } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentChild, setCurrentChild] = useState<ChildProfile | null>(null);
  const [activeScreen, setActiveScreen] = useState<string>("home");

  // Active Session State
  const [activeSession, setActiveSession] = useState<AssessmentSession | null>(null);
  const [sessionResponses, setSessionResponses] = useState<AssessmentResponse[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>("sinhala_letters");

  // Initialize session state on startup
  useEffect(() => {
    const user = SessionStore.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    const child = SessionStore.getCurrentChild();
    if (child) {
      setCurrentChild(child);
    }
  }, []);

  // Handler for user login / sign-up
  const handleSignInSuccess = (user: UserProfile) => {
    unlockAudio();
    setCurrentUser(user);
    setActiveScreen("welcome");
  };

  const handleSignOut = () => {
    localStorage.removeItem("smartkid_current_user");
    setCurrentUser(null);
    setActiveScreen("auth");
  };

  // Launch screening session for selected child
  const startNewScreeningSession = (childToUse?: ChildProfile) => {
    unlockAudio();
    const targetChild = childToUse || currentChild;
    if (!targetChild) {
      setActiveScreen("profile-create");
      return;
    }

    const newSession: AssessmentSession = {
      session_id: "ses_" + Math.random().toString(36).substring(2, 9),
      child_id: targetChild.child_id,
      age_band: targetChild.age_band,
      completed_activities: [],
      start_time: new Date().toISOString(),
      is_complete: false,
    };

    SessionStore.setActiveSession(newSession);
    setActiveSession(newSession);
    setSessionResponses([]);
    setActiveScreen("activity-menu");
  };

  // Activity Completion
  const handleActivityCompleted = () => {
    if (!activeSession) return;

    const updatedActivities = Array.from(
      new Set([...activeSession.completed_activities, selectedActivity])
    );

    const updatedSession: AssessmentSession = {
      ...activeSession,
      completed_activities: updatedActivities,
    };

    SessionStore.setActiveSession(updatedSession);
    setActiveSession(updatedSession);

    // Auto trigger rest break if 2 activities completed, or return to activity menu
    if (updatedActivities.length === 2) {
      setActiveScreen("rest-break");
    } else {
      setActiveScreen("activity-menu");
    }
  };

  // Complete entire session
  const handleFinishSession = async () => {
    if (activeSession) {
      const finalSession: AssessmentSession = {
        ...activeSession,
        end_time: new Date().toISOString(),
        is_complete: true,
      };

      await DataAPI.saveSession(finalSession, sessionResponses);
      setActiveSession(finalSession);
    }

    setActiveScreen("results");
  };

  // Render view
  if (!currentUser) {
    return <AuthScreen onSignInSuccess={handleSignInSuccess} />;
  }

  // Active screen component renderer
  const renderScreenContent = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeScreen}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        {activeScreen === "home" && (
          <HomeScreen
            currentUser={currentUser}
            currentChild={currentChild}
            onSelectChild={(child) => {
              SessionStore.setCurrentChild(child);
              setCurrentChild(child);
            }}
            onCreateChildClick={() => setActiveScreen("profile-create")}
            onStartSession={() => startNewScreeningSession()}
            onNavigate={(screen) => setActiveScreen(screen)}
          />
        )}

        {activeScreen === "welcome" && (
          <WelcomeScreen
            onContinue={() => {
              if (currentChild) {
                startNewScreeningSession();
              } else {
                setActiveScreen("profile-create");
              }
            }}
          />
        )}

        {activeScreen === "profile-create" && (
          <ProfileCreateScreen
            currentUser={currentUser}
            onChildCreated={(child) => {
              setCurrentChild(child);
              startNewScreeningSession(child);
            }}
            onCancel={() => setActiveScreen("home")}
          />
        )}

        {activeScreen === "activity-menu" && currentChild && activeSession && (
          <ActivityMenuScreen
            currentChild={currentChild}
            session={activeSession}
            onSelectActivity={(actType) => {
              setSelectedActivity(actType);
              setActiveScreen("activity-play");
            }}
            onTriggerRestBreak={() => setActiveScreen("rest-break")}
            onFinishSession={handleFinishSession}
          />
        )}

        {activeScreen === "activity-play" && currentChild && activeSession && (
          <ActivityPlayScreen
            activityType={selectedActivity}
            currentChild={currentChild}
            session={activeSession}
            onActivityComplete={handleActivityCompleted}
            onBackToMenu={() => setActiveScreen("activity-menu")}
          />
        )}

        {activeScreen === "rest-break" && (
          <RestBreakScreen
            onContinueSession={() => setActiveScreen("activity-menu")}
            onFinishSession={handleFinishSession}
          />
        )}

        {activeScreen === "results" && currentChild && (
          <ResultsScreen
            currentChild={currentChild}
            responses={
              sessionResponses.length > 0
                ? sessionResponses
                : SessionStore.getActiveSessionResponses()
            }
            onGoHome={() => setActiveScreen("home")}
            onViewDashboard={() => setActiveScreen("dashboard")}
          />
        )}

        {activeScreen === "dashboard" && <DashboardScreen />}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-[#FFF7ED] text-slate-800 flex flex-col font-sans selection:bg-orange-200">
      <Navbar
        currentUser={currentUser}
        currentChild={currentChild}
        activeScreen={activeScreen}
        onNavigate={(screen) => setActiveScreen(screen)}
        onSignOut={handleSignOut}
      />

      {/* Main Responsive Application Shell */}
      <main className="flex-1 max-w-5xl w-full mx-auto py-4 px-3 sm:px-6 pb-24 md:pb-10">
        {renderScreenContent()}
      </main>

      {/* Mobile App Navigation Dock Bar for smartphones */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-orange-100 p-2 z-50 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveScreen("home")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-3 rounded-xl transition-all ${
            activeScreen === "home" ? "text-orange-600 bg-orange-50" : "text-slate-500"
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            if (currentChild && activeSession) {
              setActiveScreen("activity-menu");
            } else if (currentChild) {
              startNewScreeningSession();
            } else {
              setActiveScreen("profile-create");
            }
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-3 rounded-xl transition-all ${
            activeScreen.startsWith("activity") ? "text-orange-600 bg-orange-50" : "text-slate-500"
          }`}
        >
          <Play className="w-5 h-5" />
          <span>Screening</span>
        </button>

        <button
          onClick={() => setActiveScreen("dashboard")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-3 rounded-xl transition-all ${
            activeScreen === "dashboard" ? "text-blue-600 bg-blue-50" : "text-slate-500"
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          <span>Metrics</span>
        </button>

        <button
          onClick={() => unlockAudio()}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-3 rounded-xl text-amber-700 bg-amber-50 active:scale-95 transition-transform"
          title="Tap to unlock audio playback permissions"
        >
          <Volume2 className="w-5 h-5 text-amber-600" />
          <span>Audio</span>
        </button>
      </div>
    </div>
  );
}
