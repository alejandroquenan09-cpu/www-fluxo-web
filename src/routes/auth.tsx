import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/fluxo/Logo";
import { cn } from "@/lib/utils";

const search = z.object({ mode: z.enum(["login", "signup", "forgot"]).optional().catch("login") });

export const Route = createFileRoute("/auth")({
  validateSearch: search,
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Accede a Fluxo" },
      { name: "description", content: "Inicia sesión o crea tu cuenta en Fluxo." },
      { property: "og:title", content: "Accede a Fluxo" },
      { property: "og:description", content: "Inicia sesión o crea tu cuenta en Fluxo." },
    ],
  }),
  component: AuthPage,
});

const inputCls =
  "w-full rounded-2xl glass px-4 py-3.5 text-base outline-none transition placeholder:text-muted-foreground focus:ring-1 focus:ring-ring sm:text-sm";

function AuthPage() {
  const { mode = "login" } = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  const setMode = (m: "login" | "signup" | "forgot") => navigate({ to: "/auth", search: { mode: m }, replace: true });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        if (password.length < 8) throw new Error("La contraseña debe tener al menos 8 caracteres.");
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { full_name: name } },
        });
        if (error) throw error;
        if (!data.session) toast.success("Revisa tu correo para confirmar tu cuenta.");
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error("Correo o contraseña incorrectos.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Te enviamos un enlace para restablecer tu contraseña.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Algo salió mal");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (result.error) toast.error("No se pudo iniciar sesión con Google");
  };

  const title = mode === "signup" ? "Crea tu cuenta" : mode === "forgot" ? "Recupera tu acceso" : "Bienvenido de nuevo";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Logo className="mb-8" />
      <div className="glass-strong sheen page-enter w-full max-w-md rounded-[2rem] p-6 sm:p-9">
        <h1 className="text-center text-2xl font-semibold sm:text-3xl">{title}</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {mode === "forgot" ? "Te enviaremos un enlace a tu correo." : "Entra al flujo en segundos."}
        </p>

        {mode !== "forgot" && (
          <div className="mt-6 grid grid-cols-2 rounded-full glass p-1 text-sm">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-full py-2 transition",
                  mode === m ? "bg-glass-strong text-foreground shadow-glass" : "text-muted-foreground",
                )}
              >
                {m === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-3">
          {mode === "signup" && (
            <input className={inputCls} placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="name" />
          )}
          <input className={inputCls} type="email" required placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          {mode !== "forgot" && (
            <input
              className={inputCls}
              type="password"
              required
              minLength={mode === "signup" ? 8 : undefined}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          )}
          {mode === "login" && (
            <button type="button" onClick={() => setMode("forgot")} className="block text-xs text-muted-foreground hover:text-primary">
              ¿Olvidaste tu contraseña?
            </button>
          )}
          <Button type="submit" variant="flow" size="xl" className="w-full" disabled={busy}>
            {busy ? "Un momento…" : mode === "signup" ? "Crear cuenta" : mode === "forgot" ? "Enviar enlace" : "Entrar"}
          </Button>
        </form>

        {mode !== "forgot" ? (
          <>
            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> o <span className="h-px flex-1 bg-border" />
            </div>
            <Button variant="glass" size="xl" className="w-full" onClick={google}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                <path fill="currentColor" d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 6.26 12 6.26c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.7 3.72 14.56 2.8 12 2.8 6.92 2.8 2.8 6.92 2.8 12s4.12 9.2 9.2 9.2c5.31 0 8.83-3.73 8.83-8.99 0-.6-.07-1.06-.15-1.51z" />
              </svg>
              Continuar con Google
            </Button>
          </>
        ) : (
          <button onClick={() => setMode("login")} className="mt-6 block w-full text-center text-sm text-muted-foreground hover:text-primary">
            Volver a iniciar sesión
          </button>
        )}
      </div>
      <Link to="/" className="mt-6 text-sm text-muted-foreground hover:text-foreground">← Volver a Fluxo</Link>
    </div>
  );
}
