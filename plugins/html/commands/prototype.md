---
description: Stage 3 of the design sprint for the HTML profile. Reads the design spec and chosen explore direction, then generates a self-contained HTML prototype using DaisyUI + Tailwind CDN + Alpine.js. Includes dark mode toggle. No build step — open in browser directly.
---

# /design-kit-html:prototype

Sprint Stage 3 — HTML prototype.

## Inputs

- `<project-path>` — project folder containing `design-brief-[date].md` (most recent by date) and optionally `02.5-design-explore.md`.

## Steps

### 1. Read context

- `design-brief-[date].md` (most recent) — problem, layout pattern, components needed, acceptance criteria
- `02.5-design-explore.md` → `## Chosen Direction` — the selected direction (if present)
- `docs/context/brand.md` — palette and typography philosophy (if present)

### 2. Build the prototype

Generate `<project-path>/prototype.html` — a **single, self-contained HTML file**:

**CDN stack (copy exactly — do not substitute):**

```html
<!DOCTYPE html>
<html lang="en" data-theme="light" x-data="{ dark: false }" :data-theme="dark ? 'dark' : 'light'">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>[Project Name] — Prototype</title>
  <!-- DaisyUI v4 must load before Tailwind v3 -->
  <link href="https://cdn.jsdelivr.net/npm/daisyui@4/dist/full.min.css" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="bg-base-100 text-base-content min-h-screen">

  <!-- Dark mode toggle — always include -->
  <div class="fixed top-4 right-4 z-50">
    <label class="swap swap-rotate btn btn-ghost btn-circle">
      <input type="checkbox" x-model="dark" />
      <!-- sun icon -->
      <svg class="swap-on w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7,5,6.36a1,1,0,0,0-1.41,1.41L4.22,8.46A1,1,0,0,0,5.64,7Zm13,.29a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71a1,1,0,0,0-1.41,1.41Zm-3,8.75A1,1,0,0,0,17,17l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41L18.36,15.7A1,1,0,0,0,15.66,16.05ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,8.27,19.07,7.56a1,1,0,0,0-1.41-1.41l-.71.71A1,1,0,0,0,18.36,8.27ZM12,6a6,6,0,1,0,6,6A6,6,0,0,0,12,6Zm0,10a4,4,0,1,1,4-4A4,4,0,0,1,12,10Z"/></svg>
      <!-- moon icon -->
      <svg class="swap-off w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
    </label>
  </div>

  <!-- prototype content -->

</body>
</html>
```

### 3. Use DaisyUI components

Use DaisyUI semantic classes for all UI elements. Do not build components from scratch with raw Tailwind utilities when a DaisyUI equivalent exists.

| Need | DaisyUI class |
|------|--------------|
| Buttons | `btn btn-primary`, `btn btn-ghost`, `btn btn-error` |
| Cards | `card card-bordered`, `card-body`, `card-title` |
| Badges | `badge badge-success`, `badge badge-warning` |
| Alerts | `alert alert-warning`, `alert alert-error` |
| Form inputs | `input input-bordered`, `select select-bordered`, `checkbox`, `toggle` |
| Tables | `table table-zebra` |
| Navigation | `navbar`, `menu`, `breadcrumbs` |
| Modals | `modal`, `modal-box` |
| Loading | `loading loading-spinner` |
| Avatars | `avatar`, `avatar-group` |
| Stats | `stats`, `stat`, `stat-title`, `stat-value` |

### 4. Visual quality — non-negotiable rules

The prototype must look intentional, not like a first-pass dump. Apply every rule below before marking the prototype done.

**Typography hierarchy**
- Page title / section header: `text-2xl font-semibold` or `text-xl font-semibold`
- Card title / sub-header: `text-base font-medium`
- Body copy: `text-sm` (default weight — never bold)
- Supporting / muted text: `text-xs text-base-content/60`
- Never use `font-bold` on body copy — reserve `font-semibold` for headings only
- Never use more than 3 font-size levels on a single screen

**Spacing rhythm**
- Page padding: `p-6` or `p-8` — no tighter than `p-4` at the root
- Card inner padding: `p-4` or `p-6` — pick one and use it consistently
- Grid/flex gap: `gap-4` for dense layouts, `gap-6` for standard, `gap-8` for wide
- Vertically stacked text blocks inside a card: `space-y-1` between label + value

**Card elevation**
- Every card must have a visible lift: `shadow-sm` as the baseline
- Never flat white-on-white (`card` with no shadow on `bg-base-100`)
- Hover state on interactive cards: add `:hover:shadow-md transition-shadow`
- Use `bg-base-200` for card backgrounds on `bg-base-100` pages (adds depth without shadow)

**Color and action discipline**
- Primary CTA per view: exactly one `btn-primary` — all secondary actions use `btn-ghost` or `btn-outline`
- Status indicators: always use DaisyUI semantic badge/alert variants (`badge-error`, `badge-warning`, `badge-success`, `badge-info`) — never `bg-red-100 text-red-700` raw classes
- Muted / disabled text: `text-base-content/50` — nothing lighter in interactive contexts
- Accent colors: use sparingly — one accent per section, not per element

**Content realism**
- Use realistic data: real-looking names, dates, numbers, status labels — not "Lorem ipsum" or "User 1"
- For dashboards: show mixed states (some OK, some warning, one critical) — not all green
- For tables: at least 4–5 rows with varied data; one empty-ish state, one near-limit state
- For forms: pre-fill example values in at least one field so layout is proven

**Layout tightness check**
- Before finalizing: scan for any section where two adjacent elements have inconsistent margins
- Sidebar widths: fixed `w-64` or `w-56` — never `w-1/5` (breaks on narrow viewports)
- Main content area: `flex-1 min-w-0` to prevent overflow with long text

### 5. Accessibility — non-negotiable rules

**Colour contrast:**
- Body and label text: use `text-base-content` (never `text-gray-400` or lighter)
- Secondary/muted text: use `text-base-content/70` — do NOT use `text-gray-400`, `text-gray-300`, or any raw gray below `/60` opacity
- Error and warning text: use DaisyUI semantic colours (`text-error`, `text-warning`) — these are contrast-safe
- Never use colour alone to convey meaning — pair with an icon or label

**Interactive elements:**
- Every button must have visible text or an `aria-label`
- Icon-only buttons: always add `aria-label="..."`
- Form fields: always pair with a `<label>` — use DaisyUI `form-control` + `label` wrapper
- Links must be distinguishable without colour (underline or icon)

**Keyboard & focus:**
- Do not remove focus rings — DaisyUI includes them by default; do not override with `outline-none` unless replacing with a custom visible ring
- Interactive elements must be reachable by Tab key

**ARIA:**
- Modals: add `role="dialog"` and `aria-modal="true"`
- Alert/status messages: add `role="alert"` or `aria-live="polite"`
- Loading states: add `aria-busy="true"` on the container

### 6. Dark mode — verify both themes

DaisyUI themes handle colour adaptation automatically via `data-theme`. Ensure:
- No hardcoded hex colours or raw Tailwind colour values (e.g. `text-gray-900`, `bg-white`) — use DaisyUI semantic classes only so dark mode works without extra work
- Background hierarchy is preserved: `bg-base-100` (page) → `bg-base-200` (card) → `bg-base-300` (nested)
- Check all states visually work in dark theme before confirming

### 7. Cover all states

Use Alpine.js `x-show` / `x-if` to cover:
- **Empty state** — when there's no data
- **Loading state** — use `<span class="loading loading-spinner"></span>` with `aria-busy`
- **Populated state** — the main happy path
- **Error state** — inline field errors and/or an `alert alert-error`

Add a small state switcher in the top-left corner so reviewers can toggle between states:
```html
<div class="fixed top-4 left-4 z-50 flex gap-2" x-data="{ state: 'populated' }">
  <button class="btn btn-xs" :class="state === 'empty' && 'btn-active'" @click="state = 'empty'">Empty</button>
  <button class="btn btn-xs" :class="state === 'loading' && 'btn-active'" @click="state = 'loading'">Loading</button>
  <button class="btn btn-xs" :class="state === 'populated' && 'btn-active'" @click="state = 'populated'">Populated</button>
  <button class="btn btn-xs" :class="state === 'error' && 'btn-active'" @click="state = 'error'">Error</button>
</div>
```

### 8. Update STATUS.md

```
state: prototype-ready
last_stage: 03-prototype
next_action: Open prototype.html in a browser, check light + dark mode, then proceed to Stage 3.5
```

### 9. Confirm completion

Tell the user:
- Path to `prototype.html`
- How to open: "Open `<project-path>/prototype.html` in your browser — no server needed."
- States covered
- Dark mode: "Toggle dark mode with the sun/moon button in the top-right corner."
- Any spec items simplified or left as placeholders
