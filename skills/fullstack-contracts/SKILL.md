---
name: fullstack-contracts
description: Guide analysis when changes cross frontend/backend or service boundaries, including DTOs, schemas, OpenAPI, generated clients, shared types, status codes, validation, and compatibility.
---

# Full-stack contracts

Use this skill whenever a change crosses a UI/service, client/server, service/service, package, or generated-code boundary.

Inspection checklist:

- Request/response DTOs, schemas, OpenAPI/GraphQL/protobuf definitions, generated clients, shared types, validators, fixtures, and contract tests.
- Frontend consumers, backend producers, status codes, error formats, pagination/filtering/sorting semantics, auth assumptions, and versioning/backward compatibility.
- Build or generation scripts declared by the repository.

Work guidance:

- Identify both producer and consumer paths before editing.
- Prefer backward-compatible changes unless the user explicitly requests a breaking change and impact is documented.
- Keep validation rules aligned on both sides of the boundary.
- Update schemas, generated clients, fixtures, and tests only according to repository-supported commands and conventions.
- Never invent contract files or generation commands.

Report:

- Contract files and consumers inspected.
- Compatibility impact.
- Required generation/test commands actually run, or why they were not run.
- Remaining unknown consumers or migration risks.
