# pi-engineering-harness

Reusable Pi workflows for feature development, review, debugging, and codebase explanation.

## What it solves

Teams often ask coding agents to work differently in every repository. This package standardizes *how* the agent works while still letting the target repository define architecture, style, commands, and tests.

Evidence precedence:

1. explicit project instructions/context files;
2. project configuration and declared scripts;
3. nearby production/test code;
4. harness skills;
5. generic best practices.

## Contents

- Prompt templates: `/feature`, `/review`, `/debug`, `/explain`
- Skills: `frontend-engineering`, `backend-engineering`, `fullstack-contracts`
- Extension: `engineering_validation` tool for conservative validation discovery/execution

## Install locally

From a target project:

```bash
pi install /absolute/path/to/pi-engineering-harness
# or for project-local settings
pi install --local /absolute/path/to/pi-engineering-harness
```

Reload or restart Pi after installation.

## Quick start

```text
/feature add a settings toggle for email notifications
/review API compatibility
/debug --diagnose-only login returns 500
/debug --fix failing profile update test
/explain how authentication flows from UI to API
```

## Validation extension

The extension exposes an LLM-callable tool named `engineering_validation`.

- `discover`: returns known checks.
- `run`: runs a selected discovered check.

Explicit `.pi-harness.json` in the target repo wins:

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

Without config, discovery is conservative and only uses declared `package.json` validation scripts.

See `USAGE.md` and `DISTRIBUTION.md` for details.
