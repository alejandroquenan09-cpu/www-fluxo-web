import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUp, MessageSquare, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { sendChatMessage } from "@/lib/ai/chat.functions";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type Msg = { id: string; role: "user" | "assistant"; content: string };

export function ChatPanel({ compact = false }: { compact?: boolean }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const send = useServerFn(sendChatMessage);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [mock, setMock] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const conversations = useQuery({
    queryKey: ["conversations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("conversations")
        .select("id,title,updated_at")
        .order("updated_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const openConversation = async (id: string) => {
    setConversationId(id);
    const { data } = await supabase
      .from("messages")
      .select("id,role,content")
      .eq("conversation_id", id)
      .order("created_at");
    setMessages((data ?? []) as Msg[]);
  };

  const newConversation = () => {
    setConversationId(null);
    setMessages([]);
    setInput("");
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || typing) return;
    setInput("");
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: text }]);
    setTyping(true);
    try {
      const res = await send({ data: { conversationId, message: text } });
      setConversationId(res.conversationId);
      setMock(res.mock);
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: res.reply }]);
      qc.invalidateQueries({ queryKey: ["conversations"] });
      qc.invalidateQueries({ queryKey: ["usage"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo enviar el mensaje");
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className={cn("glass sheen grid overflow-hidden rounded-3xl", !compact && "lg:grid-cols-[240px_1fr]")}>
      {!compact && (
        <aside className="hidden border-r border-border p-3 lg:block">
          <button
            onClick={newConversation}
            className="flex w-full items-center gap-2 rounded-2xl bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary ring-1 ring-primary/25 transition hover:bg-primary/15"
          >
            <Plus className="h-4 w-4" /> Nueva conversación
          </button>
          <p className="mt-5 px-2 text-[11px] uppercase tracking-widest text-muted-foreground">Historial</p>
          <ul className="mt-2 space-y-0.5">
            {(conversations.data ?? []).map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => openConversation(c.id)}
                  className={cn(
                    "flex w-full items-center gap-2 truncate rounded-xl px-3 py-2 text-left text-sm text-muted-foreground transition hover:bg-glass hover:text-foreground",
                    conversationId === c.id && "bg-glass-strong text-foreground",
                  )}
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{c.title}</span>
                </button>
              </li>
            ))}
            {conversations.data?.length === 0 && <li className="px-3 py-2 text-xs text-muted-foreground">Aún no hay conversaciones.</li>}
          </ul>
        </aside>
      )}

      <section className="flex h-[min(70vh,640px)] min-h-[460px] flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-flow text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">Fluxo IA</p>
              <p className="text-xs text-muted-foreground">{mock ? "Modo demostración" : "En línea"}</p>
            </div>
          </div>
          <button
            onClick={newConversation}
            className={cn("rounded-full glass px-3 py-1.5 text-xs transition hover:bg-glass-strong", !compact && "lg:hidden")}
          >
            <Plus className="mr-1 inline h-3.5 w-3.5" />
            Nueva
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
          {messages.length === 0 && !typing && (
            <div className="grid h-full place-items-center text-center">
              <div className="animate-fade-in">
                <p className="font-display text-2xl">¿En qué fluimos hoy?</p>
                <p className="mt-2 text-sm text-muted-foreground">Escribe una pregunta o una idea para empezar.</p>
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={cn("flex animate-fade-in", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%]",
                  m.role === "user" ? "rounded-br-lg bg-flow text-primary-foreground" : "rounded-bl-lg glass-strong",
                )}
              >
                {m.content}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex animate-fade-in justify-start" aria-label="Fluxo IA está escribiendo">
              <div className="glass-strong flex gap-1.5 rounded-3xl rounded-bl-lg px-4 py-4">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="animate-typing h-1.5 w-1.5 rounded-full bg-primary" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form onSubmit={submit} className="border-t border-border p-3 sm:p-4">
          <div className="flex items-end gap-2 rounded-3xl glass px-3 py-2 focus-within:ring-1 focus-within:ring-ring">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={1}
              maxLength={4000}
              placeholder="Escribe tu mensaje…"
              className="max-h-36 flex-1 resize-none bg-transparent py-2 text-base outline-none placeholder:text-muted-foreground sm:text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              aria-label="Enviar"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-flow text-primary-foreground transition hover:scale-105 active:scale-95 disabled:opacity-40"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
