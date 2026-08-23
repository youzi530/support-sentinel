import test from "node:test";
import assert from "node:assert/strict";
import { createSupportAgent } from "../src/agent.js";

test("answers delivery questions from the approved shipping policy", () => {
  const agent = createSupportAgent();

  const reply = agent.respond({ message: "How long does standard shipping take?" });

  assert.equal(reply.kind, "knowledge");
  assert.match(reply.message, /3–5 business days/i);
  assert.equal(reply.source.title, "Shipping policy");
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
  assert.match(reply.handoff.summary, /unrecognized charge/i);
});
