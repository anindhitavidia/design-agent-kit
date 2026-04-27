---
description: Generate release notes from recent commits and design-kit project state changes. Optionally scoped to a path.
---

# /design-kit:release-notes

## Usage

`/design-kit:release-notes [<scope-path>] [--since <date-or-ref>]`

## Behavior

Invoke the `release-notes` skill with the provided scope and time range.

Default scope: whole repo. Default range: since the last git tag, or last 7 days if no tags.
