/**
 * Minimal Stripe REST helpers (no SDK, edge-compatible).
 * Requires env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET.
 */
import { createHmac, timingSafeEqual } from "crypto";

export function stripeKey() {
  return process.env["STRIPE_SECRET_KEY"];
}

function encode(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v === undefined || v === null) return [];
    if (typeof v === "object") return encode(v as Record<string, unknown>, key);
    return [`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`];
  });
}

export async function stripeRequest<T>(path: string, params: Record<string, unknown> = {}, method = "POST"): Promise<T> {
  const key = stripeKey();
  if (!key) throw new Error("Los pagos aún no están configurados.");
  const body = encode(params).join("&");
  const res = await fetch(`https://api.stripe.com/v1/${path}${method === "GET" && body ? `?${body}` : ""}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: method === "GET" ? null : body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message ?? "Error de Stripe");
  return json as T;
}

/** Verifies the Stripe-Signature header (t=...,v1=...). */
export function verifyStripeSignature(payload: string, header: string | null, secret: string, toleranceSec = 300) {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const t = parts["t"];
  const sigs = header.split(",").filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
  if (!t || sigs.length === 0) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > toleranceSec) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  return sigs.some((s) => s.length === expected.length && timingSafeEqual(Buffer.from(s), Buffer.from(expected)));
}
