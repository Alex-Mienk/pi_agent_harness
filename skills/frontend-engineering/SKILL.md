---
name: frontend-engineering
description: Guide frontend implementation and review when work touches UI components, views, state, forms, API clients, accessibility, or frontend validation. Use only after repository evidence establishes frontend scope; do not assume a framework.
---

# Frontend engineering

Use target-repository evidence before generic advice. Do not assume React, Vue, Svelte, Angular, mobile, or any framework until configuration or existing code proves it.

Inspection checklist:

- Project instructions, package scripts, lint/type/build/test config.
- Nearby components/views/routes, state management, forms, API clients, styling patterns, and tests.
- Existing loading, error, empty, disabled, optimistic, and retry states.
- Accessibility conventions: semantic elements, labels, focus order, keyboard interaction, ARIA only where appropriate.

Work guidance:

- Keep changes small and consistent with nearby code.
- Reuse existing components/utilities before adding abstractions.
- Preserve API contracts and coordinate with `fullstack-contracts` when requests/responses, shared types, generated clients, or status handling change.
- Add or update tests only in repository-supported patterns.
- Run only declared or discovered frontend checks such as lint, typecheck, unit tests, component tests, or build.

Report validation honestly with exact commands/results. If evidence is missing, state the unknown instead of inventing conventions.
