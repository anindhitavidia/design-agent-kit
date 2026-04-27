---
description: >
  Build a single React/Next.js component from a design spec or Figma reference.
  Uses the frontend-design and component-builder skills.
  Works with full specs (Figma + Design Rules) or Shadcn-first when specs aren't ready.
  Chains component-builder skill → QA review.
  Invoke with /build-component [ComponentName].
---

# Build Component Command

End-to-end component creation: build + QA with auto-fix.
Produces a fully built, reviewed component ready for integration.

## Steps

### 1. Parse the component name and determine track

Argument: component name in PascalCase (e.g., `Notification`, `ActionGroup`, `Sheet`).

If not provided, ask: "Which component to build?"

Check what's available:
- Read `docs/context/design-system.md` to understand the project's component library, import paths, and design tokens.
- Component does NOT already exist in the design system components directory declared in `docs/context/design-system.md`.
- Design Rules for the component (any markdown files describing props API, a11y requirements, states, guardrails).
- Figma URL (ask if not provided, but it's optional).

If the component already exists, stop: "Component already exists. Use `/review-component [ComponentName]` to QA it."

**Determine the build track:**

| Has Design Rules? | Has Figma? | Track |
|---|---|---|
| Yes | Yes | **A — Full spec** |
| Yes | No | **A — Full spec** (Design Rules drive the build, Figma is nice-to-have) |
| No | Yes | **A — Full spec** (Figma drives visuals, derive behavior from the primitive) |
| No | No | **B — Shadcn-first** |

Tell the user which track: "Building **[ComponentName]** via Track [A/B] — [reason]."

If Track B, confirm: "No Figma or Design Rules found. I'll build from Shadcn + design system tokens. The component will ship as `status: \"draft\"` — you can upgrade it later with `/review-component` after specs land. Continue?"

### 2. Load skills

Load `plugins/react-nextjs/skills/component-builder/SKILL.md`.
Load `plugins/react-nextjs/skills/frontend-design/SKILL.md` for design system conventions and component patterns.

### 3. Read design system context

Read `docs/context/design-system.md` fully. Extract:
- Component library import paths and barrel exports
- Design token system (colors, spacing, typography, radius, etc.)
- Existing primitive components that can be composed
- Coding conventions and class composition helpers (e.g., `cn()`)

### 4. Build the component

Follow the component-builder skill procedure for the determined track:

**Track A (full spec):**
- **Step 1a:** Read Design Rules first (if available) — extract props API, a11y requirements, states, guardrails.
- **Step 1b:** Fetch Figma specifications (if available) — extract variants, states, sizes. Map values to design system tokens.

**Track B (Shadcn-first):**
- **Step 1a:** Look up the Shadcn component — use its API, variants, and Radix primitive as starting point.
- **Step 1b:** Derive props from the Shadcn pattern, add project-specific props if needed.
- **Step 1c:** Check if Design Rules exist anyway (they might have been added recently).

── **REVIEW CHECKPOINT 1** ──
Agree on: props API, Radix primitive choice, motion character.

**Both tracks:**
- **Step 2:** Define component architecture — headless decision, three-layer model, file structure.
- **Step 3:** Build the component — cva → states → sizes → sub-components → a11y → forwardRef → barrel.
  - Apply design system tokens over defaults (semantic colors, spacing scale, border radius, etc.) as declared in `docs/context/design-system.md`.
  - Track B: note Shadcn base in comments.
- **Step 4:** Document — create README.md in component folder.
  - Track B: add `<!-- NEEDS_DESIGN_REVIEW -->` marker and note the Shadcn base.

**Typography (both tracks):**
If the component renders text content (labels, inputs, table cells, headings, body text):
- Ensure the component does not hardcode `word-break: break-all` or high `letter-spacing` values.
- For form components: verify form text rhythm is independent of body text.
- For table components: verify table cell rhythm is independent of body text.
- Apply appropriate typography utility classes as documented in `docs/context/design-system.md`.

### 5. Wire into the design system

Follow the component wiring conventions declared in `docs/context/design-system.md`:

a. Create any demo or registry entry required by the project's component showcase.
b. Add barrel export to the design system components index.

── **REVIEW CHECKPOINT 2** ──
Verify the component renders correctly in the project's component browser or dev server.

### 6. Commit the build

Stage and commit all new files:

```bash
git add <component-directory>/ <any-registry-or-index-files>
git commit -m "feat([ComponentName]): build from [Figma + Design Rules | Shadcn base]"
```

### 7. Run automated QA review

Tell the user: "Build complete. Running QA review..."

Now run the component QA procedure:

- Load `plugins/react-nextjs/skills/component-qa/SKILL.md`
- Run initial QA (automated checks + code quality + engineering readiness)
- Auto-fix mechanical BLOCKERs (max 3 rounds)
- Generate QA_REPORT.md in the component folder
- Present results

### 8. Present final results

**Track A — QA passed clean:**
> "Built and reviewed **[ComponentName]**. Zero issues found.
>
> - Component: `<component-directory>/[ComponentName]/`
> - QA Report: `<component-directory>/[ComponentName]/QA_REPORT.md`"

**Track A — QA passed with WARNINGs:**
> "Built **[ComponentName]** and auto-fixed [N] issues. [N] WARNINGs need your review:
>
> 1. **[WARNING title]** — [description]. Fix or accept?
>
> - Component: `<component-directory>/[ComponentName]/`
> - QA Report: `<component-directory>/[ComponentName]/QA_REPORT.md`"

**Track B — Shadcn-first build complete:**
> "Built **[ComponentName]** from Shadcn base with design system tokens. Auto-fixed [N] QA issues.
>
> - Component: `<component-directory>/[ComponentName]/`
> - Status: **draft** — needs Figma/Design Rules verification before promotion
> - QA Report: `<component-directory>/[ComponentName]/QA_REPORT.md`
>
> [If WARNINGs: list them]
>
> Next steps: add Design Rules + Figma spec, then run `/review-component [ComponentName]` to upgrade status."

**BLOCKERs remain (either track):**
> "Built **[ComponentName]** but [N] BLOCKERs remain that need manual intervention:
>
> 1. **[BLOCKER title]** — [description + why it can't be auto-fixed]
>
> - QA Report: `<component-directory>/[ComponentName]/QA_REPORT.md`
>
> Fix these manually, then run `/review-component [ComponentName]` again."
