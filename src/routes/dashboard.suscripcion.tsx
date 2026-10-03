import { createFileRoute } from "@tanstack/react-router";
import { DashSuscripcion } from "@/components/fluxo/DashPages";

export const Route = createFileRoute("/dashboard/suscripcion")({ component: DashSuscripcion });
