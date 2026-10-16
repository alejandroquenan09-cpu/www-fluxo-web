import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useLiveVoice, type LiveEvent } from "@/hooks/use-live-voice";
import mascot from "@/assets/floppy.png.asset.json";

const tips = [
  "¡Tócame para chatear conmigo!",
  "¿Tu computador anda lento? Te ayudo a encontrar el servicio.",
  "Pídeme asesoría o información sobre cualquier servicio.",
  "Puedo ayudarte a resolver dudas técnicas.",
  "Siempre estoy aquí para acompañarte.",
  "Soy Floppy, ¿en qué te puedo ayudar hoy?",
  "Presióname y abrimos el chat de Floppy.",
];

const destinations = new Set([
  "/",
  "/servicios",
  "/ia",
  "/nuestra-esencia",
  "/sobre",
  "/dashboard",
  "/dashboard/ia",
  "/dashboard/reservas",
  "/dashboard/perfil",
  "/dashboard/configuracion",
]);

const SIZE = 96;
const MARGIN = 12;
const MET_KEY = "fluxo-floppy-met";
const QUIET_KEY = "fluxo-floppy-quiet";
const RETURN_DELAY_MS = 6000;

type Pos = { x: number; y: number };

function clamp(p: Pos): Pos {
  return {
    x: Math.min(Math.max(MARGIN, p.x), window.innerWidth - SIZE - MARGIN),
    y: Math.min(Math.max(MARGIN + 64, p.y), window.innerHeight - SIZE - MARGIN),
  };
}

function homeSpot(): Pos {
  return clamp({
    x: window.innerWidth - SIZE - 20,
    y: window.innerHeight - SIZE - 30,
  });
}

export function FloppyCompanion() {
  const { session } = useAuth();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [pos, setPos] = useState<Pos | null>(null);
  const [dragging, setDragging] = useState(false);
  const [snapping, setSnapping] = useState(false);
  const [returningHome, setReturningHome] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [blink, setBlink] = useState(false);
  const [boing, setBoing] = useState(false);
  const [quiet, setQuiet] = useState(false);
  const [first, setFirst] = useState(false);
  const drag = useRef({ x: 0, y: 0, px: 0, py: 0, moved: false, down: true });
  const bubbleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const returnTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

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
  };

  const call = useLiveVoice({ token: session?.access_token ?? "", first, onEvent });
  const active = call.status === "connecting" || call.status === "connected" || call.status === "stopping";

  const scheduleReturnHome = useCallback((delay = RETURN_DELAY_MS) => {
    clearTimeout(returnTimer.current);
    returnTimer.current = setTimeout(() => {
      if (active || drag.current.down) return;
      const home = homeSpot();
      setPos((current) => {
        if (!current) return home;
        if (Math.hypot(current.x - home.x, current.y - home.y) < 16) return current;
        setReturningHome(true);
        setTimeout(() => setReturningHome(false), 1250);
        return home;
      });
    }, delay);
  }, [active]);

  useEffect(() => {
    setFirst(localStorage.getItem(MET_KEY) !== "true");
    setQuiet(localStorage.getItem(QUIET_KEY) === "true");
    setPos(homeSpot());
    const onResize = () => setPos((p) => (p ? clamp(p) : homeSpot()));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Parpadeos espontáneos
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

  // Consejos espontáneos (no aparecen en el chat ni en auth)
  useEffect(() => {
    if (quiet || active || pathname === "/auth" || pathname === "/reset-password" || pathname.includes("/ia")) return;
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

  const onDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!pos) return;
    clearTimeout(returnTimer.current);
    setReturningHome(false);
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
    if (drag.current.moved) {
      setSnapping(true);
      setPos((current) => {
        if (!current) return current;
        const midX = current.x + SIZE / 2;
        const targetX = midX < window.innerWidth / 2 ? MARGIN : window.innerWidth - SIZE - MARGIN;
        return clamp({ x: targetX, y: current.y });
      });
      setTimeout(() => {
        setSnapping(false);
        setDragging(false);
      }, 550);
      scheduleReturnHome(RETURN_DELAY_MS);
    } else {
      setTimeout(() => setDragging(false), 0);
    }
  };

  const onClick = (e: React.MouseEvent) => {
    if (drag.current.moved) return;
    setBoing(true);
    setTimeout(() => setBoing(false), 450);

    // Silenciar o activar consejos con Alt + clic
    if (e.altKey) {
      const v = !quiet;
      setQuiet(v);
      localStorage.setItem(QUIET_KEY, String(v));
      say(v ? "Me quedo calladito." : "¡Vuelvo con consejos!", 2500);
      return;
    }

    // Si ya está en la vista del chat de Floppy
    if (pathname === "/dashboard/ia" || pathname === "/ia") {
      say("¡Ya estás chateando conmigo! 💬", 3000);
      return;
    }

    // Redirección inmediata al chat de Floppy
    if (session) {
      router.navigate({ to: "/dashboard/ia" });
    } else {
      router.navigate({ to: "/ia" });
    }
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
        right: pos ? "auto" : 20,
        bottom: pos ? "auto" : 30,
        width: SIZE,
        height: SIZE,
        transition: dragging
          ? "none"
          : snapping
          ? "left 0.55s cubic-bezier(0.2, 0.8, 0.2, 1), top 0.55s cubic-bezier(0.2, 0.8, 0.2, 1)"
          : returningHome
          ? "left 1.2s cubic-bezier(0.25, 1, 0.5, 1), top 1.2s cubic-bezier(0.25, 1, 0.5, 1)"
          : "none",
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
        aria-label="Abrir el chat con Floppy"
        title="Toca para chatear con Floppy · arrástrame para moverme"
        className={`floppy-mascot ${boing ? "is-boing" : ""}`}
      >
        <span className="floppy-body">
          <img
            src={mascot.url}
            alt="Floppy"
            draggable={false}
            className={`floppy-img ${blink ? "is-blink" : ""}`}
          />
        </span>
      </button>
    </aside>
  );
}
