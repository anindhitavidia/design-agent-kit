---
description: Stage 3 of the design sprint for React/Next.js. Reads <project-path>/02-design-spec.md and scaffolds a working Next.js prototype at the same path. Required by the design-kit core ↔ stack-profile contract.
---

# /design-kit-react-nextjs:prototype

Generate a Next.js prototype from a validated design spec.

## Inputs

- `<project-path>` — path to the project folder, e.g. `design-kit/projects/sso-rollout/`. The folder must contain `02-design-spec.md`.

## Process

1. **Validate the design spec** against `plugins/core/schemas/v1/design-spec.schema.json`. If R-tier fields are missing, abort and ask the user to re-run Stage 2 to repair.

2. **Read context:**
   - `02-design-spec.md` (components, layout, interactions, states, data deps)
   - `02-brief.md` (problem, target users, success criteria)
   - User's `docs/context/design-system.md` (import paths, component inventory)
   - User's `docs/context/coding-rules.md`
   - User's `CODING_GUIDELINES.md`

3. **Use the `frontend-design` skill** to generate the prototype:
   - `<project-path>/page.tsx` — entry point, server component by default
   - `<project-path>/_components/<Name>.tsx` — local components
   - `<project-path>/_lib/` — local helpers (translations, utils)
   - `<project-path>/STATUS.md` — update `state: prototype-ready`, `last_stage: 03-prototype`

4. **Write `<project-path>/03-prototype-notes.md`** documenting:
   - Components used (and their import paths)
   - Components newly created
   - Mock data assumptions
   - Known gaps from the spec (anything skipped or simplified)

5. **Print** the next-step suggestion: `/design-kit-react-nextjs:handoff-prep <project-path>` once the prototype is QA'd.

## Stack assumptions

- Next.js App Router. Pages are server components by default; add `"use client"` only when needed.
- Tailwind CSS via `cn()` helper for class composition.
- Imports go through the design-system barrel declared in `docs/context/design-system.md`.
- Translations via `useI18n()` hook + `t()` function (or whatever the user's `design-system.md` declares).

## Refusal cases

- If `02-design-spec.md` doesn't exist: tell the user to run Stage 2 first.
- If `design-kit.config.json` declares `stackProfile` other than `react-nextjs`: this command is a no-op for that user; tell them to install or activate the matching stack profile.
