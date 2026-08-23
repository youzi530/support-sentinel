import test from "node:test";
import assert from "node:assert/strict";
import { createSupportAgent } from "../src/agent.js";
import { createIntentAdapter } from "../src/intent-adapter.js";
import { createDeepSeekAdapter } from "../src/deepseek-adapter.js";
import { validateToolProposal } from "../src/tool-registry.js";

test("answers delivery questions from the approved shipping policy", async () => {
  const agent = createSupportAgent();

  const reply = await agent.respond({ message: "How long does standard shipping take?" });

  assert.equal(reply.kind, "knowledge");
  assert.match(reply.message, /3–5 business days/i);
  assert.equal(reply.source.title, "Shipping policy");
  assert.match(reply.evidence, /3–5 business days/i);
});

test("answers return questions with a separate approved source", async () => {
  const agent = createSupportAgent();

  const reply = await agent.respond({ message: "What is your return window?" });

  assert.equal(reply.kind, "knowledge");
  assert.equal(reply.source.title, "Returns policy");
  assert.match(reply.evidence, /30 days/i);
});

test("requires explicit confirmation before cancelling an order", async () => {
  const agent = createSupportAgent();

  const requested = await agent.respond({ message: "Please cancel order ORD-1001" });
  const orderBeforeConfirmation = agent.getOrder("ORD-1001");

  assert.equal(requested.kind, "confirmation_required");
  assert.equal(orderBeforeConfirmation.status, "processing");

  const completed = await agent.respond({ message: "Yes, cancel it", pendingAction: requested.pendingAction });
  assert.equal(completed.kind, "action_completed");
  assert.equal(completed.receipt.orderId, "ORD-1001");
  assert.equal(agent.getOrder("ORD-1001").status, "cancelled");
});

test("escalates suspected fraud without attempting a customer action", async () => {
  const agent = createSupportAgent();

  const reply = await agent.respond({ message: "There is an unrecognized charge on my card" });

  assert.equal(reply.kind, "escalation");
  assert.equal(reply.handoff.reason, "suspected_fraud");
  assert.equal(reply.handoff.queue, "fraud-review");
  assert.match(reply.handoff.summary, /unrecognized charge/i);
});

test("explains that shipped orders cannot be cancelled", async () => {
  const agent = createSupportAgent();

  const reply = await agent.respond({ message: "Please cancel order ORD-2002" });

  assert.equal(reply.kind, "action_unavailable");
  assert.match(reply.message, /already shipped/i);
  assert.equal(reply.handoff.queue, "order-support");
});

test("escalates unknown questions instead of fabricating a knowledge answer", async () => {
  const agent = createSupportAgent();

  const reply = await agent.respond({ message: "Can I change the engraving after purchase?" });

  assert.equal(reply.kind, "escalation");
  assert.equal(reply.handoff.reason, "knowledge_gap");
  assert.equal(reply.handoff.queue, "general-support");
});

test("keeps the optional provider adapter disabled without an API key", async () => {
  const adapter = createIntentAdapter({ apiKey: "" });

  const result = await adapter.classify("How long does shipping take?");

  assert.equal(adapter.isEnabled, false);
  assert.equal(result, null);
});

test("uses only approved evidence in a DeepSeek grounding prompt", async () => {
  let request;
  const adapter = createDeepSeekAdapter({ apiKey: "secret-key", fetchFn: async (_url, options) => {
    request = JSON.parse(options.body);
    return { ok: true, json: async () => ({ choices: [{ message: { content: "Shipping takes 3–5 business days." } }] }) };
  } });

  const reply = await adapter.answer({ message: "When will it arrive?", evidence: "Standard shipping arrives in 3–5 business days." });

  assert.equal(reply, "Shipping takes 3–5 business days.");
  assert.match(request.messages[0].content, /approved evidence/i);
  assert.match(request.messages[1].content, /3–5 business days/);
});

test("asks DeepSeek for a structured tool proposal", async () => {
  let request;
  const adapter = createDeepSeekAdapter({ apiKey: "secret-key", fetchFn: async (_url, options) => {
    request = JSON.parse(options.body);
    return { ok: true, json: async () => ({ choices: [{ message: { content: '{"name":"search_knowledge","arguments":{"query":"shipping"}}' } }] }) };
  } });

  const proposal = await adapter.plan({ message: "How long does shipping take?" });

  assert.deepEqual(proposal, { name: "search_knowledge", arguments: { query: "shipping" } });
  assert.deepEqual(request.response_format, { type: "json_object" });
  assert.match(request.messages[0].content, /cancel_order/i);
});

test("rejects a model cancellation proposal without customer confirmation", () => {
  const result = validateToolProposal({ name: "cancel_order", arguments: { orderId: "ORD-1001" } }, { pendingAction: null });

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "confirmation_required");
});

test("rejects malformed tool arguments before execution", () => {
  const result = validateToolProposal({ name: "request_cancellation", arguments: { orderId: "1001" } });

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "invalid_order_id");
});

test("answers a low-risk identity question with the configured model", async (t) => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async (_url, options) => {
    calls += 1;
    const request = JSON.parse(options.body);
    assert.match(request.messages[0].content, /Support Sentinel/i);
    return { ok: true, json: async () => ({ choices: [{ message: { content: "I’m Support Sentinel, a customer-support demo agent." } }] }) };
  };
  t.after(() => { globalThis.fetch = originalFetch; });

  const reply = await createSupportAgent().respond({
    message: "你是谁",
    modelConfig: { provider: "deepseek", apiKey: "test-key", model: "deepseek-v4-flash" }
  });

  assert.equal(reply.kind, "general_chat");
  assert.equal(reply.responseMode, "general-model");
  assert.equal(calls, 1);
});

test("uses a deterministic introduction for general chat without a model", async () => {
  const reply = await createSupportAgent().respond({ message: "Who are you?" });

  assert.equal(reply.kind, "general_chat");
  assert.equal(reply.responseMode, "deterministic-introduction");
  assert.match(reply.message, /Support Sentinel/i);
});

test("keeps an unsupported support request on the human-handoff path with a model configured", async (t) => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_url, options) => {
    const request = JSON.parse(options.body);
    assert.deepEqual(request.response_format, { type: "json_object" });
    return { ok: true, json: async () => ({ choices: [{ message: { content: '{"name":"create_handoff","arguments":{"reason":"knowledge_gap"}}' } }] }) };
  };
  t.after(() => { globalThis.fetch = originalFetch; });

  const reply = await createSupportAgent().respond({
    message: "Can I change the engraving after purchase?",
    modelConfig: { provider: "deepseek", apiKey: "test-key" }
  });

  assert.equal(reply.kind, "escalation");
  assert.equal(reply.handoff.reason, "knowledge_gap");
});
