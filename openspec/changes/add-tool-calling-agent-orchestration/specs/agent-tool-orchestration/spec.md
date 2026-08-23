## Purpose

Defines a transparent, safe agent loop in which model planning is separated from server-side authorization and execution.

## ADDED Requirements

### Requirement: Plan with an explicit tool registry

The system SHALL provide the model only the approved tools `search_knowledge`, `get_order`, `request_cancellation`, `cancel_order`, and `create_handoff` with structured parameters.

#### Scenario: Model proposes a knowledge lookup

- **WHEN** a customer asks a supported policy question
- **THEN** the model may propose `search_knowledge`
- **AND THEN** the server records the proposal before executing it

### Requirement: Validate every proposed action

The system SHALL validate tool name, parameters, customer-action eligibility, and confirmation state before execution.

#### Scenario: Model proposes cancellation without confirmation

- **WHEN** the model proposes `cancel_order` without a stored customer confirmation
- **THEN** the server rejects the call
- **AND THEN** returns a confirmation-required result without changing the order

### Requirement: Produce an execution trace

The system SHALL return a reviewable trace containing proposed tool, validation outcome, execution result, and final response mode.

#### Scenario: Tool call completes

- **WHEN** an approved tool call passes validation
- **THEN** the trace records the executed tool and sanitized result
- **AND THEN** the final customer response is grounded in that result
