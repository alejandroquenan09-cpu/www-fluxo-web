import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { to: "/", label: "Inicio" },
  { to: "/servicios", label: "Servicios" },
  { to: "/ia", label: "IA" },
  { to: "/planes", label: "Planes" },
  { to: "/sobre", label: "Sobre Fluxo" },
] as const;

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let lastY = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      // Below the hero anchor: hide on scroll down, reveal on scroll up.
      setHidden(y > 120 && y > lastY + 4);
      lastY = y;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 ease-out sm:px-6",
        hidden && !open && "-translate-y-[130%]",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full nav-glass px-4 py-2.5 sm:px-5">
        <Logo />
        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <li key={n.to}>
              <Link
                to={n.to}
                activeOptions={{ exact: true }}
                className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "bg-glass-strong text-foreground" }}
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user ? (
            <Button asChild variant="flow" size="sm" className="h-9 px-5">
              <Link to="/dashboard">Mi panel</Link>
            </Button>
          ) : (
            <>
              <Link to="/auth" search={{ mode: "login" }} className="px-3 text-sm text-muted-foreground hover:text-foreground">
                Iniciar sesión
              </Link>
              <Button asChild variant="flow" size="sm" className="h-9 px-5">
                <Link to="/auth" search={{ mode: "signup" }}>Crear cuenta</Link>
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="grid h-10 w-10 place-items-center rounded-full glass"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

          className="grid h-10 w-10 place-items-center rounded-full glass md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="fixed inset-x-3 top-20 z-40 animate-scale-in rounded-3xl nav-glass p-4 md:hidden">
          <ul className="flex flex-col">
            {NAV.map((n, i) => (
              <li key={n.to} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms`, animationFillMode: "both" }}>
                <Link
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3.5 font-display text-lg text-foreground/90 hover:bg-glass"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-4">
            {user ? (
              <Button asChild variant="flow" size="xl" className="col-span-2">
                <Link to="/dashboard" onClick={() => setOpen(false)}>Mi panel</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="glass" size="xl">
                  <Link to="/auth" search={{ mode: "login" }} onClick={() => setOpen(false)}>Iniciar sesión</Link>
                </Button>
                <Button asChild variant="flow" size="xl">
                  <Link to="/auth" search={{ mode: "signup" }} onClick={() => setOpen(false)}>Crear cuenta</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
