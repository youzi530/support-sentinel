const messages = document.querySelector("#messages");
const form = document.querySelector("#composer");
const input = document.querySelector("#message");
const apiKey = document.querySelector("#api-key");
const model = document.querySelector("#model");
const modelStatus = document.querySelector("#model-status");
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
  const modelConfig = apiKey.value && model.value ? { provider: "deepseek", apiKey: apiKey.value, model: model.value } : null;
  const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, pendingAction, modelConfig }) });
  const reply = await response.json();
  if (!response.ok) return addMessage(reply.error || "Something went wrong.", "agent");

  pendingAction = reply.pendingAction || null;
  const labels = { knowledge: "GROUNDED KNOWLEDGE", general_chat: "GENERAL MODEL RESPONSE", confirmation_required: "CONFIRMATION REQUIRED", action_completed: "ACTION COMPLETE", action_unavailable: "ACTION UNAVAILABLE", escalation: "HUMAN HANDOFF", provider_error: "MODEL CONNECTION" };
  const details = [];
  if (reply.source) details.push(`Source: ${reply.source.title}`);
  if (reply.evidence) details.push(`Evidence: “${reply.evidence}”`);
  if (reply.responseMode) details.push(`Mode: ${reply.responseMode}`);
  if (reply.receipt) details.push(`Receipt: ${reply.receipt.action} · ${reply.receipt.orderId}`);
  if (reply.handoff) details.push(`Queue: ${reply.handoff.queue} · Reason: ${reply.handoff.reason} · ${reply.handoff.summary}`);
  if (reply.trace?.length) details.push(`Trace: ${reply.trace.map((item) => `${item.tool} (${item.validation}${item.reason ? `: ${item.reason}` : ""})`).join(", ")}`);
  const detail = details.join("\n");
  addMessage(reply.message, "agent", `${labels[reply.kind]}${detail ? ` · ${detail}` : ""}`);
}

form.addEventListener("submit", (event) => { event.preventDefault(); if (input.value.trim()) ask(input.value.trim()); });
document.querySelectorAll("[data-prompt]").forEach((button) => button.addEventListener("click", () => ask(button.dataset.prompt)));
function updateMode() { modelStatus.textContent = apiKey.value && model.value ? `DeepSeek: ${model.value}` : "Deterministic"; }
apiKey.addEventListener("input", updateMode); model.addEventListener("change", updateMode);
document.querySelector("#clear-key").addEventListener("click", () => { apiKey.value = ""; model.value = ""; updateMode(); });
