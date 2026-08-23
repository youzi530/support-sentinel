import test from "node:test";
import assert from "node:assert/strict";
import { createSupportAgent } from "../src/agent.js";
import { createIntentAdapter } from "../src/intent-adapter.js";

test("answers delivery questions from the approved shipping policy", () => {
  const agent = createSupportAgent();

  const reply = agent.respond({ message: "How long does standard shipping take?" });

  assert.equal(reply.kind, "knowledge");
  assert.match(reply.message, /3–5 business days/i);
  assert.equal(reply.source.title, "Shipping policy");
  assert.match(reply.evidence, /3–5 business days/i);
});

test("answers return questions with a separate approved source", () => {
  const agent = createSupportAgent();

  const reply = agent.respond({ message: "What is your return window?" });

  assert.equal(reply.kind, "knowledge");
  assert.equal(reply.source.title, "Returns policy");
  assert.match(reply.evidence, /30 days/i);
});

test("requires explicit confirmation before cancelling an order", () => {
  const agent = createSupportAgent();

  const requested = agent.respond({ message: "Please cancel order ORD-1001" });
  const orderBeforeConfirmation = agent.getOrder("ORD-1001");

  assert.equal(requested.kind, "confirmation_required");
  assert.equal(orderBeforeConfirmation.status, "processing");

  const completed = agent.respond({ message: "Yes, cancel it", pendingAction: requested.pendingAction });
  assert.equal(completed.kind, "action_completed");
  assert.equal(completed.receipt.orderId, "ORD-1001");
  assert.equal(agent.getOrder("ORD-1001").status, "cancelled");
});

test("escalates suspected fraud without attempting a customer action", () => {
  const agent = createSupportAgent();

  const reply = agent.respond({ message: "There is an unrecognized charge on my card" });

  assert.equal(reply.kind, "escalation");
  assert.equal(reply.handoff.reason, "suspected_fraud");
  assert.equal(reply.handoff.queue, "fraud-review");
  assert.match(reply.handoff.summary, /unrecognized charge/i);
});

test("explains that shipped orders cannot be cancelled", () => {
  const agent = createSupportAgent();

  const reply = agent.respond({ message: "Please cancel order ORD-2002" });

  assert.equal(reply.kind, "action_unavailable");
  assert.match(reply.message, /already shipped/i);
  assert.equal(reply.handoff.queue, "order-support");
});

test("escalates unknown questions instead of fabricating a knowledge answer", () => {
  const agent = createSupportAgent();

  const reply = agent.respond({ message: "Can I change the engraving after purchase?" });

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
