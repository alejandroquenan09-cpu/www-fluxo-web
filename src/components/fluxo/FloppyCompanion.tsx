import { useEffect, useRef, useState } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { Bell, BellOff, MessageCircle, Mic, MicOff, Phone, PhoneOff, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useLiveVoice, type LiveEvent } from "@/hooks/use-live-voice";
import mascot from "@/assets/floppy.png.asset.json";

const tips = [
  "Puedo llevarte al servicio que necesitas.",
  "¿Un problema con tu computador? Lo revisamos juntos.",
  "También puedes hablar conmigo en una llamada.",
  "Te ayudo a encontrar y abrir tu solicitud de servicio.",
];
const destinations = new Set([
  "/",
  "/servicios",
  "/ia",
  "/nuestra-esencia",
  "/sobre",
  "/dashboard",
  "/dashboard/reservas",
  "/dashboard/perfil",
  "/dashboard/configuracion",
]);

const MASCOT_SIZE = 112; // 200x200 px

export function FloppyCompanion() {
  const { session } = useAuth();
  const router = useRouter();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const [quiet, setQuiet] = useState(false);
  const [tip, setTip] = useState<string | null>(null);
  const [captions, setCaptions] = useState<Array<{ role: string; start: number; text: string }>>([]);
  const [seconds, setSeconds] = useState<number | null>(null);
  const [pending, setPending] = useState(false);

  // Posición arrastrable
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number }>({ x: 0, y: 0, posX: 0, posY: 0 });
  const hasMovedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const initialX = Math.max(16, window.innerWidth - MASCOT_SIZE - 20);
    const initialY = Math.max(16, window.innerHeight - MASCOT_SIZE - (window.innerWidth < 1024 ? 95 : 35));
    setPosition({ x: initialX, y: initialY });

    const handleResize = () => {
      setPosition((prev) => {
        if (!prev) return prev;
        const clampedX = Math.min(Math.max(12, prev.x), window.innerWidth - MASCOT_SIZE - 12);
        const clampedY = Math.min(Math.max(12, prev.y), window.innerHeight - MASCOT_SIZE - 12);
        return { x: clampedX, y: clampedY };
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onEvent = (event: LiveEvent) => {
    if (event.type === "app.delegation.pending") setPending(true);
    if (event.type === "app.navigation") {
      setPending(false);
      const plan = event["plan"] as { href?: string } | undefined;
      if (!plan?.href) return;
      const target = new URL(plan.href, window.location.origin);
      if (target.origin !== window.location.origin || !destinations.has(target.pathname)) return;
      router.history.push(target.pathname + target.search);
    }
    if (event.type === "gateway.session.created") setSeconds(15);
    if (typeof event.usage?.seconds === "number") setSeconds(Math.max(15, event.usage.seconds));
    if (["app.closed", "app.error", "gateway.error"].includes(event.type)) setPending(false);
    if (event.type === "session.input_transcript.delta" || event.type === "session.output_transcript.delta") {
      if (typeof event["delta"] !== "string") return;
      const text = event["delta"];
      const role = event.type === "session.input_transcript.delta" ? "Tú" : "Floppy";
      const start = typeof event["start_ms"] === "number" ? event["start_ms"] : 0;
      setCaptions((rows) => {
        const last = rows.at(-1);
        if (last?.role === role) return [...rows.slice(0, -1), { ...last, text: last.text + text }];
        return [...rows, { role, start, text }];
      });
    }
  };

  const call = useLiveVoice({ token: session?.access_token ?? "", onEvent });
  const active = call.status === "connecting" || call.status === "connected" || call.status === "stopping";

  useEffect(() => {
    setQuiet(localStorage.getItem("fluxo-floppy-quiet") === "true");
  }, []);

  useEffect(() => {
    if (quiet || open || active || pathname === "/auth" || pathname === "/reset-password") {
      setTip(null);
      return;
    }
    let index = 0;
    let dismiss: ReturnType<typeof setTimeout> | undefined;
    const show = () => {
      if (document.hidden || document.querySelector('[role="dialog"]')) return;
      setTip(tips[index % tips.length] ?? null);
      index++;
      dismiss = setTimeout(() => setTip(null), 7000);
    };
    const first = setTimeout(show, 18000);
    const interval = setInterval(show, 95000);
    return () => {
      clearTimeout(first);
      clearTimeout(dismiss);
      clearInterval(interval);
    };
  }, [quiet, open, active, pathname]);

  const toggleQuiet = () => {
    const value = !quiet;
    setQuiet(value);
    setTip(null);
    localStorage.setItem("fluxo-floppy-quiet", String(value));
  };

  const close = () => {
    call.stop();
    setOpen(false);
  };

  const start = () => {
    setCaptions([]);
    setSeconds(null);
    setPending(false);
    call.start();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!position) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    if (Math.hypot(deltaX, deltaY) > 6) {
      hasMovedRef.current = true;
    }

    const nextX = Math.min(
      Math.max(12, dragStartRef.current.posX + deltaX),
      window.innerWidth - MASCOT_SIZE - 12
    );
    const nextY = Math.min(
      Math.max(12, dragStartRef.current.posY + deltaY),
      window.innerHeight - MASCOT_SIZE - 12
    );

    setPosition({ x: nextX, y: nextY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignorar si el puntero se liberó
    }
    isDraggingRef.current = false;
  };

  const handleMascotClick = () => {
    if (hasMovedRef.current) return;
    setOpen(!open);
    setTip(null);
    if (open) call.stop();
  };

  // Saber en qué cuadrante de la pantalla está para orientar la ventana
  const isLeftSide = position ? position.x < window.innerWidth / 2 : false;
  const isTopSide = position ? position.y < window.innerHeight / 2 : false;

  // Calcular espacio máximo disponible en vertical
  const availableHeight = position
    ? isTopSide
      ? Math.max(260, window.innerHeight - (position.y + MASCOT_SIZE + 30))
      : Math.max(260, position.y - 30)
    : 440;

  return (
    <aside
      className="floppy-companion"
      aria-label="Asistente Floppy"
      style={{
        position: "fixed",
        left: position ? `${position.x}px` : undefined,
        top: position ? `${position.y}px` : undefined,
        right: position ? "auto" : "16px",
        bottom: position ? "auto" : "90px",
        width: `${MASCOT_SIZE}px`,
        height: `${MASCOT_SIZE}px`,
        zIndex: 45,
      }}
    >
      <audio ref={call.audioRef} controls className={open ? "mt-3 w-full" : "hidden"} />

      {open && (
        <section
          className="floppy-call rounded-xl border border-border bg-popover p-5 text-popover-foreground shadow-glass"
          aria-label="Llamada con Floppy"
          style={{
            position: "absolute",
            left: isLeftSide ? 0 : "auto",
            right: isLeftSide ? "auto" : 0,
            top: isTopSide ? `${MASCOT_SIZE + 10}px` : "auto",
            bottom: isTopSide ? "auto" : `${MASCOT_SIZE + 10}px`,
            maxHeight: `${availableHeight}px`,
            paddingBottom: "1.25rem", // Elimina el padding excesivo
            overflowY: "auto",
          }}
        >
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Floppy</h2>
              <p role="status" className="text-xs text-muted-foreground">
                {
                  ({
                    idle: "¿Hablamos?",
                    connecting: "Conectando…",
                    connected: "Llamada en vivo",
                    stopping: "Finalizando…",
                    closed: "Llamada finalizada",
                  })[call.status]
                }
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={close} aria-label="Cerrar Floppy" title="Cerrar y finalizar llamada">
              <X />
            </Button>
          </header>

          <img src={mascot.url} alt="Floppy, mascota acuática de Fluxo" className="mx-auto h-24 w-24 object-contain my-1" />

          {!active && !session && (
            <div className="text-center">
              <p className="mb-4 text-sm">Inicia sesión para hablar con Floppy.</p>
              <Button asChild variant="flow">
                <Link to="/auth" search={{ mode: "login" }} onClick={() => setOpen(false)}>
                  Iniciar sesión
                </Link>
              </Button>
            </div>
          )}

          {(active || session) && (
            <div className="space-y-3">
              {call.error && <p className="text-sm text-destructive">{call.error}</p>}
              {pending && <p className="text-xs text-muted-foreground">Buscando la sección…</p>}
              {seconds !== null && active && (
                <p className="text-xs text-muted-foreground">Duración mínima: {seconds} s</p>
              )}
              {captions.length > 0 && (
                <div className="max-h-32 space-y-1 overflow-y-auto rounded-lg bg-muted/40 p-2 text-xs" aria-live="polite">
                  {captions.map((row, i) => (
                    <p key={`${row.role}-${row.start}-${i}`}>
                      <strong>{row.role}:</strong> {row.text}
                    </p>
                  ))}
                </div>
              )}
              {call.playbackBlocked && (
                <Button variant="glass" className="w-full" onClick={() => call.resumePlayback()}>
                  <Play /> Activar audio
                </Button>
              )}
              <div className="flex items-center justify-center gap-2">
                {active ? (
                  <>
                    <Button
                      variant="glass"
                      size="icon"
                      onClick={() => call.setMuted(!call.muted)}
                      aria-label={call.muted ? "Activar micrófono" : "Silenciar micrófono"}
                    >
                      {call.muted ? <MicOff /> : <Mic />}
                    </Button>
                    <Button variant="destructive" onClick={() => call.stop()}>
                      <PhoneOff /> Finalizar
                    </Button>
                  </>
                ) : (
                  <Button variant="flow" onClick={start}>
                    <Phone /> Llamar a Floppy
                  </Button>
                )}
              </div>
              <div className="flex items-center justify-between text-xs">
                <Link to="/dashboard/ia" onClick={() => setOpen(false)} className="inline-flex items-center gap-1 underline">
                  <MessageCircle className="h-3 w-3" /> Abrir chat
                </Link>
                <button type="button" onClick={toggleQuiet} className="inline-flex items-center gap-1 text-muted-foreground">
                  {quiet ? <BellOff className="h-3 w-3" /> : <Bell className="h-3 w-3" />}
                  {quiet ? "Consejos silenciados" : "Silenciar consejos"}
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {tip && !open && (
        <div
          role="status"
          className="floppy-tip rounded-xl border border-border bg-popover p-3 text-sm text-popover-foreground shadow-glass"
          style={{
            left: isLeftSide ? 0 : "auto",
            right: isLeftSide ? "auto" : 0,
            top: isTopSide ? `${MASCOT_SIZE + 10}px` : "auto",
            bottom: isTopSide ? "auto" : `${MASCOT_SIZE + 10}px`,
          }}
        >
          {tip}
        </div>
      )}

      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleMascotClick}
        aria-label={open ? "Cerrar asistente Floppy" : "Abrir asistente Floppy"}
        title="Arrastra a Floppy o haz clic para abrir"
        className={`floppy-mascot relative flex items-center justify-center rounded-full p-0 cursor-grab active:cursor-grabbing touch-none select-none transition-all duration-300 ease-in-out ${
          open || active
            ? "opacity-100 drop-shadow-xl scale-100"
            : "opacity-40 hover:opacity-100 focus-visible:opacity-100 active:opacity-100 drop-shadow-sm hover:drop-shadow-xl hover:scale-105 active:scale-95"
        }`}
        style={{ width: `${MASCOT_SIZE}px`, height: `${MASCOT_SIZE}px` }}
      >
        <img src={mascot.url} alt="Floppy" className="pointer-events-none h-full w-full object-contain" draggable={false} />
      </button>
    </aside>
  );
}
