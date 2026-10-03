import { useQuery } from "@tanstack/react-query";
import { servicesQuery } from "@/lib/catalog";
import { ServiceCard } from "./ServiceCard";
import { Reveal } from "./Reveal";

export function ServicesGrid() {
  const { data: services = [], isLoading } = useQuery(servicesQuery);
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {isLoading &&
        [0, 1, 2].map((i) => <div key={i} className="glass h-64 animate-pulse rounded-3xl" />)}
      {services.map((s, i) => (
        <Reveal key={s.id} delay={i * 100} className="h-full">
          <ServiceCard service={s} />
        </Reveal>
      ))}
    </div>
  );
}
