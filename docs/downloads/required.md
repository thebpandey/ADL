---
sidebar_position: 1
title: "Required Downloads"
description: "All required software downloads for setting up ADL on your Android device."
---

# Required Downloads

These are the essential applications you need to run a Linux desktop on your Android device. All three must be installed before you can use ADL.

<Warning>
Do **not** install Termux or Termux:X11 from the Google Play Store. The Play Store versions are outdated, no longer maintained, and will not work correctly with ADL. Always use the sources listed below.
</Warning>

## F-Droid

F-Droid is an open-source app store for Android. You need it to install the correct versions of Termux and other components. Think of it as an alternative to the Google Play Store that specializes in free and open-source software.

<DownloadCard
  name="F-Droid"
  description="Open-source app store for Android. Required to install the correct version of Termux and other open-source apps."
  url="https://f-droid.org/F-Droid.apk"
  version="Latest"
  size="~8 MB"
  icon="store"
/>

### Installing F-Droid

1. Download the APK from the link above using your phone's browser.
2. Open the downloaded file. Android may ask you to allow installs from unknown sources --- tap **Settings** and enable it for your browser.
3. Follow the on-screen prompts to install.
4. Open F-Droid and wait for it to update its repository list. This can take a minute or two on the first launch.

<Tip>
F-Droid updates its repository index periodically. If you do not see the latest version of an app, pull down to refresh the repository list.
</Tip>

---

## Termux

Termux is the foundation of ADL. It provides a Linux-compatible terminal environment on Android without requiring root access. The Ubuntu desktop environment, window manager, and all Linux applications run inside Termux via proot.

<DownloadCard
  name="Termux"
  description="Terminal emulator and Linux environment for Android. The core component that makes ADL possible."
  url="https://f-droid.org/en/packages/com.termux/"
  version="Latest (F-Droid)"
  size="~100 MB"
  icon="terminal"
/>

### Why F-Droid and not the Play Store?

The Google Play Store version of Termux has not been updated since 2020. It uses outdated build tools, targets an old Android API level, and lacks critical features needed for ADL. The F-Droid version is actively maintained and receives regular updates.

If you already have the Play Store version installed, **uninstall it first** before installing the F-Droid version. The two versions use different signing keys and cannot coexist on the same device.

### Installing Termux

1. Open F-Droid on your device.
2. Search for **"Termux"**.
3. Tap **Termux** (by Fredrik Fornwall) and then tap **Install**.
4. Once installed, open Termux. You should see a terminal prompt.
5. Run the following command to make sure everything is up to date:

```bash
pkg update && pkg upgrade
```

<Note>
On first launch, Termux will download and set up its base packages. This requires an internet connection and may take a few minutes depending on your network speed.
</Note>

### Granting permissions

Termux needs storage access to interact with your device's files. Run this command inside Termux:

```bash
termux-setup-storage
```

Tap **Allow** when Android asks for permission. This creates a `storage` directory inside Termux that links to your device's shared storage.

For a detailed walkthrough of the Termux installation process, see the [Install Termux](/docs/quick-start/install-termux) guide.

---

## Termux:X11

Termux:X11 is a display server companion app for Termux. It provides the graphical output layer that lets you see and interact with the Linux desktop. Without it, you would only have a command-line interface.

<DownloadCard
  name="Termux:X11"
  description="X11 display server for Termux. Renders the Linux desktop GUI on your Android device's screen."
  url="https://github.com/termux/termux-x11/releases"
  version="Latest (GitHub Releases)"
  size="~15 MB"
  icon="display"
/>

<Warning title="Samsung devices">
Samsung devices may silently block the Termux:X11 APK. If the installer closes without installing the app, see [Termux:X11 APK will not install on Samsung devices](/docs/troubleshooting/display#termux-apk-will-not-install-on-samsung-devices).
</Warning>

### How Termux:X11 works

Traditional Linux desktops use an X11 or Wayland display server to render windows and handle input. Termux:X11 acts as a native Android X11 server, receiving rendering commands from the Linux desktop environment running inside Termux and displaying them as an Android activity. This approach provides smooth performance and proper touch or mouse input handling.

### Installing Termux:X11

1. Visit the [Termux:X11 releases page](https://github.com/termux/termux-x11/releases) on your phone's browser.
2. Download the latest `.apk` file from the **Assets** section of the most recent release.
3. Open the downloaded APK and install it. You may need to allow installs from unknown sources for your browser if you have not already done so.
4. Also download the companion `termux-x11.deb` file from the same release, if provided. This is the Termux-side package that enables communication between Termux and the Termux:X11 app.

<Warning>
Termux:X11 must be installed from the same source (GitHub) and must be compatible with your version of Termux. Mixing versions from different sources can cause display issues or crashes.
</Warning>

### Installing the Termux companion package

If a `.deb` companion package is provided with the release, install it inside Termux:

```bash
dpkg -i /path/to/termux-x11.deb
```

Or, if the project provides a Termux package repository, follow the instructions on the release page to add the repository and install via `pkg`.

<Tip>
After installing all three required applications, proceed to the [Quick Start guide](/docs/quick-start/overview) to set up your Linux desktop environment.
</Tip>

---

## Compatibility notes

- All three apps must be installed from the sources listed above. Do not mix Play Store and F-Droid versions.
- Termux and Termux:X11 must use compatible signing keys. Installing both from F-Droid or both from their respective official sources ensures this.
- These apps support Android 7.0 and above, though Android 10 or later is recommended for the best experience.
- For device-specific installation guidance, see the [Samsung](/docs/installation/samsung/overview), [Pixel](/docs/installation/pixel/overview), or [OnePlus](/docs/installation/oneplus/overview) installation guides.

---

## Verification checklist

Before moving on to the installation steps, confirm that you have:

- F-Droid installed and updated
- Termux installed from F-Droid, with storage permission granted
- Termux:X11 installed from GitHub Releases
- All apps opening without errors
