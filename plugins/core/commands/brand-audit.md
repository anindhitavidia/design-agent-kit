---
description: Audit a component, page, or codebase for brand consistency. Uses the brand-guardian agent and reads docs/context/brand.md and docs/context/design-system.md.
---

# /design-kit:brand-audit

## Usage

`/design-kit:brand-audit [<path-or-component-name>]`

## Behavior

1. Parse the optional target argument (a file, directory, or component name).
   If not provided, audit the most recently modified files.
2. Read `docs/context/brand.md` and `docs/context/design-system.md`.
3. Use the `brand-guardian` agent to review the target.
4. Check:
   - Token usage (no hardcoded colors, correct semantic tokens)
   - Typography consistency
   - Spacing and layout alignment with brand principles
   - Voice and copy tone (if content is present)
5. Output a report: compliant items, violations, recommendations.

## Scope

If no target is given, audit the most recently modified files.
