import React, { useState } from "react";
import { AgeBand, ChildProfile, UserProfile } from "../types";
import { SessionStore } from "../lib/sessionStore";
import { OllieOwl } from "../components/OllieOwl";
import { User, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

interface ProfileCreateScreenProps {
  currentUser: UserProfile;
  onChildCreated: (child: ChildProfile) => void;
  onCancel: () => void;
}

const AVATARS = [
  { index: 0, emoji: "🐱", name: "Cat" },
  { index: 1, emoji: "🐰", name: "Bunny" },
  { index: 2, emoji: "🦁", name: "Lion" },
  { index: 3, emoji: "🐻", name: "Bear" },
  { index: 4, emoji: "🐼", name: "Panda" },
  { index: 5, emoji: "🐸", name: "Frog" },
];

export const ProfileCreateScreen: React.FC<ProfileCreateScreenProps> = ({
  currentUser,
  onChildCreated,
  onCancel,
}) => {
  const [nickname, setNickname] = useState("Nimali");
  const [ageBand, setAgeBand] = useState<AgeBand>("4-5");
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    const newChild = SessionStore.createChildProfile(
      nickname.trim(),
      ageBand,
      selectedAvatar,
      currentUser.id
    );

    onChildCreated(newChild);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-orange-100 p-6 md:p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <OllieOwl emotion="cheerful" size={90} />
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            Create Child Profile
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Set up screening profile for preschool assessment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Local Nickname Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <User className="w-4 h-4 text-orange-500" />
                Child Nickname
              </label>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Local Only (Private)
              </span>
            </div>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Nimali / Kusal"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Nickname is saved only on this device. The backend assigns an anonymous ID (<code>KID-XXXXXXXX</code>).
            </p>
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Choose Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((av) => (
                <button
                  key={av.index}
                  type="button"
                  onClick={() => setSelectedAvatar(av.index)}
                  className={`p-3 rounded-2xl text-2xl flex items-center justify-center transition-all ${
                    selectedAvatar === av.index
                      ? "bg-orange-100 border-2 border-orange-500 scale-110 shadow-sm"
                      : "bg-slate-50 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Age-Band Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Age Band (Years)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["3-4", "4-5", "5-6"] as AgeBand[]).map((ab) => (
                <button
                  key={ab}
                  type="button"
                  onClick={() => setAgeBand(ab)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    ageBand === ab
                      ? "border-orange-500 bg-orange-500 text-white font-black shadow-md scale-102"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold"
                  }`}
                >
                  <p className="text-sm">{ab} Yrs</p>
                  <p className="text-[10px] opacity-80 mt-0.5">
                    {ab === "3-4" ? "2 Choices" : ab === "4-5" ? "3 Choices" : "4 Choices"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-2xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs rounded-2xl shadow-md hover:from-orange-600 hover:to-amber-600 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Save & Start Session</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
