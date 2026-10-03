import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/fluxo/SiteLayout";
import { Reveal } from "@/components/fluxo/Reveal";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre Fluxo — Un flujo que nunca se detiene" },
      { name: "description", content: "La historia y la idea detrás de Fluxo: tecnología que evoluciona como el agua." },
      { property: "og:title", content: "Sobre Fluxo" },
      { property: "og:description", content: "Tecnología que evoluciona como el agua." },
    ],
  }),
  component: About,
});

const LINES = [
  ["Movimiento", "El agua nunca se queda quieta. La tecnología tampoco."],
  ["Evolución", "Fluxo se renueva constantemente para que nunca quedes desactualizado."],
  ["Simplicidad", "Menos ruido, más claridad. Todo en un solo flujo."],
];

function About() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 pt-36 sm:px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Sobre Fluxo</p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-6xl">
            La tecnología es un <span className="text-flow">flujo</span> que nunca se detiene.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Fluxo nace de una idea simple: avanzar al mismo ritmo que la tecnología. Como el agua, nos adaptamos, evolucionamos y seguimos adelante.
          </p>
        </Reveal>
        <div className="mt-16 space-y-4">
          {LINES.map(([t, d], i) => (
            <Reveal key={t} delay={i * 100} className="glass sheen flex flex-col gap-2 rounded-3xl p-6 sm:flex-row sm:items-center sm:gap-10 sm:p-8">
              <span className="font-display text-sm text-muted-foreground">0{i + 1}</span>
              <h3 className="text-2xl font-semibold sm:w-48">{t}</h3>
              <p className="text-muted-foreground">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
