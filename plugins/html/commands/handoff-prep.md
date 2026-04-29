---
description: Stage 4 of the design sprint for the HTML profile. Packages the approved prototype for engineering handoff — cleans it up, documents it, and writes HANDOFF.md.
---

# /design-kit-html:handoff-prep

Sprint Stage 4 — package the HTML prototype for engineering handoff.

## Steps

### 1. Read inputs

- `<project-path>/prototype.html` — the approved prototype
- `design-brief-[date].md` — acceptance criteria and spec
- `03-prototype-notes.md` if it exists

### 2. Clean up the prototype

- Remove any `<!-- TODO -->` or placeholder comments that aren't meaningful to engineering
- Ensure Alpine.js state is clearly commented where complex
- Verify all Tailwind classes are intentional (remove debug classes like `border border-red-500`)

### 3. Document the HTML structure

Write `<project-path>/04-handoff/structure.md`:

```markdown
# HTML Structure — [Project Name]

## Layout

[Describe the top-level layout sections and their purpose]

## Components / sections

| Section | Purpose | Alpine.js state |
|---------|---------|----------------|
| ... | ... | ... |

## Tailwind patterns used

[List key Tailwind class patterns that engineering should carry forward]

## States covered

- [ ] Empty
- [ ] Loading
- [ ] Populated
- [ ] Error

## Known gaps / simplifications

[Things hardcoded or skipped that engineering will need to implement properly]
```

### 4. Write HANDOFF.md

Write `<project-path>/HANDOFF.md`:

```markdown
# Handoff — [Project Name]

**Date:** [YYYY-MM-DD]
**Stack:** HTML + Tailwind CDN + Alpine.js
**Prototype:** `prototype.html` — open directly in any browser

## What's here

- `prototype.html` — self-contained prototype covering all key states
- `04-handoff/structure.md` — layout and component documentation
- `design-brief-[date].md` — original design spec and acceptance criteria

## Engineering notes

[Key decisions, simplifications, and implementation notes for the engineering team]

## Production implementation notes

The prototype uses Tailwind CDN and Alpine.js CDN for zero setup. For production:
- Replace Tailwind CDN with the production Tailwind build (purge unused classes)
- Replace Alpine.js CDN with the npm package, or migrate state to your framework
- Replace hardcoded mock data with real API calls
```

### 5. Update STATUS.md

```
state: handed-off
last_stage: 04-handoff
```

### 6. Confirm

Print the handoff package contents and tell the user:
"Handoff package ready. Share `prototype.html` and `HANDOFF.md` with engineering."
