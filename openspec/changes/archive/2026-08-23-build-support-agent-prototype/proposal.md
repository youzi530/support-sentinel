## Why

Support teams need a small, reviewable prototype that demonstrates the essential agent loop: answer grounded in approved knowledge, execute a constrained customer action, and hand off risky or unresolved conversations to a human.

## What Changes

- Add a browser-based customer-support chat experience with three visible outcomes: knowledge answer, guarded order cancellation, and escalation.
- Add a deterministic agent orchestration layer that can later be replaced by an LLM provider without changing the customer-action boundary.
- Add automated behavior tests and reviewer documentation, including a short demo script.

## Capabilities

### New Capabilities

- `customer-support-agent`: Grounded answers, confirmation-gated cancellation, and safe escalation behavior for a support conversation.

### Modified Capabilities

- None.

## Impact

Adds a small Node.js server, browser client, domain modules, test suite, demo fixtures, and project README. No external APIs, accounts, or production customer data are required.
