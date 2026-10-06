import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { SiteLayout, SectionHeader } from "@/components/fluxo/SiteLayout";
import { ChatPanel } from "@/components/fluxo/ChatPanel";
import { Reveal } from "@/components/fluxo/Reveal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/ia")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Floppy — Inteligencia que fluye" },
      { name: "description", content: "Conversa con Floppy: un asistente privado, rápido y elegante." },
      { property: "og:title", content: "Floppy — Inteligencia que fluye" },
      { property: "og:description", content: "Conversa con Floppy: un asistente privado, rápido y elegante." },
    ],
  }),
  component: IAPage,
});

function IAPage() {
  const { user, loading } = useAuth();
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 pt-36 sm:px-6">
        <Reveal>
          <SectionHeader eyebrow="Inteligencia artificial" title="Floppy" subtitle="Pregunta lo que quieras. Tus conversaciones son solo tuyas." />
        </Reveal>
        <Reveal className="mt-12" delay={120}>
          {loading ? (
            <div className="glass h-[500px] animate-pulse rounded-3xl" />
          ) : user ? (
            <ChatPanel compact />
          ) : (
            <div className="glass-strong sheen grid place-items-center rounded-3xl px-6 py-20 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/30">
                <Lock className="h-5 w-5" />
              </span>
              <h3 className="mt-6 text-2xl font-semibold">Crea tu cuenta para conversar</h3>
              <p className="mt-2 max-w-sm text-muted-foreground">Es gratis. Guardamos tu historial de forma privada.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="flow" size="xl">
                  <Link to="/auth" search={{ mode: "signup" }}>Crear cuenta</Link>
                </Button>
                <Button asChild variant="glass" size="xl">
                  <Link to="/auth" search={{ mode: "login" }}>Iniciar sesión</Link>
                </Button>
              </div>
            </div>
          )}
        </Reveal>
      </section>
    </SiteLayout>
  );
}
