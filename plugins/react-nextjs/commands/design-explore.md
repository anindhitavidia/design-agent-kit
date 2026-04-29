---
description: >
  Stage 2.5 for React/Next.js. Builds cheap throwaway variant implementations for each
  stance (double-down / adjacent / invert) in _variants/[date]/[stance]/. Real DS components,
  no tests, no polish — just enough to walk the primary flow and evaluate the stance.
  Invoked by /design-kit:design-explore, not directly.
---

# /design-kit-react-nextjs:design-explore

Builds throwaway React variants for each stance produced by the `design-explore` skill.

## Inputs

- `<project-path>` — resolved by the caller
- `[committed-direction]` — the brief's committed direction (one sentence)
- `[stance-list]` — list of stances to build (default: double-down, adjacent, invert)
- `[variant-dir]` — base path for variants, e.g. `<project-path>/_variants/[date]/`
- `[date]` — today's date in YYYY-MM-DD

## Behavior

Read the design brief and `docs/context/design-system.md`. Read the variant fidelity
contract at the `design-explore` skill's `references/variant-fidelity.md`.

For each stance, build the variant by dispatching a `design-engineer` agent in parallel
(single message, multiple tool calls). Each agent writes to its OWN subdirectory:

```
<variant-dir>/double-down/
<variant-dir>/adjacent/
<variant-dir>/invert/
```

### Per-variant output

Each variant directory must contain:
- A main view file (`page.tsx` or similar) — entry point for the direction
- `_components/` — local components if needed
- `STANCE.md` — the stance description (see below)

**Do NOT:**
- Wire into any app index or navigation
- Add E2E tests or translation files
- Implement loading/empty/error states (unless the stance lives in one of them)
- Exceed ~80–100 lines per file — this is a sketch, not a prototype

**Do:**
- Use DS components from `docs/context/design-system.md` import paths — no raw HTML
- Use semantic tokens only — no hardcoded colors or inline styles
- Use realistic hardcoded mock data
- Walk the primary user flow end-to-end

### STANCE.md format

```markdown
# Stance: [Double-down / Adjacent / Invert]

**Committed direction:** [from brief]
**This variant:** [what this stance does differently]
**Key choice:** [the one thing that makes this direction distinct]
```

## Parallelization rule

Each variant agent MUST write to its own subdirectory. Prompt each agent explicitly:
"Write to `<variant-dir>/[stance-name]/`. Do NOT write to `<project-dir>/_components/`
or any shared path."

## Confirmation

When all variants are built, confirm to the caller:
"Variants built at `<variant-dir>/`. Three directions ready for review:
- `double-down/` — [one-line summary]
- `adjacent/` — [one-line summary]
- `invert/` — [one-line summary]"

## After direction is chosen

`_variants/` is gitignored — variants are not committed. The sprint runner notes the chosen
direction in `02.5-design-explore.md` and passes it as context to Stage 3 prototype.
