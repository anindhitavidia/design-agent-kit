---
name: design-spec
description: >
  Post-prototype engineering document — documents file mappings, components, interactions,
  and acceptance criteria for implementation.
  Reads the prototype code and cross-references the target engineering repo if available.
  Outputs to <projectRoot>/<project>/design-spec-YYYY-MM-DD.md.
  Invoke with /design-spec <project-path>.
---

# Design Spec Command

## Purpose

Generate the engineering-facing design spec for a prototype. This documents exactly what was
built (file mappings, component inventory, interaction specs, acceptance criteria) so engineers
can replicate it in the target codebase without reverse-engineering the prototype.

**Not to be confused with the design brief** — the brief is a pre-prototype research document
(problem, user needs, strategic direction). The design spec is a post-prototype engineering
document (how it works, how to test it).

## Steps

### 1. Parse the path argument

Argument: `<project-path>` — path to the project folder (absolute or relative to repo root).

If not provided, ask: "Which project to generate a design spec for? Provide the project folder path."

Read `design-kit.config.json` to resolve `<projectRoot>` and any path conventions.

Set `PROJECT_DIR` = the resolved project path.

### 2. Verify prerequisites

Check that the prototype exists:
- At least one `page.tsx` (or equivalent entry-point file) in `PROJECT_DIR` or its sub-routes.

If missing, stop: "No prototype found at PROJECT_DIR. Build the prototype first."

### 3. Resolve today's date

Get today's date in YYYY-MM-DD format for the output filename.

### 4. Gather context

Read the following (all best-effort — skip and note if unavailable):

**From the project:**
- Design brief: `PROJECT_DIR/design-brief-*.md` or `PROJECT_DIR/01-brief.md` (latest) — for overview, business context
- All `.tsx` and `.ts` files in `PROJECT_DIR` — for component inventory, data shapes, user flows
- `docs/context/design-system.md` — for component mapping and import paths

**From the target engineering repo** (if available locally — check `design-kit.config.json` for configured repo paths):
- Production code counterparts — for file mapping target paths
- Existing E2E tests — to reference in acceptance criteria
- Existing fixtures — to note what already exists

### 5. Generate the design spec

Write `PROJECT_DIR/design-spec-[date].md` using the template below. Fill every section from
the context gathered in Step 4. Do not leave placeholders — if information is unavailable,
write "N/A — [reason]" explicitly.

```markdown
# Design Spec: <Feature Name>

## References

- **Design brief:** [path to brief]
- **Prototype:** `<PROJECT_DIR>/`
- **Target repo:** [target repo path if known, or "N/A — not configured"]
- **Figma:** <link if available, or "N/A (prototype-first)">

---

## Overview

<1-2 paragraphs from the design brief's strategic recommendation + prototype analysis.
Describe what the feature does, the problem solved, and expected outcome.>

---

## File Mapping

> Every design spec MUST include this table. This mapping eliminates guesswork for engineers.

| Prototype file | Target repo equivalent | Notes |
|----------------|------------------------|-------|
| <for each prototype file, map to the target repo equivalent> |

---

## User Flows

### Navigation Structure

<Describe tabs, routes, role gates. Include a table if there are multiple views.>

### Permission Boundaries

| Action | Role A | Role B | Unauthenticated |
|--------|--------|--------|-----------------|
| <action> | <yes/no> | <yes/no> | <redirect/block> |

---

## Screen States

<For each view/tab, document:>

### <View Name>

**Default:** <what user sees on first load>
**Empty:** <EmptyState component, message, CTA>
**Loading:** <skeleton behavior, duration>
**Error:** <error message, recovery path>

### Edge Cases

- Overflow text: <truncation behavior>
- Max items: <pagination limits>
- Responsive behavior: <any layout changes at breakpoints>

---

## Component Mapping

| UI element | DS component | Props/variant | Notes |
|-----------|-------------|--------------|-------|
| <for each significant UI element in the prototype> |

---

## Interaction Specs

### Click/Tap
<list click behaviors>

### Keyboard Navigation
- Tab order: <describe>
- Enter/Space: <what activates>
- Escape: <what closes>

### Focus Management
- Dialog open: <focus trap behavior>
- Dialog close: <focus return behavior>

### Transitions/Animations
<list animations with duration and easing>

---

## Acceptance Criteria

Each criterion maps 1:1 to an E2E test scenario.
Format: `AC-NNN: description → test-file SC-NNN`

<Group by feature area (tab, sheet, etc.)>

### <Feature Area 1>

- [ ] AC-001: <description> → `<feature>.spec.ts` SC-001
- [ ] AC-002: <description> → `<feature>.spec.ts` SC-002

### <Feature Area 2>

- [ ] AC-003: <description> → `<feature>.spec.ts` SC-003
```

### 6. Confirm completion

Tell the user:
- Spec location: `PROJECT_DIR/design-spec-[date].md`
- Count of acceptance criteria defined
- Count of file mappings
- Next step: "Run `/e2e-scaffold <project-path>` to generate E2E test files from these acceptance criteria."
