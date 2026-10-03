import { createFileRoute } from "@tanstack/react-router";
import { DashHome } from "@/components/fluxo/DashPages";

export const Route = createFileRoute("/dashboard/")({ component: DashHome });
