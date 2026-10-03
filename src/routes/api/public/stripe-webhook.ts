import { createFileRoute } from "@tanstack/react-router";
import { verifyStripeSignature } from "@/lib/billing/stripe.server";

type StripeSub = {
  id: string;
  customer: string;
  status: string;
  cancel_at_period_end: boolean;
  current_period_end?: number;
  items?: { data?: { current_period_end?: number }[] };
  metadata?: { user_id?: string; plan_id?: string };
};

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["STRIPE_WEBHOOK_SECRET"];
        if (!secret) return new Response("Webhook not configured", { status: 503 });
        const body = await request.text();
        if (!verifyStripeSignature(body, request.headers.get("stripe-signature"), secret)) {
          return new Response("Invalid signature", { status: 401 });
        }
        const event = JSON.parse(body) as { type: string; data: { object: Record<string, unknown> } };
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        if (event.type.startsWith("customer.subscription.")) {
          const s = event.data.object as unknown as StripeSub;
          const userId = s.metadata?.user_id;
          if (userId) {
            const active = ["active", "trialing", "past_due"].includes(s.status) && event.type !== "customer.subscription.deleted";
            const end = s.current_period_end ?? s.items?.data?.[0]?.current_period_end;
            await supabaseAdmin.from("subscriptions").upsert({
              user_id: userId,
              plan_id: active ? s.metadata?.plan_id || "premium" : "free",
              status: active ? s.status : "canceled",
              stripe_customer_id: s.customer,
              stripe_subscription_id: s.id,
              current_period_end: end ? new Date(end * 1000).toISOString() : null,
              cancel_at_period_end: s.cancel_at_period_end,
              updated_at: new Date().toISOString(),
            });
          }
        }
        return new Response("ok");
      },
    },
  },
});
