# Usage

## Commands

### `/feature <request>`

Use for a focused implementation.

Example:

```text
/feature add server-side validation for duplicate project names
```

Behavior: modifying. It inspects repository evidence, chooses relevant skills, states an approach, makes the smallest coherent change, runs repository-supported checks, and reports exact results.

### `/review [focus]`

Use before a PR.

```text
/review security and API compatibility
```

Behavior: read-only. It prefers staged diff when meaningful, otherwise working-tree diff, and reports blocking/non-blocking findings with concrete paths and impact. It must not edit files.

### `/debug [--diagnose-only|--fix] <problem>`

```text
/debug --diagnose-only checkout page hangs after payment failure
/debug --fix unit test fails for invoice rounding
```

Behavior:

- `--diagnose-only`: read-only. Reports evidence, likely cause, recommended fix, and unknowns.
- `--fix`: may edit only after evidence identifies the cause or likely cause, then runs relevant regression checks.
- No flag: diagnose first; edit only when the user clearly requested a fix.

### `/explain <area-or-question>`

```text
/explain how API errors reach the toast component
```

Behavior: read-only. It cites real paths, explains entry points/control flow/data flow/dependencies/tests, and may include a compact flow diagram. It must not invent architecture.

## Skills

Pi advertises these skills and loads their detailed instructions when relevant:

- `frontend-engineering`: UI/components/views/state/forms/API clients/a11y/frontend checks.
- `backend-engineering`: routes/handlers/services/persistence/validation/auth/errors/migrations/backend checks.
- `fullstack-contracts`: DTOs/schemas/OpenAPI/generated clients/shared types/status codes/compatibility.

You can force one with `/skill:frontend-engineering`, `/skill:backend-engineering`, or `/skill:fullstack-contracts`.

## Validation behavior

The `engineering_validation` tool discovers checks before running them.

1. If `.pi-harness.json` exists, it uses only that file's `checks` mapping.
2. Otherwise it inspects declared `package.json` scripts and maps common validation scripts conservatively:
   - `lint`
   - `typecheck`, `type-check`, or `tsc`
   - `test:unit`, `unit`, or `test`
   - `test:integration` or `integration`
   - `build`
3. It does not execute guessed framework/language commands just because files exist.

Result statuses:

- `passed`: command exited 0, or discovery succeeded.
- `failed`: command ran and exited non-zero or failed/timed out.
- `unavailable`: requested check was not discovered.
- `skipped`: run was intentionally skipped by request.

## `.pi-harness.json`

Example:

```json
{
  "checks": {
    "lint": "npm run lint",
    "typecheck": "npm run typecheck",
    "unit": "npm test",
    "integration": "npm run test:integration",
    "build": "npm run build"
  }
}
```

Keep commands repository-native. The harness will not invent missing checks.

## Human-in-the-loop behavior

The prompts require confirmation before genuinely high-impact actions, including destructive migrations/data loss, destructive Git operations, package publication, deployment, credential changes, or broad architectural rewrites.

Normal requested feature edits and tests should not trigger unnecessary confirmation.

## Troubleshooting

- After installing or editing this package, run `/reload` or restart Pi.
- If commands do not appear, check `pi list` and package trust/settings.
- If a validation check is unavailable, add `.pi-harness.json` or declare the relevant script in the target repo.
- Read-only commands must not edit files; stop the run if the agent attempts to modify files during `/review`, `/explain`, or `/debug --diagnose-only`.

## Limitations

- MVP supports conservative Node/package-script discovery only when explicit config is absent.
- It is not a deployment, release, CI, or project generation tool.
- It does not add subagents or a custom UI.
