# Experiment 3: Rename Directory Using Manual `mv` + `git rm` + `git add` (NO `git mv`)

## What We Did

- **Renamed:** `src/app/components/notification-banner/` → `src/app/components/alert-banner/`
- **Method:** Plain `mv` command + `git rm` (old) + `git add` (new) — **NOT `git mv`**
- **Commit:** Rename-only (no content changes) → 100% similarity for all 3 files

## Steps Performed

```bash
# Step 1: Check history BEFORE rename
git log --follow --oneline -- src/app/components/notification-banner/notification-banner.component.ts
# Output:
#   aff029a feat: enhance notification module with filtering, max cap, and cleanup
#   9e2a2b0 feat: add notification system and wire up app routes

# Step 2: Plain mv (NOT git mv)
mv src/app/components/notification-banner src/app/components/alert-banner

# Step 3: Stage old file deletions
git rm -r src/app/components/notification-banner/

# Step 4: Stage new files
git add src/app/components/alert-banner/

# Step 5: Commit rename-only (no content changes!)
git commit -m "experiment-3: rename directory using manual mv + git rm + git add"
```

## What Git Status Showed After Staging

Even without `git mv`, git auto-detected the renames:
```
Changes to be committed:
  renamed: notification-banner/notification-banner.component.html -> alert-banner/notification-banner.component.html
  renamed: notification-banner/notification-banner.component.scss -> alert-banner/notification-banner.component.scss
  renamed: notification-banner/notification-banner.component.ts   -> alert-banner/notification-banner.component.ts
```

## Result

- Git history: PRESERVED (identical to Experiment 1 with `git mv`)
- Git detected rename: YES (100% similarity for all 3 files)
- `git mv` required?: **NO** — manual `mv` + `git rm` + `git add` works equally

## How to Verify History After Rename

### 1. List all commits (with --follow)
```bash
# Shows ALL commits including pre-rename history
git log --follow --oneline -- src/app/components/alert-banner/notification-banner.component.ts
# Output:
#   b3a2764 experiment-3: rename directory using manual mv + git rm + git add (NO git mv)
#   aff029a feat: enhance notification module with filtering, max cap, and cleanup
#   9e2a2b0 feat: add notification system and wire up app routes
```

### 2. List commits (WITHOUT --follow)
```bash
# Shows ONLY commits after rename — old history hidden
git log --oneline -- src/app/components/alert-banner/notification-banner.component.ts
# Output:
#   b3a2764 experiment-3: rename directory using manual mv + git rm + git add (NO git mv)
```

### 3. Confirm git detected the rename
```bash
git diff -M --summary HEAD~1..HEAD
# Output:
#   rename src/app/components/{notification-banner => alert-banner}/notification-banner.component.html (100%)
#   rename src/app/components/{notification-banner => alert-banner}/notification-banner.component.scss (100%)
#   rename src/app/components/{notification-banner => alert-banner}/notification-banner.component.ts (100%)
```

## How to View File Changes / Diffs After Rename

### 4. View full history with all diffs in one command (BEST command)
```bash
# Uses NEW path + --follow handles old path automatically
git log --follow -p -- src/app/components/alert-banner/notification-banner.component.ts
```

### 5. View file content at a specific old commit
```bash
# Must use OLD path for pre-rename commits
git show 9e2a2b0:src/app/components/notification-banner/notification-banner.component.ts
```

### 6. View diff of a specific old commit
```bash
# Must use OLD path
git show aff029a -- src/app/components/notification-banner/notification-banner.component.ts
```

### 7. View diff between two old commits
```bash
# Must use OLD path
git diff 9e2a2b0..aff029a -- src/app/components/notification-banner/notification-banner.component.ts
```

## Key Rules

| Scenario | Which path to use? |
|----------|-------------------|
| `git log --follow` | Use NEW path (`alert-banner/...`) |
| `git log --follow -p` | Use NEW path — shows all diffs automatically |
| `git show <old-commit>:path` | Use OLD path (`notification-banner/...`) |
| `git show <old-commit> -- path` | Use OLD path |
| `git diff <old>..<old> -- path` | Use OLD path |
| `git log` (without --follow) | Only shows post-rename commits |

## KEY FINDING: `git mv` vs Manual `mv` Comparison

| | Experiment 1 (`git mv`) | Experiment 3 (manual `mv`) |
|---|---|---|
| Command | `git mv old/ new/` | `mv old/ new/` + `git rm old/` + `git add new/` |
| Rename detected? | YES (100%) | YES (100%) |
| History preserved? | YES | YES |
| `git log --follow` works? | YES | YES |
| Old diffs accessible? | YES | YES |
| **Behavior identical?** | **YES — exactly the same result** |

## Conclusion

**`git mv` is just a convenience shortcut.** It is equivalent to:
1. `mv old new` (plain filesystem rename)
2. `git rm old` (stage deletion of old path)
3. `git add new` (stage addition at new path)

Git detects renames by comparing file content similarity at diff time — NOT by recording rename operations. Both methods produce the exact same commit.
