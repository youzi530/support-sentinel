const messages = document.querySelector("#messages");
const form = document.querySelector("#composer");
const input = document.querySelector("#message");
let pendingAction = null;

function addMessage(text, role, detail = "") {
  const message = document.createElement("article");
  message.className = `message ${role}`;
  message.innerHTML = `<div>${text}</div>${detail ? `<small>${detail}</small>` : ""}`;
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
  const labels = { knowledge: "APPROVED KNOWLEDGE", confirmation_required: "CONFIRMATION REQUIRED", action_completed: "ACTION COMPLETE", escalation: "HUMAN HANDOFF" };
  const detail = reply.source ? `Source: ${reply.source.title}` : reply.handoff ? `Reason: ${reply.handoff.reason} · ${reply.handoff.summary}` : reply.receipt ? `Receipt: ${reply.receipt.action} · ${reply.receipt.orderId}` : "";
  addMessage(reply.message, "agent", `${labels[reply.kind]}${detail ? ` · ${detail}` : ""}`);
}

form.addEventListener("submit", (event) => { event.preventDefault(); if (input.value.trim()) ask(input.value.trim()); });
document.querySelectorAll("[data-prompt]").forEach((button) => button.addEventListener("click", () => ask(button.dataset.prompt)));
