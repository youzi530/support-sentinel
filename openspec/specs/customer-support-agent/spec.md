# Customer Support Agent Specification

## Purpose

Provides a safe, reviewable support interaction that answers from approved knowledge, executes a single confirmation-gated order action, and routes risky or unresolved conversations to a human specialist.

## Requirements

### Requirement: Answer from approved knowledge

The system SHALL answer a supported policy question only from matching approved knowledge and identify the source article with a supporting evidence excerpt.

#### Scenario: Customer asks about delivery timing

- **WHEN** a customer asks how long standard shipping takes
- **THEN** the agent returns the stated delivery window
- **AND THEN** the response names the shipping-policy source and evidence excerpt

#### Scenario: No approved evidence is found

- **WHEN** a customer asks a question without a matching approved knowledge article
- **THEN** the agent does not invent an answer
- **AND THEN** prepares a human handoff

### Requirement: Confirm customer actions before execution

The system SHALL only cancel a processing order after the customer explicitly confirms the requested cancellation, and SHALL report an actionable status when cancellation is unavailable.

#### Scenario: Customer requests cancellation

- **WHEN** a customer asks to cancel an eligible order
- **THEN** the agent describes the action and asks for confirmation
- **AND THEN** no order state changes before confirmation

#### Scenario: Customer confirms cancellation

- **WHEN** the customer confirms a pending cancellation
- **THEN** the system cancels the eligible demo order
- **AND THEN** returns an action receipt containing the order identifier

#### Scenario: Customer requests cancellation for a shipped order

- **WHEN** a customer asks to cancel an order that has already shipped
- **THEN** the agent does not attempt cancellation
- **AND THEN** clearly states that the order has shipped and offers a human handoff

### Requirement: Escalate risky or unresolved conversations

The system SHALL create a human-escalation handoff for suspected fraud, high frustration, or an unsupported question, including a concise handoff summary and recommended queue.

#### Scenario: Customer reports an unrecognized charge

- **WHEN** the customer reports an unrecognized card charge
- **THEN** the agent does not attempt an account or payment action
- **AND THEN** returns a fraud queue, handoff reason, and a summary for a human agent
