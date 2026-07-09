---
sidebar_position: 3
title: "Official Resources"
description: "Official download links, repositories, and documentation for all ADL components."
---

# Official Resources

This page collects every official download link, repository, and documentation source for the components that make up an ADL environment. Use only the sources listed here.

<Warning title="Avoid Unofficial Sources">
Never download Termux or its add-ons from the Google Play Store. The Play Store version is severely outdated, no longer receives updates, and **will break** when paired with current packages. Likewise, avoid random APK mirror sites (APKPure, APKMirror, etc.) -- they may ship unsigned, tampered, or outdated builds.
</Warning>

## Termux

The terminal emulator and Linux environment that forms the foundation of ADL.

<DownloadCard
  name="Termux (F-Droid)"
  description="Recommended source. Always up to date and signed by the Termux team."
  url="https://f-droid.org/en/packages/com.termux/"
/>

<DownloadCard
  name="Termux (GitHub Releases)"
  description="Direct APK downloads from the official repository."
  url="https://github.com/termux/termux-app/releases"
/>

<Note title="Documentation">
The Termux Wiki is the authoritative reference for packages, configuration, and troubleshooting: [wiki.termux.com](https://wiki.termux.com/).
</Note>

## Termux Add-ons

All add-ons must come from the **same source** as Termux itself (F-Droid or GitHub). Mixing sources causes signature mismatches.

<DownloadCard
  name="Termux:API"
  description="Access Android APIs (camera, sensors, notifications) from the terminal."
  url="https://f-droid.org/en/packages/com.termux.api/"
/>

<DownloadCard
  name="Termux:Styling"
  description="Customize fonts and color schemes for the Termux terminal."
  url="https://f-droid.org/en/packages/com.termux.styling/"
/>

<DownloadCard
  name="Termux:Widget"
  description="Run Termux scripts from Android home-screen widgets."
  url="https://f-droid.org/en/packages/com.termux.widget/"
/>

<DownloadCard
  name="Termux:Boot"
  description="Execute scripts automatically when the device boots."
  url="https://f-droid.org/en/packages/com.termux.boot/"
/>

<DownloadCard
  name="Termux:Float"
  description="Run Termux in a floating window overlay."
  url="https://f-droid.org/en/packages/com.termux.window/"
/>

## Termux:X11

The X11 display server used by ADL to render a full graphical desktop on Android.

<DownloadCard
  name="Termux:X11 (GitHub Releases)"
  description="Pre-built APK and companion package for the Termux:X11 display server."
  url="https://github.com/niclas-niclas/termux-x11-releases/releases"
/>

<Note>
Termux:X11 replaces VNC for most ADL setups. It provides lower latency and native Android integration compared to a VNC viewer.
</Note>

## proot-distro

The tool that installs and manages Linux distributions inside Termux without root access.

<DownloadCard
  name="proot-distro (GitHub)"
  description="Source repository and issue tracker."
  url="https://github.com/termux/proot-distro"
/>

<Tip>
You do not download proot-distro manually. Install it inside Termux with `pkg install proot-distro`, then use `proot-distro install ubuntu` to set up your distribution.
</Tip>

## Ubuntu

<DownloadCard
  name="Ubuntu"
  description="Official Ubuntu website and release information."
  url="https://ubuntu.com/"
/>

Ubuntu is installed through proot-distro, not downloaded as a standalone image. The `proot-distro install ubuntu` command fetches the correct rootfs automatically from official mirrors.

## XFCE Desktop

The lightweight desktop environment used by default in ADL.

| Resource | URL |
|---|---|
| Official Website | [xfce.org](https://xfce.org/) |
| Documentation | [docs.xfce.org](https://docs.xfce.org/) |

XFCE is installed via `apt` inside the proot Ubuntu environment. No separate download is required.

## PulseAudio

Provides audio output from the Linux environment to the Android host.

| Resource | URL |
|---|---|
| Official Website | [freedesktop.org/wiki/Software/PulseAudio](https://www.freedesktop.org/wiki/Software/PulseAudio/) |

PulseAudio is installed via `pkg` in Termux and configured to bridge audio between the proot environment and Android.

## Documentation and Community

| Resource | URL |
|---|---|
| Termux Wiki | [wiki.termux.com](https://wiki.termux.com/) |
| Termux Subreddit | [r/termux](https://www.reddit.com/r/termux/) |
| Termux Discord | [discord.gg/termux](https://discord.gg/termux) |
| XDA Forums | [xda-developers.com](https://xda-developers.com/t/termux) |

<BestPractice>
When troubleshooting, search the Termux Wiki first, then the subreddit. Most common issues have already been documented in one of these two places.
</BestPractice>

## Verifying Downloads

Always verify that downloaded APKs are authentic before installing them.

### Check SHA256 Checksums

After downloading an APK from GitHub Releases, compare its SHA256 hash against the value published in the release notes:

```bash
sha256sum termux-app_v0.118.0+github-debug_arm64-v8a.apk
```

### Use Official Sources Only

Stick to F-Droid and GitHub Releases. Both platforms verify package signatures before distribution. F-Droid builds packages from source and signs them with its own reproducible-build pipeline.

### Check Signing Keys (F-Droid)

F-Droid packages are signed with the Termux team's key. If you install via F-Droid, the client verifies signatures automatically. When sideloading from GitHub, ensure the APK is signed by the same key used across all official Termux releases.

<Warning>
If Android warns about a signature mismatch when updating, do **not** proceed. Uninstall the existing version first (this will clear Termux data), then install from the correct source. A signature mismatch means the old and new APKs came from different sources.
</Warning>
