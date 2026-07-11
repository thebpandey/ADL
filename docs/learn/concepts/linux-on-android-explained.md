---
sidebar_position: 13
title: "What Linux on Android Means in ADL"
description: "What actually runs when you follow ADL: Android keeps running, proot provides a Linux user space, simulated root is not Android root, and some things behave differently."
difficulty: "Beginner"
estimated_time: "8 minutes"
keywords:
  - proot
  - linux on android
  - expectations
  - simulated root
last_verified: "2026-07-11"
---

# What Linux on Android means in ADL

**Estimated time:** 8 minutes · **Difficulty:** Beginner ·
**Requirements:** none · **Expected outcome:** accurate expectations about
what the ADL setup is — and is not.

The normal ADL route installs a **Linux user-space environment** inside
[Termux](/docs/learn/concepts/what-is-termux) using
[proot](/docs/learn/concepts/what-is-proot). Calling it “native full Linux”
without qualification would be misleading, so here is precisely what that
means.

## What stays the same

- **Android continues running.** Nothing is flashed, replaced, or rooted.
  Your apps, notifications, and calls work exactly as before.
- **The Android kernel stays in charge.** The Linux environment shares
  Android's kernel; it does not boot its own.
- **Removal is clean.** Deleting the distro (and the Termux apps) returns
  the phone to exactly its prior state.

## What you actually get

- A real distribution's user space — real `apt`/`apk`/`pacman`, real
  packages, a real desktop — running inside Termux, with proot translating
  file paths and system calls in user space.
- Real Linux applications: browsers, editors, compilers, servers.

## What behaves differently under proot

- **The “root” you see is simulated.** `whoami` may say `root` inside the
  environment, but that is proot pretending for compatibility — it grants
  no Android privileges whatsoever. Day-to-day work should still use a
  normal user: browsers misbehave as root, some tools refuse to run, and
  user configuration belongs in a real home directory.
- **No kernel modules.** Anything requiring kernel access — VPN drivers,
  filesystem mounts, USB drivers — is unavailable.
- **No systemd / full init system.** Services don't start at “boot”; you
  start what you need. This is also why GNOME (which depends on systemd
  session services) is unsupported here.
- **Filesystem-heavy work is slower.** proot intercepts every file-related
  system call; compiling large projects or database-heavy workloads pay a
  noticeable tax.
- **Containers and low-level networking differ.** Docker, `mount`, raw
  sockets, and similar system administration tools generally do not work
  or behave differently.

## The rooted path is a different path

A rooted phone or custom ROM enables `chroot`-based setups with fewer
limitations — and a completely different risk profile (warranty, banking
apps, OTA updates, security). ADL documents the **rootless** route; rooted
setups are out of scope for the guided installer.

## Summary

ADL's route = Android untouched + a genuine Linux user space via proot +
a few honest limitations (simulated root, no kernel modules, no systemd,
slower file I/O).

## Next steps

- [What is proot?](/docs/learn/concepts/what-is-proot) — the mechanism in depth
- [Get Started wizard](/get-started) — your personalized path
- [proot-distro](/docs/learn/software/proot-distro) — managing distributions
