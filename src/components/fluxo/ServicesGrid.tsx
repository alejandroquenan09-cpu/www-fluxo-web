import { useEffect, useState, useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import { FLUXO_SERVICES, CATEGORIES, type ServiceCategory, type ServiceItem } from "@/lib/catalog";
import { ServiceCard } from "./ServiceCard";
import { Reveal } from "./Reveal";

export function ServicesGrid() {
  const [selectedCategory, setSelectedCategory] = useState<"todos" | ServiceCategory>("todos");
  const href = useRouterState({ select: (s) => s.location.href });
  const [target, setTarget] = useState<{ slug: string; book: boolean; n: number } | null>(null);

  // Permite abrir un servicio por URL (ej: ?servicio=mantenimiento-preventivo&reservar=1)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const slug = p.get("servicio");
    if (slug) {
      const found = FLUXO_SERVICES.find((s) => s.slug === slug);
      if (found) setSelectedCategory(found.category);
      setTarget({ slug, book: p.get("reservar") === "1", n: Date.now() });
    }
  }, [href]);

  const filteredServices = useMemo(() => {
    if (selectedCategory === "todos") return FLUXO_SERVICES;
    return FLUXO_SERVICES.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Selector de categorías tipo pastilla */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((cat) => {
          const count = cat.id === "todos"
            ? FLUXO_SERVICES.length
            : FLUXO_SERVICES.filter((s) => s.category === cat.id).length;
          const active = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                  : "glass text-muted-foreground hover:text-foreground hover:bg-glass-strong"
              }`}
            >
              <span>{cat.label}</span>
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grilla con los servicios detallados */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((s, i) => (
          <Reveal key={s.id} delay={(i % 6) * 60} className="h-full">
            <ServiceCard
              service={s}
              openSignal={target?.slug === s.slug ? target.n : undefined}
              bookSignal={target?.slug === s.slug ? target.book : undefined}
            />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
