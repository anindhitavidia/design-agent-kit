# Design System

> Read by `design-engineer`, `component-reviewer`, `qa-designer`, and stack profile skills.
> Run `/design-kit:init` with a Figma library link or npm package name to auto-populate this file.

## Component library

<!-- TODO: Name and import path of the design system package.
Example: `import { Button } from '@acme/design-system'` -->

## Component inventory

<!-- TODO: List the components available. Group by category. Example:

### Actions
- Button (variants: primary, secondary, ghost, destructive, link)
- IconButton
- ToggleButton

### Inputs
- TextInput, Textarea
- Select, MultiSelect
- Checkbox, RadioGroup, Switch
- DatePicker, TimePicker

### Feedback
- Alert (variants: info, success, warning, error)
- Toast / Snackbar
- Badge, Tag
- ProgressBar, Spinner, Skeleton

### Layout
- Card, Panel
- Divider
- Stack, Grid (layout primitives if provided)

### Navigation
- Tabs, TabPanel
- Breadcrumb
- Sidebar, NavItem
- Pagination

### Overlay
- Dialog / Modal
- Drawer
- Popover, Tooltip
- DropdownMenu

### Data display
- DataTable, Column, SortableHeader
- Avatar, AvatarGroup
- EmptyState
-->

## Conventions

<!-- TODO: Key conventions agents must follow. Example:
- All form fields use the `Field` wrapper for label + error layout
- Loading states use `<Skeleton>` not `<Spinner>` except for page-level loads
- Colors come from CSS custom properties or token imports — never raw hex
- Icon buttons always have an `aria-label`
- Dialogs always return focus to the trigger element on close
-->

## Tokens

<!-- TODO: Where are design tokens defined? Examples:
- CSS custom properties in `src/styles/tokens.css`
- JS/TS constants exported from `@acme/design-system/tokens`
- Figma variables (link: ...)

Key token categories to document:
- Color: semantic names like `--color-primary`, `--color-surface`, `--color-text-subtle`
- Spacing: scale values used for padding/margin/gap
- Typography: font sizes, weights, line heights
- Radius: corner radius values
- Shadow: elevation levels
-->

## Allowed raw HTML

<!-- TODO: Which HTML elements are acceptable without a DS wrapper? Example:
- `<p>`, `<span>`, `<strong>`, `<em>` — for body copy
- `<ul>`, `<ol>`, `<li>` — for unstructured lists
- All others: use the DS component
-->

## Known gaps

<!-- TODO: Components the DS doesn't yet provide, so local builds are acceptable. Example:
- ColorPicker — no DS equivalent; build locally
- RichTextEditor — no DS equivalent; use Tiptap directly
-->
