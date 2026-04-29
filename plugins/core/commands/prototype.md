---
description: Stage 3 dispatcher. Reads design-kit.config.json → stackProfile and invokes /design-kit-{stackProfile}:prototype. Use when you have a validated design-brief-[date].md and want to scaffold the prototype.
---

# /design-kit:prototype

## Usage

`/design-kit:prototype <project-name>`

## Behavior

1. Read `design-kit.config.json` → `stackProfile`, `customStack`.
2. Find the most recent `design-brief-[date].md` in `<project-path>`. Validate R fields (stage, project, problem, target_users) against `brief.schema.json`. If R fields missing, abort.
3. Dispatch based on `stackProfile`:
   - **`react-nextjs` or `html`**: invoke `/design-kit-{stackProfile}:prototype <project-path>`.
   - **`custom`**: invoke `design-engineer` agent directly. The agent reads `docs/context/design-system.md` for component imports and conventions, and generates the prototype into the project using the user's existing stack.
   - **`null` / `discovery-only`**: stop — "Stages 3–4 are disabled in discovery-only mode."

## Refusal cases

- `stackProfile` not set → tell user to run `/design-kit:init` or set it in config.
- `stackProfile` is a plugin name but the plugin is not installed → tell user to install it from the marketplace.
- `design-brief-[date].md` invalid or missing → tell user to run `/design-kit:design-brief` first.
