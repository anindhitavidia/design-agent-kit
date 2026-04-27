---
description: >
  Use this when building a net-new React component for the design system.
  Works with full specs (Figma + Design Rules) or Shadcn-first when specs
  aren't ready yet. Triggers on: "Build [ComponentName]",
  "Create a new component for [X]", "Implement [ComponentName] from Figma",
  "Scaffold [ComponentName] from Shadcn".
---

# Component Builder

Build net-new components using Shadcn + Radix as the implementation base, design system tokens for styling, and optionally Figma + Design Rules for spec fidelity.

**Not for:** extracting from existing code, QA (use component-qa), or graduation/handoff.

---

## Build Tracks

Pick the track based on what's available. Both produce the same output shape (forwardRef + cva + registry).

| Track | When to use | Sources |
|---|---|---|
| **A — Full spec** | Figma + Design Rules both exist | Figma (visual), Design Rules (behavior), Shadcn (implementation base) |
| **B — Shadcn-first** | No Figma and/or no Design Rules yet | Shadcn primitive + design system tokens + general a11y patterns |

Track B components ship with `status: "draft"` in the manifest and a `<!-- NEEDS_DESIGN_REVIEW -->` marker in the README. They're functional and token-compliant but haven't been verified against a design spec — treat them as a strong starting point that will need a design pass later.

---

## Sources of Truth

| Source | Provides | Required? |
|---|---|---|
| **Shadcn / Radix** | Accessible behavior, keyboard handling, ARIA | Always |
| **Design System Tokens** | Colors, spacing, radius, elevation (see `docs/context/design-system.md`) | Always |
| **Design Rules** | Behavior, principles, accessibility, when to use | Track A only |
| **Figma** | Visual specs — variants, states, sizes, spacing, colors | Track A only |

---

## Build Process

### Prerequisites (both tracks)

- Component name decided
- `cn()` utility available, `cva` installed

### Additional prerequisites (Track A only)

- Figma file URL ready + Figma MCP server connected
- Design Rules exist for the component

### Steps

```
Step 1: Gather Specifications

  Track A (full spec):
    1a. Read Design Rules FIRST
        - Extract: props API surface, accessibility requirements, states, guardrails
    1b. Fetch Figma Specifications
        - Extract all variants, states, sizes, sub-components
        - Map every Figma value to a Tailwind class (never raw values)
        - Cross-check against Design Rules — rules win on behavioral conflicts

  Track B (Shadcn-first):
    1a. Look up the Shadcn component
        - Check if Shadcn has this component: https://ui.shadcn.com/docs/components/[name]
        - If yes: use its API surface, variants, and Radix primitive as the starting point
        - If no: use the Headless Decision Framework to pick a Radix primitive or go pure presentational
    1b. Derive props from the Shadcn pattern
        - Keep Shadcn's prop API where it makes sense (variant, size, etc.)
        - Add design-system-specific props if needed
    1c. Check if Design Rules exist (they might have been added since the component was requested)
        - If found: read them and adjust the API accordingly (rules win)
        - If not found: proceed with Shadcn defaults + design system tokens

-- REVIEW CHECKPOINT 1 --
  Agree on: props API, Radix primitive choice, motion character

Step 2: Define Component Architecture
  - Run the headless decision framework (Radix? Custom hook? Pure presentational?)
  - Follow the three-layer model: Behavior -> Styling -> Design Language

Step 3: Build Component
  - Build order: cva -> states -> sizes -> sub-components -> a11y -> forwardRef -> barrel
  - Dark mode from the start: semantic tokens only, no scale tokens
  - Mobile-first: default styles for mobile, scale up with md:/lg:
  - Touch targets: min 44x44px on interactive elements
  - Reduced motion: motion-reduce:transition-none in base classes
  - Track B: apply design system tokens over Shadcn defaults
    (e.g., use semantic colors not Shadcn's zinc/slate scale)

-- REVIEW CHECKPOINT 2 --
  Test in browser, verify against Figma (Track A) or verify token compliance (Track B)

Step 4: Document Component
  - Create README.md in component folder
  - Track B: add `<!-- NEEDS_DESIGN_REVIEW -->` at the top and note
    "Built from Shadcn base, pending Figma/Design Rules verification" in the status line
```

---

## Registry Wiring

After building the component, wire it into the design system registry:

### 1. Create registry file

```js
// lib/registry/[slug].js
import { ComponentName } from the import path declared in docs/context/design-system.md

export default {
  name: "Component Name",
  variants: [
    {
      name: "Default",
      component: () => <ComponentName>Example</ComponentName>,
    },
    // ... more variants
  ],
}
```

### 2. Add to manifest

```js
// lib/registry/manifest.js
{
  slug: "component-name",
  name: "ComponentName",
  description: "One-line description",
  category: "Inputs", // or Feedback, Layout, Navigation, etc.
  status: "evolving", // or "draft" for Track B (Shadcn-first, no Figma/rules yet)
  sourcePath: "components/ComponentName",
}
```

### 3. Add barrel export

```ts
// components/index.ts
export { ComponentName } from "./ComponentName"
```

---

## Headless Decision Framework

```
Does it manage open/closed, selected, or checked state
with keyboard + screen reader requirements?
|
+-- YES --> Does Radix have a primitive? --> YES: Use Radix
|                                       --> NO: Custom headless hook
|
+-- NO  --> Purely presentational? --> forwardRef + cva (no behavior layer)
        --> Simple toggle/loading? --> forwardRef + cva + local useState
```

Available Radix primitives: Dialog, AlertDialog, Popover, Tooltip, HoverCard, DropdownMenu, ContextMenu, Checkbox, RadioGroup, Select, Switch, Slider, Toggle, ToggleGroup, Tabs, NavigationMenu, Accordion, Collapsible, ScrollArea, Menubar, Toolbar.

---

## Gotchas (from real failures)

**Barrel import circular deps:** Components that import other components from the same barrel should import directly from the component path, NOT the barrel index. The barrel re-exports all components and can cause circular imports.

**Registry slug pattern:** `toSlug("TextArea") = "text-area"` (PascalCase to kebab-case). The slug in manifest must match the registry filename.

**Card `overflow-hidden`:** The Card component commonly has `overflow-hidden` hardcoded. Use a plain `<div>` for containers that need visible overflow (dropdowns, tooltips, popovers).

**`variant="default"` not `"primary"`:** In Shadcn-based systems, Button's primary visual style typically uses `variant="default"`. There is no `variant="primary"` unless explicitly added.

**Always `cn()`, never string concatenation:** Use `cn()` from `clsx` + `tailwind-merge` for all className assembly. Never use template literals or `+` to join class strings.
