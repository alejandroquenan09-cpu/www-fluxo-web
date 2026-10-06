import { createFileRoute } from "@tanstack/react-router";
import { DashPerfil } from "@/components/fluxo/DashPages";

export const Route = createFileRoute("/dashboard/perfil")({ head: () => ({ meta: [
  { title: "Mi perfil — Fluxo" },
  { name: "description", content: "Consulta y actualiza tu perfil de Fluxo." },
  { property: "og:title", content: "Mi perfil — Fluxo" },
  { property: "og:description", content: "Consulta y actualiza tu perfil de Fluxo." },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "robots", content: "noindex" },
] }), component: DashPerfil });
