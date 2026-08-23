## Context

The prototype currently uses deterministic safety routing and DeepSeek only for grounded answer phrasing. This change adds agent behavior without transferring authority to the model.

## Goals / Non-Goals

**Goals:** structured planning, server-validated tool execution, final synthesis from tool results, and a UI-visible trace.

**Non-Goals:** autonomous refunds, authentication, persistent conversation memory, unrestricted tool access, or exposing hidden reasoning.

## Decisions

- Use structured JSON plans rather than free-form instructions.
- Treat every model tool call as an untrusted proposal; a registry validator owns authorization.
- Use a two-pass model flow: plan, execute validated tools, then synthesize from sanitized results.
- Expose an operational trace, never chain-of-thought.

## Risks / Trade-offs

- [Malformed plans] → reject and fall back to deterministic routing.
- [Unsafe parameters] → schema validation and per-tool policies.
- [Extra latency] → limit to two model calls and provide deterministic fallback.
