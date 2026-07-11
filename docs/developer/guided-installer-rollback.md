---
sidebar_position: 6
title: "Guided Installer — Rollback Record"
description: "Checkpoint, tags, branch, merge commit, and the exact non-destructive rollback command for the guided installer feature."
---

# Guided Installer — Rollback Record

Git safety record for the guided installer and compatibility wizard.

| Item | Value |
|---|---|
| Checkpoint commit on `main` (pre-change) | `dd9f7ff` — `chore: checkpoint site before guided installer` |
| Pre-change tag (annotated, local¹) | `pre-guided-installer-20260711-0258` |
| Feature branch | `feature/guided-linux-installer` (kept, not deleted) |
| Feature commit | `a0f9c6d` — `feat: add guided Linux installer and compatibility wizard` |
| Merge commit on `main` (`--no-ff`) | `7c003cc` |
| Post-change tag (annotated, local¹) | `guided-installer-v1-20260711` |

¹ The hosting environment's git proxy accepted branch pushes but rejected
tag pushes at the time of merge; both tags exist in the repository history
locally and the SHAs above are authoritative. Push the tags from any
authenticated clone with:
`git push origin pre-guided-installer-20260711-0258 guided-installer-v1-20260711`

## How to roll back (non-destructive)

```bash
git revert -m 1 7c003cc
git push origin main
```

This creates a new commit that undoes the feature while preserving history.
**Do not** use `git reset --hard` or force-push to roll back — the revert
above is the supported process, and the feature branch remains available to
re-land or cherry-pick from later.

## What rollback affects

The feature is additive: reverting removes the `/get-started` route, the
wizard components/libraries, the data files, the download scripts, the new
KB pages, and the homepage/nav changes. No pre-existing content was moved
or deleted by the feature, so no redirects are needed after a revert.
Visitors' locally stored wizard state (in their browsers) is untouched and
simply unused.
