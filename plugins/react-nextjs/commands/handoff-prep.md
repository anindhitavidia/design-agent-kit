---
description: Stage 4 of the design sprint for React/Next.js. Packages the prototype into a handoff folder with component spec, a11y report, screenshots, and handoff package metadata. Required by the design-kit core ↔ stack-profile contract.
---

# /design-kit-react-nextjs:handoff-prep

Package the prototype for engineering handoff.

## Inputs

- `<project-path>` — path to the project folder. Must contain a built prototype (`page.tsx`, `_components/`, `STATUS.md` with `state: prototype-ready` or later).

## Outputs

```
<project-path>/04-handoff/
├── handoff-package.md
├── component-spec.md
├── a11y-report.md
└── screenshots/
    ├── default.png
    ├── empty.png
    ├── loading.png
    ├── error.png
    └── success.png  (one per state declared in 02-design-spec.md)
```

## Process

1. **Capture screenshots** of the prototype using the `qa-designer` agent + Playwright. One screenshot per state declared in `02-design-spec.md`.
2. **Run an a11y audit** (axe via Playwright or equivalent). Write to `04-handoff/a11y-report.md` with:
   - Overall score
   - WCAG violations by severity
   - Suggested fixes
3. **Generate `04-handoff/component-spec.md`** documenting:
   - Each component's props, events, slots
   - Which DS components were used vs newly created
   - Tailwind classes that may need to graduate to the DS
4. **Write `04-handoff/handoff-package.md`** with frontmatter validated against `handoff-package.schema.json`:

```yaml
---
stage: 4
project: <project-name>
component_specs: ['./component-spec.md']
a11y_report: './a11y-report.md'
ready_for_engineering: <true | false based on a11y violations>
screenshots_dir: './screenshots/'
known_issues: [<from 03-prototype-notes.md and a11y findings>]
---
```

5. **Update `STATUS.md`** to `state: handed-off`, `last_stage: 04-handoff`, `last_run: <ISO timestamp>`.

## Refusal cases

- If `STATUS.md` shows `state: wip` or `state: spec-ready`: tell the user to run `/design-kit-react-nextjs:prototype` first.
- If the prototype doesn't build (Next.js build fails): report the build errors and abort.
