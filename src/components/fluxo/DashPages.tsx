import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { accountQuery, usageQuery } from "@/lib/account";
import { Button } from "@/components/ui/button";
import { ChatPanel } from "./ChatPanel";
import { ServicesGrid } from "./ServicesGrid";

function useAccount() {
  const { user } = useAuth();
  const acc = useQuery({ ...accountQuery(user!.id), enabled: !!user });
  const usage = useQuery({ ...usageQuery(user!.id), enabled: !!user });
  return { user: user!, acc: acc.data, usage: usage.data };
}

const Title = ({ children }: { children: string }) => <h1 className="mb-6 text-3xl font-semibold">{children}</h1>;

export function DashHome() {
  const { user, acc, usage } = useAccount();
  const limit = (acc?.subscription?.plans as { ai_daily_limit: number } | null)?.ai_daily_limit ?? 20;

  return (
    <div>
      <Title>{`Hola, bienvenido de nuevo ${acc?.profile?.full_name || ""}`}</Title>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Panel grande ahora dedicado a los servicios */}
        <div className="glass flex flex-col justify-between rounded-3xl p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Catálogo</p>
            <h3 className="mt-1 font-display text-xl font-semibold">Servicios de Fluxo</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Mantenimiento, redes, desarrollo web y soluciones digitales.
            </p>
          </div>
          <Button asChild variant="flow" size="default" className="mt-5 w-fit">
            <Link to="/servicios">Explorar los servicios de Fluxo</Link>
          </Button>
        </div>

        {/* Panel de uso de Floppy */}
        <div className="glass rounded-3xl p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Floppy IA hoy</p>
          <p className="mt-2 font-display text-2xl font-bold">{usage?.today ?? 0} / {limit}</p>
          <p className="text-xs text-muted-foreground">{usage?.conversations ?? 0} conversaciones iniciadas</p>
        </div>
      </div>

            {/* Botones inferiores: regreso al inicio, consulta a Floppy y cuenta */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button asChild variant="flow" size="xl" className="shadow-lg shadow-primary/20">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span>Volver a la página principal</span>
          </Link>
        </Button>

        <Button asChild variant="glass" size="xl" className="border-primary/30 hover:border-primary/60">
          <Link to="/dashboard/ia" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Consultar a Floppy</span>
          </Link>
        </Button>

        <div className="glass flex items-center rounded-2xl px-5 py-3 text-sm text-muted-foreground">
          <span>Cuenta: <strong className="font-medium text-foreground">{user.email}</strong></span>
        </div>
      </div>

      </div>
  );
}


export const DashIA = () => (<div><Title>Floppy</Title><ChatPanel /></div>);
export const DashServicios = () => (<div><Title>Servicios</Title><ServicesGrid /></div>);

export function DashPerfil() {
  const { user, acc } = useAccount();
  return (
    <div><Title>Tu Perfil</Title>
      <div className="glass space-y-3 rounded-3xl p-6">
        <p><span className="text-muted-foreground">Nombre: </span>{acc?.profile?.full_name || "—"}</p>
        <p><span className="text-muted-foreground">Correo: </span>{user.email}</p>
      </div>
    </div>
  );
}

export const DashConfig = () => (
  <div><Title>Configuración</Title>
    <div className="glass rounded-3xl p-6"><p className="text-muted-foreground">Para cambiar tu contraseña usa la opción de recuperación.</p>
      <Button asChild variant="glass" className="mt-4"><Link to="/auth" search={{ mode: "forgot" }}>Cambiar contraseña</Link></Button></div>
  </div>
);
