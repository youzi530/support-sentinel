export const toolNames = ["search_knowledge", "get_order", "request_cancellation", "cancel_order", "create_handoff"];
const orderIdPattern = /^ORD-\d{4}$/i;

export function validateToolProposal(proposal, { pendingAction } = {}) {
  if (!proposal || !toolNames.includes(proposal.name)) return { allowed: false, reason: "tool_not_allowed" };
  const args = proposal.arguments || {};
  if (["get_order", "request_cancellation", "cancel_order"].includes(proposal.name) && !orderIdPattern.test(args.orderId || "")) {
    return { allowed: false, reason: "invalid_order_id" };
  }
  if (proposal.name === "search_knowledge" && typeof args.query !== "string") {
    return { allowed: false, reason: "invalid_query" };
  }
  if (proposal.name === "create_handoff" && typeof args.reason !== "string") {
    return { allowed: false, reason: "invalid_handoff_reason" };
  }
  if (proposal.name === "cancel_order") {
    if (!pendingAction || pendingAction.type !== "cancel_order" || pendingAction.orderId !== args.orderId.toUpperCase()) {
      return { allowed: false, reason: "confirmation_required" };
    }
  }
  return { allowed: true };
}

export function traceProposal(proposal, context) {
  const validation = validateToolProposal(proposal, context);
  return { tool: proposal?.name || "none", validation: validation.allowed ? "allowed" : "rejected", reason: validation.reason || null };
}
