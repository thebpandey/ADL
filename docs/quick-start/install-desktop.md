---
sidebar_position: 4
title: "Install Desktop Environment"
description: "Installing XFCE desktop environment and configuring Termux:X11 to display it on your Android device."
estimated_time: "10 minutes"
difficulty: "Beginner"
---

# Install Desktop Environment

<PageMeta difficulty="Beginner" estimatedTime="10 minutes" />


Now install XFCE, a lightweight desktop environment, and configure Termux:X11 to display it.

## Step 1: Install XFCE Desktop

Make sure you are logged into Ubuntu (your prompt should show `root@localhost`). If not, run `proot-distro login ubuntu` first.

<CopyCommand command="apt install xfce4 xfce4-goodies dbus-x11 -y" />

<ExpectedResult>
This is the largest download in the setup process -- approximately 200-300MB of packages. Installation takes 5-8 minutes depending on your connection speed and device. You'll see extensive package download and configuration output. When finished, you'll be back at the root prompt.
</ExpectedResult>

<Tip>
The xfce4-goodies package adds useful extras like a screenshot tool, task manager, and additional panel plugins. If storage is very tight, you can skip it and install just xfce4 and dbus-x11.
</Tip>

## Step 2: Install Termux:X11

Exit Ubuntu first by typing `exit` to return to the Termux prompt.

Termux:X11 is an Android app that acts as a display server, allowing graphical Linux applications to render on your device screen. To set it up, you need both an Android app and a companion package inside Termux:

1. Download the Termux:X11 APK from the [GitHub releases page](https://github.com/termux/termux-x11/releases).
2. Install the APK on your Android device (you may need to allow installation from unknown sources).
3. Install the Termux:X11 companion package inside Termux:

<CopyCommand command="pkg install termux-x11-nightly" />

<ExpectedResult>
The Termux:X11 companion package installs quickly. You'll see a confirmation that the package was installed.
</ExpectedResult>

## Step 3: Create the Launch Script

Back in Termux (not inside Ubuntu), create a script that starts everything:

<CopyCommand command="nano ~/start-desktop.sh" />

Enter the following content:

<Terminal title="start-desktop.sh">

```
#!/bin/bash

# Kill any existing X11 processes
termux-x11 -ac &
sleep 2

# Start Ubuntu with XFCE
proot-distro login ubuntu --shared-tmp -- bash -c "export DISPLAY=:0; dbus-launch --exit-with-session startxfce4"
```

</Terminal>

After saving (Ctrl+O, Enter, Ctrl+X), make the script executable:

<CopyCommand command="chmod +x ~/start-desktop.sh" />

<BestPractice>
Keep the launch script in your Termux home directory. You'll run it every time you want to start your desktop. You can customize it later as you learn more.
</BestPractice>

<Note>
Learn about XFCE and alternative desktop environments in [What is XFCE?](/docs/learn/concepts/what-is-xfce).
</Note>

<Note>
Understand how Termux:X11 provides a display server in [What is Termux:X11?](/docs/learn/software/termux-x11).
</Note>

<Troubleshooting items={[
  {
    problem: "\"Unable to locate package xfce4\"",
    solution: "Make sure you are logged into Ubuntu (prompt shows root@localhost), not in base Termux. If you're in Ubuntu and still see this error, run apt update first to refresh the package lists, then try the install command again."
  },
  {
    problem: "Display not connecting or black screen in Termux:X11",
    solution: "Make sure you installed both the Termux:X11 Android app AND the termux-x11-nightly package in Termux. Both components are required. Try killing any existing processes by running pkill -f termux-x11 in Termux, then run the start script again. Also check that the DISPLAY=:0 variable is set correctly in your launch script."
  }
]} />

## Next Step

Your desktop environment is installed and ready to go.

<NextSteps items={[
  { title: "First Launch", description: "Start your desktop for the first time and take the tour.", to: "/docs/quick-start/first-launch" },
  { title: "What is XFCE?", description: "Optional: what a desktop environment actually does.", to: "/docs/learn/concepts/what-is-xfce" },
]} />
