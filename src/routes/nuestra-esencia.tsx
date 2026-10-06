import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, SectionHeader } from "@/components/fluxo/SiteLayout";
import { Reveal } from "@/components/fluxo/Reveal";
import {
  Compass,
  Target,
  Eye,
  Droplets,
  Waves,
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  Lock,
  Scale,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/nuestra-esencia")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Nuestra Esencia — Propósito, Valores y Ética de Fluxo" },
      { name: "description", content: "Conoce el propósito, misión, visión, valores y la ética profesional que guían cada servicio en Fluxo." },
      { property: "og:title", content: "Nuestra Esencia — Fluxo" },
      { property: "og:description", content: "Tecnología con propósito humano, diagnósticos honestos y transparencia." },
    ],
  }),
  component: NuestraEsenciaPage,
});

const PILARES_ESTRATEGICOS = [
  {
    icon: Compass,
    tag: "Nuestra Razón de Ser",
    title: "Propósito",
    destacado: "Humanizar y democratizar la tecnología.",
    desc: "Transformamos problemas técnicos complejos en soluciones transparentes, cercanas y comprensibles, eliminando las barreras entre las personas y sus herramientas digitales.",
  },
  {
    icon: Target,
    tag: "Lo Que Hacemos Hoy",
    title: "Misión",
    destacado: "Hacer que la tecnología fluya para personas y empresas.",
    desc: "Proveer soporte informático, conectividad, desarrollo web y seguridad con precios justos, atención personalizada y diagnósticos 100% sinceros.",
  },
  {
    icon: Eye,
    tag: "Hacia Dónde Vamos",
    title: "Visión",
    destacado: "El estándar de confianza tecnológica del país.",
    desc: "Ser el referente líder en soluciones tecnológicas accesibles y fiables en Colombia, reconocidos por priorizar siempre a las personas sobre los números.",
  },
];

const VALORES = [
  {
    icon: Droplets,
    title: "Claridad Cristalina",
    desc: "Hablamos en lenguaje sencillo y transparente. Precios claros desde el inicio, reserva del 10% y cero costos ocultos.",
  },
  {
    icon: Waves,
    title: "Flujo y Adaptabilidad",
    desc: "Nos moldeamos a tus necesidades. Como el agua, buscamos siempre la solución más eficiente para cada caso particular.",
  },
  {
    icon: HeartHandshake,
    title: "Cercanía Humana",
    desc: "Detrás de cada computador o red hay una persona. Acompañamos con empatía y atención personalizada en cada visita.",
  },
  {
    icon: Sparkles,
    title: "Evolución Constante",
    desc: "Adoptamos lo mejor de la tecnología moderna e inteligencia artificial para ofrecerte soporte de vanguardia.",
  },
];

const ETICA = [
  {
    icon: ShieldCheck,
    title: "Diagnósticos Honestos",
    desc: "Nunca inventamos fallas ni reemplazamos piezas que no lo requieran. Si la solución es simple, te lo decimos con sinceridad.",
  },
  {
    icon: Lock,
    title: "Privacidad Inquebrantable",
    desc: "Tus archivos, configuraciones y datos empresariales son sagrados. Operamos bajo estricta confidencialidad.",
  },
  {
    icon: Scale,
    title: "Equidad Sin Exclusiones",
    desc: "En Fluxo todos los clientes reciben la misma dedicación y calidad. No creemos en planes premium ni en tratos preferenciales.",
  },
];

function NuestraEsenciaPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 pt-36 pb-20 sm:px-6">
        {/* Encabezado */}
        <Reveal>
          <SectionHeader
            eyebrow="Nuestra Esencia"
            title="Principios que fluyen con propósito."
            subtitle="Creemos que la tecnología debe ser comprensible, transparente y cercana. Estos son los cimientos con los que trabajamos cada día."
          />
        </Reveal>

        {/* Sección 1: Propósito, Misión y Visión (Tríptico) */}
        <div className="mt-16">
          <div className="grid gap-6 md:grid-cols-3">
            {PILARES_ESTRATEGICOS.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={i * 100}>
                  <div className="glass sheen flex h-full flex-col justify-between rounded-3xl p-8 transition-transform duration-300 hover:-translate-y-1">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                          {p.tag}
                        </span>
                      </div>
                      <h3 className="mt-5 font-display text-2xl font-bold">{p.title}</h3>
                      <p className="mt-2 text-base font-medium text-foreground/90 leading-snug">
                        "{p.destacado}"
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Sección 2: Valores */}
        <div className="mt-20">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Nuestros Valores</h2>
            <p className="mt-2 text-muted-foreground">La filosofía que guía cada interacción y proyecto que asumimos.</p>
          </Reveal>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALORES.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.title} delay={i * 80}>
                  <div className="glass sheen flex h-full flex-col rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Sección 3: Ética Profesional */}
        <div className="mt-20">
          <Reveal>
            <div className="glass sheen rounded-3xl p-8 sm:p-12">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Compromiso de Honor</span>
              <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Nuestra Ética Profesional</h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Reglas claras que rigen cada visita técnica, desarrollo de software y mantenimiento.
              </p>

              <div className="mt-10 grid gap-8 md:grid-cols-3">
                {ETICA.map((e) => {
                  const Icon = e.icon;
                  return (
                    <div key={e.title} className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h4 className="font-display text-base font-semibold">{e.title}</h4>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Llamado a la acción */}
        <Reveal delay={150}>
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">¿Tienes alguna duda o quieres conocer cómo trabajamos en un caso real?</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="flow" size="lg">
                <Link to="/servicios">
                  Explorar servicios <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="glass" size="lg">
                <Link to="/ia">Hablar con Floppy</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
