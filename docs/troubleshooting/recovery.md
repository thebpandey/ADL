---
sidebar_position: 7
title: "Recovery Procedures"
description: "How to recover from broken installations, reset components, and perform clean reinstalls."
---

# Recovery Procedures

Things break. A bad package upgrade, a corrupted filesystem, or a misconfigured desktop can leave your ADL setup in an unusable state. This guide covers how to recover --- from targeted component resets to a full clean start.

<Warning>
Most recovery procedures described here are destructive. Always back up your data before proceeding. See the [Backup and Restore](#backup-and-restore) section first.
</Warning>

## Reset Ubuntu Without Losing Termux

If your Ubuntu proot environment is broken but Termux itself still works, you can remove and reinstall just the distro. This preserves your Termux packages, configuration, and storage.

### Remove the Existing Ubuntu Installation

<CopyCommand command="proot-distro remove ubuntu" />

This deletes the entire Ubuntu filesystem under `$PREFIX/var/lib/proot-distro/installed-rootfs/ubuntu`. Your Termux home directory, packages, and shell configuration are untouched.

### Reinstall Ubuntu

<CopyCommand command="proot-distro install ubuntu" />

After reinstalling, log in and re-run your desktop setup. See the [Install Ubuntu](/docs/quick-start/install-ubuntu) and [Install Desktop](/docs/quick-start/install-desktop) guides for the full steps.

<Tip>
If you only need to fix a specific issue inside Ubuntu, try logging in with `proot-distro login ubuntu` first. A targeted fix is almost always faster than a full reinstall.
</Tip>

### Preserve Your Ubuntu Home Directory

If you want to keep your personal files while resetting the system, back up your Ubuntu home directory before removing the distro:

<CopyCommand command="proot-distro login ubuntu -- tar czf /sdcard/ubuntu-home-backup.tar.gz -C /home ." />

After reinstalling Ubuntu, restore it:

<CopyCommand command="proot-distro login ubuntu -- tar xzf /sdcard/ubuntu-home-backup.tar.gz -C /home" />

## Reinstall Specific Components

You do not always need to reset the entire distro. Individual components can be removed and reinstalled inside your Ubuntu proot session.

### XFCE Desktop

Remove and reinstall the XFCE desktop environment:

<CopyCommand command="sudo apt purge xfce4 xfce4-goodies -y && sudo apt autoremove -y" />

<CopyCommand command="sudo apt install xfce4 xfce4-goodies -y" />

### PulseAudio

If audio is broken, reset PulseAudio:

<CopyCommand command="sudo apt purge pulseaudio -y && rm -rf ~/.config/pulse" />

<CopyCommand command="sudo apt install pulseaudio -y" />

<Note>
Removing the `~/.config/pulse` directory clears user-level PulseAudio configuration. This fixes most audio issues caused by stale or corrupt config files.
</Note>

### VNC Server

If your VNC server refuses to start or displays a blank screen, clear its state and reconfigure:

<CopyCommand command="vncserver -kill :1" />

<CopyCommand command="rm -rf ~/.vnc" />

Then re-run your VNC setup as described in the [Install Desktop](/docs/quick-start/install-desktop) guide.

### Reset XFCE Panel and Settings

A misconfigured panel or broken theme can make the desktop unusable without requiring a full XFCE reinstall:

<CopyCommand command="rm -rf ~/.config/xfce4/panel ~/.config/xfce4/xfconf" />

The next time you start XFCE, it will regenerate default panel and session configuration.

## Backup and Restore

<Tip>
Make backups a habit. Run a backup before any major upgrade, configuration change, or recovery procedure. Storage on `/sdcard` survives both Termux and Ubuntu resets.
</Tip>

### What to Back Up

Not everything in the Ubuntu filesystem is worth saving. Focus on these locations:

| Path | Contents |
|---|---|
| `/home/<user>` | Personal files, dotfiles, application configs |
| `/etc` | System configuration (custom sources, cron jobs, etc.) |
| `/root` | Root user configuration |
| `/opt` | Manually installed software |

### Full Ubuntu Backup

Create a compressed archive of the entire Ubuntu rootfs. Run this from Termux --- not from inside the proot session:

<CopyCommand command="tar czf /sdcard/adl-ubuntu-backup-$(date +%Y%m%d).tar.gz -C $PREFIX/var/lib/proot-distro/installed-rootfs/ubuntu ." />

<Warning>
Full backups can be large --- several gigabytes depending on what you have installed. Make sure you have enough free space on your device before running this.
</Warning>

### Home Directory Only

For a lighter backup that captures just your personal files and configs:

<CopyCommand command="proot-distro login ubuntu -- tar czf /sdcard/adl-home-backup-$(date +%Y%m%d).tar.gz -C /home ." />

### Termux Backup

Back up your Termux environment separately:

<CopyCommand command="tar czf /sdcard/adl-termux-backup-$(date +%Y%m%d).tar.gz -C $PREFIX ." />

### Restoring from Backup

To restore a full Ubuntu backup after a fresh `proot-distro install ubuntu`:

<CopyCommand command="tar xzf /sdcard/adl-ubuntu-backup-YYYYMMDD.tar.gz -C $PREFIX/var/lib/proot-distro/installed-rootfs/ubuntu" />

Replace `YYYYMMDD` with the actual date stamp of your backup file.

<Note>
A full restore replaces system files, so it works best when restoring onto the same Ubuntu version. If you have upgraded Ubuntu since the backup was made, prefer restoring only the home directory.
</Note>

To restore just the home directory:

<CopyCommand command="proot-distro login ubuntu -- tar xzf /sdcard/adl-home-backup-YYYYMMDD.tar.gz -C /home" />

## Complete Fresh Start

<Warning>
This is the nuclear option. It removes Termux, all proot distros, and all data stored within them. Only do this if nothing else has worked.
</Warning>

### Step 1 --- Back Up Everything You Care About

Copy important files to `/sdcard` or another location outside Termux:

<CopyCommand command="cp -r ~/important-files /sdcard/adl-rescue/" />

### Step 2 --- Remove All Proot Distros

<CopyCommand command="proot-distro remove ubuntu" />

### Step 3 --- Clear Termux Data

Open Android Settings, navigate to Apps, find Termux, and tap "Clear Data." This removes all Termux files, packages, and configuration.

Alternatively, uninstall and reinstall the Termux app entirely.

### Step 4 --- Start Over

Follow the installation guides from the beginning:

1. [Install Termux](/docs/quick-start/install-termux)
2. [Install Ubuntu](/docs/quick-start/install-ubuntu)
3. [Install Desktop](/docs/quick-start/install-desktop)

## Common Recovery Scenarios

<Troubleshooting items={[
  {
    problem: "Ubuntu login fails with 'proot: command not found' after a Termux update",
    solution: "The proot-distro package may have been removed or corrupted during the update. Reinstall it with: pkg install proot-distro. If that does not work, also run: pkg update && pkg upgrade. Your Ubuntu filesystem should still be intact."
  },
  {
    problem: "Desktop shows a black screen or fails to render after connecting via VNC",
    solution: "Kill the existing VNC session (vncserver -kill :1), delete the VNC config directory (rm -rf ~/.vnc), and reconfigure VNC from scratch. If the problem persists, reinstall XFCE as described in the Reinstall Specific Components section above."
  },
  {
    problem: "Package manager is broken --- 'dpkg was interrupted' or lock file errors",
    solution: "Run: sudo dpkg --configure -a to finish any interrupted package configuration. If a lock file is stale, remove it with: sudo rm /var/lib/dpkg/lock-frontend && sudo rm /var/lib/dpkg/lock, then run sudo dpkg --configure -a again."
  },
  {
    problem: "Filesystem is read-only or shows I/O errors",
    solution: "This usually indicates a problem with Android's storage layer or the proot mount. Exit the proot session, close Termux completely (not just backgrounded), reopen it, and try again. If the problem persists, your device storage may be full or failing --- check free space with: df -h."
  },
  {
    problem: "Lost the ability to copy/paste or access shared storage after an Android update",
    solution: "Termux may have lost its storage permission. Run: termux-setup-storage from the Termux shell to re-grant access. If shared storage still does not work, check that Termux has storage permissions in Android Settings > Apps > Termux > Permissions."
  }
]} />

## Recovering from a Broken Package Database

A corrupted or locked package database can prevent you from installing, removing, or upgrading any packages. This section covers how to fix dpkg and apt when they refuse to cooperate.

### Lock File Errors

If apt or dpkg reports that another process is using the database, or that a lock file exists:

<CopyCommand command="sudo rm -f /var/lib/dpkg/lock-frontend /var/lib/dpkg/lock /var/cache/apt/archives/lock" />

<CopyCommand command="sudo dpkg --configure -a" />

<Warning>
Only remove lock files if you are certain no other package operation is running. Removing a lock while dpkg is actively working can corrupt the package database further.
</Warning>

### Interrupted dpkg Configuration

If a previous install or upgrade was interrupted (power loss, Termux killed, forced exit), packages may be in a half-configured state:

<CopyCommand command="sudo dpkg --configure -a" />

If that fails with errors about specific packages, force-remove the broken package and reinstall it:

<CopyCommand command="sudo dpkg --remove --force-remove-reinstreq <package-name>" />

<CopyCommand command="sudo apt install -f" />

### Corrupted Package Lists

If apt update fails with parsing errors or complaints about malformed package lists:

<CopyCommand command="sudo rm -rf /var/lib/apt/lists/*" />

<CopyCommand command="sudo apt clean" />

<CopyCommand command="sudo apt update" />

This removes all cached package metadata and forces apt to download fresh copies from the repositories.

### Rebuilding the dpkg Database

In rare cases, the dpkg status file itself can become corrupted. A backup is maintained automatically:

<CopyCommand command="sudo cp /var/lib/dpkg/status-old /var/lib/dpkg/status" />

<CopyCommand command="sudo dpkg --configure -a" />

If neither the status file nor its backup is usable, you can attempt to rebuild the available packages list:

<CopyCommand command="sudo dpkg --clear-avail" />

<CopyCommand command="sudo apt update" />

<Warning>
If the dpkg database is severely corrupted and none of these steps work, you may need to reset the Ubuntu installation entirely. See the [Reset Ubuntu Without Losing Termux](#reset-ubuntu-without-losing-termux) section above. Back up your home directory first.
</Warning>

### Fixing Broken Dependencies

When packages have unsatisfied dependencies, use apt's built-in repair:

<CopyCommand command="sudo apt install -f" />

If that does not resolve the issue, try removing and reinstalling the problematic packages:

<CopyCommand command="sudo apt purge <broken-package> && sudo apt autoremove -y && sudo apt install <broken-package>" />

<BestPractice>
Before attempting any recovery, always try the least destructive option first: restart the VNC session, reinstall a single package, or clear a config directory. Move to broader resets only when targeted fixes have failed.
</BestPractice>
