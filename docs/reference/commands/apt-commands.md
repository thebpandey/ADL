---
sidebar_position: 2
title: "APT Commands"
description: "Complete APT package management reference for Ubuntu inside proot-distro."
---

# APT Commands

Complete reference for APT package management inside the Ubuntu proot environment. For background on how package managers work, see [What is a Package Manager](../../learn/concepts/what-is-a-package-manager).

<Note title="No sudo required">
When running inside proot-distro, you are already root. All `apt` commands run directly without `sudo`. If you are accessing the environment from an outer shell or script that does not enter proot as root, prefix commands with `sudo` as usual.
</Note>

---

## Installing Packages

| Command | Description | Example |
|---|---|---|
| `apt install <pkg>` | Install a package and its dependencies | `apt install vim` |
| `apt install -y <pkg>` | Install without confirmation prompt | `apt install -y curl wget` |
| `apt install <pkg1> <pkg2>` | Install multiple packages at once | `apt install git nodejs npm` |
| `apt install --no-install-recommends <pkg>` | Install without recommended extras (smaller footprint) | `apt install --no-install-recommends python3` |
| `apt install <pkg>=<version>` | Install a specific version | `apt install nodejs=18.19.0-1nodesource1` |
| `apt reinstall <pkg>` | Reinstall a currently installed package | `apt reinstall openssh-client` |
| `dpkg -i <file>.deb` | Install a local `.deb` file | `dpkg -i package.deb` |

<CopyCommand command="apt install -y build-essential" />

<Tip title="Fix broken installs after dpkg">
If `dpkg -i` fails due to missing dependencies, run:

<CopyCommand command="apt install --fix-broken -y" />

This resolves and installs any missing dependencies for the partially installed package.
</Tip>

---

## Removing Packages

| Command | Description | Example |
|---|---|---|
| `apt remove <pkg>` | Remove a package but keep its configuration files | `apt remove apache2` |
| `apt purge <pkg>` | Remove a package and its configuration files | `apt purge apache2` |
| `apt remove --purge <pkg>` | Same as `apt purge` | `apt remove --purge nginx` |
| `apt autoremove` | Remove packages that were installed as dependencies and are no longer needed | `apt autoremove` |
| `apt autoremove --purge` | Autoremove and delete configuration files | `apt autoremove --purge` |

<CopyCommand command="apt autoremove -y" />

<Warning title="Purge is permanent">
`apt purge` deletes configuration files in `/etc` that belong to the package. If you have customized config files, back them up before purging.
</Warning>

---

## Updating & Upgrading

| Command | Description | Example |
|---|---|---|
| `apt update` | Refresh the package index from repositories | `apt update` |
| `apt upgrade` | Upgrade all installed packages to their latest versions (safe, no removals) | `apt upgrade -y` |
| `apt full-upgrade` | Upgrade packages, adding or removing dependencies as needed | `apt full-upgrade -y` |
| `apt dist-upgrade` | Same as `full-upgrade`; handles changing dependencies intelligently | `apt dist-upgrade -y` |

<BestPractice>
Always run `apt update` before `apt install` or `apt upgrade` to ensure you are pulling from the latest package index.

<CopyCommand command="apt update && apt upgrade -y" />
</BestPractice>

---

## Searching & Information

| Command | Description | Example |
|---|---|---|
| `apt search <term>` | Search package names and descriptions | `apt search image editor` |
| `apt show <pkg>` | Display detailed information about a package | `apt show ffmpeg` |
| `apt list` | List all available packages | `apt list` |
| `apt list --installed` | List only installed packages | `apt list --installed` |
| `apt list --upgradable` | List packages with available upgrades | `apt list --upgradable` |
| `dpkg -l` | List all installed packages with version and status | `dpkg -l` |
| `dpkg -l <pattern>` | Filter installed packages by name pattern | `dpkg -l 'lib*'` |
| `dpkg -L <pkg>` | List all files installed by a package | `dpkg -L coreutils` |

<CopyCommand command="apt list --installed 2>/dev/null | grep -i python" />

<Tip>
Pipe `dpkg -l` or `apt list` through `grep` to quickly filter results when searching for a specific package.
</Tip>

---

## Cache Management

| Command | Description | Example |
|---|---|---|
| `apt clean` | Delete all cached `.deb` files from `/var/cache/apt/archives` | `apt clean` |
| `apt autoclean` | Delete only cached `.deb` files that can no longer be downloaded (obsolete) | `apt autoclean` |
| `apt-cache stats` | Show cache statistics (total packages, versions, dependencies) | `apt-cache stats` |
| `apt-cache policy <pkg>` | Show installed and candidate versions plus repository priority | `apt-cache policy nodejs` |

<CopyCommand command="apt clean && apt autoclean" />

<Note>
In a proot environment, disk space is shared with the Android host. Running `apt clean` after large installs helps reclaim storage.
</Note>

---

## Common Flags

| Flag | Long Form | Description |
|---|---|---|
| `-y` | `--yes` | Assume "yes" to all prompts; run non-interactively |
| | `--no-install-recommends` | Skip recommended (but not required) packages |
| `-f` | `--fix-broken` | Attempt to fix broken dependencies |
| `-s` | `--dry-run` | Simulate the operation without making changes |
| | `--allow-downgrades` | Allow installing an older version of an already-installed package |
| `-q` | `--quiet` | Suppress progress output; useful in scripts |
| `-d` | `--download-only` | Download packages but do not install them |

<CollapsibleSection title="Combining flags">

Flags can be combined in a single command. For example, to do a quiet, non-interactive upgrade without recommended packages:

<CopyCommand command="apt upgrade -y -q --no-install-recommends" />

For a dry run before a full upgrade to preview what would change:

<CopyCommand command="apt full-upgrade --dry-run" />

</CollapsibleSection>

---

## Troubleshooting Common Issues

<CollapsibleSection title="E: Unable to locate package">

The package index is out of date or the package name is wrong.

1. Update the index first:
   <CopyCommand command="apt update" />
2. Verify the package name with `apt search`.
3. Check that the correct repositories are enabled in `/etc/apt/sources.list`.

</CollapsibleSection>

<CollapsibleSection title="dpkg was interrupted / broken packages">

A previous install was interrupted, leaving the package database in a broken state.

<CopyCommand command="dpkg --configure -a" />
<CopyCommand command="apt install --fix-broken -y" />

</CollapsibleSection>

<CollapsibleSection title="Hash Sum mismatch">

The downloaded package does not match the expected checksum, often caused by a stale cache or network issue.

<CopyCommand command="apt clean" />
<CopyCommand command="apt update" />

If it persists, try switching to a different mirror in `/etc/apt/sources.list`.

</CollapsibleSection>

<CollapsibleSection title="Could not get lock /var/lib/dpkg/lock">

Another `apt` or `dpkg` process is running. In proot, this can also happen if a previous session crashed.

<CopyCommand command="rm -f /var/lib/dpkg/lock-frontend /var/lib/dpkg/lock /var/cache/apt/archives/lock" />
<CopyCommand command="dpkg --configure -a" />

<Warning>
Only remove lock files if you are certain no other package operation is running.
</Warning>

</CollapsibleSection>

<CollapsibleSection title="Held packages preventing upgrade">

Some packages are held back and not upgraded. To see which:

<CopyCommand command="apt-mark showhold" />

To unhold a package and allow it to upgrade:

<CopyCommand command="apt-mark unhold <package-name>" />

</CollapsibleSection>
