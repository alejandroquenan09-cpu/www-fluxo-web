import { createFileRoute } from "@tanstack/react-router";
import { DashSuscripcion } from "@/components/fluxo/DashPages";

export const Route = createFileRoute("/dashboard/suscripcion")({ head: () => ({ meta: [
  { title: "Mi suscripción — Fluxo" },
  { name: "description", content: "Consulta el estado de tu suscripción en Fluxo." },
  { property: "og:title", content: "Mi suscripción — Fluxo" },
  { property: "og:description", content: "Consulta el estado de tu suscripción en Fluxo." },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "robots", content: "noindex" },
] }), component: DashSuscripcion });
