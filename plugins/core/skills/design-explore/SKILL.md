---
description: Design exploration skill for Sprint Stage 2.5. After the brief is locked, generates 2-3 lightweight design directions using real DS components (or wireframe descriptions if no stack profile is active). Each direction challenges or extends the brief. User picks one before prototyping begins.
---

# Design Explore

Sprint Stage 2.5 — the diverge pass between brief and prototype.

The brief has locked in the *what*. This stage challenges *how* — generating 2-3 distinct visual/interaction directions before committing to full prototyping. Keep everything lightweight and disposable. The goal is speed-to-options, not polish.

## Inputs

- `02-design-spec.md` — the locked design spec. Read it fully.
- `docs/context/design-system.md` — component inventory and conventions.
- `docs/context/brand.md` — visual constraints.
- `docs/context/personas.md` — who this is for.

## Process

1. **Re-read the brief with fresh eyes.** Identify the core problem the spec is solving.

2. **Generate 2-3 directions.** Each direction must:
   - Have a distinct layout or interaction pattern (not just color/spacing variation)
   - Name which DS components it uses (or would use)
   - State the core trade-off: what does this direction optimize for, and what does it sacrifice?
   - Be challengeable — at least one direction should push back on an assumption in the brief

   Good prompts for diverging:
   - "What if the primary action was surfaced earlier?"
   - "What if we removed the most complex piece — what's left?"
   - "What if we optimised for the power user instead of the first-time user?"
   - "What if this was a single view instead of a multi-step flow?"

3. **For each direction, produce:**
   - A name (2-3 words, e.g. "Inline Edit", "Drawer-first", "Card Grid")
   - A brief description (2-3 sentences)
   - A rough layout description or text wireframe (ASCII or prose — no code yet)
   - DS components used
   - Trade-off summary: ✅ optimises for / ⚠️ sacrifices

4. **Write to `02.5-design-explore.md`** in the project directory.

5. **Present the options** to the user and ask: "Which direction (or hybrid) should we take into prototyping? You can also say 'none — revise the brief first'."

6. **Record the chosen direction** in `02.5-design-explore.md` under `## Chosen Direction` and note the key reasoning.

## Stack profile integration

If the active stack profile has a `design-explore` command, dispatch to it after writing the options doc. The stack profile will build cheap, throwaway implementations of each option using real DS components — no tests, no polish, just enough to see it in the browser.

If no stack profile `design-explore` command exists, the text-based options doc is sufficient for the user to make a decision.

## Output format

```markdown
# Design Explore — [Project Name]
**Date:** [YYYY-MM-DD]
**Brief:** [link to 02-design-spec.md]

---

## Direction A — [Name]

**Layout:** [prose description or ASCII wireframe]
**DS Components:** [list]
**Optimises for:** [what]
**Sacrifices:** [what]

---

## Direction B — [Name]

...

---

## Direction C — [Name]

...

---

## Chosen Direction

**Direction [X] — [Name]**
**Reasoning:** [Why this one. What hybrid elements if any were taken from other options.]
**Modifications from brief:** [Any spec changes implied by this direction.]
```

## What this is NOT

- Not a prototype — no tests, no polish, no production concerns
- Not a spec rewrite — if the brief needs major changes, flag it and stop; don't silently change direction
- Not a beauty contest — directions are judged on fit for the user problem, not visual flair
