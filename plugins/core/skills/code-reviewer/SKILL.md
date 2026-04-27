---
description: Use when reviewing code for quality, design system compliance, build correctness, and test coverage. Triggers on: "Review this code", "code review", "check code quality", "/code-review". Runs a structured 3-iteration loop until clean.
---

# Code Reviewer — 3-Iteration Review Loop

Structured code review with severity levels, build verification, test checks, and PR comment resolution. Runs up to 3 iterations until clean.

Reads coding rules from the repo's `CODING_GUIDELINES.md` and `REVIEW.md` (paths configured in `design-kit.config.json` → `contextPaths.codingRules`). These files are scaffolded by `/design-kit:init`.

---

## 1. Outer Loop

```
for iteration in 1..3:
  Phase 0: Branch sync
  Phase 1: Code review
  Phase 2: Build checks
  Phase 3: Tests
  Phase 4: PR comment resolution

  if zero issues in all phases → break early

After 3 iterations: document remaining issues in summary report
```

---

## 2. Phase 0: Branch Sync

```bash
git fetch origin main
```

If behind main:
```bash
git rebase origin/main
```

If already up to date, skip.

---

## 3. Phase 1: Code Review

1. Get changed files: `git diff --name-only origin/main...HEAD`
2. Read the repo's `CODING_GUIDELINES.md` and `REVIEW.md` to load project-specific rules before reviewing.
3. For each changed file in `app/` paths, check against the severity levels below.
4. **Skip:** design system internals, `.github/`, `scripts/`, config files, CSS token files.

### Severity Levels

#### Critical (must fix — auto-fix in agent mode)

| Code | Rule |
|------|------|
| C01 | Design system import violation — importing DS internals in consumer code |
| C02 | Hardcoded colors — hex values, raw color functions, framework color utilities where semantic tokens should be used |
| C03 | Raw HTML elements where a DS component equivalent exists (e.g. `<button>`, `<input>`, `<select>`, `<dialog>`) |
| C04 | `any` type or `@ts-ignore` suppression |
| C05 | Security — hardcoded secrets, unsanitized dangerous HTML injection |
| C06 | Committed binary or generated files that should not be in source |
| C07 | DS component API misuse — wrong prop names or values per the component's documented API |
| C08 | Inline style objects where utility classes exist |
| C09 | Bulk violations — 3+ DS violations in a single file → flag for full rewrite |

#### Important (fix before merge)

| Code | Rule |
|------|------|
| I01 | Missing dark mode — custom color without a dark-mode pair |
| I02 | Missing accessible name — icon-only interactive element without `aria-label` |
| I03 | File over 800 lines — should be split into smaller components |
| I04 | Missing class composition utility — manual string concatenation for dynamic class names |
| I05 | Commented-out code blocks |
| I06 | Wrong import order — should be: DS → framework → external → internal → types |
| I07 | Props interface not defined before the component function |
| I08 | Structural DS violation — styled raw element used where a DS composite exists (e.g. styled `<div>` as card, `<span>` as badge) |
| I09 | Missing DS composite — custom implementation where an equivalent DS component exists |
| I10 | Missing internationalization — user-facing text not wrapped in the project's i18n utility |
| I11 | Missing translations — new string added in one locale but not others |

#### Advisory (nice to have)

| Code | Rule |
|------|------|
| A01 | File over 300 lines — consider splitting |
| A02 | Naming conventions — component or file name doesn't match project conventions |
| A03 | Missing "why" comment — non-obvious logic without explanation |
| A04 | Duplicated pattern — pattern exists elsewhere in the codebase; consider extracting |

### Auto-Fix Behavior

- **Agent-triggered:** Auto-fix all Critical findings (C01–C09). Re-review after fixes. Report Important and Advisory for human judgment.
- **Manual `/code-review`:** Report all findings. Do not auto-fix unless the user asks.
- **C09 (bulk violations):** When triggered, rewrite the entire file with DS rules loaded — don't patch individual lines.

### DS Compliance Checks

When reviewing files, check against any DS component mapping documented in the repo (e.g. a `ds-component-mapping.md` file or equivalent). Look for:

- Raw HTML elements where DS equivalents exist → C03
- Inline style objects where utility classes exist → C08
- Styled raw elements acting as DS composites → I08
- Custom implementations where DS composites exist → I09

---

## 4. Phase 2: Build Checks

Run the project's build and lint commands sequentially. Fix failures before proceeding.

Typical commands (adapt to the project's `package.json` scripts):
```bash
npm run build    # TypeScript compilation
npm run lint     # ESLint / linter
```

If the project has a DS enforcement scanner, run it first:
```bash
npm run review:ds   # if available
```

If any check fails:
1. Fix the issues
2. Re-run the failing check to verify
3. Continue to Phase 3

---

## 5. Phase 3: Tests

Run the project's test suite. Scope to affected areas when only one component or feature changed.

- Fix test failures. Re-run to verify.
- Skipped tests don't count as failures.
- If no tests exist for the affected area, note it and skip this phase.

---

## 6. Phase 4: PR Comment Resolution

**Skip if no PR exists.**

If a PR exists:
1. Fetch comments: `gh api repos/{owner}/{repo}/pulls/{number}/comments`
2. For each unresolved comment:
   - Read the comment and the code it references
   - Fix the issue
   - Reply to the comment with what was fixed
3. Push fixes
4. Re-check for new comments (up to 3 sub-iterations on comments)

---

## 7. Report Template

Output this after the loop completes:

```markdown
## Code Review Summary

**Branch:** <branch-name>
**Iterations:** N of 3
**Status:** PASS / ISSUES_REMAINING

### Per-Iteration Results

| Iteration | Review Findings | Build | Tests | PR Comments | Status |
|-----------|----------------|-------|-------|-------------|--------|
| 1         | N fixed        | pass/fail | N fixed | N resolved | ... |
| 2         | N fixed        | pass  | N fixed | N resolved | ... |
| 3         | 0              | pass  | 0       | 0          | CLEAN  |

### Remaining Issues (if any)
- ...
```

---

## 8. What NOT to Flag

- Raw utility colors for non-themed elements **when paired with dark mode variants** (e.g., `bg-red-50 dark:bg-red-900/20`)
- Layout elements (`<div>`, `<section>`, `<main>`, `<p>`, `<h1>`–`<h6>`) — not DS components
- Files under 800 lines (soft target is 200–400 but only flag above 800)
- Code inside design system internals using raw values
- Skipped tests (documented as known limitations)
- `style={{}}` for dynamic computed values (percentage widths, grid templates from data)
