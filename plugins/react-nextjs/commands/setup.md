---
description: Stack setup for the React/Next.js profile. Run automatically by /design-kit:init after stack profile selection. Checks that shadcn/ui is configured and Next.js is available. Installs shadcn if missing so the first prototype run is not interrupted.
---

# /design-kit-react-nextjs:setup

Stack-specific setup for the React + Next.js profile. Called by `/design-kit:init` — do not run this manually unless re-configuring.

## Steps

### 1. Check for Next.js

Look for `next.config.*` or `next` in `package.json` dependencies.

- **Found:** proceed.
- **Not found:** warn — "No Next.js project detected at the current root. design-kit-react-nextjs expects a Next.js project. Run from your repo root, or set up Next.js first (`npx create-next-app@latest`). Setup will continue but prototyping may fail."

### 2. Check for shadcn/ui

Look for `components.json` at the project root (shadcn's config file).

- **Found:** shadcn is already configured. Skip to step 3.
- **Not found:** ask — "shadcn/ui is not set up in this project. Install it now? (yes / skip)"
  - **yes:** run:
    ```bash
    npx shadcn@latest init
    ```
    Use defaults. If the user has Tailwind already configured, accept the existing config. After init completes, confirm: "shadcn/ui installed. Components will be added to `components/ui/` as needed during prototyping."
  - **skip:** warn — "shadcn/ui not installed. Prototype runs will install components on demand, which may interrupt the sprint mid-run."

### 3. Check for Tailwind CSS

Look for `tailwind.config.*` or `tailwind` in `package.json` dependencies.

- **Found:** proceed.
- **Not found:** warn — "Tailwind CSS not detected. The react-nextjs stack profile uses Tailwind for all styling. Add Tailwind to your project before running a prototype."

### 4. Confirm

Print a summary:
```
React/Next.js stack profile ready:
  ✅ Next.js detected
  ✅ shadcn/ui configured    (or ⚠️ skipped)
  ✅ Tailwind CSS detected   (or ⚠️ not found)
```
