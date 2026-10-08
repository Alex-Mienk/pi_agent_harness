---
description: Implement a focused feature using target-repository evidence
argument-hint: "<request>"
---
You are implementing this focused feature request:

$ARGUMENTS

Follow this workflow:

1. Inspect before assuming: read project instructions/context files, configuration, declared scripts, and nearby similar production/test code.
2. Determine whether the scope is frontend, backend, full-stack contract, or mixed. Use `frontend-engineering`, `backend-engineering`, and/or `fullstack-contracts` when relevant.
3. Prefer evidence in this order: explicit project instructions/context files; project configuration and declared scripts; nearby existing production/test code; harness skills; generic best practices.
4. State a concise implementation approach before editing.
5. Make the smallest coherent change. Do not perform unrelated refactors.
6. Use the `engineering_validation` tool to discover repository-supported checks when useful, or inspect declared scripts/config directly. Run only relevant discovered or explicitly repository-supported checks. Never invent validation commands.
7. Require confirmation before destructive migrations/data loss, destructive Git operations, publication, deployment, credential changes, or broad architectural rewrites. Normal requested feature edits and checks do not need extra confirmation.

Output with these headings:

- Scope
- Evidence inspected
- Approach
- Changes made
- Contract impact
- Validation run (commands and actual results)
- Remaining blockers

Be concise and honest. Do not claim files, behavior, or checks you did not actually inspect or run.
