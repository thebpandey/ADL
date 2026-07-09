---
sidebar_position: 4
title: "Display Servers"
description: "Configure Termux:X11 and VNC to render your Linux desktop on Android and external displays."
---

# Display Servers

Your Linux desktop environment needs a display server to render its graphical output. In ADL, you have two options: Termux:X11 and VNC. Each works differently, has distinct advantages, and is better suited to different use cases.

For background on display server concepts, see [What is Wayland?](/docs/learn/concepts/what-is-wayland). For detailed setup instructions, see [Termux:X11](/docs/learn/software/termux-x11) and [VNC](/docs/learn/software/vnc).

## How Display Servers Work in ADL

On a standard Linux computer, the display server talks directly to the graphics hardware. In ADL, that is not possible --- Android controls the display hardware. Instead, ADL uses one of two approaches:

- **Termux:X11** acts as an X11 server inside an Android app. Linux applications send their rendering commands to Termux:X11, which displays them as an Android view. This happens locally with shared memory, making it fast.
- **VNC** runs a virtual framebuffer inside the proot container. Linux applications render to this framebuffer, and a VNC client (Android app) connects to view the output. This adds a network protocol layer but works across devices.

## Comparison

| Feature | Termux:X11 | VNC |
|---|---|---|
| **Performance** | Near-native rendering | Noticeable lag |
| **Setup complexity** | Moderate | Simple |
| **Audio support** | Via PulseAudio bridge | Usually none |
| **Remote access** | Local only | Access from any device |
| **Resolution** | Matches device screen | Configurable independently |
| **Input handling** | Native touch/keyboard | VNC client-dependent |
| **GPU acceleration** | Partial (virpipe) | None |
| **Multi-monitor** | Supported (DeX) | Single virtual display |
| **Network required** | No | Localhost or network |
| **Clipboard sharing** | Automatic | VNC client-dependent |

<Decision
  question="Which display server should you use?"
  options={[
    {
      label: "Termux:X11 (Recommended)",
      description: "Best performance and most native-feeling experience. Required for Samsung DeX multi-monitor support. Handles touch input naturally. Use this unless you have a specific reason to use VNC.",
      recommended: true,
    },
    {
      label: "VNC",
      description: "Best for remote access from another device (view your phone's Linux desktop from a laptop). Simpler to set up for testing. Works as a fallback if Termux:X11 has compatibility issues with your device. Also useful for headless server setups where you occasionally want to check a GUI.",
      recommended: false,
    },
  ]}
/>

## Termux:X11 Setup

### Installation

Termux:X11 requires two components: an Android app and a Termux companion package.

1. Download the Termux:X11 APK from the [GitHub releases page](https://github.com/termux/termux-x11/releases)
2. Install the APK on your Android device
3. Install the companion package in Termux:

<CopyCommand command="pkg install termux-x11-nightly" />

### Launch Script

Create a launch script that starts Termux:X11 and your desktop:

<Terminal title="start-x11.sh">

```bash
#!/bin/bash

# Start the Termux:X11 server
termux-x11 -ac &
sleep 2

# Launch the desktop environment inside Ubuntu
proot-distro login ubuntu --shared-tmp -- bash -c \
  "export DISPLAY=:0; dbus-launch --exit-with-session startxfce4"
```

</Terminal>

<CopyCommand command="chmod +x ~/start-x11.sh" />

### Termux:X11 Settings

Open the Termux:X11 Android app and configure these settings for the best experience:

- **Display resolution mode**: "Exact" for sharpest rendering, "Scaled" if performance matters more
- **Show additional keyboard**: Enable if you need function keys and special characters
- **Fullscreen**: Enable for maximum screen space
- **Touch input mode**: "Trackpad" for precise control, "Direct touch" for tablet-style interaction

<Tip>
Use "Trackpad" mode on phones --- it gives you a visible cursor that you move with swipes, similar to a laptop trackpad. This is far more precise than direct touch when interacting with small desktop UI elements.
</Tip>

### Termux:X11 Display Configuration

Set the display resolution from within your Linux session:

<CopyCommand command="xrandr --output screen --mode 1920x1080" />

List available resolutions:

<CopyCommand command="xrandr" />

Add a custom resolution:

<CopyCommand command="xrandr --newmode '1600x900' 119.00 1600 1696 1864 2128 900 901 904 932 -HSync +VSync" />
<CopyCommand command="xrandr --addmode screen '1600x900'" />
<CopyCommand command="xrandr --output screen --mode '1600x900'" />

<Warning>
Setting a resolution higher than your physical screen renders more pixels and scales them down, which reduces performance. On a 1080p phone screen, setting 1920x1080 or lower gives the best performance. Only use higher resolutions on external monitors.
</Warning>

## VNC Setup

### Installation

Install a VNC server inside your Ubuntu proot container:

<CopyCommand command="apt install tigervnc-standalone-server -y" />

Install a VNC client on your Android device. AVNC (free, open source) and bVNC (free) are both good options available on the Play Store or F-Droid.

### Initial Configuration

Set a VNC password (you will need this to connect from the client):

<CopyCommand command="vncpasswd" />

### Launch Script

<Terminal title="start-vnc.sh">

```bash
#!/bin/bash

# Kill any existing VNC server
vncserver -kill :1 2>/dev/null

# Start VNC server with specified resolution
vncserver :1 -geometry 1280x720 -depth 24 -localhost no

echo "VNC server running on port 5901"
echo "Connect with your VNC client to localhost:5901"
```

</Terminal>

### VNC Startup File

Configure what happens when VNC starts by editing `~/.vnc/xstartup`:

<Terminal title="~/.vnc/xstartup">

```bash
#!/bin/bash
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
export DISPLAY=:1

exec dbus-launch --exit-with-session startxfce4
```

</Terminal>

<CopyCommand command="chmod +x ~/.vnc/xstartup" />

### Connecting

1. Start the VNC server with the launch script
2. Open your VNC client app on Android
3. Connect to `localhost:5901`
4. Enter the password you set with `vncpasswd`

<Tip>
If connecting from another device on your network (not the same phone), replace `localhost` with your Android device's IP address. Find it in Android Settings > Wi-Fi > your network > IP address.
</Tip>

## Resolution and DPI Settings

### Finding the Right Resolution

The ideal resolution depends on your display and how you use it:

| Scenario | Recommended Resolution | DPI |
|---|---|---|
| Phone (direct screen) | 1280x720 or native | 140-192 |
| Tablet (direct screen) | 1920x1080 or native | 120-144 |
| External monitor (1080p) | 1920x1080 | 96 |
| External monitor (1440p) | 2560x1440 | 120 |
| External monitor (4K) | 3840x2160 | 144-192 |
| Wireless DeX | 1920x1080 | 96-120 |

### Setting DPI

DPI (dots per inch) controls how large text and UI elements appear. Higher DPI means larger elements.

In XFCE:

<CopyCommand command="xfconf-query -c xsettings -p /Xft/DPI -s 120" />

For VNC, you can also set DPI when starting the server:

<CopyCommand command="vncserver :1 -geometry 1920x1080 -depth 24 -dpi 120 -localhost no" />

<PerformanceNote>
Higher resolutions require more processing power for rendering. On devices with mid-range processors, running at 1920x1080 can feel sluggish compared to 1280x720. If performance matters more than visual sharpness, use a lower resolution. This is especially true with VNC, which must compress every frame.
</PerformanceNote>

## Multi-Monitor Setup (Samsung DeX)

Samsung DeX allows your phone to output to an external monitor while keeping the phone screen active. Termux:X11 can take advantage of this to provide a multi-display Linux desktop.

### Wired DeX Multi-Monitor

With a USB-C to HDMI adapter or hub:

1. Connect your phone to the external monitor
2. DeX activates on the external display
3. Open Termux:X11 on the external display (drag it from the phone screen or launch it on the monitor)
4. Your Linux desktop renders on the monitor at the monitor's resolution

<CopyCommand command="xrandr --output screen --mode 1920x1080" />

### Wireless DeX

Samsung DeX can mirror or extend to smart TVs and Miracast displays wirelessly:

1. Enable wireless DeX: Settings > Connected devices > Samsung DeX
2. Connect to your TV or wireless display
3. Launch Termux:X11 on the external display

<Warning>
Wireless DeX adds latency compared to wired connections. Expect 50-100ms of input delay depending on your Wi-Fi network quality. This is noticeable for fast typing or precise mouse work. For productive work, use a wired connection.
</Warning>

### Display Configuration for External Monitors

When connected to an external monitor, you may need to adjust the XFCE display settings:

<CopyCommand command="xfce4-display-settings" />

For a monitor with a different DPI than your phone screen:

<CopyCommand command="xfconf-query -c xsettings -p /Xft/DPI -s 96" />

<BestPractice>
Create separate launch scripts for phone-only and monitor-connected use cases. Each script can set the appropriate resolution and DPI for that scenario, so you do not have to reconfigure every time you dock or undock.
</BestPractice>

## Audio Configuration

### Audio with Termux:X11

Termux:X11 can pass audio from Linux applications to your Android device through PulseAudio:

<CopyCommand command="apt install pulseaudio -y" />

Add to your launch script before starting the desktop:

<Terminal title="Audio in launch script">

```bash
# Start PulseAudio
pulseaudio --start --load="module-native-protocol-tcp auth-ip-acl=127.0.0.1 auth-anonymous=1" --exit-idle-time=-1
export PULSE_SERVER=127.0.0.1
```

</Terminal>

### Audio with VNC

VNC does not natively support audio. If you need audio output while using VNC, you have two options:

1. Use PulseAudio over TCP (same setup as above) with a separate PulseAudio client on Android
2. Accept that audio is a limitation of VNC and use Termux:X11 when audio is needed

## Troubleshooting

<Troubleshooting items={[
  {
    problem: "Termux:X11 shows a black screen after starting",
    solution: "The desktop environment may not have started. Check that your launch script sets DISPLAY=:0 correctly. Try running 'startxfce4' manually inside the proot login to see error messages. Also ensure the Termux:X11 app is open before running the launch script."
  },
  {
    problem: "VNC connection refused on port 5901",
    solution: "The VNC server may not be running. Check with 'vncserver -list'. If it shows no servers, start one with 'vncserver :1'. If it fails, check ~/.vnc/*.log for error messages. Also verify your VNC client is connecting to the correct address (localhost:5901 if on the same device)."
  },
  {
    problem: "Display resolution does not match the screen",
    solution: "Run 'xrandr' to see available resolutions and the current setting. If your desired resolution is not listed, you may need to add it as a custom mode. For Termux:X11, check the app's display resolution settings."
  },
  {
    problem: "Mouse cursor is invisible or in the wrong position",
    solution: "In Termux:X11, check the touch input mode setting. 'Direct touch' mode may place the cursor incorrectly on some devices. Switch to 'Trackpad' mode. For VNC, check if your client supports cursor rendering and enable 'local cursor' in the client settings."
  }
]} />

## Next Steps

- [XFCE Configuration](/docs/desktop-environments/xfce) --- tune the desktop environment for your display setup
- [Samsung DeX Overview](/docs/samsung/dex-overview) --- complete guide to using ADL with Samsung DeX
- [Performance Optimization](/docs/performance/optimization) --- optimize rendering performance for your display server
