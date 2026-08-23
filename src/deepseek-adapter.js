export function createDeepSeekAdapter({ apiKey, model = "deepseek-v4-flash", fetchFn = globalThis.fetch } = {}) {
  async function complete(messages, options = {}) {
    const response = await fetchFn("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, temperature: 0.2, max_tokens: 180, ...options, messages })
    });
    if (!response.ok) throw new Error("DeepSeek request failed");
    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("DeepSeek returned no answer");
    return content;
  }

  return {
    isEnabled: Boolean(apiKey && fetchFn),
    async plan({ message, pendingAction = null }) {
      if (!apiKey || !fetchFn) return null;
      const content = await complete([
        {
          role: "system",
          content: "You plan one customer-support tool call. Return JSON only: {\"name\": string, \"arguments\": object}. Allowed names: search_knowledge, get_order, request_cancellation, cancel_order, create_handoff. Never select cancel_order unless the customer has already confirmed a pending cancellation. Use create_handoff for fraud, high-risk, or unknown requests."
        },
        {
          role: "user",
          content: `Customer message: ${message}\nPending action: ${pendingAction ? JSON.stringify(pendingAction) : "none"}`
        }
      ], { response_format: { type: "json_object" }, max_tokens: 100 });
      try {
        const proposal = JSON.parse(content);
        return typeof proposal?.name === "string" ? proposal : null;
      } catch {
        return null;
      }
    },
    async answer({ message, evidence }) {
      if (!apiKey || !fetchFn) return null;
      return complete([
          { role: "system", content: "You are a customer-support agent. Answer only from the approved evidence. Do not mention policies not present in it. Keep the answer concise." },
          { role: "user", content: `Customer message: ${message}\n\nApproved evidence: ${evidence}` }
      ]);
    },
    async generalChat({ message }) {
      if (!apiKey || !fetchFn) return null;
      return complete([
        {
          role: "system",
          content: "You are Support Sentinel, a customer-support demo agent. Answer this low-risk conversational message concisely and warmly. You may describe your role and capabilities, but do not invent company policies, access customer data, perform actions, or make operational promises. For support questions, invite the customer to ask about an approved policy or order."
        },
        { role: "user", content: message }
      ]);
    }
  };
}
