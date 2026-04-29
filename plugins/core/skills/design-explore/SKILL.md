---
description: >
  Use this skill to stress-test a design brief. Generates alternative directions that
  challenge the brief's committed direction, ranks them with a critic signal, and reports
  whether the brief is validated, should be revised, or should be rejected. Brief-anchored
  adversarial exploration — not generic variant generation. Loaded by /design-kit:design-explore.
---

# Design Explore Skill

Stress-test a design brief by generating alternative directions and ranking them against the
brief's committed direction. Explore is **adversarial** — its job is to find the best case
for alternatives so the designer can validate, revise, or reject the brief before expensive
prototype work.

Variants are **comparative sketches** — real enough to walk the primary flow and judge the
stance, not shippable prototypes.

## The Design Loop This Supports

```
Diverge (brainstorm) → Converge (brainstorm synthesis)
          ↓
      Commit (brief)
          ↓
Diverge again (Explore) — adversarial challenge to the brief
          ↓
Validate, revise, or reject
          ↓
Prototype with confidence (or loop back)
```

The brief becomes a **hypothesis under test**, not a decree. If alternatives lose, the
commitment is validated. If alternatives win, the brief gets revised before prototype work.

## When Exploration Helps

- **Brief is high-stakes** and you want to validate it before committing to a full prototype
- **You suspect the brief's direction may be wrong** and want to test alternatives concretely
- **Stakeholders disagreed during brief writing** — variants make the tension reviewable

## When Exploration Doesn't Help

- Brief is obvious and low-stakes — stress-testing isn't worth the time
- Polishing an existing prototype → use `/design-kit:design-iterate`
- **No brief exists** → write one first via `/design-kit:design-brief`. Explore is always brief-anchored.

## Output Contract

If a stack profile is active and has a `design-explore` command, variants go to
`<project-dir>/_variants/[date]/[stance-name]/`. Each variant directory is a mini-prototype:
a main view file, components, and a `STANCE.md` describing the choice.

`_variants/` is gitignored — variants are not canonical code. The designer reviews the
critic signal (validate/revise/reject) and decides next steps.

If no stack profile is active (discovery-only), variants are text-based direction descriptions
written to `<project-dir>/02.5-design-explore.md`.

**Variants MUST NOT:**
- Be wired into any index or navigation
- Include E2E tests, translations files, or full state coverage

**Variants MUST:**
- Follow the DS Hard Gate from `docs/context/design-system.md` and `docs/context/coding-rules.md`
- Include a `STANCE.md` naming the stance and its relation to the brief's committed direction
- Be runnable (for stack-profile variants) so the critic can walk through them

## Flow

1. **Read the brief** — extract the committed direction, business problem, user problem,
   success criteria, constraints. The committed direction is whatever the brief's Strategic
   Recommendation section (or equivalent) has settled on.
2. **Stop if no clear direction** — if the brief doesn't commit to a direction, Explore has
   nothing to stress-test. Tell the user: "Brief doesn't commit to a direction. Run
   brainstorming first, or sharpen the brief before running Explore."
3. **Extract the committed direction** in one sentence: "The brief commits to [approach]
   because [reason]." If you can't write that sentence, stop.
4. **Create the variant directory tree** (if stack profile active).
5. **Dispatch variant generation in parallel** — one agent per stance (see `references/stances.md`),
   single message with multiple tool calls. Use the `design-engineer` skill or equivalent.
6. **Each variant writes to its own subdirectory** independently. No shared state.
7. **Rank the variants** — evaluate each variant against the brief's committed direction.
   Produce a scorecard and a validate/revise/reject/under-specified signal.
8. **Present the signal to the designer**, not just the winner.
9. **Do not commit** — leave the variant directory for designer review.

## Stance Selection

Default stances challenge the brief from three angles — **double-down**, **adjacent**,
**invert**. See `references/stances.md` for full templates.

All stances are **brief-anchored**. There is no generic pre-brief mode.

Rules:
- Default N is 3. Two gives a false binary; five is hard to hold in your head when comparing.
- Hard cap N at 5.
- Never duplicate stances in one run.
- Custom stances must still be brief-anchored (named against the committed direction).

## Parallelization Safety

Each variant agent must write to its OWN subdirectory. Use the per-stance subdirectory as the
isolation boundary. If agents collide on shared paths, variants will corrupt each other silently.

The variant agent prompt must explicitly say: "Write to `<variant-dir>/<stance-name>/`.
Do NOT write to `<project-dir>/_components/` or any shared path."

## Critic Signal — The Primary Output

Evaluate the variants and report a **validate / revise / reject / under-specified** signal.
This signal is the primary output — more important than the raw scorecard.

| Winner | Signal | Next action |
|---|---|---|
| Double-down | **Validate** | Brief is sound — proceed to prototype with confidence |
| Adjacent | **Revise** | Brief direction is close but miscalibrated — update brief before prototype |
| Invert | **Reject** | Brief's core premise may be wrong — return to brainstorming |
| All variants weak | **Under-specified** | Brief needs sharpening before any stance can land |

## Scoring for Variants

When a stack profile is NOT active (text-based variants), evaluate each direction against:
1. Fit for the user problem (does it solve the stated need?)
2. Brief alignment or departure (does it support, adjust, or challenge the committed direction?)
3. Feasibility given the design system and constraints in context files

Assign a score from 0–20 per variant. Apply the signal based on which direction wins.

## Gotchas

- **Parallel variant agents must write to different directories.** Per-stance subdirectory is
  the isolation. If they collide, one overwrites the other silently.
- **Variants are not prototypes.** Don't run the full prototype checklist on them. Don't
  run design-iterate on them. If Explore validates, promote via prototype — that adds
  the full polish layer.
- **The DS Hard Gate still applies to stack-profile variants.** Using DS components is
  *faster* than mocking them.
- **Don't merge variants into a composite winner.** If the critic signals revise or reject,
  the designer decides whether to revise the brief or restart — don't invent a hybrid
  direction that nobody committed to.
- **Every stance must name how it relates to the brief.** A stance that ignores the brief
  can't be evaluated as a stress-test.

## References

- `references/stances.md` — brief-anchored stance templates (double-down, adjacent, invert)
- `references/variant-fidelity.md` — what variants keep and skip
