import { createFileRoute } from "@tanstack/react-router";
import { DashServicios } from "@/components/fluxo/DashPages";

export const Route = createFileRoute("/dashboard/servicios")({ component: DashServicios });
