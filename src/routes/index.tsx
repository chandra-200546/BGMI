import { createFileRoute } from "@tanstack/react-router";
import { AppRouter } from "../components/AppRouter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LordsEsports BGMI - Hardcore Esports Registration" },
      {
        name: "description",
        content:
          "Real-time BGMI tournament registration with live leaderboards, match schedule, team hall of fame, and automated points calculation.",
      },
      { property: "og:title", content: "LordsEsports BGMI - Register Your Squad" },
      {
        property: "og:description",
        content:
          "A battle-royale esports tournament platform powered by live Supabase data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppRouter,
});
