# Support Sentinel

A production-minded AI customer-support agent prototype built for a Customer Agent Engineer take-home. It makes three support outcomes easy to inspect:

1. **Knowledge answer** — responses are grounded in an approved policy article and show both a source and supporting evidence.
2. **Safe customer action** — the only allowlisted action is cancelling demo order `ORD-1001`, and it requires an explicit confirmation before state changes.
3. **Human escalation** — suspected fraud, high-frustration language, and unknown questions are handed off with a concise reason, queue, and summary.

## Run it

This project has no package installation step; it uses Node.js built-ins.

```bash
node --version # Node 20+ recommended
npm test
npm start
```

Open [http://localhost:3000](http://localhost:3000).

### Optional provider-assisted routing

The demo works entirely without a key. To enable the optional server-side OpenAI Responses API intent-classification adapter, copy the safe template and set a key only in your shell or local `.env` loader:

```bash
cp .env.example .env
export OPENAI_API_KEY="your-key"
export OPENAI_MODEL="gpt-5.6" # optional override
npm start
```

The model can advise intent classification, but it never receives authority to execute an action: evidence retrieval, confirmation checks, and order-tool access remain local server policy. The adapter uses `store: false`; review your organization’s API data controls before using any production customer data. See the official [Responses API quickstart](https://platform.openai.com/docs/quickstart/make-your-first-api-request).

### DeepSeek in the browser demo

Choose a DeepSeek model in the page’s **Model mode** panel and paste your API key into the masked field. The key exists only in that page’s memory, is sent transiently with each request, and is cleared on refresh or with **Clear**. It is never written to `.env`, local storage, logs, or Git.

The server calls `https://api.deepseek.com/chat/completions` only for a grounded knowledge response, passing the user message and selected approved evidence. Orders and escalation safety remain server-controlled. Invalid keys show a generic connection error without echoing the key. See the [DeepSeek API guide](https://api-docs.deepseek.com/guides/function_calling).

## Suggested 3–5 minute demo

1. Ask **“How long does standard shipping take?”**. Point out the policy answer, source, and visible evidence.
2. Ask **“Please cancel order ORD-1001”**. Show that the agent requests confirmation rather than acting immediately.
3. Reply **“Yes, cancel it”**. Show the action receipt.
4. Try **“Please cancel order ORD-2002”**. Show the explicit shipped-order result and `order-support` handoff rather than a misleading fallback.
5. Click **“Report fraud”**. Point out the `suspected_fraud` handoff to `fraud-review` and that no payment action is offered.
6. Briefly tour `src/agent.js`, `src/intent-adapter.js`, and the test suite to show the LLM advisory boundary, server-owned tools, and TDD coverage.

### Recording runbook

Record the six steps above in one browser session (about 3 minutes). Reset the in-memory demo state by restarting the server before recording. Keep any API key and terminal output out of frame. End on the test command passing so reviewers can connect each visible safety behavior to an automated check.

## Structure

```text
src/
  agent.js           # intent orchestration and safe routing
  intent-adapter.js  # optional OpenAI Responses API classification boundary
  knowledge-base.js  # approved answer corpus
  order-tool.js      # narrow, allowlisted customer action
  server.js          # minimal HTTP API and static server
public/              # browser demo
test/                # Node built-in test runner tests
openspec/            # change proposal, spec, design, and tracked tasks
```

## Design choices and trade-offs

- **Provider-assisted, policy-enforced.** A configured model can classify intent, but retrieval, confirmation, and tool authorization remain deterministic. This keeps local demos reproducible and prevents an LLM from inventing policy or executing customer actions.
- **Actions are isolated and confirmation-gated.** `order-tool.js` only supports cancellation for a processing demo order. In production this boundary would add authenticated identity, explicit authorization, idempotency, audit logs, and a real order-service adapter.
- **Escalation is a first-class result.** The UI displays the handoff reason and a summary a human can pick up; production would create a ticket and attach relevant conversation context.
- **In-memory state is demo-only.** Restarting the server resets fixture data.

## Development process

The repository uses OpenSpec for the baseline and the active [`agentic upgrade`](openspec/changes/upgrade-agentic-support-prototype). Domain tests were committed before implementation, then the core and UI followed in focused commits.

## Verification

```bash
npm test
# validates the OpenSpec change when OpenSpec CLI is available
openspec validate upgrade-agentic-support-prototype --strict
```
