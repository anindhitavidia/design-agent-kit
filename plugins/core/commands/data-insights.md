---
name: data-insights
description: >
  Pulls analytics data from the project's analytics source and writes a structured insight file.
  Supports hierarchical paths: /data-insights <product> for a high-level cross-domain insight,
  or /data-insights <product>/<domain> for a domain-specific insight.
  Hands off to a product designer agent to append design recommendations.
---

# Data Insights Command

## Purpose

Connect real user behavior data from the project's analytics source into the design workflow.
Produces an insight file co-authored by the data analyst and product designer, scoped to the
right level of the hierarchy.

## Directory Structure

Insights follow the product → domain hierarchy, rooted at `<projectRoot>` from `design-kit.config.json`:

```
<projectRoot>/
└── [product]/
    ├── insights/                      ← high-level, cross-domain insight
    │   └── analytics-insight-YYYY-MM-DD.md
    └── [domain]/
        └── insights/                  ← domain-specific insight
            └── analytics-insight-YYYY-MM-DD.md
```

## Steps

### 1. Parse the path argument

The argument is a slash-separated path, e.g. `payments` or `payments/checkout-flow`.

- **One segment** (e.g. `payments`) → high-level insight. Insight file goes in:
  `<projectRoot>/[product]/insights/`
  Analytics scope: query all known modules for that product.

- **Two segments** (e.g. `payments/checkout-flow`) → domain insight. Insight file goes in:
  `<projectRoot>/[product]/[domain]/insights/`
  Analytics scope: query only the matching domain/module.

If no argument is passed, ask:
"What scope would you like insights for? Examples:
- `payments` — high-level across all payment modules
- `payments/checkout-flow` — Checkout Flow domain only"

### 2. Resolve today's date

Get today's date in YYYY-MM-DD format. Use this concrete date in all subsequent steps — do not pass `[YYYY-MM-DD]` as a literal string.

### 3. Ensure the insights directory exists

Create the directory if it doesn't exist:
- High-level: `<projectRoot>/[product]/insights/`
- Domain: `<projectRoot>/[product]/[domain]/insights/`

### 4. Delegate to data-analyst

Invoke @data-analyst with this instruction (fill in the resolved values):

> "Pull analytics data for [scope description — either 'all [product] modules' or 'the [domain] module'].
> Use the project's analytics source (configured in the project or described in docs/) to get:
> page analytics, funnel analysis, event analytics, and a daily summary for the past 7 days.
> If the domain name doesn't map to any known section in the analytics source, ask the user to clarify before proceeding.
> Write your output to: [resolved insight file path]
> Today's date is [date resolved in Step 2]."

Wait for the analyst to confirm the file is written.

If the analyst reports an error or the file is not confirmed written, stop and report the error to the user. Do not proceed to the designer.

### 5. Delegate to product-designer for design recommendations

Invoke a product designer agent with this instruction:

> "Read [resolved insight file path].
> Append after the last line of the file, preceded by a blank line, your Design Recommendations section.
> Use your standard output format: Problem Statement, Area, User–Business Alignment, Strategic Fit,
> Recommendation, Risks & Tradeoffs."

### 6. Confirm completion

Tell the user:
- The file location
- A one-line summary of the top design recommendation
- What to do next (e.g. share with team, use as input for a wireframe, move to handoff)
