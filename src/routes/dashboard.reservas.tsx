import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cop } from "@/components/fluxo/ServiceCard";

export const Route = createFileRoute("/dashboard/reservas")({
  head: () => ({ meta: [{ title: "Reservas — Fluxo" }, { name: "robots", content: "noindex" }] }),
  component: Reservas,
});

const STATUS: Record<string, string> = { pendiente: "Pendiente", asignada: "Tomada por un técnico", confirmada: "Confirmada", completada: "Completada", cancelada: "Cancelada" };

function Reservas() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: isStaff = false } = useQuery({
    queryKey: ["is-staff", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user!.id);
      return (data ?? []).some((r) => r.role === "funcionario" || r.role === "admin");
    },
  });
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*, services(name)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const update = async (id: string, patch: { status: string; assigned_to?: string }) => {
    const { error } = await supabase.from("bookings").update(patch).eq("id", id);
    if (error) return toast.error("No se pudo actualizar");
    qc.invalidateQueries({ queryKey: ["bookings"] });
  };

  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold">Reservas</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        {isStaff ? "Solicitudes de clientes. Toma una y llama al cliente para confirmar fecha, hora y lugar." : "Tus solicitudes de servicio."}
      </p>
      {isLoading && <div className="glass h-32 animate-pulse rounded-3xl" />}
      {!isLoading && bookings.length === 0 && <div className="glass rounded-3xl p-6 text-muted-foreground">Aún no hay reservas.</div>}
      <div className="space-y-4">
        {bookings.map((b) => {
          const mine = b.assigned_to === user?.id;
          return (
            <div key={b.id} className="glass rounded-3xl p-5 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-lg font-semibold">{(b.services as { name: string } | null)?.name ?? "Servicio"}</p>
                <span className="rounded-full bg-primary/15 px-3 py-1 text-xs text-primary">{STATUS[b.status] ?? b.status}</span>
              </div>
              <div className="mt-3 grid gap-1 text-muted-foreground sm:grid-cols-2">
                <p>📍 {b.location}</p>
                <p>✉️ {b.email}</p>
                <p>📞 {b.phone}</p>
                {b.estimated_price != null && <p>Aprox. {cop(b.estimated_price)} · Reserva {cop(b.deposit_amount ?? 0)}</p>}
                {b.notes && <p className="sm:col-span-2">📝 {b.notes}</p>}
                <p className="text-xs">{new Date(b.created_at).toLocaleString("es-CO")}</p>
              </div>
              {isStaff && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {b.status === "pendiente" && <Button size="sm" variant="flow" onClick={() => update(b.id, { status: "asignada", assigned_to: user!.id })}>Tomar solicitud</Button>}
                  {mine && b.status === "asignada" && <Button size="sm" variant="flow" onClick={() => update(b.id, { status: "confirmada" })}>Marcar confirmada</Button>}
                  {mine && b.status === "confirmada" && <Button size="sm" variant="flow" onClick={() => update(b.id, { status: "completada" })}>Marcar completada</Button>}
                  {mine && !["completada", "cancelada"].includes(b.status) && <Button size="sm" variant="glass" onClick={() => update(b.id, { status: "cancelada" })}>Cancelar</Button>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
