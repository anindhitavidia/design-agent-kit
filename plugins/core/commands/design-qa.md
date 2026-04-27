---
description: Run visual, accessibility, and performance QA on a rendered URL. Uses the qa-designer agent and the active stack profile's QA tooling.
---

# /design-kit:design-qa

## Usage

`/design-kit:design-qa <url>`

## Behavior

1. Parse the required `<url>` argument. If missing, ask: "Which URL should I run design QA on?"
2. Use the `qa-designer` agent to inspect the URL.
3. Run through the full QA checklist:
   - Visual fidelity against `02-design-spec.md` (if a project context is given)
   - Accessibility (WCAG 2.1 AA minimum)
   - Performance (Core Web Vitals)
   - Responsive layout at 375px, 768px, 1280px
4. Output a structured report with sections: Visual, Accessibility, Performance, Responsive.
5. Flag blockers (must fix before handoff) vs warnings (should fix).

## Optional flags

`--project <project-path>` — compare against the project's design spec (`02-design-spec.md`) for visual fidelity checking.
