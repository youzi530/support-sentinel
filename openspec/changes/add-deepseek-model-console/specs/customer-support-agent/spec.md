## MODIFIED Requirements

### Requirement: Answer from approved knowledge

The system SHALL answer a supported policy question only from matching approved knowledge, identify the source article with a supporting evidence excerpt, and MAY use a configured model to phrase the response without adding unsupported facts.

#### Scenario: Customer asks about delivery timing

- **WHEN** a customer asks how long standard shipping takes
- **THEN** the agent returns the stated delivery window
- **AND THEN** the response names the shipping-policy source and evidence excerpt

#### Scenario: Customer asks about delivery timing with model mode enabled

- **WHEN** a customer asks how long standard shipping takes while DeepSeek mode is enabled
- **THEN** the system gives the model the approved shipping evidence
- **AND THEN** the returned response retains the shipping-policy source and evidence excerpt

#### Scenario: No approved evidence is found

- **WHEN** a customer asks a question without a matching approved knowledge article
- **THEN** the agent does not invent an answer
- **AND THEN** prepares a human handoff
