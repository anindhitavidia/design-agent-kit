# design-agent-kit

A Claude Code plugin marketplace for design agents and orchestration. Ships a stack-agnostic design-sprint pipeline with pluggable brand, design-system, and stack configuration.

## What's in the box

| Plugin | Provides |
|---|---|
| `design-kit` | 9 design agents, 7 skills, 13 commands, init scaffolding, 5 JSON Schemas, session-start hook |
| `design-kit-react-nextjs` | 8 skills, 5 commands implementing the prototype/handoff-prep contract |

## Quick start

```bash
# In Claude Code:
/plugin marketplace add anindhitavidia/design-agent-kit
/plugin install design-kit@design-agent-kit
/plugin install design-kit-react-nextjs@design-agent-kit

# In your repo:
/design-kit:init
/design-kit:design-sprint <project-name>
```

## The design sprint pipeline

`/design-kit:design-sprint` runs a 4-stage pipeline:

1. **Data & Intent** — `data-analyst` + `market-researcher` agents produce `01-data-intent.md`; use `data-viz-engineer` for data-heavy features
2. **Design Brief** — `ux-designer` + `product-designer` agents produce `02-brief.md` + `02-design-spec.md`
3. **Prototype** — dispatched to the active stack profile (`design-kit-react-nextjs:prototype`)
4. **Handoff Prep** — dispatched to the active stack profile (`design-kit-react-nextjs:handoff-prep`)

Each stage's artifacts are JSON-Schema validated before the next stage begins.

## Configuration

`/design-kit:init` scaffolds a `design-kit.config.json` at your repo root and creates context files under `docs/context/`:

```json
{
  "stackProfile": "react-nextjs",
  "projectRoot": "design-kit/projects",
  "contextPaths": {
    "brand": "docs/context/brand.md",
    "designSystem": "docs/context/design-system.md",
    "personas": "docs/context/personas.md",
    "codingRules": "docs/context/coding-rules.md"
  },
  "confirmBeforeStages": false
}
```

Fill in the context files with your brand, design system, and persona details. Agents read them at runtime.

Key config options:

| Field | Default | Description |
|---|---|---|
| `stackProfile` | `"react-nextjs"` | Which stack profile plugin to dispatch Stage 3 & 4 to |
| `confirmBeforeStages` | `true` | Pause for human review between every stage. Set to `false` only for automated/CI runs |
| `marketResearch` | `"light"` | `"light"` = training knowledge only (token-efficient); `"full"` = web search enabled; `"off"` = skip |

## Updating

Claude Code doesn't auto-update plugins. To get the latest agents, skills, and commands:

```bash
/plugin marketplace remove design-agent-kit
/plugin marketplace add anindhitavidia/design-agent-kit
/plugin install design-kit@design-agent-kit
/plugin install design-kit-react-nextjs@design-agent-kit
```

Your repo files (`design-kit.config.json`, `docs/context/`, `DESIGN.md`, etc.) are never touched by a reinstall — only the plugin cache is replaced. If a new version adds config options you want (check the [CHANGELOG](CHANGELOG.md)), add them to your `design-kit.config.json` manually.

## Authoring a stack profile

A stack profile is a second Claude Code plugin that implements two required commands:

- `prototype` — reads `02-design-spec.md`, scaffolds the prototype
- `handoff-prep` — packages the prototype for engineering handoff

See [docs/architecture.md](docs/architecture.md) for the full contract.

## Commands

### Core (`design-kit`)

| Command | Description |
|---|---|
| `/design-kit:init` | One-time setup — scaffolds config and context files |
| `/design-kit:design-sprint <project>` | Full 4-stage pipeline |
| `/design-kit:design-brief <project>` | Stages 1-2 only (research + brief) |
| `/design-kit:prototype <project>` | Stage 3 dispatcher |
| `/design-kit:handoff-prep <project>` | Stage 4 dispatcher |
| `/design-kit:design-qa <url>` | Visual + a11y + perf QA on a URL |
| `/design-kit:brand-audit [path]` | Brand consistency audit |
| `/design-kit:component-review <name>` | Component readiness audit |
| `/design-kit:review-component <name>` | QA automation with auto-fix loop |
| `/design-kit:data-insights` | Pull analytics and generate design insights |
| `/design-kit:design-spec <project>` | Generate post-prototype engineering spec |
| `/design-kit:release-notes` | Changelog from recent changes |
| `/design-kit:lint <project>` | Non-blocking G-tier artifact validation |

### React/Next.js profile (`design-kit-react-nextjs`)

| Command | Description |
|---|---|
| `/design-kit-react-nextjs:prototype <project>` | Stage 3 — scaffold Next.js prototype |
| `/design-kit-react-nextjs:handoff-prep <project>` | Stage 4 — package for handoff |
| `/design-kit-react-nextjs:build-component <name>` | Build a standalone DS component |
| `/design-kit-react-nextjs:e2e-scaffold <project>` | Scaffold Playwright e2e tests |
| `/design-kit-react-nextjs:data-viz <project>` | Build data visualization / dashboard prototype |

## Contributing

PRs welcome. Run `npm test` and `npm run validate:marketplace` before submitting.

## License

TBD — will be set before first public release.
