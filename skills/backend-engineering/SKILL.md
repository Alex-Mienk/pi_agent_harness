---
name: backend-engineering
description: Guide backend implementation and review when work touches routes, handlers, controllers, services, persistence, validation, auth, migrations, API schemas, or backend checks. Use only after repository evidence establishes backend scope; do not assume a language or framework.
---

# Backend engineering

Use target-repository evidence before generic advice. Do not assume Node, Python, Java, Go, Rails, Django, Express, serverless, SQL, or any framework until configuration or existing code proves it.

Inspection checklist:

- Project instructions, service layout, package/build/test config, environment examples, and migration tooling.
- Routes/controllers/handlers, business logic boundaries, persistence models/queries, validation, auth/authz, error handling, logging, schemas, and tests.
- Compatibility expectations for status codes, error shapes, idempotency, transactions, and migrations.

Work guidance:

- Keep business logic in the same layer used by nearby code.
- Validate inputs at established boundaries and preserve auth/authz checks.
- Avoid destructive data changes unless explicitly requested and confirmed.
- Coordinate with `fullstack-contracts` when request/response DTOs, schemas, generated clients, shared types, or frontend consumers are affected.
- Add or update tests only in repository-supported patterns.
- Run only declared or discovered backend checks such as lint, typecheck, unit/integration tests, migrations checks, or build.

Report validation honestly with exact commands/results. If evidence is missing, state the unknown instead of inventing conventions.
