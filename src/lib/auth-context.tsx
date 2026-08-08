import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { isSupabaseConfigured, supabase } from "./supabase";

export type RegisteredChallenge = {
  id: string;
  tournamentId: string;
  tournamentName: string;
  teamName: string;
  captainName: string;
  captainEmail: string;
  bgmiUid: string;
  players: string[];
  status: "UNDER_REVIEW" | "APPROVED" | "WAITLISTED" | "REJECTED";
  paymentStatus: "PAID" | "PENDING_VERIFICATION";
  entryFee: string;
  registeredAt: string;
  matchTime: string;
  roomDetails?: { roomId?: string; password?: string; releaseAt?: string };
};

export type UserProfile = {
  email: string;
  name: string;
  bgmiUid?: string;
  teamName?: string;
};

type AuthContextType = {
  user: UserProfile | null;
  userChallenges: RegisteredChallenge[];
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  login: (profile: UserProfile) => void;
  logout: () => void;
  addChallenge: (challenge: Omit<RegisteredChallenge, "id" | "registeredAt">) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_KEY = "nexbattles_user_session";
const DEMO_CHALLENGES_KEY = "nexbattles_user_challenges";

const defaultChallenges: RegisteredChallenge[] = [
  {
    id: "reg-101",
    tournamentId: "t1",
    tournamentName: "Weekend War Championship (Season 4)",
    teamName: "Soul Ember",
    captainName: "Demon OP",
    captainEmail: "demon@soulember.esports",
    bgmiUid: "5482910382",
    players: ["Demon (C)", "Gobblin", "Mortal", "Viper"],
    status: "APPROVED",
    paymentStatus: "PAID",
    entryFee: "₹100",
    registeredAt: new Date(Date.now() - 86400000).toISOString(),
    matchTime: "Saturday, 08:00 PM IST",
    roomDetails: { releaseAt: "Saturday, 07:45 PM IST" },
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem(DEMO_USER_KEY);
    return saved ? (JSON.parse(saved) as UserProfile) : null;
  });

  const [userChallenges, setUserChallenges] = useState<RegisteredChallenge[]>(() => {
    if (typeof window === "undefined") return defaultChallenges;
    const saved = localStorage.getItem(DEMO_CHALLENGES_KEY);
    return saved ? (JSON.parse(saved) as RegisteredChallenge[]) : defaultChallenges;
  });

  // Listen to Supabase auth state if configured
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          email: session.user.email ?? "player@esports.com",
          name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0].toUpperCase() || "Player",
          bgmiUid: session.user.user_metadata?.bgmi_uid || "5482910382",
          teamName: session.user.user_metadata?.team_name || "Soul Ember",
        });
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email ?? "player@esports.com",
          name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0].toUpperCase() || "Player",
          bgmiUid: session.user.user_metadata?.bgmi_uid || "5482910382",
          teamName: session.user.user_metadata?.team_name || "Soul Ember",
        });
      } else {
        // preserve local user session if set manually
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(DEMO_USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(DEMO_CHALLENGES_KEY, JSON.stringify(userChallenges));
  }, [userChallenges]);

  async function loginWithGoogle() {
    if (isSupabaseConfigured()) {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
    } else {
      login({
        email: "player.pro@gmail.com",
        name: "Pro Esports Captain",
        bgmiUid: "5482910382",
        teamName: "Soul Ember",
      });
    }
  }

  async function loginWithEmail(email: string) {
    if (isSupabaseConfigured()) {
      await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin },
      });
    } else {
      login({
        email,
        name: email.split("@")[0].toUpperCase(),
        bgmiUid: "5129384712",
        teamName: "Hydra Ops",
      });
    }
  }

  function login(profile: UserProfile) {
    setUser(profile);
  }

  function logout() {
    if (isSupabaseConfigured()) {
      supabase.auth.signOut().catch(() => {});
    }
    setUser(null);
  }

  function addChallenge(challengeData: Omit<RegisteredChallenge, "id" | "registeredAt">) {
    const newChallenge: RegisteredChallenge = {
      ...challengeData,
      id: `reg-${Date.now().toString().slice(-4)}`,
      registeredAt: new Date().toISOString(),
    };
    setUserChallenges((prev) => [newChallenge, ...prev]);
  }

  return (
    <AuthContext.Provider
      value={{ user, userChallenges, loginWithGoogle, loginWithEmail, login, logout, addChallenge }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
