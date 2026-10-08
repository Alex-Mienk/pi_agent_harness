# Implementation Plan

Pi version inspected: `0.99.2`.

Pi documentation inspected for this MVP:

- `docs/packages.md` for package manifests and local/git/npm installation commands.
- `docs/prompt-templates.md` for Markdown slash-command frontmatter and argument substitution.
- `docs/skills.md` for Agent Skills frontmatter and directory layout.
- `docs/extensions.md` plus small extension examples for `ExtensionAPI`, `defineTool`, TypeBox parameters, and tool result shape.

## Requirement mapping

| SPEC requirement | Implementation files | Verification |
|---|---|---|
| Package named `pi-engineering-harness` exposing prompts, skills, one extension | `package.json` with `pi.extensions`, `pi.skills`, `pi.prompts`; conventional directories | `tests/run-tests.mjs` checks manifest and file existence |
| Four developer commands `/feature`, `/review`, `/debug`, `/explain` | `prompts/feature.md`, `prompts/review.md`, `prompts/debug.md`, `prompts/explain.md` | Static tests parse prompt frontmatter and required read-only / workflow text |
| `/feature` inspect-first, minimal change, relevant checks, reporting | `prompts/feature.md`; skills | Static tests for required instructions/headings |
| `/review` read-only, diff-first, concrete findings, no scores | `prompts/review.md` | Static tests for read-only and review evidence language |
| `/debug` diagnose-first, `--diagnose-only` read-only, `--fix` guarded | `prompts/debug.md` | Static tests for sequence and read-only diagnose-only language |
| `/explain` read-only, cite real paths, no invented architecture | `prompts/explain.md` | Static tests for read-only and citation/no-invention language |
| Three reusable stack-agnostic skills with valid Agent Skills frontmatter | `skills/frontend-engineering/SKILL.md`, `skills/backend-engineering/SKILL.md`, `skills/fullstack-contracts/SKILL.md` | Static tests parse frontmatter names/descriptions |
| Validation/discovery extension, deterministic and standalone | `extensions/engineering-harness.ts` | Dynamic tests import exported helpers and run fixture checks |
| `.pi-harness.json` explicit config wins | `extensions/engineering-harness.ts`; docs; example config | Fixture test creates `.pi-harness.json` and verifies parsed commands override package scripts |
| Conservative discovery without config | `extensions/engineering-harness.ts` | Fixture test verifies only declared package scripts are discovered and no guessed commands run |
| Run selected checks and return `passed`, `failed`, `unavailable`, `skipped` with command/exit code | `extensions/engineering-harness.ts` | Fixture tests run passing/failing shell commands and unavailable/skipped paths |
| Human control for high-impact actions; normal edits/tests no unnecessary prompts | Prompt templates and docs | Static tests for high-impact confirmation instruction |
| Documentation: README, USAGE, DISTRIBUTION | `README.md`, `USAGE.md`, `DISTRIBUTION.md`, `examples/pi-harness.example.json` | Static tests ensure docs exist and mention local/git/npm install and commands |
| Verification report with exact checks/results | `verification/verification-report.md` | Written after running tests and package load checks |

## Implementation notes and boundaries

- Keep the extension small: one LLM-callable tool named `engineering_validation` with actions `discover` and `run`.
- The extension is not an orchestrator; prompt templates instruct the agent when to use validation discovery/execution.
- Discovery is intentionally conservative: explicit `.pi-harness.json` first; otherwise only known validation scripts declared in `package.json` are returned.
- No subagents, custom UI, deployment automation, publishing, broad framework assumptions, or unrelated features.
- TypeScript extension uses host-provided Pi packages only, declared as peer dependencies rather than bundled dependencies.
