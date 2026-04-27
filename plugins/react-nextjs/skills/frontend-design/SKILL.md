---
description: >
  Creates polished, production-grade frontend interfaces. Invoke this when
  building new components, pages, or UI artifacts where visual quality matters.
  Focuses on considered spacing, complete interaction states, semantic markup,
  and design token alignment.
---

# Frontend Design Skill

## What Claude Does When Invoked

When you open with "Create a polished" or "Build a production-grade", Claude shifts into a mode that:

- Treats the component as a **complete artifact**, not a quick draft
- Covers all **interaction states** (default, hover, focus, active, disabled, loading)
- Uses **design tokens** rather than hardcoded values
- Writes **semantic HTML** with accessibility baked in
- Makes deliberate **spacing decisions**

## How to Invoke

```
Create a polished [component name] for [context].
```

```
Build a production-grade [page section / feature] that [does X].
```

```
Design and implement a [component] with [key requirements].
```

## DS Component-First Rule

**Always use design system components instead of raw HTML elements where a DS component exists.**
Before writing any `<div>`, `<a>`, `<span>`, or styled wrapper, check if a DS component
already handles that pattern. Import from the import path declared in `docs/context/design-system.md`.

### Most common violations

| Instead of… | Use… |
|---|---|
| `<div className="border rounded p-4">` | `<Card>` + `<CardContent>` |
| `<a href="…">` or styled link | `<Button variant="link" asChild><Link href="…">` |
| `<span>` as status/tag | `<Badge>` (check your DS props API) |
| `<table>` / `<hr>` | `<Table>` + sub-components / `<Separator>` |
| Custom dropdown/breadcrumb/pagination | DS composite components where available |

Check your design system's component mapping docs before writing any component.

### Semantic color tokens — use these, not arbitrary Tailwind colors

| Purpose | Use | Not |
|---------|-----|-----|
| Page background | `bg-surface-background` | `bg-gray-50`, `bg-slate-50` |
| Card / panel | `bg-surface-card` | `bg-white` |
| Primary brand | `text-brand-primary`, `bg-brand-primary` | `text-indigo-600`, `bg-blue-500` |
| Body text | `text-text-primary` | `text-gray-900`, `text-slate-800` |
| Secondary text | `text-text-secondary` | `text-gray-500` |
| Muted / tertiary text | `text-text-tertiary` | `text-gray-400` |
| Borders | `border-border` | `border-gray-200` |
| Status colors | `text-status-success`, `bg-status-error`, etc. | `text-green-600`, `bg-red-500` |

When in doubt, check your design system's token file for available `--color-*` variables.

### When raw HTML is fine

- Layout containers (`<div>`, `<section>`, `<main>`) with Tailwind utilities — no DS wrapper needed
- `<p>`, `<h1>`–`<h6>`, `<ul>`, `<li>` — text and list elements styled with tokens
- Form field wrappers that compose DS inputs (TextInput, Select, etc.)
- `<motion.div>` for Framer Motion animation wrappers

### Dark mode — built in, not bolted on

Dark mode uses Tailwind's `dark:` variant (class-based, `.dark` on `<html>`).
Semantic tokens auto-switch — **if you use semantic tokens, dark mode is free.**
The miss happens when you use hardcoded colors or primitive scales.

**Rules:**
1. **Semantic tokens first** — `bg-surface-card`, `text-text-primary`, `border-border`
   all auto-switch. No `dark:` override needed.
2. **Primitive scales need `dark:` overrides** — if you must use a primitive scale color,
   add the appropriate dark pair. Every primitive-scale color needs a `dark:` pair.
3. **Hardcoded colors break dark mode** — `bg-white`, `text-gray-900`, `border-gray-200`
   will NOT switch. Use semantic tokens instead.
4. **Opacity and alpha** — `bg-white/70` needs `dark:bg-white/10` (or `dark:bg-black/30`).
   Glass/frosted effects need explicit dark variants.
5. **Shadows** — dark mode needs stronger alpha shadow values.
6. **Status colors** — `text-green-600` needs `dark:text-green-400`. Always pair
   primitive status colors with their dark counterpart.

### Responsiveness — mobile-first, scale up

Default styles target mobile. Use `md:` and `lg:` breakpoints to scale up.

**Rules:**
1. **Layouts** — use `flex flex-col md:flex-row` for stacking → horizontal.
   Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
2. **Typography** — base size for mobile, `md:text-lg` / `lg:text-xl` for larger screens.
3. **Spacing** — tighter on mobile (`gap-4`), generous on desktop (`md:gap-6 lg:gap-8`).
4. **Hidden/shown** — use `hidden md:block` or `md:hidden` for responsive visibility.
5. **Tables** — wrap in `overflow-x-auto` for horizontal scroll on mobile.
6. **Min-width gotcha** — flex items with wide children (tables, code blocks) need `min-w-0`
   to prevent overflow.

### Verification step

Before finishing any page or component:
1. **DS components** — scan for raw `<a>`, `<button>`, `<hr>`, `<table>`, `<input>`,
   `<select>`, `<textarea>`, `<dialog>`, and styled card-like `<div>`s (border+rounded+padding).
   Also check for custom breadcrumbs, pagination, dropdowns, and empty states.
   Replace each with its DS equivalent per your design system's component mapping docs.
2. **Dark mode** — toggle dark mode and check every section for invisible text,
   blending backgrounds, or missing borders.
3. **Responsiveness** — resize to mobile width (375px) and check for overflow,
   overlapping text, or unreachable content.

## Core Instructions Embedded in Every Invocation

When you use this skill, include these in your prompt:

```
Use design tokens from the design system (see docs/context/design-system.md for import paths).
Use DS components — never raw HTML where a DS component exists.
Dark mode: use semantic tokens that auto-switch. Every primitive-scale color needs a dark: pair.
Responsive: mobile-first — default styles for mobile, scale up with md:/lg: breakpoints.
Cover all interactive states.
Accessible: semantic HTML, keyboard support, WCAG AA contrast.
```

## Prompt Templates

### New Component

```
Create a polished [COMPONENT] for [CONTEXT: what app, what page, what purpose].

It should:
- [requirement 1]
- [requirement 2]
- [requirement 3]

States: default, hover, focus, [disabled / loading / active as needed]
Visual tone: [restrained / warm / information-dense / minimal]

Import DS components from the path declared in docs/context/design-system.md.
Use design tokens. [React / HTML]. Accessible.
```

### Page Section

```
Build a production-grade [SECTION NAME] for [APP TYPE].

Layout:
- [element 1, position]
- [element 2, position]
- [element 3, position]

Height: [Xpx / fluid]. Background: [color token].
Spacing: generous — breathing room between elements.
Import DS components from the path declared in docs/context/design-system.md.
Use design tokens — no hardcoded hex or arbitrary Tailwind colors.
Dark mode: semantic tokens + dark: pairs for any primitive-scale colors.
Responsive: mobile-first (flex-col md:flex-row, grid-cols-1 md:grid-cols-2).
```

### Component Variants

```
Create a polished [COMPONENT] with [N] variants:
- [Variant 1]: [description]
- [Variant 2]: [description]

Each variant needs: default, hover, focus, disabled states.
Use semantic color tokens (success, warning, error, info) — not hardcoded hex.
[Size options if needed: sm, md, lg]
```

## Tips That Make a Difference

**Name the feeling, not just the spec.**
"Confident and unhurried" produces different decisions than "clean."

**Give usage context.**
"This is in a sidebar" → different than "this is the hero." Context shapes proportions.

**Request generous whitespace explicitly.**
Say "generous whitespace" or "breathing room between elements."

**Ask for all states upfront.**
One prompt with all states > going back to add them one by one.

**Stay in the session for revisions.**
Don't start new conversations. Claude remembers your component.
