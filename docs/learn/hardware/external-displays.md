---
sidebar_position: 4
title: "External Displays"
description: "USB-C video output, DisplayPort Alt Mode, adapters, hubs, wireless display, and what to do when your phone has no wired video out."
difficulty: "Beginner"
estimated_time: "12 minutes"
keywords:
  - external display
  - displayport alt mode
  - usb-c
  - hdmi
  - miracast
last_verified: "2026-07-11"
---

# External displays

**Estimated time:** 12 minutes · **Difficulty:** Beginner ·
**Requirements:** none · **Expected outcome:** you know whether your phone
can drive a monitor, with which hardware, and what the alternatives are.

## USB-C ≠ video output

The single most common misconception: **a USB-C port does not imply video
output.** Wired video requires **DisplayPort Alt Mode** — a separate
hardware capability. Many popular USB-C phones lack it entirely (their port
is USB 2.0 data + charging only). Check your exact model in the
[compatibility matrix](/docs/compatibility/overview) or your manufacturer's
spec sheet; the [Get Started wizard](/get-started) checks it for cataloged
devices automatically.

Real examples from the ADL catalog (verified 2026-07-11):

- **Has wired video out:** Samsung Galaxy S22+/S23/S24 and Tab S9 (DeX),
  Google Pixel 8/9 (enabled via the June 2024 feature drop; Pixel 6/7 have
  no video out), Motorola Edge+ (2023) and ThinkPhone (Ready For wired).
- **No wired video out despite USB-C:** Samsung Galaxy A54/A14 (USB 2.0
  ports), Motorola Edge 40 (wireless Ready For only).
- **Unconfirmed either way:** OnePlus 11/12, Xiaomi 14 — no qualifying
  source confirms it; test before buying display hardware.

## Wired connections that work

- **USB-C → HDMI adapter or cable** — simplest single-monitor path.
- **USB-C hub / dock with HDMI or DisplayPort** — adds USB ports for
  keyboard/mouse and (on good hubs) **Power Delivery pass-through** so the
  phone charges during use. See [USB-C hubs](/docs/learn/hardware/usb-c-hubs).
- **USB-C → USB-C displays** — works when both the phone and monitor
  support DP Alt Mode over the cable used.
- **DVI/VGA-only monitors** — need active adapters; results vary, treat as
  experimental.

4K displays work on capable devices but increase rendering load and power
draw — a powered hub is strongly recommended, and phones may limit output
to 1080p/1440p in practice.

## Manufacturer desktop modes

- **Samsung DeX** — a desktop-style Android environment on the external
  screen; the Linux desktop runs full-screen inside it. See
  [What is Samsung DeX?](/docs/learn/concepts/what-is-samsung-dex).
- **Motorola Ready For / Smart Connect** — equivalent for supported Moto
  devices; note recent Motorola generations are **wireless-only**.
- **Android desktop mode (Pixel)** — GA since Android 16 QPR3 (March 2026)
  on Pixel 8 and later.

## No wired output? You still have three options

1. **Phone screen** — Termux:X11 renders the desktop directly on the
   device; a Bluetooth keyboard and mouse make it surprisingly usable.
2. **Wireless display (Miracast / Cast)** — mirrors the screen to a
   compatible TV/monitor; expect noticeable latency, fine for documents,
   poor for fast interaction.
3. **VNC from another computer** — the desktop renders on your laptop/PC
   over the local network (password-protected, localhost-first; see the
   [display troubleshooting page](/docs/troubleshooting/display)).

Missing wired output never blocks running Linux itself.

## Touch, resolution, and scaling

External touchscreens are generally **not** passed through to the Linux
session. High-DPI phone screens often need scaling (`termux-x11 :1 -dpi
120` or desktop-level scaling). Monitor audio over HDMI depends on Android
routing sound to the display — see [audio](/docs/troubleshooting/audio).

## Summary

Wired video needs DP Alt Mode (check the exact model, not the port shape);
hubs with Power Delivery make the best workstations; and phones without
video out still run Linux via phone screen, wireless, or VNC.

## Next steps

- [USB-C hubs and docks](/docs/learn/hardware/usb-c-hubs)
- [Recommended setup](/docs/learn/hardware/recommended-setup)
- [Get Started wizard](/get-started)
