# Experiment 1: Rename Directory Using `git mv`

## What We Did

- **Renamed:** `src/app/services/user/` → `src/app/services/account/`
- **Method:** `git mv` command
- **Commit:** Rename-only (no content changes) → 100% similarity

## Steps Performed

```bash
# Step 1: Check history BEFORE rename
git log --follow --oneline -- src/app/services/user/user.service.ts

# Step 2: Rename directory
git mv src/app/services/user src/app/services/account

# Step 3: Commit rename-only (no content changes!)
git commit -m "rename: user service directory to account"
```

## Result

- Git history: PRESERVED
- Git detected rename: YES (100% similarity)
- VS Code Timeline: Lists old commits but CANNOT open pre-rename diffs (VS Code limitation)

## How to Verify History After Rename

### 1. List all commits (with --follow)
```bash
# Shows ALL commits including pre-rename history
git log --follow --oneline -- src/app/services/account/user.service.ts
```

### 2. List commits (WITHOUT --follow)
```bash
# Shows ONLY commits after rename — old history hidden
git log --oneline -- src/app/services/account/user.service.ts
```

## How to View File Changes / Diffs After Rename

### 3. View full history with all diffs in one command (BEST command)
```bash
# Uses NEW path + --follow handles old path automatically
git log --follow -p -- src/app/services/account/user.service.ts
```

### 4. View file content at a specific old commit
```bash
# Must use OLD path for pre-rename commits
git show d912df1:src/app/services/user/user.service.ts
```

### 5. View diff of a specific old commit
```bash
# Must use OLD path
git show fc88fe8 -- src/app/services/user/user.service.ts
```

### 6. View diff between two old commits
```bash
# Must use OLD path
git diff d912df1..fc88fe8 -- src/app/services/user/user.service.ts
```

### 7. Confirm git detected the rename
```bash
git diff -M --summary HEAD~1..HEAD
# Output: rename src/app/services/{user => account}/user.service.ts (100%)
```

## Key Rules

| Scenario | Which path to use? |
|----------|-------------------|
| `git log --follow` | Use NEW path (--follow resolves old path automatically) |
| `git log --follow -p` | Use NEW path (shows all diffs across rename) |
| `git show <old-commit>:path` | Use OLD path (file didn't exist at new path in old commits) |
| `git show <old-commit> -- path` | Use OLD path |
| `git diff <old>..<old> -- path` | Use OLD path |
| `git log` (without --follow) | Only shows post-rename commits |
