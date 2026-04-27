---
description: Stage 3 dispatcher. Reads design-kit.config.json → stackProfile and invokes /design-kit-{stackProfile}:prototype. Use when you have a validated 02-design-spec.md and want to scaffold the prototype.
---

# /design-kit:prototype

## Usage

`/design-kit:prototype <project-name>`

## Behavior

1. Read `design-kit.config.json` → `stackProfile`.
2. Validate `<project-path>/02-design-spec.md` against the schema. If R fields missing, abort.
3. Invoke `/design-kit-{stackProfile}:prototype <project-path>`.

## Refusal cases

- `stackProfile` not set → tell user to run `/design-kit:init` or set it in config.
- The dispatched plugin not installed → tell user to install it from the marketplace.
- `02-design-spec.md` invalid or missing → tell user to run `/design-kit:design-brief` first.
