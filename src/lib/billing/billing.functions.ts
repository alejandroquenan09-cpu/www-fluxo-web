import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { stripeKey, stripeRequest } from "./stripe.server";

function origin() {
  return getRequestHeader("origin") || "http://localhost:8080";
}

export const getBillingStatus = createServerFn({ method: "GET" }).handler(async () => ({
  configured: Boolean(stripeKey()),
}));

export const createCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ planId: z.string().min(1).max(40) }).parse(d))
  .handler(async ({ data, context }) => {
    if (!stripeKey()) return { url: null, error: "Los pagos aún no están configurados." };
    const { supabase, userId, claims } = context;
    const { data: plan } = await supabase.from("plans").select("id, stripe_price_id").eq("id", data.planId).maybeSingle();
    if (!plan?.stripe_price_id) return { url: null, error: "Este plan aún no tiene precio configurado." };

    const { data: sub } = await supabase.from("subscriptions").select("stripe_customer_id").eq("user_id", userId).maybeSingle();
    const session = await stripeRequest<{ url: string }>("checkout/sessions", {
      mode: "subscription",
      line_items: { 0: { price: plan.stripe_price_id, quantity: 1 } },
      success_url: `${origin()}/dashboard/suscripcion?checkout=success`,
      cancel_url: `${origin()}/dashboard/suscripcion?checkout=cancel`,
      client_reference_id: userId,
      customer: sub?.stripe_customer_id ?? undefined,
      customer_email: sub?.stripe_customer_id ? undefined : (claims.email as string | undefined),
      metadata: { user_id: userId, plan_id: plan.id },
      subscription_data: { metadata: { user_id: userId, plan_id: plan.id } },
    });
    return { url: session.url, error: null };
  });

export const createPortal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (!stripeKey()) return { url: null, error: "Los pagos aún no están configurados." };
    const { data: sub } = await context.supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!sub?.stripe_customer_id) return { url: null, error: "Aún no tienes una suscripción de pago." };
    const portal = await stripeRequest<{ url: string }>("billing_portal/sessions", {
      customer: sub.stripe_customer_id,
      return_url: `${origin()}/dashboard/suscripcion`,
    });
    return { url: portal.url, error: null };
  });
