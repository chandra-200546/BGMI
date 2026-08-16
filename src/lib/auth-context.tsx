import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { isSupabaseConfigured, supabase, syncClientAuthConfig } from "./supabase";

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
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithGoogle: () => Promise<void>;
  login: (profile: UserProfile) => void;
  logout: () => void;
  addChallenge: (challenge: Omit<RegisteredChallenge, "id" | "registeredAt">) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_KEY = "lordsesports_user_session";
const DEMO_CHALLENGES_KEY = "lordsesports_user_challenges";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authModalOpen, setAuthModalOpen] = useState(false);

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

  function openAuthModal() {
    setAuthModalOpen(true);
  }

  function closeAuthModal() {
    setAuthModalOpen(false);
  }

  // Sync Auth credentials & listen to Supabase auth state
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function initAuth() {
      await syncClientAuthConfig();

      // Check current session
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const u = data.session.user;
        setUser({
          email: u.email ?? "player@gmail.com",
          name:
            u.user_metadata?.full_name ||
            u.user_metadata?.name ||
            u.email?.split("@")[0] ||
            "Google Player",
          avatarUrl: u.user_metadata?.avatar_url || u.user_metadata?.picture,
          bgmiUid: u.user_metadata?.bgmi_uid,
          teamName: u.user_metadata?.team_name,
        });
      }

      // Listen for auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const u = session.user;
          setUser({
            email: u.email ?? "player@gmail.com",
            name:
              u.user_metadata?.full_name ||
              u.user_metadata?.name ||
              u.email?.split("@")[0] ||
              "Google Player",
            avatarUrl: u.user_metadata?.avatar_url || u.user_metadata?.picture,
            bgmiUid: u.user_metadata?.bgmi_uid,
            teamName: u.user_metadata?.team_name,
          });
          setAuthModalOpen(false);
        } else if (_event === "SIGNED_OUT") {
          setUser(null);
        }
      });

      unsubscribe = () => authListener.subscription.unsubscribe();
    }

    void initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
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
    await syncClientAuthConfig();

    const pendingTournamentId = typeof window !== "undefined" ? sessionStorage.getItem("lordsesports_pending_tournament_id") : null;
    const redirectPath = pendingTournamentId
      ? `/register?tournamentId=${encodeURIComponent(pendingTournamentId)}`
      : typeof window !== "undefined"
      ? window.location.pathname + window.location.search
      : "/register";

    const targetRedirect = typeof window !== "undefined" ? `${window.location.origin}${redirectPath}` : "https://lordsesports.in/register";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: targetRedirect,
      },
    });

    if (error) {
      console.warn("Supabase SDK OAuth notice, triggering server OAuth endpoint:", error.message);
      if (typeof window !== "undefined") {
        window.location.href = `/api/auth/google?redirect_to=${encodeURIComponent(targetRedirect)}`;
      }
    }
  }

  function login(profile: UserProfile) {
    setUser(profile);
    setAuthModalOpen(false);
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
        authModalOpen,
        openAuthModal,
        closeAuthModal,
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
