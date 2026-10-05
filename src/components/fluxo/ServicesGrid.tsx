import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { servicesQuery } from "@/lib/catalog";
import { ServiceCard } from "./ServiceCard";
import { Reveal } from "./Reveal";

const EXCLUDED_SLUGS = ["fluxo-ia", "flujo-ia", "espacio-personal"];

export function ServicesGrid() {
  const { data: services = [], isLoading } = useQuery(servicesQuery);
  const filteredServices = services.filter((s) => !EXCLUDED_SLUGS.includes(s.slug));
  const href = useRouterState({ select: (s) => s.location.href });
  const [target, setTarget] = useState<{ slug: string; book: boolean; n: number } | null>(null);

  // Open a service (and optionally its booking form) from ?servicio=slug&reservar=1
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const slug = p.get("servicio");
    if (slug) setTarget({ slug, book: p.get("reservar") === "1", n: Date.now() });
  }, [href]);

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {isLoading &&
        [0, 1, 2].map((i) => <div key={i} className="glass h-64 animate-pulse rounded-3xl" />)}
      {filteredServices.map((s, i) => (
        <Reveal key={s.id} delay={i * 100} className="h-full">
          <ServiceCard
            service={s}
            openSignal={target?.slug === s.slug ? target.n : undefined}
            bookSignal={target?.slug === s.slug ? target.book : undefined}
          />
        </Reveal>
      ))}
    </div>
  );
}
