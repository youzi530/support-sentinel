## Context

The existing demo proves confirmation-gated cancellation but routes messages through keyword rules and offers limited knowledge evidence. See `proposal.md` and the existing customer-support-agent specification for product context.

## Goals / Non-Goals

**Goals:** introduce a provider boundary that can use an LLM when configured, retrieve evidence from several approved articles, give each cancellation state an explicit result, and make escalation handoffs reviewable.

**Non-Goals:** persistence, customer authentication, real order-provider integration, autonomous refunds, streaming output, or making an external LLM mandatory for local review.

## Decisions

- Preserve the server-owned tool boundary. The model adapter may select a supported intent but cannot execute a cancellation; only a stored pending action plus explicit confirmation can invoke the order tool. This is safer than allowing free-form tool calls.
- Add lexical retrieval over versioned in-repo articles, returning source and evidence. It is transparent and dependency-free; embeddings are unnecessary for this limited take-home corpus.
- Define an optional OpenAI-compatible adapter behind environment variables, with the deterministic router as fallback. This demonstrates production separation without requiring reviewers to supply a key.
- Return typed outcomes (`knowledge`, `confirmation_required`, `action_completed`, `action_unavailable`, `escalation`) so the UI and tests do not infer safety state from prose.

## Risks / Trade-offs

- [Provider outputs vary] → Use the provider only for supported intent classification and retain deterministic policy/tool validation.
- [Lexical retrieval misses paraphrases] → Include representative policy language and escalate low-confidence results rather than guessing.
- [Demo state is mutable] → Label it as in-memory fixture data and restart between recordings.

## Migration Plan

1. Add characterization tests for the new outcomes before updating the router.
2. Add retrieval and action-state modules, then update UI rendering.
3. Configure optional provider variables without storing secrets.
4. Run tests and document the video walkthrough; reverting removes the adapter path and retains the deterministic fallback.
