---
description: Read-only pre-PR review of current changes
argument-hint: "[focus]"
---
Perform a read-only review. Do not edit source files, configuration, tests, docs, lockfiles, or generated files.

Focus: ${@:-correctness, conventions, contracts, tests, error handling, security, accessibility/UI states, migrations, and observability where relevant}

Workflow:

1. Inspect repository instructions/context and relevant configuration first.
2. Prefer staged diff when meaningful; otherwise inspect the current working-tree diff. Honor an explicitly supplied focus/scope.
3. Compare changes against nearby existing code and declared project conventions.
4. Check correctness, compatibility at frontend/backend contracts, validation and tests, error handling, security-sensitive mistakes, accessibility/loading/error/empty UI states where relevant, migrations, and observability where relevant.
5. Findings must cite concrete evidence and file locations. Explain impact. Do not invent findings. Do not output arbitrary scores.

Output with these headings:

- Scope reviewed
- Evidence inspected
- Blocking findings
- Non-blocking findings
- Validation notes
- Unknowns / not reviewed

If there are no findings in a section, say so. Stay read-only.
