---
sidebar_position: 1
title: "Termux:X11"
description: "How Termux:X11 works as a native X11 display server on Android, why it outperforms VNC, and how to install and configure it for ADL."
---

# Termux:X11

Termux:X11 is a native Android application that functions as a full X11 display server. It allows Linux GUI applications running inside Termux (or a proot-distro container) to render their windows directly on your Android screen, without any network protocol or pixel-streaming layer in between.

In the ADL stack, Termux:X11 is the recommended way to display your Linux desktop. It replaces older approaches like VNC with a faster, simpler, and more responsive solution.

## How It Works

When you launch Termux:X11, the app creates a Unix domain socket that implements the X11 display protocol. Here is what happens under the hood:

1. **Termux:X11 starts** and listens on display `:0` via a shared socket in Termux's tmp directory.
2. **Your Linux environment** (Ubuntu under proot-distro) sets `DISPLAY=:0` so GUI applications know where to draw.
3. **GUI apps** (XFCE, Firefox, file managers) send X11 rendering commands through the socket.
4. **Termux:X11** receives those commands and composites the output directly onto an Android `SurfaceView`, bypassing any encoding or network layer.

<Note title="No network involved">
Unlike VNC, Termux:X11 never encodes pixels into a network format. The X11 commands travel through a local Unix socket and are rendered directly by the Android GPU. This is why it feels like a native app rather than a remote desktop.
</Note>

Because the rendering path stays entirely on-device and uses shared memory where possible, input latency is dramatically lower than any streaming-based approach.

## Why Termux:X11 Over VNC

VNC was the original way to get a graphical desktop on Termux. It works, but it adds unnecessary overhead. Here is how the two compare:

| Feature | Termux:X11 | VNC (TigerVNC / x11vnc) |
|---|---|---|
| Rendering path | Direct X11 socket | Framebuffer encode/decode |
| Latency | Near-native (~5-10ms) | Noticeable (~30-80ms) |
| Resolution | Matches device display | Fixed at startup |
| Touch input | Native Android events | Simulated mouse via viewer |
| Hardware acceleration | Partial (virpipe possible) | None |
| Setup complexity | Install app + one package | Install server + viewer app |
| CPU overhead | Low | Moderate (encoding) |

<PerformanceNote>
On most Android devices, Termux:X11 uses 15-30% less CPU than an equivalent VNC session because it skips the framebuffer encoding step entirely. This translates to better battery life and cooler device temperatures during extended desktop sessions.
</PerformanceNote>

For a deeper look at VNC and when it might still be useful (such as remote access from another device), see [VNC](/docs/learn/software/vnc).

## Installation

Termux:X11 requires two components: an Android app and a companion Termux package. Both must be installed for it to work.

### Step 1: Install the Android App

Download the latest Termux:X11 APK from the [GitHub releases page](https://github.com/termux/termux-x11/releases). Look for the file named `app-universal-release.apk` under the most recent release.

Open this URL in your Android browser to download the APK:

<CopyCommand command="https://github.com/termux/termux-x11/releases" />

After downloading, tap the APK to install it. You may need to enable "Install from unknown sources" for your browser in Android Settings > Apps > Special access.

<Warning title="Do not install from Google Play">
There is no official Termux:X11 listing on Google Play. If you find one, it is unofficial and potentially outdated or malicious. Always install from the GitHub releases page or from F-Droid.
</Warning>

### Step 2: Install the Termux Companion Package

Inside Termux, install the companion package that creates the display socket:

<CopyCommand command="pkg install termux-x11-nightly" />

<ExpectedResult>
The package downloads and installs in a few seconds. You will see standard apt output confirming the installation.
</ExpectedResult>

### Step 3: Verify the Installation

Confirm that the `termux-x11` command is available:

<CopyCommand command="which termux-x11" />

<ExpectedResult>
/data/data/com.termux/files/usr/bin/termux-x11
</ExpectedResult>

<Tip>
If you installed Termux from F-Droid, make sure you also installed Termux:X11 from a compatible source (GitHub releases or F-Droid). Mixing Play Store and F-Droid builds causes signature mismatches that prevent the shared socket from working.
</Tip>

## Starting Termux:X11

The basic launch sequence involves starting the display server in Termux, then launching your desktop environment inside the Linux container.

### Quick Start

From the Termux prompt (not inside Ubuntu):

<CopyCommand command="termux-x11 :0 -ac &" />

Then open the Termux:X11 app on your device. It will show a blank screen, waiting for a desktop to connect.

Next, start your desktop environment inside Ubuntu:

<CopyCommand command="proot-distro login ubuntu --shared-tmp -- bash -c 'export DISPLAY=:0; dbus-launch --exit-with-session startxfce4'" />

Switch to the Termux:X11 app, and your XFCE desktop should appear.

<BestPractice>
Create a shell script that combines these steps so you can launch your desktop with a single command. See the [First Launch](/docs/quick-start/first-launch) guide for a ready-made script.
</BestPractice>

## Configuration

Termux:X11 exposes its settings through the Android app. Open the app, tap the three-dot menu or gear icon, and you will find the following options.

### Display Settings

- **Resolution mode**: Choose between "exact" (uses your device's native resolution) or "scaled" (renders at a lower resolution and upscales). Exact mode looks sharper but uses more GPU resources.
- **Display density (DPI)**: Controls how large UI elements appear. A value of 160-200 works well on phones; 120-160 suits tablets. Adjust this if text and icons appear too small or too large.
- **Display orientation**: Lock to landscape, portrait, or allow auto-rotation.

<Note title="Matching DPI to your device">
If your desktop UI elements look tiny, increase the DPI. If they look oversized and crowd the screen, decrease it. A good starting point is your device's actual DPI divided by 1.5.
</Note>

### Input Settings

- **Touch input mode**: Choose between "touchpad" (finger movement controls a cursor, like a laptop trackpad) or "direct touch" (tap where you want to click). Touchpad mode is more precise for desktop applications.
- **Show additional keyboard**: Enables a floating toolbar with keys like Ctrl, Alt, Tab, and Escape that are missing from Android keyboards.
- **Capture external mouse/keyboard**: When enabled, a connected USB or Bluetooth mouse and keyboard are captured directly by Termux:X11 rather than going through Android input handling.

<BestPractice>
Use touchpad mode if you are working with desktop applications that have small click targets. Use direct touch mode for casual browsing or when using touch-friendly applications.
</BestPractice>

## Understanding the Display Protocol

Termux:X11 implements the [X11 (X Window System)](/docs/learn/concepts/what-is-wayland) display protocol. X11 is the traditional display system used by Linux desktops for decades. It defines how applications draw windows, handle input events, and communicate with the display server.

<CollapsibleSection title="X11 vs Wayland on Android">

You may have heard that Wayland is replacing X11 on desktop Linux. On Android via Termux, however, X11 remains the practical choice because:

- Termux:X11 is mature and stable as an X11 server.
- Most desktop environments still support X11 fully.
- Wayland compositors require kernel-level features (KMS/DRM) that are not available through proot.

For background on display protocols, see [What is Wayland?](/docs/learn/concepts/what-is-wayland).

</CollapsibleSection>

## Troubleshooting

<Troubleshooting items={[
  {
    problem: "Black screen after launching the desktop",
    solution: "Make sure you started termux-x11 in Termux before launching the desktop environment in Ubuntu. Also verify that DISPLAY=:0 is set correctly. Try killing existing processes with 'pkill -f termux-x11' and starting fresh."
  },
  {
    problem: "App crashes or closes immediately",
    solution: "Check that both the Android app and the termux-x11-nightly package are from compatible versions. Update both to the latest release. On some devices, battery optimization kills Termux:X11 in the background -- disable battery optimization for both Termux and Termux:X11 in Android Settings."
  },
  {
    problem: "Touch input is not responding or is offset",
    solution: "Open Termux:X11 settings and try switching between touchpad and direct touch modes. If the cursor position is offset from where you tap, changing the resolution mode from 'exact' to 'scaled' (or vice versa) usually fixes the alignment."
  },
  {
    problem: "Screen resolution is wrong or everything is tiny",
    solution: "Adjust the DPI setting in Termux:X11 preferences. You can also set the resolution from within your desktop environment using xrandr. Run 'xrandr --output default --mode 1920x1080' (replacing with your desired resolution) inside Ubuntu."
  },
  {
    problem: "\"Unable to connect to display :0\" error",
    solution: "This means the X11 socket is not available. Ensure you used --shared-tmp when logging into proot-distro, as this flag shares the tmp directory where the socket lives. The correct command is: proot-distro login ubuntu --shared-tmp"
  }
]} />

<CommonMistake title="Forgetting --shared-tmp">
The most frequent setup error is omitting `--shared-tmp` from the proot-distro login command. Without this flag, the Linux container cannot see the X11 socket that Termux:X11 created, and every GUI application will fail with a "cannot open display" error.
</CommonMistake>

## FAQ

<FAQ items={[
  {
    question: "Can I use Termux:X11 without proot-distro?",
    answer: "Yes. You can run X11 applications installed directly in Termux without proot-distro. However, the selection of GUI apps available natively in Termux is limited compared to a full Ubuntu installation."
  },
  {
    question: "Does Termux:X11 support GPU acceleration?",
    answer: "Partial GPU acceleration is possible through virpipe (VirGL) on some devices. Performance varies by GPU vendor and Android version. Software rendering is the default and works reliably on all devices."
  },
  {
    question: "Can I run Termux:X11 and VNC at the same time?",
    answer: "Yes, but on different display numbers. For example, Termux:X11 on :0 and VNC on :1. This is useful if you want local display via Termux:X11 and remote access via VNC simultaneously."
  },
  {
    question: "Is Termux:X11 compatible with Samsung DeX?",
    answer: "Yes. When connected to a DeX station or monitor, Termux:X11 can render on the external display. See the Samsung DeX guide for configuration details."
  }
]} />
