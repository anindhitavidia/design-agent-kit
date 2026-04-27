---
description: >
  Implements polished animations and transitions using Framer Motion.
  Invoke when adding entrance/exit animations, gesture interactions,
  layout animations, or orchestrated sequences to React components.
  Follows the principle of animations feeling unhurried and intentional.
---

# Framer Motion Skill

## What Claude Does When Invoked

When you invoke this skill, Claude produces animations that:

- Use **Framer Motion** idioms correctly (`motion.*`, `AnimatePresence`, `variants`)
- Follow considered pacing — `400ms` for deliberate entrances, `150ms` for micro-interactions
- Apply smooth easing curves (`cubic-bezier(0.4, 0, 0.2, 1)` default)
- **Exit animations** handled automatically via `AnimatePresence`
- Accessible: respects `prefers-reduced-motion`

## How to Invoke

```
Animate this component with Framer Motion: [paste component or describe it]
```

```
Add Framer Motion animations to [component name]. [describe what should animate]
```

```
Use Framer Motion for the [accordion / modal / list / page transition].
```

## Animation Patterns

### Standard Entrance / Exit

The default pattern for most components:

```
Animate with Framer Motion:
  Entrance: fade up (opacity 0->1, y 8->0), 250ms, ease-out
  Exit: fade (opacity 1->0), 150ms, ease-in
  Wrap with AnimatePresence for exit to work.
```

Produces:
```jsx
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
    />
  )}
</AnimatePresence>
```

### Staggered List

For lists where items cascade in sequence:

```
Animate this list with Framer Motion stagger.
Container: staggerChildren 0.05s
Items: fade + slide left (x -8->0), 200ms ease-out
Keep stagger at 50ms or less — longer feels slow at scale.
```

Produces:
```jsx
const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
}
const item = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: [0, 0, 0.2, 1] } }
}
```

### Accordion / Expand-Collapse

Height animation from 0 to auto:

```
Animate the accordion panel with Framer Motion height animation.
Panel: height 0->auto, opacity 0->1, 250ms
Chevron: rotate 0->180deg on open, 200ms
Use overflow: hidden on the panel wrapper.
```

### Modal

Backdrop and panel animate independently:

```
Animate this modal with Framer Motion:
Backdrop: opacity 0->1, 200ms
Panel: opacity + scale (0.96->1) + y (8->0), 250ms ease-out
Exit is the reverse of entrance, slightly faster (150ms).
```

### Page Transition (App Router)

```
Add Framer Motion page transitions. Each page fades in:
  initial: { opacity: 0 }
  animate: { opacity: 1 }
  transition: { duration: 0.2, ease: [0, 0, 0.2, 1] }
Wrap page content, not the layout shell.
```

## Reduced Motion

Always include this — ask Claude to add it:

```
Respect prefers-reduced-motion: wrap all transitions in a check,
fall back to instant transitions (duration: 0) if reduced motion is preferred.
```

## Duration Reference

| Use case | Duration |
|----------|----------|
| Hover/focus color change | 150ms |
| Standard transition | 250ms |
| Deliberate entrance | 400ms |
| Modal/overlay | 250–350ms |
| Page transition | 200ms |

## Install

```bash
npm install framer-motion
```
