import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: async () => {
    const { data, error } = await supabase.from("services").select("*").order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const plansQuery = queryOptions({
  queryKey: ["plans"],
  queryFn: async () => {
    const { data, error } = await supabase.from("plans").select("*").order("sort_order");
    if (error) throw error;
    return data.map((p) => ({ ...p, features: (p.features as string[]) ?? [] }));
  },
});

export type Service = Awaited<ReturnType<typeof servicesQuery.queryFn & {}>>[number];
export type Plan = Awaited<ReturnType<typeof plansQuery.queryFn & {}>>[number];
