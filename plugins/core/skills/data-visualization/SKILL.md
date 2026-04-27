---
description: Use when selecting chart types, planning data visualizations, or designing dashboard layouts. Reasons about WHAT chart type to use and WHY based on data shape, user intent, and accessibility requirements. Does not generate framework-specific code — that lives in stack profile skills (e.g. data-viz-react).
---

# Data Visualization Skill

## What This Skill Does

When invoked for a data visualization task, reason about:

- **Chart type selection** — use the decision tree below, not habit or aesthetics
- **Color strategy** — categorical, sequential, or diverging data call for different palettes
- **Accessibility** — color alone is never sufficient; every chart needs a text alternative
- **Dark mode** — charts must work in both light and dark contexts
- **Data honesty** — mock data should tell a plausible story, not be random noise
- **Composition** — how charts relate to each other in a dashboard layout

This skill produces reasoning and recommendations. Actual component implementation is handled by the active stack profile (e.g. `data-viz-react` for React/Recharts environments).

---

## 1. Chart Type Decision Tree

| Data shape | Use | Not |
|-----------|-----|-----|
| Single KPI value | KPI Card with trend indicator | Pie chart, bar chart |
| Part-to-whole (2-5 categories) | Donut / Stacked Bar | Pie chart (no pie charts — ever) |
| Trend over time (1-3 series) | Line Chart / Area Chart | Bar chart |
| Trend over time (4+ series) | Small Multiples (line) | Single chart with overlapping lines |
| Comparison across categories | Horizontal Bar Chart | Vertical bar (when labels are long) |
| Distribution | Histogram / Box Plot | Pie chart |
| Correlation | Scatter Plot | Table |
| Status/health overview | Heatmap / Traffic Light Grid | Individual gauges |
| Tabular detail with trends | Table with inline sparklines | Chart (when user needs exact values) |

---

## 2. Color Rules for Data

**Categorical data (distinct groups):**
- Maximum 6 distinct colors per chart
- Order by visual weight — most important series gets the strongest color
- Use the design system's chart color tokens (e.g. `--color-chart-1` through `--color-chart-5`)

**Sequential data (low to high):**
- Single hue, vary lightness
- Use one base color at varying opacities (100%, 70%, 40%, 20%)

**Diverging data (negative to positive):**
- Error/danger color → neutral gray → success color
- Center point must be visually neutral

**Accessibility — mandatory:**
- Never rely on color alone — add patterns, labels, or shape differentiation
- All palettes must pass WCAG AA against both light and dark backgrounds
- Consider simulated protanopia/deuteranopia when selecting palettes
- Always include a text alternative (tooltip, table view, or screen-reader-only labels)

---

## 3. Dark Mode Considerations

Charts must work in both light and dark contexts. Key principles:

- Chart backgrounds should be transparent, inheriting from the container surface
- Grid lines and axis labels should use semantic tokens, not hardcoded colors
- Tooltip backgrounds should use the container surface token, not hardcoded white
- SVG text elements do not inherit CSS class-based color — pass color via explicit attributes using CSS variable references

When specifying chart implementation to a stack profile, note which elements need dark-mode-safe color handling.

---

## 4. Dashboard Composition Patterns

**Layout hierarchy:**
- Lead with KPI cards (the "so what?") before detail charts
- Group related metrics spatially
- Give each chart a clear title that states the insight, not just the metric name ("License utilization dropped after reorg" beats "License Utilization")

**Density:**
- 7+ data series on a single chart become unreadable — group smaller categories into "Other" or switch to small multiples
- Prefer small multiples over overlapping lines when individual trends matter more than total

**Interaction:**
- Tooltips are mandatory for any chart where exact values matter
- Linked highlighting across charts aids comparison (note this as a requirement for the stack profile)

---

## 5. Mock Data Guidelines

When producing sample or placeholder data for visualization design:

- **Never random** — data should tell a story (trends, spikes, seasonal patterns)
- **Realistic variance** — not perfectly smooth curves; include natural noise
- **Plausible ranges** — match the domain's actual metric shapes
- **Narrative structure** — data should have a "so what?":
  - "Q3 spend spiked because 3 new tools were onboarded"
  - "Monday tickets are 2x the weekday average"
  - "Utilization dropped after the team reorg"

---

## 6. Common Pitfalls

**Pie charts are almost always wrong.**
Use donut for part-to-whole (max 5 slices), horizontal bar for comparison. Pie charts distort perception of area. This skill recommends against them in all cases.

**Stacked charts distort individual series.**
Stacked area/bar makes it hard to read individual series values — only the bottom series has a flat baseline. Use small multiples when individual trends matter more than total.

**Line charts and missing data.**
Interpolating across data gaps hides the absence of data. Default to showing gaps rather than connecting across them, unless you have a specific reason to interpolate.

**Axis label overflow on small viewports.**
Long category names overflow on mobile. Switch to horizontal bar chart or apply angled/abbreviated labels. Flag this as a responsive requirement for the stack profile.

**Tooltip contrast in dark mode.**
The default Recharts (and many other library) tooltip uses a white background that breaks in dark mode. Always specify that tooltip backgrounds must use the surface token.

**Responsive container sizing.**
Wrapping a chart's responsive container inside a flex child without constraining the minimum width causes infinite resize loops in some libraries. Specify `min-w-0` or equivalent on the parent flex item.
