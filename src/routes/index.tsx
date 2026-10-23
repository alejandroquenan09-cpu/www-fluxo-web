import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  ArrowRight, 
  Sparkles, 
  Wrench, 
  Wifi, 
  Code, 
  Cpu, 
  ShieldCheck, 
  PhoneCall, 
  CheckCircle2, 
  CreditCard 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/fluxo/SiteLayout";
import { Reveal } from "@/components/fluxo/Reveal";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Fluxo — Soluciones Tecnológicas que Fluyen Contigo" },
      { name: "description", content: "Mantenimiento, redes, desarrollo de software, automatización y seguridad técnica con atención personalizada e IA integrada." },
      { property: "og:title", content: "Fluxo — Soluciones Tecnológicas" },
      { property: "og:description", content: "Tecnología y servicios técnicos que nunca se detienen." },
    ],
  }),
  component: Home,
});

const SERVICE_PILLARS = [
  {
    icon: Wrench,
    title: "Mantenimiento & Hardware",
    desc: "Diagnóstico preventivo, reparación térmica y repotenciación para computadores y equipos de trabajo.",
    tag: "Equipos & PCs",
  },
  {
    icon: Wifi,
    title: "Redes & Conectividad",
    desc: "Diseño e instalación de cableado estructurado, Wi-Fi de alta cobertura y enlaces corporativos.",
    tag: "Infraestructura",
  },
  {
    icon: Code,
    title: "Desarrollo Web & Software",
    desc: "Sitios web rápidos, plataformas modernas y aplicaciones a medida para impulsar tu presencia digital.",
    tag: "Digital",
  },
  {
    icon: Cpu,
    title: "Soluciones Digitales",
    desc: "Automatización de tareas, gestión de respaldos en la nube y optimización de flujos operativos.",
    tag: "Productividad",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad & CCTV",
    desc: "Instalación de cámaras de videovigilancia IP, control de accesos y protección de infraestructura.",
    tag: "Protección",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    icon: Sparkles,
    title: "Elige o consulta a Floppy",
    desc: "Revisa nuestro catálogo de servicios o pídele a Floppy que te oriente según lo que necesita tu empresa u hogar.",
  },
  {
    step: "02",
    icon: CreditCard,
    title: "Reserva con el 10%",
    desc: "Aparta tu fecha con solo el 10% de anticipo. Un funcionario se comunicará para confirmar día, hora y ubicación.",
  },
  {
    step: "03",
    icon: CheckCircle2,
    title: "Ejecución y pago final",
    desc: "Realizamos el servicio con respaldo técnico garantizado. Cancelas el saldo restante en efectivo o transferencia al concretar.",
  },
];

function Home() {
  const { user } = useAuth();

  return (
    <SiteLayout>
      {/* Hero Principal */}
      <section className="relative px-4 pt-32 sm:px-6 sm:pt-40">
        <div className="mx-auto max-w-5xl text-center">
          <p className="inline-flex animate-fade-in items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Tecnología en constante evolución
          </p>
          <h1
            className="mt-8 animate-fade-in font-display text-[20vw] font-semibold leading-[0.85] tracking-[0.08em] sm:text-[10rem]"
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
            className="mx-auto mt-3 max-w-2xl animate-fade-in text-base text-muted-foreground sm:text-lg"
            style={{ animationDelay: "240ms", animationFillMode: "both" }}
          >
            Soluciones integrales de hardware, redes, software y seguridad para que tus operaciones fluyan sin interrupciones.
          </p>
          
          <div
            className="mt-10 flex animate-fade-in flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "320ms", animationFillMode: "both" }}
          >
            {!user ? (
              <>
                <Button asChild variant="flow" size="xl" className="shadow-glow">
                  <Link to="/auth" search={{ mode: "signup" }}>
                    Comenzar ahora <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="glass" size="xl">
                  <Link to="/servicios">Ver Servicios de Fluxo</Link>
                </Button>
              </>
            ) : (
              <Button
                asChild
                variant="flow"
                className="group h-14 sm:h-16 px-10 text-lg sm:text-xl font-bold shadow-glow hover:scale-105 transition-all duration-300 gap-3 rounded-full"
              >
                <Link to="/servicios">
                  <Sparkles className="h-5 w-5 animate-pulse text-primary-foreground" />
                  <span>Explorar Servicios de Fluxo</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 text-primary-foreground" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Franja de Estadísticas / Garantía */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-4 glass rounded-3xl p-6 sm:p-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="p-3">
            <p className="font-display text-3xl sm:text-4xl font-bold text-flow">10%</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Anticipo mínimo de reserva</p>
          </div>
          <div className="p-3">
            <p className="font-display text-3xl sm:text-4xl font-bold text-flow">5</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Especialidades técnicas</p>
          </div>
          <div className="p-3">
            <p className="font-display text-3xl sm:text-4xl font-bold text-flow">100%</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Garantía en mano de obra</p>
          </div>
          <div className="p-3">
            <p className="font-display text-3xl sm:text-4xl font-bold text-flow">24/7</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Asistencia con Floppy</p>
          </div>
        </Reveal>
      </section>

      {/* Especialidades de Fluxo */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Nuestras Capacidades</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold">Todo lo que resolvemos por ti</h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Desde la reparación de un equipo hasta la infraestructura tecnológica completa de tu empresa.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_PILLARS.map((item, idx) => (
            <Reveal
              key={item.title}
              delay={idx * 80}
              className={`glass-strong rounded-3xl p-6 relative overflow-hidden group hover:border-primary/40 transition-all duration-300 ${
                idx === 4 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl glass flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full glass text-muted-foreground">
                  {item.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              <div className="mt-5 pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                <span>Ver opciones en catálogo</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="flow" size="lg" className="rounded-full">
            <Link to="/servicios">
              Ver los 21 servicios detallados con precios <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Cómo trabajamos (3 pasos) */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="glass-strong rounded-[2.5rem] p-8 sm:p-14">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Proceso Simple</p>
            <h2 className="mt-2 text-3xl font-bold">¿Cómo contratar en Fluxo?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Transparencia total, sin cobros sorpresa y con confirmación directa por parte de nuestro equipo.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.step} delay={i * 120} className="glass rounded-3xl p-6 relative">
                <span className="font-display text-4xl font-black text-primary/20 absolute top-4 right-5 select-none">
                  {step.step}
                </span>
                <div className="h-10 w-10 rounded-xl bg-flow flex items-center justify-center text-primary-foreground mb-4">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Floppy AI Destacado */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <Reveal className="glass-strong sheen relative overflow-hidden rounded-[2.5rem] p-8 sm:p-14">
          <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Copiloto Inteligente</p>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Conoce a Floppy, tu guía en FLUXO</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                ¿No estás seguro de qué tipo de mantenimiento o instalación necesitas? Háblale o escríbele a Floppy para recibir una recomendación inmediata y reservar sin rodeos.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="flow" size="lg">
                  <Link to="/ia">
                    Abrir Chat con Floppy <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
                <Button asChild variant="glass" size="lg">
                  <Link to="/proyectos">Ver Trabajos y Pruebas</Link>
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="ml-auto w-fit max-w-[85%] rounded-3xl rounded-br-lg bg-flow px-4 py-3 text-sm text-primary-foreground shadow-sm">
                ¿Qué servicio me recomiendas para mejorar la velocidad de mi oficina?
              </div>
              <div className="glass w-fit max-w-[85%] rounded-3xl rounded-bl-lg px-4 py-3 text-sm">
                Te recomiendo revisar nuestro servicio de <strong>Optimización Wi-Fi & Redes</strong>. Puedo llevarte a reservarlo ahora mismo.
              </div>
              <div className="glass flex w-fit gap-1.5 rounded-3xl rounded-bl-lg px-4 py-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="animate-typing h-1.5 w-1.5 rounded-full bg-primary"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
