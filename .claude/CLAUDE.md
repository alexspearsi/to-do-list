# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc --noEmit`) and build for production; the type check gates the build, since Vite itself only strips types and never checks them
- `npm run preview` — serve the production build locally
- `npm run lint` — run ESLint over the whole project
- `npm run format` — run Prettier over `src/**/*.{ts,tsx,css}`

There is no test suite in this project.

## Architecture

A single-page to-do list app: React + TypeScript, CSS Modules for styling, no routing, no external state library.

- **State lives entirely in `src/App.tsx`** (lifting state up): the `tasks` array and the active `filter` are the only state in the app. All mutations (`addTask`, `deleteTask`, `toggleTask`) use the functional `setTasks(prev => ...)` form and never mutate the array in place. The filtered list is derived with `useMemo` over `[tasks, filter]`.
- **Persistence is isolated in `src/hooks/useLocalStorage.ts`**, a generic `useLocalStorage<T>(key, initialValue)` hook mirroring `useState`. It lazily reads from `localStorage` on mount (wrapped in try/catch, falling back to `initialValue` on corrupt JSON) and writes on every change via `useEffect`. Only `tasks` is persisted this way — `filter` is view state and intentionally not saved, so it always resets to `'all'` on reload.
- **Components** (`src/components/*`) are presentational and receive all data and handlers as props from `App`; none of them touch `localStorage` or hold app-level state:
  - `TaskForm` — controlled input + submit handler, clears itself after a successful add, ignores empty/whitespace-only input.
  - `TaskFilters` — renders buttons from a `FILTERS` constant array; active state is prop-driven (`current`), not local.
  - `TaskList` — renders an empty-state message (worded per the active `filter`) or a `<ul>` of `TaskItem`s.
  - `TaskItem` — a single `<li>` with checkbox, text, and delete button.
- **Types** (`src/types.ts`): `Task` and `Filter` (`'all' | 'active' | 'completed'`, a union so the filtering `switch` is exhaustive-checked).
- Each component has a co-located `*.module.css` file; global styles (reset, font stack, CSS custom properties for colors) live in `src/index.css`.

## Rules 

- Scope: only the task requirements. Do not add features that are not asked for.
- Do not install new libraries without asking me.
- No `any`.
- Use `/commit` for commits.