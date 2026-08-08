import { createFileRoute } from "@tanstack/react-router";
import { AppRouter } from "../components/AppRouter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NexBattles BGMI - Hardcore Esports Registration" },
      {
        name: "description",
        content:
          "Real-time BGMI tournament registration with live leaderboards, match schedule, team hall of fame, and cinematic gaming animations.",
      },
      { property: "og:title", content: "NexBattles BGMI - Register Your Squad" },
      {
        property: "og:description",
        content:
          "A hardcore battle-royale tournament platform powered by live Supabase tournament data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppRouter,
});
