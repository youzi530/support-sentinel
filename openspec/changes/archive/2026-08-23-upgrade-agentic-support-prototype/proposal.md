## Why

The prototype proves the basic safety loop, but its keyword router does not convincingly demonstrate an AI customer agent. This upgrade makes the agent's reasoning boundary, knowledge grounding, and customer-action lifecycle observable while keeping the take-home scope focused.

## What Changes

- Add a provider-optional LLM orchestration boundary with a deterministic fallback for local demos.
- Expand approved knowledge into multiple articles with scored retrieval, quoted evidence, and citation metadata.
- Make cancellation states explicit: request confirmation, execute only after confirmation, and clearly report orders that are shipped, already cancelled, or unknown.
- Improve escalation payloads into a reviewable human handoff summary and add a recorded-demo runbook.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `customer-support-agent`: Strengthen grounded-answer evidence, safe action outcomes, and structured human escalation behavior.

## Impact

Updates agent orchestration, the knowledge corpus, order-action responses, browser presentation, automated tests, environment configuration, and README/demo notes. The app remains runnable without an API key.
