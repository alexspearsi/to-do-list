\# Plan: Edit an Existing Task

## Context

The app currently supports adding (`addTask`), deleting (`deleteTask`), and toggling (`toggleTask`) tasks, but there's no way to change the text of an existing task — today the only fix for a typo is delete-and-recreate. This adds inline editing of a task's text directly in the list, with no new libraries, strictly following the project's existing patterns (controlled input, functional `setTasks`, CSS Modules, no `any`).

UX decisions (confirmed by the user):
- Editing starts via **both** an "✎" button next to delete **and** a double-click on the task text.
- **Blur** (losing focus) **saves** the change, same as Enter — it acts as a commit.
- **Escape** cancels editing and reverts to the original text (no save).
- An empty/whitespace-only result on commit → editing is cancelled and the original text is kept (mirrors `TaskForm` ignoring an empty submit).

Edit state (`isEditing`, `editText`) is local UI state inside `TaskItem`, not on the global `Task` type or in `App` — the same way `filter` is view state and isn't persisted.

## Files to change and implementation order

Go **top-down through the data tree** to avoid intermediate type errors:

### 1. `src/App.tsx`
Add a handler next to `toggleTask` (same functional `setTasks(prev => ...)` form, no mutation):
```ts
const editTask = (id: string, text: string) => {
  setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, text } : task)));
};
```
Pass it down to `TaskList`:
```tsx
<TaskList tasks={filteredTasks} filter={filter} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} />
```

### 2. `src/components/TaskList/TaskList.tsx`
Add `onEdit: (id: string, text: string) => void` to `Props`, pass it through to `<TaskItem onEdit={onEdit} ... />` (pure pass-through, like `onToggle`/`onDelete`).

### 3. `src/components/TaskItem/TaskItem.tsx` (main work)
- New prop `onEdit: (id: string, text: string) => void`.
- Local state: `isEditing` (`useState(false)`), `editText` (`useState(task.text)`).
- `inputRef = useRef<HTMLInputElement>(null)` + `useEffect` on `[isEditing]`: when entering edit mode, call `inputRef.current?.focus(); inputRef.current?.select();`.
- `startEdit()`: `setEditText(task.text); setIsEditing(true)` — called from both the "✎" button's `onClick` and the text `<span>`'s `onDoubleClick`.
- `commitEdit()`: `trim()` the text; if non-empty, call `onEdit(task.id, trimmed)`; exit edit mode (`setIsEditing(false)`) either way (empty → reverts to original text, since the next `startEdit` re-reads `task.text`).
- `cancelEdit()`: resets `editText` back to `task.text`, exits edit mode **without** calling `onEdit`. Used on Escape.
- To stop Escape from also triggering `commitEdit` via the subsequent `blur`, use a guard: `skipBlurCommitRef = useRef(false)`, set to `true` right before `cancelEdit()`, checked and reset at the start of `handleBlur`.
- `handleKeyDown`: `Enter` → `preventDefault()` + `commitEdit()`; `Escape` → `preventDefault()` + `cancelEdit()`.
- `handleBlur`: if the guard flag is set, skip and reset it; otherwise call `commitEdit()`.
- `<li>` markup: checkbox → (`isEditing` ? editable `<input>` : `<span onDoubleClick={startEdit}>`) → edit button "✎" (hidden while `isEditing`) → delete button "✕" (unchanged).
- `aria-label`s: edit button gets `` `Edit task: ${task.text}` ``, edit input gets `"Edit task text"` — matching the existing `aria-label`s on the checkbox/delete button.

### 4. `src/components/TaskItem/TaskItem.module.css`
Add `.editButton` (copy of `.deleteButton`, but `:hover { color: var(--color-primary) }`) and `.editInput` (similar to `.input` in `TaskForm.module.css`: `flex: 1`, border/radius/colors via the existing CSS variables, `:focus-visible` outline).

### Not changed
- `src/types.ts` — `Task`/`Filter` untouched.
- `src/hooks/useLocalStorage.ts` — untouched, `setTasks` is already enough.
- `TaskFilters` — unrelated to this feature.

## Verification

1. `npm run dev`, open the app.
2. Add a task, click "✎" → a focused input appears with the text selected.
3. Change the text, press Enter → saved, input closes.
4. Check DevTools → Local Storage → `todo-tasks` to confirm `text` updated.
5. Double-click another task's text → same edit-entry behavior.
6. Enter edit mode, change text, press Escape → change is discarded, original text remains.
7. Enter edit mode, clear the text (whitespace only), press Enter → cancelled, original text remains (not saved empty).
8. Enter edit mode, change text, click elsewhere on the page (blur) → change is saved.
9. Edit a task while the `active`/`completed` filter is active → confirm `editTask` correctly updates the full `tasks` array, not just `filteredTasks`.
10. Mark a task completed, then edit its text → confirm editing still works on a completed task.
11. Multiple tasks — confirm editing one doesn't affect others (state is local to each `TaskItem`).
12. Keyboard accessibility: Tab to the "✎" button, Enter/Space activates it.
13. `npm run build` (runs `tsc --noEmit`) — no type errors, no `any`.
14. `npm run lint` — clean.
