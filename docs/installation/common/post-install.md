---
sidebar_position: 6
title: "Post-Installation"
description: "Post-installation optimization and configuration for your ADL desktop, including browser setup, shared storage, default applications, and performance tuning."
---

# Post-Installation Optimization

Your desktop environment is running. Now configure it for daily use -- install a browser, set up shared storage between Android and Linux, create shortcuts, and tune performance so everything feels responsive on mobile hardware.

## Install a Web Browser

A desktop without a browser is not very useful. Firefox ESR is the recommended choice for ADL because it is well-tested on ARM processors, runs reliably under proot, and receives extended security updates without the frequent breaking changes that come with the rapid-release version.

Log into Ubuntu and install Firefox ESR:

<CopyCommand command="apt update && apt install firefox-esr -y" />

<ExpectedResult>
The download is approximately 60-80MB. After installation completes, you can launch Firefox from the Applications menu under "Web Browser" or by running firefox-esr from a terminal.
</ExpectedResult>

<CollapsibleSection title="Why ESR instead of regular Firefox?">

Firefox ESR (Extended Support Release) receives security patches for about a year per major version, but avoids the feature churn of the standard release cycle. This matters on ADL for two reasons:

1. **Stability** -- new Firefox features sometimes introduce regressions on ARM or within proot environments. ESR gives the community time to catch and report these before you encounter them.
2. **Lower resource usage** -- ESR tends to carry less experimental code, which translates to modestly lower memory consumption on devices where every megabyte counts.

If you specifically want the latest Firefox features, you can install the standard version with `apt install firefox -y` instead, but expect occasional rough edges.

</CollapsibleSection>

<Troubleshooting items={[
  {
    problem: "Firefox crashes immediately on launch or shows a black window",
    solution: "This is usually a shared-memory issue under proot. Try launching with: firefox-esr --no-remote 2>/dev/null &. If that still fails, ensure your Termux:X11 session is running and DISPLAY=:0 is set in your environment."
  },
  {
    problem: "\"Unable to locate package firefox-esr\"",
    solution: "Run apt update first to refresh package lists. If the problem persists, check that your Ubuntu installation has the standard repositories enabled by running cat /etc/apt/sources.list."
  }
]} />

## Configure the File Manager

XFCE ships with Thunar, a lightweight file manager that is already installed. A few configuration changes make it more useful for working with shared Android storage.

Open Thunar from the Applications menu or the panel, then:

1. **Show hidden files** -- Go to **View > Show Hidden Files** (or press Ctrl+H). Many configuration files and the `~/storage` symlinks you will set up later are hidden by default.
2. **Enable the side pane** -- Go to **View > Side Pane** and select **Shortcuts**. This gives you quick access to bookmarked directories.
3. **Add bookmarks** -- Once shared storage is configured (see below), drag important directories like `~/storage/shared` into the side pane to bookmark them.

<Tip>
You can add custom actions to Thunar for tasks like opening a terminal in the current directory. Go to **Edit > Configure custom actions** and add an entry with the command `xfce4-terminal --working-directory=%f`.
</Tip>

## Set Default Applications

XFCE allows you to set preferred applications for common tasks so that links, files, and terminal commands open in the right program.

Open the settings from the Applications menu: **Settings > Preferred Applications**, or run:

<CopyCommand command="xfce4-settings-manager" />

In the **Preferred Applications** dialog:

- **Web Browser** -- Select Firefox ESR (or Firefox Web Browser). This ensures that clicking links in other applications opens Firefox.
- **File Manager** -- Should already be set to Thunar. Change it here if you install an alternative like PCManFM.
- **Terminal Emulator** -- Set to XFCE Terminal. If you later install a different terminal (such as xterm or lxterminal), update this setting.

You can also set defaults from the command line:

<CopyCommand command="xdg-settings set default-web-browser firefox-esr.desktop" />

<Note>
The `xdg-settings` command relies on `.desktop` files installed in `/usr/share/applications/`. If a program does not appear in the Preferred Applications dialog, check that its `.desktop` file exists in that directory.
</Note>

## Create Desktop Shortcuts

XFCE uses `.desktop` files to represent application launchers. You can place these on the desktop for quick access to your most-used programs.

Create a Firefox shortcut on your desktop:

<CopyCommand command="cp /usr/share/applications/firefox-esr.desktop ~/Desktop/" />

<CopyCommand command="chmod +x ~/Desktop/firefox-esr.desktop" />

<ExpectedResult>
A Firefox icon should appear on your XFCE desktop. If it shows as a plain file instead, right-click it, go to Properties > Permissions, and ensure "Allow this file to run as a program" is checked. Then right-click the desktop and select "Arrange Desktop Icons" to refresh.
</ExpectedResult>

To create a custom shortcut from scratch, write a `.desktop` file manually:

<Terminal title="custom-shortcut.desktop">

```
[Desktop Entry]
Version=1.0
Type=Application
Name=My Script
Comment=Run my custom script
Exec=/root/my-script.sh
Icon=utilities-terminal
Terminal=false
Categories=Utility;
```

</Terminal>

Save it to `~/Desktop/`, then make it executable with `chmod +x`. The `Icon` field can reference any icon name from the current icon theme, or an absolute path to an image file.

<BestPractice>
Keep your custom `.desktop` files in `/usr/share/applications/` as well as `~/Desktop/` so they also appear in the Applications menu. This avoids having shortcuts that only work from the desktop.
</BestPractice>

## Configure the Time Zone

The default time zone in a fresh Ubuntu proot installation is usually UTC. Set it to your local time zone so that file timestamps, logs, and any scheduled tasks use the correct time.

**Interactive method** -- walks you through region and city selection:

<CopyCommand command="dpkg-reconfigure tzdata" />

<ExpectedResult>
A text-based menu appears where you select your geographic area (e.g., America, Europe, Asia) and then your city. After confirmation, the system reports the new local time.
</ExpectedResult>

**Direct method** -- set the time zone in a single command if you know the identifier:

<CopyCommand command="ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime && echo 'America/New_York' > /etc/timezone" />

Replace `America/New_York` with your actual time zone. You can list all available identifiers:

<CopyCommand command="timedatectl list-timezones" />

<Note>
Under proot, `timedatectl set-timezone` may not work because it requires systemd. The `ln -sf` method above works reliably in all proot environments.
</Note>

## Set Up Shared Storage Between Android and Linux

One of the most practical features of ADL is the ability to access your Android files from inside Linux and vice versa. This is handled through Termux's storage setup and bind mounts in your launch script.

### Step 1: Grant Termux Storage Access

If you have not already done so, run this command **in Termux** (not inside Ubuntu):

<CopyCommand command="termux-setup-storage" />

<ExpectedResult>
Android shows a permission dialog asking to allow Termux to access files. After granting access, a ~/storage directory appears in your Termux home with symlinks to key Android directories.
</ExpectedResult>

The `~/storage` directory contains these symlinks:

| Symlink | Points to |
|---|---|
| `~/storage/shared` | Android's internal shared storage (what you see in Files app) |
| `~/storage/downloads` | Android Downloads folder |
| `~/storage/dcim` | Camera photos and videos |
| `~/storage/music` | Music directory |
| `~/storage/pictures` | Pictures directory |

### Step 2: Make Android Storage Accessible Inside Ubuntu

By default, proot-distro does not automatically share Termux's storage directory with Ubuntu. You need to add a bind mount to your launch script.

Edit your start script:

<CopyCommand command="nano ~/start-desktop.sh" />

Update the proot-distro login line to include a bind mount:

<Terminal title="start-desktop.sh (updated)">

```
#!/bin/bash

# Kill any existing X11 processes
termux-x11 -ac &
sleep 2

# Start Ubuntu with XFCE and shared storage
proot-distro login ubuntu --shared-tmp --bind /storage/emulated/0:/root/storage -- bash -c "export DISPLAY=:0; dbus-launch --exit-with-session startxfce4"
```

</Terminal>

The `--bind` flag maps Android's internal storage to `/root/storage` inside Ubuntu. After restarting your desktop session, you can browse, edit, and save files directly to your Android storage from any Linux application.

<Warning title="File Permission Differences">
Android and Linux handle file permissions differently. Files created from Linux inside the shared storage directory may not have the permissions Android apps expect. If an Android app cannot open a file you created from Linux, try copying it to the Android Downloads folder instead of editing it in place.
</Warning>

<BestPractice>
Bookmark `/root/storage` in Thunar's side pane for quick access. You can also create a symbolic link for convenience: `ln -s /root/storage ~/android-files`.
</BestPractice>

## Performance Tweaks

Mobile devices have limited CPU, GPU, and memory compared to a laptop or desktop. These tweaks reduce the load XFCE places on your hardware.

### Disable the XFCE Compositor

The compositor adds window shadows, transparency effects, and smooth transitions. On most Android devices running ADL, it consumes significant resources for minimal visual benefit.

Disable it through the GUI: **Settings > Window Manager Tweaks > Compositor tab > uncheck "Enable display compositing"**.

Or disable it from the command line:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/use_compositing -s false" />

<PerformanceNote>
Disabling the compositor is the single most impactful performance improvement you can make. On mid-range devices, expect noticeably faster window dragging, smoother application launching, and reduced battery consumption. The trade-off is purely cosmetic -- you lose window shadows and transparency effects, but everything feels faster.
</PerformanceNote>

### Reduce Animations and Visual Effects

Further reduce the visual overhead by simplifying window behavior:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/box_move -s true" />

This switches window movement to outline mode, where only the window border is drawn while dragging instead of redrawing the entire window contents.

Disable window preview in the taskbar to save additional rendering:

<CopyCommand command="xfconf-query -c xfce4-panel -p /plugins/plugin-1/show-tooltips -s false" />

### Configure Swap Space

If your device has limited RAM (4GB or less), adding swap space can prevent applications from being killed when memory runs low. Under proot, traditional swap partitions are not available, but you can create a swap file if your kernel supports it.

<CopyCommand command="fallocate -l 1G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile" />

<Warning title="Swap May Not Work Under Proot">
Many Android kernels do not allow user-space processes to configure swap. If the `swapon` command fails with "Operation not permitted", your kernel does not support this. The command is harmless to attempt -- it will simply fail without causing damage. If swap is not available, focus on the other memory-saving tips in this section instead.
</Warning>

To verify whether swap is active:

<CopyCommand command="free -h" />

<ExpectedResult>
If swap is working, you will see a "Swap" line with a non-zero total. If swap activation failed, the Swap line shows all zeros.
</ExpectedResult>

### Adjust Panel Settings

The default XFCE panel configuration can be simplified to use fewer resources:

1. **Remove unused panel plugins** -- Right-click the panel, select **Panel > Panel Preferences**, go to the **Items** tab, and remove plugins you do not use (such as weather, CPU monitor, or workspace switcher).
2. **Reduce panel size** -- In Panel Preferences, decrease the row size from the default (usually 30-48 pixels) to 26-28 pixels. This frees up screen space, which is especially valuable on smaller phone screens.
3. **Use a single panel** -- If XFCE created two panels (top and bottom), consider removing the bottom panel to reduce rendering overhead and gain screen real estate.

<Tip>
If you are using Samsung DeX with an external monitor, you have more screen space and processing headroom. You can afford to keep the compositor enabled and use larger panels in that scenario.
</Tip>

## Post-Installation Checklist

Use this checklist to confirm you have completed all major setup and optimization steps from the entire installation track:

<ProgressChecklist title="ADL Installation Complete" items={[
  { label: "Termux installed and updated", done: true },
  { label: "Ubuntu installed via proot-distro", done: true },
  { label: "XFCE desktop environment installed", done: true },
  { label: "Termux:X11 installed and configured", done: true },
  { label: "Launch script created and working", done: true },
  { label: "Desktop launches successfully", done: true },
  { label: "Web browser installed", done: false },
  { label: "File manager configured with bookmarks", done: false },
  { label: "Default applications set", done: false },
  { label: "Desktop shortcuts created", done: false },
  { label: "Time zone configured", done: false },
  { label: "Shared storage set up between Android and Linux", done: false },
  { label: "Compositor disabled for better performance", done: false },
  { label: "Panel and visual effects optimized", done: false }
]} />

## Next Steps

Your ADL installation is fully configured and optimized. From here:

- **Samsung DeX users** -- See the [Samsung DeX Quick Setup](/docs/quick-start/samsung-dex) for external display and keyboard configuration.
- **Device-specific tuning** -- Check the device-specific guides if available for your hardware, as some phones and tablets benefit from additional optimizations.
- **If you ever need to remove ADL** -- The [Uninstall Guide](/docs/installation/common/uninstall) walks through cleanly removing Ubuntu, XFCE, and all related packages without affecting the rest of your Android device.
