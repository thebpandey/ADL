---
sidebar_position: 4
title: "Desktop Environment Setup"
description: "Installing and configuring the XFCE desktop environment inside Ubuntu for Android Desktop Linux."
---

# Desktop Environment Setup

This guide walks through installing the XFCE desktop environment inside your Ubuntu installation, configuring it to work with Termux:X11, and creating a launch script to start everything with a single command.

XFCE (XForms Common Environment) is a lightweight, full-featured desktop environment designed to be fast and low on system resources while remaining visually appealing and easy to use. It provides everything you expect from a desktop -- a panel, file manager, window manager, application menu, and system tray -- without the heavy memory and CPU demands of environments like GNOME or KDE Plasma.

For ADL, XFCE is the ideal choice for several reasons:

- **Low resource usage** -- XFCE typically uses 200-400MB of RAM at idle, leaving more memory available for your applications. On devices with 4-8GB of RAM, this matters significantly.
- **Full desktop functionality** -- despite being lightweight, XFCE includes a complete set of desktop tools: a file manager (Thunar), a terminal emulator, a text editor, a screenshot tool, and a settings manager.
- **Stability** -- XFCE has a long track record of reliable releases. It rarely crashes or introduces breaking changes, which is important when running on top of proot.
- **Customizability** -- panel layout, keyboard shortcuts, window behavior, and themes can all be adjusted through graphical settings dialogs.

<Note>
For a deeper explanation of XFCE, how it compares to other desktop environments, and its architecture, see [What is XFCE?](/docs/learn/concepts/what-is-xfce).
</Note>

## Prerequisites

Before starting, confirm the following:

- Ubuntu is installed via proot-distro and you can log in with `proot-distro login ubuntu`
- Termux:X11 is installed (both the Android APK and the `termux-x11-nightly` package in Termux)
- You have a working internet connection for downloading packages
- At least 3GB of free storage space on your device

You will be switching between two environments during this guide: the Termux shell (where you see a `$` prompt) and the Ubuntu shell inside proot-distro (where you see `root@localhost`). Pay close attention to which environment each command should be run in -- running a command in the wrong environment is one of the most common setup mistakes.

<Note>
If you have not yet installed Termux:X11, refer to [Termux:X11 Setup](/docs/learn/software/termux-x11) for installation instructions.
</Note>

## Step 1: Install XFCE Packages

Log into Ubuntu from Termux. Your prompt should show `root@localhost`.

<CopyCommand command="proot-distro login ubuntu" />

First, update the package lists to make sure you are pulling the latest versions:

<CopyCommand command="apt update && apt upgrade -y" />

Now install XFCE along with its extras and the D-Bus X11 integration package:

<CopyCommand command="apt install xfce4 xfce4-goodies dbus-x11 -y" />

<ExpectedResult>
This is the largest download in the entire ADL setup process. Expect approximately 800MB of packages to download and around 2-3GB of disk space to be used after installation. On a typical mobile connection, this takes 10-20 minutes. On Wi-Fi, it usually completes in 5-10 minutes. You will see extensive output as hundreds of packages download and configure. When finished, you are returned to the root prompt with no errors.
</ExpectedResult>

Here is what each package provides:

- **xfce4** -- the core desktop environment including the window manager (xfwm4), the panel, the session manager, and the settings daemon.
- **xfce4-goodies** -- a collection of additional tools and panel plugins including a screenshot tool, a task manager, a clipboard manager, additional themes, and extra panel widgets. This is optional but strongly recommended.
- **dbus-x11** -- provides the `dbus-launch` command, which is required to start a proper desktop session. Without it, many XFCE components fail to communicate with each other.

<Warning title="Storage Space">
Make sure your device has at least 3GB of free storage before running this installation. If you are low on storage, you can skip `xfce4-goodies` and install only `xfce4` and `dbus-x11`, which reduces the footprint by roughly 500MB.
</Warning>

## Step 2: Install Fonts

Without proper fonts installed, many applications display squares, question marks, or blank spaces instead of text. This is especially common with non-Latin scripts, but even some English-language interfaces rely on fonts that are not included in a minimal Ubuntu installation.

<CopyCommand command="apt install fonts-noto fonts-noto-cjk -y" />

<ExpectedResult>
The font packages download approximately 150-200MB. After installation, applications render text correctly across Latin, CJK (Chinese, Japanese, Korean), and other writing systems. You see the package installation output followed by a return to the root prompt.
</ExpectedResult>

- **fonts-noto** -- Google's Noto font family, designed to cover all Unicode scripts. This ensures that every character has a visible glyph rather than appearing as a missing-character box.
- **fonts-noto-cjk** -- additional Noto fonts specifically for Chinese, Japanese, and Korean characters. These are large but necessary if you work with any CJK content, including some emoji and symbols that fall within CJK Unicode ranges.

<Tip>
If you need to minimize download size and only use Latin-script languages, you can install just `fonts-noto` and skip `fonts-noto-cjk`, saving roughly 100MB.
</Tip>

## Step 3: Configure D-Bus

D-Bus (Desktop Bus) is a message system that allows desktop applications to communicate with each other and with system services. In a typical Linux installation, D-Bus starts automatically at boot. Inside proot, there is no init system to start it, so it must be launched manually as part of the desktop startup process.

The `dbus-launch` command (provided by the `dbus-x11` package installed in Step 1) handles this. It starts a D-Bus session bus and sets the necessary environment variables so that all applications launched afterward can find and use it.

Create the D-Bus machine ID, which some applications require:

<CopyCommand command="dbus-uuidgen > /var/lib/dbus/machine-id" />

<ExpectedResult>
No visible output. The command silently creates a unique identifier file. You can verify it exists by running `cat /var/lib/dbus/machine-id`, which displays a 32-character hexadecimal string.
</ExpectedResult>

Create the D-Bus runtime directory:

<CopyCommand command="mkdir -p /run/dbus" />

<BestPractice>
The D-Bus machine ID only needs to be generated once. It persists across sessions because the Ubuntu filesystem inside proot-distro is preserved between logins.
</BestPractice>

## Step 4: Create the Launch Script

This is the most important step. The launch script ties everything together -- it starts the Termux:X11 display server, sets the display variable, and launches Ubuntu with XFCE in a single command.

**This script must be created in Termux, not inside Ubuntu.** Exit Ubuntu first by typing `exit` to return to your Termux prompt (you should see a `$` prompt instead of `root@localhost`).

Create the launch script:

<CopyCommand command="nano ~/start-desktop.sh" />

Enter the following content:

<Terminal title="~/start-desktop.sh">

```bash
#!/bin/bash

# Kill any existing Termux:X11 processes to avoid conflicts
kill -9 $(pgrep -f "termux.x11") 2>/dev/null

# Set the display variable for X11 forwarding
export DISPLAY=:1

# Start the Termux:X11 display server in the background
termux-x11 :1 &
sleep 2

# Launch Ubuntu with XFCE through proot-distro
# --shared-tmp allows X11 socket communication between Termux and Ubuntu
proot-distro login ubuntu --shared-tmp -- bash -c "export DISPLAY=:1 && dbus-launch --exit-with-session startxfce4"
```

</Terminal>

Save the file in nano by pressing Ctrl+O, then Enter to confirm, then Ctrl+X to exit.

<CollapsibleSection title="Line-by-line explanation of the launch script">

**`#!/bin/bash`** -- the shebang line tells the system to execute this script using bash. This is standard for shell scripts.

**`kill -9 $(pgrep -f "termux.x11") 2>/dev/null`** -- finds any running Termux:X11 processes and forcefully terminates them. This prevents issues that occur when multiple X11 server instances compete for the same display. The `2>/dev/null` suppresses error messages if no processes are found (which is normal on the first launch).

**`export DISPLAY=:1`** -- sets the DISPLAY environment variable to `:1`, telling graphical applications which X11 display server to connect to. The colon followed by a number is standard X11 notation. Using `:1` avoids potential conflicts with `:0` which some systems reserve.

**`termux-x11 :1 &`** -- starts the Termux:X11 display server on display `:1`. The `&` runs it in the background so the script can continue executing.

**`sleep 2`** -- pauses for two seconds to give the X11 server time to initialize and begin accepting connections. Without this delay, XFCE may attempt to start before the display server is ready, causing a black screen or connection refused error.

**`proot-distro login ubuntu --shared-tmp --`** -- logs into the Ubuntu installation through proot-distro. The `--shared-tmp` flag is critical: it shares the `/tmp` directory between Termux and Ubuntu, which is where the X11 socket file is located. Without this flag, Ubuntu cannot communicate with the Termux:X11 display server. The `--` separates proot-distro flags from the command to execute inside Ubuntu.

**`bash -c "export DISPLAY=:1 && dbus-launch --exit-with-session startxfce4"`** -- runs a bash command inside Ubuntu that sets the DISPLAY variable again (it must be set inside Ubuntu as well, not just in Termux), starts D-Bus, and launches XFCE. The `--exit-with-session` flag tells dbus-launch to terminate the D-Bus daemon when XFCE exits, ensuring a clean shutdown.

</CollapsibleSection>

## Step 5: Make the Script Executable

<CopyCommand command="chmod +x ~/start-desktop.sh" />

<ExpectedResult>
No visible output. The command silently adds execute permission to the script file. You can verify by running `ls -l ~/start-desktop.sh` and confirming that the permissions include `x` (for example, `-rwxr-xr-x`).
</ExpectedResult>

## Step 6: Test the Launch

Before running the script, open the Termux:X11 app on your Android device. It will display a black screen with a message about waiting for a connection -- this is normal.

Switch back to Termux and run the launch script:

<CopyCommand command="~/start-desktop.sh" />

<ExpectedResult>
After a few seconds, switch to the Termux:X11 app. You should see the XFCE desktop loading. The first launch includes a setup dialog asking you to choose between an empty panel and a default panel layout. Select "Use Default Config" to get the standard XFCE panel at the top of the screen with an application menu, task list, and system tray.
</ExpectedResult>

If the desktop loads successfully, you have a working Linux desktop environment on your Android device. You can open applications from the Applications menu in the top-left corner of the panel.

To stop the desktop session, log out from XFCE through its menu (Applications > Log Out) or switch back to Termux and press Ctrl+C.

<BestPractice>
After confirming that the desktop loads successfully, consider adding a Termux widget shortcut or a bash alias to launch the script more conveniently. For example, you can add `alias desktop="~/start-desktop.sh"` to your `~/.bashrc` file in Termux so that typing `desktop` starts the environment.
</BestPractice>

<CollapsibleSection title="What to do on the first launch setup dialog">

When XFCE starts for the first time, it presents a dialog with two options:

- **Use Default Config** -- sets up a standard panel at the top of the screen with an application menu on the left, a task list in the center, and a clock and system tray on the right. This is the recommended choice for most users and gives you a familiar desktop layout immediately.
- **One Empty Panel** -- creates a blank panel with no items. Choose this only if you intend to build a completely custom panel layout from scratch.

After selecting your choice, XFCE finishes loading and presents the desktop. You will see a default wallpaper, a panel at the top (if you chose the default), and icons on the desktop for the file manager and terminal.

</CollapsibleSection>

<PerformanceNote>
The first launch is noticeably slower than subsequent launches. XFCE generates configuration files, caches, and thumbnails on initial startup, which can take 15-30 seconds on mid-range devices. After the first launch, startup typically takes 3-8 seconds. If your device has a slower processor (such as a MediaTek Helio or older Snapdragon), expect longer initial load times but comparable performance once the desktop is fully loaded.
</PerformanceNote>

## Troubleshooting

<Troubleshooting items={[
  {
    problem: "Black screen in Termux:X11 after running the launch script",
    solution: "This usually means the DISPLAY variable is mismatched or the X11 server did not start in time. First, verify that the Termux:X11 app is open on your device before running the script. Then try increasing the sleep value in the script from 2 to 5 seconds. If the problem persists, kill all related processes with 'pkill -f termux-x11' and 'pkill -f xfce', then try again."
  },
  {
    problem: "XFCE crashes or closes immediately after starting",
    solution: "This is often caused by insufficient memory. Close other Android apps to free up RAM before launching the desktop. If the problem continues, check that dbus-x11 is installed inside Ubuntu by running 'dpkg -l | grep dbus-x11' after logging into Ubuntu. If it is not listed, install it with 'apt install dbus-x11 -y'."
  },
  {
    problem: "\"Error: Can't open display\" or \"Unable to open display\"",
    solution: "The DISPLAY variable is not set correctly or the X11 server is not running. Confirm that the Termux:X11 app is open, then check that your script uses the same display number in all three places: the termux-x11 command, the export DISPLAY line in Termux, and the export DISPLAY line inside the proot-distro command. All three must match (for example, all set to :1)."
  },
  {
    problem: "Text appears as empty squares or missing characters",
    solution: "You are missing fonts. Log into Ubuntu with 'proot-distro login ubuntu' and run 'apt install fonts-noto fonts-noto-cjk -y'. After installing fonts, restart the desktop session for changes to take effect."
  },
  {
    problem: "Panel is missing or desktop looks broken after first launch",
    solution: "XFCE configuration may have been created in an incomplete state. Log into Ubuntu, delete the XFCE config directory with 'rm -rf ~/.config/xfce4', then restart the desktop. On the next launch, you will see the initial setup dialog again -- choose 'Use Default Config' for the standard panel layout."
  },
  {
    problem: "Script reports \"proot-distro: command not found\"",
    solution: "You are running the script from inside Ubuntu instead of from Termux. Type 'exit' to leave Ubuntu and return to the Termux prompt, then run the script again. The launch script must always be run from the Termux environment, not from within Ubuntu."
  }
]} />

## Next Step

Your desktop environment is installed and running. Continue to [Audio Setup](/docs/installation/common/audio-setup) to configure sound output so that applications inside Ubuntu can play audio through your Android device.
