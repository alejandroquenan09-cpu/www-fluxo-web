import { useEffect } from "react";
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { CreditCard, Home, LayoutGrid, LogOut, Settings, Sparkles, User } from "lucide-react";
import { useAuth, signOut } from "@/lib/auth";
import { Logo } from "@/components/fluxo/Logo";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Mi panel — Fluxo" },
      { name: "description", content: "Tu espacio personal en Fluxo." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardLayout,
});

const NAV = [
  { to: "/dashboard", label: "Inicio", icon: Home },
  { to: "/dashboard/ia", label: "IA", icon: Sparkles },
  { to: "/dashboard/servicios", label: "Servicios", icon: LayoutGrid },
  { to: "/dashboard/suscripcion", label: "Suscripción", icon: CreditCard },
  { to: "/dashboard/perfil", label: "Perfil", icon: User },
  { to: "/dashboard/configuracion", label: "Configuración", icon: Settings },
] as const;

function DashboardLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { mode: "login" } });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="relative h-14 w-14">
          <span className="animate-ripple absolute inset-0 rounded-full border border-primary/50" />
          <span className="glass-strong animate-float absolute inset-2 rounded-full" />
        </div>
      </div>
    );
  }

  const logout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-3 pb-24 pt-4 sm:px-6 lg:pb-6">
      {/* Desktop sidebar */}
      <aside className="glass sticky top-4 hidden h-[calc(100vh-2rem)] w-60 shrink-0 flex-col rounded-3xl p-4 lg:flex">
        <Logo className="px-2 py-1" />
        <nav className="mt-8 flex-1 space-y-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-glass hover:text-foreground"
              activeProps={{ className: "bg-glass-strong text-foreground shadow-glass" }}
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={logout}
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-glass hover:text-destructive"
        >
          <LogOut className="h-4 w-4" /> Cerrar sesión
        </button>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <div className="glass mb-5 flex items-center justify-between rounded-full px-4 py-2.5 lg:hidden">
          <Logo />
          <button onClick={logout} aria-label="Cerrar sesión" className="grid h-9 w-9 place-items-center rounded-full glass">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <main key={typeof window !== "undefined" ? window.location.pathname : ""} className="page-enter">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="glass-strong fixed inset-x-3 bottom-3 z-40 flex justify-between rounded-full px-2 py-1.5 lg:hidden">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: true }}
            aria-label={n.label}
            className="grid h-11 flex-1 place-items-center rounded-full text-muted-foreground transition"
            activeProps={{ className: "bg-primary/15 text-primary" }}
          >
            <n.icon className="h-5 w-5" />
          </Link>
        ))}
      </nav>
    </div>
  );
}
