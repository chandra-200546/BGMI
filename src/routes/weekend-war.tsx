import { createFileRoute } from "@tanstack/react-router";
import { AppRouter } from "../components/AppRouter";

export const Route = createFileRoute("/weekend-war")({
  component: AppRouter,
});
