import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Modality } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";

app.use(express.json());

// Initialize Gemini API client on server-side if key is present
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// In-memory server backup database for response data sync
const inMemoryDatabase = {
  profiles: [] as any[],
  child_profiles: [] as any[],
  sessions: [] as any[],
  responses: [] as any[],
};

// Seed default initial mock research session data if empty
if (inMemoryDatabase.sessions.length === 0) {
  const mockChild1 = "KID-7A9B3E2F";
  const mockChild2 = "KID-4C1D8F9A";
  const mockChild3 = "KID-9E2B5A1C";

  inMemoryDatabase.child_profiles.push(
    { child_id: mockChild1, age_band: "3-4", avatar_index: 0, owner_id: "usr_parent_1" },
    { child_id: mockChild2, age_band: "4-5", avatar_index: 2, owner_id: "usr_parent_2" },
    { child_id: mockChild3, age_band: "5-6", avatar_index: 4, owner_id: "usr_teacher_1" }
  );

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  // Add 12 historical sessions with realistic performance across age bands & domains
  const mockSessions = [
    { session_id: "ses_101", child_id: mockChild1, age_band: "3-4", completed_activities: ["sinhala_letters", "word_picture", "color_rec"], start_time: new Date(now - 7 * day).toISOString(), end_time: new Date(now - 7 * day + 600000).toISOString(), is_complete: true },
    { session_id: "ses_102", child_id: mockChild1, age_band: "3-4", completed_activities: ["sinhala_letters", "word_picture", "shape_rec", "number_rec"], start_time: new Date(now - 5 * day).toISOString(), end_time: new Date(now - 5 * day + 540000).toISOString(), is_complete: true },
    { session_id: "ses_103", child_id: mockChild1, age_band: "3-4", completed_activities: ["sinhala_letters", "word_picture", "color_rec", "shape_rec", "number_rec"], start_time: new Date(now - 2 * day).toISOString(), end_time: new Date(now - 2 * day + 480000).toISOString(), is_complete: true },
    
    { session_id: "ses_201", child_id: mockChild2, age_band: "4-5", completed_activities: ["sinhala_letters", "word_picture", "color_rec"], start_time: new Date(now - 6 * day).toISOString(), end_time: new Date(now - 6 * day + 620000).toISOString(), is_complete: true },
    { session_id: "ses_202", child_id: mockChild2, age_band: "4-5", completed_activities: ["sinhala_letters", "word_picture", "color_rec", "shape_rec", "number_rec"], start_time: new Date(now - 3 * day).toISOString(), end_time: new Date(now - 3 * day + 510000).toISOString(), is_complete: true },
    { session_id: "ses_203", child_id: mockChild2, age_band: "4-5", completed_activities: ["sinhala_letters", "word_picture", "color_rec", "shape_rec", "number_rec"], start_time: new Date(now - 1 * day).toISOString(), end_time: new Date(now - 1 * day + 450000).toISOString(), is_complete: true },

    { session_id: "ses_301", child_id: mockChild3, age_band: "5-6", completed_activities: ["sinhala_letters", "word_picture", "color_rec", "shape_rec", "number_rec"], start_time: new Date(now - 4 * day).toISOString(), end_time: new Date(now - 4 * day + 420000).toISOString(), is_complete: true },
    { session_id: "ses_302", child_id: mockChild3, age_band: "5-6", completed_activities: ["sinhala_letters", "word_picture", "color_rec", "shape_rec", "number_rec"], start_time: new Date(now - 12 * Math.floor(day/2)).toISOString(), end_time: new Date(now - 12 * Math.floor(day/2) + 400000).toISOString(), is_complete: true },
  ];

  inMemoryDatabase.sessions.push(...mockSessions);

  // Generate corresponding responses for aggregate research views
  const activities = ["sinhala_letters", "word_picture", "color_rec", "shape_rec", "number_rec"];
  mockSessions.forEach((s) => {
    s.completed_activities.forEach((act) => {
      for (let i = 1; i <= 3; i++) {
        const isCorrect = Math.random() > 0.25; // 75% average baseline
        inMemoryDatabase.responses.push({
          response_id: `resp_${s.session_id}_${act}_${i}`,
          session_id: s.session_id,
          child_id: s.child_id,
          activity_type: act,
          item_id: `${act}_item_${i}`,
          selected_answer: "ans_sample",
          correct: isCorrect,
          response_time_ms: Math.floor(1200 + Math.random() * 2500),
          attempt_number: 1,
          timestamp: new Date(s.start_time).getTime() + i * 15000,
        });
      }
    });
  });
}

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", appName: "SmartKid Insight", time: new Date().toISOString() });
});

function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28);
  header.writeUInt16LE(numChannels * (bitsPerSample / 8), 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

// Server-side Text-To-Speech API endpoint (Gemini API + Google Translate TTS for Sinhala)
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voice } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text parameter is required" });
    }

    if (!ai && process.env.GEMINI_API_KEY) {
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }

    if (ai) {
      try {
        const prompt = `Say clearly in a gentle, warm, encouraging child-friendly voice in Sinhala: "${text}"`;
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{ parts: [{ text: prompt }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice || "Kore" },
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          const pcmBuffer = Buffer.from(base64Audio, "base64");
          const wavBuffer = pcmToWav(pcmBuffer, 24000, 1, 16);
          const wavBase64 = wavBuffer.toString("base64");
          return res.json({ audioBase64: wavBase64, format: "wav" });
        }
      } catch (geminiError: any) {
        console.warn("Gemini TTS fallback:", geminiError?.message || geminiError);
      }
    }

    // Secondary robust fallback: Fetch Sinhala TTS audio from Google Translate public endpoint
    try {
      const gttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=si&client=tw-ob`;
      const gttsResponse = await fetch(gttsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      if (gttsResponse.ok) {
        const arrayBuf = await gttsResponse.arrayBuffer();
        const base64Mp3 = Buffer.from(arrayBuf).toString("base64");
        return res.json({ audioBase64: base64Mp3, format: "mp3" });
      }
    } catch (gttsErr) {
      console.warn("Google Translate TTS fallback error:", gttsErr);
    }

    // Fallback response signaling browser speech synth or audio wave fallback
    return res.json({
      fallback: true,
      text: text,
      message: "Using Web Audio/Speech API fallback for Sinhala pronunciation",
    });
  } catch (error: any) {
    console.error("TTS endpoint error:", error);
    res.status(500).json({ error: "Failed to generate speech audio" });
  }
});

// Supabase sync proxy endpoints
app.get("/api/data/sessions", (req, res) => {
  res.json({ sessions: inMemoryDatabase.sessions });
});

app.get("/api/data/responses", (req, res) => {
  res.json({ responses: inMemoryDatabase.responses });
});

app.post("/api/data/responses/batch", (req, res) => {
  const { responses, session } = req.body;
  if (session) {
    const existingIndex = inMemoryDatabase.sessions.findIndex(s => s.session_id === session.session_id);
    if (existingIndex >= 0) {
      inMemoryDatabase.sessions[existingIndex] = session;
    } else {
      inMemoryDatabase.sessions.push(session);
    }
  }
  if (Array.isArray(responses)) {
    inMemoryDatabase.responses.push(...responses);
  }
  res.json({ success: true, count: responses?.length || 0 });
});

app.get("/api/data/export", (req, res) => {
  res.json({
    app: "SmartKid Insight",
    export_date: new Date().toISOString(),
    profiles: inMemoryDatabase.profiles,
    child_profiles: inMemoryDatabase.child_profiles,
    sessions: inMemoryDatabase.sessions,
    responses: inMemoryDatabase.responses,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`SmartKid Insight server running on http://${HOST}:${PORT}`);
  });
}

export default app;

if (!process.env.VERCEL) {
  startServer();
}
