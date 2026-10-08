# Backend harness

## Problem



## Solution

Build a standalone pi coding agent with a few key features.



## Variables

- `PROJECT_ROOT: /Users/indydevdan/Documents/projects/yt/self-compact`
- `PI_AGENT_AI_DOCS_DIR: <PROJECT_ROOT>/ai_docs/`, read-only.
- `PLAN_DIR: <PROJECT_ROOT>/specs/<name-of-model-or-agent>/`
  - Save your own plan here.
- `YOUR_WORKING_DIR: <PROJECT_ROOT>/apps/<name-of-model-or-agent>/`
  - Save your work here.

## Workflow

1. Plan. Use the `/planf3` skill to create an implementation plan from these requirements and `PI_AGENT_AI_DOCS_DIR`. Save the completed plan in `PLAN_DIR/` before writing implementation code.

2. Build. After the plan is written, follow `/planf3`'s build step to implement that plan inside `YOUR_WORKING_DIR`. Do not skip straight from this prompt to implementation.

3. Verify. Check every item in Definition Of Done, fix failures, and rerun the affected checks. Keep final verification artifacts inside `YOUR_WORKING_DIR` and report actual results and any remaining blockers.

## Definition Of Done

### Workflow Complete

- Your completed `/planf3` implementation plan exists in `PLAN_DIR/`.
  - It was written before implementation, and the build followed its build step.
- `YOUR_WORKING_DIR/extensions/self-compact/self-compact.ts` loads as a standalone extension, with small helpers as needed and no dependency on other extensions.


### User Interface


### Prompt Engineering



### Launch Commands


### HIL Commands

- Slash commands are available.


## How You're Graded

- You'll be graded on a continuous basis based on every completed bullet in the definition of done.
- Every step of Workflow must be fully accomplished: plan, build and verify.
- Instant failure if you write project deliverables outside your `YOUR_WORKING_DIR` with the exception of `PLAN_DIR`