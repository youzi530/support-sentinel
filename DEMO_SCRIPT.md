# 90-Second Product Demo Script

Use this script to record a 1–3 minute walkthrough for the Customer Agent Engineer take-home. Keep the browser on `http://localhost:3000`, hide any API key, and select a DeepSeek model before starting.

## Before recording

1. Restart the server to reset the demo order state.
2. Open the browser at `http://localhost:3000`.
3. Select a DeepSeek model and enter a newly generated API key in the masked field. Do not show the key in the recording.
4. Start with an empty conversation.

## Narration and actions

### 0:00–0:12 — Set the context

**Say:** “This is Support Sentinel, a small AI customer-support agent prototype. It combines model-powered conversation with server-owned policy, tools, and safety controls.”

**Show:** The model mode panel and the empty chat. Keep the API key obscured.

### 0:12–0:28 — Show natural model conversation

**Type:** `Explain binary search in one sentence.`

**Say:** “For ordinary non-support conversation, a configured DeepSeek model can answer naturally. The UI labels this separately as a general model response, so it is never confused with a company policy answer.”

**Show:** `GENERAL MODEL RESPONSE` and its mode receipt.

### 0:28–0:45 — Show grounded knowledge

**Type:** `How long does standard shipping take?`

**Say:** “When the question is about support policy, the system searches approved knowledge first. The final response includes the source and evidence instead of relying on an ungrounded model claim.”

**Show:** `GROUNDED KNOWLEDGE`, the Shipping policy source, and evidence.

### 0:45–1:08 — Show a safe customer action

**Type:** `Please cancel order ORD-1001`

**Say:** “The only customer action in this demo is an allowlisted cancellation. A processing order never changes state on the first request; the agent asks for an explicit confirmation.”

**Type:** `Yes, cancel it`

**Say:** “Only after confirmation does the local order tool execute, and the agent returns an action receipt.”

**Show:** `CONFIRMATION REQUIRED`, then `ACTION COMPLETE` and the receipt.

### 1:08–1:25 — Show escalation and observability

**Type:** `There is an unrecognized charge on my card.`

**Say:** “High-risk cases do not go to a general model response or payment action. They are escalated immediately with a queue, reason, and concise handoff summary. The compact trace shows the server’s observable tool decision, not hidden model reasoning.”

**Show:** `HUMAN HANDOFF`, `fraud-review`, and the trace.

### 1:25–1:35 — Close

**Say:** “The main trade-off is intentional: the model is useful for conversation and grounded synthesis, while policy evidence, tool validation, order state, confirmation, and escalations remain controlled by the server.”

## Optional final frame

Run `npm test` (or the project’s Node test command) and show the passing suite for 3–5 seconds. Do not expose shell history, API keys, or environment variables.
