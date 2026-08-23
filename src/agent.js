import { findKnowledgeAnswer } from "./knowledge-base.js";
import { createOrderTool } from "./order-tool.js";

const orderIdPattern = /ORD-\d{4}/i;
const confirmationPattern = /^(yes|confirm|please do|cancel it)\b/i;
const fraudPattern = /unrecognized charge|fraud|stolen card|card.*(?:wasn't|was not) me/i;
const escalationPattern = /angry|terrible|manager|lawsuit/i;

export function createSupportAgent() {
  const orders = createOrderTool();

  return {
    getOrder: orders.getOrder,
    respond({ message, pendingAction = null }) {
      const text = message.trim();

      if (fraudPattern.test(text) || escalationPattern.test(text)) {
        const reason = fraudPattern.test(text) ? "suspected_fraud" : "high_customer_frustration";
        return {
          kind: "escalation",
          message: "I’m connecting you with a specialist who can help securely.",
          handoff: { reason, summary: `Customer reported: ${text}` }
        };
      }

      if (pendingAction && confirmationPattern.test(text)) {
        const receipt = orders.cancelOrder(pendingAction.orderId);
        if (receipt) return { kind: "action_completed", message: receipt.message, receipt };
        return {
          kind: "escalation",
          message: "This order can no longer be cancelled automatically, so I’ve prepared a handoff.",
          handoff: { reason: "action_not_available", summary: `Cancellation unavailable for ${pendingAction.orderId}.` }
        };
      }

      const orderId = text.match(orderIdPattern)?.[0]?.toUpperCase();
      if (orderId && /cancel/i.test(text)) {
        const order = orders.getOrder(orderId);
        if (order?.status === "processing") {
          return {
            kind: "confirmation_required",
            message: `I can cancel ${orderId} (${order.item}, ${order.total}). Reply “Yes” to confirm.`,
            pendingAction: { type: "cancel_order", orderId }
          };
        }
      }

      const knowledge = findKnowledgeAnswer(text);
      if (knowledge) return { kind: "knowledge", ...knowledge };

      return {
        kind: "escalation",
        message: "I don’t have a reliable answer for that. I’ve prepared a handoff to our support team.",
        handoff: { reason: "knowledge_gap", summary: `Customer needs help with: ${text}` }
      };
    }
  };
}
