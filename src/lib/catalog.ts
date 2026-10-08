import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ServiceCategory = "mantenimiento" | "redes" | "web" | "digital" | "seguridad";

export interface ServiceItem {
  id: string;
  parentId: string; // ID real en la base de datos para la reserva
  category: ServiceCategory;
  categoryLabel: string;
  name: string;
  slug: string;
  description: string;
  features: string[]; // 3 puntos clave rápidos e intuitivos
  price_cop: number;
  icon: "wrench" | "network" | "code" | "monitor" | "sparkles";
  status?: "active" | "soon";
  details?: string;
}

export const CATEGORIES: { id: "todos" | ServiceCategory; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "mantenimiento", label: "Mantenimiento" },
  { id: "redes", label: "Redes y Conexiones" },
  { id: "web", label: "Desarrollo Web" },
  { id: "digital", label: "Soluciones Digitales" },
  { id: "seguridad", label: "Seguridad" },
];

export const FLUXO_SERVICES: ServiceItem[] = [
  // ================= MANTENIMIENTO (6) =================
  {
    id: "mant-preventivo",
    parentId: "0f06fd76-f328-4693-90b8-500229a6ca9e",
    category: "mantenimiento",
    categoryLabel: "Mantenimiento Informático",
    name: "Mantenimiento Preventivo",
    slug: "mantenimiento-preventivo",
    description: "Limpieza física profunda, pasta térmica de alto rendimiento y optimización de velocidad.",
    features: [
      "Limpieza interna de polvo y ventiladores",
      "Cambio de pasta térmica de alta conductividad",
      "Optimización de arranque y desfragmentación",
    ],
    price_cop: 90000,
    icon: "wrench",
  },
  {
    id: "mant-correctivo",
    parentId: "0f06fd76-f328-4693-90b8-500229a6ca9e",
    category: "mantenimiento",
    categoryLabel: "Mantenimiento Informático",
    name: "Mantenimiento Correctivo",
    slug: "mantenimiento-correctivo",
    description: "Diagnóstico profundo y reparación de fallas de encendido, pantallas, fuentes y piezas dañadas.",
    features: [
      "Diagnóstico electrónico y de componentes",
      "Reparación o sustitución de hardware dañado",
      "Pruebas de estabilidad bajo carga de trabajo",
    ],
    price_cop: 120000,
    icon: "wrench",
  },
  {
    id: "mant-virus",
    parentId: "0f06fd76-f328-4693-90b8-500229a6ca9e",
    category: "mantenimiento",
    categoryLabel: "Mantenimiento Informático",
    name: "Eliminación de Virus y Malware",
    slug: "eliminacion-virus",
    description: "Desinfección integral de troyanos, spyware y amenazas sin perder tu información personal.",
    features: [
      "Escaneo y eliminación de amenazas ocultas",
      "Limpieza de publicidad invasiva y secuestradores",
      "Blindaje con antivirus y parches de seguridad",
    ],
    price_cop: 70000,
    icon: "sparkles",
  },
  {
    id: "mant-formateo",
    parentId: "0f06fd76-f328-4693-90b8-500229a6ca9e",
    category: "mantenimiento",
    categoryLabel: "Mantenimiento Informático",
    name: "Formateo e Instalación de SO",
    slug: "formateo-instalacion",
    description: "Instalación limpia de Windows o Linux con controladores oficiales y programas esenciales.",
    features: [
      "Instalación limpia del sistema operativo",
      "Drivers oficiales y actualizados",
      "Paquete ofimático y utilidades configuradas",
    ],
    price_cop: 80000,
    icon: "monitor",
  },
  {
    id: "mant-recuperacion",
    parentId: "0f06fd76-f328-4693-90b8-500229a6ca9e",
    category: "mantenimiento",
    categoryLabel: "Mantenimiento Informático",
    name: "Recuperación de Datos",
    slug: "recuperacion-datos",
    description: "Rescate de fotos, documentos y archivos en discos duros, SSD o USBs con fallas o formateo.",
    features: [
      "Escaneo profundo de sectores y particiones",
      "Rescate de archivos eliminados por error",
      "Entrega protegida y confidencial de tu data",
    ],
    price_cop: 150000,
    icon: "sparkles",
  },
  {
    id: "mant-soporte",
    parentId: "0f06fd76-f328-4693-90b8-500229a6ca9e",
    category: "mantenimiento",
    categoryLabel: "Mantenimiento Informático",
    name: "Soporte Técnico Especializado",
    slug: "soporte-tecnico",
    description: "Asistencia remota o presencial para resolver bloqueos, errores y configuración de impresoras.",
    features: [
      "Atención rápida remota o a domicilio",
      "Configuración de impresoras y periféricos",
      "Resolución de errores de programas y lentitud",
    ],
    price_cop: 60000,
    icon: "wrench",
  },

  // ================= REDES Y COMUNICACIONES (5) =================
  {
    id: "redes-cableado",
    parentId: "c84171db-df81-4d1d-a153-267ee4fa8f4d",
    category: "redes",
    categoryLabel: "Redes y Comunicaciones",
    name: "Cableado Estructurado LAN",
    slug: "cableado-estructurado",
    description: "Instalación profesional de puntos de red Cat 6/6A, canaletas estéticas y orden en patch panel.",
    features: [
      "Tendido estético en canaleta o tubería",
      "Puntos de red certificados de alta velocidad",
      "Organización y rotulado de cables en rack",
    ],
    price_cop: 250000,
    icon: "network",
  },
  {
    id: "redes-wifi",
    parentId: "c84171db-df81-4d1d-a153-267ee4fa8f4d",
    category: "redes",
    categoryLabel: "Redes y Comunicaciones",
    name: "Optimización y Cobertura WiFi",
    slug: "optimizacion-wifi",
    description: "Eliminación de zonas muertas con redes WiFi Mesh y puntos de acceso para máxima velocidad.",
    features: [
      "Estudio de señal y eliminación de interferencias",
      "Instalación de repetidores y nodos Mesh",
      "Conexión fluida sin desconexiones al moverte",
    ],
    price_cop: 140000,
    icon: "network",
  },
  {
    id: "redes-routers",
    parentId: "c84171db-df81-4d1d-a153-267ee4fa8f4d",
    category: "redes",
    categoryLabel: "Redes y Comunicaciones",
    name: "Configuración de Routers y Switches",
    slug: "routers-switches",
    description: "Segmentación de redes, control de ancho de banda y priorización para oficinas y hogares.",
    features: [
      "Configuración de VLANs y subredes seguras",
      "Control de tráfico y priorización QoS",
      "Red aislada y segura para visitas",
    ],
    price_cop: 160000,
    icon: "network",
  },
  {
    id: "redes-seguridad",
    parentId: "c84171db-df81-4d1d-a153-267ee4fa8f4d",
    category: "redes",
    categoryLabel: "Redes y Comunicaciones",
    name: "Seguridad y Firewall de Red",
    slug: "seguridad-red",
    description: "Protección perimetral de tu red contra accesos no autorizados y configuración de VPN remota.",
    features: [
      "Reglas de cortafuegos y bloqueo de intrusos",
      "Configuración de VPN segura para teletrabajo",
      "Cierre de puertos y servicios vulnerables",
    ],
    price_cop: 220000,
    icon: "sparkles",
  },
  {
    id: "redes-diagnostico",
    parentId: "c84171db-df81-4d1d-a153-267ee4fa8f4d",
    category: "redes",
    categoryLabel: "Redes y Comunicaciones",
    name: "Monitoreo y Diagnóstico de Red",
    slug: "diagnostico-red",
    description: "Detección de caídas intermitentes, lentitud en internet y pérdida de paquetes de datos.",
    features: [
      "Medición de latencia, jitter y pérdida de paquetes",
      "Detección de bucles y cuellos de botella",
      "Informe con soluciones y optimización directa",
    ],
    price_cop: 100000,
    icon: "network",
  },

  // ================= DESARROLLO WEB (6) =================
  {
    id: "web-corporativa",
    parentId: "07c4e014-9406-49e9-8e91-14820601a045",
    category: "web",
    categoryLabel: "Desarrollo Web",
    name: "Páginas Web Corporativas",
    slug: "web-corporativa",
    description: "Presencia digital elegante, ultrarrápida y adaptada a móviles para posicionar tu empresa.",
    features: [
      "Diseño responsive exclusivo con tu identidad",
      "Carga instantánea optimizada para celulares",
      "Botones directos a WhatsApp y contacto",
    ],
    price_cop: 1200000,
    icon: "code",
  },
  {
    id: "web-landing",
    parentId: "07c4e014-9406-49e9-8e91-14820601a045",
    category: "web",
    categoryLabel: "Desarrollo Web",
    name: "Landing Pages de Conversión",
    slug: "landing-pages",
    description: "Página de aterrizaje orientada a captar prospectos y llamadas en campañas publicitarias.",
    features: [
      "Estructura persuasiva enfocada en ventas",
      "Formularios rápidos e integración de métricas",
      "Diseño visual de alto impacto",
    ],
    price_cop: 650000,
    icon: "code",
  },
  {
    id: "web-ecommerce",
    parentId: "07c4e014-9406-49e9-8e91-14820601a045",
    category: "web",
    categoryLabel: "Desarrollo Web",
    name: "Tiendas Online (E-Commerce)",
    slug: "tiendas-online",
    description: "Catálogo de productos con carrito, pasarela de pagos en línea y administración sencilla.",
    features: [
      "Catálogo de productos con variantes e imágenes",
      "Pasarelas de pago colombianas e internacionales",
      "Panel para gestionar pedidos y clientes",
    ],
    price_cop: 2100000,
    icon: "code",
  },
  {
    id: "web-sistemas",
    parentId: "07c4e014-9406-49e9-8e91-14820601a045",
    category: "web",
    categoryLabel: "Desarrollo Web",
    name: "Sistemas Web a Medida",
    slug: "sistemas-web",
    description: "Aplicaciones web personalizadas: cotizadores, control de inventario y portales de clientes.",
    features: [
      "Desarrollo específico para tu operativa",
      "Gestión de roles, permisos y seguridad",
      "Informes y exportación de datos en tiempo real",
    ],
    price_cop: 2800000,
    icon: "code",
  },
  {
    id: "web-mantenimiento",
    parentId: "07c4e014-9406-49e9-8e91-14820601a045",
    category: "web",
    categoryLabel: "Desarrollo Web",
    name: "Mantenimiento y Rediseño Web",
    slug: "mantenimiento-web",
    description: "Modernización de páginas antiguas, corrección de errores, mejora de velocidad y seguridad.",
    features: [
      "Rediseño visual moderno y adaptativo",
      "Aceleración de tiempos de carga",
      "Parches de seguridad y actualización técnica",
    ],
    price_cop: 350000,
    icon: "code",
  },
  {
    id: "web-seo",
    parentId: "07c4e014-9406-49e9-8e91-14820601a045",
    category: "web",
    categoryLabel: "Desarrollo Web",
    name: "Optimización SEO para Google",
    slug: "optimizacion-seo",
    description: "Estrategia técnica para que tu negocio aparezca en las primeras búsquedas de clientes.",
    features: [
      "Auditoría y optimización de palabras clave",
      "Metaetiquetas, estructura y sitemaps",
      "Indexación directa en Google Search Console",
    ],
    price_cop: 450000,
    icon: "sparkles",
  },

  // ================= SOLUCIONES DIGITALES (3) =================
  {
    id: "digital-correo",
    parentId: "3b05d0ca-a22f-4c9c-8ab7-8e5bf6f719a0",
    category: "digital",
    categoryLabel: "Soluciones Digitales",
    name: "Correo Corporativo Profesional",
    slug: "correo-corporativo",
    description: "Cuentas @tuempresa.com con alta reputación de entrega, antispam y sincronización móvil.",
    features: [
      "Dirección profesional con tu propio dominio",
      "Sincronización en Outlook, Gmail y celulares",
      "Filtros avanzados contra correo no deseado",
    ],
    price_cop: 120000,
    icon: "monitor",
  },
  {
    id: "digital-hosting",
    parentId: "3b05d0ca-a22f-4c9c-8ab7-8e5bf6f719a0",
    category: "digital",
    categoryLabel: "Soluciones Digitales",
    name: "Hosting de Alta Velocidad y Dominios",
    slug: "hosting-dominios",
    description: "Servidores seguros con discos NVMe, certificados SSL gratuitos y soporte continuo.",
    features: [
      "Almacenamiento ultra veloz con discos NVMe",
      "Certificado SSL (candado verde) incluido",
      "Migración de tu sitio anterior sin interrupciones",
    ],
    price_cop: 180000,
    icon: "monitor",
  },
  {
    id: "digital-backups",
    parentId: "3b05d0ca-a22f-4c9c-8ab7-8e5bf6f719a0",
    category: "digital",
    categoryLabel: "Soluciones Digitales",
    name: "Copias de Seguridad en la Nube",
    slug: "copias-seguridad",
    description: "Respaldos automáticos y cifrados de tu información importante para evitar pérdidas.",
    features: [
      "Copias periódicas programadas en automático",
      "Cifrado de grado bancario para tu privacidad",
      "Restauración rápida ante caídas o ataques",
    ],
    price_cop: 160000,
    icon: "sparkles",
  },

  // ================= SEGURIDAD TECNOLÓGICA (1) =================
  {
    id: "seguridad-camaras",
    parentId: "95a83a97-0012-4c34-aa04-6c56e664cf9e",
    category: "seguridad",
    categoryLabel: "Seguridad Tecnológica",
    name: "Cámaras IP y Videovigilancia",
    slug: "camaras-seguridad",
    description: "Instalación de cámaras HD/4K con visión nocturna, sensor de movimiento y visualización en tu celular.",
    features: [
      "Acceso en vivo desde tu teléfono estés donde estés",
      "Grabación continua en disco duro o nube",
      "Visión nocturna infrarroja y alertas inteligentes",
    ],
    price_cop: 280000,
    icon: "monitor",
  },
];

export const servicesQuery = queryOptions({
  queryKey: ["services-list"],
  queryFn: async () => FLUXO_SERVICES,
});

export type Service = ServiceItem;
