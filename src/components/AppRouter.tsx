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
import { TermsPage, PrivacyPage, ContactPage, AboutPage } from "../pages/TermsPrivacy";

export function AppRouter() {
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
