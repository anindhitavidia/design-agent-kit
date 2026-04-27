---
description: >
  Use this when reviewing a React component for engineering/production quality.
  Triggers on: "Run QA on [component]", "Is [component] ready for handoff?",
  "Generate QA report for [component]".
---

# Component QA Skill

**Purpose:** Review any React component to engineering and production quality standard. Produces a `QA_REPORT.md` committed alongside the component.

**Who runs this:** Designers before handoff. Engineers before merging into production.

Every finding should be evaluated through both lenses: does it work correctly AND does it feel consistent with the design system?

---

## Severity Levels

Every finding in the QA report uses one of three severities:

```
BLOCKER   Must be fixed before handoff. Component cannot ship as-is.
          Examples: hardcoded values, broken keyboard nav, contrast failure,
                    missing ARIA on interactive elements, TypeScript errors

WARNING   Should be fixed. Acceptable to ship with documented rationale.
          Examples: minor Figma deviation, incomplete README section,
                    missing edge case, suboptimal but working implementation

PASS      Verified and correct. No action needed.
```

---

## Two-Gate Model

```
GATE 1 -- Design side (this skill)
  Automated checks, code quality, engineering readiness
  Claude Code runs this. No browser required.
  Pass -> component is ready to graduate via PR
      |
GATE 2 -- Engineering side
  Visual QA, keyboard, accessibility, axe scan
  Run in the real product environment, not the showcase
  Design intern + eng intern run this together before prod
  Pass -> component verified in production context
      |
PROD -- Bug Bash
  Final check as part of existing pre-launch process
```

**This skill covers Gate 1 only.** Steps 2, 3, 4 (visual, interaction, accessibility) run at Gate 2 in the engineering environment.

---

## Gate 1 Process

```
Step 0: Read Design Rules
    |   Read the design rules / spec for the component BEFORE any checks.
    |   This is the behavioral spec that defines what "correct" means for
    |   this component. Every finding in Steps 1, 5, and 6 is evaluated
    |   against what the design rules specify.
    |
    |   After reading, extract the key spec values and cross-reference against
    |   the actual implementation. Compare:
    |     - Border radius tokens (verify source uses the correct token)
    |     - Color tokens per variant (verify source matches spec)
    |     - Shadow values (verify source uses the correct value)
    |     - Spacing/padding values (verify source matches spec)
    |     - Motion timing/easing (verify source matches spec)
    |   Flag mismatches as WARNING (doc drift) or BLOCKER (if implementation uses wrong token).
    |
Step 1: Automated Checks
    |   Run linting, TypeScript type checking, and any design system lint rules
    |
Step 5: Code Quality Review
    |   Check for: cn() usage, no string concatenation, semantic tokens only,
    |   forwardRef pattern, displayName set, cva for variants, no hardcoded values
    |
Step 6: Engineering Readiness
    |   Check for: barrel export, README exists with content, index.ts re-exports,
    |   accessible ARIA attributes, keyboard navigation, touch targets (min 44x44px),
    |   reduced motion support (motion-reduce:transition-none)
    |
Step 7: Generate QA Report
    |   Create QA_REPORT.md alongside the component with all findings
    |
Verdict: Pass / Conditional Pass / Blocked
```

---

## Pre-flight Checklist

Locate the component:

```
[ComponentName]/
  [ComponentName].tsx
  README.md
  index.ts
  QA_REPORT.md        <- will be created/updated
```

Confirm before starting:

- [ ] Design Rules / spec exist for this component -- if missing, note as WARNING and proceed
- [ ] Figma URL documented in README or Design Rules -- if missing, note as WARNING and proceed
- [ ] README exists and has content -- if missing or placeholder only, BLOCKER: do not proceed

---

## Gotchas

**Tailwind, not CSS Modules.** This repo uses Tailwind CSS + CSS variables. All styling is via Tailwind classes in `.tsx` files.

**Barrel import rule.** Always import from the design system's barrel export (see `docs/context/design-system.md`). Never import from direct file paths like `../Button/Button`. Components importing from within the same package should import directly from the component path to avoid circular barrel imports.

**Button variant naming.** `variant="default"` is the primary style in Shadcn-based systems. There is typically no `variant="primary"` unless explicitly added.

**Dark mode token gaps.** Note any design tokens that are known-missing from the `.dark` block in your token file — do not flag pre-existing, documented gaps as new findings.

**Design rules path.** Always read the component's design rules / spec before QA. The design rules are the behavioral spec.

---

## QA Verdict (Gate 1)

**Pass:** Zero blockers. Warnings either fixed or documented. Ready to graduate.

**Conditional Pass:** Zero blockers. Warnings exist with documented rationale. Ready to graduate with open warnings noted in handoff docs.

**Blocked:** One or more blockers remain. Fix all blockers, re-run affected steps, update QA_REPORT.md, re-issue verdict.

---

## Animation-Only Changes After Graduation

If a graduated component's animation changes (timing, easing, spring values) but not its API (props), the process is lighter: run only the automated checks and code quality review, update QA_REPORT.md with a changelog entry, and open a graduation PR. Full QA re-run is only required for prop/API changes.

---

## Relationship to Other Skills

| Situation | Skill |
|-----------|-------|
| Building a new component | `component-builder` then this skill |
| Reviewing any component solo | This skill -- run independently any time |
| Graduating to production | This skill then handoff process |
