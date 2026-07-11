---
sidebar_position: 2
title: "Compatibility Methodology"
description: "How ADL assesses device compatibility: dimensions, confidence levels, resource heuristics, and what 'tested' actually means."
difficulty: "Beginner"
estimated_time: "10 minutes"
keywords:
  - compatibility
  - methodology
  - confidence
  - evidence
last_verified: "2026-07-11"
---

# Compatibility methodology

**Estimated time:** 10 minutes · **Difficulty:** Beginner ·
**Requirements:** none · **Expected outcome:** you can read any ADL
compatibility result and know exactly how much to trust it.

## No single yes/no answer

“Is my phone compatible?” has no honest one-word answer, so ADL never gives
one. The [wizard](/get-started) evaluates **separate dimensions**, each with
its own status and confidence:

1. Linux user-space compatibility (Termux + proot)
2. CPU architecture and package availability
3. Graphical desktop feasibility
4. Available memory
5. Available storage
6. Android version and background-process behavior
7. Manufacturer restrictions
8. Termux and display-server installation feasibility
9. External wired-display capability
10. Wireless-display capability
11. Keyboard and mouse connectivity
12. Audio feasibility
13. Workload suitability
14. Thermal and sustained-performance risk
15. Evidence quality for the exact device variant

A phone that cannot drive a wired monitor is **not** “incompatible with
Linux” — it simply uses the phone screen, a wireless display, or VNC.

## Status levels

| Status | Meaning |
|---|---|
| Likely compatible | Evidence supports this working |
| Compatible with limitations | Works, with named trade-offs |
| Experimental | Possible but not dependable; expect problems |
| Unknown / insufficient evidence | No qualifying evidence either way |
| Unlikely to run a usable graphical desktop | Graphics blocked or impractical; CLI may still work |
| Command-line use recommended | The honest recommendation is no desktop |
| Blocked by a known requirement | A hard requirement is not met |

**An unknown device is never marked incompatible** just because it is absent
from the catalog — it gets specification-based results labeled as such.

## Confidence levels

Compatibility (what we think) and confidence (how well we know it) are
shown separately:

| Confidence | Meaning |
|---|---|
| Officially documented | Stated by the vendor/project's own documentation |
| Verified by the ADL project | Reproduced by a maintainer on reference hardware |
| Reproduced community report | Multiple independent community confirmations |
| Single-device field report | One real-world report (like the [Galaxy S22+ report](/docs/compatibility/devices/galaxy-s22-plus)) |
| Inferred from specifications | Deduced from spec sheets, not tested |
| Unknown | No qualifying evidence |

Example of a real result:

> **Graphical desktop feasibility: Likely compatible** ·
> Confidence: Inferred from specifications ·
> *8 GB RAM and Android 14 support a desktop session via Termux:X11. The
> exact model has not yet been verified by the ADL project.*

## Resource heuristics (ADL planning bands)

These are **planning heuristics, not guarantees**, and they are versioned
with the recommendation rules:

**RAM (total device RAM, shared with Android):**

- Under ~3 GB — command-line use recommended; a desktop competes with
  Android for memory.
- ~3–4 GB — lightweight desktop (LXQt) only, with explicit warnings.
- ~6 GB — Xfce or MATE preferred.
- ~8 GB+ — Xfce/MATE comfortably; KDE Plasma viable for experienced users.
- GNOME — treated as unsupported under proot (it depends on systemd session
  services proot cannot provide; GNOME 50 also removed X11 sessions).

**Free storage:**

- Under ~6 GB — no full desktop installation recommended.
- ~6–10 GB — lightweight installation only.
- ~12 GB+ — the preferred baseline (desktop + browser + updates + apps).

The wizard's storage estimate adds up: Termux base, distro root filesystem,
desktop packages, browser, package cache, your workloads, and a safety
reserve.

**Architecture:** native ARM64 is the supported path. 32-bit ARM works for
core tools but modern desktop/browser packages are disappearing for it.
Cross-architecture emulation (QEMU user mode) is advanced, substantially
slower, and never the default recommendation.

## Why exact model numbers matter

Devices with one marketing name ship with different chipsets (Snapdragon vs
Exynos), different USB data/video capabilities, and different regional
restrictions. The catalog records model numbers (like `SM-S906B`) precisely
so the wizard can tell you when a claim applies to your exact variant versus
the marketing family. Likewise, **USB-C does not imply video output** —
DisplayPort Alt Mode is a separate hardware capability that many USB-C
phones lack.

## How to submit a device result

Community evidence is how coverage grows. Follow
[Submit a test](/docs/compatibility/submit-a-test) — reports enter as
*community* evidence and are promoted to *verified* only after maintainer
reproduction. Nothing is recorded above what was actually tested.

## Summary

Fifteen dimensions, explicit statuses, explicit confidence, versioned
heuristics, and honest handling of unknowns.

## Next steps

- **[Run the wizard](/get-started)**
- [Device compatibility matrix](/docs/compatibility/overview)
- [Submit a test](/docs/compatibility/submit-a-test)
