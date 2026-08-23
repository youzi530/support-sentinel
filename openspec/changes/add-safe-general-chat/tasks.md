## 1. Model and routing contract

- [x] 1.1 Add failing tests for model-backed general chat, deterministic no-model fallback, and unsupported-support escalation.
- [x] 1.2 Add a bounded DeepSeek general-chat adapter method that never receives policy evidence or tool authority.
- [x] 1.3 Route only recognized low-risk conversation to general chat after existing risk, action, and knowledge checks.

## 2. Demo transparency

- [x] 2.1 Render a distinct general-model response receipt in the UI without exposing hidden reasoning or key material.
- [x] 2.2 Document the response modes, safety boundary, and demo journey in the README.

## 3. Verification

- [ ] 3.1 Run tests and strict OpenSpec validation, commit focused changes, and push to main.
