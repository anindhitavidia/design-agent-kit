# Coding Guidelines

> Read by `/design-kit:code-reviewer` and the design-engineer agent.

## Universal

1. **Imports through the design system barrel** — never import directly from underlying libraries when a DS component exists.
2. **No raw HTML elements where DS components exist** — use `<Button>`, not `<button>`, etc.
3. **No hardcoded colors** — semantic tokens only.
4. **No inline styles** for layout — prefer the project's styling system (Tailwind, CSS modules, etc.).
5. **Compose class names with a utility** (`cn()`, `clsx`, etc.) — never string concatenation.
6. **All user-facing text via i18n if the project supports multiple locales.**

## Project-specific

<!-- TODO: Add rules unique to this project's stack and conventions. -->
