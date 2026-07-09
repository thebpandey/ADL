---
sidebar_position: 1
title: "Termux Commands"
description: "Complete reference for Termux package management, storage, session, and API commands."
---

# Termux Commands

<HeroImage
  image="hero-reference.webp"
  alt="Robot mascot consulting a reference manual beside a terminal window"
/>

{/* TODO: this hero is intended for the Reference section landing page (currently a generated index). Move it if a real landing page is created. */}

Reference for Termux-specific commands used within the ADL environment. Covers package management, storage access, session control, and the Termux API.

## Package Management

Termux uses `pkg` as its primary package manager. `pkg` is a wrapper around `apt` that automatically runs `apt update` before install operations, ensuring you always pull from the latest package index. You can use `apt` directly if you prefer, but you must run `apt update` manually before installing or upgrading.

| Feature | `pkg` | `apt` |
|---|---|---|
| Auto-updates package index | Yes | No |
| Syntax | `pkg install <name>` | `apt install <name>` |
| Backend | Calls `apt` internally | Direct dpkg frontend |
| Recommended for Termux | Yes | Only if you need fine-grained control |

### Core Commands

| Command | Description | Example |
|---|---|---|
| `pkg install <package>` | Install one or more packages | `pkg install git nodejs` |
| `pkg uninstall <package>` | Remove a package | `pkg uninstall nodejs` |
| `pkg list-installed` | List all installed packages | `pkg list-installed` |
| `pkg list-all` | List all available packages in the repo | `pkg list-all` |
| `pkg search <query>` | Search for packages by name or description | `pkg search python` |
| `pkg update` | Update the package index | `pkg update` |
| `pkg upgrade` | Upgrade all installed packages to latest versions | `pkg upgrade` |
| `pkg show <package>` | Show detailed info about a package | `pkg show openssh` |
| `pkg files <package>` | List files installed by a package | `pkg files curl` |
| `pkg clean` | Clear the local package cache | `pkg clean` |

<CopyCommand command="pkg update && pkg upgrade -y" />

<Tip title="Batch installs">
Chain multiple packages in a single install command to avoid repeated index updates: `pkg install git curl wget openssh -y`
</Tip>

### Common Package Groups

Useful package sets for a typical ADL setup.

**Core utilities:**

<CopyCommand command="pkg install coreutils findutils grep sed gawk tar gzip -y" />

**Development tools:**

<CopyCommand command="pkg install git nodejs python build-essential clang cmake -y" />

**Networking and remote access:**

<CopyCommand command="pkg install openssh curl wget nmap rsync -y" />

**Shell and terminal:**

<CopyCommand command="pkg install zsh tmux neovim htop tree -y" />

**File and text processing:**

<CopyCommand command="pkg install jq ripgrep fd fzf bat -y" />

<BestPractice title="Keep packages current">
Run `pkg update && pkg upgrade -y` regularly to avoid dependency conflicts when installing new packages.
</BestPractice>

## Storage

Termux runs in its own sandboxed filesystem. To access shared Android storage (Downloads, DCIM, etc.), you must grant storage permission first.

### Setting Up Storage Access

<CopyCommand command="termux-setup-storage" />

Running this command prompts for the Android storage permission and creates symlinks under `~/storage/`.

<Warning title="Run only once">
You only need to run `termux-setup-storage` once. Running it again will recreate the symlinks but should not cause issues.
</Warning>

### Important Paths

| Path | Description |
|---|---|
| `/data/data/com.termux/files/home` | Termux home directory (`~`) |
| `/data/data/com.termux/files/usr` | Termux usr prefix (`$PREFIX`) |
| `~/storage/shared` | Android internal storage root |
| `~/storage/downloads` | Android Downloads folder |
| `~/storage/dcim` | Android DCIM (camera photos) |
| `~/storage/music` | Android Music folder |
| `~/storage/movies` | Android Movies folder |
| `~/storage/pictures` | Android Pictures folder |
| `~/storage/external-1` | External SD card (if available) |

<Note>
Files stored inside `/data/data/com.termux/files/` are private to Termux and not accessible to other Android apps without root. Use `~/storage/shared` when you need files visible to other apps.
</Note>

## Sessions

### Reloading Settings

<CopyCommand command="termux-reload-settings" />

Reloads `~/.termux/termux.properties` without restarting the Termux app. Use this after editing font, color scheme, or keyboard settings.

| Setting file | Purpose |
|---|---|
| `~/.termux/termux.properties` | Terminal behavior, extra keys, bell, etc. |
| `~/.termux/colors.properties` | Terminal color scheme |
| `~/.termux/font.ttf` | Custom terminal font |

## Termux API Commands

These commands require the **Termux:API** add-on app to be installed from F-Droid (or the same source as your Termux install) and the `termux-api` package.

<CopyCommand command="pkg install termux-api -y" />

<Warning>
The Termux:API Android app and the `termux-api` package must come from the same distribution source (both from F-Droid or both from GitHub releases). Mixing sources causes silent failures.
</Warning>

### Device and System

| Command | Description | Example |
|---|---|---|
| `termux-battery-status` | Battery level, status, temperature in JSON | `termux-battery-status` |
| `termux-brightness <0-255>` | Set screen brightness | `termux-brightness 200` |
| `termux-vibrate` | Vibrate the device | `termux-vibrate -d 500` |
| `termux-volume <stream> <vol>` | Set volume for a stream (music, ring, alarm, notification) | `termux-volume music 10` |
| `termux-wifi-connectioninfo` | Current Wi-Fi connection details in JSON | `termux-wifi-connectioninfo` |
| `termux-telephony-deviceinfo` | Device and SIM information in JSON | `termux-telephony-deviceinfo` |
| `termux-location` | Get device GPS/network location in JSON | `termux-location -p gps` |

### Clipboard

| Command | Description | Example |
|---|---|---|
| `termux-clipboard-get` | Print current clipboard contents to stdout | `termux-clipboard-get` |
| `termux-clipboard-set <text>` | Set clipboard contents | `echo "text" \| termux-clipboard-set` |

<CopyCommand command="termux-clipboard-get" />

### Notifications and Feedback

| Command | Description | Example |
|---|---|---|
| `termux-notification` | Show an Android notification | `termux-notification -t "Title" -c "Content"` |
| `termux-toast` | Show a short popup toast message | `termux-toast "Build complete"` |
| `termux-tts-speak` | Speak text aloud via text-to-speech | `echo "done" \| termux-tts-speak` |

<CopyCommand command="termux-notification -t 'ADL' -c 'Task finished' --id adl-notify" />

<Tip>
Use the `--id` flag with `termux-notification` to update an existing notification instead of creating a new one. Useful for progress tracking in scripts.
</Tip>

### File Sharing and Downloads

| Command | Description | Example |
|---|---|---|
| `termux-download` | Download a file using the system download manager | `termux-download "https://example.com/file.zip"` |
| `termux-share` | Share a file or text via the Android share menu | `termux-share -a send image.png` |

### Camera and Media

| Command | Description | Example |
|---|---|---|
| `termux-camera-photo <file>` | Take a photo with a device camera | `termux-camera-photo -c 0 photo.jpg` |

The `-c` flag selects the camera: `0` for rear, `1` for front.

### SMS

| Command | Description | Example |
|---|---|---|
| `termux-sms-list` | List SMS messages in JSON | `termux-sms-list -l 10 -t inbox` |

Flags: `-l` limits the count, `-t` sets the type (`inbox`, `sent`, `draft`, `all`).

<Note title="Permissions">
Termux API commands require their corresponding Android permissions. The first invocation of each command may trigger a system permission dialog (camera, location, SMS, etc.). Denied permissions cause the command to return empty output or an error.
</Note>

<CollapsibleSection title="Scripting with Termux API">

Termux API commands output JSON, making them straightforward to parse in scripts:

```bash
# Check if battery is above 20%
battery=$(termux-battery-status | jq '.percentage')
if [ "$battery" -lt 20 ]; then
  termux-notification -t "Low Battery" -c "Battery at ${battery}%"
fi
```

```bash
# Copy current working directory to clipboard
pwd | termux-clipboard-set
```

```bash
# Notify when a long-running command finishes
make build && termux-toast "Build succeeded" || termux-toast "Build failed"
```

</CollapsibleSection>
