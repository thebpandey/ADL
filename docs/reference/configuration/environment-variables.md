---
sidebar_position: 3
title: "Environment Variables"
description: "Reference for all environment variables used in the ADL desktop environment."
---

# Environment Variables

This page documents all environment variables relevant to the ADL desktop environment, organized by category.

## Display Variables

Variables that control how graphical output is rendered.

| Variable | Default Value | Purpose | Example |
|---|---|---|---|
| `DISPLAY` | `:0` or `:1` | X11 display server connection | `export DISPLAY=:1` |
| `WAYLAND_DISPLAY` | `wayland-0` | Wayland compositor socket name | `export WAYLAND_DISPLAY=wayland-0` |
| `XDG_SESSION_TYPE` | `x11` | Session type identifier (`x11`, `wayland`, `tty`) | `export XDG_SESSION_TYPE=wayland` |

<Note>
When running a nested X server (such as Xephyr), set `DISPLAY` to the nested display number to direct applications into it.
</Note>

## Audio Variables

Variables that configure audio routing and device selection.

| Variable | Default Value | Purpose | Example |
|---|---|---|---|
| `PULSE_SERVER` | `tcp:127.0.0.1:4713` or `unix:/tmp/pulse-socket` | PulseAudio server address | `export PULSE_SERVER=tcp:127.0.0.1:4713` |
| `AUDIODEV` | (none) | Preferred audio output device | `export AUDIODEV=/dev/snd/pcmC0D0p` |

<Tip title="Android audio bridging">
On Termux, set `PULSE_SERVER` to point at the Android host's PulseAudio daemon so that desktop applications can produce sound through the device speakers.
</Tip>

## XDG Base Directories

Standardized directories for application data, configuration, and caches.

| Variable | Default Value | Purpose | Example |
|---|---|---|---|
| `XDG_DATA_HOME` | `$HOME/.local/share` | User-specific data files | `export XDG_DATA_HOME=$HOME/.local/share` |
| `XDG_CONFIG_HOME` | `$HOME/.config` | User-specific configuration | `export XDG_CONFIG_HOME=$HOME/.config` |
| `XDG_CACHE_HOME` | `$HOME/.cache` | User-specific non-essential cached data | `export XDG_CACHE_HOME=$HOME/.cache` |
| `XDG_STATE_HOME` | `$HOME/.local/state` | User-specific state data (logs, history) | `export XDG_STATE_HOME=$HOME/.local/state` |
| `XDG_RUNTIME_DIR` | `/run/user/$UID` | Runtime files (sockets, PIDs) | `export XDG_RUNTIME_DIR=/tmp/runtime-user` |
| `XDG_DATA_DIRS` | `/usr/local/share:/usr/share` | System-wide data search path | `export XDG_DATA_DIRS=/usr/local/share:/usr/share` |
| `XDG_CONFIG_DIRS` | `/etc/xdg` | System-wide configuration search path | `export XDG_CONFIG_DIRS=/etc/xdg` |
| `XDG_CURRENT_DESKTOP` | (none) | Current desktop environment name | `export XDG_CURRENT_DESKTOP=XFCE` |
| `XDG_SESSION_DESKTOP` | (none) | Desktop session identifier | `export XDG_SESSION_DESKTOP=xfce` |

<Warning>
`XDG_RUNTIME_DIR` must be owned by the user, have permissions `0700`, and reside on a local filesystem. Applications may fail if this directory is missing or misconfigured.
</Warning>

## Path Variables

Variables that control executable and library lookup paths.

| Variable | Default Value | Purpose | Example |
|---|---|---|---|
| `PATH` | `/usr/local/bin:/usr/bin:/bin` | Executable search path | `export PATH=$HOME/.local/bin:$PATH` |
| `LD_LIBRARY_PATH` | (none) | Shared library search path | `export LD_LIBRARY_PATH=/opt/lib:$LD_LIBRARY_PATH` |
| `PKG_CONFIG_PATH` | (none) | pkg-config metadata search path | `export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig` |
| `MANPATH` | (system default) | Manual page search path | `export MANPATH=$HOME/.local/share/man:$MANPATH` |

<BestPractice>
Always prepend to `PATH` rather than replacing it. Use `export PATH=$HOME/.local/bin:$PATH` to add directories without losing system defaults.
</BestPractice>

## Termux-Specific Variables

Variables set automatically by Termux or required for compatibility with the Android environment.

| Variable | Default Value | Purpose | Example |
|---|---|---|---|
| `PREFIX` | `/data/data/com.termux/files/usr` | Termux root prefix for installed packages | `echo $PREFIX` |
| `HOME` | `/data/data/com.termux/files/home` | User home directory in Termux | `cd $HOME` |
| `TMPDIR` | `/data/data/com.termux/files/usr/tmp` | Temporary file directory | `export TMPDIR=$PREFIX/tmp` |
| `ANDROID_ROOT` | `/system` | Android system partition root | `echo $ANDROID_ROOT` |
| `ANDROID_DATA` | `/data` | Android data partition root | `echo $ANDROID_DATA` |

<Note>
These variables are set by Termux at shell startup. Overriding them may break package management and other Termux utilities.
</Note>

## Locale and Language

Variables that control language, character encoding, and regional formatting.

| Variable | Default Value | Purpose | Example |
|---|---|---|---|
| `LANG` | `C.UTF-8` | Default locale for all categories | `export LANG=en_US.UTF-8` |
| `LC_ALL` | (none) | Override for all `LC_*` categories | `export LC_ALL=en_US.UTF-8` |
| `LANGUAGE` | (none) | Ordered list of preferred languages | `export LANGUAGE=en_US:en` |
| `LC_CTYPE` | (from `LANG`) | Character classification and conversion | `export LC_CTYPE=en_US.UTF-8` |
| `LC_MESSAGES` | (from `LANG`) | Language of system messages | `export LC_MESSAGES=en_US.UTF-8` |
| `LC_NUMERIC` | (from `LANG`) | Numeric formatting | `export LC_NUMERIC=en_US.UTF-8` |
| `LC_TIME` | (from `LANG`) | Date and time formatting | `export LC_TIME=en_US.UTF-8` |
| `LC_COLLATE` | (from `LANG`) | String collation order | `export LC_COLLATE=en_US.UTF-8` |

<Tip>
Set `LANG` to configure all locale categories at once. Use individual `LC_*` variables only when you need a specific category to differ from the default.
</Tip>

## Application Variables

Variables that define default applications for common tasks.

| Variable | Default Value | Purpose | Example |
|---|---|---|---|
| `EDITOR` | `nano` | Default text editor (terminal) | `export EDITOR=vim` |
| `VISUAL` | (none) | Preferred visual/GUI editor | `export VISUAL=code` |
| `BROWSER` | (none) | Default web browser | `export BROWSER=firefox` |
| `TERMINAL` | (none) | Default terminal emulator | `export TERMINAL=xfce4-terminal` |
| `PAGER` | `less` | Default pager for long output | `export PAGER=less` |
| `SHELL` | `/bin/bash` | Current user shell | `export SHELL=/bin/bash` |

## Setting Variables Permanently

Where to place environment variable definitions so they persist across sessions.

| File | Scope | When Loaded |
|---|---|---|
| `~/.bashrc` | Current user, interactive bash shells | Each new interactive shell |
| `~/.profile` | Current user, login shells | Login (console, SSH, display manager) |
| `/etc/environment` | All users | PAM session initialization |
| `/etc/profile.d/*.sh` | All users, login shells | Login shells (sourced by `/etc/profile`) |

For a single user, add exports to `~/.profile` for login-time variables and `~/.bashrc` for interactive shell settings:

<CopyCommand command="echo 'export EDITOR=vim' >> ~/.profile" />

For system-wide variables, create a file in `/etc/profile.d/`:

<CopyCommand command="echo 'export EDITOR=vim' | sudo tee /etc/profile.d/adl-defaults.sh" />

<BestPractice>
Use `~/.profile` for variables that should apply to your entire session (including graphical applications launched from a display manager). Reserve `~/.bashrc` for shell-specific aliases and functions.
</BestPractice>

## Checking Current Values

Commands for inspecting environment variables.

| Command | Purpose | Example |
|---|---|---|
| `echo $VAR` | Print a single variable | `echo $DISPLAY` |
| `printenv VAR` | Print a single variable (no `$` prefix) | `printenv HOME` |
| `printenv` | List all exported variables | `printenv \| sort` |
| `env` | List all variables (similar to `printenv`) | `env \| grep XDG` |
| `export` | List all exported variables with declarations | `export -p` |
| `set` | List all shell variables (exported and local) | `set \| head -50` |

To verify a variable is set and exported:

<CopyCommand command="printenv DISPLAY" />

To search for all variables matching a pattern:

<CopyCommand command="env | grep -i audio" />

<CollapsibleSection title="Troubleshooting unset variables">

If a variable is not set as expected:

1. Confirm the variable is exported, not just assigned: use `export VAR=value`, not just `VAR=value`.
2. Check which startup file is being sourced. Non-login shells skip `~/.profile`.
3. Verify there are no typos or conflicting assignments later in your shell configuration.
4. For graphical sessions, ensure the variable is set before the desktop environment starts, not only in `~/.bashrc`.

</CollapsibleSection>
