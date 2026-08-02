# SmartKid Insight 

An AI-assisted early literacy and cognitive skill screening tool for
Sinhala-speaking preschool children (ages 3–6) in Sri Lanka. This is the
web version, built with Vite + React + TypeScript, connected to the same
Firebase project as the companion Flutter app.

> **Ethics note:** This is a research tool under university ethics
> review. Do not use it to collect data from real children until formal
> ethics committee approval is confirmed.

## What this app does

- Five tap-and-select assessment activities: Sinhala letter recognition,
  word–picture matching, colour recognition, shape recognition, number
  recognition
- Age-tiered difficulty (2/3/4 answer choices for ages 3–4, 4–5, 5–6)
- Real user accounts via **Firebase Authentication** (parent/teacher/
  researcher roles)
- Response data written to **Cloud Firestore** in real time, matching the
  same schema used by the Flutter app — both apps share one dataset
- Offline queueing: if a write fails, it's queued locally and retried
- Session-length guard with a rest-break prompt
- Sinhala audio prompts via Gemini TTS, with a Google Translate TTS
  fallback if that fails
- A researcher/teacher dashboard view for aggregate progress

## Tech stack

- **Frontend**: Vite + React 19 + TypeScript, Tailwind CSS
- **Auth + database**: Firebase Authentication + Cloud Firestore
- **Server**: Express (Node), used for the Sinhala TTS endpoint — deployed
  as a Vercel serverless function via `api/index.ts`
- **AI voice**: Google Gemini API (`@google/genai`)

## Project structure

```
src/
  App.tsx                    — top-level routing/state, auth bootstrap
  types.ts                   — shared TypeScript types
  lib/
    firebase.ts              — Firebase client init
    firebaseAuth.ts          — sign up / sign in / sign out / auth state
    sessionStore.ts          — local-only cosmetic state (child profile,
                                active session) — NOT user identity
    scoring.ts                — Strong/Developing/Weak classification
    offlineQueue.ts           — retry queue for failed Firestore writes
    activityData.ts          — activity content pools
  db/
    api.ts                    — Firestore reads/writes (DataAPI class)
  screens/                    — one file per screen (Auth, Welcome,
                                 ProfileCreate, ActivityMenu, ActivityPlay,
                                 RestBreak, Results, Dashboard)
  components/                 — Navbar, OllieOwl mascot, ShapeIcon
server.ts                     — Express server (TTS endpoint only)
api/index.ts                  — Vercel serverless entry point wrapping server.ts
firestore.rules               — security rules (shared with the Flutter app)
```

## Setup

### 1. Install dependencies
```
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env.local` and fill in:

- `GEMINI_API_KEY` — from Google AI Studio
- `VITE_FIREBASE_*` (six values) — from Firebase Console → Project
  Settings → General → Your apps → Web app → SDK setup and configuration.
  **Use the same Firebase project as the Flutter app** so both write to
  one shared dataset.

### 3. Enable Firebase Authentication
In the Firebase Console → Authentication → Sign-in method → enable
**Email/Password**. It's off by default on a new project.

### 4. Deploy Firestore security rules (once)
```
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

### 5. Run locally
```
npm run dev
```
Opens at `http://localhost:3000`.

## Deploying to Vercel

1. Push this repo to GitHub (see project notes / prior setup steps).
2. In Vercel: **Add New Project → Import Git Repository**.
3. Under **Environment Variables**, add the same `GEMINI_API_KEY` and
   six `VITE_FIREBASE_*` values from your `.env.local`.
4. Deploy. `vercel.json` is already configured with the correct build
   command and API rewrites.
5. From then on, every `git push` to `main` triggers an automatic
   redeploy — no manual folder uploads needed.

## Known limitations / next steps

- Scoring (Strong/Developing/Weak) currently runs client-side — a
  separate Python/Flask analysis service (Module 2 in the project docs)
  is a future iteration, not required for this to work.
- The ANN-based recommendation engine (Module 3) is not implemented yet.
- `firestore.rules` is a starting point for role-based access — review
  before scaling beyond a small pilot.
- The Sinhala word list in `activityData.ts` should be verified by a
  Sinhala-speaking teacher before use in real data collection.
- No biometric data (voice recordings, facial images) is collected, per
  the project's ethical constraints — audio is generated (TTS output),
  never recorded from the child.

## Companion project

This web app shares a Firebase project and Firestore schema with a
Flutter mobile app (the approved production stack for this thesis). The
web app serves as a fast-iterating prototype and demo; the Flutter app is
the primary deliverable per the signed project proposal.
