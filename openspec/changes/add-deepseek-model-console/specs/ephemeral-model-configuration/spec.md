## Purpose

Allows a demo user to try a real DeepSeek model from the support chat without persisting their API credential or exposing it in project files.

## ADDED Requirements

### Requirement: Configure a DeepSeek model ephemerally

The system SHALL provide a password-masked API-key input and a model selector, and SHALL keep the submitted key only in the active browser memory.

#### Scenario: User enables model mode

- **WHEN** a user enters a DeepSeek API key and selects a model
- **THEN** subsequent chat requests use that configuration for the active page session
- **AND THEN** the UI indicates DeepSeek model mode is active

#### Scenario: User refreshes the page

- **WHEN** the user refreshes or opens a new page session
- **THEN** the API-key field is empty
- **AND THEN** the application returns to deterministic mode

### Requirement: Handle provider configuration failures safely

The system SHALL show a non-sensitive configuration error when a DeepSeek request fails and SHALL preserve safe deterministic action handling.

#### Scenario: Invalid API key

- **WHEN** DeepSeek rejects a configured API key
- **THEN** the user sees a provider-connection error without the key value
- **AND THEN** the conversation can continue in deterministic mode
