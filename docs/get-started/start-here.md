---
sidebar_position: 1
title: "Start Here"
description: "What the ADL guided installer does, what it cannot guarantee, and the basic terms you'll meet along the way."
difficulty: "Beginner"
estimated_time: "5 minutes"
keywords:
  - get started
  - guided installer
  - compatibility wizard
last_verified: "2026-07-11"
---

# Start here

**Estimated time:** 5 minutes · **Difficulty:** Beginner ·
**Requirements:** none · **Expected outcome:** you know what the
[Get Started wizard](/get-started) does, what it cannot promise, and which
words matter.

## What this site helps you do

Android Desktop Linux helps you answer three questions, in order:

1. **Can my Android phone run a Linux desktop?** — assessed across separate
   dimensions (memory, storage, Android version, display output, and more),
   each with its own confidence level.
2. **Which Linux setup fits me?** — a transparent recommendation for a
   distribution, desktop environment, display method, and accessories, with
   the reasoning shown for every choice.
3. **How exactly do I set it up?** — a personalized, step-by-step guide from
   the first app install to a working desktop, where every command says
   where to run it and what should happen.

The **[Get Started wizard](/get-started)** does all three. It runs entirely
in your browser: no account, and your answers never leave your device.

## What the guided installer does

- Asks about your device, goals, experience, display, input devices, and
  audio — “I don't know” is always a valid answer.
- Looks your device up in the [ADL compatibility catalog](/docs/compatibility/overview);
  unknown devices get honest specification-based results, never automatic
  rejection.
- Generates an installation guide tailored to your configuration, with
  checkpoints, troubleshooting links, backups, and a removal path.
- Optionally imports a [device report](/docs/downloads/scripts) generated on
  the phone itself, because a browser cannot reliably detect Android
  hardware.

## What it cannot guarantee

A compatibility result is an **estimate built from evidence**, and the
evidence quality is always shown (officially documented → verified by ADL →
community reports → inferred from specifications → unknown). Android
updates, One UI changes, Termux releases, and Linux packages all move —
something that worked last month can change. That is why every material
claim in ADL carries a source and a verification date, and why the wizard
requires an explicit risk acknowledgment before showing executable
instructions.

## Basic terminology

- **Termux** — a terminal app for Android; everything runs inside it. See
  [What is Termux?](/docs/learn/concepts/what-is-termux)
- **proot** — the user-space trick that lets a full Linux system run inside
  Termux without root. See [What is proot?](/docs/learn/concepts/what-is-proot)
- **Termux:X11** — the app that displays your Linux desktop. See
  [Termux:X11](/docs/learn/software/termux-x11)
- **Distribution (distro)** — the Linux system itself (Debian, Ubuntu,
  Alpine, Arch).
- **Desktop environment** — the graphical interface (Xfce, MATE, LXQt, KDE
  Plasma). See [What is a desktop environment?](/docs/learn/concepts/what-is-a-desktop-environment)

## Rootless vs. rooted

Everything ADL's guided path installs is **rootless**: it runs in user
space, changes nothing about Android itself, and uninstalls cleanly. The
“root” user you may meet *inside* the Linux environment is simulated by
proot — it is not Android root. Rooting a phone or unlocking a bootloader is
a separate path with different risks, and it is **not** part of the default
route. See [What Linux on Android means](/docs/learn/concepts/linux-on-android-explained).

## Summary

The wizard assesses, recommends, and guides — transparently and locally.
Nothing is guaranteed; everything is explained.

## Next steps

- **[Open the Get Started wizard](/get-started)**
- [How compatibility is assessed](/docs/get-started/methodology)
- [The disclaimer that applies to personalized instructions](/docs/get-started/disclaimer)
