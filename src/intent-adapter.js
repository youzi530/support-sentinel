const supportedIntents = new Set(["knowledge", "cancel_order", "escalation"]);

export function createIntentAdapter({
  apiKey = process.env.OPENAI_API_KEY,
  model = process.env.OPENAI_MODEL || "gpt-5.6",
  fetchFn = globalThis.fetch
} = {}) {
  const isEnabled = Boolean(apiKey && fetchFn);

  return {
    isEnabled,
    async classify(message) {
      if (!isEnabled) return null;

      const response = await fetchFn("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          store: false,
          input: `Classify this customer-support message as one of: knowledge, cancel_order, escalation. Return only JSON: {"intent":"..."}.\nMessage: ${message}`
        })
      });
      if (!response.ok) return null;

      const payload = await response.json();
      try {
        const parsed = JSON.parse(payload.output_text);
        return supportedIntents.has(parsed.intent) ? parsed.intent : null;
      } catch {
        return null;
      }
    }
  };
}
