import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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

  function login(profile: UserProfile) {
    setUser(profile);
  }

  function logout() {
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
    <AuthContext.Provider value={{ user, userChallenges, login, logout, addChallenge }}>
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
