import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { User, MessageCircle } from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer, SOCIAL_LINKS } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <main className="page-enter">{children}</main>
      <Footer />

      {/* Botones flotantes fijos en la esquina inferior izquierda (sin interferir con Floppy) */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2.5 pointer-events-auto">
        {/* WhatsApp Directo Flotante */}
        <a
          href={SOCIAL_LINKS.whatsapp}
          target="_blank"
          rel="noreferrer noopener"
          className="group glass flex items-center gap-2 rounded-full pl-2.5 pr-4 py-2 text-xs font-semibold shadow-xl border-emerald-500/30 hover:border-emerald-500/70 hover:bg-emerald-500/10 transition-all backdrop-blur-md"
          title="Chatear con un funcionario por WhatsApp"
        >
          <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <MessageCircle className="h-3.5 w-3.5 fill-current" />
          </div>
          <span className="text-foreground/90 group-hover:text-emerald-400 transition-colors">
            WhatsApp
          </span>
        </a>

        {/* Espacio personal */}
        <Link
          to="/dashboard"
          className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium shadow-xl hover:border-primary/50 transition-all backdrop-blur-md"
        >
          <User className="h-4 w-4 text-cyan-400" />
          <span>Espacio personal</span>
        </Link>
      </div>
    </div>
  );
}

export function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: ReactNode; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
    </div>
  );
}
