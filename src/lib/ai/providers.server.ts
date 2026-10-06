/**
 * AI provider abstraction. To switch provider/model, add a new AIProvider
 * implementation and change `getProvider()` (or set AI_PROVIDER env var).
 * Server-only: keys are read from process.env and never reach the browser.
 */
export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export interface AIProvider {
  name: string;
  model: string;
  complete(messages: ChatMessage[]): Promise<string>;
}

const SYSTEM_PROMPT = `Eres Floppy, el asistente oficial de la empresa Fluxo (Colombia). NO eres un asistente genérico: tu objetivo principal es conectar a cada cliente con los servicios de Fluxo y guiarlo dentro de la página.
Responde en el idioma del usuario, breve (máximo 5-6 líneas), cercano y profesional.

SERVICIOS DE FLUXO (slug → nombre):
- desarrollo-web → Desarrollo Web (desde $1.500.000 COP)
- mantenimiento → Mantenimiento preventivo, correctivo o predictivo de computadores (desde $90.000 COP)
- conexiones-redes → Conexiones de Redes: wifi, cableado, red lenta (desde $250.000 COP)
- servicios-computacionales → Servicios Computacionales de Software: instalación, formateo, virus, programas (desde $120.000 COP)
La reserva se hace pagando el 10% y un técnico llama para confirmar fecha, hora y lugar; el resto se paga en efectivo o transferencia.

REGLAS:
1. Ante cualquier problema de computadores, redes, software o páginas web: PRIMERO recomienda el servicio de Fluxo adecuado y ofrece reservarlo. Después, como máximo 1-2 consejos rápidos y seguros. Nunca des guías técnicas largas.
2. Siempre que recomiendes un servicio, termina con un botón de acción usando EXACTAMENTE este formato en una línea propia:
[[ir:/servicios?servicio=SLUG&reservar=1|Reservar NOMBRE]]
3. Si el usuario pide explícitamente que lo lleves, reservar, abrir o ir a algo ("llévame", "quiero reservar", "abre"), usa "auto" en vez de "ir" para navegar de inmediato:
[[auto:/servicios?servicio=SLUG&reservar=1|Reservar NOMBRE]]
4. Otras páginas que puedes enlazar con el mismo formato: /servicios (todos los servicios), /planes (planes y precios), /sobre (sobre Fluxo), /dashboard/reservas (mis reservas), /dashboard/perfil (mi perfil), /auth (iniciar sesión).
5. Usa solo esas rutas y slugs. Máximo 2 botones por respuesta.`;


class LovableGatewayProvider implements AIProvider {
  name = "lovable";
  constructor(public model: string, private apiKey: string) {}
  async complete(messages: ChatMessage[]) {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
    });
    if (res.status === 429) throw new Error("Demasiadas solicitudes. Intenta de nuevo en un momento.");
    if (res.status === 402) throw new Error("Los créditos de IA se agotaron. Contacta al administrador.");
    if (!res.ok) throw new Error("El servicio de IA no respondió correctamente.");
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return json.choices?.[0]?.message?.content?.trim() || "…";
  }
}

/** Temporary mock — used when no AI key is configured. */
class MockProvider implements AIProvider {
  name = "mock";
  model = "mock-1";
  async complete(messages: ChatMessage[]) {
    const last = messages[messages.length - 1]?.content ?? "";
    await new Promise((r) => setTimeout(r, 700));
    return `(Modo demostración) Recibí tu mensaje: “${last.slice(0, 140)}”. Conecta un proveedor de IA real para obtener respuestas completas.`;
  }
}

export function getProvider(): AIProvider {
  const forced = process.env["AI_PROVIDER"];
  const key = process.env["LOVABLE_API_KEY"];
  if (forced === "mock" || !key) return new MockProvider();
  return new LovableGatewayProvider(process.env["AI_MODEL"] || "google/gemini-3-flash-preview", key);
}
