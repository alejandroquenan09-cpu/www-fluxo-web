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

// Imagen por defecto si el servicio no tiene una personalizada
const FALLBACK_IMAGES: Record<string, string> = {
  mantenimiento: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
  redes: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
  web: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  digital: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  seguridad: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
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
  const imagenUrl = service.image || FALLBACK_IMAGES[service.category] || FALLBACK_IMAGES["mantenimiento"];

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="group block h-full w-full text-left">
        {/* Tarjeta con vidrio esmerilado más denso y difuminado para despegarse del fondo acuático */}
        <TiltCard className="flex h-full flex-col justify-between overflow-hidden border border-border/80 bg-card/85 p-5 sm:p-6 shadow-xl backdrop-blur-2xl transition-all hover:border-primary/50 hover:bg-card/95 hover:shadow-2xl">
          <div>
            {/* Cabecera con Fotografía Temática */}
            <div className="relative mb-4 h-36 sm:h-40 w-full overflow-hidden rounded-2xl border border-border/70 bg-muted/40">
              <img
                src={imagenUrl}
                alt={service.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-background/85 backdrop-blur-md text-primary shadow-sm ring-1 ring-primary/20">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="rounded-full bg-background/85 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-primary shadow-sm border border-primary/20">
                  {service.categoryLabel}
                </span>
              </div>
            </div>

            <h3 className="font-display text-lg font-bold text-foreground transition-colors group-hover:text-primary">
              {service.name}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {service.description}
            </p>

            {/* 3 puntos clave rápidos con fondo translúcido legible */}
            <ul className="mt-4 space-y-1.5 rounded-2xl border border-border/60 bg-background/60 p-3 text-xs text-muted-foreground backdrop-blur-sm">
              {service.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="leading-tight text-foreground/90">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 border-t border-border/60 pt-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground">Desde </span>
                <span className="font-display text-base font-bold text-foreground">{cop(service.price_cop)}</span>
              </div>
              <span className="text-[11px] font-medium text-primary">
                Reserva 10%: {cop(Math.round(service.price_cop * DEPOSIT_RATE))}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-primary">
              <span>Solicitar o ver detalle</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </TiltCard>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl border-border/80 bg-card/95 backdrop-blur-2xl">
          <ServiceDetails service={service} Icon={Icon} imagenUrl={imagenUrl} startBooking={!!bookSignal} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function ServiceDetails({
  service,
  Icon,
  imagenUrl,
  onDone,
  startBooking,
}: {
  service: ServiceItem;
  Icon: LucideIcon;
  imagenUrl: string;
  onDone: () => void;
  startBooking: boolean;
}) {
  const [booking, setBooking] = useState(startBooking);
  const { user } = useAuth();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    location: "",
    email: user?.email ?? "",
    phone: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const depositCop = Math.round(service.price_cop * DEPOSIT_RATE);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = bookingSchema.safeParse(form);
    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) errMap[issue.path[0] as string] = issue.message;
      });
      setErrors(errMap);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const fullNotes = `[Servicio solicitado: ${service.name}] ${form.notes ? "Notas: " + form.notes : ""}`;
      const { error } = await supabase.from("bookings").insert({
        service_id: service.parentId,
        user_id: user?.id ?? null,
        status: "pending",
        scheduled_for: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        notes: `${fullNotes} | Contacto: ${form.phone} | Ubicación: ${form.location}`,
      });

      if (error) throw error;

      toast.success("¡Reserva registrada con éxito!", {
        description: `Un funcionario de Fluxo se comunicará al ${form.phone} para acordar fecha y hora exactas.`,
        duration: 8000,
      });

      qc.invalidateQueries({ queryKey: ["bookings"] });
      onDone();
    } catch (err: unknown) {
      toast.error("Error al registrar la reserva", {
        description: err instanceof Error ? err.message : "Intenta nuevamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        {/* Cabecera con imagen en el modal */}
        <div className="relative mb-3 h-32 w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/30">
          <img src={imagenUrl} alt={service.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
          <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-background/85 backdrop-blur-md text-primary ring-1 ring-primary/20">
              <Icon className="h-4 w-4" />
            </span>
            <span className="rounded-full bg-background/85 backdrop-blur-md px-2.5 py-0.5 text-xs font-semibold text-primary">
              {service.categoryLabel}
            </span>
          </div>
        </div>

        <DialogTitle className="font-display text-xl sm:text-2xl font-bold">
          {service.name}
        </DialogTitle>
        <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
          {service.description}
        </DialogDescription>
      </DialogHeader>

      {!booking ? (
        <div className="mt-4 space-y-5">
          <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Lo que incluye este servicio:
            </h4>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm">
              {service.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="text-foreground/90">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4">
            <div>
              <div className="text-xs text-muted-foreground">Costo aproximado</div>
              <div className="font-display text-xl font-bold text-foreground">{cop(service.price_cop)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-primary">Anticipo de reserva (10%)</div>
              <div className="font-display text-lg font-bold text-primary">{cop(depositCop)}</div>
              <div className="text-[10px] text-muted-foreground">El saldo restante al concretar</div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="flow" className="w-full" size="lg" onClick={() => setBooking(true)}>
              Reservar con el 10% ({cop(depositCop)})
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleBooking} className="mt-4 space-y-4">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">¿Cómo funciona la reserva?</p>
            <p className="mt-0.5">
              Pagas únicamente el 10% ({cop(depositCop)}). Un funcionario de Fluxo te contactará por teléfono para coordinar día, hora y lugar. El 90% restante se cancela al finalizar el servicio.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Dirección o Ciudad *</label>
            <input
              type="text"
              required
              placeholder="Ej: Cra 15 # 85-30, Bogotá (o tu municipio)"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full rounded-xl border border-border/80 bg-background/80 px-3.5 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
            />
            {errors["location"] && <p className="text-[11px] text-destructive">{errors["location"]}</p>}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Correo electrónico *</label>
              <input
                type="email"
                required
                placeholder="tu@correo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-border/80 bg-background/80 px-3.5 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
              />
              {errors["email"] && <p className="text-[11px] text-destructive">{errors["email"]}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Teléfono / WhatsApp *</label>
              <input
                type="tel"
                required
                placeholder="Ej: +57 310 123 4567"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-border/80 bg-background/80 px-3.5 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
              />
              {errors["phone"] && <p className="text-[11px] text-destructive">{errors["phone"]}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Notas o detalles del equipo (opcional)</label>
            <textarea
              rows={2}
              placeholder="Marca, modelo, síntoma de la falla o requerimiento..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-xl border border-border/80 bg-background/80 px-3.5 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button type="button" variant="glass" size="lg" onClick={() => setBooking(false)} className="w-1/3">
              Volver
            </Button>
            <Button type="submit" variant="flow" size="lg" disabled={submitting} className="w-2/3">
              {submitting ? "Registrando..." : `Confirmar reserva (${cop(depositCop)})`}
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
