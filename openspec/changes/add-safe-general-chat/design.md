## Context

The agent currently invokes DeepSeek to propose a support tool and to synthesize answers from approved knowledge. A no-match message is deterministically escalated before it reaches either model capability. The project deliberately keeps API keys in browser memory only and retains local authority over every support tool.

## Goals / Non-Goals

**Goals:**

- Let a configured model answer low-risk conversational messages naturally.
- Preserve evidence-only answers for policy questions and server-owned handling for actions and risks.
- Make the response provenance visible without exposing chain-of-thought or secret material.

**Non-Goals:**

- Adding authentication, customer identity, conversation persistence, or unrestricted operational tools.
- Treating model output as a source of policy truth or allowing it to bypass a handoff.

## Decisions

1. Add an explicit `general_chat` provider method and use it only after local risk, action, and approved-knowledge routes have been evaluated. This prevents an ambiguous request from using open-ended generation where a support guardrail applies.
2. Classify short conversational messages locally with a narrow predicate (identity, capabilities, greeting, thanks). All other unsupported support-style messages retain the current human handoff. This is safer than asking the model to self-classify its own authority boundary.
3. Return `kind: "general_chat"` plus a `responseMode` label. The UI can display a clear “General model response” receipt, while API consumers retain an explicit contract.
4. Use a bounded system prompt that describes the demo identity and prohibits invented policy, account access, or operational commitments. The alternative of a general assistant prompt was rejected because it would blur the safety boundary.

## Risks / Trade-offs

- [A conversational request can resemble support] → The predicate is intentionally narrow; unclear support requests escalate rather than generate.
- [Model failure] → Preserve deterministic no-model fallback and return the existing generic provider error without echoing credentials.
- [Model statement could still be mistaken for policy] → UI labels general output separately and prompt prohibits policy claims.
