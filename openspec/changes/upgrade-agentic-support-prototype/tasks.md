## 1. Safety behavior and tests

- [ ] 1.1 Add failing tests for evidence-backed knowledge replies and explicit unavailable-cancellation outcomes; verify they fail before implementation.
- [ ] 1.2 Implement multi-article retrieval and typed action-state responses; verify all agent unit tests pass.
- [ ] 1.3 Add a provider-optional intent adapter that preserves deterministic fallback and server-owned tool authorization; verify no API key is required for tests.

## 2. Customer demo

- [ ] 2.1 Update the HTTP API and chat UI to display evidence, action status, receipt, queue, and handoff summary; verify the three demo journeys in a browser.
- [ ] 2.2 Add safe environment-variable documentation and a 3–5 minute recording runbook; verify the README describes local and provider-enabled modes.

## 3. Verification and delivery

- [ ] 3.1 Run the full test suite and OpenSpec validation; verify all commands exit successfully.
- [ ] 3.2 Commit the focused changes and push the enhanced prototype to GitHub; verify `main` matches `origin/main`.
