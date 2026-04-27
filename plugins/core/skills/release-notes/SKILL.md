---
description: Use when generating release notes or changelogs for components, prototypes, or DS updates. Reads git history and design-kit project STATUS.md files to produce a structured changelog.
---

# Generating release notes

## Inputs
- A time range (default: since last tag, or last 7 days)
- An optional scope path (e.g. `design-kit/projects/sso-rollout/`)

## Process

1. Run `git log --oneline --since="<range>"` (and `-- <scope>` if provided).
2. Group commits by type (feat, fix, refactor, chore, docs).
3. For each design-kit project touched, read its `STATUS.md` and surface state transitions.
4. Output a markdown changelog with sections: New, Changed, Fixed, Internal.

## Output format

```markdown
# Release Notes — YYYY-MM-DD

## New
- ...

## Changed
- ...

## Fixed
- ...

## Internal
- ...
```

Keep entries one line. Reference commit SHAs and PR numbers when available.
