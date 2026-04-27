---
description: Sprint Stage 2.5 for the HTML profile. Builds cheap, throwaway HTML explorations of the 2-3 design directions from 02.5-design-explore.md. No tests, no polish — just enough to see each option in the browser.
---

# /design-kit-html:design-explore

Sprint Stage 2.5 — build lightweight HTML explorations.

## Behavior

1. Read `02.5-design-explore.md` — extract each direction (A, B, C…).
2. For each direction, generate `<project-path>/explorations/direction-[a|b|c].html` — a self-contained HTML file:
   - Tailwind CSS via CDN
   - Alpine.js via CDN if interactivity is needed
   - Hardcoded mock data
   - A visible heading at the top: "Direction [A] — [Name]"
   - Under 100 lines — this is a sketch, not a prototype
3. Generate `<project-path>/explorations/index.html` with links to each direction for easy navigation.
4. Confirm: "Explorations built. Open `explorations/index.html` in your browser to compare directions."

## Rules

- No shared files between directions — each `.html` is fully self-contained
- No CSS files, no JS files — CDN only
- Label each exploration clearly in the rendered UI
- These files are disposable and will be deleted after direction selection
