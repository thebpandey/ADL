---
sidebar_position: 1
title: Installing Applications
description: Learn how to find and install applications in ADL using the APT package manager, and discover recommended software for everyday use.
---

# Installing Applications

<HeroImage
  image="hero-applications.webp"
  alt="Robot mascot surrounded by Linux application icons being installed on an Android-powered desktop"
/>

ADL gives you access to thousands of Linux applications through the same package manager that powers Ubuntu servers and desktops worldwide. If you have never installed software from a command line before, this guide will walk you through everything you need to know.

## How Software Installation Works in ADL

Unlike Android, where you tap "Install" in the Play Store, ADL uses a command-line tool called **APT** (Advanced Package Tool) to install, update, and remove software. APT connects to online repositories that contain pre-built software packages, downloads them, and sets everything up for you automatically.

If you want to understand how package managers work in more detail, see [What Is a Package Manager?](/docs/learn/concepts/what-is-a-package-manager).

<BestPractice>
Always update your package lists before installing new software. This ensures APT knows about the latest available versions.
</BestPractice>

<CopyCommand command="apt update" />

## Finding Software

Before you install something, you need to know its package name. The package name is not always the same as the application name you are used to. For example, the Firefox browser is packaged as `firefox`, but the VLC media player is packaged as `vlc`.

### Searching for Packages

Use `apt search` followed by a keyword to find packages:

<CopyCommand command="apt search web browser" />

This returns a list of packages with "web" and "browser" in their name or description. The output can be long, so you can narrow it down:

<CopyCommand command="apt search --names-only firefox" />

### Getting Package Details

Once you find a package, check its details before installing:

<CopyCommand command="apt show vlc" />

This tells you the package version, size, dependencies, and a description of what it does.

## Installing Software

To install a package, use `apt install` followed by the package name:

<CopyCommand command="apt install vlc -y" />

The `-y` flag automatically confirms the installation so you do not have to type "yes" manually.

You can install multiple packages at once:

<CopyCommand command="apt install gimp inkscape audacity -y" />

<Tip>
If you are not sure whether a package is already installed, go ahead and run the install command. APT will simply tell you it is already at the latest version.
</Tip>

## Removing Software

To remove an application you no longer need:

<CopyCommand command="apt remove vlc -y" />

To remove the application and its configuration files:

<CopyCommand command="apt purge vlc -y" />

After removing packages, clean up leftover dependencies that are no longer needed:

<CopyCommand command="apt autoremove -y" />

## Updating Software

Keep all of your installed software up to date with two commands:

<CopyCommand command="apt update && apt upgrade -y" />

The first command refreshes the list of available packages. The second downloads and installs any newer versions.

<BestPractice>
Run updates regularly, at least once a week, to get security patches and bug fixes.
</BestPractice>

## ARM Architecture: What You Need to Know

ADL runs on Android devices, which use ARM processors (arm64/aarch64). This has an important consequence for software compatibility.

<Warning>
Only ARM-compatible packages (arm64/aarch64) work in ADL. Software built for x86 or x86_64 (standard PC processors) will not run. Most packages in the Ubuntu repositories are available for ARM, but some third-party software may only provide x86 builds.
</Warning>

When downloading software from outside APT (such as `.deb` files from a project's website), always select the **arm64** or **aarch64** version. If only an x86/amd64 version is available, that software will not work in ADL.

### How to Check a Package's Architecture

You can verify that a package supports ARM before installing:

<CopyCommand command="apt show firefox | grep Architecture" />

The output should say `arm64`. If it says `amd64`, the package is not compatible.

## Recommended Applications

The following table lists well-tested applications that run reliably on ADL. All of these are available through APT and support ARM.

### Web Browsers

| Application | Package Name | Description |
|---|---|---|
| Firefox | `firefox` | Full-featured browser with extension support |
| Chromium | `chromium-browser` | Open-source version of Chrome |
| Midori | `midori` | Lightweight browser, good for low-RAM devices |

### Office and Productivity

| Application | Package Name | Description |
|---|---|---|
| LibreOffice | `libreoffice` | Full office suite (documents, spreadsheets, presentations) |
| AbiWord | `abiword` | Lightweight word processor |
| Gnumeric | `gnumeric` | Lightweight spreadsheet editor |
| Evince | `evince` | PDF and document viewer |
| Mousepad | `mousepad` | Simple text editor (included with XFCE) |

### Development Tools

| Application | Package Name | Description |
|---|---|---|
| VS Code (OSS) | `code-oss` | Code editor with extension support |
| Vim | `vim` | Terminal-based text editor |
| Git | `git` | Version control system |
| Python 3 | `python3` | Python programming language |
| Node.js | `nodejs` | JavaScript runtime |
| GCC | `gcc` | C/C++ compiler |

### Media

| Application | Package Name | Description |
|---|---|---|
| VLC | `vlc` | Plays almost any audio or video format |
| GIMP | `gimp` | Image editor (similar to Photoshop) |
| Inkscape | `inkscape` | Vector graphics editor |
| Audacity | `audacity` | Audio recording and editing |
| mpv | `mpv` | Lightweight video player |

### Utilities

| Application | Package Name | Description |
|---|---|---|
| Thunar | `thunar` | File manager (included with XFCE) |
| XFCE Terminal | `xfce4-terminal` | Terminal emulator (included with XFCE) |
| Htop | `htop` | System resource monitor |
| Neofetch | `neofetch` | System information display |
| File Roller | `file-roller` | Archive manager (zip, tar, etc.) |

<Tip>
Start with lightweight applications if your device has limited RAM (4 GB or less). Midori instead of Firefox, AbiWord instead of LibreOffice, and mpv instead of VLC will all use significantly less memory.
</Tip>

### Installing a Starter Pack

To install a solid set of everyday applications in one command:

<CopyCommand command="apt install firefox libreoffice vlc gimp htop file-roller -y" />

## Installing Software From Outside APT

Some applications are not available in the Ubuntu repositories. In those cases you may find `.deb` files on the project's website. To install a downloaded `.deb` file:

<CopyCommand command="apt install ./package-name.deb -y" />

<Warning>
Only install `.deb` files from sources you trust. Unlike APT repository packages, standalone `.deb` files are not verified by Ubuntu's package signing system. Always download the **arm64** version.
</Warning>

## Troubleshooting

### "Unable to locate package"

This usually means either the package name is wrong or your package lists are outdated. Run `apt update` and try again. You can also search for the correct name:

<CopyCommand command="apt update && apt search your-keyword" />

### "Has no installation candidate"

The package exists in the repository metadata but has no ARM build available. Look for an alternative application that supports ARM.

### Broken dependencies

If an installation fails because of dependency problems, try:

<CopyCommand command="apt --fix-broken install -y" />

<Note>
If you continue to run into problems installing a specific application, check whether it is known to work on ARM-based Ubuntu systems. Some software is only built for x86 and has no ARM version available.
</Note>
