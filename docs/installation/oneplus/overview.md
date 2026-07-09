---
sidebar_position: 1
title: "OnePlus Devices"
description: "OnePlus-specific installation notes covering OxygenOS and ColorOS differences, battery optimization, desktop mode, and troubleshooting for running ADL on OnePlus devices."
---

# OnePlus Devices

<Note>
Follow the [Common Installation guide](/docs/installation/common/prerequisites) first. This page covers OnePlus-specific differences only. Everything in the common guide applies to OnePlus devices — this page documents the settings, behaviors, and quirks unique to OxygenOS and OnePlus hardware.
</Note>

## OnePlus Overview

OnePlus devices run OxygenOS, a customized Android skin that historically stayed close to stock Android but has diverged significantly in recent years. Starting with OxygenOS 13, the software is built on the same ColorOS codebase used by Oppo (OnePlus's parent company). This means that newer OnePlus devices have different system behaviors, settings locations, and background process management compared to older OxygenOS versions.

For ADL users, the key concern is that OxygenOS includes aggressive battery optimization and background process killing that can terminate Termux sessions without warning. This page explains how to configure your OnePlus device so ADL runs reliably.

### OxygenOS vs ColorOS

The distinction matters because it changes where settings are located and how aggressively the system manages background apps:

- **OxygenOS 12 and earlier** (OnePlus 9 series and older with original software): Closer to stock Android. Settings paths resemble what you see on Pixel or Motorola devices. Battery optimization is present but less aggressive.
- **OxygenOS 13 and newer** (OnePlus 11 and newer, plus older devices updated to OxygenOS 13+): Built on ColorOS. Includes additional background process restrictions, a different battery optimization UI, and features like "Auto-optimize" that aggressively manage apps.
- **ColorOS** (OnePlus devices sold in China): Full ColorOS without the OxygenOS branding. Similar to OxygenOS 13+ but with additional region-specific features.

<Warning title="OxygenOS 13+ Changes Background App Behavior">
If your OnePlus device updated from OxygenOS 12 to 13 or later, your battery optimization settings may have been reset. Termux may start getting killed in the background even if it worked fine before the update. Re-apply all the battery and background process settings described on this page after any major OxygenOS update.
</Warning>

---

## Desktop Mode

Some OnePlus devices include a built-in desktop mode that provides a windowed interface when connected to an external display. Unlike Samsung DeX, OnePlus desktop mode is less feature-rich and not available on all models.

### Checking for Desktop Mode

1. Connect your OnePlus device to an external monitor via a USB-C to HDMI adapter.
2. Go to **Settings > Connected devices > Connection preferences**.
3. Look for **Desktop mode** or **PC Connect** — if present, you can enable it.

Alternatively, check from Developer Options:

1. Go to **Settings > About phone** and tap **Build number** seven times to enable Developer Options.
2. Go to **Settings > System > Developer options**.
3. Look for **Force desktop mode** or **Enable freeform windows**.

<Note title="Desktop Mode Availability">
Desktop mode is available on the OnePlus 8 Pro, OnePlus 9 series, OnePlus 10 Pro, OnePlus 11, and newer Pro/Ultra models. Standard (non-Pro) models may lack this feature. Even when available, the implementation is basic — it provides freeform windows but does not include a taskbar or full desktop shell like Samsung DeX.
</Note>

### Desktop Mode and ADL

OnePlus desktop mode can coexist with ADL but does not replace Termux:X11. When desktop mode is active and you launch Termux:X11, the X11 session renders inside a freeform window on the external display. This can be useful — you get a resizable Linux desktop window alongside your Android apps.

<BestPractice>
If your OnePlus device supports desktop mode and you have an external monitor, try running ADL with desktop mode enabled. The freeform window approach gives you the ability to switch between your Linux desktop and Android apps without Alt-Tabbing through Termux.
</BestPractice>

---

## OxygenOS-Specific Settings

### Battery Optimization

OxygenOS battery optimization is more aggressive than stock Android. You must exempt Termux from multiple layers of optimization.

#### Step 1: Disable Standard Battery Optimization

1. Open **Settings > Battery** (on OxygenOS 13+, this may be **Settings > Battery > More settings**).
2. Tap **Battery optimization**.
3. Tap the dropdown at the top and select **All apps**.
4. Find **Termux**, tap it, and select **Don't optimize**.

Repeat for **Termux:X11** and **Termux:API**.

#### Step 2: Disable App-Specific Battery Settings

On OxygenOS 13+, there is a second layer of battery management per app:

1. Go to **Settings > Apps > App management** (or **Settings > Apps > See all apps**).
2. Find and tap **Termux**.
3. Tap **Battery usage** (or **App battery usage**).
4. Select **Allow background activity** and set battery usage to **Unrestricted**.

<CopyCommand command="adb shell dumpsys deviceidle whitelist +com.termux" />

### Background Process Limits

Developer Options includes a setting that limits the number of background processes. By default, OxygenOS allows the system to decide, but you can explicitly increase the limit:

1. Go to **Settings > System > Developer options**.
2. Scroll to **Background process limit**.
3. Set it to **Standard limit** or **At most 4 processes** (the maximum option).

<Warning title="Do Not Set 'No Background Processes'">
Setting the background process limit to "No background processes" will immediately kill Termux when you switch to another app. This is sometimes enabled by users attempting to improve performance. If ADL keeps dying when you switch apps, check this setting first.
</Warning>

### OxygenOS Auto-Kill Behavior

OxygenOS 13+ includes an "Auto-optimize" or "Smart power saver" feature that learns your app usage patterns and kills apps it considers unused. Termux does not fit the usage pattern of a typical Android app — it runs long background sessions with no visible UI activity — so the system is likely to target it.

To prevent auto-kill:

1. Go to **Settings > Battery > Advanced settings** (or **Settings > Battery > More settings**).
2. Disable **Sleep standby optimization** if present.
3. Disable **Optimize battery use during sleep** if present.

Additionally, lock Termux in the recent apps view:

1. Open Termux so it appears in your recent apps.
2. Open the recent apps view (swipe up and hold, or tap the square navigation button).
3. Tap the three-dot menu on the Termux card (or long-press the card, depending on OxygenOS version).
4. Select **Lock** (a lock icon will appear on the card).

<Tip>
Locking an app in the recent apps view tells OxygenOS to never auto-kill it. This is the single most effective step for keeping Termux alive on OnePlus devices. Do this for Termux:X11 as well.
</Tip>

---

## ColorOS Differences (OxygenOS 13+)

If your OnePlus device runs OxygenOS 13 or newer, the underlying system is ColorOS. The following additional settings may apply:

### Auto-Launch Management

ColorOS has an auto-launch management system that controls which apps can start themselves or be started by other apps:

1. Go to **Settings > Apps > App management > Termux**.
2. Tap **Auto-launch** and ensure it is enabled.
3. Tap **Allow other apps to launch** and ensure it is enabled.

This is important because Termux:X11 needs to be launched by Termux, and auto-launch restrictions can block this.

<Note title="Settings Paths May Vary">
OnePlus frequently reorganizes settings menus across OxygenOS updates. If you cannot find a setting at the path described above, use the search function in the Settings app to find it by name.
</Note>

---

## Performance on Snapdragon Chips

OnePlus devices use Qualcomm Snapdragon processors, which are well-suited for ADL workloads. The Snapdragon platform benefits from mature Adreno GPU drivers and strong single-core CPU performance.

### What to Expect by Chipset

- **Snapdragon 8 Gen 3 / 8 Elite** (OnePlus 12, 13): Excellent performance. Compiling, multitasking, and desktop rendering are smooth. These chips handle ADL workloads with headroom to spare.
- **Snapdragon 8 Gen 2** (OnePlus 11): Very good performance. Slightly less thermal headroom than Gen 3 but handles sustained workloads well.
- **Snapdragon 8 Gen 1** (OnePlus 10 Pro): Good performance but runs hot. Expect thermal throttling during heavy compilation. Consider using a cooling solution for extended sessions.
- **Snapdragon 888** (OnePlus 9 series): Adequate for basic ADL use. The 888 is notorious for thermal issues, so expect throttling under sustained load.
- **Snapdragon 865 and earlier** (OnePlus 8 and older): Functional but limited. These chips have less RAM bandwidth and slower cores. Suitable for light desktop use and text editing but not recommended for development workloads.

<PerformanceNote>
Snapdragon chips provide better single-core performance than Tensor chips at the same generation, which translates to faster single-threaded compilation and snappier UI rendering in the Linux desktop. If raw performance for development work is your priority, OnePlus devices with recent Snapdragon chips are among the fastest Android devices for ADL.
</PerformanceNote>

---

## Compatibility

<Compatibility items={[
  { name: "Termux from F-Droid", status: "full", notes: "Works on all OnePlus devices running Android 10+ with OxygenOS or ColorOS" },
  { name: "proot-distro", status: "full", notes: "Full support on all Snapdragon-based OnePlus devices" },
  { name: "Termux:X11", status: "full", notes: "On-device rendering works on all models" },
  { name: "USB-C display output", status: "partial", notes: "Supported on OnePlus 8 Pro and newer Pro/Ultra models. Standard models may lack DisplayPort Alt Mode." },
  { name: "Desktop mode (freeform windows)", status: "partial", notes: "Available on select Pro and Ultra models. Check Settings > Connected devices." },
  { name: "Bluetooth keyboard/mouse", status: "full", notes: "Standard Android Bluetooth, works out of the box" },
  { name: "Wake lock (termux-wake-lock)", status: "full", notes: "Requires Termux:API add-on. Essential on OnePlus due to aggressive background killing." },
  { name: "Audio passthrough", status: "full", notes: "PulseAudio over Termux works on all OnePlus models" }
]} />

---

## Troubleshooting

<Troubleshooting items={[
  {
    problem: "Termux is killed within minutes of switching to another app on OxygenOS 13+",
    solution: "OxygenOS 13+ aggressively kills background apps. Apply all three layers of protection: (1) Disable battery optimization for Termux in Settings > Battery, (2) Set Termux to 'Unrestricted' in Settings > Apps > Termux > Battery usage, (3) Lock Termux in the recent apps view. Also run termux-wake-lock inside Termux. If the problem persists, check Developer Options > Background process limit and ensure it is not set to 'No background processes'."
  },
  {
    problem: "Termux:X11 fails to launch or shows a black screen after OxygenOS update",
    solution: "OxygenOS updates can reset auto-launch permissions. Go to Settings > Apps > App management > Termux:X11 and verify that 'Auto-launch' and 'Allow other apps to launch' are both enabled. Also check that Termux:X11 has the 'Display over other apps' permission under Settings > Apps > Special app access."
  },
  {
    problem: "Device overheats and performance drops during compilation on OnePlus 10 Pro or OnePlus 9",
    solution: "Snapdragon 8 Gen 1 and 888 are known for high thermal output. Remove the phone case, place the device on a cool surface, and consider using a clip-on phone cooler. You can also limit CPU usage from within Termux by reducing the number of parallel compile jobs (e.g., use 'make -j2' instead of 'make -j4'). Avoid charging while running heavy workloads — charging generates additional heat."
  },
  {
    problem: "Storage permissions error when accessing shared Android storage from the Linux environment",
    solution: "OxygenOS may revoke storage permissions for apps that have not been used in the foreground recently. Open Termux, run 'termux-setup-storage', and grant the storage permission when prompted. If the permission dialog does not appear, go to Settings > Apps > Termux > Permissions and manually enable Storage access."
  }
]} />
