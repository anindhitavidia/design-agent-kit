---
description: Lint a design-kit project's artifacts for G-tier (recommended) field completeness. Non-blocking — surfaces warnings without failing.
---

# /design-kit:lint

## Usage

`/design-kit:lint <project-path>`

## Behavior

1. For each artifact in the project (STATUS.md, 01-*, 02-*, 04-*), validate against its schema.
2. R-tier failures → error (rare; the orchestrator should have caught these).
3. Surface G-tier missing fields as warnings with file:line references.
4. Print a summary: total fields checked, R errors, G warnings.

## Output format

```
design-kit:lint design-kit/projects/sso-rollout

  ✓ STATUS.md (R: 2/2, G: 1/1)
  ✓ 01-data-intent.md (R: 3/3, G: 1/2 — missing: key_metrics)
  ⚠  02-brief.md (R: 4/4, G: 1/3 — missing: success_criteria, out_of_scope)
  ✓ 02-design-spec.md (R: 4/4, G: 4/4)

  4 files checked. 0 errors, 4 warnings.
```
