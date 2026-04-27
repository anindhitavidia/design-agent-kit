---
description: One-time setup for design-kit in this repo. Asks setup questions, scaffolds DESIGN.md, REVIEW.md, CODING_GUIDELINES.md, design-kit.config.json, and docs/context/*.md into the user's working tree. Can bootstrap design-system.md and brand.md from a Figma link, GitHub URL, or npm package. Idempotent — re-running skips existing files.
---

# /design-kit:init

Set up design-kit in the current repo.

## Behavior

1. **Detect or pick the stack profile.**
   - Run `/plugin list` (or inspect `~/.claude/plugins/installed_plugins.json`) to find installed `design-kit-*` plugins.
   - If exactly one stack profile is installed, default to it.
   - If multiple, ask which.
   - If none, warn: "Stage 3 and Stage 4 of the design sprint won't run end-to-end without a stack profile. Continue with discovery-only mode?" Proceed if user confirms.

2. **Ask setup questions:**
   - "Where should design-kit projects live?" (default: `design-kit/projects/`)
   - "Pause and confirm before each sprint stage runs?" (default: no)
   - "Locale for outputs?" (default: `en`)
   - "Market research depth during sprints? `light` uses training knowledge only (token-efficient, default). `full` enables web search for current competitive data. `off` skips it." (default: `light`)
   - "Append a 'Design Kit' section to existing CLAUDE.md, or create one?"

3. **Bootstrap the design system context** — ask:

   > "Do you have a design system? Share one of: a Figma library link, a GitHub URL, an npm package name, or type 'none' to scaffold a template."

   Handle each case:

   **Figma link** (`figma.com/...`):
   - Use the Figma MCP (`get_libraries`, `search_design_system`, `get_variable_defs`) to fetch the component list, color styles, text styles, and spacing tokens.
   - Write a populated `docs/context/design-system.md` with the real component inventory, import path slot, and token summary pulled from Figma.

   **GitHub URL** (`github.com/...`):
   - Fetch the repo's README and any barrel export file (e.g. `src/index.ts`, `index.js`) to extract the exported component names.
   - Write a populated `docs/context/design-system.md` with the component list and a TODO for the import path.

   **npm package name** (e.g. `@acme/design-system`):
   - Fetch the package page on npmjs.com or the package README to extract component exports.
   - Write a populated `docs/context/design-system.md` with the component list and the correct import path already filled in.

   **none / skip**:
   - Scaffold the rich template from `plugins/core/templates/docs/context/design-system.md`.

4. **Bootstrap the brand context** — ask:

   > "Do you have brand documentation? Share a Figma file link (for color and text styles), a URL to brand guidelines, or type 'none' to scaffold a template."

   Handle each case:

   **Figma link** (`figma.com/...`):
   - Use the Figma MCP (`get_variable_defs`, `get_design_context`) to fetch color variables, text styles, and any design system rules defined in Figma.
   - Write a populated `docs/context/brand.md` with real palette names/values, typography scale, and spacing philosophy pulled from Figma.

   **URL** (any other URL):
   - Fetch the page and summarize it into `docs/context/brand.md`: extract voice/tone description, palette, typography, and any stated design principles.

   **none / skip**:
   - Scaffold the rich template from `plugins/core/templates/docs/context/brand.md`.

5. **Run the scaffold script** with the collected config (skips files already written in steps 3–4):

   ```bash
   node plugins/core/scripts/scaffold.mjs --target . --config <collected-config>
   ```

6. **Append Design Kit section to CLAUDE.md** at the user's repo root (creating CLAUDE.md if absent):

   ```markdown
   ## Design Kit

   This repo uses [`design-agent-kit`](https://github.com/anindhitavidia/design-agent-kit). Configuration: `design-kit.config.json`.

   Common commands:
   - `/design-kit:design-sprint <project-name>` — run the full design sprint pipeline
   - `/design-kit:design-brief` — research + brief only
   - `/design-kit:design-qa <url>` — run QA on a rendered URL
   - `/design-kit:brand-audit` — check brand consistency

   Context files agents read: `DESIGN.md`, `REVIEW.md`, `CODING_GUIDELINES.md`, `docs/context/*.md`.
   ```

7. **Print summary:**
   - List files created (with paths), noting which were bootstrapped from Figma/GitHub/URL vs scaffolded from template
   - List files skipped (already existed)
   - Print 3 next steps:
     1. "Review and fill in any remaining TODOs in `docs/context/`."
     2. "Run `/design-kit:design-sprint <project-name>` to start your first sprint."
     3. "Run `/design-kit:brand-audit` to validate brand context is complete enough for agents."

## Idempotency

Re-running `/design-kit:init` is safe. It skips existing files and reports what's missing. Pass `--force` to overwrite (asks for confirmation per file).

## Error cases

- If no `package.json` or `.git/` is found at the target root, warn: "This doesn't look like a project root. Run from your repo root, or pass `--target <path>`."
- If the user's `design-kit.config.json` already exists with a different `stackProfile`, ask before overwriting.
- If Figma MCP is not available and user provided a Figma link, warn and fall back to the rich template. Tell the user to install the Figma MCP and re-run with `--force` to populate from Figma later.
- If a URL fetch fails, warn and fall back to the rich template.
