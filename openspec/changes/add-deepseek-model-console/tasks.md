## 1. Provider safety and orchestration

- [ ] 1.1 Add failing tests for transient DeepSeek configuration, grounded model prompts, and non-sensitive provider errors; verify they fail before implementation.
- [ ] 1.2 Implement the DeepSeek chat-completions adapter and server-side evidence validation; verify mocked provider tests pass.
- [ ] 1.3 Preserve deterministic confirmation and order-tool behavior when model mode is enabled; verify action safety tests pass.

## 2. Configurable demo UI

- [ ] 2.1 Add a password-masked DeepSeek key input, model selector, active-mode indicator, and clear action; verify a refresh clears the key.
- [ ] 2.2 Send transient configuration with chat requests and render provider errors without secret values; verify browser interaction with a mocked provider.

## 3. Verification and delivery

- [ ] 3.1 Update README with DeepSeek setup, privacy boundary, and real-model demo steps; verify no key is present in tracked files.
- [ ] 3.2 Run tests and OpenSpec validation, commit focused changes, and push to GitHub; verify `main` matches `origin/main`.
