---
description: Sprint Stage 2.5 for React/Next.js. Builds cheap, throwaway implementations of the 2-3 design directions from 02.5-design-explore.md using real DS components. No tests, no polish — just enough to see each option in the browser before picking one.
---

# /design-kit-react-nextjs:design-explore

Sprint Stage 2.5 — build lightweight explorations from the options in `02.5-design-explore.md`.

## Behavior

1. Read `02.5-design-explore.md` — extract each direction (A, B, C…).
2. For each direction:
   - Scaffold a single throwaway file: `<project-path>/explorations/direction-[a|b|c].tsx`
   - Use real DS components from `design-system.md` — no raw HTML, no inline styles
   - Render enough of the UI to communicate the layout and interaction pattern
   - Do NOT add tests, error handling, loading states, or data fetching — static/hardcoded data only
   - Keep each file under ~80 lines
3. Add a simple index route or page at `<project-path>/explorations/index.tsx` that links to each direction so the user can navigate between them in the browser.
4. Confirm to the sprint runner: "Explorations built at `<project-path>/explorations/`. Review in the browser, then choose a direction."

## Rules

- **Cheap and fast** — the point is to see options, not to build them properly
- **Real DS components only** — explorations that use raw HTML are misleading about feasibility
- **No shared state between directions** — each file is fully self-contained
- **Label each exploration clearly** in the UI: "Direction A — [Name]" as a visible heading
- These files are disposable — they will be deleted after a direction is chosen

## After direction is chosen

The sprint runner will delete `explorations/` and proceed to Stage 3 prototype with the chosen direction and its modifications noted in `02.5-design-explore.md`.
