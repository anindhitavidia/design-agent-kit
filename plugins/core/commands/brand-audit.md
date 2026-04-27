---
name: brand-audit
description: >
  Audit a component, page, or codebase for brand and token compliance.
  Uses the brand-guardian agent and reads docs/context/brand.md and docs/context/design-system.md.
  Invoke with /brand-audit [path-or-component-name].
---

# Brand Audit Command

## Steps

### 1. Parse the component path

The argument is a path to the component directory or file, relative to the repo root.
e.g. `src/components/button` or a project path from `design-kit.config.json`.

If not provided, ask: "Which component or prototype to audit? Provide the path."

### 2. Read brand and design system context

Read the following before invoking the agent:
- `docs/context/brand.md` — brand identity, tone, visual principles
- `docs/context/design-system.md` — token system, component library, import paths

### 3. Delegate to brand-guardian

Invoke @brand-guardian with:

> "Run a full brand audit on the component/prototype at: [path]
> Reference docs/context/brand.md for brand identity principles.
> Reference docs/context/design-system.md for token naming and semantic token tiers.
> Check: token usage (no hardcoded values, correct semantic token tier), visual consistency
> with the project's brand identity, dark mode semantic token coverage, motion token compliance,
> and overall component quality.
> Output your full review format including Brand Alignment Score."

### 4. Write audit report

Write the audit report to `[component-path]/brand-audit-[YYYY-MM-DD].md`.
If the path is a file (not a directory), write to the parent directory.
Get today's date in YYYY-MM-DD format for the filename.

### 5. Confirm completion

Tell the user:
- Brand Alignment Score
- Any blockers to fix before the component can be promoted
- File location of the full report
- If score is Strong or Acceptable: suggest running `/component-review` next
