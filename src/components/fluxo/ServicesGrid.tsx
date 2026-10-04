import { useQuery } from "@tanstack/react-query";
import { servicesQuery } from "@/lib/catalog";
import { ServiceCard } from "./ServiceCard";
import { Reveal } from "./Reveal";

const EXCLUDED_SLUGS = ["fluxo-ia", "flujo-ia", "espacio-personal"];


export function ServicesGrid() {
  const { data: services = [], isLoading } = useQuery(servicesQuery);
  const filteredServices = services.filter((s) => !EXCLUDED_SLUGS.includes(s.slug));

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {isLoading &&
        [0, 1, 2].map((i) => <div key={i} className="glass h-64 animate-pulse rounded-3xl" />)}
      {filteredServices.map((s, i) => (
        <Reveal key={s.id} delay={i * 100} className="h-full">
          <ServiceCard service={s} />
        </Reveal>
      ))}
    </div>
  );
}
