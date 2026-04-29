---
description: >
  Stage 4 of the design sprint for React/Next.js. Packages the prototype into a handoff folder
  with design spec, E2E scaffold, a11y report, screenshots, and handoff package metadata.
  Requires both a design brief and a built prototype.
  Invoke with /handoff-prep <project-path>.
---

# Handoff Prep Command

## Purpose

Produce the engineering handoff package. This runs after stakeholder sign-off on the prototype.
It audits the work and packages everything engineering needs to implement without a back-and-forth.

## Inputs

- `<project-path>` — path to the project folder. Must contain a built prototype (`page.tsx`,
  `_components/`, and a design brief).

## Steps

### 1. Parse the path argument

Argument: `<project-path>` — absolute or repo-relative path to the project folder.

If not provided, ask: "Which project to prepare handoff for? Provide the project folder path."

Read `design-kit.config.json` to resolve `<projectRoot>` and any path conventions.
Set `PROJECT_DIR` = the resolved project path.

### 2. Verify prerequisites

Check both exist:
- A design brief: `PROJECT_DIR/design-brief-*.md` or `PROJECT_DIR/01-brief.md`
- A prototype entry point: `PROJECT_DIR/page.tsx` (or equivalent)

If either is missing, stop and tell the user what's needed.

### 3. Generate design spec

If `PROJECT_DIR/design-spec-*.md` already exists, ask:
"Design spec already exists. Regenerate or keep existing? (regenerate / keep)"

If regenerate or no existing spec: run the `/design-spec` flow inline:
1. Read prototype code (all .tsx/.ts in PROJECT_DIR)
2. Cross-reference the target engineering repo (best-effort, from `design-kit.config.json`)
3. Generate `PROJECT_DIR/design-spec-[date].md`

### 4. Generate E2E scaffold

If `PROJECT_DIR/_e2e/` already exists, ask:
"E2E scaffold already exists. Regenerate or keep existing? (regenerate / keep)"

If regenerate or no existing scaffold: run the `/e2e-scaffold` flow inline:
1. Read the design spec's acceptance criteria
2. Cross-reference any existing e2e files in the target repo (best-effort)
3. Generate `PROJECT_DIR/_e2e/{fixtures,handlers,tests}/`

### 5. Run E2E tests (quality gate)

Run the generated E2E tests against the prototype:

```bash
npx playwright test PROJECT_DIR/_e2e/
```

(Or use the repo's configured test script if different.)

**This is a gate — all tests must pass before handoff proceeds.**

If tests fail, categorize each failure:

1. **Prototype bug** — the prototype doesn't implement the spec correctly.
   → Fix the prototype code, re-run tests.

2. **Selector mismatch** — the test uses a selector that doesn't match the actual UI.
   → Fix the test selector (use real content from `_data/` files, scope to containers).

3. **Known limitation** — a feature that genuinely can't be tested in the prototype
   (e.g., tenant state not persisted across navigation).
   → Mark the test as `test.skip()` with a comment explaining the limitation.

Report to the user:
- "E2E tests: [N] passed, [M] failed, [K] skipped"
- For each failure: which category it is and what needs fixing

**Stop and fix all failures before continuing.** Once all tests pass (or are explicitly
skipped with documented reasons), proceed to the next step.

### 6. Run automated design QA

Invoke the `qa-designer` agent:

> "Run a Playwright capture against the prototype at [prototype URL] and evaluate categories 1–6
> against the project's design system rules (read docs/context/design-system.md).
> Evaluate: Visual Fidelity, Responsive, Dark Mode, Accessibility, Interaction States, Performance.
> Report back: critical/warning/pass counts and top 3 findings."

If any **critical findings** are reported:
→ Pause and tell the user: "Design QA found [N] critical issue(s): [list top findings].
Resolve these before handoff, then re-run `/handoff-prep <project-path>`. (stopping here)"
→ Stop — do not continue to further steps.

If warnings only or all pass: continue to the next step.

### 7. Resolve today's date

Get today's date in YYYY-MM-DD format.

### 8. Run UX edge-case audit

Invoke a UX-focused agent (or the `qa-designer` agent for UX categories):

> "Audit the prototype for [project] at: PROJECT_DIR/
> Read the design brief at: PROJECT_DIR/[brief file]
> Run your full edge case taxonomy: empty, error, loading, permission, limit, conflict,
> offline, undo/recovery, AI confidence gap, stale data states (where applicable).
> Output your full review format."

### 9. Run brand audit

Invoke the `brand-guardian` agent:

> "Audit the prototype for [project] for brand and token compliance.
> Read: PROJECT_DIR/
> Read: docs/context/brand.md and docs/context/design-system.md
> Check: token usage (no hardcoded values), visual consistency, dark mode coverage, motion compliance.
> Output your full review format."

### 9b. Run code review

Run a code review on the prototype code as a final quality gate.

If Critical findings remain: stop and report — "Code review found [N] critical issues that must be fixed before handoff: [list]. Fix these and re-run /handoff-prep."

If Important/Advisory only: include findings in the handoff package under a "Code Quality Notes" section so engineering is aware.

### 10. Assemble handoff package

Write `PROJECT_DIR/04-handoff/handoff-package.md` (or `PROJECT_DIR/HANDOFF.md` if the project uses flat layout):

```markdown
# [Project Name] — Engineering Handoff

**Prepared:** [YYYY-MM-DD]
**Status:** Ready for engineering review

---

## What This Is

[One paragraph from the design brief's strategic recommendation]

## Key Design Decisions

[3-5 bullet points from the brief's business + user problem sections]

## Prototype

Live at: [dev server URL / prototype route]
Code at: `PROJECT_DIR/`

## Design Spec

Full spec: `design-spec-YYYY-MM-DD.md`
- [N] acceptance criteria defined
- File mapping: [N] prototype files → target repo equivalents
- Component mapping: [N] UI elements → DS components

## E2E Test Scaffold

Location: `_e2e/`
- Fixtures: `_e2e/fixtures/<feature>.ts` ([N] factory functions)
- Handlers: `_e2e/handlers/<feature>.ts` ([N] procedure mocks)
- Tests: `_e2e/tests/<feature>.spec.ts` ([N] test scenarios)
- **Results: [N] passed, [M] skipped, 0 failed** (validated against prototype)
- Skipped tests: [list any skipped tests with reasons, or "none"]
- Target: merge into target repo's e2e/ — see file headers for merge instructions

## UX Audit Results

[From UX audit — edge cases, blockers, recommendations]

## Brand Audit Results

[From brand-guardian — token issues, promotion candidates]

## Design QA Results

[Overall status, critical/warning counts]

## Code Quality Notes

[From code review — Important/Advisory findings engineering should be aware of]

## Open Questions

[Any unresolved items from either audit]

## Links

- Design brief: `PROJECT_DIR/[brief file]`
- Design spec: `PROJECT_DIR/design-spec-[date].md`
- E2E scaffold: `PROJECT_DIR/_e2e/`
```

### 11. Update STATUS.md

If `PROJECT_DIR/STATUS.md` exists, update it:
- State: `handed-off`
- Last stage: `04-handoff`
- Last run: [ISO timestamp]

### 12. Confirm completion

Tell the user:
- Handoff package location
- Any blockers from either audit that should be resolved before engineering picks it up
- Reminder to notify the engineering team
