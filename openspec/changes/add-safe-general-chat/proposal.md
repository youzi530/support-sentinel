## Why

The prototype currently escalates every message that is not an approved support-policy answer, so a simple conversational question such as “Who are you?” feels broken even when a configured model is available. The demo needs natural model-backed conversation without weakening the boundaries around policy, customer actions, and high-risk requests.

## What Changes

- Add a model-backed general-chat response path for broad non-support conversation when a configured DeepSeek model is available.
- Identify the response mode in the API and UI so reviewers can distinguish general model output from approved knowledge answers.
- Preserve deterministic knowledge grounding, action confirmation, tool validation, and risk escalation for support workflows.
- Retain the existing safe fallback when no model is configured or the provider fails.

## Capabilities

### New Capabilities

- `safe-general-chat`: Provides bounded model-powered conversational responses outside the customer-support knowledge and action domains.

### Modified Capabilities

- `customer-support-agent`: Clarifies the distinction between unsupported support requests, which escalate, and safe general conversational messages, which may use the configured model.

## Impact

Updates the DeepSeek adapter, agent routing contract, browser response rendering, tests, README, and OpenSpec specifications. No new runtime dependency or persistent secret storage is introduced.
