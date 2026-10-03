import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { plansQuery } from "@/lib/catalog";
import { createCheckout } from "@/lib/billing/billing.functions";
import { useAuth } from "@/lib/auth";
import { PlanCard } from "./PlanCard";
import { Reveal } from "./Reveal";

export function PlansGrid({ currentPlan }: { currentPlan?: string }) {
  const { data: plans = [] } = useQuery(plansQuery);
  const { user } = useAuth();
  const navigate = useNavigate();
  const checkout = useServerFn(createCheckout);
  const [busy, setBusy] = useState<string | null>(null);

  const upgrade = async (planId: string) => {
    if (!user) return navigate({ to: "/auth", search: { mode: "signup" } });
    setBusy(planId);
    try {
      const res = await checkout({ data: { planId } });
      if (res.url) window.location.href = res.url;
      else toast.info(res.error ?? "No disponible todavía");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al iniciar el pago");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
      {plans.map((p, i) => {
        const isCurrent = currentPlan === p.id;
        const isFree = p.id === "free";
        return (
          <Reveal key={p.id} delay={i * 120} className="h-full">
            <PlanCard
              plan={p}
              highlight={!isFree}
              action={
                isCurrent ? (
                  <Button variant="glass" size="xl" className="w-full" disabled>
                    Tu plan actual
                  </Button>
                ) : isFree ? (
                  <Button asChild variant="glass" size="xl" className="w-full">
                    {user ? <Link to="/dashboard">Ir a mi panel</Link> : <Link to="/auth" search={{ mode: "signup" }}>Comenzar gratis</Link>}
                  </Button>
                ) : (
                  <Button variant="flow" size="xl" className="w-full" disabled={busy === p.id} onClick={() => upgrade(p.id)}>
                    {busy === p.id ? "Conectando…" : `Elegir ${p.name}`}
                  </Button>
                )
              }
            />
          </Reveal>
        );
      })}
    </div>
  );
}
