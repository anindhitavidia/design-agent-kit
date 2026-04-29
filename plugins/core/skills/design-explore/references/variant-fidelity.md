# Variant Fidelity Contract

A variant is a **comparative sketch**, not a shippable prototype. The fidelity rules here
are what separates a variant from a prototype.

## The Principle

A variant exists to compare directions, not to ship work. The designer needs just enough
fidelity to walk the primary flow and feel the choice. Anything beyond that is wasted effort
that obscures the comparison.

**Target budget:** ~10–15 minutes per variant agent, not hours.

## What Variants Keep

### DS Hard Gate — non-negotiable

Variants follow the DS Hard Gate from `docs/context/design-system.md` and
`docs/context/coding-rules.md`. Using DS components is *faster* than mocking them:

- Imports from the project's design system package (per `docs/context/design-system.md`)
- Semantic tokens (no hardcoded hex, no raw utility palette values)
- No raw HTML elements where a DS component exists
- No inline `style={{}}` for visual styling — use utility classes with tokens
- `cn()` or equivalent for class composition
- All component conventions from `docs/context/coding-rules.md`

### What DS gives variants for free

Because variants use DS components, they automatically inherit:

- **Motion / animation** — DS components ship with transitions and micro-interactions. No
  custom animation work needed.
- **Dark mode** — DS components use semantic tokens that resolve correctly in dark mode, as
  long as custom elements also use semantic tokens.
- **Responsiveness** — DS components are responsive by default. No custom breakpoint work
  needed for DS-only layouts.
- **Accessibility basics** — DS components have correct ARIA, keyboard handling, and focus
  management built in.

### Content

- **Real copy** — realistic context for the product domain. Lorem ipsum obscures intent.
- **Real data shapes** — realistic quantities. A table with 2 rows doesn't show the same
  stance as a table with 20.

### Flow

- **Primary flow walkable end-to-end** — the variant demonstrates the stance on the user's
  main task.
- **STANCE.md** — every variant dir contains a `STANCE.md` naming the stance, the key choice,
  and (for contrarian variants) the inverted assumption.

## What Variants Skip

### Custom polish work

- **Custom animation orchestration** — page transitions, scroll-triggered animations.
  DS component motion is enough.
- **Full state coverage** — skip loading, empty, error, skeleton states unless the stance
  lives in one of them (e.g. a stance about "make the empty state the onboarding moment"
  must obviously implement the empty state).
- **i18n / translations** — single language only. No translation setup.

### Wiring and scaffolding

- **Navigation / index wiring** — variants are not public-facing. Don't wire into any domain
  index page or app-level navigation.
- **E2E tests** — no test scaffolding. Variants are reviewed manually, not via Playwright.
- **Design specs / handoff docs** — variants are proposals; specs happen after promotion.

### Review gates

Because variants live in gitignored `_variants/`, they are exempt from:

- Code review / CI lint — skip
- DS enforcement scripts (`npm run review:ds` or equivalent) — skip (gitignored)
- design-qa — skip during variant generation

## Promotion to Prototype

When the designer picks a winning variant, promotion goes through `/design-kit:prototype`:

1. Designer names the project and confirms the direction
2. `/design-kit:prototype` runs against the same brief, using the winning variant as the
   reference direction
3. `/design-kit:prototype` adds back everything variants skipped: full state coverage,
   custom animation, i18n, E2E tests, navigation wiring, code review, DS enforcement scan

The variant is the seed; the prototype is the crop. Variants should never be "polished into"
a prototype in place — promotion is an explicit, clean transition via `/design-kit:prototype`.

## Anti-Pattern: The Polished Variant

If a variant looks and feels like a full prototype, something went wrong. Symptoms:

- Custom animation on scroll or entrance
- Loading skeletons on everything
- i18n scaffolding
- E2E tests
- Navigation wiring

Reject these and re-run with the fidelity contract made explicit in the agent prompt. A
variant that takes the same time as a prototype provides no leverage.
