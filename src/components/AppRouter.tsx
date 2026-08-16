import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { HomePage } from "../pages/Home";
import { WeekendWarPage } from "../pages/WeekendWar";
import { DailyGrindPage } from "../pages/DailyGrind";
import { LeaderboardPage } from "../pages/Leaderboard";
import { WeeklyPointsPage } from "../pages/WeeklyPoints";
import { RegisterPage } from "../pages/Register";
import { TeamsPage } from "../pages/Teams";
import { SchedulePage } from "../pages/Schedule";
import { AdminPage } from "../pages/Admin";
import { DashboardPage } from "../pages/Dashboard";
import { TermsPage, PrivacyPage, ContactPage, AboutPage } from "../pages/TermsPrivacy";

export function AppRouter() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Layout>
        <HomePage />
      </Layout>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/weekend-war" element={<WeekendWarPage />} />
          <Route path="/daily-grind" element={<DailyGrindPage />} />
          <Route path="/points-table" element={<LeaderboardPage />} />
          <Route path="/weekly-points" element={<WeeklyPointsPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
