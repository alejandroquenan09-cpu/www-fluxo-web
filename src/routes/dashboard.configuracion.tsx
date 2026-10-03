import { createFileRoute } from "@tanstack/react-router";
import { DashConfig } from "@/components/fluxo/DashPages";

export const Route = createFileRoute("/dashboard/configuracion")({ component: DashConfig });
