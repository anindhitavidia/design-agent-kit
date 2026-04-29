---
description: >
  Stage 3.5 of the design sprint — polish loop for a rendered prototype. Scores the prototype
  against the design-qa rubric, makes one targeted fix per round, keeps or reverts based on
  score, stops when findings plateau or hit zero critical. Usage: /design-kit:design-iterate <project-path>
---

# /design-kit:design-iterate

Polish a rendered prototype through a score-based iteration loop. Each round runs design-qa,
picks ONE high-impact finding, fixes it in source, re-runs design-qa, and keeps the change
only if the score improved. Produces a polished prototype + iteration log.

## Steps

### 1. Parse the path argument

Argument: `<project-path>` — path to the project folder.
Optional flags:
- `--url <url>` — override the default dev URL
- `--max-rounds <n>` — default 5, hard cap 8

If not provided, ask: "Which prototype to iterate on? Provide the project folder path."

Read `design-kit.config.json` to resolve `<projectRoot>`.
Set `PROJECT_DIR` = the resolved project path.

### 2. Resolve date and URL

Get today's date in YYYY-MM-DD format.
Default URL: from `STATUS.md` if it has a `url:` field, otherwise ask the user.

### 3. Verify the project directory exists

If not found: stop — "Project not found at that path."

### 4. Verify dev server is reachable

Try to fetch the URL. If it fails:
"Dev server not reachable at [url]. Start it in another terminal, then retry."

Do not proceed without a live URL — this command operates on rendered output. If the project
has no dev server (e.g. HTML prototype opened directly in browser), note that design-qa
will use screenshot inspection instead.

### 5. Snapshot the starting state

Record the current commit hash:
```
git rev-parse HEAD
```

Tell the user: "Starting iteration on [project]. Max [max-rounds] rounds. Stopping at zero
critical findings or 2 consecutive rounds without score improvement."

### 6. Load the design-iterate skill

Load the `design-iterate` skill (at `plugins/core/skills/design-iterate/SKILL.md`).
Follow the loop contract exactly: score → stop conditions → pick ONE finding → fix → re-score
→ keep or revert → log.

### 7. Run the loop

Max-rounds default: 5. Hard cap: 8.

Per the skill:
- Save each round's diff: `PROJECT_DIR/_qa/.iterate-round-[N].patch`
- Append each round to `PROJECT_DIR/_qa/iterate-log-[date].md`

### 8. Finalize

Per the skill:
- Prepend the summary block to `iterate-log-[date].md`
- Clean up start-ref and start-diff scratch files; keep patches only for reverted rounds
- Do NOT commit automatically

### 9. Report to user

Report starting score, final score, kept fixes count, and out-of-scope findings.

End with:
> "Iterate complete. Review the diff, then commit when ready.
> Log: `PROJECT_DIR/_qa/iterate-log-[date].md`
> [If out-of-scope findings exist]: [N] findings need your judgment — see the log."
