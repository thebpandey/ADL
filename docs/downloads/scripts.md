---
sidebar_position: 3
title: "ADL Scripts"
description: "Optional, inspectable helper scripts: device report, preflight checks, installers, audio setup, launcher generator, doctor, backup, and removal — with SHA-256 checksums."
difficulty: "Beginner"
estimated_time: "10 minutes"
keywords:
  - scripts
  - device report
  - doctor
  - checksums
last_verified: "2026-07-11"
---

# ADL scripts

**Estimated time:** 10 minutes · **Difficulty:** Beginner ·
**Requirements:** Termux installed ·
**Expected outcome:** you know what each optional script does, how to verify
its checksum, and how to run it.

These scripts are **optional** — everything they do is also written out
step-by-step in the [Get Started guide](/get-started). They exist so you can
automate the mechanical parts *after reading what they do*. Every script:

- prints what it is doing and detects the wrong environment (Termux host vs
  inside the distro) and refuses to run there;
- validates every argument against an allowlist;
- supports `--help` and `--version` (and `--dry-run` where meaningful);
- never touches Android security settings, never collects personal data,
  and never deletes user data without explicit typed confirmation;
- passes ShellCheck, and ships with SHA-256 checksums.

**Version:** 1.0.0 · **Last updated:** 2026-07-11 ·
**Changelog:** initial release.

## The scripts

| Script | Runs in | What it does |
|---|---|---|
| [adl-device-report.sh](/downloads/scripts/adl-device-report.sh) | Termux host | Prints a JSON report of non-sensitive device facts for the [wizard](/get-started). Collects no identifiers, makes no network connections. |
| [adl-preflight.sh](/downloads/scripts/adl-preflight.sh) | Termux host | PASS/WARN/FAIL readiness checks (Android version, arch, RAM, storage, Termux source). Read-only. |
| [adl-install-base.sh](/downloads/scripts/adl-install-base.sh) | Termux host | Installs x11-repo, termux-x11-nightly, pulseaudio, proot-distro. Idempotent. |
| [adl-install-distro.sh](/downloads/scripts/adl-install-distro.sh) | Termux host | Installs Debian/Ubuntu/Alpine/Arch via proot-distro; refuses to overwrite an existing install. |
| [adl-create-user.sh](/downloads/scripts/adl-create-user.sh) | Inside the distro | Creates a normal (non-root) user with sudo, per distro family. |
| [adl-install-desktop.sh](/downloads/scripts/adl-install-desktop.sh) | Inside the distro | Installs Xfce/MATE/LXQt/Plasma packages + dbus. GNOME intentionally excluded (unsupported under proot). |
| [adl-configure-audio.sh](/downloads/scripts/adl-configure-audio.sh) | Termux host | Starts/stops the localhost-only PulseAudio forwarding server. |
| [adl-create-launcher.sh](/downloads/scripts/adl-create-launcher.sh) | Termux host | Generates `~/start-desktop.sh` from your configuration (backs up any existing one). |
| [adl-doctor.sh](/downloads/scripts/adl-doctor.sh) | Termux host | Diagnoses the whole chain (PASS/WARN/FAIL + next step). `--redact` makes output safe for public issues. Changes nothing. |
| [adl-backup.sh](/downloads/scripts/adl-backup.sh) | Termux host | Snapshots a distro to a restorable archive via `proot-distro backup`. |
| [adl-remove-installation.sh](/downloads/scripts/adl-remove-installation.sh) | Termux host | Scoped removal (launcher / one distro / everything ADL-managed) with typed confirmation and a backup offer. |

Checksums: [SHA256SUMS](pathname:///downloads/scripts/SHA256SUMS) ·
Machine-readable manifest: [manifest.json](/downloads/scripts/manifest.json)

## Download and verify

You may (and should) **read any script before running it** — they are plain
shell. The safe pattern is download → verify → inspect → run:

```bash
cd ~
curl -fLO https://thebpandey.github.io/ADL/downloads/scripts/adl-preflight.sh
curl -fLO https://thebpandey.github.io/ADL/downloads/scripts/SHA256SUMS
sha256sum -c --ignore-missing SHA256SUMS
less adl-preflight.sh    # read it
bash adl-preflight.sh
```

**Expected output:** `adl-preflight.sh: OK` from the checksum step, then the
script's own output.

**Common errors:** `sha256sum: … FAILED` means the download is corrupted or
tampered with — delete it and re-download over a trusted network. `curl: (22)`
means the URL was mistyped.

**Why not `curl | bash`?** Piping straight to a shell executes code you
never saw and skips checksum verification. ADL never recommends it.

## Scripts that run inside the distro

`adl-create-user.sh` and `adl-install-desktop.sh` run **inside** the Linux
distribution. Download them in Termux, then pass them in:

```bash
proot-distro login debian -- bash ~/adl-create-user.sh --username myname
```

(Termux's home directory is visible inside proot sessions started this way.)

## Summary

Optional, inspectable, checksummed automation for each phase — with the
doctor and removal scripts covering diagnosis and clean rollback.

## Next steps

- [Get Started wizard](/get-started) — generates the same steps personalized
- [Symptom index](/docs/troubleshooting/symptom-index) — when something fails
- [Required downloads](/docs/downloads/required) — the apps themselves
