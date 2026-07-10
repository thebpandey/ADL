---
sidebar_position: 6
title: "Samsung DeX Setup"
description: "Configuring your Linux desktop with Samsung DeX for external display output"
difficulty: Beginner
estimated_time: "10 minutes"
prerequisites:
  - /docs/quick-start/first-launch
next_topics:
  - /docs/samsung/dex-overview
related_topics:
  - /docs/learn/hardware/usb-c-hubs
  - /docs/samsung/dex-optimization
tested_device: "Samsung Galaxy S22+"
tested_android_version: "Android 16"
tested_date: "July 2026"
last_verified: "2026-07-10"
documentation_version: "1.0"
compatibility:
  - samsung-dex
  - displayport
  - keyboard
  - mouse
  - tested
keywords:
  - samsung dex
  - dex
  - external monitor
  - usb-c hub
  - displayport alt mode
  - hdmi
---

# Samsung DeX Setup


<div>
  <CompatibilityBadge type="samsung-dex" />
  <CompatibilityBadge type="displayport" />
  <CompatibilityBadge type="keyboard" />
  <CompatibilityBadge type="mouse" />
  <CompatibilityBadge type="tested" label="Tested on Galaxy S22+" />
</div>


Samsung DeX turns your Galaxy phone or tablet into a desktop workstation by connecting to an external monitor. Combined with ADL, you get a full Linux desktop on a big screen with keyboard and mouse support.

<Note title="Samsung Only">
This guide is specifically for Samsung Galaxy devices that support DeX. If you don't have a Samsung device, you can skip this page -- your desktop is already fully functional from the previous steps.
</Note>

<Requirements items={[
  "Samsung Galaxy phone or tablet with DeX support (Galaxy S8 or newer, most Galaxy Tab S models)",
  "USB-C hub or DeX Station/Pad (for wired connection) or a Miracast-compatible monitor (for wireless DeX)",
  "External monitor with HDMI input",
  "USB or Bluetooth keyboard and mouse (recommended)",
  "Completed all previous Quick Start steps (Termux, Ubuntu, XFCE installed)"
]} />

## Step 1: Connect Your Hardware

**For a wired setup (recommended for best performance):**

1. Connect your USB-C hub to your Samsung device
2. Connect an HDMI cable from the hub to your monitor
3. Connect your keyboard and mouse to the hub's USB ports (or pair via Bluetooth)
4. DeX should activate automatically when the display is detected

**For wireless DeX:**

1. On your Samsung device, go to **Settings > Connected devices > Samsung DeX**
2. Tap **"DeX on other screen"**
3. Select your Miracast-compatible monitor or TV from the list

<ExpectedResult>
Your monitor should display the Samsung DeX interface -- a desktop-like launcher with a taskbar at the bottom. Your phone screen remains usable as a touchpad or shows its normal interface.
</ExpectedResult>

## Step 2: Configure Termux:X11 for DeX

Open the Termux:X11 app. Go to its Preferences/Settings and configure:

- Set the display resolution to match your external monitor (commonly 1920x1080)
- Enable "Fullscreen" mode if available
- Set the display output to the external screen

<Tip>
If Termux:X11 opens on your phone screen instead of the monitor, drag it to the external display using DeX's window management. You can also long-press the Termux:X11 icon in DeX's taskbar and select "Open on connected display" if that option appears.
</Tip>

## Step 3: Launch Your Desktop on the External Display

Open Termux within DeX (it will appear as a windowed app on the external monitor). Run:

<CopyCommand command="~/start-desktop.sh" />

Then switch to the Termux:X11 window. Maximize it or go fullscreen on the external monitor.

<ExpectedResult>
Your XFCE desktop should appear fullscreen on the external monitor. You can use your keyboard and mouse to interact with it just like a regular PC. The desktop will fill the entire monitor at your configured resolution.
</ExpectedResult>

<BestPractice>
For the best DeX experience, keep your Samsung device plugged into power through the USB-C hub. Running a full desktop environment uses significant battery.
</BestPractice>

<Note>
For a comprehensive DeX guide including advanced display configuration, multi-monitor setups, and performance optimization, see [Samsung DeX Setup](/docs/samsung/dex-overview).
</Note>

<Troubleshooting items={[
  {
    problem: "DeX not detecting the external monitor",
    solution: "Make sure your USB-C hub supports video output (not all hubs do -- look for 'DisplayPort Alt Mode' or 'HDMI output' in the hub's specs). Try a different HDMI cable. Check Settings > Connected devices > Samsung DeX and ensure DeX is enabled. Restart your Samsung device if the monitor still isn't detected."
  },
  {
    problem: "Display resolution looks wrong or blurry",
    solution: "In Termux:X11 preferences, manually set the resolution to match your monitor's native resolution (usually 1920x1080 for Full HD or 2560x1440 for QHD). If text appears too small, you can adjust XFCE's display scaling in Settings > Appearance > Fonts, increasing the DPI to 120 or 144."
  },
  {
    problem: "Keyboard or mouse not working in XFCE",
    solution: "If your keyboard and mouse work in Samsung DeX but not in the XFCE desktop, make sure the Termux:X11 window is focused (click on it). For Bluetooth peripherals, pair them through Samsung's Bluetooth settings rather than trying to pair inside Linux. USB peripherals connected through the hub should work automatically."
  },
  {
    problem: "Lag or poor performance on external display",
    solution: "Wireless DeX has higher latency than wired. Switch to a wired USB-C connection if possible. Close unnecessary Android apps running in the background. If XFCE animations are choppy, disable them in Settings > Window Manager Tweaks > Compositor by unchecking 'Enable display compositing'."
  }
]} />

You now have a complete Linux desktop workstation powered by your Samsung Galaxy device.

<NextSteps items={[
  { title: "Samsung DeX Overview", description: "Go deeper: wired vs wireless DeX, optimization, and Galaxy-specific features.", to: "/docs/samsung/dex-overview" },
  { title: "Recommended hardware", description: "Hubs, monitors, and peripherals that work well with DeX.", to: "/docs/learn/hardware/recommended-setup" },
  { title: "Install applications", description: "Fill your new workstation with browsers, editors, and tools.", to: "/docs/applications/overview" },
]} />
