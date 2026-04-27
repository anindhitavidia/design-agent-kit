---
description: Stage 4 dispatcher. Reads design-kit.config.json → stackProfile and invokes /design-kit-{stackProfile}:handoff-prep. Use when the prototype is ready for engineering handoff.
---

# /design-kit:handoff-prep

## Usage

`/design-kit:handoff-prep <project-name>`

## Behavior

1. Read `design-kit.config.json` → `stackProfile`.
2. Verify `<project-path>/STATUS.md` shows `state: prototype-ready` or later. Otherwise abort.
3. Invoke `/design-kit-{stackProfile}:handoff-prep <project-path>`.
