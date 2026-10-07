---
name: commit
description: Commit rules for this repo. Use when the user asks to commit
model: sonnet
disable-model-invocation: true
allowed-tools: Bash(git status), Bash(git diff:*), Bash(git add:*), Bash(git commit:*)
---

# Commits — Conventional Commits

Format: `type: description`

- Types: `feat`, `fix`, `refactor`, `style`, `test`, `docs`, `chore`
- Description: English, imperative, lowercase, no period, max 30 chars
- Example: `feat: add inline task editing`
- No trailers: never add `Co-Authored-By`, `Generated with`, or any other footer. The subject line alone is the whole message.

# Workflow

1. Run `git status` and `git diff`. Look at ALL changes, not only the last edit.
2. If changes are unrelated (config vs feature, formatting vs logic), split them into separate commits. Config first, then code, then docs.
3. If some files look unrelated to the current task, ask me before adding them.
4. Show me the files and the commit message. **Wait for my confirmation.**
5. After confirmation: `git add <files>` and `git commit`.

# Never

- `git push`, `--force`, `--no-verify`
- `git add .` without checking what is included