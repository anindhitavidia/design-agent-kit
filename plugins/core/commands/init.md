---
description: One-time setup for design-kit in this repo. Asks 4-6 questions, scaffolds DESIGN.md, REVIEW.md, CODING_GUIDELINES.md, design-kit.config.json, and docs/context/*.md into the user's working tree. Idempotent — re-running skips existing files.
---

# /design-kit:init

Set up design-kit in the current repo.

## Behavior

1. **Detect or pick the stack profile.**
   - Run `/plugin list` (or inspect `~/.claude/plugins/installed_plugins.json`) to find installed `design-kit-*` plugins.
   - If exactly one stack profile is installed, default to it.
   - If multiple, ask which.
   - If none, warn: "Stage 3 and Stage 4 of the design sprint won't run end-to-end without a stack profile. Continue with discovery-only mode?" Proceed if user confirms.

2. **Ask 4-6 setup questions:**
   - "Where should design-kit projects live?" (default: `design-kit/projects/`)
   - "Path to your design system docs (or create a placeholder)?" (default: `docs/context/design-system.md`, scaffold if missing)
   - "Existing brand docs to point at, or scaffold a placeholder?"
   - "Pause and confirm before each sprint stage runs?" (default: no)
   - "Locale for outputs?" (default: `en`)
   - "Append a 'Design Kit' section to existing CLAUDE.md, or create one?"

3. **Run the scaffold script** with the collected config:

```bash
node plugins/core/scripts/scaffold.mjs --target . --config <collected-config>
```

   (The Node script lives in the plugin cache; run via the absolute path Claude resolves at session start.)

4. **Append Design Kit section to CLAUDE.md** at the user's repo root (creating CLAUDE.md if absent):

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

5. **Print summary:**
   - List files created (with paths)
   - List files skipped (already existed)
   - Print 3 next steps:
     1. "Edit `docs/context/brand.md`, `personas.md`, etc. to fill in TODOs."
     2. "Run `/design-kit:design-sprint <project-name>` to start your first sprint."
     3. "Read `<plugin-cache>/design-kit/README.md` for full docs."

## Idempotency

Re-running `/design-kit:init` is safe. It skips existing files and reports what's missing. Pass `--force` to overwrite (asks for confirmation per file).

## Error cases

- If no `package.json` or `.git/` is found at the target root, warn: "This doesn't look like a project root. Run from your repo root, or pass `--target <path>`."
- If the user's `design-kit.config.json` already exists with a different `stackProfile`, ask before overwriting.
