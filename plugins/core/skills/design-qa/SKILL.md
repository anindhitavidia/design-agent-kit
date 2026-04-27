---
description: Use when running visual, accessibility, interaction, and performance QA on a rendered URL or prototype. Triggers on: "Run design QA on [url]", "QA this prototype", "check this page for a11y issues", "validate against design standards".
---

# Design QA Skill

## Purpose

Capture rendered UI and evaluate it against the project's design rules. Produces a structured QA report covering 9 categories:

- **Categories 1-8** — visual, responsive, dark mode, a11y, interaction, performance, provenance, tokens
- **Category 9** — UX flow & edge cases

## Tools

Use the active stack profile's QA tooling to capture screenshots and DOM snapshots. The skill describes WHAT to evaluate; the stack profile determines HOW to run the capture tools.

- **Screenshot + DOM capture**: headless browser screenshot and DOM snapshot at configured viewport sizes
- **Source analysis**: static analysis of component source files (when repo path is available)
- **Claude vision**: screenshot evaluation against design rules

## Execution Order

Follow these steps in order. Source analysis runs before visual evaluation so findings are grounded in code, not guesses.

```
Step 1: Resolve context tier
  - Determine tier from available inputs (URL, brief, specs, repo, session)
  - Announce to the user: "Running Tier [N] QA on [url]." before starting

Step 2: Run source analysis (when repo path available)
  - Run static analysis on the component source
  - Produces component provenance, token conformance, naming checks
  - Skip if no repo path provided (DOM-only mode)

Step 3: Capture screenshots
  - Use the active stack profile's QA tooling to capture at all configured viewports
  - Pass session/auth flags if the URL requires authentication

Step 4: Source verification gate
  - Verify screenshots are from the target URL (check page title, URL bar, visible content)
  - If screenshots show a login page, error page, or wrong URL: stop and report the issue
  - Do not proceed to evaluation with stale or incorrect captures

Step 5: Evaluate categories 1-8
  - Use screenshots + source analysis findings
  - Source analysis informs categories 7 (provenance) and 8 (token conformance)

Step 6: Evaluate category 9
  - UX flow & edge case review (depth varies by context tier — see below)

Step 7: Assemble report
  - Merge findings into the report template
  - Commit QA report and source-analysis output together (never separately)
```

## Context Tiers

QA depth is determined by the context provided alongside the URL.

| Available context | Tier | Depth |
|------------------|------|-------|
| URL + design brief | Tier 1 | Full QA: all 9 categories |
| URL + PM specs | Tier 2 | Full QA: acceptance criteria as flow specification |
| URL + description | Tier 3 | Targeted QA: described scope + design compliance |
| URL only | Tier 4 | Design compliance scan only (categories 1-6 + 7-8 DOM-only + 9 general UX hygiene) |

### Tier depth detail

- **Tier 1**: Category 9 evaluates flow completeness against the design spec + edge cases
- **Tier 2**: Category 9 evaluates flow completeness against acceptance criteria + edge cases
- **Tier 3**: Category 9 scoped to described scope + general hygiene; no spec-level flow check
- **Tier 4**: Categories 7-8 in DOM-only mode (class names + computed styles); category 9 is general UX hygiene only

## Categories

### Category 1: Visual Fidelity
Design token compliance, spacing, typography, color usage, alignment with the project's visual language.

### Category 2: Responsive
Layout behavior across viewport breakpoints. Mobile, tablet, desktop. Overflow handling, grid/flex adaptation.

### Category 3: Dark Mode
Correct semantic token usage in dark mode. No hardcoded colors bleeding through. Contrast ratios maintained.

### Category 4: Accessibility
WCAG AA compliance. ARIA roles, keyboard navigation, focus management, color contrast, screen reader compatibility.

### Category 5: Interaction States
All interactive elements show correct states: default, hover, focus, active, disabled, loading, error.

### Category 6: Performance
Render performance, bundle size concerns, unnecessary re-renders, heavy animations, image optimization.

### Category 7: Component Provenance
Which design system components are used vs. raw HTML that should use a DS component instead.

- **With repo path**: full source-level analysis
- **Without repo path**: DOM-only mode — class names and computed styles only

### Category 8: Token & Naming Conformance
CSS custom property usage, class naming, hardcoded values that should be tokens, naming convention adherence.

- **With repo path**: full source-level analysis
- **Without repo path**: DOM-only mode — class names and computed styles only, no source-level root cause

### Category 9: UX Flow & Edge Cases
Flow completeness, edge case coverage, information hierarchy, error states, empty states, loading states. Depth varies by tier (see Context Tiers above).

## Report Format

```markdown
# Design QA Report — [page slug]

**URL:** [url]
**Date:** [YYYY-MM-DD]
**Context tier:** [Tier 1–4 description]
**Overall:** [status + label] ([N] critical, [N] warnings)

---

## Visual Fidelity
[findings]

## Responsive
[findings]

## Dark Mode
[findings]

## Accessibility
[findings]

## Interaction States
[findings]

## Performance
[findings]

## Component Provenance
[findings]
[If DOM-only: "Re-run with repo path for source-level analysis."]

## Token & Naming Conformance
[findings]
[If DOM-only: note source-level root cause unavailable]

## UX Flow & Edge Cases
[findings — depth varies by tier]

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | [N] |
| Warning  | [N] |
| Pass     | [N] |
```

### Overall status logic

- Any critical finding → **Blocked** — "Resolve critical findings before handoff."
- Warnings only → **Needs Attention** — "Warnings included in report — handoff can proceed."
- No findings → **Passes** — "Looks good — ready for handoff."

## Gotchas

### Source verification rule
If a finding mirrors a finding from another page (same issue, same pattern by analogy), you must read the actual source file before asserting it. Analogies are hypotheses, not evidence. A finding fabricated by analogy without source verification must not appear in the report.

### Auth-gated URLs
URLs behind SSO/OAuth need a saved session or auth token passed to the capture tool. Without it, the capture will return a login page instead of the target UI.

### Categories 7+8 without repo path
When no repo path is provided, categories 7 (Component Provenance) and 8 (Token & Naming Conformance) run in DOM-only mode. The report should note this limitation and suggest re-running with a repo path.

### Commit bundling
Always commit QA report and source-analysis output together — they are one artifact. Never commit the report without its source analysis, or commit them in separate commits.
