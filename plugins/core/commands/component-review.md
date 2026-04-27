---
name: component-review
description: >
  Reviews a component for design system readiness.
  Checks HANDOFF.md completeness, all required states, dark mode, accessibility, and
  implementation readiness. Uses the component-reviewer agent and reads docs/context/design-system.md.
  Invoke with /component-review [component-path].
---

# Component Review Command

## Steps

### 1. Parse the component path

If not provided, ask: "Which component to review? Provide the path to its directory."

### 2. Read design system context

Read `docs/context/design-system.md` to understand the project's component standards, token system,
and implementation expectations (e.g., Tailwind config, Shadcn conventions, forwardRef patterns).

### 3. Verify HANDOFF.md exists

Check for `[component-path]/HANDOFF.md`.

If not found: stop and tell the user —
"No HANDOFF.md found at [path]. Create a HANDOFF.md before running component review.
Required sections: Status, Overview, Variants, States, Token Mapping, Dark Mode,
Responsive Behavior, Accessibility, Do/Don't, Engineering Notes."

### 4. Delegate to component-reviewer

Invoke @component-reviewer with:

> "Review the component at [path] for design system readiness.
> Reference docs/context/design-system.md for token naming, component standards, and implementation conventions.
> Check: HANDOFF.md completeness (all required sections filled in, not just present),
> all component states documented (default, hover, focus, active, disabled, error, loading),
> dark mode fully specified with correct semantic token mappings,
> accessibility annotations present (role, aria labels, keyboard nav),
> design tokens used (no hardcoded values),
> implementation hints present (e.g., Tailwind classes, Shadcn base, composition pattern),
> engineering readiness — could an engineer implement from HANDOFF.md alone without back-and-forth?
> Output your full review format including Readiness Status."

### 5. Write review report

Get today's date in YYYY-MM-DD format.
Write the review report to `[component-path]/component-review-[YYYY-MM-DD].md`.

### 6. Confirm completion

Tell the user:
- Readiness Status (Ready / Not Ready)
- Blocker issues to fix before the component can be promoted
- Next step: if Ready → promote the component; if Not Ready → fix blockers first
