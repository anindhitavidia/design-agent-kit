---
description: One-time setup for design-kit in this repo. Walks through stack profile selection, product context, design system, and brand bootstrapping. Scaffolds all context files and config. Idempotent — re-running skips existing files.
---

# /design-kit:init

Set up design-kit in the current repo. Work through each step in order — do not skip ahead.

---

## Step 1 — Choose a stack profile

Check installed `design-kit-*` plugins via `/plugin list` (or `~/.claude/plugins/installed_plugins.json`).

**If a stack profile is already installed:** confirm it with the user. If multiple are installed, ask which to use.

**If no stack profile is installed:** present the options and ask which to install:

> "No stack profile installed. Choose one:"
>
> 1. **react-nextjs** — React + Next.js + shadcn/ui + Tailwind. Full production-quality prototypes. Requires an existing Next.js project.
> 2. **html** — Self-contained HTML + DaisyUI + Tailwind CDN + Alpine.js. No build step, open in browser. Best for quick prototyping or when you don't have a Next.js project.
> 3. **discovery-only** — Skip prototyping (Stages 3–4 won't run). Research, briefs, and specs only.
>
> Which would you like? (1 / 2 / 3)

- For option 1 or 2: plugin install commands cannot be run from within a conversation — the user must run them in Claude Code directly. Print these instructions clearly and stop:

  ```
  Run these two commands in Claude Code:

  /plugin install design-kit-[profile]@design-agent-kit

  /reload-plugins

  Then re-run /design-kit:init — setup will skip Steps 1–2 and continue from Step 3.
  ```

  **Stop here.** Do not proceed further in this session.
- For option 3: note in config that `stackProfile` is unset; warn that Stages 3–4 will be skipped. Proceed to Step 3.

---

## Step 2 — Run stack-specific setup

**Skip this step if the stack profile was just installed in Step 1** (user is re-running init after `/reload-plugins` — the profile is now active).

If a stack profile is active and has a `setup` command, invoke `/design-kit-{stackProfile}:setup` now.

- **react-nextjs**: checks for Next.js, shadcn/ui, and Tailwind; installs shadcn if missing.
- **html**: no prerequisites — confirm the CDN-only approach and proceed.
- **Unknown profile**: skip silently.

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

2. **"Pause between stages for you to review artifacts before proceeding? (default: yes)"**
   - "yes" (default) → `confirmBeforeStages: true` — sprint waits for your confirmation at each stage
   - "no" → `confirmBeforeStages: false` — runs end-to-end without stopping (CI/automated use only)

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

For `design-kit.config.json`: merge the config values collected in Step 6 (projectRoot, confirmBeforeStages, locale, marketResearch, stackProfile) into the template before writing.

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
