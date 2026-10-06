import { createFileRoute } from "@tanstack/react-router";
import { DashConfig } from "@/components/fluxo/DashPages";

export const Route = createFileRoute("/dashboard/configuracion")({ head: () => ({ meta: [
  { title: "Configuración — Fluxo" },
  { name: "description", content: "Gestiona las preferencias de tu cuenta de Fluxo." },
  { property: "og:title", content: "Configuración — Fluxo" },
  { property: "og:description", content: "Gestiona las preferencias de tu cuenta de Fluxo." },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "robots", content: "noindex" },
] }), component: DashConfig });
