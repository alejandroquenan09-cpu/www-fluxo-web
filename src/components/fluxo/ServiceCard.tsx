import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowUpRight, Check, Code2, LayoutGrid, Monitor, Network, Sparkles, Waves, Wrench, type LucideIcon,
} from "lucide-react";
import { TiltCard } from "./TiltCard";
import type { ServiceItem } from "@/lib/catalog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles, layout: LayoutGrid, waves: Waves, code: Code2, wrench: Wrench, network: Network, monitor: Monitor,
};

export const DEPOSIT_RATE = 0.1;
export const cop = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

const bookingSchema = z.object({
  location: z.string().trim().min(5, "Indica una dirección o ciudad completa").max(300),
  email: z.string().trim().email("Correo no válido").max(255),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{6,19}$/, "Teléfono no válido"),
  notes: z.string().trim().max(1000).optional(),
});

export function ServiceCard({
  service,
  openSignal,
  bookSignal,
}: {
  service: ServiceItem;
  openSignal?: number | undefined;
  bookSignal?: boolean | undefined;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (openSignal) setOpen(true); }, [openSignal]);
  const Icon = ICONS[service.icon] ?? Sparkles;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="block h-full w-full text-left">
        <TiltCard className="flex h-full flex-col justify-between p-6 sm:p-7">
          <div>
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/25 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Icon className="h-5 w-5" />
              </span>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium tracking-wide text-primary">
                {service.categoryLabel}
              </span>
            </div>

            <h3 className="mt-5 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {service.name}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {service.description}
            </p>

            {/* 3 puntos clave rápidos sin saturar */}
            <ul className="mt-4 space-y-1.5 border-t border-border/40 pt-4 text-xs text-muted-foreground">
              {service.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="leading-tight">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 border-t border-border/40 pt-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground">Desde </span>
                <span className="font-display font-semibold text-foreground">{cop(service.price_cop)}</span>
              </div>
              <span className="text-[11px] text-primary">
                Reserva 10%: {cop(Math.round(service.price_cop * DEPOSIT_RATE))}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-medium text-primary">
              <span>Solicitar o ver detalle</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
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

function ServiceDetails({
  service,
  Icon,
  onDone,
  startBooking,
}: {
  service: ServiceItem;
  Icon: LucideIcon;
  onDone: () => void;
  startBooking: boolean;
}) {
  const [booking, setBooking] = useState(startBooking);

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/25">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-wider text-primary font-semibold">{service.categoryLabel}</p>
            <DialogTitle className="text-2xl font-bold">{service.name}</DialogTitle>
          </div>
        </div>
        <DialogDescription className="mt-2 text-sm leading-relaxed">{service.description}</DialogDescription>
      </DialogHeader>

      {!booking && (
        <div className="space-y-4">
          <div className="glass rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">¿Qué incluye este servicio?</p>
            <ul className="mt-3 space-y-2 text-sm">
              {service.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Costo aproximado base</span>
              <span className="font-semibold">{cop(service.price_cop)}</span>
            </div>
            <div className="mt-1.5 flex justify-between">
              <span className="text-muted-foreground">Anticipo de reserva (10%)</span>
              <span className="font-semibold text-primary">{cop(Math.round(service.price_cop * DEPOSIT_RATE))}</span>
            </div>
            <p className="mt-2.5 text-xs text-muted-foreground">
              Un funcionario de Fluxo se comunicará contigo para confirmar fecha, hora y ubicación exacta. El 90% restante se cancela al realizar el trabajo.
            </p>
          </div>

          <Button variant="flow" size="lg" className="w-full" onClick={() => setBooking(true)}>
            Solicitar este servicio
          </Button>
        </div>
      )}

      {booking && (
        <BookingForm service={service} onDone={onDone} onBack={() => setBooking(false)} />
      )}
    </>
  );
}

function BookingForm({
  service,
  onDone,
  onBack,
}: {
  service: ServiceItem;
  onDone: () => void;
  onBack: () => void;
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState({ location: "", email: user?.email ?? "", phone: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  if (!user) {
    return (
      <div className="space-y-3 text-sm">
        <p className="text-muted-foreground">Inicia sesión en Fluxo para solicitar este servicio.</p>
        <Button asChild variant="flow" onClick={onDone}>
          <Link to="/auth" search={{ mode: "login" }}>Iniciar sesión</Link>
        </Button>
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
    const fullNotes = `[${service.name}] ${parsed.data.notes || ""}`.trim();

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      service_id: service.parentId,
      location: parsed.data.location,
      email: parsed.data.email,
      phone: parsed.data.phone,
      notes: fullNotes || null,
      estimated_price: price,
      deposit_amount: Math.round(price * DEPOSIT_RATE),
    });

    setSending(false);
    if (error) {
      toast.error("No pudimos enviar tu solicitud. Intenta de nuevo.");
      return;
    }
    qc.invalidateQueries({ queryKey: ["bookings"] });
    toast.success(`Solicitud de ${service.name} enviada con éxito. Te llamaremos pronto.`);
    onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-muted-foreground">Ubicación / Dirección *</label>
        <input
          required
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="Ej: Calle 45 # 12-34, Bogotá"
          className="mt-1 w-full rounded-xl border border-glass-border bg-glass px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.location && <p className="mt-1 text-xs text-destructive">{errors.location}</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-muted-foreground">Correo de contacto *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 w-full rounded-xl border border-glass-border bg-glass px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground">Teléfono celular *</label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="300 123 4567"
            className="mt-1 w-full rounded-xl border border-glass-border bg-glass px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground">Detalles adicionales (opcional)</label>
        <textarea
          rows={3}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Cuéntanos modelo del equipo, falla o necesidades específicas..."
          className="mt-1 w-full rounded-xl border border-glass-border bg-glass px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onBack}>Volver</Button>
        <Button type="submit" variant="flow" disabled={sending}>
          {sending ? "Enviando solicitud..." : "Confirmar solicitud"}
        </Button>
      </div>
    </form>
  );
}
