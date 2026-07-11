---
sidebar_position: 0
title: "Symptom Index"
description: "Symptom-first troubleshooting: find what you're seeing, jump straight to the fix."
difficulty: "Beginner"
estimated_time: "2 minutes"
keywords:
  - troubleshooting
  - symptoms
  - signal 9
  - black screen
last_verified: "2026-07-11"
---

# Symptom index

**Find what you're seeing, jump to the fix.** Each entry links to the
canonical page for that problem. The optional
[adl-doctor.sh](/docs/downloads/scripts) script diagnoses the whole chain
automatically and names the failing link.

## Installing apps

| Symptom | Where to go |
|---|---|
| APK install silently blocked on Samsung (One UI 6+) | [Termux:X11 — Samsung Auto Blocker](/docs/learn/software/termux-x11#samsung-devices-auto-blocker) |
| "App not installed" / signatures do not match | [Install Termux — sources](/docs/quick-start/install-termux) — never mix F-Droid/GitHub/Play builds; uninstall all Termux apps and reinstall from one source |
| "Install unknown apps" permission missing | Grant it to your browser: Settings > Apps > (browser) > Install unknown apps; revoke afterwards |

## Termux

| Symptom | Where to go |
|---|---|
| `[Process completed (signal 9)]` — session dies in background | Android 12+ phantom-process limits: exempt Termux from battery optimization; advanced ADB mitigations (optional, with risks) in [Termux troubleshooting](/docs/troubleshooting/termux) |
| `Unable to locate package` / package not found | Run `pkg update` first; for Termux:X11 packages enable the repo: `pkg install x11-repo` |
| Mirror/repository errors | `termux-change-repo`, pick another mirror ([Termux troubleshooting](/docs/troubleshooting/termux)) |
| Termux closes unexpectedly | Battery optimization + [Termux troubleshooting](/docs/troubleshooting/termux) |

## Display

| Symptom | Where to go |
|---|---|
| Black screen (with or without cursor) in Termux:X11 | [Display troubleshooting](/docs/troubleshooting/display) — session/DISPLAY/--shared-tmp checks, then the documented `-legacy-drawing` flag |
| Red and blue colors swapped | [Display troubleshooting](/docs/troubleshooting/display) — documented `-force-bgra` flag |
| Desktop exits immediately / D-Bus errors | [Display troubleshooting](/docs/troubleshooting/display) — install `dbus-x11`, start via `dbus-launch --exit-with-session …` |
| Tiny text / wrong scaling | [Display troubleshooting](/docs/troubleshooting/display) — `-dpi` flag and desktop scaling |
| Wrong resolution on external monitor | [Display troubleshooting](/docs/troubleshooting/display) |
| External monitor shows no signal | [External displays](/docs/learn/hardware/external-displays) — DP Alt Mode, cable, and hub power checks |
| Session works on phone but not external display | [External displays](/docs/learn/hardware/external-displays) |
| Session freezes / dies when backgrounded | Battery optimization + phantom processes ([Termux troubleshooting](/docs/troubleshooting/termux)) |

## Input

| Symptom | Where to go |
|---|---|
| No keyboard input in the session | [Display troubleshooting](/docs/troubleshooting/display); with no physical keyboard use Termux:X11's on-screen input |
| Mouse not detected | Check Android sees it (pointer appears); then [peripherals](/docs/learn/hardware/peripherals) |
| Alt-Tab / shortcuts trigger Android instead of Linux | Remap in the desktop, or adjust Termux:X11 preferences / DeX keyboard settings |
| Wired keyboard dead through a single-port connection | The port is occupied by the display — use a hub or Bluetooth ([USB-C hubs](/docs/learn/hardware/usb-c-hubs)) |

## Audio

| Symptom | Where to go |
|---|---|
| Desktop works, no sound | [Audio troubleshooting](/docs/troubleshooting/audio) — PulseAudio forwarding is a required one-time setup, not automatic |
| Volume plugin appears disconnected | [Audio troubleshooting](/docs/troubleshooting/audio) |
| No sound on Android 16 specifically | Known open upstream issue — see [Audio troubleshooting](/docs/troubleshooting/audio) |
| HDMI/monitor audio silent | Android controls output routing — [Audio troubleshooting](/docs/troubleshooting/audio) |

## Browsers

| Symptom | Where to go |
|---|---|
| Firefox won't launch / crashes / renders black | Disable hardware acceleration — [Web browsers](/docs/applications/browsers) |
| `apt install firefox` on Ubuntu installs nothing usable | It's a Snap stub; use Mozilla's apt repo — [Web browsers](/docs/applications/browsers) |
| Chromium refuses to start ("--no-sandbox") | Run as a non-root user; never adopt `--no-sandbox` — [Web browsers](/docs/applications/browsers) |
| Warned about running as root | Create a normal user — [What Linux on Android means](/docs/learn/concepts/linux-on-android-explained) |

## System

| Symptom | Where to go |
|---|---|
| "No space left on device" mid-install | Free space, then `dpkg --configure -a && apt --fix-broken install` ([Recovery](/docs/troubleshooting/recovery)) |
| `Could not get lock /var/lib/dpkg/…` | Interrupted install — [Recovery](/docs/troubleshooting/recovery) |
| Network/DNS errors inside the distro | [Network troubleshooting](/docs/troubleshooting/network) |
| Cannot access Android storage from Linux | Run `termux-setup-storage` in Termux first ([file management](/docs/applications/file-management)) |
| Desktop is very slow | [Performance](/docs/troubleshooting/performance) |
| Phone gets hot / throttles | [Performance](/docs/troubleshooting/performance) — sustained charging sessions are the main cause |

## Summary

Match the symptom, follow the canonical page. If several things are broken
at once, run [adl-doctor.sh](/docs/downloads/scripts) and fix the first
FAIL it reports.

## Next steps

- [Troubleshooting overview](/docs/troubleshooting/overview)
- [Doctor script and other tools](/docs/downloads/scripts)
