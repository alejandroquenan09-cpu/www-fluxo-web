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

const MASCOT_SIZE = 112; // Tamaño más grande en px (112x112)

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

  // Posición arrastrable de Floppy
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number }>({ x: 0, y: 0, posX: 0, posY: 0 });
  const hasMovedRef = useRef(false);

  // Inicializar posición en la esquina inferior derecha
  useEffect(() => {
    if (typeof window === "undefined") return;
    const initialX = Math.max(16, window.innerWidth - MASCOT_SIZE - 20);
    const initialY = Math.max(16, window.innerHeight - MASCOT_SIZE - (window.innerWidth < 1024 ? 90 : 30));
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
      setCaptions((rows) => {
        const last = rows.at(-1);
        if (last?.role === role) return [...rows.slice(0, -1), { ...last, text: last.text + text }];
        return [...rows, { role, start, text }];
      });
    }
  };

  const call = useLiveVoice({ token: session?.access_token, onEvent });
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
      setTip(tips[index % tips.length]);
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

  // Manejo de arrastre con pointer events (touch y mouse)
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
      // Ignorar si el puntero ya se liberó
    }
    isDraggingRef.current = false;
  };

  const handleMascotClick = () => {
    // Si se arrastró, no abrir ni cerrar el modal
    if (hasMovedRef.current) return;
    setOpen(!open);
    setTip(null);
    if (open) call.stop();
  };

  // Calcular orientación del menú según dónde esté Floppy en pantalla
  const isLeftSide = position ? position.x < window.innerWidth / 2 : false;
  const isTopSide = position ? position.y < window.innerHeight / 2 : false;

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
            [isLeftSide ? "left" : "right"]: 0,
            [isTopSide ? "top" : "bottom"]: `${MASCOT_SIZE + 10}px`,
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

          <img src={mascot.url} alt="Floppy, mascota acuática de Fluxo" className="mx-auto h-28 w-28 object-contain" />

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

          {!active && session && (
            <>
              <p className="mb-4 text-center text-xs text-muted-foreground">Usaremos tu micrófono durante la llamada.</p>
              <Button className="w-full" variant="flow" onClick={start}>
                <Phone />
                Llamar a Floppy
              </Button>
            </>
          )}

          {active && (
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                size="icon"
                disabled={call.status !== "connected"}
                onClick={() => call.setMuted(!call.muted)}
                aria-label={call.muted ? "Activar micrófono" : "Silenciar micrófono"}
                title={call.muted ? "Activar micrófono" : "Silenciar micrófono"}
              >
                {call.muted ? <MicOff /> : <Mic />}
              </Button>
              <Button variant="destructive" onClick={call.stop} disabled={call.status === "stopping"}>
                <PhoneOff />
                Finalizar
              </Button>
            </div>
          )}

          {call.playbackBlocked && (
            <Button className="mt-3 w-full" onClick={call.resumePlayback}>
              <Play />
              Escuchar a Floppy
            </Button>
          )}

          {call.error && <p role="alert" className="mt-3 text-sm text-destructive">{call.error}</p>}
          {pending && <p role="status" className="mt-3 text-xs text-muted-foreground">Consultando tu solicitud…</p>}

          {captions.length > 0 && (
            <div className="mt-4 max-h-32 space-y-2 overflow-y-auto border-t border-border pt-3">
              {captions.map((row, index) => (
                <p key={`${row.start}-${index}`} className="text-xs leading-relaxed">
                  <strong>{row.role}: </strong>
                  {row.text}
                </p>
              ))}
            </div>
          )}

          {seconds !== null && (
            <p className="mt-3 text-xs text-muted-foreground">
              Voz: {Math.ceil(seconds)} s{call.finalized === false ? " · duración final sin confirmar" : ""}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <Button asChild variant="link" className="px-0">
              <Link to={session ? "/dashboard/ia" : "/ia"} onClick={close}>
                <MessageCircle />
                Abrir chat
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleQuiet}
              aria-label={quiet ? "Activar consejos" : "Silenciar consejos"}
              title={quiet ? "Activar consejos" : "Silenciar consejos"}
            >
              {quiet ? <BellOff /> : <Bell />}
            </Button>
          </div>
        </section>
      )}

      {tip && !open && (
        <div
          className="floppy-tip rounded-xl border border-border bg-popover p-3 text-popover-foreground shadow-glass"
          style={{
            position: "absolute",
            [isLeftSide ? "left" : "right"]: 0,
            [isTopSide ? "top" : "bottom"]: `${MASCOT_SIZE + 10}px`,
          }}
        >
          <p className="pr-6 text-xs leading-relaxed">{tip}</p>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-0 top-0 h-7 w-7"
            aria-label="Silenciar consejos"
            title="Silenciar consejos"
            onClick={toggleQuiet}
          >
            <X />
          </Button>
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
        className="floppy-mascot relative flex items-center justify-center rounded-full p-0 transition-transform active:scale-95 cursor-grab active:cursor-grabbing touch-none select-none drop-shadow-xl"
        style={{
          width: `${MASCOT_SIZE}px`,
          height: `${MASCOT_SIZE}px`,
        }}
      >
        <img
          src={mascot.url}
          alt="Floppy"
          className="pointer-events-none h-full w-full object-contain"
          draggable={false}
        />
      </button>
    </aside>
  );
}
