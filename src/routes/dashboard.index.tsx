import { createFileRoute } from "@tanstack/react-router";
import { DashHome } from "@/components/fluxo/DashPages";

export const Route = createFileRoute("/dashboard/")({ head: () => ({ meta: [
  { title: "Inicio personal — Fluxo" },
  { name: "description", content: "Tu espacio de servicios y asistencia en Fluxo." },
  { property: "og:title", content: "Inicio personal — Fluxo" },
  { property: "og:description", content: "Tu espacio de servicios y asistencia en Fluxo." },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "robots", content: "noindex" },
] }), component: DashHome });
