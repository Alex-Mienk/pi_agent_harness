---
description: Evidence-first debugging with diagnose-only or fix mode
argument-hint: "[--diagnose-only|--fix] <problem>"
---
Debug this problem:

$ARGUMENTS

Use this sequence exactly:

`symptom -> evidence -> reproduction -> hypotheses -> narrowing -> root cause -> fix -> regression verification`

Rules:

- Inspect repository instructions/context, configuration, logs/tests supplied by the user, and relevant code before assuming.
- Distinguish observations from assumptions.
- Avoid speculative edits.
- `--diagnose-only` is strictly read-only: do not modify source files, configuration, tests, docs, lockfiles, generated files, data, or Git state.
- `--fix` may edit only after enough evidence identifies the cause or the most likely cause.
- If no flag is supplied, diagnose first and edit only if the user's request clearly asks for a fix.
- Use repository-supported checks only. Use `engineering_validation` discovery when useful. Never invent validation commands.
- Require confirmation before destructive migrations/data loss, destructive Git operations, publication, deployment, credential changes, or broad architectural rewrites.

Output with these headings:

- Symptom
- Evidence
- Reproduction
- Hypotheses
- Narrowing
- Root cause / likely cause
- Fix or recommended fix
- Regression verification
- Unknowns

Be concise and cite real paths/commands/results.
