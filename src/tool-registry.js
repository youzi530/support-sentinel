export const toolNames = ["search_knowledge", "get_order", "request_cancellation", "cancel_order", "create_handoff"];

export function validateToolProposal(proposal, { pendingAction } = {}) {
  if (!proposal || !toolNames.includes(proposal.name)) return { allowed: false, reason: "tool_not_allowed" };
  if (proposal.name === "cancel_order" && (!pendingAction || pendingAction.type !== "cancel_order")) {
    return { allowed: false, reason: "confirmation_required" };
  }
  return { allowed: true };
}

export function traceProposal(proposal, context) {
  const validation = validateToolProposal(proposal, context);
  return { tool: proposal?.name || "none", validation: validation.allowed ? "allowed" : "rejected", reason: validation.reason || null };
}
