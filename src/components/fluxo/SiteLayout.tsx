import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, User } from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <main className="page-enter">{children}</main>
      <Footer />

      {/* Botones flotantes fijos sin tapar contenido */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5 pointer-events-auto">
        <Link
          to="/ia"
          className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-xs sm:text-sm font-medium shadow-xl hover:border-primary/50 transition-all backdrop-blur-md"
        >
          <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span>Floppy</span>
        </Link>
        <Link
          to="/dashboard"
          className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-xs sm:text-sm font-medium shadow-xl hover:border-primary/50 transition-all backdrop-blur-md"
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
