# Pi Engineering Harness — MVP Specification

## 1. Problem

Frontend and backend developers repeatedly spend time understanding unfamiliar code, following inconsistent implementation/review/debugging workflows, keeping API contracts aligned, and remembering validation steps. General coding agents help, but each developer may prompt them differently and receive inconsistent results.

Build a reusable Pi package that standardizes the workflow while still following the conventions of whichever repository it is used in.

## 2. Product goal

Create a shareable package named `pi-engineering-harness` with:

- four developer commands: `/feature`, `/review`, `/debug`, `/explain`;
- three reusable skills: `frontend-engineering`, `backend-engineering`, `fullstack-contracts`;
- one small TypeScript validation/discovery extension;
- usage and distribution documentation.

The harness defines *how to work*. The target repository defines *how its code should look*.

Repository evidence takes precedence in this order:

1. explicit project instructions/context files;
2. project configuration and declared scripts;
3. nearby existing production/test code;
4. harness skills;
5. generic best practices.

## 3. Expected package structure

```text
.
├── package.json
├── AGENTS.md
├── SPEC.md
├── PLAN.md
├── README.md
├── USAGE.md
├── DISTRIBUTION.md
├── extensions/
│   └── engineering-harness.ts
├── prompts/
│   ├── feature.md
│   ├── review.md
│   ├── debug.md
│   └── explain.md
├── skills/
│   ├── frontend-engineering/SKILL.md
│   ├── backend-engineering/SKILL.md
│   └── fullstack-contracts/SKILL.md
├── examples/
│   └── pi-harness.example.json
├── tests/
└── verification/
    └── verification-report.md
```

Small structural changes are acceptable if required by the installed Pi version and documented in `PLAN.md`.

## 4. Commands

### `/feature <request>`

Purpose: implement a focused feature according to the target repository's existing architecture.

Workflow:

1. inspect project instructions/configuration and similar code before editing;
2. determine frontend/backend/contract scope and load/use the relevant skills;
3. state a concise implementation approach;
4. make the smallest coherent change;
5. run relevant repository-supported checks;
6. report scope, changes, contract impact, validation results, and remaining blockers.

Never invent validation commands. Do not perform unrelated refactors.

### `/review [focus]`

Purpose: pre-PR review of current changes.

Requirements:

- read-only;
- prefer staged diff when meaningful, otherwise current working-tree diff; honor an explicitly supplied scope;
- review correctness, project conventions, contract compatibility, tests, error handling, security-sensitive mistakes, accessibility/UI states when relevant, migrations, and observability when relevant;
- findings must identify concrete evidence/file locations and explain impact;
- separate blocking from non-blocking findings;
- do not invent findings or output arbitrary quality scores.

### `/debug [--diagnose-only|--fix] <problem>`

Purpose: enforce an evidence-first debugging workflow.

Use this sequence:

`symptom -> evidence -> reproduction -> hypotheses -> narrowing -> root cause -> fix -> regression verification`

Requirements:

- distinguish observations from assumptions;
- avoid speculative edits;
- `--diagnose-only` is read-only and reports evidence, cause/likely cause, recommended fix, and unknowns;
- `--fix` may edit only after enough evidence identifies the cause, then runs appropriate regression checks;
- if no flag is supplied, diagnose first and only edit when the user's request clearly asks for a fix.

### `/explain <area-or-question>`

Purpose: explain how a real part of a target codebase works.

Requirements:

- read-only;
- identify real entry points, modules/components, control flow, data flow, external dependencies, persistence, frontend/backend boundaries, and relevant tests when applicable;
- cite concrete repository paths;
- include a compact flow diagram when useful;
- include likely extension/change points without modifying them;
- never invent architecture.

## 5. Skills

Each skill must use valid Pi/Agent Skills frontmatter (`name`, specific `description`) and be reusable across stacks.

### `frontend-engineering`

Guide inspection and work around components/views, state, forms, API clients, loading/error/empty states, accessibility, reuse, frontend tests, lint/type/build checks. Do not assume a framework until repository evidence establishes it.

### `backend-engineering`

Guide work around routes/controllers/handlers, business logic boundaries, persistence, validation, auth/authz, errors, logging, migrations, API schemas, unit/integration tests, compatibility, and backend checks. Do not assume a language/framework until repository evidence establishes it.

### `fullstack-contracts`

Guide analysis of boundaries: request/response DTOs, schemas, OpenAPI, generated clients, shared types, status codes, validation changes, compatibility, and frontend consumers. Use whenever a change crosses service/UI boundaries.

## 6. Validation extension

Create one standalone extension at `extensions/engineering-harness.ts`.

Keep it small. Its job is deterministic validation discovery/execution, not orchestration of the whole agent.

It should expose an LLM-callable tool (name may be chosen during implementation) that supports at least:

- discovering configured/obvious validation checks;
- running a selected discovered check;
- returning structured status: `passed`, `failed`, `unavailable`, or `skipped`, plus command and exit code when executed.

### Explicit config

Support an optional target-project file named `.pi-harness.json` with a simple mapping such as:

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

Explicit config wins over discovery. The harness must still work without this file.

### Safe discovery

When config is absent, inspect repository evidence such as package-manager scripts/build/test config. Do not execute guessed commands merely because a language/framework is present. Keep discovery intentionally conservative for the MVP.

The extension must load independently and must not depend on other extensions.

## 7. Prompt-template requirements

Implement the four slash commands as Pi prompt templates with useful `description` and `argument-hint` frontmatter where supported.

All commands must reinforce:

- inspect before assuming;
- repository-native conventions;
- minimal scope;
- honest validation;
- no hallucinated repository state;
- cross-stack awareness where relevant;
- predictable concise output headings.

## 8. Human control

Require confirmation before genuinely high-impact actions such as destructive migrations/data loss, destructive Git operations, package publication, deployment, credential changes, or broad architectural rewrites.

Normal requested feature edits and tests should not produce unnecessary confirmation prompts.

The three read-only modes must stay read-only:

- `/review`
- `/explain`
- `/debug --diagnose-only`

## 9. Documentation

Create:

### `README.md`
Explain the problem, architecture, four commands, three skills, extension, install, and a quick start.

### `USAGE.md`
Give practical examples of every command, read-only vs modifying behavior, validation behavior, `.pi-harness.json`, HIL behavior, troubleshooting, and limitations.

### `DISTRIBUTION.md`
Explain how a coworker can use the same package through:

- local path installation;
- Git installation/version tags;
- optional npm publication later.

Use commands supported by the installed/current Pi version. Do not actually publish anything.

## 10. Verification

Create automated or fixture-based tests where useful and write `verification/verification-report.md` with exact checks and actual results.

Verify at least:

- package/resource discovery;
- extension loading;
- all four prompt templates are discoverable;
- all three skills are discoverable;
- validation config parsing;
- conservative discovery behavior with missing config;
- pass/fail/unavailable result handling;
- read-only workflow instructions for review/explain/diagnose-only;
- representative feature/review/debug/explain behavior to the extent it can be executed locally.

Clearly distinguish static verification from real end-to-end execution.

## 11. Definition of Done

The MVP is complete when:

- `PLAN.md` was written before implementation and maps this spec to the implementation;
- all four commands exist and are documented;
- all three skills exist and are reusable/stack-agnostic;
- the validation extension loads standalone and behaves conservatively;
- package metadata exposes extensions, skills, and prompts using valid Pi package conventions;
- documentation explains installation, daily use, sharing, and configuration;
- verification results are recorded truthfully;
- no unnecessary subagents, custom UI, deployment logic, or unrelated framework is introduced;
- no check is reported as passing unless it was actually executed successfully.
