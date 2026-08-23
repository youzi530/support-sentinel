## Why

The current prototype demonstrates safety but does not let a reviewer experience a real model response. A local, ephemeral DeepSeek configuration panel makes the model-backed path inspectable without committing or persisting a customer-supplied API key.

## What Changes

- Add a DeepSeek model configuration panel to the chat UI with API-key and model inputs.
- Send configured DeepSeek requests through the server to generate grounded knowledge replies and human-handoff summaries.
- Preserve server-side retrieval, confirmation-gated cancellation, and typed action validation regardless of model output.
- Show current model mode and recover safely to deterministic behavior when configuration or provider requests fail.

## Capabilities

### New Capabilities

- `ephemeral-model-configuration`: Per-browser-session configuration of a DeepSeek API key and selected model without persistence.

### Modified Capabilities

- `customer-support-agent`: Model-backed grounded responses and escalation summaries that remain constrained by approved evidence and safe tools.

## Impact

Updates the browser UI, chat request schema, server orchestration, provider adapter, tests, and README. The project will call the DeepSeek API only when the user supplies a key in the active browser session.
