---
sidebar_position: 5
title: "First Launch"
description: "Launching your Linux desktop for the first time"
estimated_time: "5 minutes"
difficulty: "Beginner"
---

# First Launch

<SvgDiagram
  src="/img/diagrams/concepts/diagram-desktop-session.svg"
  alt="Hand-drawn loop: start desktop, run apps, save work, stop session, return to Android, and start again next time"
  caption="A full session, start to finish"
/>

{/* TODO: this diagram is intended for a dedicated desktop session page if one is created later */}


Everything is installed. Time to launch your Linux desktop.

## Step 1: Start the Desktop

<CopyCommand command="~/start-desktop.sh" />

<ExpectedResult>
You'll see output from the X11 server starting and XFCE initializing. A few seconds of log messages are normal.
</ExpectedResult>

## Step 2: Open Termux:X11

Switch to the Termux:X11 app (you can use Android's app switcher or notification shade -- Termux:X11 often shows a notification when the server is running).

<ExpectedResult>
You should see the XFCE desktop environment with a panel at the top, a dock or panel at the bottom, and a desktop with a default wallpaper. This is a fully functional Linux desktop running on your Android device.
</ExpectedResult>

## Step 3: Explore Your New Desktop

Things to try right away:

- **Open the File Manager**: Click the file cabinet icon in the panel or find "File Manager" in the Applications menu. Browse your Linux filesystem.
- **Open a Terminal**: Right-click the desktop and select "Open Terminal Here", or find "Terminal Emulator" in the Applications menu. Try running `uname -a` to confirm you're in Ubuntu.
- **Change the Wallpaper**: Right-click the desktop, select "Desktop Settings", and choose a new wallpaper or solid color.
- **Open the Application Menu**: Click "Applications" in the top-left panel to see all installed programs.

<Tip title="Keyboard Shortcuts">
XFCE supports standard keyboard shortcuts. If you have a keyboard connected: Alt+F2 opens the application runner, Ctrl+Alt+T opens a terminal, and Alt+Tab switches between windows. These are especially useful with Samsung DeX or USB keyboards.
</Tip>

<Tip title="Touch Navigation">
On a touchscreen, tap to click, long-press for right-click, and pinch to zoom in Termux:X11. Two-finger swipe scrolls within windows.
</Tip>

<Note title="Congratulations!">
You now have a complete Linux desktop running on your Android device. You can install software with apt, edit documents, write code, browse files, and much more -- all without rooting your phone or voiding your warranty.
</Note>

## Next Steps

Now that your desktop is running, here's where to go next:

- **Customize your desktop**: See [Desktop Environments](/docs/desktop-environments/overview) for themes, panels, and alternative desktops
- **Install applications**: See [Applications](/docs/applications/overview) for installing browsers, editors, development tools, and more
- **Samsung DeX users**: Continue to [Samsung DeX Quick Setup](/docs/quick-start/samsung-dex) to connect to external displays
- **Learn how it works**: Visit the [Learn](/docs/category/learn) track to understand the technology stack
- **Troubleshoot issues**: Check [Troubleshooting](/docs/troubleshooting/overview) if anything goes wrong

<BestPractice title="Stopping the Desktop">
To cleanly stop your desktop session, log out from XFCE (Applications > Log Out) or switch back to Termux and press Ctrl+C. Avoid just closing the Termux app, as this can leave orphaned processes.
</BestPractice>
