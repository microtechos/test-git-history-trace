# Experiment 2: Rename Single File Using `git mv`

## What We Did

- **Renamed:** `src/app/models/product.model.ts` → `src/app/models/item.model.ts`
- **Method:** `git mv` command
- **Commit:** Rename-only (no content changes) → 100% similarity

## Steps Performed

```bash
# Step 1: Check history BEFORE rename
git log --follow --oneline -- src/app/models/product.model.ts
# Output:
#   c2cc4aa feat: add product catalog with ProductService and ProductCardComponent

# Step 2: Rename single file
git mv src/app/models/product.model.ts src/app/models/item.model.ts

# Step 3: Commit rename-only (no content changes!)
git commit -m "experiment-2: rename single file using git mv command"
```

## Result

- Git history: PRESERVED
- Git detected rename: YES (100% similarity)
- VS Code Timeline: Lists old commits but CANNOT open pre-rename diffs (same VS Code limitation as Experiment 1)

## How to Verify History After Rename

### 1. List all commits (with --follow)
```bash
# Shows ALL commits including pre-rename history
git log --follow --oneline -- src/app/models/item.model.ts
# Output:
#   365d54a experiment-2: rename single file using git mv command
#   c2cc4aa feat: add product catalog with ProductService and ProductCardComponent
```

### 2. List commits (WITHOUT --follow)
```bash
# Shows ONLY commits after rename — old history hidden
git log --oneline -- src/app/models/item.model.ts
# Output:
#   365d54a experiment-2: rename single file using git mv command
```

### 3. Confirm git detected the rename
```bash
git diff -M --summary HEAD~1..HEAD
# Output:
#   rename src/app/models/{product.model.ts => item.model.ts} (100%)
```

## How to View File Changes / Diffs After Rename

### 4. View full history with all diffs in one command (BEST command)
```bash
# Uses NEW path + --follow handles old path automatically
git log --follow -p -- src/app/models/item.model.ts
```

### 5. View file content at old commit
```bash
# Must use OLD path for pre-rename commits
git show c2cc4aa:src/app/models/product.model.ts
```

### 6. View diff of a specific old commit
```bash
# Must use OLD path
git show c2cc4aa -- src/app/models/product.model.ts
```

### 7. View diff between old commit and current HEAD
```bash
# Compare old content (old path) vs new content (new path)
git diff c2cc4aa:src/app/models/product.model.ts HEAD:src/app/models/item.model.ts
```

## Key Rules

| Scenario | Which path to use? |
|----------|-------------------|
| `git log --follow` | Use NEW path (`item.model.ts`) |
| `git log --follow -p` | Use NEW path (`item.model.ts`) — shows all diffs automatically |
| `git show <old-commit>:path` | Use OLD path (`product.model.ts`) |
| `git show <old-commit> -- path` | Use OLD path (`product.model.ts`) |
| `git log` (without --follow) | Only shows post-rename commits |

## Experiment 1 vs 2 Comparison

| | Experiment 1 (directory) | Experiment 2 (single file) |
|---|---|---|
| Target | `services/user/` → `services/account/` | `product.model.ts` → `item.model.ts` |
| Method | `git mv dir/ newdir/` | `git mv old.ts new.ts` |
| History preserved? | YES | YES |
| Similarity | 100% | 100% |
| Behavior | Identical — no difference between dir and file rename |
