---
sidebar_position: 2
title: "Galaxy S22+ Verified Configuration"
description: "The maintainer-verified reference workstation configuration for the Samsung Galaxy S22+."
device: "Samsung Galaxy S22+"
android_version: "Android 16"
linux_distribution: "Ubuntu 24.04"
desktop_environment: "XFCE 4.18"
verified: true
verification_date: "2026-07-10"
maintainer: "thebpandey"
compatibility_level: "fully-supported"
---

# Samsung Galaxy S22+ — Verified Configuration

The ADL reference workstation: every guide on this site is tested against this exact configuration.

<VerifiedConfiguration id="galaxy-s22-plus-reference" />

<HardwareRequirements ids={["usb-c-hdmi-pd-hub-generic", "monitor-1080p", "bt-keyboard-mouse-combo", "portable-ssd-usb3", "pd-charger-65w"]} />

## Reproduce this setup

Follow the [Quick Start](/docs/quick-start/overview) end to end, then the [Samsung DeX setup](/docs/quick-start/samsung-dex). Device-specific notes live in the [Galaxy S22+ installation guide](/docs/installation/samsung/galaxy-s22-plus).

## Field report

This section records a **real single-device installation experience**
(Ubuntu + Xfce via Termux and Termux:X11). It is a field report, not a
universal statement: results can vary by exact model number (SM-S906B/U/N/E…),
chipset (Snapdragon 8 Gen 1 vs Exynos 2200, by region), Android and One UI
version, Termux and Termux:X11 builds, Ubuntu release, and installed
packages. Where the reporting device's exact variant or One UI version is
not recorded, it is listed as *unspecified* rather than guessed.

### Observed symptoms and what we know about each

1. **Ubuntu with Xfce launched, but audio did not initially work.**
   *Confirmed general behavior, not Samsung-specific:* sound requires
   PulseAudio forwarding from Termux (`PULSE_SERVER=127.0.0.1`) — installing
   a desktop or PulseAudio inside Ubuntu alone produces silence. Fix
   documented in [audio troubleshooting](/docs/troubleshooting/audio).
   *Confidence: reproduced community report (community-standard recipe).*

2. **Security settings had to be adjusted before Termux:X11 could be
   installed.** *Confirmed One UI behavior:* One UI 6+ ships **Auto
   Blocker** enabled, which blocks sideloaded APKs including the official
   Termux:X11 app. Safe fix: temporarily disable, install, re-enable — see
   [Termux:X11 on Samsung](/docs/learn/software/termux-x11#samsung-devices-auto-blocker).
   *Confidence: verified (Samsung documents Auto Blocker; behavior
   reproduced in this report).*

3. **The initially available browser did not launch.** *Field-report
   observation with an unidentified browser:* the exact package is not
   recorded, so no cause is claimed. If it was Ubuntu's `firefox` or
   `chromium-browser` deb, both are Snap stubs that cannot run under proot
   — a known general cause. Recorded as a symptom pending a reproducible
   report. *Confidence: single-device field report; cause uncertain.*

4. **Chromium did not work.** *Consistent with known general behavior:*
   Chromium refuses to run as root without `--no-sandbox` (which ADL does
   not recommend), and its sandbox/GPU process commonly fails under proot.
   Diagnostic: try as a non-root user; expectation remains unreliable. See
   [web browsers](/docs/applications/browsers). *Confidence: reproduced
   community report for the general behavior.*

5. **Firefox worked only after hardware acceleration was disabled.**
   *Confirmed general behavior on this stack:* the software-only GL path
   under proot + Termux:X11 breaks Firefox's hardware acceleration.
   Fix: Settings → General → Performance → uncheck both performance
   checkboxes (or `gfx.webrender.software=true`). *Confidence: field report,
   consistent with documented prefs.*

6. **The Linux environment entered as root by default.** *Confirmed general
   proot-distro behavior, not a Samsung issue:* `proot-distro login` enters
   as the container's (simulated) root unless `--user` is passed. The
   [guided installer](/get-started) creates a non-root user as a standard
   step. *Confidence: officially documented.*

### Remaining uncertainty

The exact model number, region/chipset, One UI version, and the identity of
the failing "native browser" from this report are unrecorded. These gaps are
why the report stays labeled *field report* rather than *verified for all
S22+ variants*.

### Help improve this record

If you run ADL on a Galaxy S22+, please [submit a test](/docs/compatibility/submit-a-test)
including: exact model number, chipset, Android version, One UI version,
audio result, browser result, external-display result, keyboard/mouse
result, and any workarounds you needed.
