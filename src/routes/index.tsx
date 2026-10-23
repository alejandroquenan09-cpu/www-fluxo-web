import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  ArrowRight, 
  Sparkles, 
  Wrench, 
  Wifi, 
  Code, 
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
      { name: "description", content: "Mantenimiento, redes y desarrollo de software con atención personalizada e IA integrada." },
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
    desc: "Diagnóstico preventivo, reparación térmica y repotenciación para computadores y estaciones de trabajo.",
    tag: "Equipos & PCs",
  },
  {
    icon: Wifi,
    title: "Redes & Conectividad",
    desc: "Diseño e instalación de cableado estructurado, optimización Wi-Fi de alta cobertura y enlaces seguros.",
    tag: "Infraestructura",
  },
  {
    icon: Code,
    title: "Desarrollo Web & Software",
    desc: "Sitios web rápidos, plataformas modernas y aplicaciones a la medida para impulsar tu presencia digital.",
    tag: "Digital",
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
            Soluciones integrales de hardware, redes y software para que tus operaciones fluyan sin interrupciones.
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
        <Reveal className="grid grid-cols-2 md
