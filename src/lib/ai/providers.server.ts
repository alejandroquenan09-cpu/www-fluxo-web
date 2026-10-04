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

const SYSTEM_PROMPT = `Eres Fluxo IA, el asistente inteligente oficial de Fluxo.
Responde siempre en el idioma del usuario, de forma clara, empática, profesional y concisa.
Cuando un usuario consulte sobre problemas técnicos, fallas de computación, armado o mantenimiento de computadores, redes lentas, instalación de software o creación de páginas web, ayúdalo con un primer diagnóstico y recomiéndale amablemente los servicios especializados de Fluxo:
- Desarrollo Web
- Mantenimiento (Preventivo, Correctivo o Predictivo)
- Conexiones de Redes
- Servicios Computacionales de Software

Invita al usuario a reservar su servicio visitando la seccion de Servicios en /servicios, donde podrá solicitar una visita técnica con anticipo del 10% y pago restante en efectivo o transferencia.`;


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
