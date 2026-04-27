---
description: Sprint Stage 2.5 for the HTML profile. Builds cheap, throwaway HTML explorations of the 2-3 design directions from 02.5-design-explore.md using DaisyUI + Tailwind CDN + Alpine.js. No tests, no polish — just enough to see each option in the browser.
---

# /design-kit-html:design-explore

Sprint Stage 2.5 — build lightweight HTML explorations.

## Behavior

1. Read `02.5-design-explore.md` — extract each direction (A, B, C…).
2. For each direction, generate `<project-path>/explorations/direction-[a|b|c].html`:
   - Same CDN stack as prototype: DaisyUI + Tailwind + Alpine.js
   - Visible heading at top: "Direction [A] — [Name]"
   - Use DaisyUI components (not raw Tailwind) so each direction feels realistic
   - Hardcoded mock data — no fetch, no state management
   - Under 100 lines — sketch only
   - Use `text-base-content` and `text-base-content/70` for text — no raw gray classes
3. Generate `<project-path>/explorations/index.html` with links to each direction.
4. Confirm: "Explorations built. Open `explorations/index.html` in your browser to compare directions."

## Rules

- No shared files — each `.html` is fully self-contained
- DaisyUI for components, not raw Tailwind utilities
- Label each exploration clearly in the UI
- These files are disposable — deleted after direction selection
