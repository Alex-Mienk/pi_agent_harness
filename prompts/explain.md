---
description: Read-only explanation of a real codebase area
argument-hint: "<area-or-question>"
---
Explain this area or question using only target-repository evidence:

$ARGUMENTS

Stay read-only. Do not edit source files, configuration, tests, docs, lockfiles, generated files, data, or Git state.

Workflow:

1. Inspect repository instructions/context and configuration relevant to the question.
2. Identify real entry points, modules/components, control flow, data flow, external dependencies, persistence, frontend/backend boundaries, and relevant tests when applicable.
3. Cite concrete repository paths for every important claim.
4. Include a compact flow diagram when it helps understanding.
5. Include likely extension/change points without modifying them.
6. Never invent architecture, files, routes, services, tests, commands, or conventions.

Output with these headings:

- Question / area
- Evidence inspected
- Overview
- Entry points and flow
- Data and dependencies
- Frontend/backend boundaries
- Tests and validation references
- Extension points
- Unknowns
