import { createFileRoute } from "@tanstack/react-router";
import { DashIA } from "@/components/fluxo/DashPages";

export const Route = createFileRoute("/dashboard/ia")({ component: DashIA });
