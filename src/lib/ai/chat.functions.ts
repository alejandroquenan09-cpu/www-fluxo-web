import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getProvider } from "./providers.server";

const Input = z.object({
  conversationId: z.string().uuid().nullable(),
  message: z.string().trim().min(1).max(4000),
});

export const sendChatMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Enforce plan daily limit server-side (never trust the client).
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan_id, plans(ai_daily_limit)")
      .eq("user_id", userId)
      .maybeSingle();
    const limit = (sub?.plans as { ai_daily_limit: number } | null)?.ai_daily_limit ?? 20;
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { count } = await supabase
      .from("ai_usage")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", since);
    if ((count ?? 0) >= limit) {
      throw new Error("Alcanzaste el límite diario de tu plan. Mejora a Premium para continuar.");
    }

    let conversationId = data.conversationId;
    if (!conversationId) {
      const { data: conv, error } = await supabase
        .from("conversations")
        .insert({ user_id: userId, title: data.message.slice(0, 60) })
        .select("id")
        .single();
      if (error) throw new Error("No se pudo crear la conversación.");
      conversationId = conv.id;
    }

    const { data: history } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(30);

    await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, user_id: userId, role: "user", content: data.message });

    const provider = getProvider();
    const reply = await provider.complete([
      ...((history ?? []) as { role: "user" | "assistant"; content: string }[]),
      { role: "user", content: data.message },
    ]);

    await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, user_id: userId, role: "assistant", content: reply });
    await supabase.from("ai_usage").insert({ user_id: userId, provider: provider.name, model: provider.model });
    await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);

    return { conversationId, reply, mock: provider.name === "mock" };
  });
