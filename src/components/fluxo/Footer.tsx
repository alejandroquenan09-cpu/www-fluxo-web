import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mx-auto mt-24 max-w-6xl px-4 pb-10 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-6 border-t border-border pt-8 sm:flex-row sm:items-center">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-muted-foreground">La tecnología nunca deja de avanzar. Nosotros tampoco.</p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
          <Link to="/servicios" className="hover:text-foreground">Servicios</Link>
          <Link to="/ia" className="hover:text-foreground">Floppy</Link>
          <Link to="/nuestra-esencia" className="hover:text-foreground">Nuestra Esencia</Link>
          <Link to="/sobre" className="hover:text-foreground">Sobre Fluxo</Link>
        </div>
      </div>
      <p className="mt-6 text-xs text-muted-foreground/70">© {new Date().getFullYear()} Fluxo</p>
    </footer>
  );
}
