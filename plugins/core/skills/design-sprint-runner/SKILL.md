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
   - Invoke `ux-designer` in **research mode** (qualitative signals only — not full design work):
     > "Contribute the Qualitative Signals section to `01-data-intent.md` for [project]. Focus on persona-grounded observations and user signals. This is research intake, not a full UX analysis — that comes in Stage 2."
   - Output: `<project-path>/01-data-intent.md` with R fields `stage: 1, project, intent_statement`.
   - Validate against `01-data-intent.schema.json`.
   - Update `STATUS.md` → `state: wip, last_stage: 01-data-intent`.
   - **If `confirmBeforeStages: true`:** pause here. Ask user to review `01-data-intent.md` before continuing.

1.5. **Stage 1.5 — Ideation** (optional)
   - After Stage 1 pause is confirmed, ask once: "Want to explore design directions before writing the brief? Useful for complex or ambiguous projects. (brainstorm / skip to brief)"
   - If the sprint's `STATUS.md` has `ideation: done`, skip without asking.
   - **If brainstorm:** invoke the `brainstorming-design` skill with this context:
     > "We're exploring design directions for [project]. Research intake is at `01-data-intent.md` — read it for signals and competitive context. Explore the problem space, challenge assumptions, surface non-obvious directions, and help decide which approach to take before committing to a design brief."
     When brainstorming concludes, write `ideation: done` to `STATUS.md`.
     **If `confirmBeforeStages: true`:** pause here. Ask user to review explored directions before Stage 2.
   - **If skip:** proceed directly to Stage 2.

2. **Stage 2 — Design Brief**
   - Use `ux-designer` agent for user flows and edge cases.
   - Use `product-designer` agent for business framing.
   - Output: `<project-path>/02-brief.md` (R: problem, target_users) AND `<project-path>/02-design-spec.md` (R: layout_pattern, components_needed).
   - Validate both against their schemas.
   - Update `STATUS.md` → `state: spec-ready, last_stage: 02-design-spec`.
   - **If `confirmBeforeStages: true`:** pause here. This is the critical review gate — the user should read `02-brief.md` and `02-design-spec.md` and confirm the design direction before any code is written. Make this explicit in the prompt.

2.5. **Stage 2.5 — Design Explore** (diverge pass)
   - Invoke the `design-explore` skill with the locked spec as input.
   - The skill generates 2-3 lightweight design directions that challenge and extend the brief — each with a distinct layout/interaction pattern, named DS components, and a trade-off summary.
   - If the active stack profile has a `design-explore` command, dispatch to it to build cheap throwaway implementations in the browser (real DS components, no tests, no polish).
   - Output: `<project-path>/02.5-design-explore.md` with all options and (after user picks) `## Chosen Direction`.
   - **Always pause here** regardless of `confirmBeforeStages` — direction selection requires human judgment. Ask: "Which direction (or hybrid) should we take into prototyping? You can also say 'revise the brief first'."
   - Record the chosen direction and any brief modifications in `02.5-design-explore.md`.
   - Delete `explorations/` throwaway files after direction is chosen.
   - Update `STATUS.md` → `state: explore-done, last_stage: 02.5-design-explore`.

3. **Stage 3 — Prototype** (dispatched to stack profile)
   - Read `design-kit.config.json` → `stackProfile`.
   - Pass the chosen direction from `02.5-design-explore.md` as context.
   - Invoke `/design-kit-{stackProfile}:prototype <project-path>`.
   - The stack profile updates `STATUS.md` → `state: prototype-ready, last_stage: 03-prototype`.
   - **If `confirmBeforeStages: true`:** pause here. Ask user to review the prototype before Stage 3.5.

3.5. **Stage 3.5 — Design Iterate** (stakeholder review loop)
   - Run `design-qa` automatically on the prototype URL (if available).
   - **Always pause here** regardless of `confirmBeforeStages` — stakeholder sign-off is required before handoff.
   - Present the design-qa report and ask: "Share stakeholder feedback, or confirm sign-off to proceed to handoff prep."
   - If feedback is provided:
     - Log it in `STATUS.md` under `## Iteration Log` with date and summary.
     - Invoke the relevant agents to address the feedback (ux-designer, design-engineer, qa-designer).
     - Re-run `design-qa` after fixes.
     - Pause again: "Changes made. Ready to proceed, or more revisions needed?"
     - Repeat until explicit sign-off.
   - Update `STATUS.md` → `state: review-approved, last_stage: 03.5-design-iterate`.

4. **Stage 4 — Handoff Prep** (dispatched to stack profile)
   - Invoke `/design-kit-{stackProfile}:handoff-prep <project-path>`.
   - The stack profile writes `04-handoff/` and updates `STATUS.md` → `state: handed-off`.

## Resume logic

If `STATUS.md` exists, resume from `last_stage` rather than starting over. The orchestrator decides:
- `wip` → finish Stage 1 first, then check ideation
- `wip` + `ideation: done` → skip ideation, proceed to Stage 2
- `spec-ready` → run Stage 2.5 (design explore)
- `explore-done` → run Stage 3 (prototype)
- `prototype-ready` → run Stage 3.5 (design iterate / stakeholder review)
- `review-approved` → run Stage 4 (handoff prep)
- `handed-off` → ask the user if they want to re-run anything

## Validation

Before each stage, validate the prior stage's outputs against their schemas. If R-tier fields are missing, run a fix-loop: tell Claude what's missing, re-run the prior stage's agents to repair, then re-validate.

## Failure handling

- Schema validation failure → fix-loop with the prior stage's agents.
- Stack profile not installed → abort with clear instructions to install.
- User cancels at a confirm prompt → write current state to `STATUS.md` and exit gracefully.
