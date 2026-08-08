import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { HomePage } from "../pages/Home";
import { RegisterPage } from "../pages/Register";
import { LeaderboardPage } from "../pages/Leaderboard";
import { SchedulePage } from "../pages/Schedule";
import { TeamsPage } from "../pages/Teams";
import { AdminPage } from "../pages/Admin";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
