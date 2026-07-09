---
sidebar_position: 2
title: "Launch Scripts"
description: "Reference for ADL launch scripts, environment configuration, and display/audio setup."
---

# Launch Scripts

## Overview

Launch scripts automate the process of starting your Linux desktop on Android. A launch script handles three things: starting the display server (Termux:X11), logging into the proot-distro Linux environment with the correct bind mounts and environment variables, and launching the desktop session (XFCE or an alternative). Without a launch script, you would need to run each of these steps manually every time.

## The ADL Launch Script Explained

Below is a complete launch script with annotations for each section.

```bash
#!/bin/bash

# --- Terminate previous sessions ---
# Kill any leftover X11 or PulseAudio processes from a prior run.
pkill -f "termux-x11" 2>/dev/null
pulseaudio --kill 2>/dev/null

# --- Start the display server ---
# Launch Termux:X11 with access control disabled (-ac) so the
# proot environment can connect without authentication.
termux-x11 -ac &
sleep 2

# --- Start PulseAudio ---
# Run PulseAudio as a daemon with a TCP module so that applications
# inside proot can reach it via the network socket.
pulseaudio --start \
  --load="module-native-protocol-tcp auth-ip-acl=127.0.0.1" \
  --exit-idle-time=-1

# --- Launch the desktop inside Ubuntu ---
# proot-distro login enters the Ubuntu environment.
# --shared-tmp shares Termux's /tmp with Ubuntu (required for X11 socket).
# --bind binds the Android internal storage into the Linux filesystem.
# DISPLAY=:0 tells GUI apps where the X server is.
# PULSE_SERVER tells audio apps where PulseAudio is listening.
# dbus-launch starts a session D-Bus, then starts XFCE.
proot-distro login ubuntu --shared-tmp \
  --bind /sdcard:/media/storage \
  -- bash -c "\
    export DISPLAY=:0; \
    export PULSE_SERVER=tcp:127.0.0.1:4713; \
    dbus-launch --exit-with-session startxfce4"
```

<BestPractice>
Keep your launch script in your Termux home directory (`~/start-desktop.sh`) and make it executable with `chmod +x`. You will run this single script every time you want to start your desktop.
</BestPractice>

## proot-distro Login Options

The `proot-distro login` command accepts several flags that control how the Linux environment is configured.

| Flag | Description |
|---|---|
| `--user <name>` | Log in as the specified user instead of root. |
| `--bind <host>:<guest>` | Mount a host directory at a path inside the proot environment. Can be repeated for multiple binds. |
| `--shared-tmp` | Share the host `/tmp` directory with the guest. Required for Termux:X11 display socket access. |
| `--isolated` | Do not mount the host home directory or any default bind mounts. Useful for clean environments. |
| `--fix-low-ports` | Allow binding to ports below 1024 inside proot (e.g., port 80 for web servers). |
| `--kernel <version>` | Spoof a specific kernel version string (e.g., `5.4.0`). Some applications check the kernel version and refuse to run on older values. |
| `--no-sysvipc` | Disable System V IPC emulation. Use this if you encounter IPC-related crashes. |
| `--no-link2symlink` | Disable the link-to-symlink extension. Occasionally needed for compatibility with certain build systems. |
| `--no-kill-on-exit` | Do not send SIGKILL to child processes when the proot session exits. Allows background processes to survive. |

<Note>
The `--` separator after the flags marks the beginning of the command to execute inside the proot environment. Everything after `--` is passed to the guest shell.
</Note>

## Display Configuration

### The DISPLAY Variable

The `DISPLAY` environment variable tells graphical applications which X server to connect to. In the ADL setup, Termux:X11 listens on display `:0`, so you set:

```bash
export DISPLAY=:0
```

This must be set inside the proot environment before any GUI application starts.

### How Display Forwarding Works

Termux:X11 creates a Unix socket in `/tmp/.X11-unix/`. When `--shared-tmp` is passed to `proot-distro login`, the guest environment shares the same `/tmp` directory as the host. This means applications inside proot can find and connect to the X11 socket directly, without any network forwarding.

<Warning>
If you omit `--shared-tmp`, the proot environment gets its own isolated `/tmp` and GUI applications will fail to connect to the display with errors like `Cannot open display :0`.
</Warning>

### Termux:X11 Flags

| Flag | Description |
|---|---|
| `-ac` | Disable access control. Allows any client to connect to the X server without authentication. |
| `-xstartup <cmd>` | Run a command when the X server starts. |
| `-legacy-drawing` | Use legacy drawing mode for compatibility with older devices. |

## Audio Configuration

### PULSE_SERVER

The `PULSE_SERVER` environment variable tells applications where to find the PulseAudio server. When PulseAudio runs in Termux with a TCP module, applications inside proot connect over the loopback address:

```bash
export PULSE_SERVER=tcp:127.0.0.1:4713
```

### PulseAudio Setup

Start PulseAudio in Termux (outside proot) before launching the desktop:

```bash
pulseaudio --start \
  --load="module-native-protocol-tcp auth-ip-acl=127.0.0.1" \
  --exit-idle-time=-1
```

| Flag | Description |
|---|---|
| `--start` | Start PulseAudio as a background daemon. Does nothing if already running. |
| `--kill` | Stop a running PulseAudio daemon. |
| `--load="module-native-protocol-tcp auth-ip-acl=127.0.0.1"` | Load the TCP protocol module, restricting access to localhost only. |
| `--exit-idle-time=-1` | Prevent PulseAudio from exiting when no audio clients are connected. `-1` disables the idle timer. |

<Tip>
If audio is not working, verify PulseAudio is running with `pulseaudio --check`. A zero exit code means it is active. Inside the proot environment, test with `pactl info` -- the "Server Name" field should show a connection to the TCP server.
</Tip>

## Starting the Desktop

### startxfce4

The standard way to start the XFCE desktop:

```bash
dbus-launch --exit-with-session startxfce4
```

`dbus-launch` starts a session message bus, which XFCE and its components require for inter-process communication (notifications, session management, settings). The `--exit-with-session` flag ensures the D-Bus daemon terminates when the desktop session ends.

### Alternatives

| Command | Desktop |
|---|---|
| `dbus-launch --exit-with-session startxfce4` | XFCE (default, recommended) |
| `dbus-launch --exit-with-session startlxde` | LXDE |
| `dbus-launch --exit-with-session mate-session` | MATE |
| `dbus-launch --exit-with-session openbox-session` | Openbox (window manager only) |

## Stopping the Desktop

To cleanly shut down your desktop session:

1. **From the desktop**: Use the XFCE menu: Applications > Log Out. This gracefully closes all desktop components.
2. **From Termux**: Switch to Termux and press `Ctrl+C` to interrupt the launch script process.
3. **Kill remaining processes**: After exiting, clean up any leftover processes:

<CopyCommand command="pkill -f termux-x11; pulseaudio --kill" />

<Warning>
Avoid closing the Termux app directly without stopping the desktop first. This can leave orphaned processes that consume battery and memory in the background.
</Warning>

## Custom Launch Scripts

### Template

Use this template as a starting point for your own launch script. Uncomment or modify sections as needed.

```bash
#!/bin/bash

# --- Configuration ---
DISTRO="ubuntu"           # proot-distro distribution name
USERNAME="root"            # Login user (change if you created a user)
DESKTOP_CMD="startxfce4"   # Desktop command

# --- Cleanup ---
pkill -f "termux-x11" 2>/dev/null
pulseaudio --kill 2>/dev/null

# --- Display ---
termux-x11 -ac &
sleep 2

# --- Audio ---
pulseaudio --start \
  --load="module-native-protocol-tcp auth-ip-acl=127.0.0.1" \
  --exit-idle-time=-1

# --- Launch ---
LOGIN_FLAGS="--shared-tmp"

# Uncomment to bind Android storage:
# LOGIN_FLAGS="$LOGIN_FLAGS --bind /sdcard:/media/storage"

# Uncomment to log in as a non-root user:
# LOGIN_FLAGS="$LOGIN_FLAGS --user $USERNAME"

proot-distro login "$DISTRO" $LOGIN_FLAGS \
  -- bash -c "\
    export DISPLAY=:0; \
    export PULSE_SERVER=tcp:127.0.0.1:4713; \
    dbus-launch --exit-with-session $DESKTOP_CMD"
```

### Making It Executable

<CopyCommand command="chmod +x ~/start-desktop.sh" />

### Adding Aliases

Add aliases to your Termux shell configuration (`~/.bashrc` or `~/.zshrc`) for quick access:

```bash
# Start the desktop
alias startdesktop='~/start-desktop.sh'

# Stop everything
alias stopdesktop='pkill -f "termux-x11"; pulseaudio --kill; echo "Desktop stopped."'

# Quick login to Ubuntu without starting the desktop
alias ubuntu='proot-distro login ubuntu'
```

After editing, reload the configuration:

<CopyCommand command="source ~/.bashrc" />

## Common Aliases

| Alias | Command | Purpose |
|---|---|---|
| `startdesktop` | `~/start-desktop.sh` | Launch the full desktop environment |
| `stopdesktop` | `pkill -f "termux-x11"; pulseaudio --kill` | Stop the display server and audio daemon |
| `ubuntu` | `proot-distro login ubuntu` | Open an Ubuntu shell without starting the desktop |
| `ubuntuuser` | `proot-distro login ubuntu --user yourname` | Log in as a non-root user |
| `resetdesktop` | `pkill -f "termux-x11"; pulseaudio --kill; ~/start-desktop.sh` | Restart the desktop from scratch |

<Tip>
If you use multiple distributions (e.g., Ubuntu and Debian), create separate launch scripts for each and add distinct aliases like `startubuntu` and `startdebian`.
</Tip>
