import { useEffect, useState } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { Bell, BellOff, MessageCircle, Mic, MicOff, Phone, PhoneOff, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useLiveVoice, type LiveEvent } from "@/hooks/use-live-voice";
import mascot from "@/assets/floppy.png.asset.json";

const tips = ["Puedo llevarte al servicio que necesitas.", "¿Un problema con tu computador? Lo revisamos juntos.", "También puedes hablar conmigo en una llamada.", "Te ayudo a encontrar y abrir tu solicitud de servicio."];
const destinations = new Set(["/", "/servicios", "/ia", "/nuestra-esencia", "/sobre", "/dashboard", "/dashboard/reservas", "/dashboard/perfil", "/dashboard/configuracion"]);

export function FloppyCompanion() {
  const { session } = useAuth();
  const router = useRouter();
  const pathname = useRouterState({ select: state => state.location.pathname });
  const [open, setOpen] = useState(false);
  const [quiet, setQuiet] = useState(false);
  const [tip, setTip] = useState<string | null>(null);
  const [captions, setCaptions] = useState<Array<{ role: string; start: number; text: string }>>([]);
  const [seconds, setSeconds] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const onEvent = (event: LiveEvent) => {
    if (event.type === "app.delegation.pending") setPending(true);
    if (event.type === "app.navigation") {
      setPending(false);
      const plan = event.plan as { href?: string } | undefined;
      if (!plan?.href) return;
      const target = new URL(plan.href, window.location.origin);
      if (target.origin !== window.location.origin || !destinations.has(target.pathname)) return;
      router.history.push(target.pathname + target.search);
    }
    if (event.type === "gateway.session.created") setSeconds(15);
    if (typeof event.usage?.seconds === "number") setSeconds(Math.max(15, event.usage.seconds));
    if (["app.closed", "app.error", "gateway.error"].includes(event.type)) setPending(false);
    if (event.type === "session.input_transcript.delta" || event.type === "session.output_transcript.delta") {
      if (typeof event.delta !== "string") return;
      const text = event.delta;
      const role = event.type === "session.input_transcript.delta" ? "Tú" : "Floppy";
      const start = typeof event.start_ms === "number" ? event.start_ms : 0;
      setCaptions(rows => {
        const last = rows.at(-1);
        if (last?.role === role) return [...rows.slice(0, -1), { ...last, text: last.text + text }];
        return [...rows, { role, start, text }];
      });
    }
  };
  const call = useLiveVoice({ token: session?.access_token, onEvent });
  const active = call.status === "connecting" || call.status === "connected" || call.status === "stopping";
  useEffect(() => { setQuiet(localStorage.getItem("fluxo-floppy-quiet") === "true"); }, []);
  useEffect(() => {
    if (quiet || open || active || pathname === "/auth" || pathname === "/reset-password") { setTip(null); return; }
    let index = 0;
    let dismiss: ReturnType<typeof setTimeout> | undefined;
    const show = () => {
      if (document.hidden || document.querySelector('[role="dialog"]')) return;
      setTip(tips[index % tips.length]); index++;
      dismiss = setTimeout(() => setTip(null), 7000);
    };
    const first = setTimeout(show, 18000);
    const interval = setInterval(show, 95000);
    return () => { clearTimeout(first); clearTimeout(dismiss); clearInterval(interval); };
  }, [quiet, open, active, pathname]);
  const toggleQuiet = () => { const value = !quiet; setQuiet(value); setTip(null); localStorage.setItem("fluxo-floppy-quiet", String(value)); };
  const close = () => { call.stop(); setOpen(false); };
  const start = () => { setCaptions([]); setSeconds(null); setPending(false); call.start(); };
  return (
    <aside className="floppy-companion" aria-label="Asistente Floppy">
      <audio ref={call.audioRef} controls className={open ? "mt-3 w-full" : "hidden"} />
      {open && <section className="floppy-call rounded-lg border border-border bg-popover p-5 text-popover-foreground shadow-glass" aria-label="Llamada con Floppy">
        <header className="flex items-center justify-between">
          <div><h2 className="text-lg font-semibold">Floppy</h2><p role="status" className="text-xs text-muted-foreground">{({ idle: "¿Hablamos?", connecting: "Conectando…", connected: "Llamada en vivo", stopping: "Finalizando…", closed: "Llamada finalizada" })[call.status]}</p></div>
          <Button variant="ghost" size="icon" onClick={close} aria-label="Cerrar Floppy" title="Cerrar y finalizar llamada"><X /></Button>
        </header>
        <img src={mascot.url} alt="Floppy, mascota acuática de Fluxo" className="mx-auto h-28 w-28 object-contain" />
        {!active && !session && <div className="text-center"><p className="mb-4 text-sm">Inicia sesión para hablar con Floppy.</p><Button asChild variant="flow"><Link to="/auth" search={{ mode: "login" }} onClick={() => setOpen(false)}>Iniciar sesión</Link></Button></div>}
        {!active && session && <><p className="mb-4 text-center text-xs text-muted-foreground">Usaremos tu micrófono durante la llamada.</p><Button className="w-full" variant="flow" onClick={start}><Phone />Llamar a Floppy</Button></>}
        {active && <div className="flex justify-center gap-3">
          <Button variant="outline" size="icon" disabled={call.status !== "connected"} onClick={() => call.setMuted(!call.muted)} aria-label={call.muted ? "Activar micrófono" : "Silenciar micrófono"} title={call.muted ? "Activar micrófono" : "Silenciar micrófono"}>{call.muted ? <MicOff /> : <Mic />}</Button>
          <Button variant="destructive" onClick={call.stop} disabled={call.status === "stopping"}><PhoneOff />Finalizar</Button>
        </div>}
        {call.playbackBlocked && <Button className="mt-3 w-full" onClick={call.resumePlayback}><Play />Escuchar a Floppy</Button>}
        {call.error && <p role="alert" className="mt-3 text-sm text-destructive">{call.error}</p>}
        {pending && <p role="status" className="mt-3 text-xs text-muted-foreground">Consultando tu solicitud…</p>}
        {captions.length > 0 && <div className="mt-4 max-h-32 space-y-2 overflow-y-auto border-t border-border pt-3">{captions.map((row, index) => <p key={`${row.start}-${index}`} className="text-xs leading-relaxed"><strong>{row.role}: </strong>{row.text}</p>)}</div>}
        {seconds !== null && <p className="mt-3 text-xs text-muted-foreground">Voz: {Math.ceil(seconds)} s{call.finalized === false ? " · duración final sin confirmar" : ""}</p>}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <Button asChild variant="link" className="px-0"><Link to={session ? "/dashboard/ia" : "/ia"} onClick={close}><MessageCircle />Abrir chat</Link></Button>
          <Button variant="ghost" size="icon" onClick={toggleQuiet} aria-label={quiet ? "Activar consejos" : "Silenciar consejos"} title={quiet ? "Activar consejos" : "Silenciar consejos"}>{quiet ? <BellOff /> : <Bell />}</Button>
        </div>
      </section>}
      {tip && !open && <div className="floppy-tip rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-glass"><p className="pr-6 text-xs leading-relaxed">{tip}</p><Button size="icon" variant="ghost" className="absolute right-0 top-0 h-7 w-7" aria-label="Silenciar consejos" title="Silenciar consejos" onClick={toggleQuiet}><X /></Button></div>}
      <Button variant="ghost" onClick={() => { setOpen(!open); setTip(null); if (open) call.stop(); }} aria-label={open ? "Cerrar asistente Floppy" : "Abrir asistente Floppy"} title="Floppy · Chat y llamada" className="floppy-mascot h-20 w-20 rounded-full p-0 hover:bg-transparent">
        <img src={mascot.url} alt="Floppy" className="h-full w-full object-contain" />
      </Button>
    </aside>
  );
}