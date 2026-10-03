import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, SectionHeader } from "@/components/fluxo/SiteLayout";
import { ServicesGrid } from "@/components/fluxo/ServicesGrid";
import { Reveal } from "@/components/fluxo/Reveal";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios — Fluxo" },
      { name: "description", content: "Todo fluye en un solo lugar: los servicios de Fluxo, siempre en evolución." },
      { property: "og:title", content: "Servicios — Fluxo" },
      { property: "og:description", content: "Todo fluye en un solo lugar." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 pt-36 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Servicios"
            title="Todo fluye en un solo lugar."
            subtitle="Un ecosistema que crece. Nuevos servicios se suman al flujo con el tiempo."
          />
        </Reveal>
        <div className="mt-14">
          <ServicesGrid />
        </div>
      </section>
    </SiteLayout>
  ),
});
