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
   - Output: one file `<project-path>/design-brief-[date].md` covering both the problem
     framing (problem statement, target users, success criteria, constraints) AND the design
     direction (layout pattern, components needed, interactions, states). These belong in one
     document — there is no separate `02-design-spec.md` at this stage.
   - Validate against `brief.schema.json` (R: stage, project, problem, target_users).
   - Update `STATUS.md` → `state: spec-ready, last_stage: 02-brief`.
   - **If `confirmBeforeStages: true`:** pause here. This is the critical review gate — the
     user should read `design-brief-[date].md` and confirm the direction before any code is
     written. Make this explicit in the prompt.

   Note: `design-spec-[date].md` (file mappings, component inventory, acceptance criteria) is
   the engineering handoff artifact produced in Stage 4 by `/design-kit:design-spec` — it is
   NOT a Stage 2 output.

2.5. **Stage 2.5 — Design Explore** (optional, adversarial brief stress-test)

   Check `STATUS.md` for `explore: yes/no/done`.
   - If `done`: skip this stage entirely.
   - If `yes` or `no`: use that value without asking.
   - If not set: ask once — "Stress-test the brief before prototyping? Runs 3 challenge variants
     (double-down / adjacent / invert) against the brief's committed direction and reports
     validate / revise / reject. (yes / skip to prototype)"
     Save the answer to `STATUS.md` under Sprint Config: `explore: [yes/no]`

   If explore = yes:
   1. Invoke the `design-explore` skill. The skill stress-tests the brief's committed direction
      by generating 3 adversarial variants (double-down / adjacent / invert). If the active
      stack profile has a `design-explore` command, dispatch to it to build cheap throwaway
      implementations (real DS components, no tests, no polish) in `<project-dir>/_variants/[date]/`.
   2. After variants are built, rank them against the brief and produce a scorecard + critic signal.
   3. When the critic signal is ready, write `explore: done` to `STATUS.md`.
   4. **Handle the critic signal** (always pause here regardless of `confirmBeforeStages`):

      **Signal: VALIDATE** (double-down won) → brief is sound. Pause:
      > "Explore validated the brief. The committed direction held up at its strongest form.
      > Continue to Stage 3 (prototype) with confidence. (continue / stop here)"

      **Signal: REVISE** (adjacent won) → brief needs calibration. Pause:
      > "Explore signals **REVISE**. The adjacent direction outperformed the brief's committed
      > direction: [adjacent direction summary]. Recommend updating the brief before prototyping.
      >
      > Options:
      > - `revise brief` — re-enter Stage 2, carry the adjacent direction into the updated brief
      > - `ignore and continue` — proceed to Stage 3 with the original brief
      > - `stop here` — pause for discussion"

      If `revise brief`: reset Stage 2 + Stage 2.5 status in `STATUS.md` (uncheck both, set
      `explore: yes`). Loop back to Stage 2 with a note: "Previous brief was stress-tested;
      critic recommended adjacent direction: [summary]. Incorporate this in the updated brief."

      **Signal: REJECT** (invert won) → brief's premise may be wrong. Pause:
      > "Explore signals **REJECT**. The inverted direction outperformed — the brief's core
      > premise may be wrong: [inverted premise summary]. Recommend returning to brainstorming.
      >
      > Options:
      > - `restart ideation` — reset Stages 1.5, 2, 2.5 and re-open brainstorming with the
      >   inverted premise as a starting point
      > - `ignore and continue` — proceed to Stage 3 with the original brief
      > - `stop here` — pause for discussion"

      If `restart ideation`: uncheck Stages 1.5, 2, 2.5 in `STATUS.md`, clear `ideation: done`
      and `explore: done` (back to `ideation: yes` and `explore: yes`), loop back to Stage 1.5
      with note: "Previous brief was rejected by stress-test; inverted premise: [summary]. Use
      this as a starting point for re-ideation."

      **Signal: UNDER-SPECIFIED** (all variants weak) → brief too vague to stress-test. Pause:
      > "Explore signals **UNDER-SPECIFIED**. No variant could land — the brief doesn't commit
      > to a sharp enough direction to stress-test. Sharpen the brief, then re-run Stage 2.5.
      > (revise brief / stop here)"

      If `revise brief`: reset Stage 2 + Stage 2.5 status in `STATUS.md`, set `explore: yes`,
      loop back to Stage 2 with note: "Previous brief was under-specified — sharpen the committed
      direction and success criteria."

   If explore = no: proceed directly to Stage 3.

3. **Stage 3 — Prototype** (dispatched to stack profile)
   - Read `design-kit.config.json` → `stackProfile`.
   - Pass the chosen direction from `02.5-design-explore.md` as context.
   - Invoke `/design-kit-{stackProfile}:prototype <project-path>`.
   - The stack profile updates `STATUS.md` → `state: prototype-ready, last_stage: 03-prototype`.
   - **If `confirmBeforeStages: true`:** pause here. Ask user to review the prototype before Stage 3.5.

3.5. **Stage 3.5 — Design Iterate** (score-based polish pass, on by default)

   Check `STATUS.md` for `iterate: yes/no/done`.
   - If `done`: skip this stage entirely.
   - If `no`: skip this stage.
   - If `yes` or not set (default): run the iteration. If not set, write `iterate: yes` to `STATUS.md`.

   If iterate = yes:
   1. Verify the prototype is accessible (local dev server or rendered URL from `STATUS.md`).
      If not reachable: tell the user — "Dev server not reachable. Start it, then resume the sprint.
      (stop here)"
   2. Invoke the `design-iterate` skill (or `/design-kit:design-iterate <project-path>` if invoked
      as a standalone command). The skill runs a score-based loop: design-qa → pick ONE finding →
      fix → re-score → keep or revert. Stops when zero critical findings, plateau, or max rounds.
   3. When iterate reports, write `iterate: done` to `STATUS.md`.
   4. **Always pause here** regardless of `confirmBeforeStages` — stakeholder sign-off is required
      before handoff prep. Present the polish results:
      > "Polish pass complete. Starting score: [X], final score: [Y].
      > [N] findings fixed, [M] need your judgment (see iterate log at `_qa/iterate-log-[date].md`).
      > Stakeholder review needed before handoff prep.
      > When sign-off is received, continue the sprint."
   5. Wait for explicit stakeholder sign-off. Do NOT auto-proceed to Stage 4.
   6. Update `STATUS.md` → `state: review-approved, last_stage: 03.5-design-iterate`.

4. **Stage 4 — Handoff Prep** (dispatched to stack profile)
   - Invoke `/design-kit-{stackProfile}:handoff-prep <project-path>`.
   - The stack profile writes `04-handoff/` and updates `STATUS.md` → `state: handed-off`.

## Resume logic

If `STATUS.md` exists, resume from `last_stage` rather than starting over. The orchestrator decides:
- `wip` → finish Stage 1 first, then check ideation
- `wip` + `ideation: done` → skip ideation, proceed to Stage 2
- `spec-ready` → check Sprint Config: `explore: yes/no` — run Stage 2.5 or skip to Stage 3
- `explore-done` → run Stage 3 (prototype)
- `prototype-ready` → check Sprint Config: `iterate: yes/no` — run Stage 3.5 or skip to sign-off pause
- `review-approved` → run Stage 4 (handoff prep)
- `handed-off` → ask the user if they want to re-run anything

## Validation

Before each stage, validate the prior stage's outputs against their schemas. If R-tier fields are missing, run a fix-loop: tell Claude what's missing, re-run the prior stage's agents to repair, then re-validate.

## Failure handling

- Schema validation failure → fix-loop with the prior stage's agents.
- Stack profile not installed → abort with clear instructions to install.
- User cancels at a confirm prompt → write current state to `STATUS.md` and exit gracefully.
