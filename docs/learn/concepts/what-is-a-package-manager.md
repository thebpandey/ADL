---
title: "What is a Package Manager?"
sidebar_position: 10
description: Understanding package managers — how Linux installs, updates, and removes software, and the difference between pkg and apt in ADL.
---

# What is a Package Manager?

A package manager is a tool that **installs, updates, and removes software** on your system. Think of it as an app store that you control from the command line. Instead of browsing a store and tapping "Install," you type a command and the package manager handles everything: downloading the software, installing its dependencies, and placing files in the right locations.

In ADL, you work with two package managers: **pkg** in Termux and **apt** in Ubuntu. Understanding which one to use and when is essential.

## Why Package Managers Exist

On Windows or macOS, you typically install software by downloading an installer file from a website and running it. This approach has problems:

- You have to find the right download yourself
- You have to check for updates manually
- Uninstalling may leave files behind
- One program's installation can break another if they share files
- There is no easy way to see everything you have installed

Package managers solve all of these problems:

| Problem | Without a Package Manager | With a Package Manager |
|---|---|---|
| Finding software | Search the web, find the right site | `apt search firefox` |
| Installing | Download, run installer, follow wizard | `apt install firefox` |
| Dependencies | Hunt down and install required libraries | Automatic |
| Updating | Check each app's website individually | `apt update && apt upgrade` |
| Uninstalling | Run uninstaller (if it exists), hope for cleanup | `apt remove firefox` |
| Inventory | No centralized list | `apt list --installed` |

<Tip>
If you have used the Google Play Store, you already understand the concept. A package manager does the same thing -- finding, installing, updating, and removing software -- but through text commands instead of a graphical store. The Linux ecosystem has tens of thousands of packages available this way.
</Tip>

## How Packages Work

A **package** is a bundle that contains:

1. The software itself (compiled programs, scripts, configuration files)
2. A list of **dependencies** (other packages this software needs)
3. Metadata (version number, description, maintainer)
4. Instructions for where to put files and how to configure them

Packages live in **repositories** -- online servers that host thousands of packages. When you run an install command, the package manager:

1. Checks the repository for the requested package
2. Downloads the package and all its dependencies
3. Installs everything in the correct locations
4. Registers what was installed so it can be updated or removed later

## Two Package Managers in ADL

ADL involves two separate environments, each with its own package manager:

| Environment | Package Manager | Main Command | Repository |
|---|---|---|---|
| **Termux** (Android layer) | pkg (wraps apt) | `pkg install <name>` | Termux package repository |
| **Ubuntu** (proot layer) | apt | `sudo apt install <name>` | Ubuntu package repository |

These are separate systems with separate package lists. Installing something in Termux does not install it in Ubuntu, and vice versa.

### When to Use pkg (Termux)

Use `pkg` when you need to install tools that run in the Termux environment itself -- the Android-side layer:

- PulseAudio (audio server)
- Termux add-on utilities
- Tools you want available outside the proot environment
- Packages needed for proot-distro itself

<CopyCommand command="pkg install pulseaudio" />

### When to Use apt (Ubuntu)

Use `apt` when you need to install software that runs inside your Ubuntu desktop -- the Linux desktop layer:

- Desktop applications (Firefox, LibreOffice, VS Code)
- Desktop environment components
- Development tools (compilers, interpreters, libraries)
- System utilities for the Ubuntu environment

<CopyCommand command="sudo apt install firefox" />

<Warning>
Do not confuse the two environments. If you are inside the Ubuntu proot and type `pkg install`, it will not work -- `pkg` is a Termux command. If you are in Termux and type `sudo apt install`, it will install the Termux version of the package (if it exists), not the Ubuntu version. Always check which environment you are in before installing packages.
</Warning>

## Essential Commands

### Termux (pkg)

| Command | What It Does |
|---|---|
| `pkg update` | Refreshes the list of available packages |
| `pkg upgrade` | Upgrades all installed packages to latest versions |
| `pkg install <name>` | Installs a package |
| `pkg remove <name>` | Removes a package |
| `pkg search <name>` | Searches for a package by name |
| `pkg list-installed` | Lists all installed packages |
| `pkg list-all` | Lists all available packages |

### Ubuntu (apt)

| Command | What It Does |
|---|---|
| `sudo apt update` | Refreshes the list of available packages |
| `sudo apt upgrade` | Upgrades all installed packages to latest versions |
| `sudo apt install <name>` | Installs a package |
| `sudo apt remove <name>` | Removes a package (keeps config files) |
| `sudo apt purge <name>` | Removes a package and its config files |
| `apt search <name>` | Searches for a package by name |
| `apt list --installed` | Lists all installed packages |
| `sudo apt autoremove` | Removes packages that are no longer needed |

<BestPractice>
Always run `update` before `install` or `upgrade`. The update command refreshes your local copy of the package list from the repository. Without it, you might install an outdated version or get errors because the package list is stale.
</BestPractice>

## Understanding Dependencies

When you install a package, the package manager often installs additional packages automatically. These are **dependencies** -- other software that your requested package needs to function.

For example, installing Firefox might also install dozens of libraries for graphics rendering, font handling, and networking. You do not need to know what these are. The package manager identifies them, downloads them, and installs them for you.

<CopyCommand command="sudo apt install firefox" />

<ExpectedResult>
The output will show a list of additional packages that will be installed alongside Firefox. These are dependencies. Type `Y` when prompted to confirm the installation.
</ExpectedResult>

## Updating Your System

Keeping your software updated is important for security and stability. The process is two steps in both environments:

**In Termux:**

<CopyCommand command="pkg update && pkg upgrade" />

**In Ubuntu:**

<CopyCommand command="sudo apt update && sudo apt upgrade" />

The `&&` connects two commands -- the second runs only if the first succeeds. The `update` refreshes the package list, and the `upgrade` installs newer versions of everything that has an update available.

<Note>
You will be asked to confirm upgrades. Read the list of packages being upgraded and press `Y` to proceed. If an upgrade lists a very large number of packages or wants to remove packages, pause and check whether something unexpected is happening.
</Note>

## Common Questions

<FAQ items={[
  {
    question: "What is sudo?",
    answer: "sudo stands for 'superuser do.' It runs a command with administrator privileges. In the Ubuntu proot environment, some operations (like installing packages) require administrator access. You prefix those commands with sudo. In Termux, sudo is not needed because pkg handles permissions automatically."
  },
  {
    question: "Can I install Windows or Mac software?",
    answer: "No. Package managers install Linux software compiled for your device's architecture (ARM in the case of phones). Windows (.exe) and macOS (.dmg) programs will not work. However, most popular software has a Linux version or a Linux alternative. For example, LibreOffice instead of Microsoft Office, or GIMP instead of Adobe Photoshop."
  },
  {
    question: "What if a package is not in the repository?",
    answer: "Most software you need is available in Ubuntu's repositories. If something is not available, you may be able to add a third-party repository (PPA), download a .deb package file and install it manually with dpkg, or compile the software from source code. These are advanced topics covered elsewhere in the documentation."
  },
  {
    question: "How much space do packages use?",
    answer: "It varies widely. A small utility might use a few hundred kilobytes, while a full application like LibreOffice can use several hundred megabytes including dependencies. You can check available storage with the df -h command. Be mindful of storage on phones with limited internal space."
  }
]} />

## Summary

Package managers are command-line tools that handle software installation, updates, and removal on Linux. In ADL, you use two: `pkg` in the Termux environment for Android-layer tools, and `apt` inside Ubuntu for desktop applications and utilities. Always know which environment you are in before installing packages, and remember to run `update` before `install` to ensure your package lists are current.

**Next:** Learn about [terminals](./what-is-a-terminal.md), the text-based interface where you type these commands.

For a complete command reference, see the [apt commands guide](/docs/reference/commands/apt-commands).
