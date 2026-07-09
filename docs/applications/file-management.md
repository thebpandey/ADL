---
sidebar_position: 6
title: "File Management"
description: "Managing files across Android and Linux environments in ADL, including shared storage setup, Thunar file manager, and moving files between systems."
---

# File Management

One of the first things you will notice about ADL is that your files live in two separate worlds: Android's storage and Linux's filesystem. Understanding how these worlds connect is essential for a smooth workflow. This guide covers the Thunar file manager, shared storage between Android and Linux, and the commands you need to move files back and forth.

## Thunar File Manager

Thunar is the default file manager in XFCE and is already installed if you followed the ADL desktop setup. It provides a graphical interface for browsing, copying, moving, and deleting files inside your Linux environment.

If Thunar is not installed for some reason, add it with:

<CopyCommand command="apt install thunar -y" />

Launch Thunar from the XFCE application menu under **System**, or run it from the terminal:

<CopyCommand command="thunar" />

Thunar opens to your home directory by default. The left sidebar shows bookmarks and common locations. You can drag and drop files between folders, right-click for context menus, and use keyboard shortcuts just like any desktop file manager.

<Tip>
You can add frequently used directories to Thunar's sidebar bookmarks by dragging a folder into the left panel. This is especially useful for shared storage directories that you access often.
</Tip>

### Useful Thunar Features

- **Bulk rename** — select multiple files, then go to Edit > Rename to batch-rename files with patterns
- **Custom actions** — right-click > Custom Actions lets you add your own context menu entries, such as "Open Terminal Here"
- **Split view** — press F3 to open a second pane, making it easy to move files between directories
- **Show hidden files** — press Ctrl+H to toggle visibility of dotfiles (files starting with a period)

## How Storage Works in ADL

ADL runs Ubuntu inside proot-distro, which itself runs inside Termux on Android. This layered architecture means files are stored in specific places:

- **Linux files** live inside Termux's private app storage, under the proot Ubuntu filesystem. Android cannot see these files directly.
- **Android shared storage** (`/sdcard`) is where your photos, downloads, and other Android files live. This is what you see in Android's built-in file manager.
- **Termux home** (`~` in Termux, outside proot) sits between the two and can act as a bridge.

<Note>
Because the Linux filesystem lives inside Termux's private storage, Android apps and file managers cannot browse your Linux files. To make a file visible to Android, you need to copy or move it to shared storage.
</Note>

## Setting Up Shared Storage

Before you can access Android's files from Termux (and by extension from Linux), you need to grant Termux storage access. Run this command **in Termux, outside of proot**:

<CopyCommand command="termux-setup-storage" />

Android will prompt you to grant file access. Accept the permission. This creates a set of symlinks in your Termux home directory at `~/storage/`:

| Symlink | Points to | Contains |
|---|---|---|
| `~/storage/shared` | `/sdcard` | All of Android's shared storage |
| `~/storage/downloads` | `/sdcard/Download` | Your Android downloads |
| `~/storage/dcim` | `/sdcard/DCIM` | Photos and screenshots |
| `~/storage/music` | `/sdcard/Music` | Music files |
| `~/storage/movies` | `/sdcard/Movies` | Video files |
| `~/storage/pictures` | `/sdcard/Pictures` | Image files |

<Warning>
You must run `termux-setup-storage` from Termux itself, not from inside proot Ubuntu. If you run it inside proot, it will not work. Exit proot first by typing `exit`, run the command, then re-enter proot.
</Warning>

## Moving Files Between Android and Linux

There are several ways to transfer files between the two environments. Choose the method that fits your situation.

### Method 1: The shared-tmp Directory

The simplest approach is to use the shared temporary directory. When proot-distro runs Ubuntu, it bind-mounts a shared directory that both Termux and proot can access. The exact path depends on your setup, but it is typically available at `/tmp` inside proot, which maps to Termux's tmp directory.

To copy a file from Linux to a location Android can see:

<CopyCommand command="cp /home/user/myfile.txt /tmp/myfile.txt" />

Then in Termux (outside proot), move it to shared storage:

<CopyCommand command="cp ~/tmp/myfile.txt ~/storage/shared/" />

### Method 2: Direct Access via Termux Home

From inside proot Ubuntu, you can often access Termux's home directory through a mount point. The path varies, but it is commonly at `/host-rootfs/data/data/com.termux/files/home` or a similar bind-mounted location. If your setup uses `--bind` options, check where Termux's home is mounted.

<BestPractice>
Create a dedicated folder for transfers to keep things organized. Make a directory like `~/transfer` in your Termux home directory, and access it from both sides.
</BestPractice>

In Termux (outside proot):

<CopyCommand command="mkdir -p ~/transfer" />

Then start proot with a bind mount that makes this directory visible inside Ubuntu. If you are using a launch script, add the bind option to map it to a convenient path.

### Method 3: Termux Shared Storage from Inside Proot

If your proot launch script bind-mounts Termux's storage directory, you can access Android's shared storage directly from inside Linux. Many ADL setup scripts do this automatically. Check whether `/sdcard` or a similar path exists inside your proot environment:

<CopyCommand command="ls /sdcard" />

If this shows your Android files, you can copy directly:

<CopyCommand command="cp /home/user/document.pdf /sdcard/Download/" />

The file will immediately appear in Android's Downloads folder and be visible in any Android file manager.

<Tip>
If `/sdcard` is not available inside proot, you can add it by modifying your proot launch command to include `--bind /sdcard:/sdcard`. Check your ADL launch script for details.
</Tip>

## Accessing Linux Files from Android

This direction is more limited. The Linux filesystem lives deep inside Termux's private application storage, which Android protects from other apps.

You **cannot** browse Linux files directly from Android's file manager. Instead, you need to copy any files you want to access on the Android side into shared storage first, using one of the methods described above.

For quick access to a specific file:

<CopyCommand command="cp /home/user/myfile.txt /sdcard/Download/" />

<Note>
This is a one-way copy, not a sync. If you edit the file in Linux after copying, the copy on the Android side will not update. You need to copy it again.
</Note>

## File Permissions

Linux uses a permission system that controls who can read, write, and execute files. You will encounter this when files refuse to open, scripts will not run, or you get "Permission denied" errors.

Every file has three permission types:

| Permission | Letter | Number | Meaning |
|---|---|---|---|
| Read | `r` | 4 | View the file's contents |
| Write | `w` | 2 | Modify or delete the file |
| Execute | `x` | 1 | Run the file as a program or script |

These permissions apply to three groups: the **owner** (you), the **group**, and **others** (everyone else).

### Viewing Permissions

List files with their permissions using:

<CopyCommand command="ls -la" />

The output looks like this:

```
-rw-r--r-- 1 user user 1024 Jan 15 10:30 document.txt
drwxr-xr-x 2 user user 4096 Jan 15 10:30 myfolder
```

The first column shows permissions. For `document.txt`: the owner can read and write (`rw-`), the group can read (`r--`), and others can read (`r--`).

### Changing Permissions with chmod

The `chmod` command changes file permissions. The most common uses:

<CopyCommand command="chmod +x script.sh" />

This adds execute permission, allowing you to run a script. Other useful examples:

<CopyCommand command="chmod 644 document.txt" />

This sets read/write for the owner and read-only for everyone else (6 = read + write, 4 = read).

<CopyCommand command="chmod 755 myscript.sh" />

This sets full permissions for the owner and read/execute for everyone else. Use this for scripts and programs.

<BestPractice>
Use `644` for regular files (documents, images, config files) and `755` for scripts and executables. Avoid using `777` (full access for everyone) as it removes all access controls.
</BestPractice>

### Changing Ownership with chown

If a file is owned by the wrong user, you can change ownership:

<CopyCommand command="chown user:user filename.txt" />

Replace `user` with your actual username.

## Troubleshooting

<Troubleshooting items={[
  {
    problem: "Permission denied when accessing files in /sdcard from inside proot",
    solution: "Make sure you ran termux-setup-storage in Termux (outside proot) and that your proot launch script includes a bind mount for /sdcard. Restart proot after making changes to the launch script."
  },
  {
    problem: "Files copied to /sdcard do not appear in Android's file manager",
    solution: "Android's media scanner may not have indexed the new files yet. Open Android's file manager and navigate to the folder manually, or restart the Android device. You can also try renaming the file, which sometimes triggers a rescan."
  },
  {
    problem: "Cannot run a script: bash: ./script.sh: Permission denied",
    solution: "The script lacks execute permission. Run chmod +x script.sh to add it, then try again."
  },
  {
    problem: "termux-setup-storage does nothing or shows no prompt",
    solution: "You may have already granted or denied storage permission. Go to Android Settings > Apps > Termux > Permissions and make sure Storage (or Files and Media) is set to Allow. Then run termux-setup-storage again."
  },
  {
    problem: "Thunar shows an error when opening certain directories",
    solution: "This usually means you do not have read permission on that directory. Check permissions with ls -la and use chmod to fix them. Some system directories are intentionally restricted."
  },
  {
    problem: "Files edited in Linux do not update on the Android side",
    solution: "Copies are independent. If you copied a file to /sdcard and then edited the original in Linux, you need to copy it again. Consider working directly in a bind-mounted shared directory to avoid this problem."
  }
]} />
