# Architecture

`design-agent-kit` is a Claude Code plugin marketplace hosting two plugins: a stack-agnostic core and a React/Next.js stack profile.

## Repo layout

```
design-agent-kit/
├── .claude-plugin/marketplace.json    ← marketplace manifest
├── plugins/
│   ├── core/                          ← design-kit plugin
│   │   ├── .claude-plugin/plugin.json
│   │   ├── agents/                    ← 8 design agents
│   │   ├── skills/                    ← 6 skills (including design-sprint-runner)
│   │   ├── commands/                  ← 10 commands
│   │   ├── hooks/hooks.json           ← session-start hook
│   │   ├── schemas/v1/                ← 5 JSON Schemas
│   │   └── templates/                 ← scaffolded by /design-kit:init
│   └── react-nextjs/                  ← design-kit-react-nextjs plugin
│       ├── .claude-plugin/plugin.json
│       ├── skills/                    ← 8 React/Next.js skills
│       └── commands/                  ← 4 commands
├── tests/
│   ├── schemas/                       ← JSON Schema test suite
│   ├── init/                          ← scaffolding tests
│   ├── smoke/                         ← e2e contract tests
│   └── fixtures/
└── scripts/
    └── validate-marketplace.mjs
```

## Plugin architecture

### Core plugin (`design-kit`)

Stack-agnostic. Provides:
- **Agents** — reason about design, UX, brand, data; don't generate framework code
- **Skills** — the `design-sprint-runner` orchestrates the pipeline; others are standalone tools
- **Commands** — entry points; most are thin dispatchers or wrappers over skills
- **Schemas** — JSON Schema for each artifact; validate R-tier fields before proceeding
- **Hook** — `SessionStart` surfaces in-flight sprint projects on session start

### Stack profile (`design-kit-react-nextjs`)

Implements the executing layer for React/Next.js. Must provide:
- `prototype` command — reads `02-design-spec.md`, scaffolds the prototype
- `handoff-prep` command — packages for engineering handoff

Contributes no agents — reuses core's `design-engineer` and `qa-designer`.

## Core ↔ stack-profile contract

### Discovery

`design-kit.config.json` at the user's repo root:
```json
{ "stackProfile": "react-nextjs" }
```

Core reads this to determine which profile to dispatch to.

### Dispatch

Core invokes:
```
/design-kit-{stackProfile}:prototype <project-path>
/design-kit-{stackProfile}:handoff-prep <project-path>
```

These are the only two commands a stack profile **must** implement.

### Artifact contract

Core writes these files; stack profiles read them:

```
<projectRoot>/<project>/
├── STATUS.md                 ← state machine
├── 01-data-intent.md         ← Stage 1 output
├── 02-brief.md               ← Stage 2 brief
├── 02-design-spec.md         ← cross-plugin boundary (strictest validation)
├── _components/              ← Stage 3 (stack-profile writes)
├── page.{tsx,...}            ← Stage 3 (stack-profile writes)
└── 04-handoff/               ← Stage 4 (stack-profile writes)
    ├── handoff-package.md
    ├── component-spec.md
    ├── a11y-report.md
    └── screenshots/
```

## Artifact tier system

| Tier | Meaning | Behavior on missing |
|---|---|---|
| R (required) | Must exist; JSON-Schema validated | Block + fix-loop |
| G (recommended) | Slot exists in template | QA warning, stage proceeds |
| F (free) | Body content | No validation |

The cross-plugin boundary (`02-design-spec.md`) is the strictest: all its key fields are R-tier.

## Init flow

`/design-kit:init` scaffolds editable context files into the user's repo from `plugins/core/templates/`. Files are skipped if they already exist (idempotent). The scaffold script (`plugins/core/scripts/scaffold.mjs`) handles the file copy with optional config substitution.

## Authoring a stack profile

1. Create a Claude Code plugin with a `plugin.json` whose `name` follows `design-kit-{stack}` convention.
2. Implement `commands/prototype.md` and `commands/handoff-prep.md` following the contract above.
3. Read `02-design-spec.md` frontmatter (validated against `plugins/core/schemas/v1/design-spec.schema.json`) to drive scaffolding.
4. Write outputs into `<project-path>/` and `<project-path>/04-handoff/`.
5. Update `STATUS.md` as stages complete.
6. Optionally submit a PR to this repo to add the profile to the marketplace.
