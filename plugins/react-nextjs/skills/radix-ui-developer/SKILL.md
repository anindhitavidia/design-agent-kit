---
description: >
  Enforces the design system wrapper pattern when building or modifying design system
  components. Covers forwardRef, displayName, cn(), cva variants, and barrel exports.
  Use when building React components that wrap Radix primitives.
---

# Radix UI Developer

Pattern reference for building design system component wrappers around Radix primitives.

---

## 1. Wrapper Pattern

Every DS component wraps a Radix primitive:

```tsx
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from the import path declared in docs/context/design-system.md;

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: "sm" | "md" | "lg";
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, size = "md", children, ...props }, ref) => (
  <DialogPrimitive.Content
    ref={ref}
    className={cn(
      "bg-surface-card rounded-md shadow-lg",
      size === "sm" && "max-w-sm",
      size === "md" && "max-w-lg",
      size === "lg" && "max-w-2xl",
      className
    )}
    {...props}
  >
    {children}
  </DialogPrimitive.Content>
));
DialogContent.displayName = "DialogContent";

export { DialogContent };
```

Key rules:
- `React.forwardRef` with proper element ref type
- `displayName` set to match the export name
- Consumer `className` spread **last** in `cn()` so overrides work
- Re-export from component's `index.ts`, then from the barrel

---

## 2. Styling with cva

Use `cva` from `class-variance-authority` for variant definitions:

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-brand-primary text-white hover:bg-brand-primary/90",
        secondary: "bg-surface-card text-text-primary border border-border hover:bg-surface-hover",
        ghost: "text-text-primary hover:bg-surface-hover",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}
```

- **Semantic tokens only** — no raw Tailwind colors.
- Default variant = most common usage.
- Export `VariantProps` type for consumers.

---

## 3. Class Composition

Always use `cn()` for merging classes. Order:

1. Base classes
2. Variant classes (from cva)
3. Size classes
4. State classes (`data-[state=open]:`, `disabled:`)
5. Consumer `className` (last — enables overrides)

```tsx
// Right
<div className={cn("base-class", variantClass, sizeClass, className)} />

// Wrong — string concatenation
<div className={`base-class ${variantClass} ${className}`} />

// Wrong — template literals
<div className={`base-class ${isActive ? "active" : ""}`} />
```

---

## 4. File Structure

Each component in its own directory:

```
components/ComponentName/
  ComponentName.tsx    — component implementation
  index.ts             — re-export
  README.md            — usage docs (props, examples, do/don't)
  QA_REPORT.md         — generated after QA review
```

The `index.ts` re-exports everything:

```ts
export { ComponentName } from "./ComponentName";
export type { ComponentNameProps } from "./ComponentName";
```

---

## 5. Barrel Export

After creating a component, add it to the main `components/index.ts`.

Follow the existing alphabetical order. Example:

```ts
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./Collapsible";
export { Dialog, DialogContent, DialogTrigger } from "./Dialog"; // <- new
export { DropdownMenu } from "./DropdownMenu";
```

---

## 6. Accessibility

- **Don't override Radix's built-in a11y.** Radix primitives handle keyboard navigation and ARIA attributes.
- Add `aria-label` for icon-only triggers.
- Use `data-[state=*]` CSS selectors for state-based styling:

```tsx
className="data-[state=open]:bg-surface-hover data-[state=closed]:opacity-0"
```

- Test keyboard navigation: Tab, Enter/Space, Escape, Arrow keys (where applicable).
