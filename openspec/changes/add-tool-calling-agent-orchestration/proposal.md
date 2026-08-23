## Why

The current DeepSeek integration generates grounded text but does not let the model plan or select customer-support tools. A tool-calling orchestration layer makes the prototype demonstrate a genuine agent loop while keeping execution under server control.

## What Changes

- Add a structured agent planner with a defined system prompt and tool registry.
- Add server-side validation, confirmation gates, and an execution trace for every proposed tool call.
- Let the model generate a final answer only after validated tool results are available.

## Capabilities

### New Capabilities

- `agent-tool-orchestration`: Safe plan → validate → execute → synthesize loop and reviewer-visible trace.

### Modified Capabilities

- `customer-support-agent`: Support model-proposed knowledge, order, and handoff tools without granting model execution authority.

## Impact

Updates model prompts, DeepSeek adapter, tool boundaries, chat API/UI, tests, and demo documentation.
