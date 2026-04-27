---
name: design-qa
description: >
  Runs automated design QA on a rendered URL. Orchestrates Playwright capture,
  source analysis, and agent evaluation.
  Usage: /design-qa <url> [--brief <path>] [--context "description"] [--specs <path>]
  [--session <path>] [--repo <path>]
---

# Design QA Command

Load `.claude/skills/design-qa/SKILL.md` for tier definitions, category specs, gotchas, and report format.

## Steps

### 1. Parse arguments

Expected: `/design-qa <url> [--brief <path>] [--context "description"] [--specs <path>] [--session <path>] [--repo <path>]`

Extract: `url` (required), `--brief`, `--context`, `--specs`, `--session`, `--repo`.
If `url` is missing, ask: "Which URL should I run design QA on?"

### 2. Determine context tier

Use the tier table from `.claude/skills/design-qa/references/tier-logic.md`.
Tell the user: "Running Tier [N] QA on [url]."

### 3. Resolve output directory

Read `design-kit.config.json` to determine the project's `<projectRoot>` and output path conventions.

**Prototype URL** (matching a known project path):
- Output: `<projectRoot>/<project>/_qa/design-qa-[date].md`

**External URL** — derive `<slug>` from last URL path segment; ask user for project context if not obvious:
- Output: `<projectRoot>/<project>/_qa/[date]-[slug]/design-qa-[date].md`

Create output directory if needed.

### 4. Run Playwright capture

```bash
cd foundation/tools/design-qa && node capture.js [url] [output-dir] [session-path-or-empty]
```

Verify `capture-results.json` and screenshots exist in `<output-dir>`.

### 4b. Run source analysis (if --repo available)

Resolve repo path: explicit `--repo` > `config.repoMappings` hostname match > skip (DOM-only mode).

```bash
cd foundation/tools/design-qa && node source-analysis.js <url-path> <repo-path> <output-dir>
```

### 4c. Delegate categories 1-8 to @qa-designer

> "Evaluate the captured output against the project's design system rules.
> Read `docs/context/design-system.md` for token, spacing, and component standards.
> Output directory: [output-dir]. Read capture-results.json and all screenshots.
> [If source-analysis.json exists]: Also read it — evaluate categories 1-8.
> [If absent]: Categories 7-8 in DOM-only mode via domSnapshot.
> Save raw-findings.json to [output-dir]. Report back: counts + top 3 findings."

### 4d. Run typography checks (auto-detect)

Check if the captured page contains any special script text or locale-specific markers in the DOM snapshot.

If locale-specific typography signals are detected (e.g., non-Latin scripts, `lang` attributes), include typography quality evaluation in the @qa-designer instruction:

> "Additionally evaluate typography quality for detected scripts: check text density, heading wrapping,
> URL overflow, form readability, table density, mixed-script naturalness, mobile behavior, and contrast."

Add typography findings to `raw-findings.json` under a `typographyChecks` key.

If no special typography signals detected, skip this step silently.

### 5. Delegate category 9 — UX review

Depth varies by tier — see `.claude/skills/design-qa/references/category-definitions.md`.

Invoke a UX-focused agent (or use the `qa-designer` agent for UX categories):

> "Run Category 9 (UX Flow & Edge Cases) for [url]. Raw findings at: [output-dir]/raw-findings.json.
> [--brief]: evaluate flow completeness against spec. [--specs]: use acceptance criteria.
> [--context]: edge cases within described scope. [none]: general UX hygiene.
> Source verification rule applies — see skill gotchas."

### 6. Assemble QA report

Use the report template from `.claude/skills/design-qa/references/report-template.md`.
Write to the path resolved in Step 3. Bundle report and `source-analysis.json` in the same commit.

### 7. Report to user

Follow the user reporting instructions in `.claude/skills/design-qa/references/report-template.md`.
