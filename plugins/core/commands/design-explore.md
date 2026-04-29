---
description: >
  Stage 2.5 of the design sprint — stress-tests the design brief by generating adversarial
  variants (double-down / adjacent / invert) and reporting a validate / revise / reject signal.
  Can be run standalone or invoked by the sprint runner. Usage: /design-kit:design-explore <project-path>
---

# /design-kit:design-explore

Stress-test a design brief before prototyping. Generates 3 adversarial variants, ranks them
against the brief's committed direction, and reports a validate / revise / reject signal.

## Steps

### 1. Parse the path argument

Argument: `<project-path>` — path to the project folder.
If not provided, ask: "Which project to explore? Provide the project folder path."

Read `design-kit.config.json` to resolve `<projectRoot>` and `stackProfile`.
Set `PROJECT_DIR` = the resolved project path.

### 2. Resolve today's date

Get today's date in YYYY-MM-DD format.

### 3. Verify design brief exists

Check for: `PROJECT_DIR/design-brief-*.md` (use the most recent by date).

If not found: stop —
"No design brief found for this project. Run `/design-kit:design-brief` first — exploration
needs a committed direction to diverge from."

Use the most recent brief by date.

### 4. Load the design-explore skill

Load `.claude/plugins/design-kit/skills/design-explore/SKILL.md`,
`references/stances.md`, and `references/variant-fidelity.md`.

Follow the skill's Flow exactly.

### 5. Extract the committed direction

From the brief, extract the committed direction in one sentence: "The brief commits to
[approach] because [reason]."

If no clear direction exists: stop —
"Brief doesn't commit to a direction. Run brainstorming first, or sharpen the brief before
running Explore."

### 6. Dispatch variants

If `stackProfile` is set and the stack profile has a `design-explore` command:
- Invoke `/design-kit-{stackProfile}:design-explore <project-path>` with the committed
  direction and stance templates from `references/stances.md`.
- The stack profile builds variants in `PROJECT_DIR/_variants/[date]/[stance-name]/`.

If no stack profile or `discovery-only`:
- Generate text-based direction descriptions (prose layout + DS component list + trade-off).
- Write to `PROJECT_DIR/02.5-design-explore.md`.

### 7. Delegate ranking to @design-critic

**If stack profile is active** (variants were built):
Invoke `@design-critic`:

> "Rank the [N] variants for [project] against the design brief.
> Brief: [brief path]
> Variants: [list variant paths]
> Write your scorecard to: [variant-dir]/scorecard.md
> Follow your standard scoring procedure.
> Report back: signal (VALIDATE/REVISE/REJECT/UNDER-SPECIFIED), winner name, score, and top 3 adjustments needed."

Wait for the critic to confirm the scorecard is written.

**If no stack profile** (text-based directions only):
Evaluate the directions inline against the brief. Use the scoring dimensions from the
`design-critic` agent instructions (brief alignment, user outcome, DS compliance, craft,
stance). Assign a score 0–20 per direction and determine the signal. Write the scorecard
directly to `PROJECT_DIR/02.5-design-explore.md`.

Signal mapping:
| Winner | Signal |
|---|---|
| Double-down | **VALIDATE** — brief is sound, proceed to prototype with confidence |
| Adjacent | **REVISE** — brief is close but miscalibrated, update before prototype |
| Invert | **REJECT** — brief's core premise may be wrong, return to brainstorming |
| All directions weak | **UNDER-SPECIFIED** — brief needs sharpening |

### 8. Present to user

Report:
- The critic signal (VALIDATE / REVISE / REJECT / UNDER-SPECIFIED)
- The winning variant and a one-line summary of why it won
- What the designer should do next based on the signal
- Location of variants: `PROJECT_DIR/_variants/[date]/` (gitignored, not canonical)

End with:
> "Variants are in `_variants/[date]/` — gitignored, not canonical. Decide which direction
> to take, then run `/design-kit:prototype` to build the winning direction as a real prototype."
