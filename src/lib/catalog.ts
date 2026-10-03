import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

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
    return data.map((p) => ({ ...p, features: (p.features as string[]) ?? [] })) as Plan[];
  },
});

export type Service = Tables<"services">;
export type Plan = Omit<Tables<"plans">, "features"> & { features: string[] };
