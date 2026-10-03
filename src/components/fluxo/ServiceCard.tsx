import { Link } from "@tanstack/react-router";
import { ArrowUpRight, LayoutGrid, Sparkles, Waves, type LucideIcon } from "lucide-react";
import { TiltCard } from "./TiltCard";
import type { Service } from "@/lib/catalog";

/** Map icon keys stored in the database to icons. Add new keys here as services grow. */
const ICONS: Record<string, LucideIcon> = { sparkles: Sparkles, layout: LayoutGrid, waves: Waves };

/** Where each service's "learn more" leads. Unlisted services fall back to /servicios. */
const LINKS: Record<string, "/ia" | "/dashboard" | "/servicios"> = { "fluxo-ia": "/ia", "espacio-personal": "/dashboard" };

export function ServiceCard({ service }: { service: Service }) {
  const Icon = ICONS[service.icon] ?? Sparkles;
  const soon = service.status === "soon";
  return (
    <TiltCard className="h-full p-6 sm:p-7">
      <div className="flex items-start justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/25 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
          <Icon className="h-5 w-5" />
        </span>
        {soon && (
          <span className="rounded-full border border-glass-border px-2.5 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            Pronto
          </span>
        )}
      </div>
      <h3 className="mt-6 text-xl font-semibold">{service.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
      <Link
        to={LINKS[service.slug] ?? "/servicios"}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all hover:gap-2.5"
      >
        {soon ? "Ver novedades" : "Conocer más"} <ArrowUpRight className="h-4 w-4" />
      </Link>
    </TiltCard>
  );
}
