import { findKnowledgeAnswer } from "./knowledge-base.js";
import { createIntentAdapter } from "./intent-adapter.js";
import { createOrderTool } from "./order-tool.js";

const orderIdPattern = /ORD-\d{4}/i;
const confirmationPattern = /^(yes|confirm|please do|cancel it)\b/i;
const fraudPattern = /unrecognized charge|fraud|stolen card|card.*(?:wasn't|was not) me/i;
const escalationPattern = /angry|terrible|manager|lawsuit/i;

function handoff(reason, summary, queue) {
  return { reason, summary, queue };
}

function unavailableCancellation(orderId, order) {
  if (!order) {
    return {
      kind: "action_unavailable",
      message: `I can’t find order ${orderId}, so I haven’t made any changes.`,
      handoff: handoff("order_not_found", `Customer requested cancellation for unknown order ${orderId}.`, "order-support")
    };
  }
  const description = order.status === "shipped" ? "has already shipped" : "has already been cancelled";
  return {
    kind: "action_unavailable",
    message: `Order ${orderId} ${description}, so it can’t be cancelled automatically. I’ve prepared a support handoff.`,
    handoff: handoff("action_not_available", `Cancellation unavailable for ${orderId}: status is ${order.status}.`, "order-support")
  };
}

export function createSupportAgent({ intentAdapter = createIntentAdapter() } = {}) {
  const orders = createOrderTool();

  return {
    getOrder: orders.getOrder,
    async respond({ message, pendingAction = null }) {
      const text = message.trim();
      // Provider output can advise routing, but local policies remain authoritative for every action.
      const providerIntent = await intentAdapter.classify(text);
      const route = (response) => ({ ...response, routing: { mode: intentAdapter.isEnabled ? "provider-assisted" : "deterministic", providerIntent } });

      if (fraudPattern.test(text) || escalationPattern.test(text)) {
        const reason = fraudPattern.test(text) ? "suspected_fraud" : "high_customer_frustration";
        return route({
          kind: "escalation",
          message: "I’m connecting you with a specialist who can help securely.",
          handoff: handoff(reason, `Customer reported: ${text}`, reason === "suspected_fraud" ? "fraud-review" : "priority-support")
        });
      }

      if (pendingAction && confirmationPattern.test(text)) {
        const receipt = orders.cancelOrder(pendingAction.orderId);
        if (receipt) return route({ kind: "action_completed", message: receipt.message, receipt });
        return route(unavailableCancellation(pendingAction.orderId, orders.getOrder(pendingAction.orderId)));
      }

      const orderId = text.match(orderIdPattern)?.[0]?.toUpperCase();
      if (orderId && /cancel/i.test(text)) {
        const order = orders.getOrder(orderId);
        if (order?.status === "processing") {
          return route({
            kind: "confirmation_required",
            message: `I can cancel ${orderId} (${order.item}, ${order.total}). Reply “Yes” to confirm.`,
            pendingAction: { type: "cancel_order", orderId }
          });
        }
        return route(unavailableCancellation(orderId, order));
      }

      const knowledge = findKnowledgeAnswer(text);
      if (knowledge) return route({ kind: "knowledge", ...knowledge });

      return route({
        kind: "escalation",
        message: "I don’t have a reliable answer for that. I’ve prepared a handoff to our support team.",
        handoff: handoff("knowledge_gap", `Customer needs help with: ${text}`, "general-support")
      });
    }
  };
}
