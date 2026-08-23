# Customer Support Agent Specification

## Purpose

Provides a safe, reviewable support interaction that answers from approved knowledge, executes a single confirmation-gated order action, and routes risky or unresolved conversations to a human specialist.

## Requirements

### Requirement: Answer from approved knowledge

The system SHALL answer a supported policy question using a matching approved knowledge-base article and identify the article used.

#### Scenario: Customer asks about delivery timing

- **WHEN** a customer asks how long standard shipping takes
- **THEN** the agent returns the stated delivery window
- **AND THEN** the response names the shipping-policy source

### Requirement: Confirm customer actions before execution

The system SHALL not cancel an order until the customer explicitly confirms the requested cancellation.

#### Scenario: Customer requests cancellation

- **WHEN** a customer asks to cancel an eligible order
- **THEN** the agent describes the action and asks for confirmation
- **AND THEN** no order state changes before confirmation

#### Scenario: Customer confirms cancellation

- **WHEN** the customer confirms a pending cancellation
- **THEN** the system cancels the eligible demo order
- **AND THEN** returns an action receipt containing the order identifier

### Requirement: Escalate risky or unresolved conversations

The system SHALL create a human-escalation handoff for suspected fraud, high frustration, or an unsupported question.

#### Scenario: Customer reports an unrecognized charge

- **WHEN** the customer reports an unrecognized card charge
- **THEN** the agent does not attempt an account or payment action
- **AND THEN** returns a handoff reason and a summary for a human agent
