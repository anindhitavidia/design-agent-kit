---
description: >
  Use this skill to polish a rendered prototype against the design-qa rubric. Scores the
  prototype, makes one targeted fix per round, keeps or reverts based on score. Based on
  the autoresearch method, applied to prototypes instead of skills. Loaded by
  /design-kit:design-iterate.
---

# Design Iterate Skill

Polish a rendered prototype through an iterative loop. Each round runs design-qa, picks ONE
high-impact finding, fixes it in source, re-runs design-qa, and keeps the change only if the
score improved (or held). Produces a polished prototype + an iteration log.

This skill does NOT generate new directions or variants — it refines what exists.

## Scoring Function

```
score = (count of critical findings × 3) + (count of warning findings × 1)
```

Lower is better. Critical findings are weighted 3× because they tend to correlate with DS
violations and accessibility failures that block review.

## Loop Contract

For each round (up to max-rounds, default 5, hard cap 8):

1. Run `/design-kit:design-qa` against the rendered URL (or manual inspection if no URL)
2. Compute score from findings
3. Check stop conditions (below)
4. Pick ONE finding to fix (see selection priority)
5. Apply exactly one logical change
6. Re-run design-qa, compute new score
7. Decide: keep or revert
8. Log the round

## Stop Conditions

Stop the loop when any of:
- Zero critical findings AND score unchanged from previous round
- Score has not improved for 2 consecutive rounds (plateau)
- Max rounds hit

## Finding Selection Priority

From the current findings, select ONE to fix this round. Priority order:

1. A `critical` finding with a clear, localized fix
2. A `warning` that is mechanically clear in this prototype's context (token swap, className
   fix that needed surrounding-content awareness)
3. A `critical` finding that requires reading 2–3 files to fix correctly

**Do NOT pick findings that:**
- Require design judgment that should sit with the designer (e.g. "primary CTA not visually
  dominant" — pick a different angle or skip)
- Require missing content (e.g. "no empty state") — content belongs in the prototype, not
  as a polish pass
- Cross-cut 4+ files or need orchestration across components

Record skipped findings under "Out of scope for iterate — needs human" in the log.

## Change Rules

- Edit exactly ONE file per round. Bundle cross-file edits only when the change requires both
  (e.g. moving a string to a translation key touches the template and the translations file —
  one logical change)
- Save each round's diff as a patch: `<project-dir>/_qa/.iterate-round-[N].patch`

## Keep / Revert Decision

After re-scoring:

- **New score < previous:** keep the change
- **New score == previous AND targeted finding is now absent:** keep (removed without regression)
- **New score > previous:** revert with `git checkout` on the specific file, log as "reverted"

## Log Format

Append to `<project-dir>/_qa/iterate-log-[date].md`:

```markdown
## Round [N]

- **Score before:** [X] ([C] critical, [W] warnings)
- **Score after:** [Y] ([C'] critical, [W'] warnings)
- **Targeted finding:** [short description] (`[file]:[line]`)
- **Change applied:** [one-line summary]
- **Result:** Kept / Reverted
- **Patch:** `.iterate-round-[N].patch`
```

Prepend a summary block at the top of the log:

```markdown
# Design Iterate Log — [date]

**Project:** [project]
**URL:** [url or "manual inspection"]
**Rounds run:** [N]
**Stop reason:** [zero critical / plateau / max rounds]
**Starting score:** [X]
**Final score:** [Y]
**Findings fixed:** [count]
**Findings reverted:** [count]
**Out of scope (human needed):**
- [list]
```

## Completion

Do NOT commit automatically — leave the working tree for the user to review the diff.

## When to Use

- After `/design-kit:prototype`, before stakeholder review
- As a quality gate at the top of `/design-kit:handoff-prep`
- Standalone, on any existing prototype

## When NOT to Use

- Generating new directions → use `/design-kit:design-explore`
- Fixing broken functionality — this is polish, not debug
- Reviewing DS components → use `/design-kit:review-component`
