import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout, SectionHeader } from "@/components/fluxo/SiteLayout";
import { Reveal } from "@/components/fluxo/Reveal";
import { ServicesGrid } from "@/components/fluxo/ServicesGrid";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Fluxo — Technology that never stops flowing" },
      { name: "description", content: "La tecnología nunca deja de avanzar. Nosotros tampoco. Descubre Fluxo: IA y servicios que evolucionan contigo." },
      { property: "og:title", content: "Fluxo — Technology that never stops flowing" },
      { property: "og:description", content: "La tecnología nunca deja de avanzar. Nosotros tampoco." },
    ],
  }),
  component: Home,
});

const PILLARS = [
  { icon: RefreshCw, title: "En evolución", text: "Fluxo se actualiza al ritmo de la tecnología para nunca quedarte atras." },
  { icon: Sparkles, title: "Inteligente", text: "IA integrada para ayudarte siempre, te presentamos a Floppy." },
];

function Home() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative px-4 pt-32 sm:px-6 sm:pt-40">
        <div className="mx-auto max-w-5xl text-center">
          <p className="inline-flex animate-fade-in items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Siempre en movimiento
          </p>
          <h1
            className="mt-8 animate-fade-in font-display text-[22vw] font-semibold leading-[0.85] tracking-[0.08em] sm:text-[11rem]"
            style={{ animationDelay: "80ms", animationFillMode: "both" }}
          >
            <span className="text-flow">FLUXO</span>
          </h1>
          <p
            className="mt-6 animate-fade-in font-display text-xl sm:text-3xl"
            style={{ animationDelay: "160ms", animationFillMode: "both" }}
          >
            Technology that never stops flowing.
          </p>
          <p
            className="mx-auto mt-3 max-w-xl animate-fade-in text-base text-muted-foreground sm:text-lg"
            style={{ animationDelay: "240ms", animationFillMode: "both" }}
          >
            La tecnología nunca deja de avanzar. Nosotros tampoco.
          </p>
          <div
            className="mt-10 flex animate-fade-in flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "320ms", animationFillMode: "both" }}
          >
            <Button asChild variant="flow" size="xl">
              <Link to="/auth" search={{ mode: "signup" }}>
                Comenzar ahora <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="glass" size="xl">
              <Link to="/servicios">Explorar Fluxo</Link>
            </Button>
          </div>
      </div>
    </section>

      {/* Concept */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
       
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 100} className="glass rounded-3xl p-6">
              <p.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
            </Reveal>
          ))}
        </div>  
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeader eyebrow="Servicios" title="Todo fluye en un solo lugar." />
        </Reveal>
        <div className="mt-12">
          <ServicesGrid />
        </div>
      </section>

      {/* AI teaser */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="glass-strong sheen relative overflow-hidden rounded-[2rem] p-8 sm:p-14">
          <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Floppy</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Una inteligencia que siempre esta para ayudarte.</h2>
              <p className="mt-4 text-muted-foreground">Pregunta, crea y resuelve. Tus conversaciones se guardan de forma privada en tu cuenta.</p>
              <Button asChild variant="flow" size="xl" className="mt-8">
                <Link to="/ia">
                  Probar Floppy <ArrowRight />
                </Link>
              </Button>
            </div>
            <div className="space-y-3">
              <div className="ml-auto w-fit max-w-[85%] rounded-3xl rounded-br-lg bg-flow px-4 py-3 text-sm text-primary-foreground">
                ayudame a solicitar un servicio
              </div>
              <div className="glass w-fit max-w-[85%] rounded-3xl rounded-bl-lg px-4 py-3 text-sm">
                Claro! Te dirigire al panel de servicios de fluxo.
              </div>
              <div className="glass flex w-fit gap-1.5 rounded-3xl rounded-bl-lg px-4 py-4">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="animate-typing h-1.5 w-1.5 rounded-full bg-primary" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

     
    </SiteLayout>
  );
}
