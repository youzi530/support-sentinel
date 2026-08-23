## Context

This is a deliberately compact take-home prototype. It must make safety behavior inspectable without relying on an API key or opaque model output.

## Goals / Non-Goals

**Goals:** grounded answers with source attribution, a single allowlisted customer action with confirmation, clear escalation, and an easy local demo.

**Non-Goals:** authentication, persistence, real order-provider integration, streaming, or replacing a production support platform.

## Decisions

- Use a deterministic intent router with a small approved knowledge base. Its `supportAgent` boundary accepts a message and state so an LLM + retrieval adapter could replace the router later.
- Keep order cancellation inside a dedicated tool module and only invoke it when a stored pending action is confirmed.
- Persist demo conversation state in the browser session; serve a fixed order fixture on the server.
- Use Node's built-in test runner and HTTP server to keep installation friction low.

## Risks / Trade-offs

- Rule-based intent detection is intentionally less flexible than a hosted LLM, but makes the assessment reproducible and avoids invented policy answers.
- In-memory fixtures reset with the server; that is appropriate for the prototype but not production.
- A production version would add identity verification, idempotency keys, audit storage, policy moderation, and tool authorization.
