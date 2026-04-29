---
description: Run only Stages 1 and 2 of the design sprint (research + design brief). Stops before prototyping. Useful when you want to align on direction before committing to building anything.
---

# /design-kit:design-brief

## Usage

`/design-kit:design-brief <project-name>`

## Behavior

Run Stages 1–2 of `design-sprint-runner`. Stop after `design-brief-[date].md` is written and validated.

The brief is one document covering both the problem framing (problem statement, target users,
success criteria, constraints) and the design direction (layout pattern, DS components needed,
interactions, states). There is no separate design-spec at this stage — that is the engineering
handoff artifact produced in Stage 4.

Print suggestion: `/design-kit:design-sprint <project-name>` to continue with Stages 3–4, or `/design-kit:prototype <project-name>` to run just Stage 3.
