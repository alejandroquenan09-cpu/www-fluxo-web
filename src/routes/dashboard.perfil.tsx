import { createFileRoute } from "@tanstack/react-router";
import { DashPerfil } from "@/components/fluxo/DashPages";

export const Route = createFileRoute("/dashboard/perfil")({ component: DashPerfil });
