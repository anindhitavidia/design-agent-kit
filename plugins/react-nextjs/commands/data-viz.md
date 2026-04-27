---
description: >
  Builds a data visualization or dashboard prototype for a specific project.
  Reads the design brief if available; otherwise enters conversational mode with
  dashboard templates. Uses the data-viz-engineer agent and data-viz-react skill.
  Invoke with /data-viz <project-path>.
---

# Data Viz Command

## Purpose

Build a data visualization or dashboard prototype for a specific project.
If a design brief exists, use it as primary input. If not, enter conversational mode
to scope the visualization with the user and offer dashboard templates as starting points.

## Steps

### 1. Parse the path argument

Argument: `<project-path>` — absolute or repo-relative path to the project folder.

If not provided, ask:
"What would you like to visualize? You can provide a project path or just describe what you need."

Read `design-kit.config.json` to resolve `<projectRoot>` and any path conventions.
Set `PROJECT_DIR` = the resolved project path (if provided).

### 2. Resolve today's date

Get today's date in YYYY-MM-DD format.

### 3. Check for design brief (if path provided)

Check for: `PROJECT_DIR/design-brief-*.md` or `PROJECT_DIR/01-brief.md`

- If found → brief-driven mode (step 4a)
- If not found → conversational mode (step 4b)

### 4. Read context

Before invoking the data-viz-engineer, read:
- `docs/context/design-system.md` — component library, charting library conventions, token system
- Any project-specific data context (API schemas, data models) if available

### 4a. Brief-driven mode

Load `plugins/react-nextjs/skills/data-viz-react/SKILL.md` for chart patterns and conventions.

Invoke @data-viz-engineer with:

> "Build a data visualization prototype for [project].
> Read the design brief at: PROJECT_DIR/[brief file]
> Read docs/context/design-system.md for the project's charting library, token system, and import conventions.
> Write the prototype to: PROJECT_DIR/
> Wire it into the domain index page if applicable (check design-kit.config.json for structure).
> Mode: brief-driven. Follow all standards from the design system context.
> Today's date: [date]."

Wait for the engineer to confirm the route is accessible.

### 4b. Conversational/template mode

Load `plugins/react-nextjs/skills/data-viz-react/SKILL.md` for chart patterns and conventions.

Invoke @data-viz-engineer with:

> "The user wants to build a data visualization. No design brief exists.
> Mode: conversational. Ask what data they're visualizing, who the audience is, and what question
> the visualization should answer. Offer dashboard templates as starting points.
> Read docs/context/design-system.md for the project's charting library and token system.
> Once scope is clear, write output to: PROJECT_DIR/ (or a path the user confirms)
> Today's date: [date]."

### 5. Write prototype notes

Write `PROJECT_DIR/03-prototype-notes.md` documenting:
- Charts built and visualization types used
- Mock data narratives and key insights the data surfaces
- Charting library used (e.g., Recharts, Victory, Nivo, D3)
- Any known gaps or simplifications

### 6. Update STATUS.md (if path provided)

If `PROJECT_DIR/STATUS.md` exists, update it:
- State: `prototype-ready`
- Last stage: `03-prototype (Data Viz)`
- Last run: [ISO timestamp]
- Next action: "Run /design-qa <url> to validate, then /handoff-prep <project-path>"

If STATUS.md doesn't exist, create it with this initial state.

### 7. Confirm completion

Tell the user:
- Prototype route / location
- Charts built and visualization types used
- Mock data narratives and key insights surfaced
- Reminder: "Run `/design-qa <url>` to validate, then `/handoff-prep <project-path>` for engineering handoff"
