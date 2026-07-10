---
sidebar_position: 7
title: "Uninstall ADL"
description: "Completely removing ADL (Android Desktop Linux) from your device, including Ubuntu, Termux, and all related components."
---

# Uninstall ADL

There are several reasons you might want to remove the Linux desktop setup you built by following ADL:

- You need to reclaim storage space on your Android device.
- You want to start fresh with a clean installation.
- You no longer need a Linux desktop environment on your phone or tablet.
- You are switching to a different Linux-on-Android solution.

Uninstalling ADL involves removing the Ubuntu distribution installed through proot-distro, and optionally removing Termux and Termux:X11 as well. This guide walks through each step so nothing gets left behind.

<Warning title="Data Loss Warning">
**ALL data inside your Ubuntu environment will be permanently deleted.** This includes your home directory, installed applications, configuration files, and any documents or projects stored within Ubuntu. This action **cannot be undone**. Make absolutely sure you have backed up everything you need before proceeding.
</Warning>

## Step 1: Back Up Your Data

Before removing anything, copy important files from your Ubuntu environment to your Android storage where they will be safe.

### What to Back Up

- **Home directory** (`~/`): personal documents, projects, downloads, and scripts.
- **Configuration files**: `.bashrc`, `.profile`, `.ssh/`, `.gitconfig`, and any application configs in `~/.config/`.
- **Database files**: any local databases (SQLite files, PostgreSQL data directories) you have created.
- **Custom scripts**: anything in `/usr/local/bin/` or other locations where you placed your own scripts.

### How to Copy Files to Android Storage

Your Android shared storage is accessible from within Ubuntu at `/sdcard` (or via the `~/storage` symlink if you ran `termux-setup-storage`). Copy your important files there.

To copy your entire home directory to Android storage:

<CopyCommand command="cp -r ~/Documents ~/Pictures ~/Projects /sdcard/ADL-Backup/" />

Create the backup directory on Android storage first:

<CopyCommand command="mkdir -p /sdcard/ADL-Backup" />

To back up your configuration files:

<CopyCommand command="cp -r ~/.ssh ~/.gitconfig ~/.bashrc ~/.profile /sdcard/ADL-Backup/configs/" />

<Tip>
If you have large files, check your available Android storage space first with `df -h /sdcard` before starting the backup.
</Tip>

<BestPractice>
Verify your backups before proceeding. Open a file manager on Android and confirm the files appear in the `ADL-Backup` folder. Do not rely on the copy command succeeding without checking.
</BestPractice>

## Step 2: Remove the Ubuntu Distribution

Exit out of the Ubuntu environment if you are currently inside it. You should be at the Termux shell (not the Ubuntu shell) before running this command.

If you are inside Ubuntu, type `exit` to return to Termux first.

Remove the Ubuntu distribution installed by proot-distro:

<CopyCommand command="proot-distro remove ubuntu" />

<ExpectedResult>
The command removes the Ubuntu root filesystem and all associated data. You should see output confirming the distribution has been removed. This may take a moment depending on how much data was stored.
</ExpectedResult>

<Note>
This only removes the Ubuntu distribution. Termux itself and any packages you installed directly in Termux remain untouched.
</Note>

## Step 3: Remove Termux (Optional)

If you want to completely remove ADL and no longer need Termux for any purpose:

1. Open **Android Settings** on your device.
2. Navigate to **Apps** (or **Apps & notifications**).
3. Find **Termux** in the app list.
4. Tap **Uninstall** and confirm.

This removes the Termux app, its internal storage, and all packages installed within it.

## Step 4: Remove Termux:X11 (Optional)

If you installed Termux:X11 for the graphical desktop environment:

1. Open **Android Settings** on your device.
2. Navigate to **Apps**.
3. Find **Termux:X11** in the app list.
4. Tap **Uninstall** and confirm.

## Step 5: Clean Up Remaining Storage

After uninstalling the apps, some files may remain on your Android shared storage. Clean these up manually:

1. Open your Android **File Manager** app.
2. Look for any Termux-related folders in your internal storage.
3. Check for and remove the `ADL-Backup` folder once you have moved your backed-up files to their final destination (cloud storage, a computer, etc.).

<Tip>
Some file managers have a "storage analyzer" feature that can help you find leftover files taking up space after uninstallation.
</Tip>

## Step 6: Re-enable Battery Optimization

If you disabled battery optimization for Termux and Termux:X11 during the ADL setup process, you can re-enable it now:

1. Open **Android Settings**.
2. Navigate to **Battery** (or **Battery & performance**).
3. Go to **Battery optimization** or **App battery management**.
4. Find Termux and Termux:X11 (if they still appear after uninstall) and set them back to **Optimized**.

If you already uninstalled the apps in steps 3 and 4, Android typically re-enables optimization automatically, so this step may not be necessary.

## Partial Uninstall: Reset Ubuntu Only

If you want to keep Termux and Termux:X11 installed but start with a fresh Ubuntu environment, you can remove and reinstall just the distribution.

Remove the existing Ubuntu installation:

<CopyCommand command="proot-distro remove ubuntu" />

Then reinstall a fresh copy:

<CopyCommand command="proot-distro install ubuntu" />

<ExpectedResult>
A fresh Ubuntu root filesystem is downloaded and extracted. You will have a clean Ubuntu environment with none of your previous data, packages, or configuration.
</ExpectedResult>

This approach is useful when your Ubuntu environment has become cluttered or broken and you want to start over without reinstalling Termux itself. After reinstalling Ubuntu, you will need to re-run the ADL setup steps to configure the desktop environment again.

<Troubleshooting items={[
  {
    problem: "proot-distro remove says the distribution is not installed",
    solution: "The distribution may already have been removed, or it was installed under a different alias. Run `proot-distro list` to see all installed distributions and use the exact name shown in that list."
  },
  {
    problem: "Cannot delete files because of a permission error",
    solution: "Make sure you have exited the Ubuntu environment before attempting removal. If processes are still running inside Ubuntu, the removal may fail. Close all Termux sessions, reopen Termux, and try the remove command again."
  },
  {
    problem: "Storage space was not freed after uninstalling",
    solution: "Android may not immediately reclaim space. Restart your device and check storage again. You can also clear the Termux app cache from Android Settings > Apps > Termux > Storage > Clear Cache before uninstalling."
  },
  {
    problem: "Termux does not appear in the Android app list",
    solution: "If you installed Termux from F-Droid, it may appear under a slightly different name. Search for 'Termux' in the settings search bar. You can also try uninstalling from the app drawer by long-pressing the Termux icon."
  }
]} />
