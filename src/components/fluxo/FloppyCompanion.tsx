import { useEffect, useRef, useState } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useLiveVoice, type LiveEvent } from "@/hooks/use-live-voice";
import mascot from "@/assets/floppy.png.asset.json";

const tips = [
  "¡Tócame y dime a dónde quieres ir!",
  "¿Tu computador anda lento? Te ayudo a encontrar el servicio.",
  "Puedo llevarte a cualquier parte de la página con tu voz.",
  "Pídeme reservar un servicio y te llevo directo.",
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

const SIZE = 96;
const MARGIN = 12;
const MET_KEY = "fluxo-floppy-met";
const QUIET_KEY = "fluxo-floppy-quiet";

type Pos = { x: number; y: number };

function clamp(p: Pos): Pos {
  return {
    x: Math.min(Math.max(MARGIN, p.x), window.innerWidth - SIZE - MARGIN),
    y: Math.min(Math.max(MARGIN + 64, p.y), window.innerHeight - SIZE - MARGIN),
  };
}

// Random spot along the side edges so Floppy never sits over the reading area.
function edgeSpot(): Pos {
  const left = Math.random() < 0.5;
  const x = left ? MARGIN + Math.random() * 16 : window.innerWidth - SIZE - MARGIN - Math.random() * 16;
  const y = 90 + Math.random() * Math.max(40, window.innerHeight - SIZE - 120);
  return clamp({ x, y });
}

export function FloppyCompanion() {
  const { session } = useAuth();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [pos, setPos] = useState<Pos | null>(null);
  const [dragging, setDragging] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [blink, setBlink] = useState(false);
  const [boing, setBoing] = useState(false);
  const [quiet, setQuiet] = useState(false);
  const [first, setFirst] = useState(false);
  const drag = useRef({ x: 0, y: 0, px: 0, py: 0, moved: false, down: false });
  const bubbleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const say = (text: string | null, ms = 6000) => {
    clearTimeout(bubbleTimer.current);
    setBubble(text);
    if (text) bubbleTimer.current = setTimeout(() => setBubble(null), ms);
  };

  const onEvent = (event: LiveEvent) => {
    if (event.type === "app.delegation.pending") say("Buscando…", 4000);
    if (event.type === "app.navigation") {
      const plan = event["plan"] as { href?: string } | undefined;
      if (!plan?.href) return;
      const target = new URL(plan.href, window.location.origin);
      if (target.origin !== window.location.origin || !destinations.has(target.pathname)) return;
      router.history.push(target.pathname + target.search);
    }
    if (event.type === "app.connected" && first) {
      localStorage.setItem(MET_KEY, "true");
      setFirst(false);
    }
    if (event.type === "app.error" || event.type === "gateway.error") say("Uy, se cortó. Tócame otra vez.", 5000);
  };

  const call = useLiveVoice({ token: session?.access_token ?? "", first, onEvent });
  const active = call.status === "connecting" || call.status === "connected" || call.status === "stopping";

  useEffect(() => {
    setFirst(localStorage.getItem(MET_KEY) !== "true");
    setQuiet(localStorage.getItem(QUIET_KEY) === "true");
    setPos(clamp({ x: window.innerWidth - SIZE - 20, y: window.innerHeight - SIZE - 30 }));
    const onResize = () => setPos((p) => (p ? clamp(p) : p));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Gentle patrol along the edges while idle.
  useEffect(() => {
    if (active || dragging) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => setPos(edgeSpot()), 14000);
    return () => clearInterval(id);
  }, [active, dragging]);

  // Random blinks.
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 160);
        loop();
      }, 4000 + Math.random() * 3000);
    };
    loop();
    return () => clearTimeout(t);
  }, []);

  // Spontaneous tip bubbles.
  useEffect(() => {
    if (quiet || active || pathname === "/auth" || pathname === "/reset-password") return;
    let i = Math.floor(Math.random() * tips.length);
    const show = () => {
      if (document.hidden || document.querySelector('[role="dialog"]')) return;
      say(tips[i++ % tips.length] ?? null, 6500);
    };
    const firstT = setTimeout(show, 15000);
    const id = setInterval(show, 80000);
    return () => {
      clearTimeout(firstT);
      clearInterval(id);
    };
  }, [quiet, active, pathname]);

  useEffect(() => {
    if (call.status === "connected") say(first ? null : "Te escucho…", 2500);
  }, [call.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const onDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!pos) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y, moved: false, down: true };
  };
  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d.down) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) > 6) {
      d.moved = true;
      setDragging(true);
    }
    if (d.moved) setPos(clamp({ x: d.px + dx, y: d.py + dy }));
  };
  const onUp = () => {
    drag.current.down = false;
    setTimeout(() => setDragging(false), 0);
  };

  const onClick = (e: React.MouseEvent) => {
    if (drag.current.moved) return;
    setBoing(true);
    setTimeout(() => setBoing(false), 450);
    if (e.altKey) {
      const v = !quiet;
      setQuiet(v);
      localStorage.setItem(QUIET_KEY, String(v));
      say(v ? "Me quedo calladito." : "¡Vuelvo con consejos!", 2500);
      return;
    }
    if (active) {
      call.stop();
      say(null);
      return;
    }
    if (!session) {
      say("Inicia sesión para hablar conmigo.", 4500);
      router.navigate({ to: "/auth", search: { mode: "login" } as never });
      return;
    }
    say(null);
    call.start();
  };

  const isLeft = pos ? pos.x < window.innerWidth / 2 : false;
  const isTop = pos ? pos.y < window.innerHeight / 2 : false;

  return (
    <aside
      className="floppy-companion"
      aria-label="Floppy, asistente de Fluxo"
      style={{
        left: pos ? pos.x : undefined,
        top: pos ? pos.y : undefined,
        right: pos ? "auto" : 16,
        bottom: pos ? "auto" : 30,
        width: SIZE,
        height: SIZE,
        transition: dragging ? "none" : "left 6s ease-in-out, top 6s ease-in-out",
      }}
    >
      <audio ref={call.audioRef} className="hidden" />

      {bubble && (
        <div
          role="status"
          className="floppy-tip"
          style={{
            left: isLeft ? 0 : "auto",
            right: isLeft ? "auto" : 0,
            top: isTop ? SIZE + 8 : "auto",
            bottom: isTop ? "auto" : SIZE + 8,
          }}
        >
          {bubble}
        </div>
      )}

      <button
        type="button"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onClick={onClick}
        aria-pressed={active}
        aria-label={active ? "Detener a Floppy" : "Hablar con Floppy"}
        title={active ? "Toca para interrumpir" : "Toca para hablar · arrástrame · Alt+clic silencia consejos"}
        className={`floppy-mascot ${active ? "is-active" : ""} ${call.status === "connecting" ? "is-connecting" : ""} ${boing ? "is-boing" : ""}`}
      >
        {active && (
          <>
            <span className="floppy-aura" aria-hidden />
            <span className="floppy-aura floppy-aura-2" aria-hidden />
          </>
        )}
        <span className="floppy-body">
          <img
            src={mascot.url}
            alt=""
            draggable={false}
            className={`floppy-img ${blink ? "is-blink" : ""}`}
          />
        </span>
      </button>
    </aside>
  );
}
