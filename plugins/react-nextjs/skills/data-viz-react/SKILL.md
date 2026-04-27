---
description: Use when generating React data-visualization components (charts, dashboards). Pairs with the design-kit core data-visualization skill which handles chart selection reasoning. Uses Recharts by default; adapt to the project's viz library.
---

# Data Visualization — React

Generate React data visualization components once the chart type and data structure are decided (use the core `data-visualization` skill for reasoning about chart selection).

## Default stack assumptions

- **Recharts** for most charts (BarChart, LineChart, AreaChart, ScatterPlot, PieChart)
- **ResponsiveContainer** wrapping for all charts
- Tailwind for layout and spacing
- Data comes as typed arrays/objects from the parent component

## Component structure

```tsx
// Always: ResponsiveContainer wrapping
// Always: typed data prop
// Always: consistent color usage from design system tokens
// Never: hardcoded pixel dimensions for charts
```

## Key patterns

### Bar chart
```tsx
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="value" fill="var(--color-primary)" />
  </BarChart>
</ResponsiveContainer>
```

### Line chart with multiple series
- Use `<Legend>` for multiple series
- Each series gets a distinct color from the design system token palette
- Dots on data points only when N < 20

### Pie / Donut
- Use `innerRadius` for donut variant
- Max 6 slices; group remainder as "Other"
- Add `<Tooltip>` with percentage formatter

## Accessibility

- All charts must have an accessible description (`aria-label` on the container or a visible heading)
- Color is never the sole means of distinguishing data series — use patterns or labels too
- Provide a data table alternative for screen reader users when the chart carries unique data

## Mock data

- Generate realistic mock data matching the declared data shape
- Use constants (not inline literals) for mock arrays
- Name mock files `_mock-data.ts` colocated with the component

## When to reach for alternatives

- visx / D3: only for custom or animated charts not supported by Recharts
- Victory: if the project already uses it
- Never mix chart libraries in the same project
