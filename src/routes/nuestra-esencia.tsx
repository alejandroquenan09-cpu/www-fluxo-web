import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, SectionHeader } from "@/components/fluxo/SiteLayout";
import { PlansGrid } from "@/components/fluxo/PlansGrid";
import { Reveal } from "@/components/fluxo/Reveal";

export const Route = createFileRoute("/nuestra-esencia")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Planes — Fluxo" },
      { name: "description", content: "Plan Gratis y Premium de Fluxo. Empieza sin costo y amplía cuando quieras." },
      { property: "og:title", content: "Planes — Fluxo" },
      { property: "og:description", content: "Empieza gratis. Amplía cuando lo necesites." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 pt-36 sm:px-6">
        <Reveal>
          <SectionHeader eyebrow="Planes" title="Elige cómo fluir." subtitle="Empieza gratis. Amplía cuando lo necesites." />
        </Reveal>
        <div className="mt-14">
          <PlansGrid />
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">Pagos procesados de forma segura. Nunca guardamos datos de tarjetas.</p>
      </section>
    </SiteLayout>
  ),
});
