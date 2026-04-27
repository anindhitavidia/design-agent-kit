---
description: Orchestrates the 4-stage design sprint pipeline. Stages 1-2 produce briefs and specs; Stages 3-4 dispatch to the active stack profile. Reads design-kit.config.json for stackProfile and confirmBeforeStages.
---

# Design Sprint Runner

Orchestrates a design sprint end-to-end.

## Stages

## Stage pausing

Read `confirmBeforeStages` from `design-kit.config.json` (default: `true`).

- `true` — pause at every stage transition. Print what was produced, then ask the user to review and confirm before the next stage begins. **This is the default and recommended setting.**
- `false` — run all stages end-to-end without pausing. Only use this for automated or CI workflows.

At each pause, print:
```
Stage N complete. Artifacts written:
  - <file-path>
  - <file-path>

Review the files above, then reply "continue" (or "yes") to proceed to Stage N+1, or "stop" to save state and exit.
```

Do not proceed to the next stage until the user explicitly confirms.

## Stages

1. **Stage 1 — Data & Intent** (core)
   - Use `data-analyst` agent if GA4 or analytics are available.
   - Read `marketResearch` from `design-kit.config.json` (default: `"light"`):
     - `"off"` — skip market researcher entirely.
     - `"light"` — invoke `market-researcher` in Stage 1 Contribution Mode (training knowledge only, no web search, 200 words max).
     - `"full"` — invoke `market-researcher` with web search enabled for current competitive data.
   - Output: `<project-path>/01-data-intent.md` with R fields `stage: 1, project, intent_statement`.
   - Validate against `01-data-intent.schema.json`.
   - Update `STATUS.md` → `state: wip, last_stage: 01-data-intent`.
   - **If `confirmBeforeStages: true`:** pause here. Ask user to review `01-data-intent.md` before Stage 2.

2. **Stage 2 — Design Brief**
   - Use `ux-designer` agent for user flows and edge cases.
   - Use `product-designer` agent for business framing.
   - Output: `<project-path>/02-brief.md` (R: problem, target_users) AND `<project-path>/02-design-spec.md` (R: layout_pattern, components_needed).
   - Validate both against their schemas.
   - Update `STATUS.md` → `state: spec-ready, last_stage: 02-design-spec`.
   - **If `confirmBeforeStages: true`:** pause here. This is the critical review gate — the user should read `02-brief.md` and `02-design-spec.md` and confirm the design direction before any code is written. Make this explicit in the prompt.

3. **Stage 3 — Prototype** (dispatched to stack profile)
   - Read `design-kit.config.json` → `stackProfile`.
   - Invoke `/design-kit-{stackProfile}:prototype <project-path>`.
   - The stack profile updates `STATUS.md` → `state: prototype-ready, last_stage: 03-prototype`.
   - **If `confirmBeforeStages: true`:** pause here. Ask user to review the prototype before Stage 4.

4. **Stage 4 — Handoff Prep** (dispatched to stack profile)
   - Invoke `/design-kit-{stackProfile}:handoff-prep <project-path>`.
   - The stack profile writes `04-handoff/` and updates `STATUS.md` → `state: handed-off`.

## Resume logic

If `STATUS.md` exists, resume from `last_stage` rather than starting over. The orchestrator decides:
- `wip` → finish Stage 1 first
- `spec-ready` → run Stage 3
- `prototype-ready` → run Stage 4
- `handed-off` → ask the user if they want to re-run anything

## Validation

Before each stage, validate the prior stage's outputs against their schemas. If R-tier fields are missing, run a fix-loop: tell Claude what's missing, re-run the prior stage's agents to repair, then re-validate.

## Failure handling

- Schema validation failure → fix-loop with the prior stage's agents.
- Stack profile not installed → abort with clear instructions to install.
- User cancels at a confirm prompt → write current state to `STATUS.md` and exit gracefully.
