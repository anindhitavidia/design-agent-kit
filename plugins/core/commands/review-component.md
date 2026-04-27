---
name: review-component
description: >
  Runs QA on a component using the component-qa skill, auto-fixes mechanical BLOCKERs,
  re-runs QA until clean (max 3 rounds), then surfaces WARNINGs for human judgment.
  Automates the review-fix-re-review cycle.
  Invoke with /review-component [ComponentName].
---

# Review Component Command

Automates the QA review loop: run checks → fix BLOCKERs → re-run → repeat until clean.
Mechanical issues are fixed automatically. Design judgment calls are surfaced for you.

## Steps

### 1. Parse the component name

Argument: component name in PascalCase (e.g., `Alert`, `Notification`, `TopNavigation`).

If not provided, ask: "Which component to review?"

Read `docs/context/design-system.md` to determine:
- The component directory path (from the project's component library location)
- QA report output location: `<component-directory>/[ComponentName]/QA_REPORT.md`

Verify the component directory exists. If not, stop: "Component not found at that path."

### 2. Load QA knowledge

Load `.claude/skills/component-qa/SKILL.md` for the QA procedure, severity system, and gotchas.

### 3. Run initial QA (Round 1)

Follow the component-qa skill procedure:

**Step 0:** Read `docs/context/design-system.md` and any component-specific design rules.

**Step 1:** Run automated checks from `.claude/skills/component-qa/references/automated-checks.md`:
- Hardcoded value scan (hex, px, rgba)
- TypeScript check
- Import barrel check
- Token conformance (against the project's token system)
- Dark mode token check
- Responsive check
- Motion check

**Step 2:** Run code quality checks:
- cva pattern (or equivalent class-composition utility)
- forwardRef shape
- File structure
- Naming conventions

**Step 3:** Run engineering readiness checks:
- README completeness
- Design rules sync
- Export wiring (barrel exports)

Classify every finding as BLOCKER, WARNING, or PASS using the skill's severity system.

Tell the user: "Round 1 QA complete. Found [N] BLOCKERs, [N] WARNINGs."

### 4. Auto-fix loop

If there are BLOCKERs, enter the fix loop. Max 3 rounds.

**What is auto-fixable (BLOCKERs only):**

| Issue | Auto-fix |
|-------|----------|
| Hardcoded hex color | Replace with design token (look up in `docs/context/design-system.md` or token file) |
| Hardcoded px value | Replace with design system spacing class or token |
| Direct path import | Replace with barrel import (as declared in `docs/context/design-system.md`) |
| Missing displayName | Add `ComponentName.displayName = "ComponentName"` |
| Missing forwardRef | Wrap component in `React.forwardRef` |
| TypeScript error | Fix the type error |
| Missing barrel export | Add to the design system components index file |

**What is NOT auto-fixable (leave for human):**

| Issue | Why |
|-------|-----|
| Figma deviation | May be intentional design decision |
| Missing component state (loading, error) | Needs design spec for what it should look like |
| Accessibility gap (missing ARIA) | Needs understanding of interaction intent |
| Animation/motion mismatch | Needs design judgment |
| README content gaps | Needs author knowledge |
| Design rules mismatch | May need design rules update, not code change |

**For each round:**

a. List the BLOCKERs that are auto-fixable.
b. Fix them — one file edit per issue, commit nothing yet.
c. Re-run the automated checks that were failing.
d. If new BLOCKERs appear from the fix (regression), revert that fix.
e. Report: "Round [N]: Fixed [N] BLOCKERs. [N] remaining."

**Stop the loop when:**
- Zero BLOCKERs remain, OR
- No auto-fixable BLOCKERs remain (only human-judgment issues left), OR
- Max 3 rounds reached

### 5. Generate QA report

Use the report template from `.claude/skills/component-qa/references/report-template.md`.

Write `QA_REPORT.md` to the component directory.

Include a fix log section at the end:

```markdown
## Auto-Fix Log

| Round | Issue | Fix applied | Result |
|-------|-------|-------------|--------|
| 1 | Hardcoded #4361ee in hover state | Replaced with design token | Fixed |
| 1 | Direct path import | Changed to barrel import | Fixed |
| 2 | Missing displayName | Added ComponentName.displayName | Fixed |
```

### 6. Append to QA history log

Append one line to `<component-directory>/[ComponentName]/qa-history.log`:

```
[YYYY-MM-DD] | [Pass/Conditional Pass/Blocked] | [N] blockers, [N] warnings | auto-fixed: [summary]
```

Example:
```
2026-03-19 | Blocked | 3 blockers, 2 warnings | auto-fixed: 2 hardcoded hex, 1 import
2026-03-19 | Conditional Pass | 0 blockers, 2 warnings | auto-fixed: 0
2026-03-20 | Pass | 0 blockers, 0 warnings | clean
```

Create the file if it doesn't exist. Always append, never overwrite.

The `QA_REPORT.md` is always the latest run (overwritten each time). The log provides history.

### 7. Present results to the user

**If zero BLOCKERs and zero WARNINGs:**
> "QA passed clean. [ComponentName] is ready for promotion.
> Report: `<component-directory>/[ComponentName]/QA_REPORT.md`"

**If zero BLOCKERs but WARNINGs remain:**
> "All BLOCKERs resolved ([N] auto-fixed). [N] WARNINGs need your review:
>
> 1. **[WARNING title]** — [description]. Fix or document rationale?
> 2. **[WARNING title]** — [description]. Fix or document rationale?
>
> Report: `<component-directory>/[ComponentName]/QA_REPORT.md`
> Address WARNINGs or accept them, then the component is ready for promotion."

**If BLOCKERs remain (not auto-fixable):**
> "Auto-fixed [N] BLOCKERs, but [N] remain that need manual intervention:
>
> 1. **[BLOCKER title]** — [description + why it can't be auto-fixed]
>
> Report: `<component-directory>/[ComponentName]/QA_REPORT.md`
> Fix these manually, then run `/review-component [ComponentName]` again."

### 8. Commit

Stage and commit the QA report, history log, and any auto-fixed files:

```bash
git add <component-directory>/[ComponentName]/
git commit -m "qa([ComponentName]): auto-review — [N] fixes, [verdict]"
```
