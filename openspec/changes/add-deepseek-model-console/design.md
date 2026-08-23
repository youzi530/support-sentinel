## Context

The existing browser demo uses deterministic retrieval and safety checks. See `proposal.md` for the motivation and the active customer-support-agent specification for established tool boundaries.

## Goals / Non-Goals

**Goals:** enable a real DeepSeek-generated response from a user-provided key, preserve evidence citations and actions as server policy, and never persist the key.

**Non-Goals:** storing credentials, accepting customer PII for provider calls, browser-side direct API calls, or local DeepSeek inference deployment.

## Decisions

- Send the key from page memory only with the current chat request, then use it transiently on the server. This avoids key persistence while keeping provider traffic off the browser.
- Call DeepSeek's OpenAI-compatible chat-completions API and require structured JSON. The server supplies only the matched approved article and validates the returned text before rendering it.
- Do not use model tool calls for cancellation. The local order tool remains the only execution path and requires an existing confirmation state.
- On provider error, return an explicit non-sensitive error and let the UI offer deterministic mode; do not silently claim a generated answer.

## Risks / Trade-offs

- [Browser-submitted secret] → Never persist or log the key, use a password input, and clear it on refresh.
- [Provider hallucination] → Constrain the prompt to approved evidence, validate source fields locally, and escalate gaps.
- [Third-party data exposure] → Send only the user message and selected policy evidence; document that production use needs PII controls.
