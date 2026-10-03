import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const accountQuery = (userId: string) =>
  queryOptions({
    queryKey: ["account", userId],
    queryFn: async () => {
      const [profile, sub] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase.from("subscriptions").select("*, plans(name, ai_daily_limit)").eq("user_id", userId).maybeSingle(),
      ]);
      return { profile: profile.data, subscription: sub.data };
    },
  });

export const usageQuery = (userId: string) =>
  queryOptions({
    queryKey: ["usage", userId],
    queryFn: async () => {
      const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
      const [day, total, convs] = await Promise.all([
        supabase.from("ai_usage").select("id", { count: "exact", head: true }).gte("created_at", since),
        supabase.from("ai_usage").select("id", { count: "exact", head: true }),
        supabase.from("conversations").select("id", { count: "exact", head: true }),
      ]);
      return { today: day.count ?? 0, total: total.count ?? 0, conversations: convs.count ?? 0 };
    },
  });
