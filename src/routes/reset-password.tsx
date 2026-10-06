import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/fluxo/Logo";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Nueva contraseña — Fluxo" },
      { name: "description", content: "Define una nueva contraseña para tu cuenta de Fluxo." },
      { property: "og:title", content: "Nueva contraseña — Fluxo" },
      { property: "og:description", content: "Define una nueva contraseña para tu cuenta de Fluxo." },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Mínimo 8 caracteres."); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { toast.error("El enlace expiró o no es válido. Solicita uno nuevo."); return; }
    toast.success("Contraseña actualizada");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Logo className="mb-8" />
      <form onSubmit={submit} className="glass-strong sheen w-full max-w-md space-y-4 rounded-[2rem] p-6 sm:p-9">
        <h1 className="text-center text-2xl font-semibold">Nueva contraseña</h1>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nueva contraseña"
          autoComplete="new-password"
          className="w-full rounded-2xl glass px-4 py-3.5 text-base outline-none focus:ring-1 focus:ring-ring sm:text-sm"
        />
        <Button type="submit" variant="flow" size="xl" className="w-full" disabled={busy}>
          {busy ? "Guardando…" : "Guardar contraseña"}
        </Button>
      </form>
    </div>
  );
}
