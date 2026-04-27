---
description: >
  Stage 3 of the design sprint for React/Next.js. Reads the design brief and scaffolds a
  working Next.js prototype at <project-path>. Wires it into the domain index page if applicable.
  Invoke with /prototype <project-path>.
---

# Prototype Command

## Purpose

Build a production-quality React prototype that engineers can review and adapt for production.
The design brief is mandatory input — this command will not proceed without one.

## Inputs

- `<project-path>` — path to the project folder, e.g. `design-kit/projects/sso-rollout/`.
  The folder must contain a design brief (`design-brief-*.md` or `01-brief.md`).

## Steps

### 1. Parse the path argument

Argument: `<project-path>` — absolute or repo-relative path to the project folder.

If not provided, ask: "Which project to prototype? Provide the project folder path."

Read `design-kit.config.json` to resolve `<projectRoot>` and any path conventions.
Set `PROJECT_DIR` = the resolved project path.

### 2. Resolve today's date

Get today's date in YYYY-MM-DD format.

### 3. Verify design brief exists

Check for: `PROJECT_DIR/design-brief-*.md` or `PROJECT_DIR/01-brief.md`

If not found: stop and tell the user —
"No design brief found for this project. Create a design brief first."

If found: use the most recent by date in the filename.

### 3b. Detect data-heavy brief

Scan the design brief for data visualization signals:

**Keywords:** `dashboard`, `chart`, `graph`, `analytics`, `metrics`, `KPI`, `reporting`, `data visualization`, `trend`, `funnel`, `utilization`, `spend`, `deflection rate`

**Design spec patterns:** mentions of chart types, metric displays, data tables with trends, or dashboard layouts.

**If data-heavy signals found:**

Suggest to the user: "This brief has data visualization signals. Consider using `/data-viz <project-path>` instead, which uses a specialized data-viz-engineer agent optimized for dashboard and chart work."

If the user confirms to proceed with `/prototype` anyway, or if there are only minor data signals, continue to step 4 and handle chart areas with placeholder comments:
- Leave `{/* CHART: [description] */}` comments where data visualizations should go
- Note in the completion message that chart placeholders exist and suggest running `/data-viz` to fill them

**If no data signals:** proceed to step 4.

### 4. Read context

Read all available context before building:
- `docs/context/design-system.md` — component library, import paths, token system
- `docs/context/coding-rules.md` or `CODING_GUIDELINES.md` — coding conventions
- The design brief fully

### 5. Build the prototype

Using the `frontend-design` skill, generate the prototype:

- `PROJECT_DIR/page.tsx` — entry point, server component by default
- `PROJECT_DIR/_components/<Name>.tsx` — local components
- `PROJECT_DIR/_lib/` — local helpers (translations, utils, mock data)
- `PROJECT_DIR/_data/` — mock data files (typed, matching expected API shapes)

Follow all standards from `docs/context/design-system.md`:
- Use design system components for all UI elements
- Apply design tokens (no hardcoded colors, spacing, or typography)
- Wire into any domain index page if the project structure requires it

### 5b. Wire into domain index (if applicable)

If the project folder sits within a multi-project domain structure, wire the prototype route
into the parent domain's index page or navigation, per the conventions in `design-kit.config.json`.

### 6. Run code review

Load `.claude/skills/code-reviewer/SKILL.md` (if available) and check the prototype against
coding guidelines from `docs/context/coding-rules.md`.

If Critical findings exist: fix them before proceeding.
If Important/Advisory findings exist: include them in the completion message.

### 6a. Run design system enforcement check

If the project has a DS enforcement script (e.g., `npm run review:ds`), run it:

```bash
npm run review:ds
```

If violations are found in the prototype files:
- Fix raw HTML element violations (these would block CI)
- Review structural warnings
- Re-run until errors are clean (warnings are non-blocking but should be reviewed)

This catches DS violations that the code review skill may miss. Do not skip if the script exists.

### 6b. Update STATUS.md

If `PROJECT_DIR/STATUS.md` exists, update it:
- State: `prototype-ready`
- Last stage: `03-prototype`
- Last run: [ISO timestamp]
- Next action: "Stakeholder review needed before handoff"

If STATUS.md doesn't exist, create it with this initial state.

### 6c. Write prototype notes

Write `PROJECT_DIR/03-prototype-notes.md` documenting:
- Components used (and their import paths)
- Components newly created
- Mock data assumptions
- Known gaps from the spec (anything skipped or simplified)

### 7. Confirm completion

Tell the user:
- Prototype route / location
- Components built and states covered
- Any data visualization placeholders left (if data-heavy brief was detected)
- Any WARNINGs from the code review
- Reminder: "Run `/design-qa <url>` to validate, then get stakeholder sign-off before `/handoff-prep <project-path>`"
