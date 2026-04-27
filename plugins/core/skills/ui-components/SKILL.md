---
description: Use when you need prompt patterns and design guidance for specific UI component categories: forms, navigation, feedback patterns, data display, and overlays.
---

# UI Components Skill

Reference patterns for common component categories. Copy the relevant template,
fill in the specifics, and send. Each pattern encodes what Claude needs to know
to produce a correct, accessible, token-aligned component.

---

## Form Components

### Text Input

```
Build a polished text input component for [use case].

Structure: label (above), input, helper text (below), error message (below).

States: default, focused (primary focus ring), error (error border + message), disabled.
Sizes: sm (32px height), md (40px), lg (48px).

Accessible:
- <label> with htmlFor matching input id
- aria-describedby on input pointing to helper/error id
- aria-invalid="true" on error state
- aria-required="true" if required

Use design system border tokens for default state,
error token for error state, focus shadow token for focus ring.
```

### Select / Dropdown

```
Build a custom select component for [use case].

Use native <select> internally for accessibility — style it with CSS.
Don't build a fake select with divs.

States: default, focused, disabled, error.
Include a chevron icon that rotates on open.

Keyboard: full native keyboard support (it's a real select).
Use design system border and text tokens.
```

### Checkbox / Toggle

```
Build a [checkbox / toggle] component.

Controlled: accepts checked prop + onChange handler.
Also works uncontrolled with defaultChecked.

Accessible:
- Wraps a visually hidden native <input type="checkbox">
- Custom visual indicator (the styled part) has aria-hidden
- Label text associated via htmlFor or wrapping label element
- Focus ring on the native input (CSS :focus-visible)

Checked state: primary brand background.
Unchecked: neutral border.
Transition: 150ms ease.
```

---

## Navigation

### Sidebar Nav

```
Build a sidebar navigation component.

Items: array of { id, label, href, icon? }
Active state: highlighted with primary surface background, primary text, 3px left border.
Groups: optional section headers (uppercase label, muted text).
Collapsed state: icons only, tooltips on hover (optional, can be a second pass).

Use design system spacing tokens.
Fixed height, scrollable if content overflows.
```

### Breadcrumbs

```
Build a breadcrumb component.

Props: items: Array<{ label: string, href?: string }>
Last item is current page (no link, aria-current="page").
Separator: "/" or "→" between items (decorative, aria-hidden).
Accessible: <nav aria-label="Breadcrumb"> wrapping an <ol>.
Text: text-sm, secondary color for links, primary color for current.
```

### Tabs

```
Build a tabs component with [N] tabs: [tab names].

ARIA pattern: role="tablist" on container, role="tab" on each trigger,
role="tabpanel" on each panel, aria-selected on active tab,
aria-controls pointing to panel id.

Keyboard: arrow keys navigate between tabs, Enter/Space activates.
Active indicator: [underline / pill background / left border].
Animation: fade panel on tab switch (opacity 0→1, 150ms).
Use design system primary tokens for active state.
```

---

## Feedback Components

### Toast / Notification

```
Build a toast notification component.

Variants: success, warning, error, info — using semantic color tokens.
Each variant: colored left border (4px), icon, title, optional description.
Dismiss: X button (aria-label="Dismiss notification").
Auto-dismiss: optional timeout prop (default 5000ms).

Animation:
  Enter: slide in from right (x: 100%→0) + fade, 300ms ease-out
  Exit: fade out, 200ms

Position: fixed, top-right. Stack multiple toasts.
Accessible: role="alert" for errors, role="status" for success/info.
```

### Alert / Banner

```
Build an inline alert component for [context].

Variants: success, warning, error, info.
Structure: icon + title + optional description + optional action link.
Dismissible: optional, adds X button.

Not a toast — this lives inline in the page, not floating.
Use semantic color tokens: variant surface background, variant text, variant icon.
Accessible: role="alert" for errors, role="status" for others.
Border: 1px solid, matching the variant color.
```

---

## Data Display

### Data Table

```
Build a data table component for displaying [data type].

Columns: [list columns with types]
Features needed: [sortable headers / pagination / row selection / search]

Accessible:
- <table> with <thead>, <tbody>
- aria-sort on sortable column headers
- If row-selectable: role="checkbox" pattern, shift-click range select

Styling: zebra striping (neutral surface alternating rows).
Hover: neutral row highlight.
Sticky header on scroll.
Use design system table spacing tokens.
```

### Stat Card

```
Build a stat/metric card component.

Content: label (text-sm, secondary color), value (text-3xl, bold),
optional change indicator (↑ 12%, success color / ↓ 3%, error color),
optional sparkline area.

Card: surface background, border, subtle shadow, rounded corners.
Hover: elevated shadow, 250ms transition.
Use design system spacing tokens for padding.
```

---

## Overlays

### Modal / Dialog

```
Build a modal dialog for [purpose].

Backdrop: semi-transparent dark overlay.
Panel: surface background, rounded corners, shadow, max-width [480/640/720px].
Structure: header (title + close button), scrollable body, footer (actions).

Focus management:
- On open: focus first focusable element inside
- Tab key: cycles within modal only (focus trap)
- Escape: closes modal, returns focus to trigger

Accessible: role="dialog", aria-modal="true", aria-labelledby pointing to title.

Animation: backdrop fade 200ms, panel scale+fade 250ms.
```

### Popover / Tooltip

```
Build a [popover / tooltip] component.

Tooltip: shows on hover and focus, disappears on blur/mouseleave.
  - role="tooltip" on content
  - aria-describedby on trigger pointing to tooltip id
  - Never put interactive content inside a tooltip

Popover: shows on click, dismisses on Escape or outside click.
  - role="dialog" if it contains a form
  - Focus moves into popover on open

Positioning: [top / bottom / auto] of trigger. 8px gap.
Animation: opacity + scale (0.95→1), 150ms ease-out.
```
