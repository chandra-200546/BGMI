import { createFileRoute } from "@tanstack/react-router";
import { AppRouter } from "../components/AppRouter";

export const Route = createFileRoute("/leaderboard")({
  component: AppRouter,
});
