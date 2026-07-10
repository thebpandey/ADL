---
sidebar_position: 2
title: "Galaxy S22+"
description: "Galaxy S22+ specific notes and configuration -- the primary ADL reference device."
---

# Galaxy S22+

<Note title="Primary Reference Device">
The Galaxy S22+ (SM-S906B/SM-S906U) is the **primary reference device** for ADL. All guides, performance benchmarks, and default configurations are tested and validated on this device first. If you own an S22+, you are running the most tested ADL configuration available.
</Note>

## Device Specifications

The following specs are relevant to ADL performance and configuration:

| Component | Specification | ADL Relevance |
|-----------|--------------|---------------|
| SoC | Snapdragon 8 Gen 1 (SM8450) | Provides strong single-core and multi-core performance for desktop workloads. |
| RAM | 8 GB LPDDR5 | Shared between Android and Ubuntu via proot. Approximately 4-5 GB available for the Linux environment. |
| Storage | 128 GB / 256 GB UFS 3.1 | Fast read/write speeds benefit package installation and file operations. |
| Display | 6.6" Dynamic AMOLED 2X, 2340x1080 | 120Hz capable. FHD+ resolution works well with XFCE scaling. |
| USB-C | USB 3.2 Gen 1, DisplayPort Alt Mode | Supports wired DeX with full-resolution output to external monitors. |
| Battery | 4500 mAh | Provides 3-5 hours of active ADL use depending on workload and display settings. |

## Performance Characteristics

### What to Expect

Running XFCE on the Galaxy S22+ through proot and Termux:X11 delivers a usable desktop Linux experience. Here is what to realistically expect:

- **Desktop navigation** -- Smooth at 120Hz. Opening menus, switching between windows, and using the file manager feel responsive.
- **Terminal and text editing** -- Excellent. Running vim, nano, or GUI editors like Mousepad is fast with no perceptible lag.
- **Web browsing (Firefox)** -- Functional but heavier sites load slower than on a native x86 desktop. Simple pages and documentation sites work well.
- **Development tools** -- Python, Node.js, and Go compile and run well. Java/Gradle builds are noticeably slower than on desktop hardware but complete successfully.
- **IDE experience** -- VS Code (code-server) runs but consumes significant RAM. Lighter editors are recommended for the 8 GB configuration.

<PerformanceNote>
The Snapdragon 8 Gen 1 is known for thermal throttling under sustained load. During long compilation tasks or heavy multitasking, you may notice performance reduction after 10-15 minutes of sustained CPU usage. This is normal -- the SoC protects itself by reducing clock speeds when the chip temperature exceeds approximately 45 degrees Celsius. Allow the device to cool or reduce workload intensity if you observe slowdowns.
</PerformanceNote>

## DeX Setup for Galaxy S22+

### Wired DeX (Recommended)

The S22+ supports wired DeX through its USB-C port with DisplayPort Alt Mode. To set up:

1. Connect a USB-C hub or USB-C to HDMI/DisplayPort adapter to the S22+.
2. Connect the hub to your external monitor.
3. DeX should activate automatically on the external display.

### USB-C Hub Recommendations

Not all USB-C hubs work reliably with DeX. For the S22+, look for hubs that meet these criteria:

- Explicit DeX or DisplayPort Alt Mode support listed by the manufacturer.
- USB Power Delivery passthrough (to charge while using DeX).
- At least one USB-A port for a keyboard/mouse receiver or wired peripherals.

<BestPractice>
When using DeX for extended sessions, always connect power through the hub's PD passthrough. ADL with an active display and CPU workload can drain the 4500 mAh battery in 2-3 hours without charging.
</BestPractice>

### Wireless DeX

The S22+ supports Wireless DeX to compatible smart TVs and Miracast receivers. While this works with ADL, expect:

- 50-100ms input latency depending on your Wi-Fi network.
- Reduced resolution (often capped at 1080p).
- Occasional frame drops during window animations.

Wired DeX is strongly recommended for any productive work.

## 8 GB RAM Considerations

With 8 GB total RAM shared between Android (One UI) and the Ubuntu proot environment, memory management matters.

### Typical Memory Distribution

| Consumer | Approximate Usage |
|----------|------------------|
| Android system + One UI | 2.5 - 3.0 GB |
| Termux + proot overhead | 0.3 - 0.5 GB |
| XFCE desktop environment | 0.4 - 0.6 GB |
| Available for applications | 4.0 - 4.5 GB |

### Memory Management Tips

- **Close unnecessary Android apps** before starting ADL. Each background Android app reduces available RAM for Linux.
- **Avoid running Samsung Internet, Camera, or other heavy Samsung apps** alongside ADL.
- **Use lightweight Linux applications** when possible. Thunar over Nautilus, Mousepad over gedit, xterm over gnome-terminal.
- **Monitor memory usage** from within Linux:

<CopyCommand command="free -h" />

<ExpectedResult>
              total        used        free      shared  buff/cache   available
Mem:          7.3Gi       3.8Gi       1.2Gi       245Mi       2.3Gi       3.2Gi
Swap:            0B          0B          0B
</ExpectedResult>

<Warning title="No Swap by Default">
proot environments on the S22+ do not have swap space. When physical RAM is exhausted, the Android OOM killer will terminate processes -- often Termux itself. Keep an eye on memory usage during heavy workloads.
</Warning>

## Known Issues and Workarounds

### Thermal Throttling During Compilation

**Issue:** Long-running builds (Rust, large C++ projects, Gradle) cause the Snapdragon 8 Gen 1 to throttle after 10-15 minutes.

**Workaround:** Remove the phone case during heavy workloads. Place the device on a cool surface. If possible, use `taskset` or `nice` to limit CPU utilization:

<CopyCommand command="nice -n 10 make -j4" />

Using `-j4` instead of `-j8` reduces heat generation by limiting parallelism while still providing meaningful build speedup.

### Display Flicker on Resume

**Issue:** Occasionally, returning to the Termux:X11 app after it has been in the background causes brief display flicker or a black screen for 1-2 seconds.

**Workaround:** This is a known Termux:X11 rendering issue on Snapdragon devices. It resolves itself within a few seconds. If the display remains black, switch away from and back to the app.

### Audio Routing After Bluetooth Disconnect

**Issue:** If Bluetooth headphones disconnect while audio is playing inside the Linux environment, audio may not automatically route back to the phone speaker.

**Workaround:** Restart PulseAudio within the Linux environment:

<CopyCommand command="pulseaudio --kill && pulseaudio --start" />

## Recommended Settings

For the best ADL experience on the Galaxy S22+, apply these settings:

### Android / One UI Settings

1. **Display > Motion smoothness:** Adaptive (or High when connected to power).
2. **Display > Screen resolution:** FHD+ (sufficient for on-device use; external monitors use their native resolution via DeX).
3. **Battery > Background usage limits > Never sleeping apps:** Add Termux and Termux:X11.
4. **Security and privacy > Auto Blocker:** Auto Blocker silently blocks the Termux:X11 APK during installation. Disable it temporarily while installing the app, then re-enable it — see [Termux:X11 APK will not install on Samsung devices](/docs/troubleshooting/display#termux-apk-will-not-install-on-samsung-devices).
4. **Apps > Termux > Battery:** Set to Unrestricted.
5. **Developer options > Don't keep activities:** Make sure this is **OFF** (it would destroy Termux:X11 when switching apps).

### XFCE Settings Within ADL

1. **Window Manager Tweaks > Compositor:** Disable compositing for better performance.
2. **Appearance > Font DPI:** Set to 140-160 for comfortable reading on the 6.6" display, or 96-110 for external monitors.
3. **Panel:** Use a single panel at the top to maximize vertical screen space.

<Tip>
If you switch frequently between the phone screen and an external monitor, create two XFCE panel profiles -- one optimized for the small high-DPI screen and one for external monitors. Switch between them with a simple script.
</Tip>

## Compatibility

<Compatibility items={[
  { name: "Wired DeX output", status: "full", notes: "Up to 4K@30Hz or 1440p@60Hz depending on the adapter." },
  { name: "Wireless DeX", status: "partial", notes: "Works but with noticeable latency. Not recommended for typing-heavy work." },
  { name: "120Hz in Termux:X11", status: "full", notes: "Smooth desktop animations when Motion smoothness is set to High or Adaptive." },
  { name: "Snapdragon 8 Gen 1 performance", status: "full", notes: "Strong performance for most desktop tasks. Throttles under sustained heavy load." },
  { name: "USB-C peripherals via hub", status: "full", notes: "Keyboard, mouse, USB drives, and Ethernet adapters work through compatible hubs." },
  { name: "Bluetooth keyboard/mouse", status: "full", notes: "Input is passed through to Termux:X11 without issues." },
  { name: "Vulkan (GPU acceleration)", status: "none", notes: "GPU passthrough to the proot environment is not supported. All rendering is software-based." },
  { name: "Camera passthrough", status: "none", notes: "The phone camera is not accessible from within the Linux environment." },
  { name: "Fingerprint sensor", status: "none", notes: "Not usable for Linux authentication. Use password-based auth." }
]} />

<FAQ items={[
  { question: "Is the Exynos variant of the S22+ also supported?", answer: "Yes, ADL works on both Snapdragon and Exynos variants. However, the Snapdragon model generally offers better sustained performance due to more efficient thermal characteristics. This guide's performance notes are based on the Snapdragon variant." },
  { question: "Can I use a microSD card for additional storage?", answer: "No. The Galaxy S22+ does not have a microSD card slot. Use USB OTG storage through a hub if you need additional space, or manage storage within the internal 128/256 GB." },
  { question: "Will ADL void my Samsung warranty?", answer: "No. ADL runs entirely in userspace through Termux and proot. It does not require root access, bootloader unlocking, or any system modifications. Your warranty remains intact." }
]} />
