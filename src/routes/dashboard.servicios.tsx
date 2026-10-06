import { createFileRoute } from "@tanstack/react-router";
import { DashServicios } from "@/components/fluxo/DashPages";

export const Route = createFileRoute("/dashboard/servicios")({ head: () => ({ meta: [
  { title: "Servicios personales — Fluxo" },
  { name: "description", content: "Consulta los servicios desde tu espacio personal." },
  { property: "og:title", content: "Servicios personales — Fluxo" },
  { property: "og:description", content: "Consulta los servicios desde tu espacio personal." },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "robots", content: "noindex" },
] }), component: DashServicios });
