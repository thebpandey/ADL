---
sidebar_position: 1
title: "Samsung Devices Overview"
description: "Samsung-specific installation differences, DeX integration, Good Lock modules, and battery optimization for ADL."
---

# Samsung Devices Overview

<Note title="Prerequisites">
Follow the **Common Installation** guide first to set up Termux, proot-distro, and your Ubuntu environment. Return here afterward for Samsung-specific configuration steps.
</Note>

## What's Different for Samsung

Samsung devices run One UI on top of Android, which introduces both advantages and challenges for ADL:

- **Samsung DeX** provides a native desktop-like interface that pairs naturally with ADL's Linux desktop environment.
- **One UI background restrictions** are more aggressive than stock Android, requiring extra configuration to keep Termux running reliably.
- **Good Lock modules** offer granular control over multitasking and display behavior that can improve the ADL experience.
- **Samsung-specific display scaling** may need adjustment for Termux:X11 to render at the correct resolution.

Understanding these differences ensures a stable, well-integrated ADL setup on Samsung hardware.

## Samsung DeX Integration

### What Is DeX?

Samsung DeX (Desktop Experience) transforms your phone into a desktop computing environment when connected to an external monitor. It provides a taskbar, resizable windows, and mouse/keyboard support natively at the Android level.

### How DeX Works with ADL

When you run ADL inside DeX mode, the Linux desktop environment (XFCE) runs within a Termux:X11 window that can be maximized on your external display. This gives you a full Linux desktop on your monitor while your phone screen remains usable for Android apps.

The combination is powerful: DeX handles window management at the Android layer, while XFCE manages the Linux desktop within its window. You get the benefits of both environments simultaneously.

### Enabling DeX

1. Connect your Samsung device to an external monitor via USB-C (directly or through a hub).
2. DeX should activate automatically. If it does not, pull down the notification shade and tap the DeX notification.
3. On the external display, open Termux and start your ADL session normally.

<Tip>
For the best experience, set Termux:X11 to full-screen mode within DeX. Right-click the Termux:X11 title bar on the DeX display and select "Full screen" or maximize the window.
</Tip>

## Good Lock Modules

Good Lock is Samsung's official customization suite, available through the Galaxy Store. Several modules are particularly useful for ADL:

### MultiStar

MultiStar enables advanced multi-window features. For ADL, the key settings are:

- **Use Multi Window for all apps** -- Allows Termux:X11 to run in split-screen or pop-up view alongside other apps.
- **Multi Window edge shortcut** -- Quick access to launch Termux:X11 in a split configuration.

### Sound Assistant

Sound Assistant lets you set per-app audio output. If you run ADL on an external monitor with speakers, you can route Linux audio to the monitor while keeping phone notifications on the device speaker.

### NiceLock (Third-Party)

If Good Lock is not available in your region, NiceLock (available on GitHub and some app stores) provides access to the same modules. Install it and download the relevant modules from within the app.

<Note>
Good Lock modules update frequently with One UI versions. If a module is incompatible after a system update, check the Galaxy Store for an updated version before troubleshooting further.
</Note>

## Samsung-Specific Battery Optimization

Samsung's One UI applies aggressive battery management that will kill Termux background processes if not configured correctly. This is the single most important Samsung-specific step.

### Disable Background Restrictions for Termux

1. Open **Settings > Battery > Background usage limits**.
2. Tap **Never sleeping apps**.
3. Add the following apps:
   - **Termux**
   - **Termux:X11**
   - **Termux:API** (if installed)

<CopyCommand command="am start -a android.settings.BATTERY_SAVER_SETTINGS" />

### Disable Battery Optimization (Per-App)

1. Open **Settings > Apps > Termux**.
2. Tap **Battery**.
3. Select **Unrestricted**.
4. Repeat for Termux:X11.

### Disable Adaptive Battery

Adaptive Battery learns which apps you use infrequently and restricts them. Since Termux runs as a background service, it can be incorrectly flagged.

1. Open **Settings > Battery > Adaptive battery**.
2. Toggle it **off**, or ensure Termux is in the "Never sleeping" list as described above.

<Warning title="Sleeping Apps Will Kill Your Session">
If Termux is placed in the "Sleeping apps" or "Deep sleeping apps" list, Samsung will terminate it within minutes of switching to another app. You will lose your running Linux session without warning. Always verify Termux appears under "Never sleeping apps."
</Warning>

## Samsung-Specific Display Settings

### Resolution and DPI for Termux:X11

Samsung devices often default to FHD+ resolution to save battery. For the best Termux:X11 experience:

1. Open **Settings > Display > Screen resolution**.
2. Select **WQHD+** (if available on your device) for maximum resolution.
3. In Termux:X11 preferences, set the resolution to match your display or use the "exact" resolution mode.

### Refresh Rate

Higher refresh rates make the XFCE desktop feel more responsive:

1. Open **Settings > Display > Motion smoothness**.
2. Select **Adaptive** or **High** for 120Hz support (available on S21 and newer).

<BestPractice>
When running on battery, use Adaptive refresh rate to let the system drop to 60Hz during static content. When connected to power or DeX, use the High setting for a smoother desktop experience.
</BestPractice>

## Compatibility

<Compatibility items={[
  { name: "Samsung DeX (wired)", status: "full", notes: "USB-C to monitor with XFCE in Termux:X11 works reliably." },
  { name: "Samsung DeX (wireless)", status: "partial", notes: "Works but may introduce display latency. Wired is recommended." },
  { name: "Good Lock MultiStar", status: "full", notes: "Multi-window and pop-up view work correctly with Termux:X11." },
  { name: "One UI gesture navigation", status: "full", notes: "Gestures work normally; swipe up returns to Android home." },
  { name: "Secure Folder", status: "none", notes: "Termux cannot be installed or run inside Secure Folder." },
  { name: "Samsung Knox", status: "partial", notes: "Enterprise Knox policies may block Termux installation." },
  { name: "S Pen input", status: "partial", notes: "S Pen registers as a pointer in Termux:X11 but pressure sensitivity is not passed through." },
  { name: "120Hz in Termux:X11", status: "full", notes: "Supported on devices with 120Hz displays when Motion smoothness is set to High." }
]} />

## Troubleshooting

<Troubleshooting items={[
  { problem: "Termux is killed in the background after a few minutes.", solution: "Add Termux and Termux:X11 to Settings > Battery > Background usage limits > Never sleeping apps. Also set battery usage to Unrestricted under Settings > Apps > Termux > Battery." },
  { problem: "DeX does not detect external monitor.", solution: "Try a different USB-C cable or hub. Some hubs do not support DisplayPort Alt Mode, which Samsung requires. Look for hubs explicitly listing DeX or DisplayPort compatibility." },
  { problem: "Termux:X11 resolution is wrong on DeX.", solution: "In Termux:X11 preferences, set display resolution mode to 'exact' and manually specify the monitor's native resolution." },
  { problem: "Good Lock modules show 'Not supported' after One UI update.", solution: "Uninstall and reinstall the module from the Galaxy Store. Good Lock modules must match your One UI version." },
  { problem: "Audio does not play through the external monitor in DeX.", solution: "Open Settings > Sounds and vibration > Separate app sound. Set Termux:X11 to output through the HDMI/USB-C audio device." },
  { problem: "XFCE desktop feels laggy on DeX.", solution: "Disable compositing in XFCE: Settings Manager > Window Manager Tweaks > Compositor > uncheck Enable display compositing. Also ensure you are using a wired DeX connection." }
]} />
