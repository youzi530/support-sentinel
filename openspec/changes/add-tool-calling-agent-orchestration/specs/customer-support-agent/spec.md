## MODIFIED Requirements

### Requirement: Confirm customer actions before execution

The system SHALL only cancel a processing order after explicit customer confirmation, even when a model proposes the cancellation tool.

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
