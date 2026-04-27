---
description: Use when scaffolding Playwright e2e tests for prototypes built with design-kit-react-nextjs. Generates tests colocated with the prototype.
---

# E2E Testing with Playwright

Scaffold Playwright e2e tests for a Next.js prototype.

## Setup assumptions

- Playwright is installed as a dev dependency (`@playwright/test`)
- Config at `playwright.config.ts` in the repo root
- Tests colocated with prototype at `<project-path>/_e2e/`

## Test structure

```ts
import { test, expect } from '@playwright/test';

test.describe('<Feature Name>', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/path-to-prototype');
  });

  test('happy path — <description>', async ({ page }) => {
    // arrange
    // act
    // assert
  });
});
```

## What to test for design prototypes

1. **Page renders** — not blank, main content visible
2. **Key interactions** — button clicks, form submissions, navigation
3. **State transitions** — empty → loading → result / error
4. **Accessibility** — run `@axe-core/playwright` on the page
5. **Responsive** — test at mobile (375px) and desktop (1280px) viewports

## Accessibility check pattern

```ts
import { checkA11y } from 'axe-playwright';

test('page is accessible', async ({ page }) => {
  await page.goto('/path');
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true }
  });
});
```

## Common assertions

```ts
// Visible text
await expect(page.getByText('Submit')).toBeVisible();

// Form interaction
await page.getByLabel('Email').fill('test@example.com');
await page.getByRole('button', { name: 'Submit' }).click();

// Error state
await expect(page.getByRole('alert')).toContainText('required');

// Loading state
await expect(page.getByRole('status')).toBeVisible();
await expect(page.getByRole('status')).toBeHidden(); // resolves

// Success state
await expect(page.getByText('Success')).toBeVisible();
```

## File naming

- Test files: `<feature-name>.spec.ts`
- Colocated at `<project-path>/_e2e/<feature-name>.spec.ts`

## When to skip e2e

- Pure presentational components with no interaction → use unit tests instead
- Data-fetching components → mock the API in e2e, test the UI response only
