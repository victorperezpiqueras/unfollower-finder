## Project structure
- SvelteKit + TypeScript app using Vite and Tailwind.
- App entry and routes: `src/` (notably `src/routes/+page.svelte` and layouts).
- Reusable UI and logic: `src/lib/` (components under `src/lib/components`, shared utilities under `src/lib/shared`).
- Static assets: `static/`.
- Tests: unit/component tests colocated next to source files and setup in `src/setupTests.ts`; e2e tests in `e2e/` (Playwright).
- Tooling: Vite, Playwright, ESLint, Tailwind configs at repo root.

## Development workflow
1. Plan each task into clear steps.
2. Implement code changes and any required tests for the step.
3. Run unit tests for the step.
4. Run e2e tests when the change affects user flows or UI behavior.
5. Commit each step using conventional commit messages.

## Available skills
- [conventional-commits](skills/conventional-commits/SKILL.md)
- [playwright-cli](skills/playwright-cli/SKILL.md)
