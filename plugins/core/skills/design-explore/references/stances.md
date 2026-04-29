# Stances

Stances define the **challenge angle** each variant takes against the brief's committed
direction. Every stance is brief-anchored — there is no generic pre-brief exploration mode.

Default stances: **double-down**, **adjacent**, **invert**. Each stance represents a specific
hypothesis being tested about the brief.

## The Three Default Stances

### Double-down: "If the brief is right, this is its strongest form"

The double-down variant executes the brief's committed direction at its best. It strips out
hedges, sharpens the point of view, and commits fully. Its role is to give the brief its
fairest shot — so the critic can judge whether the brief deserves to win.

### Adjacent: "If the brief is close but miscalibrated, this is the adjustment"

The adjacent variant shifts the direction sideways. It accepts the brief's framing of the
problem but takes a neighboring path to the solution. Its role is to surface the case where
the brief is almost right — the user problem is correctly identified, but the solution lane
needs tuning.

### Invert: "If the brief is wrong, this is what the opposite looks like"

The invert variant takes the opposite direction. It identifies the brief's core directional
choice and commits to its opposite. Its role is to stress-test the brief's deepest assumption
— if invert wins, the brief's premise may be wrong.

## Stance Prompt Templates

Pass these to the variant agent. Substitute `[project]`, `[brief path]`, `[variant-dir]`,
`[date]`, and — crucially — `[committed direction]` (extracted from the brief) at dispatch time.

### Double-down

> "Build a variant for [project] that executes the brief's committed direction at its best.
>
> Committed direction from the brief: [committed direction]
>
> Read the full brief at: [brief path]
>
> Your stance: 'if the brief is right, this is what its strongest form looks like.' Strip
> hedges. Sharpen the point of view. Commit fully to the direction.
>
> Before building, read `docs/context/design-system.md` and the variant fidelity contract
> at the skill's `references/variant-fidelity.md` — you are building a sketch, not a
> prototype. Follow the DS Hard Gate; skip full state coverage, i18n, E2E tests.
>
> Write a `STANCE.md` in your variant dir with:
> - Stance: Double-down
> - Committed direction: [committed direction from brief]
> - What you sharpened: the specific places you committed harder than the brief did
>
> Write to: [variant-dir]/double-down/
> Do NOT wire into any index or navigation.
> Today's date: [date]."

### Adjacent

> "Build a variant for [project] that shifts the brief's committed direction sideways.
>
> Committed direction from the brief: [committed direction]
>
> Read the full brief at: [brief path]
>
> First, identify a neighboring path to the same user problem — a direction that accepts the
> brief's framing but takes a different route to the solution. Examples: if the brief commits
> to a wizard, adjacent might be a single form with progressive disclosure. If the brief
> commits to a dashboard, adjacent might be a feed of key events. The shift should be
> *sideways*, not opposite.
>
> Your stance: 'if the brief is close but miscalibrated, this is the adjustment.'
>
> Before building, read `docs/context/design-system.md` and the variant fidelity contract
> at the skill's `references/variant-fidelity.md` — you are building a sketch, not a prototype.
>
> Write a `STANCE.md` in your variant dir with:
> - Stance: Adjacent
> - Committed direction: [committed direction from brief]
> - Adjacent direction: the neighboring path you took
> - What stays the same vs. what shifts
>
> Write to: [variant-dir]/adjacent/
> Do NOT wire into any index or navigation.
> Today's date: [date]."

### Invert

> "Build a variant for [project] that inverts the brief's committed direction.
>
> Committed direction from the brief: [committed direction]
>
> Read the full brief at: [brief path]
>
> First, identify the brief's deepest directional assumption (not just the surface choice —
> the *reason* behind it). Then build assuming the opposite. Examples: if the brief assumes
> 'users want more control,' invert assumes 'users want less.' If the brief assumes 'this is
> a daily task,' invert assumes 'this is a rare task that should vanish from the day-to-day.'
>
> Your stance: 'if the brief is wrong, this is what the opposite looks like.'
>
> Before building, read `docs/context/design-system.md` and the variant fidelity contract
> at the skill's `references/variant-fidelity.md` — you are building a sketch, not a prototype.
>
> Write a `STANCE.md` in your variant dir with:
> - Stance: Invert
> - Assumption you inverted: the deep assumption, not the surface choice
> - Inverted premise: the opposite you committed to
> - What the variant looks like under that premise
>
> Write to: [variant-dir]/invert/
> Do NOT wire into any index or navigation.
> Today's date: [date]."

## Extracting the "Committed Direction" from the Brief

Before dispatching agents, extract the brief's committed direction. Look in:
1. The Strategic Recommendation section (primary source)
2. The User Problem resolution (what the brief says the user needs)
3. The Solution Framing or Design Intent section (if present)

The committed direction should be stateable in one sentence: "The brief commits to [approach]
because [reason]." If you can't write that sentence, the brief doesn't have a clear
committed direction — stop and tell the user to sharpen the brief before running Explore.

## When to Use Custom Stances

The default trio covers most cases. Use custom stances when the problem has a specific axis
that double-down/adjacent/invert doesn't capture. Rules:

- **Custom stances must still be brief-anchored.** A stance that doesn't relate to the brief
  can't be evaluated as a stress-test.
- **Name the challenge angle in the stance name.** "Minimalist" is bad — unclear what it's
  challenging. "Strip-to-one-action" is good — clear what the variant commits to.
- **Avoid fidelity-axis stances.** "Polished" vs "rough" is a fidelity question, not a
  direction. All variants use the same fidelity contract.

## Stance Anti-Patterns

Do NOT use these as stances — they produce non-comparable variants:

- **Generic quality axes** ("polished" / "rough") — fidelity is fixed by the contract
- **Abstract dualisms** ("simple" / "powerful") — always a false binary. Name the specific
  simplification vs. specific power move each stance commits to
- **Generic variations without brief anchor** — every stance must relate to the brief's
  committed direction. A stance with no relation to the brief isn't a challenge, it's noise.
