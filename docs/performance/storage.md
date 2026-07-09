---
sidebar_position: 4
title: "Storage Management"
description: "Managing disk space in your ADL installation, clearing caches, and monitoring storage usage."
---

# Storage Management

ADL installations grow over time as you install packages, accumulate caches, and create files. On a device where storage is shared with your photos, apps, and media, keeping your Linux environment lean matters. This page covers how much space ADL uses, how to reclaim it, and how to monitor storage effectively.

## How Much Space ADL Uses

A fresh ADL installation has a modest footprint, but it grows quickly as you add software.

| Component | Approximate Size |
|---|---|
| Termux base installation | 200-400 MB |
| Ubuntu proot filesystem (minimal) | 500-800 MB |
| XFCE desktop environment | 400-600 MB |
| Termux:X11 | 50-100 MB |
| **Total base installation** | **1.2-1.9 GB** |

After installing common applications:

| Addition | Approximate Size |
|---|---|
| Firefox | 200-300 MB |
| LibreOffice | 400-600 MB |
| Build tools (gcc, make, cmake) | 300-500 MB |
| Python 3 with pip packages | 200-500 MB |
| Node.js with npm packages | 200-400 MB |
| VS Code (code-server) | 300-500 MB |

<PerformanceNote>
A typical working ADL installation with a browser, a text editor, and basic development tools uses 2.5-4 GB. Users who install LibreOffice, multiple languages, and heavy development toolchains can reach 6-8 GB. Plan your storage budget accordingly.
</PerformanceNote>

## Monitoring Storage Usage

### Check Overall Disk Usage

See how much space is used and available:

<CopyCommand command="df -h /" />

This shows the filesystem that Ubuntu is installed on. Since proot maps the filesystem into Termux's storage, you are seeing your device's internal storage usage.

<Tip>
Run `df -h` from Termux (outside the proot) to see the full Android filesystem usage. This gives you a clearer picture of total available space including what Android and other apps are using.
</Tip>

### Find Large Directories

Identify where storage is being consumed with `du`:

<CopyCommand command="du -h --max-depth=2 / 2>/dev/null | sort -rh | head -20" />

This shows the 20 largest directories within two levels of the root filesystem.

For a more targeted view of your home directory:

<CopyCommand command="du -h --max-depth=2 ~ | sort -rh | head -20" />

### Use ncdu for Interactive Exploration

`ncdu` (NCurses Disk Usage) provides an interactive, navigable view of disk usage. It is the most efficient way to find and understand what is consuming space.

<CopyCommand command="apt install ncdu -y" />

<CopyCommand command="ncdu /" />

Navigate with arrow keys, press `d` to delete files, and press `q` to quit. This is faster than running `du` repeatedly.

<Warning>
Be cautious when deleting files through ncdu. Removing system files or package data can break your installation. Stick to deleting files in your home directory, `/tmp`, and cache directories unless you are certain a file is safe to remove.
</Warning>

### Monitor Storage Over Time

To catch storage bloat early, periodically check the total size of your proot environment. From Termux (outside the proot), run:

<CopyCommand command="du -sh $PREFIX/var/lib/proot-distro/installed-rootfs/ubuntu/" />

This shows the total size of your Ubuntu installation.

## Clearing Caches

Caches are the lowest-hanging fruit for reclaiming space. They can be safely deleted because the system rebuilds them as needed.

### APT Package Cache

Every package you install with `apt` leaves a copy of the downloaded `.deb` file in the cache. Over time, this can consume hundreds of megabytes.

<CopyCommand command="apt clean" />

This removes all cached package files. To see how much space the cache is using before cleaning:

<CopyCommand command="du -sh /var/cache/apt/archives/" />

<BestPractice>
Run `apt clean` after every major package installation session. There is no downside --- if you need to reinstall a package, apt downloads it again. The cache serves no purpose on a storage-constrained device.
</BestPractice>

Also remove package lists that are no longer needed:

<CopyCommand command="apt autoclean" />

### Remove Orphaned Packages

After uninstalling software, dependency packages that are no longer needed may remain:

<CopyCommand command="apt autoremove -y" />

This removes packages that were installed as dependencies but are no longer required by any installed package.

### Browser Caches

Web browsers accumulate large caches that grow without limit. Firefox stores its cache in your profile directory:

<CopyCommand command="rm -rf ~/.cache/mozilla/firefox/*/cache2/" />

For Chromium-based browsers:

<CopyCommand command="rm -rf ~/.cache/chromium/" />

<PerformanceNote>
Browser caches can grow to 500 MB or more during heavy browsing sessions. Clearing them periodically is one of the easiest ways to reclaim storage. The only cost is slightly slower page loads on your first visit to previously cached sites.
</PerformanceNote>

### System and Application Caches

Clear the general system cache directory:

<CopyCommand command="rm -rf ~/.cache/*" />

<Warning>
Clearing `~/.cache` removes cached data for all applications, including thumbnail caches, font caches, and application-specific data. Applications will regenerate this data as needed, but some may take a moment to rebuild their caches on next launch.
</Warning>

### Thumbnail Cache

XFCE's file manager generates thumbnails for images and documents. These accumulate over time:

<CopyCommand command="rm -rf ~/.thumbnails/ ~/.cache/thumbnails/" />

### Temporary Files

Clear files from the temporary directory:

<CopyCommand command="rm -rf /tmp/*" />

### Log Files

System and application logs can grow large, especially if you have been troubleshooting issues:

<CopyCommand command="find /var/log -type f -name '*.log' -exec truncate -s 0 {} \;" />

This truncates all log files to zero bytes rather than deleting them, which avoids issues with services that expect specific log files to exist.

<CopyCommand command="journalctl --vacuum-size=10M 2>/dev/null" />

This limits the systemd journal to 10 MB. If journalctl is not present, this command safely does nothing.

## One-Command Cleanup

For a comprehensive cleanup that combines the most impactful steps:

<CopyCommand command="apt clean && apt autoremove -y && rm -rf ~/.cache/* /tmp/* ~/.thumbnails/" />

<Tip>
Save this command as an alias for easy reuse. Add this line to your `~/.bashrc`:

`alias cleanup='apt clean && apt autoremove -y && rm -rf ~/.cache/* /tmp/* ~/.thumbnails/ && echo "Cleanup complete."'`

Then run `cleanup` whenever you need to reclaim space.
</Tip>

## Using SD Card Storage

SD cards can supplement internal storage, but they come with significant limitations in the proot environment.

### What Works on SD Card

- Storing personal files (documents, downloads, media)
- Backing up your Linux home directory
- Storing large datasets that you access infrequently

### What Does Not Work Well

<PerformanceNote>
Running the proot filesystem itself from an SD card is not recommended. The random read/write performance of even high-quality SD cards (A2 rated, V30) is 5-10x slower than internal storage for the small, frequent I/O operations that an operating system performs. Package installation, application startup, and file indexing become painfully slow.
</PerformanceNote>

### Accessing SD Card from ADL

Your SD card is accessible through Termux's storage binding. The path depends on your device, but it is typically available at:

<CopyCommand command="ls /sdcard/" />

To access external SD card storage specifically (if present):

<CopyCommand command="ls ~/storage/external-1/ 2>/dev/null || echo 'No external SD card found or storage not set up. Run termux-setup-storage from Termux.'" />

### Moving Data to SD Card

Move large, infrequently accessed files to the SD card to free internal storage. For example, to move a project archive:

<CopyCommand command="mv ~/large-project-backup.tar.gz ~/storage/external-1/" />

<Warning>
Do not use symlinks from the proot filesystem to the SD card for frequently accessed directories. Proot must translate every file access through the symlink, and the SD card's slow random I/O makes this significantly worse than keeping the files on internal storage.
</Warning>

<BestPractice>
Use the SD card as cold storage --- backup archives, reference documents, media files, and data you access occasionally. Keep your active working directories, installed packages, and application data on internal storage for the best performance.
</BestPractice>

## Keeping Your Installation Lean

### Install Only What You Need

Every package you install consumes storage and may pull in dependencies. Before installing a new package, check its size:

<CopyCommand command="apt show <package-name> 2>/dev/null | grep -i size" />

Replace `<package-name>` with the package you are considering. The "Installed-Size" field shows how much space it will consume after installation.

### Remove Packages You No Longer Use

List installed packages sorted by size:

<CopyCommand command="dpkg-query -W --showformat='${Installed-Size}\t${Package}\n' | sort -rn | head -30" />

This shows your 30 largest installed packages. Review the list and remove anything you no longer need:

<CopyCommand command="apt remove <package-name> -y && apt autoremove -y" />

### Avoid Duplicate Functionality

Do not install multiple applications that serve the same purpose. Pick one text editor, one browser, one office suite. Each duplicate wastes storage and may also waste RAM if both run simultaneously.

<Tip>
If you are experimenting with different applications to find the best fit, uninstall each one after trying it before installing the next. This prevents accumulating packages you have already decided against.
</Tip>

### Use Minimal Package Variants

Some packages offer minimal or headless variants that skip unnecessary components:

<CopyCommand command="apt install --no-install-recommends <package-name>" />

The `--no-install-recommends` flag skips packages that are recommended but not strictly required. This can significantly reduce the total installation size, especially for large packages like LibreOffice.

<PerformanceNote>
Installing LibreOffice with `--no-install-recommends` saves approximately 200-300 MB compared to the default installation by skipping optional components like help files, additional language packs, and suggested plugins.
</PerformanceNote>

## Storage Space Budget

A practical guideline for planning your ADL storage:

| Category | Recommended Allocation |
|---|---|
| Base ADL installation (Termux + Ubuntu + XFCE) | 2 GB |
| Core applications (browser, editor) | 1 GB |
| Development tools (if needed) | 1 GB |
| Working files and projects | 1-2 GB |
| Cache headroom (caches rebuild over time) | 500 MB |
| **Total recommended** | **5.5-6.5 GB** |

<BestPractice>
Keep at least 1 GB of free space at all times. When internal storage fills up, both Android and Linux become sluggish and unstable. Android may also start clearing its own caches aggressively, which can affect apps outside of ADL.
</BestPractice>

## Next Steps

- [Optimization Guide](/docs/performance/optimization) --- improve runtime performance
- [Battery Management](/docs/performance/battery) --- manage power consumption during ADL sessions
- [Performance Overview](/docs/performance/overview) --- understand the factors that affect ADL performance
