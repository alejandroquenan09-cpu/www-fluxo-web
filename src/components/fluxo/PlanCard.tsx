import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Plan } from "@/lib/catalog";

export function PlanCard({ plan, highlight, action }: { plan: Plan; highlight?: boolean; action: ReactNode }) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-3xl p-7 sm:p-8 transition-transform duration-500 hover:-translate-y-1",
        highlight ? "glass-strong sheen shadow-glow" : "glass sheen",
      )}
    >
      {highlight && <div aria-hidden className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />}
      <div className="relative flex items-center justify-between">
        <h3 className="text-2xl font-semibold">{plan.name}</h3>
        {highlight && (
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/30">
            Recomendado
          </span>
        )}
      </div>
      <p className="relative mt-2 text-sm text-muted-foreground">{plan.description}</p>
      <p className="relative mt-6 font-display text-3xl font-semibold">
        {plan.price_label}
        {plan.id !== "free" && <span className="ml-1 text-sm font-normal text-muted-foreground">/ mes</span>}
      </p>
      <ul className="relative mt-6 flex-1 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
              <Check className="h-3 w-3" />
            </span>
            {f}
          </li>
        ))}
      </ul>
      <div className="relative mt-8">{action}</div>
    </div>
  );
}
