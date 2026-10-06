import { createFileRoute } from "@tanstack/react-router";
import { DashIA } from "@/components/fluxo/DashPages";

export const Route = createFileRoute("/dashboard/ia")({ head: () => ({ meta: [
  { title: "Asistente personal — Fluxo" },
  { name: "description", content: "Tus conversaciones privadas con la inteligencia artificial de Fluxo." },
  { property: "og:title", content: "Asistente personal — Fluxo" },
  { property: "og:description", content: "Tus conversaciones privadas con la inteligencia artificial de Fluxo." },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "robots", content: "noindex" },
] }), component: DashIA });
