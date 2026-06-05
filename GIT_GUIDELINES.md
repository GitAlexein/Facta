# Git Guidelines — Praxisum Facta

A practical guide. The goal is to avoid conflicts, keep the history clean, and never break `alpha-development`.

---

## The golden rule

**`alpha-development` is always working.** Nobody commits directly to it. All changes go through a branch and a pull request.

---

## Branch workflow

Every piece of work — a new feature, a bug fix, a visual tweak — lives on its own branch.

### Branch naming

| Prefix | Use for |
|---|---|
| `feature/` | new functionality |
| `fix/` | bug fixes |
| `style/` | CSS / visual changes only, no logic |
| `refactor/` | restructuring existing code, no new features |
| `docs/` | documentation only |

Examples: `feature/settings-panel`, `fix/task-not-saving`, `style/dark-mode`

### Step by step

1. Make sure you are on `alpha-development` — click the branch name at the bottom-left and select it.
2. Create a new branch. 
3. Work on your branch. Commit when done (see below for commit guidelines).
4. When ready, push the branch and open a Pull Request on GitHub (GitHub will prompt you with a banner).
5. The other person reviews and approves.
6. Merge on GitHub. Delete the branch after merging.

---

## When to commit

A commit should capture **one logical change** — something you could describe in a single sentence.

**Commit when:**
- You finish a self-contained piece of work ("add delete confirmation dialog")
- Something is working and you don't want to risk losing it
- You are about to try something experimental and want a fallback point

**Do not commit when:**
- The code is broken or half-written (unless it is a `wip:` commit on your own branch, just for saving progress)
- You have mixed unrelated changes together — split them into separate commits instead

### Commit message format

```
type: short description in imperative form
```

Examples:
```
feature: add cancel button to task input
fix: prevent empty tasks from being saved
style: update button colours to match design
docs: add git guidelines
```

Keep it under 72 characters. Write what the change **does**, not what you did ("add" not "added", "fix" not "fixed").

### How to commit in VSCode

1. Review your changes in the diff view — make sure you are committing what you intend.
2. Stage the files you want (only the files affected by the change you are committing, not all).
3. Type your message.
4. Commit.

---

## When to pull

Pulling downloads the latest changes from GitHub into your local copy.

**Pull when:**
- You sit down to start working — always pull before creating a new branch
- You are about to push and you know the other person has been working too
- GitHub tells you that your branch is behind

> Always pull onto `alpha-development` first, then create your branch from it. This keeps your branch up to date and reduces conflicts.

---

## When to push

Pushing uploads your local commits to GitHub so the other person can see them and so they are backed up.

**Push when:**
- You finish a working session and want your work backed up
- You are ready to open a Pull Request
- You want the other person to see your progress (you can open a **Draft PR** for this)


> If VSCode says "The branch has no upstream" when pushing for the first time, click **Publish Branch** — this creates the branch on GitHub automatically.

---

## Pull Requests

A PR is how a branch gets reviewed and merged into `alpha-development`.

**Open a PR when:**
- Your branch is ready (or close to ready) and you want feedback
- Use a **Draft PR** if you want early feedback on unfinished work

**Reviewing a PR:**
- Read the description
- Look at the **Files changed** tab on GitHub
- Leave a comment if something is unclear or wrong
- Approve and merge when it looks good

**After merging:**
- Delete the branch — GitHub offers a button for this right after merging
- The other person should pull `alpha-development` before starting new work

---

## Common situations

### "I need to update my branch because alpha-development moved on"

In VSCode:
1. Switch to `alpha-development` and pull.
2. Switch back to your branch.
3. Source Control → **...** → **Branch** → **Merge Branch...** → pick `alpha-development`.

### "I have a conflict"

VSCode highlights conflicting files. Open them — you will see both versions marked. Choose what to keep, save, stage the file, and commit. If you are unsure, call the committer person before resolving.

### "I committed to alpha-development by mistake"

Don't panic and don't force-push. Open an issue.

---

## Quick reference

| Situation | Action |
|---|---|
| Starting work | Pull `alpha-development`, create a new branch |
| Finished a logical chunk | Commit with a clear message |
| End of work session | Push your branch |
| Ready for review | Open a PR on GitHub |
| PR approved | Merge on GitHub, delete the branch |
| Starting next task | Pull `alpha-development` again |
