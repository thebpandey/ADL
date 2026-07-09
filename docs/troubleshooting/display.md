---
sidebar_position: 3
title: "Display Issues"
description: "Troubleshooting display problems including black screens, resolution issues, and Termux:X11 connectivity."
---

# Display Issues

Display problems are among the most common issues when running a Linux desktop on Android. Most stem from misconfigured display servers, incorrect resolution settings, or permission issues between Termux and the proot environment.

## Black Screen When Launching Desktop

A black screen typically means the display server is running but the desktop environment failed to start, or the client is not connecting to the correct display.

<Troubleshooting items={[
  {
    problem: "Termux:X11 shows a black screen after launching the desktop",
    solution: "The DISPLAY variable is likely not set or points to the wrong socket. Verify it is exported before starting XFCE. Run the following inside the proot environment to confirm:"
  },
  {
    problem: "Black screen with cursor visible but no desktop loading",
    solution: "This usually means XFCE is crashing on startup. A corrupt session cache is the most common cause. Clear it and restart."
  },
  {
    problem: "Black screen after device sleep or screen off",
    solution: "Android may kill background processes aggressively. Acquire a Termux wake lock before launching the desktop, and ensure Termux is excluded from battery optimization in your device settings."
  }
]} />

<CopyCommand command="export DISPLAY=:0" />

To clear a corrupt XFCE session cache:

<CopyCommand command="rm -rf ~/.cache/sessions/*" />

Acquire a wake lock to prevent Android from stopping Termux:

<CopyCommand command="termux-wake-lock" />

See [First Launch](/docs/quick-start/first-launch) for the correct startup sequence.

---

## Wrong Resolution / Resolution Not Matching Device

Resolution mismatches cause the desktop to appear cropped, stretched, or surrounded by black borders.

<Troubleshooting items={[
  {
    problem: "Desktop resolution does not match the device screen",
    solution: "Termux:X11 uses a default resolution that may not correspond to your display. Set the resolution explicitly when starting the X server or within the Termux:X11 app preferences."
  },
  {
    problem: "Resolution changes are not taking effect",
    solution: "If you modified the resolution but see no change, the X server may need a full restart. Kill any existing Termux:X11 processes before relaunching."
  },
  {
    problem: "Desktop appears zoomed in or only a portion is visible",
    solution: "The resolution is set higher than what Termux:X11 is configured to handle. Lower the resolution or enable output scaling in the Termux:X11 preferences."
  }
]} />

To query your device's native resolution from Termux:

<CopyCommand command="termux-info | grep -i resolution" />

Set a specific resolution when starting the display:

<CopyCommand command="export RESOLUTION=1920x1080" />

To resize an active X session from within the proot environment:

<CopyCommand command="xrandr --output default --mode 1920x1080" />

<Tip>For tablets and foldables, use the unfolded resolution. Check your device specifications if `termux-info` does not report it accurately.</Tip>

---

## Termux:X11 Not Connecting

Connection failures between Termux and the X11 companion app prevent the desktop from displaying entirely.

<Troubleshooting items={[
  {
    problem: "Error: 'Connection refused' or 'Cannot open display'",
    solution: "The Termux:X11 app is not running or was started after the desktop session. Always open the Termux:X11 app first, then start the desktop from Termux."
  },
  {
    problem: "Termux:X11 app is open but the desktop does not appear",
    solution: "The shared memory connection between Termux and Termux:X11 may be broken. Restart both apps completely --- force-stop Termux:X11 from Android settings, then reopen it and relaunch the desktop."
  },
  {
    problem: "Permission denied errors when connecting to the display",
    solution: "Ensure Termux:X11 has the 'Display over other apps' permission enabled in Android settings. On Android 13+, you may also need to grant the notification permission for the app to maintain its background service."
  }
]} />

<CopyCommand command="am start --user 0 -n com.termux.x11/com.termux.x11.MainActivity" />

<Warning>If you installed Termux from the Play Store and Termux:X11 from F-Droid (or vice versa), they cannot communicate. Both must come from the same source --- either both from F-Droid or both from GitHub releases.</Warning>

Verify the X11 socket exists:

<CopyCommand command="ls -la /tmp/.X11-unix/" />

Refer to [Install Desktop](/docs/quick-start/install-desktop) for the correct installation pairing.

---

## XFCE Not Starting / Session Errors

When the display server connects but XFCE itself fails, you will typically see error messages in the terminal or a bare X11 screen with no panels or desktop.

<Troubleshooting items={[
  {
    problem: "Error: 'Failed to connect to session manager'",
    solution: "The dbus session bus is not running. Start dbus manually before launching XFCE."
  },
  {
    problem: "XFCE panels and desktop do not load, only a blank root window",
    solution: "The XFCE configuration may be corrupted. Reset it to defaults by removing the xfce4 configuration directory and restarting."
  },
  {
    problem: "Error: 'Another window manager is already running'",
    solution: "A previous xfwm4 instance did not shut down cleanly. Kill it before starting a new session."
  },
  {
    problem: "Repeated crash loop when starting XFCE",
    solution: "Check for missing dependencies. A partial installation can cause components to fail silently. Reinstall the desktop metapackage."
  }
]} />

Start dbus before launching XFCE:

<CopyCommand command="export DBUS_SESSION_BUS_ADDRESS=$(dbus-daemon --session --fork --print-address)" />

Reset XFCE configuration to defaults:

<CopyCommand command="mv ~/.config/xfce4 ~/.config/xfce4.bak" />

Kill a stale window manager process:

<CopyCommand command="pkill -9 xfwm4" />

Reinstall the XFCE desktop if dependencies are missing:

<CopyCommand command="sudo apt install --reinstall xfce4 xfce4-goodies" />

---

## Screen Tearing

Horizontal lines or visual artifacts during scrolling or video playback indicate screen tearing, caused by the compositor or lack thereof.

<Troubleshooting items={[
  {
    problem: "Visible horizontal tearing when scrolling or moving windows",
    solution: "Enable the XFCE compositor with vsync. Open Settings > Window Manager Tweaks > Compositor and enable 'Synchronize drawing to the vertical blank'. Alternatively, configure it from the command line."
  },
  {
    problem: "Compositor is enabled but tearing persists",
    solution: "The default compositor backend may not work well under proot. Try switching the compositor's rendering mode or disabling it entirely and relying on the Termux:X11 app's own frame synchronization."
  },
  {
    problem: "Performance drops significantly after enabling the compositor",
    solution: "Software compositing in a proot environment is CPU-intensive. Disable the compositor and accept minor tearing, or reduce the desktop resolution to compensate."
  }
]} />

Enable the XFCE compositor via command line:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/use_compositing -s true" />

Disable the compositor if performance is unacceptable:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/use_compositing -s false" />

<Note>Hardware-accelerated compositing is not available under proot. All rendering is done in software, which is significantly slower than native Linux desktop performance.</Note>

---

## DPI and Scaling Issues

Text and interface elements that appear too small on high-density screens or too large on low-resolution devices are caused by incorrect DPI settings.

<Troubleshooting items={[
  {
    problem: "Text and icons are extremely small on a high-resolution device",
    solution: "The default DPI of 96 is too low for high-density mobile screens. Increase the DPI to 140--192 depending on your device's pixel density."
  },
  {
    problem: "UI elements are oversized and overlap each other",
    solution: "The DPI is set too high for your resolution. Lower it, or increase the desktop resolution to match."
  },
  {
    problem: "Some applications respect DPI settings but others do not",
    solution: "GTK and Qt applications use different scaling mechanisms. Set the scaling factor for each toolkit independently."
  }
]} />

Set DPI for the X server:

<CopyCommand command="xfconf-query -c xsettings -p /Xft/DPI -s 140" />

Set GTK scaling:

<CopyCommand command="export GDK_SCALE=2" />

Set Qt scaling:

<CopyCommand command="export QT_SCALE_FACTOR=1.5" />

<BestPractice>Start with a DPI value of 140 for most modern phones and adjust in increments of 20 until text is comfortably readable. For tablets, 120 is usually a good starting point.</BestPractice>

Add these exports to your shell profile so they persist across sessions:

<CopyCommand command="echo 'export GDK_SCALE=2' >> ~/.bashrc" />

---

## VNC Connection Refused

If you are using VNC instead of Termux:X11, connection failures are typically caused by the VNC server not running or listening on the wrong port.

<Troubleshooting items={[
  {
    problem: "VNC client shows 'Connection refused' on localhost:5901",
    solution: "The VNC server is not running or crashed on startup. Start it manually and check for errors in the output."
  },
  {
    problem: "VNC connects but shows a gray screen with no desktop",
    solution: "The VNC server's xstartup file is missing or does not launch XFCE. Create or fix the startup script."
  },
  {
    problem: "VNC session is extremely slow or laggy",
    solution: "VNC encodes each frame as an image, which is far slower than the shared-memory approach used by Termux:X11. Reduce the resolution, lower the color depth, or switch to Termux:X11 for significantly better performance."
  }
]} />

Start the VNC server:

<CopyCommand command="vncserver :1 -geometry 1920x1080 -depth 24" />

Kill an existing VNC session before restarting:

<CopyCommand command="vncserver -kill :1" />

Create the VNC startup script if it is missing:

<CopyCommand command="mkdir -p ~/.vnc && echo 'startxfce4 &' > ~/.vnc/xstartup && chmod +x ~/.vnc/xstartup" />

<Tip>Termux:X11 is strongly recommended over VNC for daily use. It provides lower latency and better performance since it uses shared memory rather than network-based frame transfer. See [Install Desktop](/docs/quick-start/install-desktop) for setup instructions.</Tip>
