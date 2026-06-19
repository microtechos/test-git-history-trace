# Experiment 5: Rename Model File + Rename Interface + Fix Imports in SAME Commit

## What We Did

- **Renamed file:** `src/app/models/settings.model.ts` → `src/app/models/preferences.model.ts`
- **Changed content in renamed file:** Interface name `AppSettings` → `AppPreferences`
- **Fixed imports in other files:** Updated import path + interface name in service and component
- **All in SAME commit**
- **Result:** Rename detection **PASSED** — 87% similarity, history preserved

## Steps Performed

```bash
# Step 1: Check history BEFORE rename
git log --follow --oneline -- src/app/models/settings.model.ts
# Output:
#   531b468 feat: add settings module with SettingsService and SettingsPageComponent

# Step 2: Rename file
git mv src/app/models/settings.model.ts src/app/models/preferences.model.ts

# Step 3: Change interface name inside renamed file
#   AppSettings → AppPreferences (1 line change)

# Step 4: Fix import path + interface name in settings.service.ts
#   import { AppSettings } from '../../models/settings.model'
#   → import { AppPreferences } from '../../models/preferences.model'
#   + all AppSettings references → AppPreferences

# Step 5: Fix import path + interface name in settings-page.component.ts
#   import { AppSettings } from '../../models/settings.model'
#   → import { AppPreferences } from '../../models/preferences.model'
#   + all AppSettings references → AppPreferences

# Step 6: Stage ALL 3 files and commit in ONE commit
git add src/app/models/preferences.model.ts \
        src/app/services/settings/settings.service.ts \
        src/app/components/settings-page/settings-page.component.ts
git commit -m "experiment-5: rename model file + rename interface + fix imports"
```

## What Git Detected

```bash
git status
# Output:
#   modified:   src/app/components/settings-page/settings-page.component.ts
#   renamed:    src/app/models/settings.model.ts -> src/app/models/preferences.model.ts
#   modified:   src/app/services/settings/settings.service.ts

git diff -M --summary HEAD~1..HEAD
# Output:
#   rename src/app/models/{settings.model.ts => preferences.model.ts} (87%)
```

Git correctly detected:
- **Renamed file** at 87% similarity (interface name change was small)
- **Other files** as normal modifications (not renames)

## Result

- Git history of renamed file: **PRESERVED** (87% similarity > 50% threshold)
- Git history of other files (import fixes): **PRESERVED** (normal modifications, not renames)
- Rename detected: **YES**

## How to Verify History After Rename

### 1. Renamed file — list all commits (with --follow)
```bash
# Shows ALL commits including pre-rename history
git log --follow --oneline -- src/app/models/preferences.model.ts
# Output:
#   01718d1 experiment-5: rename model file + rename interface + fix imports in SAME commit
#   531b468 feat: add settings module with SettingsService and SettingsPageComponent
```

### 2. Renamed file — list commits (WITHOUT --follow)
```bash
# Shows ONLY commits after rename — old history hidden
git log --oneline -- src/app/models/preferences.model.ts
# Output:
#   01718d1 experiment-5: rename model file + rename interface + fix imports in SAME commit
```

### 3. Other files — history is normal (all commits visible)
```bash
# settings.service.ts — 3 commits (creation + enhancement + import fix)
git log --follow --oneline -- src/app/services/settings/settings.service.ts
# Output:
#   01718d1 experiment-5: rename model file + rename interface + fix imports in SAME commit
#   0cc39bb feat: enhance settings with undo/export/import, enhance order with filters, update routes
#   531b468 feat: add settings module with SettingsService and SettingsPageComponent

# settings-page.component.ts — 3 commits (creation + enhancement + import fix)
git log --follow --oneline -- src/app/components/settings-page/settings-page.component.ts
# Output:
#   01718d1 experiment-5: rename model file + rename interface + fix imports in SAME commit
#   0cc39bb feat: enhance settings with undo/export/import, enhance order with filters, update routes
#   531b468 feat: add settings module with SettingsService and SettingsPageComponent
```

### 4. Confirm rename detection
```bash
git diff -M --summary HEAD~1..HEAD
# Output:
#   rename src/app/models/{settings.model.ts => preferences.model.ts} (87%)
```

## How to View File Changes / Diffs After Rename

### 5. View full history with all diffs (BEST command)
```bash
git log --follow -p -- src/app/models/preferences.model.ts
```

### 6. View old file content (use OLD path)
```bash
git show 531b468:src/app/models/settings.model.ts
```

### 7. View diff of old commit (use OLD path)
```bash
git show 531b468 -- src/app/models/settings.model.ts
```

## Key Rules

| Scenario | Which path to use? |
|----------|-------------------|
| `git log --follow` | Use NEW path (`preferences.model.ts`) |
| `git log --follow -p` | Use NEW path — shows all diffs automatically |
| `git show <old-commit>:path` | Use OLD path (`settings.model.ts`) |
| `git show <old-commit> -- path` | Use OLD path |
| `git log` (without --follow) | Only shows post-rename commits |

## Key Finding: Small Content Change is OK

| Change type | Similarity | Rename detected? |
|-------------|-----------|-----------------|
| Rename only (Exp 1, 2, 3) | 100% | YES |
| Rename + small content change (Exp 5 — this one) | 87% | YES |
| Rename + heavy content rewrite (Exp 4) | < 5% | NO |

The threshold is **50% similarity** (default `-M`). Small changes like renaming an interface name still keep similarity high enough (87%). But rewriting the entire file (Exp 4) drops it below 5% and breaks the history chain.

## Comparison: All 5 Experiments

| | Exp 1 | Exp 2 | Exp 3 | Exp 4 | Exp 5 |
|---|---|---|---|---|---|
| **What** | Dir rename | File rename | Dir rename | Dir rename + rewrite | File rename + small change + import fixes |
| **Method** | `git mv` | `git mv` | manual `mv` | `git mv` + rewrite | `git mv` + interface rename + import fixes |
| **Content changed?** | No | No | No | Yes (heavy) | Yes (small — interface name only) |
| **Other files changed?** | No | No | No | No | Yes (import path + name fixes) |
| **Similarity** | 100% | 100% | 100% | < 5% | 87% |
| **Rename detected?** | YES | YES | YES | **NO** | YES |
| **History preserved?** | YES | YES | YES | **NO** | YES |
