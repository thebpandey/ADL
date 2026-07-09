---
sidebar_position: 1
title: "Google Pixel Devices"
description: "Pixel-specific installation notes, battery settings, Tensor chip considerations, and troubleshooting for running ADL on Google Pixel phones and tablets."
---

# Google Pixel Devices

<Note>
Follow the [Common Installation guide](/docs/installation/common/prerequisites) first. This page covers Pixel-specific differences only. Everything in the common guide applies to Pixel devices — this page documents the settings, behaviors, and quirks that are unique to Pixel hardware and software.
</Note>

## Pixel Overview

Google Pixel devices run stock Android — no manufacturer skin, no added bloatware, no modified system services. This makes Pixel one of the cleanest platforms for running ADL. You get timely Android updates, predictable behavior, and minimal interference from custom battery or process management layers.

However, Pixel devices do not include a desktop mode like Samsung DeX. There is no built-in way to project a windowed desktop environment to an external display through a system-level feature. ADL on Pixel relies entirely on Termux:X11 rendering on the device screen or through standard display output over USB-C where supported.

Pixel devices also ship with Google's custom Tensor processors rather than Qualcomm Snapdragon chips, which brings a different set of performance characteristics for Linux workloads.

---

## Display Output

### On-Device Display

The primary way to use ADL on a Pixel device is through Termux:X11 rendering directly on the device screen. This works identically to the process described in the common installation guide. The Pixel's high-resolution OLED display provides excellent text clarity for terminal and desktop use.

### External Display via USB-C

USB-C display output support varies significantly across Pixel models:

- **Pixel 6 and 6 Pro**: USB-C video output via DisplayPort Alt Mode is supported. You can connect to an external monitor with a USB-C to HDMI or USB-C to DisplayPort adapter.
- **Pixel 7 and newer**: Full USB-C DisplayPort Alt Mode support. These models reliably output video to external displays.
- **Pixel 5 and earlier**: No USB-C video output. These models do not support DisplayPort Alt Mode. The only option is screen mirroring via Chromecast, which introduces latency and is not practical for desktop use.

<Warning title="External Display Is Not Desktop Mode">
Connecting a Pixel to an external monitor via USB-C mirrors or extends the device screen — it does not launch a desktop mode. The Termux:X11 session renders at whatever resolution you configure, and that output is sent to the external display. You will still need a Bluetooth keyboard and mouse for a desktop-like experience.
</Warning>

<BestPractice>
When using an external display, set the Termux:X11 resolution to match your monitor's native resolution for the sharpest output. A resolution mismatch causes scaling artifacts that make text harder to read.
</BestPractice>

---

## Tensor Chip Considerations

Google Pixel 6 and newer devices use Google's custom Tensor processors. These chips are ARM64-based and fully compatible with ADL, but their performance profile differs from Qualcomm Snapdragon chips in ways that matter for Linux workloads.

### What to Expect

Tensor chips prioritize machine learning and image processing workloads. For general CPU-bound tasks like compiling code, running development servers, or text editing in a Linux desktop, Tensor performs well but may not match the raw single-core throughput of flagship Snapdragon chips from the same generation.

Where Tensor excels:

- **Multithreaded workloads**: The chip handles parallel compilation and background tasks efficiently.
- **Sustained performance**: Tensor's thermal management is generally conservative, which means less aggressive throttling during extended sessions.

Where Tensor is slower:

- **Single-threaded compilation**: Build times for single-threaded compilers may be slightly longer compared to Snapdragon 8 Gen 2 or newer.
- **GPU-accelerated rendering**: Tensor uses Mali GPUs, which have less mature open-source driver support than Adreno GPUs in Snapdragon chips. This affects GPU-accelerated applications inside the Linux environment.

<PerformanceNote>
For most ADL use cases — running a desktop environment, editing code, browsing with Firefox, managing files — the Tensor chip provides a smooth experience. Performance differences compared to Snapdragon become noticeable primarily during heavy compilation or when running GPU-intensive applications.
</PerformanceNote>

---

## Pixel-Specific Battery Optimization

Stock Android on Pixel includes aggressive battery optimization that can kill Termux background processes. You must disable battery optimization for Termux and its companion apps to keep ADL sessions running reliably.

### Disable Battery Optimization for Termux

1. Open **Settings** on your Pixel.
2. Tap **Battery**.
3. Tap **Battery optimization** (on Android 14+, this may be under **Battery > Battery usage > Manage battery optimization**).
4. In the dropdown at the top, select **All apps** (by default it shows "Not optimized").
5. Scroll to **Termux** and tap it.
6. Select **Don't optimize** and tap **Done**.

<CopyCommand command="adb shell dumpsys deviceidle whitelist +com.termux" />

<Note title="ADB Alternative">
If you have ADB access from a computer, the command above adds Termux to the battery optimization whitelist directly. This achieves the same result as the manual steps.
</Note>

Repeat this process for **Termux:X11** and **Termux:API** if you have them installed.

### Adaptive Battery

Pixel devices include Adaptive Battery, which uses machine learning to predict which apps you will not use and restricts their background activity. Even with battery optimization disabled, Adaptive Battery can still throttle Termux after extended idle periods.

To prevent this:

1. Go to **Settings > Battery > Adaptive preferences**.
2. Toggle off **Adaptive Battery**.

Alternatively, if you prefer to keep Adaptive Battery enabled for other apps, you can work around its effects by ensuring Termux remains in the foreground or by acquiring a wake lock:

<CopyCommand command="termux-wake-lock" />

<Tip>
Running `termux-wake-lock` inside Termux prevents the system from putting the app into a restricted state. This keeps your ADL session alive even when the screen is off. Run `termux-wake-unlock` when you are done to restore normal battery behavior.
</Tip>

---

## Storage Notes

Pixel devices use file-based encryption (FBE) by default. This is transparent to Termux and ADL — all files within the Termux home directory and proot environment are encrypted at rest by the Android filesystem layer. You do not need to configure anything special.

However, be aware of these Pixel-specific storage behaviors:

- **Automatic storage management**: Pixel devices running Android 12+ may automatically remove cached data from apps when storage is low. Termux data is generally safe, but if your device storage drops below 10%, Android may clear Termux's cache directory. Keep at least 2 GB of free storage at all times.
- **Google Photos integration**: If you are using the shared storage between Android and the Linux environment, files in `~/storage/shared/DCIM` may be automatically uploaded to Google Photos and subsequently deleted locally if the "Free up space" feature is active. This does not affect files inside the proot environment.

<Warning title="Do Not Use Adopted Storage">
Some older Pixel devices offered the option to format an SD card as internal storage (adopted storage). Do not install Termux or ADL on adopted storage. The I/O performance is significantly worse, and removal or corruption of the SD card will destroy your entire Linux environment.
</Warning>

---

## Compatibility

<Compatibility items={[
  { name: "Termux from F-Droid", status: "full", notes: "Works on all Pixel devices running Android 10+" },
  { name: "proot-distro", status: "full", notes: "Full support on all Tensor and Qualcomm-based Pixels" },
  { name: "Termux:X11", status: "full", notes: "On-device rendering works on all models" },
  { name: "USB-C display output", status: "partial", notes: "Pixel 6 and newer only. Pixel 5 and earlier lack DisplayPort Alt Mode." },
  { name: "Bluetooth keyboard/mouse", status: "full", notes: "Standard Android Bluetooth, no special configuration needed" },
  { name: "Wake lock (termux-wake-lock)", status: "full", notes: "Requires Termux:API add-on installed from F-Droid" },
  { name: "GPU acceleration in Linux", status: "partial", notes: "Mali GPU drivers have limited support in proot environments" },
  { name: "Audio passthrough", status: "full", notes: "PulseAudio over Termux works on all Pixel models" }
]} />

---

## Recommended Pixel Models

For the best ADL experience, use a **Pixel 6 Pro or newer**. These models provide:

- Tensor chip with sufficient performance for desktop Linux workloads
- 12 GB of RAM (Pro models), which allows comfortable multitasking between Android and the Linux environment
- USB-C DisplayPort Alt Mode for external monitor support
- Large OLED displays (6.7" on Pro models) suitable for on-device desktop use

The **Pixel Tablet** is also an excellent choice for ADL due to its larger 10.95" screen and included dock, though it uses the same Tensor G2 chip as the Pixel 8 standard model.

Standard (non-Pro) models with 8 GB of RAM work well for lighter workloads — text editing, web browsing, file management — but may struggle with memory-intensive tasks like running multiple IDE windows or compiling large projects.

---

## Troubleshooting

<Troubleshooting items={[
  {
    problem: "Termux is killed after a few minutes in the background on a Pixel running Android 14+",
    solution: "Android 14 introduced stricter background process limits. In addition to disabling battery optimization, go to Settings > Apps > Termux > App battery usage and select 'Unrestricted'. Also run termux-wake-lock to acquire a wake lock that prevents the system from stopping the process."
  },
  {
    problem: "USB-C display adapter shows no output on a Pixel 6 or newer",
    solution: "Ensure you are using a USB-C adapter that supports DisplayPort Alt Mode (not just USB data). Some cheap adapters only support charging and data. Try a different adapter or cable. Also check that Termux:X11 is running and has an active session before connecting the display."
  },
  {
    problem: "Performance drops significantly after 15-20 minutes of heavy use",
    solution: "Tensor chips throttle under sustained thermal load. Remove your phone case to improve heat dissipation. If you are compiling code or running CPU-intensive tasks, consider placing the device on a cool surface or using a small fan. Reducing the Termux:X11 resolution also lowers GPU load and heat."
  },
  {
    problem: "Storage space disappears unexpectedly on Pixel devices",
    solution: "Check if automatic storage management is clearing cached data. Go to Settings > Storage > Free up space and review what Android is cleaning. The proot-distro filesystem can grow over time as you install packages — run 'du -sh $PREFIX/var/lib/proot-distro/installed-rootfs/' to see how much space each distribution is using."
  }
]} />
