import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, SectionHeader } from "@/components/fluxo/SiteLayout";
import { Reveal } from "@/components/fluxo/Reveal";
import {
  Wrench,
  Network,
  Code2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/proyectos")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Proyectos & Casos de Éxito — Pruebas de Trabajo de Fluxo" },
      {
        name: "description",
        content:
          "Explora pruebas reales y resultados verificados de nuestro trabajo en mantenimiento de hardware, redes, desarrollo web y ciberseguridad.",
      },
      { property: "og:title", content: "Proyectos & Pruebas de Trabajo — Fluxo" },
      {
        property: "og:description",
        content: "Casos de éxito con resultados técnicos medibles y diagnósticos reales.",
      },
    ],
  }),
  component: ProyectosPage,
});

type Categoria = "todos" | "mantenimiento" | "redes" | "web" | "seguridad";

const CATEGORIAS: { id: Categoria; label: string; icon: typeof Wrench }[] = [
  { id: "todos", label: "Todos los proyectos", icon: Layers },
  { id: "mantenimiento", label: "Hardware & Equipos", icon: Wrench },
  { id: "redes", label: "Redes & Conectividad", icon: Network },
  { id: "web", label: "Desarrollo Web", icon: Code2 },
  { id: "seguridad", label: "Ciberseguridad", icon: ShieldCheck },
];

const PROYECTOS = [
  {
    id: "mantenimiento-termico",
    categoria: "mantenimiento" as Categoria,
    badge: "Mantenimiento Correctivo & Térmico",
    titulo: "Reanimación Térmica en Portátil de Renderizado",
    cliente: "Estudio de Animación Digital",
    imagen: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80",
    problema: "Equipo alcanzando 98°C en carga con apagados repentinos por thermal throttling y ventiladores al 100% de ruido.",
    solucion: "Desensamble minucioso, sustitución de pasta térmica reseca por compuesto de alta conductividad, lubricación de turbinas y optimización de curvas de enfriamiento en BIOS.",
    metricas: [
      { valor: "-36°C", label: "En carga extrema" },
      { valor: "0", label: "Apagados térmicos" },
      { valor: "+42%", label: "Rendimiento sostenido" },
    ],
    puntosClave: [
      "Diagnóstico inicial con cámara térmica",
      "Reemplazo de thermal pads en VRM y memorias",
      "Test de estrés AIDA64 estable durante 2 horas",
    ],
    servicioSlug: "mantenimiento-preventivo-correctivo",
  },
  {
    id: "rack-cableado-oficina",
    categoria: "redes" as Categoria,
    badge: "Infraestructura & Cableado",
    titulo: "Reestructuración y Peinado de Rack Empresarial",
    cliente: "Sede Corporativa (3 pisos)",
    imagen: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    problema: "Rack sin rotular, maraña de cables cruzados con microcortes en llamadas VoIP y caídas frecuentes de conexión.",
    solucion: "Retirada de cables obsoletos, peinado profesional con pasahilos horizontales, certificación de 48 puntos Cat6A y configuración de VLANs separadas para voz y datos.",
    metricas: [
      { valor: "< 1 ms", label: "Latencia en red local" },
      { valor: "48 / 48", label: "Puntos certificados" },
      { valor: "100%", label: "Uptime desde entrega" },
    ],
    puntosClave: [
      "Rotulación norma ANSI/TIA-606-B",
      "Segmentación de tráfico con QoS prioritario",
      "Mapeo físico y digital entregado al cliente",
    ],
    servicioSlug: "cableado-estructurado-y-racks",
  },
  {
    id: "plataforma-web-moderna",
    categoria: "web" as Categoria,
    badge: "Desarrollo Full-Stack",
    titulo: "Plataforma de Reservas y Catálogo Digital Rápido",
    cliente: "Empresa de Servicios Profesionales",
    imagen: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    problema: "Sitio antiguo lento (3.8s de carga), pedidos manuales por mensajería y pérdida de clientes móviles.",
    solucion: "Arquitectura moderna con TanStack Start y React 19, reservas automatizadas con anticipo del 10%, diseño líquido adaptativo y carga en menos de un segundo.",
    metricas: [
      { valor: "0.6 s", label: "Tiempo de carga" },
      { valor: "+210%", label: "Conversión de reservas" },
      { valor: "99 / 100", label: "Puntaje Core Web Vitals" },
    ],
    puntosClave: [
      "Renderizado ultraveloz sin tiempos muertos",
      "Diseño Frutiger Aero cristalino y adaptado a móviles",
      "Gestión de citas y confirmación telefónica",
    ],
    servicioSlug: "desarrollo-web-a-medida",
  },
  {
    id: "upgrade-ssd-recuperacion",
    categoria: "mantenimiento" as Categoria,
    badge: "Almacenamiento & Rescate",
    titulo: "Clonación Forense y Upgrade a SSD NVMe",
    cliente: "Oficina Contable & Tributaria",
    imagen: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80",
    problema: "Disco mecánico con sectores dañados que tardaba 4 minutos en iniciar Windows y bloqueaba el software contable.",
    solucion: "Extracción y clonación bit a bit para salvaguardar el 100% de bases de datos, instalación de unidad SSD NVMe de alta durabilidad y optimización del registro del sistema.",
    metricas: [
      { valor: "11 seg", label: "Arranque completo" },
      { valor: "100%", label: "Datos contables salvados" },
      { valor: "+4 años", label: "Vida útil extendida" },
    ],
    puntosClave: [
      "Cero pérdida de información o licencias activas",
      "Copia de seguridad externa entregada al cliente",
      "Capacitación breve en buenas prácticas de guardado",
    ],
    servicioSlug: "recuperacion-de-datos",
  },
  {
    id: "wifi-mesh-alta-densidad",
    categoria: "redes" as Categoria,
    badge: "Wi-Fi Empresarial",
    titulo: "Despliegue Wi-Fi Mesh de Alta Densidad",
    cliente: "Espacio Coworking & Auditorio",
    imagen: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
    problema: "Zonas ciegas de cobertura y colapso de red cuando se conectaban más de 40 usuarios en eventos presenciales.",
    solucion: "Estudio de mapa de calor por radiofrecuencia (Heatmap), instalación de 5 puntos de acceso Wi-Fi 6 con roaming fluido y portal cautivo de invitados.",
    metricas: [
      { valor: "120+", label: "Usuarios en simultáneo" },
      { valor: "0 ms", label: "Pérdida en roaming" },
      { valor: "100%", label: "Cobertura en 450 m²" },
    ],
    puntosClave: [
      "Conmutación automática de señal al caminar",
      "Aislamiento de red para seguridad de invitados",
      "Monitoreo centralizado en tiempo real",
    ],
    servicioSlug: "redes-inalambricas-y-wifi-mesh",
  },
  {
    id: "blindaje-servidor-backup",
    categoria: "seguridad" as Categoria,
    badge: "Ciberseguridad Aplicada",
    titulo: "Blindaje de Datos y Respaldo 3-2-1 Inmutable",
    cliente: "Distribuidora Mayorista",
    imagen: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    problema: "Vulnerabilidades críticas por puertos abiertos sin cifrar y sin copias de seguridad aisladas ante ransomware.",
    solucion: "Auditoría de seguridad integral, cierre de vectores de ataque, VPN privada con WireGuard y sistema de respaldo automatizado cifrado con estándar 3-2-1 en nube.",
    metricas: [
      { valor: "AES-256", label: "Cifrado extremo a extremo" },
      { valor: "Diario", label: "Respaldo automatizado" },
      { valor: "0", label: "Brechas de seguridad" },
    ],
    puntosClave: [
      "Autenticación multifactorial (MFA) obligatoria",
      "Copias desconectadas e inmutables contra ransomware",
      "Prueba real de restauración ante contingencias",
    ],
    servicioSlug: "seguridad-informatica-y-antivirus",
  },
];

function ProyectosPage() {
  const [categoria, setCategoria] = useState<Categoria>("todos");

  const proyectosFiltrados =
    categoria === "todos"
      ? PROYECTOS
      : PROYECTOS.filter((p) => p.categoria === categoria);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 pt-32 pb-24 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Pruebas de nuestro trabajo"
            title={
              <>
                Resultados reales que <span className="text-flow">fluyen</span>
              </>
            }
            subtitle="Conoce casos reales donde transformamos problemas lentos y caóticos en sistemas estables, veloces y confiables."
          />
        </Reveal>

        {/* Selector de Categorías */}
        <Reveal className="mt-10" delay={100}>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIAS.map((cat) => {
              const Icon = cat.icon;
              const activo = categoria === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoria(cat.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                    activo
                      ? "bg-flow text-primary-foreground shadow-glow"
                      : "bg-card/90 text-muted-foreground hover:text-foreground hover:bg-card border border-border/80 shadow-sm"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Cuadrícula de Proyectos con Fotografías */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {proyectosFiltrados.map((item, idx) => (
            <Reveal key={item.id} delay={120 + (idx % 2) * 80}>
              <article
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card/90 p-5 sm:p-7 shadow-xl backdrop-blur-xl transition-all hover:border-primary/50 hover:shadow-2xl"
              >
                <div>
                  {/* Foto de la prueba con efecto zoom y badge flotante */}
                  <div className="relative mb-5 h-48 sm:h-56 w-full overflow-hidden rounded-2xl border border-border/70 bg-muted/30">
                    <img
                      src={item.imagen}
                      alt={item.titulo}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <Badge variant="outline" className="border-primary/50 bg-background/85 backdrop-blur-md text-primary text-xs font-semibold px-3 py-1 shadow-sm">
                        {item.badge}
                      </Badge>
                      <span className="rounded-full bg-background/85 backdrop-blur-md px-3 py-0.5 text-[11px] font-medium text-foreground/80 shadow-sm">
                        {item.cliente}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {item.titulo}
                  </h3>

                  {/* Comparativa Desafío vs Solución */}
                  <div className="mt-5 space-y-3 text-sm">
                    <div className="rounded-2xl border border-border/70 bg-background/80 p-3.5">
                      <div className="flex items-center gap-2 font-semibold text-amber-500 dark:text-amber-400">
                        <Flame className="h-4 w-4" />
                        <span>El problema detectado:</span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                        {item.problema}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border/70 bg-background/80 p-3.5">
                      <div className="flex items-center gap-2 font-semibold text-primary">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Solución aplicada por Fluxo:</span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                        {item.solucion}
                      </p>
                    </div>
                  </div>

                  {/* Protocolo de calidad */}
                  <div className="mt-5 border-t border-border/60 pt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Protocolo de calidad aplicado:
                    </h4>
                    <ul className="mt-2.5 space-y-1.5 text-xs text-muted-foreground">
                      {item.puntosClave.map((punto) => (
                        <li key={punto} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-foreground/90">{punto}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Métricas y botón de cotización */}
                <div className="mt-6 border-t border-border/70 pt-5">
                  <div className="grid grid-cols-3 gap-2 rounded-2xl bg-primary/5 p-3 text-center border border-primary/15">
                    {item.metricas.map((m) => (
                      <div key={m.label} className="px-1">
                        <div className="font-display text-base sm:text-lg font-bold text-primary">
                          {m.valor}
                        </div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground leading-tight mt-0.5">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <Button asChild variant="flow" size="sm" className="w-full justify-center">
                      <Link
                        to="/servicios"
                        search={{ servicio: item.servicioSlug, reservar: 1 } as never}
                      >
                        <span>Cotizar este servicio</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* CTA Inferior */}
        <Reveal className="mt-16 text-center" delay={200}>
          <div className="mx-auto max-w-2xl rounded-3xl border border-primary/25 bg-card/90 p-8 shadow-xl backdrop-blur-xl">
            <Sparkles className="mx-auto h-8 w-8 text-primary animate-pulse" />
            <h3 className="mt-3 font-display text-2xl font-bold">¿Tienes un caso similar que quieras resolver?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Agenda tu diagnóstico técnico con solo el 10% de anticipo. Un funcionario se comunicará contigo para coordinar hora y lugar.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild variant="flow" size="xl">
                <Link to="/servicios">Ver todos los servicios</Link>
              </Button>
              <Button asChild variant="glass" size="xl">
                <Link to="/ia">Preguntarle a Floppy</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
