## MODIFIED Requirements

### Requirement: Answer from approved knowledge

The system SHALL answer a supported policy question only from matching approved knowledge and identify the source article with a supporting evidence excerpt. It SHALL route an unsupported support-related question to a human handoff, except that recognized low-risk conversational messages may use the separate safe-general-chat capability.

#### Scenario: Customer asks about delivery timing

- **WHEN** a customer asks how long standard shipping takes
- **THEN** the agent returns the stated delivery window
- **AND THEN** the response names the shipping-policy source and evidence excerpt

#### Scenario: No approved evidence is found for a support question

- **WHEN** a customer asks a support-related question without a matching approved knowledge article
- **THEN** the agent does not invent a policy answer
- **AND THEN** prepares a human handoff
