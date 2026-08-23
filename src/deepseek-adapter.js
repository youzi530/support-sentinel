export function createDeepSeekAdapter({ apiKey, model = "deepseek-v4-flash", fetchFn = globalThis.fetch } = {}) {
  return {
    isEnabled: Boolean(apiKey && fetchFn),
    async answer({ message, evidence }) {
      if (!apiKey || !fetchFn) return null;
      const response = await fetchFn("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, temperature: 0.2, max_tokens: 180, messages: [
          { role: "system", content: "You are a customer-support agent. Answer only from the approved evidence. Do not mention policies not present in it. Keep the answer concise." },
          { role: "user", content: `Customer message: ${message}\n\nApproved evidence: ${evidence}` }
        ] })
      });
      if (!response.ok) throw new Error("DeepSeek request failed");
      const payload = await response.json();
      const content = payload.choices?.[0]?.message?.content?.trim();
      if (!content) throw new Error("DeepSeek returned no answer");
      return content;
    }
  };
}
