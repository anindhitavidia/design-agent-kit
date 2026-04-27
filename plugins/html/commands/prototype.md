---
description: Stage 3 of the design sprint for the HTML profile. Reads the design spec and chosen explore direction, then generates a self-contained HTML prototype using Tailwind CSS CDN and Alpine.js. No build step — open the output file directly in a browser.
---

# /design-kit-html:prototype

Sprint Stage 3 — HTML prototype.

## Inputs

- `<project-path>` — project folder containing `02-design-spec.md` and `02.5-design-explore.md`.

## Steps

### 1. Read context

- `02-design-spec.md` — layout pattern, components needed, acceptance criteria
- `02.5-design-explore.md` → `## Chosen Direction` — the selected visual/interaction direction
- `docs/context/design-system.md` — if a DS exists, use its component conventions and token names as reference for class naming patterns and structure. If none, use Tailwind utility classes directly.
- `docs/context/brand.md` — palette and typography philosophy

### 2. Build the prototype

Generate `<project-path>/prototype.html` — a **single, self-contained HTML file**:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>[Project Name] — Prototype</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          /* Map brand tokens here if applicable */
        }
      }
    }
  </script>
</head>
<body>
  <!-- prototype content -->
</body>
</html>
```

**Rules:**
- All CSS via Tailwind utility classes — no `<style>` blocks except for Tailwind config overrides
- All interactivity via Alpine.js `x-data`, `x-show`, `x-on`, `@click` etc — no external JS files
- Use hardcoded mock data — no API calls, no fetch
- Cover all states from the spec: empty, loading (use `x-show` toggle), populated, error
- If a multi-page flow is needed, use multiple `<section>` elements with Alpine.js to show/hide — keep everything in one file

### 3. If DS components are referenced in the spec

The HTML profile cannot import DS components directly. Instead:
- Recreate the component's structure and visual pattern using Tailwind classes
- Add a comment: `<!-- DS equivalent: <ComponentName> -->`
- Reference the DS token names in a `tailwind.config` extension if relevant (e.g. map `--color-primary` to a Tailwind color)

### 4. Update STATUS.md

```
state: prototype-ready
last_stage: 03-prototype
next_action: Open prototype.html in a browser, then proceed to Stage 3.5 stakeholder review
```

### 5. Confirm completion

Tell the user:
- Path to `prototype.html`
- How to open it: "Open `<project-path>/prototype.html` in your browser — no server needed."
- States covered
- Any spec items that were simplified or left as placeholders
