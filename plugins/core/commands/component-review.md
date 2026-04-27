---
description: Audit a component against the project's design-system standards. Uses the component-reviewer agent and reads docs/context/design-system.md.
---

# /design-kit:component-review

## Usage

`/design-kit:component-review <component-name-or-path>`

## Behavior

1. Parse the required `<component-name-or-path>` argument.
   If not provided, ask: "Which component to review? Provide a name or path."
2. Read `docs/context/design-system.md` for the project's component standards.
3. Use the `component-reviewer` agent to audit the component.
4. Check:
   - API consistency
   - Accessibility (roles, aria labels, keyboard navigation)
   - Visual fidelity to design system
   - Token usage (no hardcoded values)
   - Test coverage
5. Output: readiness score, blockers, recommendations, suggested next steps.
