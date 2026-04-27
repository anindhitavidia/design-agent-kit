---
description: >
  Scaffold Playwright e2e tests for a design-kit project prototype. Takes a project path as argument.
  Generates fixtures, handlers, test specs, constants, and a handoff README colocated at
  <project-path>/_e2e/. Invoke with /e2e-scaffold <project-path>.
---

# E2E Scaffold Command

## Purpose

Generate Playwright E2E test scaffold files (fixtures, handlers, test specs) from a design
spec's acceptance criteria. The generated files live under `<project-path>/_e2e/` and are
designed to be runnable against the local prototype immediately, then handed off to engineers
for merge into the target repo's `e2e/` directory.

Can be invoked standalone or as part of `/design-kit-react-nextjs:handoff-prep`.

## Steps

### 1. Parse the path argument

Argument: `<project-path>` — an absolute or repo-relative path to the project folder
(e.g., `design-kit/projects/sso-rollout/` or `app/projects/invoice-flow/`).

If not provided, ask: "Which project to generate E2E scaffold for? Provide the project folder path."

Set:
- `PROJECT_DIR` = the resolved project path
- `FEATURE` = derived from the project folder name (snake_case, e.g., `sso_rollout`, `invoice_flow`)

### 2. Verify prerequisites

Check that the design spec exists inside `PROJECT_DIR`:
- Look for `02-design-spec.md`, `design-spec*.md`, or any markdown file whose frontmatter contains `stage: 2` or `type: design-spec`.

If missing, stop: "No design spec found at `PROJECT_DIR`. Run the design-spec stage first to generate one."

Read the design spec fully. Extract:
- The acceptance criteria list (e.g., AC-001, AC-002, …)
- The file/component mapping table (to determine feature name for test files)
- The component mapping (to understand data shapes and UI states)

### 3. Determine feature name

Derive the feature name from the design spec's file mapping table or the project folder name.
This becomes the filename stem for generated files (e.g., `sessions`, `policies`, `invoices`).

### 4. Read prototype data shapes

Scan `PROJECT_DIR/_data/*.ts` (or equivalent mock data files) to understand the data structures
the prototype renders. These inform the fixture factory functions.

**Extract actual content values for test selectors.** Instead of inventing strings, pull real
values that the prototype renders. For example:

```ts
// Extracted from _data/sessions.ts
const FIRST_ITEM_TITLE = "VPN access request for new employee";
const STATUS_OPEN = "Open";
```

Store these as named constants in the generated test file so assertions target actual rendered
content, not invented strings. This prevents false failures from content mismatches and makes
tests self-documenting.

### 5. Generate fixture file

Write `PROJECT_DIR/_e2e/fixtures/<feature>.ts`:

Structure:
1. **Header comment block** — must include:
   - "These fixtures extend the existing target repo's `e2e/fixtures/<feature>.ts` (if one exists)"
   - "When handing off to eng, merge into the existing file — do NOT replace it"
   - List of new additions
   - Pattern reference: point to the repo's existing fixture convention

2. **TypeScript interfaces** — matching response shapes from the prototype's `_data/` files

3. **Factory functions** — `create<Entity>(overrides: Partial<Entity> = {}): Entity` pattern
   with sensible defaults. Each factory covers a test scenario variant:
   - Base/default variant
   - One variant per unique state needed by acceptance criteria (e.g., empty, error, loading-done)

4. **Response builders** — named exports matching response shapes:
   - List response (with pagination where applicable)
   - Detail response
   - Empty response (for empty state tests)

### 6. Generate handler file

Write `PROJECT_DIR/_e2e/handlers/<feature>.ts`:

Structure:
1. **Header comment block** — same pattern as fixtures:
   - "These handlers extend the existing target repo's `e2e/mocks/handlers/<feature>.ts` (if one exists)"
   - List new handlers to add (or note "none — existing handlers cover all procedures")
   - What changes (e.g., "fixture imports should be updated to use richer variants")

2. **Handler map** — maps route/procedure names to mock response functions using fixtures.
   Structure the handlers to match the project's API style (REST or tRPC):
   - For tRPC: `Record<string, (input: unknown) => unknown>` keyed by procedure name
   - For REST: MSW-style request handlers

3. **Future handler stubs** — commented-out handlers for features marked "Coming Soon" in the design spec

### 7. Generate constants file

Write `PROJECT_DIR/_e2e/constants.ts`:

```ts
/**
 * Base path for this project's pages in the prototype.
 *
 * Prototype: /<project-path-relative-to-app-root>
 * Target repo: update this value when copying to the engineering repo.
 *
 * Update this value when copying files to the target eng repo.
 */
export const BASE_PATH = "/<project-path-relative-to-dev-server>";
```

Replace the path with the actual dev-server URL segment for this prototype.

### 8. Generate README with handoff instructions

Write `PROJECT_DIR/_e2e/README.md`:

```markdown
# E2E Test Scaffold

These tests run against the local prototype dev server.
To run: `npx playwright test` from the repo root (or `npm run e2e` if configured).

## Files

- `fixtures/<feature>.ts` — factory functions and response builders
- `handlers/<feature>.ts` — mock API handlers
- `tests/<feature>.spec.ts` — Playwright test scenarios
- `constants.ts` — shared path constants

## Handoff to Engineering

When copying these files to the target engineering repo:

1. Update `constants.ts`:
   - Change `BASE_PATH` to the production tenant path (e.g., `/${TEST_TENANT}`) or remove if the repo has its own constant.

2. Update imports in test files to point to the repo's test helper setup instead of prototype-local paths.

3. Fixtures and handlers: merge into the existing `e2e/` fixture and handler directories.
   See file headers for merge instructions — do NOT replace existing files wholesale.
```

### 9. Generate test spec file

Write `PROJECT_DIR/_e2e/tests/<feature>.spec.ts`:

Structure:
1. **Header comment block** — same pattern:
   - "These tests extend the existing target repo's `e2e/tests/<feature>.spec.ts` (if one exists)"
   - List new scenarios being added
   - Pattern reference

2. **Imports** — point to the Playwright setup in the repo root and the `BASE_PATH` constant:
   ```ts
   import { test, expect } from "@playwright/test";
   import { BASE_PATH } from "../constants";
   ```
   Adjust the test/expect import to match the repo's test setup convention (e.g., a custom fixture file).

3. **Page navigation** — use `BASE_PATH` instead of hardcoded paths:
   ```ts
   await page.goto(`${BASE_PATH}/sub-route`);
   ```

4. **Test describe blocks** — one per acceptance criteria group, containing:
   - Comment linking the scenario to the AC it covers (e.g., `// AC-001`)
   - Test using the appropriate page fixture or role context
   - Use content values extracted from `_data/` files (Step 4) — never invent strings

   **Locator strategy — scope to avoid ambiguity:**
   - Priority: `getByRole()` > `getByText()` > `getByPlaceholder()` > `locator()`
   - Always scope to the nearest container when a label or text appears multiple times on the page:
     ```ts
     const statsSection = page.locator("[data-testid='stat-cards']");
     await expect(statsSection.getByText("Open")).toBeVisible();
     ```
   - For tables: scope to `getByRole("row")` then assert within the row
   - For cards/sections: scope to the card container first, then find content within it

   **Assertion style — hard by default:**
   - Use hard assertions (`await expect(element).toBeVisible()`) as the default. If the element
     is missing, the test should fail — that failure reveals a divergence from the spec.
   - Use guard patterns (`if (await element.isVisible(...).catch(...))`) only for UI that may
     legitimately not render, such as hover tooltips, transient loading spinners, or optional empty states.
   - Timeouts: 5000ms for page loads, 3000ms for UI transitions.

### 10. Confirm completion

Tell the user:
- Files generated: list all 5 files with full paths (fixtures, handlers, tests, constants, README)
- Test scenario count and which acceptance criteria each covers
- How to run: `npx playwright test PROJECT_DIR/_e2e/` (or the repo's configured script)
- Next step: "These files are ready for handoff. Engineers should merge them into the target repo's `e2e/` directory — see `_e2e/README.md` for merge instructions."
- If running as part of `/design-kit-react-nextjs:handoff-prep`: proceed to the next handoff-prep step (do not print this message).
