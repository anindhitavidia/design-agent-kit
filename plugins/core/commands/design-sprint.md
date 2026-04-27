---
description: Run the full 4-stage design sprint for a project. Invokes the design-sprint-runner skill, orchestrating across core agents and the active stack profile.
---

# /design-kit:design-sprint

## Usage

`/design-kit:design-sprint <project-name>`

Or `/design-kit:design-sprint <project-path>` for explicit project path.

## Behavior

1. Read `design-kit.config.json`. Verify `stackProfile` is set; abort with install instructions if not.
2. Resolve project path: `<projectRoot>/<project-name>` if name only, else use the path.
3. If the project folder doesn't exist, create it with an empty `STATUS.md` (`state: wip, last_stage: 01-data-intent`).
4. Use the `design-sprint-runner` skill to run all 4 stages, with stage-by-stage confirmations if `confirmBeforeStages: true`.
5. On completion, print the location of `04-handoff/handoff-package.md` and suggest `/design-kit:release-notes` for changelog generation.

## Resume

If `STATUS.md` already exists, start from `last_stage` rather than from Stage 1.
