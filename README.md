# Support Sentinel

A small AI customer-support agent prototype built for a Customer Agent Engineer take-home. It makes three support outcomes easy to inspect:

1. **Knowledge answer** — responses are grounded in an approved, local policy article and show the source.
2. **Safe customer action** — the only allowlisted action is cancelling demo order `ORD-1001`, and it requires an explicit confirmation before state changes.
3. **Human escalation** — suspected fraud, high-frustration language, and unknown questions are handed off with a concise reason and summary.

## Run it

This project has no package installation step; it uses Node.js built-ins.

```bash
node --version # Node 20+ recommended
npm test
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Suggested 3–5 minute demo

1. Ask **“How long does standard shipping take?”**. Point out the policy answer and source citation.
2. Ask **“Please cancel order ORD-1001”**. Show that the agent requests confirmation rather than acting immediately.
3. Reply **“Yes, cancel it”**. Show the action receipt.
4. Click **“Report fraud”**. Point out the `suspected_fraud` human handoff and that no payment action is offered.
5. Briefly tour `src/agent.js` and the test suite to show the policy/action boundary and TDD coverage.

## Structure

```text
src/
  agent.js           # intent orchestration and safe routing
  knowledge-base.js  # approved answer corpus
  order-tool.js      # narrow, allowlisted customer action
  server.js          # minimal HTTP API and static server
public/              # browser demo
test/                # Node built-in test runner tests
openspec/            # change proposal, spec, design, and tracked tasks
```

## Design choices and trade-offs

- **Deterministic before generative.** The demo uses a small deterministic router instead of a hosted LLM, so it is reproducible, runs without an API key, and cannot invent a policy. The `createSupportAgent` boundary is intentionally small enough to swap with retrieval + model orchestration.
- **Actions are isolated and confirmation-gated.** `order-tool.js` only supports cancellation for a processing demo order. In production this boundary would add authenticated identity, explicit authorization, idempotency, audit logs, and a real order-service adapter.
- **Escalation is a first-class result.** The UI displays the handoff reason and a summary a human can pick up; production would create a ticket and attach relevant conversation context.
- **In-memory state is demo-only.** Restarting the server resets fixture data.

## Development process

The repository uses OpenSpec for the product contract in [`openspec/changes/build-support-agent-prototype`](openspec/changes/build-support-agent-prototype). The initial domain tests were committed before the implementation, then the core and UI followed in focused commits.

## Verification

```bash
npm test
# validates the OpenSpec change when OpenSpec CLI is available
openspec validate build-support-agent-prototype --strict
```
