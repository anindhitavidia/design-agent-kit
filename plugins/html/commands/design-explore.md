---
description: >
  Stage 2.5 for the HTML profile. Builds cheap throwaway HTML variant implementations for
  each stance (double-down / adjacent / invert) in _variants/[date]/[stance]/. DaisyUI +
  Tailwind CDN + Alpine.js. No tests, no polish — just enough to walk the primary flow and
  evaluate the stance. Invoked by /design-kit:design-explore, not directly.
---

# /design-kit-html:design-explore

Builds throwaway HTML variants for each stance produced by the `design-explore` skill.

## Inputs

- `<project-path>` — resolved by the caller
- `[committed-direction]` — the brief's committed direction (one sentence)
- `[stance-list]` — list of stances to build (default: double-down, adjacent, invert)
- `[variant-dir]` — base path for variants, e.g. `<project-path>/_variants/[date]/`
- `[date]` — today's date in YYYY-MM-DD

## CDN Stack

```html
<link href="https://cdn.jsdelivr.net/npm/daisyui@5/dist/full.min.css" rel="stylesheet" />
<script src="https://cdn.tailwindcss.com"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>
```

## Behavior

Read the design brief. For each stance, generate one self-contained HTML file:

```
<variant-dir>/double-down/index.html
<variant-dir>/adjacent/index.html
<variant-dir>/invert/index.html
```

Plus a `STANCE.md` in each directory.

### Per-variant output

**index.html rules:**
- Full HTML document with the CDN stack above
- DaisyUI semantic components (`btn`, `card`, `badge`, `input`, `table`, `navbar`, etc.)
- `text-base-content` for all text, `text-base-content/70` for muted — never raw gray classes
- Hardcoded mock data (no fetch, no Alpine.js state management beyond simple UI toggles)
- Under ~100 lines — this is a sketch, not a prototype
- Walk the primary user flow end-to-end (static clickthrough is fine)
- Dark mode included via `<html data-theme="light">` — do NOT add a manual toggle here

**Do NOT:**
- Wire into any index or navigation
- Add loading/empty/error states (unless the stance lives in one of them)
- Add custom CSS or `<style>` blocks — DaisyUI + semantic tokens only

**STANCE.md format:**
```markdown
# Stance: [Double-down / Adjacent / Invert]

**Committed direction:** [from brief]
**This variant:** [what this stance does differently]
**Key choice:** [the one thing that makes this direction distinct]
```

## Confirmation

When all variants are built, confirm to the caller:
"Variants built at `<variant-dir>/`. Open each `index.html` in your browser to compare:
- `double-down/` — [one-line summary]
- `adjacent/` — [one-line summary]
- `invert/` — [one-line summary]"

## After direction is chosen

`_variants/` is gitignored — variants are not committed. The sprint runner notes the chosen
direction in `02.5-design-explore.md` and passes it as context to Stage 3 prototype.
