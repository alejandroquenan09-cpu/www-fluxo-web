import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Logo } from "./Logo";

// Configura aquí tus enlaces y número de WhatsApp
export const SOCIAL_LINKS = {
  whatsapp: "https://wa.me/573122238923?text=Hola%20Fluxo,%20quisiera%20consultar%20sobre%20un%20servicio",
  tiktok: "https://www.tiktok.com/@fluxo.co?_r=1&_t=ZS-9AncKyWd37F", // Cambia por tu usuario real
  youtube: "https://youtube.com/@fluxoco?si=_iHnTPo5Ni5LpJAX", // Cambia por tu canal real
};

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.86-4.49V8.58a8.28 8.28 0 0 0 4.84 1.56V6.69h-.93z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto mt-24 max-w-6xl px-4 pb-12 sm:px-6">
      <div className="border-t border-border/60 pt-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Logo />
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              La tecnología nunca deja de avanzar. Nosotros tampoco. Soluciones de hardware, redes y software.
            </p>
          </div>

          {/* Redes Sociales Destacadas */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Conéctate con Fluxo:
            </span>
            <div className="flex items-center gap-2.5">
              {/* WhatsApp */}
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center gap-2 rounded-full glass px-3.5 py-2 text-xs font-medium text-foreground hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all shadow-sm"
                title="Escribir al WhatsApp oficial de Fluxo"
              >
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-3.5 w-3.5 fill-current" />
                </div>
                <span>WhatsApp</span>
              </a>

              {/* TikTok */}
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center gap-2 rounded-full glass px-3.5 py-2 text-xs font-medium text-foreground hover:border-pink-500/50 hover:bg-pink-500/10 transition-all shadow-sm"
                title="Síguenos en TikTok"
              >
                <div className="h-5 w-5 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TikTokIcon className="h-3.5 w-3.5" />
                </div>
                <span>TikTok</span>
              </a>

              {/* YouTube */}
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center gap-2 rounded-full glass px-3.5 py-2 text-xs font-medium text-foreground hover:border-red-500/50 hover:bg-red-500/10 transition-all shadow-sm"
                title="Canal oficial de YouTube"
              >
                <div className="h-5 w-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <YouTubeIcon className="h-3.5 w-3.5" />
                </div>
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>

        {/* Enlaces de Navegación y Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-5">
            <Link to="/servicios" className="hover:text-foreground transition-colors">Servicios</Link>
            <Link to="/ia" className="hover:text-foreground transition-colors">Floppy</Link>
            <Link to="/proyectos" className="hover:text-foreground transition-colors">Proyectos</Link>
            <Link to="/nuestra-esencia" className="hover:text-foreground transition-colors">Nuestra Esencia</Link>
            <Link to="/sobre" className="hover:text-foreground transition-colors">Sobre Fluxo</Link>
          </div>
          <p>© {new Date().getFullYear()} Fluxo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
