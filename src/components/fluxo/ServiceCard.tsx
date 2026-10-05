import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowUpRight, Code2, LayoutGrid, Monitor, Network, Sparkles, Waves, Wrench, type LucideIcon,
} from "lucide-react";
import { TiltCard } from "./TiltCard";
import type { Service } from "@/lib/catalog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

/** Map icon keys stored in the database to icons. */
const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles, layout: LayoutGrid, waves: Waves, code: Code2, wrench: Wrench, network: Network, monitor: Monitor,
};

/** Services that live inside the app rather than being booked. */
const LINKS: Record<string, "/ia" | "/dashboard"> = { "fluxo-ia": "/ia", "espacio-personal": "/dashboard" };

export const DEPOSIT_RATE = 0.1;
export const cop = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

const bookingSchema = z.object({
  location: z.string().trim().min(5, "Indica una dirección más completa").max(300),
  email: z.string().trim().email("Correo no válido").max(255),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{6,19}$/, "Teléfono no válido"),
  notes: z.string().trim().max(1000).optional(),
});

export function ServiceCard({ service, openSignal, bookSignal }: { service: Service; openSignal?: number | undefined; bookSignal?: boolean | undefined }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (openSignal) setOpen(true); }, [openSignal]);
  const Icon = ICONS[service.icon] ?? Sparkles;
  const soon = service.status === "soon";
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="block h-full w-full text-left">
        <TiltCard className="h-full p-6 sm:p-7">
          <div className="flex items-start justify-between">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/25 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
              <Icon className="h-5 w-5" />
            </span>
            {soon && (
              <span className="rounded-full border border-glass-border px-2.5 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">Pronto</span>
            )}
          </div>
          <h3 className="mt-6 text-xl font-semibold">{service.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
          {service.price_cop != null && (
            <p className="mt-4 text-sm"><span className="text-muted-foreground">Desde </span><span className="font-semibold text-primary">{cop(service.price_cop)}</span></p>
          )}
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all group-hover:gap-2.5">
            Ver más <ArrowUpRight className="h-4 w-4" />
          </span>
        </TiltCard>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <ServiceDetails service={service} Icon={Icon} startBooking={!!bookSignal} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function ServiceDetails({ service, Icon, onDone, startBooking }: { service: Service; Icon: LucideIcon; onDone: () => void; startBooking: boolean }) {
  const [booking, setBooking] = useState(startBooking);
  const lines = (service.details ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  const link = LINKS[service.slug];
  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/25"><Icon className="h-5 w-5" /></span>
          <DialogTitle className="text-2xl">{service.name}</DialogTitle>
        </div>
        <DialogDescription>{service.description}</DialogDescription>
      </DialogHeader>

      {!booking && (
        <div className="space-y-2 text-sm leading-relaxed">
          {lines.map((l, i) =>
            l.startsWith("- ") ? (
              <p key={i} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{l.slice(2)}</p>
            ) : (
              <p key={i} className="text-muted-foreground">{l}</p>
            ),
          )}
        </div>
      )}

      {service.price_cop != null && (
        <div className="glass rounded-2xl p-4 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Costo aproximado</span><span className="font-semibold">desde {cop(service.price_cop)}</span></div>
          <div className="mt-1 flex justify-between"><span className="text-muted-foreground">Reserva (10%)</span><span className="font-semibold text-primary">{cop(Math.round(service.price_cop * DEPOSIT_RATE))}</span></div>
          <p className="mt-2 text-xs text-muted-foreground">El resto se paga en efectivo o transferencia cuando se realice el servicio.</p>
        </div>
      )}

      {link ? (
        <Button asChild variant="flow" onClick={onDone}><Link to={link}>Ir al servicio <ArrowUpRight /></Link></Button>
      ) : service.status === "soon" ? null : booking ? (
        <BookingForm service={service} onDone={onDone} onBack={() => setBooking(false)} />
      ) : (
        <Button variant="flow" onClick={() => setBooking(true)}>Solicitar servicio</Button>
      )}
    </>
  );
}

function BookingForm({ service, onDone, onBack }: { service: Service; onDone: () => void; onBack: () => void }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState({ location: "", email: user?.email ?? "", phone: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  if (!user) {
    return (
      <div className="space-y-3 text-sm">
        <p className="text-muted-foreground">Inicia sesión para solicitar este servicio.</p>
        <Button asChild variant="flow" onClick={onDone}><Link to="/auth" search={{ mode: "login" }}>Iniciar sesión</Link></Button>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = bookingSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    setSending(true);
    const price = service.price_cop;
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      service_id: service.id,
      location: parsed.data.location,
      email: parsed.data.email,
      phone: parsed.data.phone,
      notes: parsed.data.notes || null,
      estimated_price: price,
      deposit_amount: price != null ? Math.round(price * DEPOSIT_RATE) : null,
    });
    setSending(false);
    if (error) { toast.error("No pudimos enviar tu solicitud. Intenta de nuevo."); return; }
    qc.invalidateQueries({ queryKey: ["bookings"] });
    toast.success("Solicitud enviada. Un técnico te llamará para confirmar fecha, hora y lugar.");
    onDone();
  };

  const field = (key: keyof typeof form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block text-sm">
      <span className="text-muted-foreground">{label}</span>
      <input
        {...props}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="mt-1 w-full rounded-xl border border-glass-border bg-background/40 px-3 py-2 outline-none focus:border-primary"
      />
      {errors[key] && <span className="mt-1 block text-xs text-destructive">{errors[key]}</span>}
    </label>
  );

  return (
    <form onSubmit={submit} className="space-y-3">
      {field("location", "Ubicación (dirección y ciudad)", { placeholder: "Calle 00 #00-00, Bogotá" })}
      {field("email", "Correo electrónico", { type: "email" })}
      {field("phone", "Número de teléfono", { type: "tel", placeholder: "+57 300 000 0000" })}
      {field("notes", "Detalles (opcional)", { placeholder: "Cuéntanos qué necesitas" })}
      <p className="text-xs text-muted-foreground">
        El pago en línea de la reserva estará disponible pronto. Por ahora el técnico te indicará cómo pagarla al llamarte.
      </p>
      <div className="flex gap-2">
        <Button type="button" variant="glass" onClick={onBack}>Volver</Button>
        <Button type="submit" variant="flow" disabled={sending} className="flex-1">{sending ? "Enviando…" : "Enviar solicitud"}</Button>
      </div>
    </form>
  );
}
