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
  avatarUrl?: string;
  bgmiUid?: string;
  teamName?: string;
};

type AuthContextType = {
  user: UserProfile | null;
  userChallenges: RegisteredChallenge[];
  loginWithGoogle: () => Promise<void>;
  login: (profile: UserProfile) => void;
  logout: () => void;
  addChallenge: (challenge: Omit<RegisteredChallenge, "id" | "registeredAt">) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_KEY = "nexbattles_user_session";
const DEMO_CHALLENGES_KEY = "nexbattles_user_challenges";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem(DEMO_USER_KEY);
    return saved ? (JSON.parse(saved) as UserProfile) : null;
  });

  const [userChallenges, setUserChallenges] = useState<RegisteredChallenge[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(DEMO_CHALLENGES_KEY);
    return saved ? (JSON.parse(saved) as RegisteredChallenge[]) : [];
  });

  // Listen to Supabase auth state if configured
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          email: session.user.email ?? "player@gmail.com",
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Esports Player",
          avatarUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
          bgmiUid: session.user.user_metadata?.bgmi_uid,
          teamName: session.user.user_metadata?.team_name,
        });
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email ?? "player@gmail.com",
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Esports Player",
          avatarUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
          bgmiUid: session.user.user_metadata?.bgmi_uid,
          teamName: session.user.user_metadata?.team_name,
        });
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } else {
      login({
        email: "player.google@gmail.com",
        name: "Google Esports Player",
        bgmiUid: "5482910382",
        teamName: "Pro Squad",
      });
    }
  }

  function login(profile: UserProfile) {
    setUser(profile);
  }

  function logout() {
    if (isSupabaseConfigured()) {
      void supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(DEMO_USER_KEY);
  }

  function addChallenge(challenge: Omit<RegisteredChallenge, "id" | "registeredAt">) {
    const newChallenge: RegisteredChallenge = {
      ...challenge,
      id: `reg-${Date.now()}`,
      registeredAt: new Date().toISOString(),
    };
    setUserChallenges((prev) => [newChallenge, ...prev]);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userChallenges,
        loginWithGoogle,
        login,
        logout,
        addChallenge,
      }}
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
