# Experiment 4: Rename + Heavy Content Change in SAME Commit (Anti-Pattern)

## What We Did

- **Renamed:** `src/app/services/order/` → `src/app/services/purchase/`
- **AND heavily rewrote** `order.service.ts` content in the **SAME commit**
- **Method:** `git mv` + complete file rewrite → committed together
- **Result:** Rename detection **FAILED** — history link BROKEN

## Content Changes Made (in same commit as rename)

| What | Before | After |
|------|--------|-------|
| Class name | `OrderService` | `PurchaseService` |
| Interface | `Order`, `OrderItem` | `PurchaseRecord` (inline) |
| Data fields | `id`, `customerId`, `status` | `purchaseId`, `buyerEmail`, `fulfillmentStatus`, `trackingNumber` |
| Methods | `createOrder()`, `updateStatus()`, `cancelOrder()` | `recordPurchase()`, `assignTracking()`, `processRefund()`, `markCompleted()` |
| Computed | `pendingOrders`, `totalRevenue` | `grossRevenue`, `netRevenue`, `totalTaxCollected`, `refundedPurchases` |
| Lines | 102 | 134 |
| Similarity | **Less than 5%** — almost entirely different code |

## Steps Performed

```bash
# Step 1: Check history BEFORE rename
git log --follow --oneline -- src/app/services/order/order.service.ts
# Output:
#   c09e245 feat: enhance order module with filtering, sorting, item management
#   77685aa feat: add order management module with OrderService and OrderSummaryComponent

# Step 2: Rename directory
git mv src/app/services/order src/app/services/purchase

# Step 3: Heavily rewrite the file content (changed class, methods, data — everything)
# ... edited order.service.ts with completely different code ...

# Step 4: Stage BOTH rename + content change together
git add src/app/services/purchase/order.service.ts

# Step 5: Commit everything in ONE commit (the anti-pattern!)
git commit -m "experiment-4: rename + heavy content change in SAME commit"
```

## Result: RENAME DETECTION FAILED

```bash
# Git sees DELETE + CREATE, NOT a rename:
git diff -M --summary HEAD~1..HEAD
# Output:
#   delete mode 100644 src/app/services/order/order.service.ts
#   create mode 100644 src/app/services/purchase/order.service.ts

# Even 5% similarity threshold fails:
git diff -M5 --summary HEAD~1..HEAD
# Output:
#   delete mode 100644 src/app/services/order/order.service.ts
#   create mode 100644 src/app/services/purchase/order.service.ts
```

## How to Verify the Broken History

### 1. `git log --follow` at NEW path — old history NOT shown
```bash
git log --follow --oneline -- src/app/services/purchase/order.service.ts
# Output:
#   9942bca experiment-4: rename + heavy content change in SAME commit (anti-pattern)
#
# ONLY 1 commit! Old history (77685aa, c09e245) is NOT linked.
```

### 2. Old commits still exist — but NOT linked to new path
```bash
git log --oneline -- src/app/services/order/order.service.ts
# Output:
#   9942bca experiment-4: rename + heavy content change in SAME commit (anti-pattern)
#   c09e245 feat: enhance order module with filtering, sorting, item management
#   77685aa feat: add order management module with OrderService and OrderSummaryComponent
#
# Old commits exist at OLD path, but git doesn't know they are the same file.
```

### 3. Old file content is still accessible (just not linked)
```bash
# You can still view old content using OLD path:
git show c09e245:src/app/services/order/order.service.ts
git show 77685aa:src/app/services/order/order.service.ts
```

## Why It Broke

Git detects renames by comparing file **content similarity** between commits:
- Default threshold: **50%** (`-M` or `-M50`)
- Our file similarity: **less than 5%** (almost entirely rewritten)
- Even `-M5` (5% threshold) could not detect the rename
- Git treats it as: "old file deleted" + "new file created" = **no rename, no history link**

## The Correct Way (2-Commit Approach)

```bash
# Commit 1: Rename ONLY (no content changes) → 100% similarity → rename detected
git mv src/app/services/order src/app/services/purchase
git commit -m "rename: order service directory to purchase"

# Commit 2: Now make content changes (history already linked)
# ... edit the file ...
git add src/app/services/purchase/order.service.ts
git commit -m "refactor: rewrite order service as purchase service"
```

## Comparison: All 4 Experiments

| | Exp 1 | Exp 2 | Exp 3 | Exp 4 |
|---|---|---|---|---|
| **What** | Dir rename | File rename | Dir rename | Dir rename + rewrite |
| **Method** | `git mv` | `git mv` | manual `mv`+`rm`+`add` | `git mv` + content change |
| **Content changed?** | No | No | No | Yes (heavily) |
| **Separate commit?** | Yes (rename-only) | Yes (rename-only) | Yes (rename-only) | No (same commit) |
| **Similarity** | 100% | 100% | 100% | < 5% |
| **Rename detected?** | YES | YES | YES | **NO** |
| **History preserved?** | YES | YES | YES | **NO** |
| **`--follow` works?** | YES | YES | YES | **NO** |

## Key Lesson

> **Always separate rename and content changes into different commits.**
>
> - Commit 1: Rename only → git detects rename (100% similarity)
> - Commit 2: Content changes → history already linked
>
> Mixing both in one commit risks breaking the history chain if content
> similarity drops below 50% (git's default rename detection threshold).
