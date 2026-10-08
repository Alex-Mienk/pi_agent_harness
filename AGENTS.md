# Repository instructions

This repository is a reusable Pi coding-agent package. Read `SPEC.md` before implementation.

## Required workflow

1. Inspect this repository and the installed Pi version/API as needed.
2. Write `PLAN.md` before creating implementation files. The plan must map every requirement in `SPEC.md` to files and verification steps.
3. Implement the plan in this repository only.
4. Verify the package and record actual results in `verification/verification-report.md`.
5. Fix failures and rerun affected checks before finishing.

## Engineering rules

- Keep the MVP small. Do not add subagents, a custom UI, deployment automation, or unrelated features.
- Prefer Pi's native package mechanisms: prompt templates, skills, and one TypeScript extension.
- Do not invent Pi APIs. Check the installed Pi version, local package/source information, or current official documentation when API details are uncertain.
- `/review`, `/explain`, and `/debug --diagnose-only` must be read-only with respect to the target project's source files.
- Never claim a check passed unless it actually ran and returned success.
- Never invent target-project files, commands, frameworks, or conventions.
- The harness must prefer target-repository evidence over generic best practices.
- Do not publish packages, push Git branches, deploy, or perform destructive actions.
- Keep dependencies minimal.
- Do not modify `SPEC.md` to make implementation easier. If a requirement must change for compatibility with the installed Pi version, document the deviation in `PLAN.md` and the verification report.
