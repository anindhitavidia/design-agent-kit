---
description: One-time setup for design-kit in this repo. Walks through stack profile selection, product context, design system, and brand bootstrapping. Scaffolds all context files and config. Idempotent — re-running skips existing files.
---

# /design-kit:init

Set up design-kit in the current repo. Work through each step in order — do not skip ahead.

---

## Step 1 — Scan the repo and detect context

Silently scan the project before asking anything. The goal is to avoid re-asking things the
repo already answers.

### 1a. Read CLAUDE.md (if present)

Read `CLAUDE.md` at the project root and extract:
- **Product context** — any product description, team name, or domain info → pre-populate
  `docs/context/product.md` (skip the Step 3 question if this is substantive)
- **Installed plugins** — scan for lines mentioning `/plugin install` or plugin names.
  Specifically note if `superpowers` is mentioned — this enables richer brainstorming in sprints.
- **Coding conventions** — any style rules, file structure notes, or naming conventions
  → inform `docs/context/coding-rules.md` in Step 2 (custom stack) or Step 7

### 1b. Check existing context files

Check for existing files in `docs/context/`:
- `product.md` exists and is populated → skip the product context question in Step 3
- `design-system.md` exists and is populated → skip Step 4
- `brand.md` exists and is populated → skip Step 5
- `personas.md` exists and is populated → skip scaffolding it in Step 7

### 1c. Check installed plugins

Read `~/.claude/plugins/installed_plugins.json` (or use `/plugin list`):
- Note any installed `design-kit-*` plugins → used in Step 1d
- Note if `superpowers` plugin is installed → save to config as `features.superpowers: true`.
  This enables `superpowers:brainstorming` in sprint Stage 1.5 (richer than the built-in skill).

### 1d. Detect tech stack

**Read `package.json`** (if present). Look for:

| Signal | Detected stack |
|---|---|
| `next` in dependencies | Next.js |
| `react` (without `next`) | React (Vite / CRA / other) |
| `vue` or `nuxt` | Vue / Nuxt |
| `@angular/core` | Angular |
| `svelte` or `@sveltejs/kit` | Svelte / SvelteKit |
| `solid-js` | SolidJS |
| None of the above | Unknown / static |

**Check for framework config files:**
`next.config.*` → Next.js, `nuxt.config.*` → Nuxt, `angular.json` → Angular,
`svelte.config.*` → SvelteKit, `vite.config.*` → Vite (check deps for framework)

**Detect component library** (from `package.json` dependencies):
shadcn (`components.json` exists or `@radix-ui/*` + `class-variance-authority`), `@mui/material`,
`@chakra-ui/*`, `vuetify`, `@mantine/*`, `daisyui`, `@headlessui/*`, `@nextui-org/*`, etc.

**Detect CSS approach:**
`tailwindcss` → Tailwind, `styled-components` / `@emotion/*` → CSS-in-JS,
`*.module.css` files → CSS Modules, `sass` / `scss` → SASS

### 1e. Present findings and ask

**If a `design-kit-*` stack profile plugin is already installed:** confirm it with the user
and skip to Step 2. If multiple are installed, ask which to use.

Show the user a brief summary of what was scanned, then present options:

> "Here's what I found in this repo:
> - Stack: **[framework + component library + CSS]** (or "nothing detected")
> - Context files: **[list existing docs/context/ files]** (or "none yet")
> - Plugins: **[list installed plugins]** (superpowers ✓ if detected)
>
> Choose a stack profile:"
>
> Choose a stack profile:
>
> 1. **react-nextjs** — React + Next.js + shadcn/ui + Tailwind. Full production-quality prototypes in your existing Next.js project.
>    *(recommended — detected Next.js)*  ← only show this tag if Next.js was detected
> 2. **html** — Self-contained HTML + DaisyUI + Tailwind CDN + Alpine.js. No build step, open in browser.
> 3. **custom** — Use your existing stack ([detected framework + library]). Prototypes are generated directly into your codebase using your design system context.
>    *(recommended — detected [framework])*  ← only show this tag if a non-Next.js framework was detected
> 4. **discovery-only** — Research, briefs, and specs only. No prototype stages.
>
> Which would you like? (1 / 2 / 3 / 4)

**For option 1 or 2** (installable plugins): plugin install commands cannot be run from within
a conversation — the user must run them in Claude Code directly. Print clearly and stop:

```
Run these two commands in Claude Code:

/plugin install design-kit-[profile]@design-agent-kit

/reload-plugins

Then re-run /design-kit:init — setup will skip Steps 1–2 and continue from Step 3.
```

**Stop here.** Do not proceed further in this session.

**For option 3 (custom):** No plugin install needed. Continue to Step 2 — the custom setup
runs inline using the detected (or user-confirmed) stack info.

**For option 4 (discovery-only):** Set `stackProfile: null` in config; warn that Stages 3–4
will be skipped. Proceed to Step 3.

---

## Step 2 — Stack-specific setup

**For react-nextjs or html** (re-running after `/reload-plugins`): invoke
`/design-kit-{stackProfile}:setup`. Skip this step if the profile was just installed in Step 1.

- **react-nextjs**: checks for Next.js, shadcn/ui, and Tailwind; installs shadcn if missing.
- **html**: no prerequisites — confirm the CDN-only approach and proceed.

**For custom stack:** Confirm the detected stack with the user and capture any gaps.

1. Show what was auto-detected:
   ```
   Detected stack:
   - Framework: [e.g. Vue 3 / Vite]
   - Component library: [e.g. Vuetify 3] (or "none detected")
   - CSS: [e.g. Tailwind CSS] (or "none detected")
   - Import path: [e.g. "vuetify/components"] (or "unknown — needs confirming")
   ```
2. Ask: "Does this look right? Correct anything or press enter to confirm."
3. Ask (if component library not detected): "What component library do you use, if any? (e.g. Vuetify, MUI, Chakra, shadcn, or 'none')"
4. Ask (if import path unknown): "What's the import path for your components? (e.g. `@acme/design-system`, `~/components/ui`)"
5. Write the confirmed stack summary into `docs/context/design-system.md` under a
   `## Stack` section — this becomes the agents' primary reference for code generation.
6. Write coding conventions into `docs/context/coding-rules.md` (component naming pattern,
   file structure conventions inferred from existing code if present).
7. Set `stackProfile: "custom"` and `customStack: { framework, componentLibrary, importPath, css }` in `design-kit.config.json`.

---

## Step 3 — Product context

Ask:

> "Tell me about your product. Share a URL (product site, docs, or app), paste a short description, or type 'none' to scaffold a template."

**URL provided:**
- Fetch the page and extract: product name, description, target users, core value proposition, and market positioning.
- Write to `docs/context/product.md`.

**Text provided:**
- Write it directly to `docs/context/product.md` under `## Description`.

**none / skip:**
- Scaffold the template from `plugins/core/templates/docs/context/product.md`.

This file is read by all agents as background context. It also seeds brand and design system bootstrapping if the user has no existing documentation.

---

## Step 4 — Design system

Ask:

> "Do you have a design system? Share one of: a Figma library link, a GitHub URL, an npm package name, or type 'none'."

**Figma link** (`figma.com/...`):
- Use the Figma MCP (`get_libraries`, `search_design_system`, `get_variable_defs`) to fetch the component list, color styles, text styles, and spacing tokens.
- Write a populated `docs/context/design-system.md`.

**GitHub URL** (`github.com/...`):
- Fetch the repo README and barrel export file to extract component names.
- Write a populated `docs/context/design-system.md` with component list and a TODO for the import path.

**npm package name** (e.g. `@acme/design-system`):
- Fetch the package README to extract component exports and import path.
- Write a populated `docs/context/design-system.md`.

**none / skip:**
- If product context was provided in Step 3, use it to write a minimal `docs/context/design-system.md` noting the product category and any inferred conventions.
- Otherwise scaffold the rich template from `plugins/core/templates/docs/context/design-system.md`.

---

## Step 5 — Brand

Ask:

> "Do you have brand documentation? Share a Figma file link (for color and text styles), a URL to brand guidelines, or type 'none'."

**Figma link** (`figma.com/...`):
- Use the Figma MCP (`get_variable_defs`, `get_design_context`) to fetch color variables, text styles, and design rules.
- Write a populated `docs/context/brand.md` with real palette names, typography scale, and spacing philosophy.

**URL** (any other URL):
- Fetch the page and summarize: voice/tone, palette, typography, design principles.
- Write a populated `docs/context/brand.md`.

**none / skip:**
- If product context was provided in Step 3, use it to infer and write a minimal `docs/context/brand.md` (e.g. product category → likely formality level, target market → appropriate tone).
- Otherwise scaffold the rich template from `plugins/core/templates/docs/context/brand.md`.

---

## Step 6 — Configuration questions

Ask each question in sequence:

1. **"Where should design-kit projects live?"** (default: `design-kit/projects/`)

2. **"Pause between stages for human review? (default: yes — human review between stages)"**

   Ask this exactly as worded above — do not rephrase as a negative ("turn off?" or "skip pauses?").

   - "yes" or blank/enter (default) → `confirmBeforeStages: true` — sprint pauses for your review before each stage (recommended)
   - "no" → `confirmBeforeStages: false` — runs end-to-end without stopping (CI / automated use only)

3. **"Locale for outputs?"** (default: `en`)

4. **"Market research depth in sprints?"**
   - `light` (default) — training knowledge only, token-efficient
   - `full` — web search enabled for current competitive data
   - `off` — skip market research

5. **"Append a 'Design Kit' section to existing CLAUDE.md, or create one?"**

---

## Step 7 — Scaffold remaining files

For each file below that does **not** already exist at the target root, read the template from this plugin's `templates/` directory and write it to the target. Do not overwrite files already created in Steps 3–5.

| Template | Target |
|---|---|
| `templates/DESIGN.md` | `DESIGN.md` |
| `templates/REVIEW.md` | `REVIEW.md` |
| `templates/CODING_GUIDELINES.md` | `CODING_GUIDELINES.md` |
| `templates/docs/context/personas.md` | `docs/context/personas.md` |
| `templates/docs/context/coding-rules.md` | `docs/context/coding-rules.md` |
| `templates/design-kit.config.json` | `design-kit.config.json` |

For `design-kit.config.json`: merge all values collected in Steps 1–2 and 6 into the template before writing:
- `stackProfile`, `customStack` (from Steps 1–2)
- `features.superpowers` — `true` if superpowers plugin was detected in Step 1c, else `false`
- `projectRoot`, `confirmBeforeStages`, `locale`, `marketResearch` (from Step 6)

Use the Read tool to load each template and the Write tool to write the target. Do not use bash.

Also ensure `.gitignore` at the target root contains these design-kit patterns (append if missing, do not overwrite):

```
# design-kit: exploration variants and iteration patches (not canonical, disposable)
*/_variants/
*/_qa/.iterate-*.patch
*/_qa/.iterate-start-*
```

---

## Step 8 — Append to CLAUDE.md

Append at the user's repo root (create CLAUDE.md if absent):

```markdown
## Design Kit

This repo uses [`design-agent-kit`](https://github.com/anindhitavidia/design-agent-kit). Configuration: `design-kit.config.json`.

Common commands:
- `/design-kit:design-sprint <project-name>` — run the full design sprint pipeline
- `/design-kit:design-brief <project-name>` — research + brief only
- `/design-kit:design-explore <project-path>` — stress-test a brief with adversarial variants
- `/design-kit:design-iterate <project-path>` — polish loop on a rendered prototype
- `/design-kit:design-qa <url>` — run QA on a rendered URL
- `/design-kit:brand-audit` — check brand consistency

Context files agents read: `docs/context/product.md`, `docs/context/brand.md`, `docs/context/design-system.md`, `docs/context/personas.md`.
```

---

## Step 9 — Summary

Print:
- Files created (note: bootstrapped from Figma/URL/npm vs scaffolded from template)
- Files skipped (already existed)
- Stack profile installed and setup status

Print next steps:
1. "Review any remaining TODOs in `docs/context/` — especially `personas.md`."
2. "Run `/design-kit:design-sprint <project-name>` to start your first sprint."
3. "Run `/design-kit:brand-audit` to validate brand context is complete enough for agents."

---

## Idempotency

Re-running `/design-kit:init` is safe — it skips existing files and reports what's missing. Pass `--force` to overwrite (confirms per file).

## Error cases

- No `package.json` or `.git/` at root → warn: "This doesn't look like a project root. Run from your repo root, or pass `--target <path>`."
- `design-kit.config.json` exists with a different `stackProfile` → ask before overwriting.
- Figma MCP not available but Figma link provided → warn and fall back to template. Tell user to install the Figma MCP and re-run with `--force`.
- URL fetch fails → warn and fall back to template.
