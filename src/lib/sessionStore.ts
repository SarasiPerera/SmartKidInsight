import {
  AgeBand,
  AssessmentResponse,
  AssessmentSession,
  ChildProfile,
  UserProfile,
  UserRole,
} from "../types";

const CURRENT_USER_KEY = "smartkid_current_user";
const CURRENT_CHILD_KEY = "smartkid_current_child";
const ACTIVE_SESSION_KEY = "smartkid_active_session";
const SESSION_RESPONSES_KEY = "smartkid_session_responses";

export class SessionStore {
  public static getCurrentUser(): UserProfile {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    // Default guest profile if not set
    const defaultUser: UserProfile = {
      id: "usr_parent_1",
      email: "parent@smartkid.lk",
      role: "parent",
      created_at: new Date().toISOString(),
    };
    this.setCurrentUser(defaultUser);
    return defaultUser;
  }

  public static setCurrentUser(user: UserProfile): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  public static getCurrentChild(): ChildProfile | null {
    try {
      const data = localStorage.getItem(CURRENT_CHILD_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return null;
  }

  public static setCurrentChild(child: ChildProfile): void {
    localStorage.setItem(CURRENT_CHILD_KEY, JSON.stringify(child));
  }

  public static generateAnonymisedChildId(): string {
    const hex = Math.random().toString(16).substring(2, 10).toUpperCase();
    return `KID-${hex}`;
  }

  public static createChildProfile(
    nickname: string,
    age_band: AgeBand,
    avatar_index: number,
    owner_id: string
  ): ChildProfile {
    const newChild: ChildProfile = {
      child_id: this.generateAnonymisedChildId(),
      nickname, // Local storage ONLY!
      age_band,
      avatar_index,
      owner_id,
      created_at: new Date().toISOString(),
    };

    // Save in local list of child profiles
    const list = this.getLocalChildrenList();
    list.push(newChild);
    localStorage.setItem("smartkid_local_children", JSON.stringify(list));

    this.setCurrentChild(newChild);
    return newChild;
  }

  public static getLocalChildrenList(): ChildProfile[] {
    try {
      const data = localStorage.getItem("smartkid_local_children");
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  }

  public static getActiveSession(): AssessmentSession | null {
    try {
      const data = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return null;
  }

  public static setActiveSession(session: AssessmentSession | null): void {
    if (!session) {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
      localStorage.removeItem(SESSION_RESPONSES_KEY);
    } else {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
    }
  }

  public static getActiveSessionResponses(): AssessmentResponse[] {
    try {
      const data = localStorage.getItem(SESSION_RESPONSES_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  }

  public static addSessionResponse(resp: AssessmentResponse): void {
    const list = this.getActiveSessionResponses();
    list.push(resp);
    localStorage.setItem(SESSION_RESPONSES_KEY, JSON.stringify(list));
  }
}
