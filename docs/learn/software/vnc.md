---
sidebar_position: 3
title: "VNC"
description: "Setting up VNC for remote desktop display in ADL — TigerVNC server configuration, Android viewers, and performance tuning."
---

# VNC

VNC (Virtual Network Computing) is a **remote display protocol** that lets you view and interact with a graphical desktop over a network connection. In the ADL context, VNC runs a desktop session inside your proot Linux distribution and streams it to a VNC viewer app on Android.

<Note title="Termux:X11 is the preferred display method">
For local use on the same device, [Termux:X11](/docs/learn/software/termux-x11) provides significantly better performance than VNC — lower latency, no compression artifacts, and native Android input handling. Use VNC when Termux:X11 is not available, when you need remote access from another device, or when running on older hardware that has compatibility issues with Termux:X11.
</Note>

## When to use VNC

<Decision
  question="Should I use VNC or Termux:X11?"
  options={[
    {
      label: "Termux:X11",
      description: "Best for local use on the same device. Near-native performance, smooth input, no compression. Requires the Termux:X11 companion app.",
      recommended: true
    },
    {
      label: "VNC",
      description: "Best for remote access from another device, as a fallback when Termux:X11 has issues, or on older Android versions. Works with any VNC viewer app."
    }
  ]}
/>

VNC is the right choice when you need to access your desktop from another device, cannot run the Termux:X11 app, have an older Android version with Termux:X11 compatibility issues, or want a headless server with occasional graphical access.

## How VNC works in ADL

```mermaid
graph LR
    A[Desktop Environment] --> B[VNC Server]
    B --> C[Network Socket]
    C --> D[VNC Viewer App]

    style A fill:#16a34a,color:#fff,stroke:none
    style B fill:#7c3aed,color:#fff,stroke:none
    style C fill:#6b7280,color:#fff,stroke:none
    style D fill:#1e40af,color:#fff,stroke:none
```

The VNC server runs inside your proot distribution, renders the desktop to a virtual framebuffer, and streams the pixels to a VNC viewer app. The viewer sends your inputs back to the server. Everything happens over localhost, so no network traffic leaves your device when running locally.

## Installing TigerVNC

ADL uses **TigerVNC**, the most widely used VNC server on Linux. Install it inside your Ubuntu distribution:

<CopyCommand command="proot-distro login ubuntu -- apt update && proot-distro login ubuntu -- apt install -y tigervnc-standalone-server" />

Or, if you are already logged into the distribution:

<CopyCommand command="apt update && apt install -y tigervnc-standalone-server" />

<ExpectedResult>
APT downloads and installs TigerVNC and its dependencies. When finished, the `vncserver` command becomes available.
</ExpectedResult>

## Initial configuration

### Setting a VNC password

The first time you start the VNC server, set a password:

<CopyCommand command="vncpasswd" />

<ExpectedResult>
You are prompted to enter and confirm a password (minimum 6 characters). You are also asked whether to set a view-only password — enter `n` unless you specifically want one.
</ExpectedResult>

<Warning title="VNC passwords are weakly encrypted">
VNC password storage uses legacy DES encryption. For local-only use (localhost connections on the same device) this is acceptable, but never expose a VNC server to the open internet without additional security layers like SSH tunneling.
</Warning>

### Configuring the xstartup file

The `~/.vnc/xstartup` file tells the VNC server which desktop environment to launch. Create or edit it:

```bash title="~/.vnc/xstartup"
#!/bin/bash
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
export PULSE_SERVER=tcp:127.0.0.1:4713
exec startxfce4
```

Make it executable:

<CopyCommand command="chmod +x ~/.vnc/xstartup" />

<Tip>
Replace `startxfce4` with the launch command for your desktop environment if you are not using XFCE. For example, use `mate-session` for MATE or `startlxde` for LXDE.
</Tip>

## Starting and stopping the VNC server

### Starting the server

<CopyCommand command="vncserver :1 -geometry 1920x1080 -depth 24" />

<ExpectedResult>
Output similar to: `New Xtigervnc server 'localhost:1' started.` The `:1` means the server is listening on display 1, which corresponds to port 5901.
</ExpectedResult>

### Common vncserver flags

| Flag | Purpose | Example |
|---|---|---|
| `:N` | Display number (port = 5900 + N) | `:1` (port 5901) |
| `-geometry WxH` | Screen resolution | `-geometry 1920x1080` |
| `-depth D` | Color depth in bits | `-depth 24` (true color) |
| `-localhost yes` | Only accept local connections | `-localhost yes` |
| `-SecurityTypes` | Authentication type | `-SecurityTypes VncAuth` |

<BestPractice>
Match the `-geometry` value to your actual screen or window size. Oversized resolutions waste processing power on scaling; undersized ones leave you with a small, cramped desktop. For a phone screen, `1280x720` or `1600x900` work well. For Samsung DeX on an external monitor, use the monitor's native resolution.
</BestPractice>

### Stopping the server

<CopyCommand command="vncserver -kill :1" />

To stop all running VNC servers:

<CopyCommand command="vncserver -kill :*" />

### Listing active sessions

<CopyCommand command="vncserver -list" />

<ExpectedResult>
A table showing each running VNC session with its display number, PID, and the port it is listening on.
</ExpectedResult>

## VNC viewer apps for Android

You need a VNC viewer app on Android to connect to the server. Here are the main options:

| App | Cost | Notes |
|---|---|---|
| **AVNC** | Free, open source | Recommended. Available on F-Droid. Best touch controls, good performance. |
| **bVNC** | Free, open source | Solid alternative. Also on F-Droid. |
| **RealVNC Viewer** | Free (basic) | Available on Play Store. Proprietary but polished. |

<BestPractice>
Install **AVNC** from F-Droid. It is open source, actively maintained, has excellent touch gesture support, and integrates well with the ADL workflow.
</BestPractice>

### Connecting the viewer

1. Start your VNC server inside the distribution (see above).
2. Open your VNC viewer app on Android.
3. Create a new connection with these settings:
   - **Address:** `127.0.0.1` or `localhost`
   - **Port:** `5901` (or 5900 + your display number)
4. Enter the VNC password you set earlier.
5. You should see your Linux desktop.

<Tip>
If the viewer asks about encoding, choose **Tight** encoding for the best balance of quality and performance over a local connection.
</Tip>

## Setting resolution and color depth

You can change the resolution without restarting the server by editing the VNC configuration, but the simplest approach is to stop and restart with new parameters:

<CopyCommand command="vncserver -kill :1 && vncserver :1 -geometry 1280x720 -depth 24" />

<PerformanceNote>
Higher resolutions require more processing power and memory. If you experience lag, reduce the resolution (try `1280x720`) or lower the color depth from 24 to 16 bits. For Samsung DeX on an external monitor, match the monitor's native resolution.
</PerformanceNote>

## Autostarting the VNC server

To start VNC automatically when you log into the distribution, add a check to `~/.bashrc` inside Ubuntu that starts the server only if it is not already running:

<CopyCommand command={"echo 'vncserver -list 2>/dev/null | grep -q \":1\" || vncserver :1 -geometry 1920x1080 -depth 24' >> ~/.bashrc"} />

<Warning title="Only autostart when appropriate">
Autostarting VNC means every login launches a graphical session, which uses memory and CPU. If you sometimes log in just to run terminal commands, consider starting VNC manually instead.
</Warning>

## Performance: VNC vs Termux:X11

| Aspect | VNC | Termux:X11 |
|---|---|---|
| Latency | Noticeable (compression/decompression) | Near-native |
| Image quality | Compression artifacts possible | Pixel-perfect |
| CPU usage | Higher (encoding frames) | Lower |
| Input handling | Translated through viewer | Native Android input |
| Remote access | Yes (any VNC client) | No (local only) |
| Setup complexity | Moderate | Simple |

For day-to-day desktop use on the same device, Termux:X11 is the clear winner. VNC adds value when you need remote access or as a reliable fallback.

See [Termux:X11](/docs/learn/software/termux-x11) for setup instructions on the recommended display method, and [What is Wayland?](/docs/learn/concepts/what-is-wayland) for background on display protocols.

## Troubleshooting

<Troubleshooting items={[
  {
    problem: "Black screen or gray screen with no desktop",
    solution: "Your xstartup file is either missing, not executable, or points to a desktop environment that is not installed. Verify that ~/.vnc/xstartup exists, has execute permission (chmod +x), and that the desktop environment command (e.g., startxfce4) is installed and works."
  },
  {
    problem: "\"A VNC server is already running as :1\" error",
    solution: "A previous session was not properly shut down. Kill it with: vncserver -kill :1. If that fails, remove stale lock files: rm -f /tmp/.X1-lock /tmp/.X11-unix/X1"
  },
  {
    problem: "Connection refused when connecting from the viewer",
    solution: "Verify the server is running with vncserver -list. Check that you are connecting to the right port (5900 + display number). Ensure the viewer is set to 127.0.0.1, not an external IP."
  },
  {
    problem: "Very laggy or slow display",
    solution: "Lower the resolution (try 1280x720), reduce color depth to 16 bits, and select Tight encoding in your VNC viewer. Close unused applications in the desktop session. Check that no other heavy processes are running in Termux or Android."
  },
  {
    problem: "Clipboard sharing does not work",
    solution: "Install tigervnc-common and add vncconfig -nowin & to your xstartup file before the desktop environment command."
  },
  {
    problem: "No audio in VNC sessions",
    solution: "VNC does not carry audio. Audio in ADL comes through PulseAudio over TCP independently. Ensure PULSE_SERVER=tcp:127.0.0.1:4713 is set in your environment."
  }
]} />

## FAQ

<FAQ items={[
  {
    question: "Can I use VNC and Termux:X11 at the same time?",
    answer: "Not for the same desktop session. Each session is bound to one display. However, you could run two separate sessions — one on a VNC display (:1) and one on Termux:X11 (:0) — if you have enough memory. This is an advanced setup and not recommended for most users."
  },
  {
    question: "Is VNC secure for use over the internet?",
    answer: "The basic VNC protocol is not secure for internet use. The password is weakly encrypted and the session data is not encrypted in transit. If you need remote access over the internet, tunnel VNC through SSH. For local use on the same device (connecting to 127.0.0.1), security is not a concern."
  },
  {
    question: "What is the difference between TigerVNC and other VNC servers?",
    answer: "TigerVNC is a high-performance, actively maintained fork of the original VNC project. Alternatives like TightVNC and x11vnc exist, but TigerVNC offers the best combination of performance, features, and compatibility for the ADL use case."
  },
  {
    question: "Does VNC support hardware acceleration?",
    answer: "No. VNC renders everything in software, so GPU-accelerated applications will fall back to slow software rendering. For most desktop productivity tasks this is not an issue."
  }
]} />
