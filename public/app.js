const messages = document.querySelector("#messages");
const form = document.querySelector("#composer");
const input = document.querySelector("#message");
let pendingAction = null;

function addMessage(text, role, detail = "") {
  const message = document.createElement("article");
  message.className = `message ${role}`;
  const body = document.createElement("div");
  body.textContent = text;
  message.append(body);
  if (detail) {
    const metadata = document.createElement("small");
    metadata.textContent = detail;
    message.append(metadata);
  }
  messages.append(message);
  messages.scrollTop = messages.scrollHeight;
}

async function ask(message) {
  addMessage(message, "customer");
  input.value = "";
  const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, pendingAction }) });
  const reply = await response.json();
  if (!response.ok) return addMessage(reply.error || "Something went wrong.", "agent");

  pendingAction = reply.pendingAction || null;
  const labels = { knowledge: "GROUNDED KNOWLEDGE", confirmation_required: "CONFIRMATION REQUIRED", action_completed: "ACTION COMPLETE", action_unavailable: "ACTION UNAVAILABLE", escalation: "HUMAN HANDOFF" };
  const details = [];
  if (reply.source) details.push(`Source: ${reply.source.title}`);
  if (reply.evidence) details.push(`Evidence: “${reply.evidence}”`);
  if (reply.receipt) details.push(`Receipt: ${reply.receipt.action} · ${reply.receipt.orderId}`);
  if (reply.handoff) details.push(`Queue: ${reply.handoff.queue} · Reason: ${reply.handoff.reason} · ${reply.handoff.summary}`);
  const detail = details.join("\n");
  addMessage(reply.message, "agent", `${labels[reply.kind]}${detail ? ` · ${detail}` : ""}`);
}

form.addEventListener("submit", (event) => { event.preventDefault(); if (input.value.trim()) ask(input.value.trim()); });
document.querySelectorAll("[data-prompt]").forEach((button) => button.addEventListener("click", () => ask(button.dataset.prompt)));
