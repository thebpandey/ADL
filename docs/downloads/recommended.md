---
sidebar_position: 2
title: "Recommended Downloads"
description: "Optional but recommended apps that enhance the ADL experience on your Android device."
---

# Recommended Downloads

These applications are not strictly required to run ADL, but they significantly improve the experience. Each one addresses a specific usability gap --- from better keyboard input to remote access and file management.

---

## Keyboard apps

The default Android keyboard is designed for messaging, not terminal commands or desktop Linux. A keyboard with proper modifier keys, arrow keys, and an escape key makes working in the Linux desktop far more practical.

### Hacker's Keyboard

<DownloadCard
  name="Hacker's Keyboard"
  description="Full five-row keyboard with Ctrl, Alt, Esc, Tab, and arrow keys. Essential for terminal and desktop use without a physical keyboard."
  url="https://f-droid.org/en/packages/org.pocketworkstation.pckeyboard/"
  version="Latest (F-Droid)"
  size="~3 MB"
  icon="keyboard"
/>

Hacker's Keyboard provides a PC-style layout with all the modifier keys that Linux applications expect. It includes:

- **Ctrl, Alt, and Esc keys** --- needed for terminal shortcuts and desktop environment hotkeys
- **Arrow keys** --- for cursor navigation in text editors and terminals
- **Tab key** --- for command completion in the terminal
- **Function keys (F1--F12)** --- useful in applications like Vim, Nano, and Midnight Commander

<Tip>
In landscape mode, Hacker's Keyboard displays all five rows by default. In portrait mode, you may need to adjust the settings to show the full layout. Go to the keyboard's settings and set the portrait row count to 5.
</Tip>

<BestPractice>
If you are using ADL on your phone's screen without an external keyboard, Hacker's Keyboard is practically essential. Install it before your first Linux desktop session.
</BestPractice>

---

## VNC viewers

If you prefer to access your Linux desktop remotely --- for example, from another device on the same network, or as an alternative display method to Termux:X11 --- a VNC viewer lets you connect to a VNC server running inside your Linux environment.

### bVNC

<DownloadCard
  name="bVNC"
  description="Open-source VNC viewer for Android. Connect to your Linux desktop remotely or use it as an alternative display method."
  url="https://f-droid.org/en/packages/com.iiordanov.freebVNC/"
  version="Latest (F-Droid)"
  size="~10 MB"
  icon="remote"
/>

bVNC is a free and open-source VNC client available on F-Droid. It supports multiple VNC encodings, SSH tunneling, and touchscreen gestures for navigation.

### When to use VNC instead of Termux:X11

- **Remote access** --- View and control your Linux desktop from a tablet, laptop, or another phone on the same Wi-Fi network.
- **Multi-device workflows** --- Run ADL on one device and interact with it from another.
- **Compatibility fallback** --- If Termux:X11 has issues on your specific device, VNC provides an alternative display path.

<Note>
VNC generally has higher latency and lower visual quality compared to Termux:X11, which renders natively. Use Termux:X11 as your primary display method and VNC as a secondary or remote option.
</Note>

### Setting up a VNC server

To use a VNC viewer, you need a VNC server running inside your Linux environment. Install one with:

```bash
sudo apt install tigervnc-standalone-server
```

Then start the server:

```bash
vncserver :1 -geometry 1920x1080 -depth 24
```

Connect from bVNC using `localhost:5901` if on the same device, or your device's local IP address if connecting from another device.

---

## File managers

While the XFCE desktop includes Thunar as its default file manager, you may also want an Android-native file manager to move files between your Android storage and the Linux environment.

### Material Files

<DownloadCard
  name="Material Files"
  description="Open-source Material Design file manager for Android. Useful for managing files between Android and the Linux environment."
  url="https://f-droid.org/en/packages/me.zhanghai.android.files/"
  version="Latest (F-Droid)"
  size="~5 MB"
  icon="folder"
/>

Material Files is a clean, open-source file manager that supports:

- Root access (if your device is rooted)
- Archive extraction (ZIP, TAR, etc.)
- FTP/SFTP server for transferring files to and from the Linux environment
- A well-designed Material You interface

### Amaze File Manager

<DownloadCard
  name="Amaze File Manager"
  description="Lightweight open-source file manager with built-in terminal and archive support."
  url="https://f-droid.org/en/packages/com.amaze.filemanager/"
  version="Latest (F-Droid)"
  size="~8 MB"
  icon="folder"
/>

Amaze is another solid open-source option with a built-in app manager, database reader, and archive support. Both Material Files and Amaze are available on F-Droid.

<Tip>
Files stored in Termux's shared storage directory (accessible after running `termux-setup-storage`) can be browsed from any Android file manager. This makes it easy to move downloaded files, images, or documents between your Android apps and the Linux desktop.
</Tip>

---

## Terminal enhancement

### Termux:API

<DownloadCard
  name="Termux:API"
  description="Access Android hardware and system APIs from Termux. Enables notifications, camera, sensors, and more from the command line."
  url="https://f-droid.org/en/packages/com.termux.api/"
  version="Latest (F-Droid)"
  size="~5 MB"
  icon="api"
/>

Termux:API bridges the gap between your Linux environment and Android hardware. With it, you can:

- Send Android notifications from scripts
- Access the device camera from the command line
- Read sensor data (accelerometer, light sensor, etc.)
- Share text or files via Android's share menu
- Query device battery status, Wi-Fi info, and more

After installing the Termux:API app from F-Droid, install the companion package inside Termux:

```bash
pkg install termux-api
```

<Note>
Termux:API must be installed from F-Droid, not the Play Store, to be compatible with the F-Droid version of Termux. The signing keys must match.
</Note>

---

## Summary

| App | Purpose | Source | Priority |
|-----|---------|--------|----------|
| Hacker's Keyboard | Full keyboard with modifier keys | F-Droid | High (if no physical keyboard) |
| bVNC | Remote desktop access | F-Droid | Medium |
| Material Files | File management | F-Droid | Medium |
| Amaze File Manager | Alternative file manager | F-Droid | Low |
| Termux:API | Android hardware access | F-Droid | Low |

All recommended apps are free and open-source. Install them from F-Droid to ensure compatibility with your Termux installation.

For the required downloads (F-Droid, Termux, and Termux:X11), see the [Required Downloads](/docs/downloads/required) page.
