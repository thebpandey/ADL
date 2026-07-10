---
sidebar_position: 2
title: "proot-distro"
description: "Managing Linux distributions on Android with proot-distro — installing, configuring, and maintaining distros inside Termux."
---

# proot-distro

proot-distro is a **Termux utility that manages Linux distributions** running under [proot](/docs/learn/concepts/what-is-proot). It handles downloading, installing, logging in, backing up, and restoring complete Linux root filesystems — all without root access on your Android device.

You do not interact with proot directly when using ADL. Instead, you use proot-distro commands that handle the complexity for you.

## How proot-distro fits into ADL

```mermaid
graph LR
    A[Termux] --> B[proot-distro]
    B --> C[Ubuntu]
    C --> D[Desktop Environment]

    style A fill:#1e40af,color:#fff,stroke:none
    style B fill:#7c3aed,color:#fff,stroke:none
    style C fill:#e95420,color:#fff,stroke:none
    style D fill:#16a34a,color:#fff,stroke:none
```

Termux provides the terminal environment. proot-distro manages the Linux distribution inside it. The distribution (Ubuntu, in ADL's case) runs your desktop and applications.

## Available distributions

proot-distro supports several Linux distributions out of the box. To see the full list on your device, run:

<CopyCommand command="proot-distro list" />

<ExpectedResult>
A table listing all available distributions with their aliases and installation status. Installed distros are marked accordingly.
</ExpectedResult>

Here are the most common options:

| Distribution | Alias | Notes |
|---|---|---|
| Ubuntu | `ubuntu` | Recommended for ADL. Largest package library, best documentation. |
| Debian | `debian` | Stable and lightweight. Good alternative if you want minimal overhead. |
| Fedora | `fedora` | Cutting-edge packages. Uses `dnf` instead of `apt`. |
| Arch Linux | `archlinux` | Rolling release, advanced users. Uses `pacman`. |
| Alpine | `alpine` | Extremely lightweight. Uses `apk` and musl libc (some software incompatible). |
| openSUSE | `opensuse` | Enterprise-oriented. Uses `zypper`. |
| Void Linux | `void` | Independent distro with runit init. Lightweight. |

<BestPractice>
Stick with **Ubuntu** for ADL unless you have a specific reason to choose another distribution. The ADL guides, examples, and troubleshooting all assume Ubuntu. Other distributions work but you will need to adapt package names and commands yourself.
</BestPractice>

## Installing a distribution

To install Ubuntu (the ADL default):

<CopyCommand command="proot-distro install ubuntu" />

<ExpectedResult>
proot-distro downloads the Ubuntu root filesystem archive (roughly 30-50 MB compressed), extracts it, and sets it up. This takes 1-5 minutes depending on your internet connection. You will see download progress followed by extraction output.
</ExpectedResult>

To install a different distribution, replace `ubuntu` with its alias:

<CopyCommand command="proot-distro install debian" />

<Tip>
You can install multiple distributions side by side. Each one is independent and has its own filesystem. This is useful for testing software across different distros.
</Tip>

## Logging into a distribution

To start an interactive shell inside your installed distribution:

<CopyCommand command="proot-distro login ubuntu" />

<ExpectedResult>
Your prompt changes to indicate you are now inside Ubuntu (typically `root@localhost`). You are now running commands inside the Linux distribution, not in Termux.
</ExpectedResult>

To exit back to Termux, type `exit` or press `Ctrl+D`.

### Running a single command

You do not need to start an interactive session to run one command. Use `--` followed by the command:

<CopyCommand command="proot-distro login ubuntu -- apt update" />

This logs in, runs `apt update`, and returns you to Termux immediately.

### The --isolated flag

By default, proot-distro shares certain directories between Termux and the distribution (like your home directory and `/tmp`). The `--isolated` flag disables this sharing:

<CopyCommand command="proot-distro login ubuntu --isolated" />

| Behavior | Default login | --isolated login |
|---|---|---|
| Termux home directory | Shared | Not shared |
| /tmp | Shared | Not shared |
| Device storage | Accessible | Not accessible |
| Distribution filesystem | Full access | Full access |

<Warning title="Isolated sessions limit functionality">
Running with `--isolated` prevents the distribution from accessing Termux resources. Audio, display, and shared files will not work in isolated mode. Only use it when you need a clean, sandboxed environment — for example, when testing something that might modify files you want to protect.
</Warning>

## Passing environment variables

ADL needs several environment variables to connect the Linux distribution to your display and audio. You pass them with the `--shared-tmp` flag (enabled by default) and explicit `--env` flags:

<CopyCommand command="proot-distro login ubuntu --env DISPLAY=:0 --env PULSE_SERVER=tcp:127.0.0.1:4713" />

Common environment variables for ADL:

| Variable | Purpose | Typical value |
|---|---|---|
| `DISPLAY` | Connects to the X11 display server | `:0` or `:1` |
| `PULSE_SERVER` | Connects to PulseAudio for sound | `tcp:127.0.0.1:4713` |
| `XDG_RUNTIME_DIR` | Runtime directory for desktop sessions | `/tmp/xdg-runtime` |

<Tip>
The commands in the ADL setup guides add these variables to your shell profile inside the distribution, so they are set automatically. You only need to set them manually if you are doing a custom setup or troubleshooting.
</Tip>

## Managing multiple distributions

You can have several distributions installed simultaneously. Each one gets its own isolated filesystem.

List all installed distributions:

<CopyCommand command="proot-distro list" />

Remove a distribution you no longer need:

<CopyCommand command="proot-distro remove debian" />

<Warning title="Removing a distro deletes all its data">
This permanently deletes the distribution's entire filesystem, including anything you installed or configured inside it. Back up first if you have important data.
</Warning>

## Backup and restore

proot-distro can create compressed archives of your entire distribution, which is invaluable for preserving a working setup.

### Creating a backup

<CopyCommand command="proot-distro backup ubuntu --output /sdcard/ubuntu-backup.tar.gz" />

<ExpectedResult>
proot-distro compresses the entire Ubuntu filesystem into a tar.gz archive. This can take several minutes and the resulting file may be 1-5 GB depending on how much software you have installed.
</ExpectedResult>

### Restoring from a backup

<CopyCommand command="proot-distro restore /sdcard/ubuntu-backup.tar.gz" />

<BestPractice>
Create a backup after completing the full ADL setup. If something breaks later, you can restore to a known-good state in minutes instead of repeating the entire installation process.
</BestPractice>

## Storage and filesystem layout

proot-distro stores distribution filesystems in a specific location within Termux's private storage:

```
/data/data/com.termux/files/usr/var/lib/proot-distro/
├── dlcache/              # Downloaded distribution archives
└── installed-rootfs/
    ├── ubuntu/           # Ubuntu's root filesystem
    ├── debian/           # Debian's root filesystem (if installed)
    └── ...
```

<Note title="Storage space">
Each distribution takes 500 MB to several GB depending on installed packages. Ubuntu with a full ADL desktop setup (XFCE, Firefox, development tools) typically uses 3-5 GB. Check your available storage with `df -h` in Termux before installing.
</Note>

Inside the distribution, the filesystem looks like a standard Linux installation:

| Path | Contents |
|---|---|
| `/root` | Root user's home directory |
| `/home` | Regular user home directories |
| `/usr/bin` | Installed programs |
| `/etc` | System configuration files |
| `/var` | Variable data (logs, caches) |

<PerformanceNote>
Because proot translates system calls rather than running a real kernel, filesystem operations are somewhat slower than native Linux. This is most noticeable during package installation (`apt install`) and large file operations. Day-to-day desktop use is not significantly affected.
</PerformanceNote>

## Troubleshooting

<Troubleshooting items={[
  {
    problem: "proot-distro: command not found",
    solution: "proot-distro is a Termux package. Install it with: pkg install proot-distro. Make sure you are running this command in Termux, not inside an already-logged-in distribution."
  },
  {
    problem: "Download fails or is very slow",
    solution: "The distribution images are hosted on external servers. Try switching to a different network (Wi-Fi vs. mobile data), or wait and try again later. You can also run termux-change-repo to switch Termux mirrors, though proot-distro downloads come from separate sources."
  },
  {
    problem: "\"Unable to install\" or hash mismatch errors",
    solution: "Run pkg update && pkg upgrade -y to update proot-distro itself, then try the install again. Hash mismatches usually mean the local package metadata is outdated."
  },
  {
    problem: "Filesystem appears read-only inside the distribution",
    solution: "This usually happens when Android's storage permissions change. Exit the distribution, run termux-setup-storage in Termux, grant the permission again, then log back in."
  },
  {
    problem: "Backup file is much larger than expected",
    solution: "Package manager caches can bloat backups. Run apt clean inside Ubuntu before backing up to clear downloaded package files. This can save 500 MB or more."
  }
]} />

## FAQ

<FAQ items={[
  {
    question: "Can I run GUI applications from proot-distro?",
    answer: "Yes, but you need a display server. ADL uses either Termux:X11 or VNC to provide a graphical display. proot-distro itself only gives you the Linux distribution — the display layer is separate. See the software section for display server setup."
  },
  {
    question: "Is proot-distro the same as a virtual machine?",
    answer: "No. A virtual machine emulates entire hardware. proot-distro uses proot to translate system calls, which means applications run directly on your device's processor without emulation. This is faster than a VM but has some limitations — see What is proot? for details."
  },
  {
    question: "Can I access Android files from inside the distribution?",
    answer: "Yes, by default. When you log in without the --isolated flag, your Termux home directory and shared storage are accessible. Files in /sdcard (via Termux's storage setup) can be reached from inside the distribution."
  },
  {
    question: "What happens if I uninstall Termux?",
    answer: "All distributions installed through proot-distro are stored inside Termux's private data directory. If you uninstall Termux, everything is deleted — all distributions, all data, all configuration. Always back up before uninstalling Termux."
  }
]} />

**Next:** Learn about display servers — [VNC](/docs/learn/software/vnc) for remote-style display, or [Termux:X11](/docs/learn/software/termux-x11) for native performance.
