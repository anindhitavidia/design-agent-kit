# Review Checklist

> Used by `/design-kit:code-reviewer` and the QA agents. Universal rules at top; project-specific rules below.

## Universal rules

- No hardcoded user-facing strings (use i18n if applicable)
- No hardcoded colors — use design tokens
- All imports go through the design system barrel, not direct framework imports
- Tests cover the happy path and at least one edge case
- No `console.log` left behind
- No `// TODO` without a tracking link

## Project-specific rules

<!-- TODO: Add rules unique to this project. Example:
- All API calls go through `lib/api-client.ts`, not raw fetch
- All user inputs are validated with Zod schemas
- Error toasts use `<ErrorToast>`, not `<Alert>`
-->

## Allowed exceptions

<!-- TODO: Document acceptable rule violations and why. -->
