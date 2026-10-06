import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { accountQuery, usageQuery } from "@/lib/account";
import { createPortal } from "@/lib/billing/billing.functions";
import { Button } from "@/components/ui/button";
import { ChatPanel } from "./ChatPanel";
import { ServicesGrid } from "./ServicesGrid";
import { PlansGrid } from "./PlansGrid";

function useAccount() {
  const { user } = useAuth();
  const acc = useQuery({ ...accountQuery(user!.id), enabled: !!user });
  const usage = useQuery({ ...usageQuery(user!.id), enabled: !!user });
  return { user: user!, acc: acc.data, usage: usage.data };
}

const Title = ({ children }: { children: string }) => <h1 className="mb-6 text-3xl font-semibold">{children}</h1>;

export function DashHome() {
  const { user, acc, usage } = useAccount();
  const plan = acc?.subscription?.plan_id === "premium" ? "Premium" : "Gratis";
  const limit = (acc?.subscription?.plans as { ai_daily_limit: number } | null)?.ai_daily_limit ?? 20;
  return (
    <div>
      <Title>{`Hola, ${acc?.profile?.full_name || "bienvenido"}`}</Title>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass rounded-3xl p-6"><p className="text-sm text-muted-foreground">Correo</p><p className="mt-2 truncate">{user.email}</p></div>
        
        <div className="glass rounded-3xl p-6"><p className="text-sm text-muted-foreground">Uso de IA hoy</p><p className="mt-2 font-display text-2xl">{usage?.today ?? 0} / {limit}</p><p className="text-xs text-muted-foreground">{usage?.conversations ?? 0} conversaciones</p></div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
  <Button asChild variant="flow" size="xl">
    <Link to="/dashboard/ia">Abrir Floppy</Link>
  </Button>
  <Button asChild variant="glass" size="xl">
    <Link to="/servicios">Explorar servicios</Link>
  </Button>
</div>

    </div>
  );
}

export const DashIA = () => (<div><Title>Floppy</Title><ChatPanel /></div>);
export const DashServicios = () => (<div><Title>Servicios</Title><ServicesGrid /></div>);

export function DashSuscripcion() {
  const { acc } = useAccount();
  const portal = useServerFn(createPortal);
  const manage = async () => {
    const r = await portal();
    if (r.url) window.location.href = r.url; else toast.info(r.error ?? "No disponible");
  };
  const premium = acc?.subscription?.plan_id === "premium";
  return (
    <div>
      <Title>Suscripción</Title>
      <div className="glass mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6">
        <div><p className="text-sm text-muted-foreground">Estado</p><p className="font-display text-2xl text-flow">{premium ? "Premium" : "Gratis"}</p>
          {acc?.subscription?.cancel_at_period_end && <p className="text-xs text-muted-foreground">Se cancelará al final del periodo</p>}</div>
        {premium && <Button variant="glass" onClick={manage}>Gestionar o cancelar</Button>}
      </div>
      <PlansGrid currentPlan={acc?.subscription?.plan_id} />
    </div>
  );
}

export function DashPerfil() {
  const { user, acc } = useAccount();
  return (
    <div><Title>Perfil</Title>
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
