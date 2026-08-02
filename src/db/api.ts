import {
  AssessmentResponse,
  AssessmentSession,
  ChildProfile,
  DomainScore,
  UserProfile,
} from "../types";
import { OfflineQueue } from "../lib/offlineQueue";

export class DataAPI {
  // Save a response item (supports offline write queueing)
  public static async saveResponse(
    response: AssessmentResponse
  ): Promise<boolean> {
    try {
      const res = await fetch("/api/data/responses/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: [response] }),
      });
      if (res.ok) return true;
      throw new Error("API call failed");
    } catch (e) {
      console.warn("Network error during saveResponse, enqueueing offline item...");
      OfflineQueue.enqueue("response", response);
      return false;
    }
  }

  // Save session record
  public static async saveSession(
    session: AssessmentSession,
    responses: AssessmentResponse[]
  ): Promise<boolean> {
    try {
      const res = await fetch("/api/data/responses/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session, responses }),
      });
      if (res.ok) return true;
      throw new Error("Session batch failed");
    } catch (e) {
      console.warn("Network error saving session, queueing offline");
      OfflineQueue.enqueue("session", { session, responses });
      return false;
    }
  }

  // Fetch all sessions (from server or local backup)
  public static async fetchAllSessions(): Promise<AssessmentSession[]> {
    try {
      const res = await fetch("/api/data/sessions");
      if (res.ok) {
        const data = await res.json();
        return data.sessions || [];
      }
    } catch (e) {
      console.warn("Failed to fetch sessions from server", e);
    }
    return [];
  }

  // Fetch all responses (from server or local backup)
  public static async fetchAllResponses(): Promise<AssessmentResponse[]> {
    try {
      const res = await fetch("/api/data/responses");
      if (res.ok) {
        const data = await res.json();
        return data.responses || [];
      }
    } catch (e) {
      console.warn("Failed to fetch responses from server", e);
    }
    return [];
  }

  // Export full JSON dataset
  public static async exportJSONData(): Promise<any> {
    try {
      const res = await fetch("/api/data/export");
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("JSON export fetch failed", e);
    }
    return null;
  }
}
