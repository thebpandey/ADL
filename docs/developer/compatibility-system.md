---
sidebar_position: 2
title: "Compatibility System"
description: "Data schemas, components, and workflows behind the ADL compatibility database."
---

# Compatibility System

The compatibility database turns ADL from documentation into a knowledge
platform. Everything is static JSON plus React components — no backend, no
external services, fully GitHub Pages compatible.

## Architecture

```
data/                          # source of truth (edit these)
  devices.json                 # Android devices
  hardware.json                # docks, monitors, storage, input, power
  desktop-environments.json    # XFCE, LXQt, KDE, GNOME, MATE, Cinnamon
  linux-distributions.json     # Ubuntu, Debian, Arch, Fedora, Alpine
  android-versions.json        # per-version support notes
  compatibility-matrix.json    # per-device capability columns
  test-results.json            # individual test reports
  verified-configurations.json # full verified setups (Part 5 pages)

src/types/compatibility.ts     # TypeScript interfaces for every schema
src/components/Compatibility/  # all components below
static/data/*.json             # published copies (generated at build)
```

The build hook (`npm run docs:index`, run automatically before every build
and dev start) copies `data/*.json` into `static/data/`, so the database is
also served raw at `/ADL/data/<file>.json` — the machine-readable interface
for tooling and future AI assistants, alongside `/ADL/ai-metadata.json`.

## Data schemas

Every file is typed in `src/types/compatibility.ts`. The two vocabularies
everything shares:

- **Support levels** (`SupportLevel`): `fully-supported`, `supported`,
  `partial`, `experimental`, `broken`, `untested`
- **Verification levels** (`VerificationLevel`): `maintainer-verified`,
  `community-verified`, `experimental`, `needs-testing`, `deprecated`

Any verified claim can carry `VersionInfo`: Android version, Linux version,
desktop version, documentation version, and verification date.

**Honesty rule:** never record a status above what was actually tested.
Manufacturer-spec claims stay at `needs-testing`.

## Component reference

All globally registered for MDX — no imports needed in docs pages.

| Component | Use |
|---|---|
| `<CompatibilityMatrix />` | The searchable device matrix (search, manufacturer, Android, RAM, status filters) |
| `<DeviceCard id="..." />` / `<DeviceCardGrid />` | One device / all devices from devices.json |
| `<HardwareEntryCard id="..." />` | One hardware item |
| `<HardwareDatabase category="input" />` | Searchable hardware list; omit `category` for chip filters |
| `<CompatibilityCard label status detail />` | One capability with a status badge |
| `<TestStatusBadge status="..." compact />` | Any support or verification level as a badge |
| `<VersionCard version={{...}} />` | Version-tracking block |
| `<VerifiedConfiguration id="..." />` | Full Part-5 configuration page body |
| `<HardwareRequirements ids={[...]} />` | Named hardware list for a configuration |
| `<DistroProfile id="ubuntu" />` | Full distribution page body |
| `<DesktopEnvProfile id="xfce" />` | Full desktop-environment page body |
| `<AndroidVersionList />` | All Android versions with statuses |

## Adding a new device

1. Add the device to `data/devices.json` (see the `Device` interface).
2. Add its row to `data/compatibility-matrix.json` — one status per column,
   `untested` for anything unknown.
3. Optional: add a test report to `data/test-results.json`.
4. Optional: for a fully verified setup, add an entry to
   `data/verified-configurations.json` and create a page from the
   [device page template](/docs/compatibility/templates/device-page-template).
5. Run `npm run build` — the matrix, cards, and static data files update
   automatically.

## Adding new hardware

Add an entry to `data/hardware.json`. Describe hardware **classes by their
specs** (e.g. "USB-C hub with HDMI + 45W PD") rather than store listings, and
use `worksWith` to reference tested device ids.

## Verification workflow

1. Community reports arrive as pull requests editing the JSON files (or as
   device-support issues that a maintainer transcribes).
2. New claims enter as `community-verified` (tested by the reporter) or
   `needs-testing` (spec-based).
3. The maintainer promotes entries to `maintainer-verified` after
   reproducing them on reference hardware, filling in `VersionInfo`.
4. Anything that stops working is downgraded, never deleted — history
   stays in `test-results.json`.

## Contributor workflow

The reader-facing guide is [Submit a test](/docs/compatibility/submit-a-test).
It covers device tests, hardware tests, compatibility updates, screenshots,
and benchmarks.

## Frontmatter extensions

Doc pages may declare compatibility metadata, which flows into the docs
index and `ai-metadata.json`:

```yaml
device: "Samsung Galaxy S22+"
android_version: "Android 16"
linux_distribution: "Ubuntu 24.04"
desktop_environment: "XFCE 4.18"
verified: true
verification_date: "2026-07-10"
maintainer: "thebpandey"
community_verified: false
compatibility_level: "fully-supported"
```

## Future extension points

- `/ADL/data/*.json` — the raw database, stable ids, versioned by git
- `/ADL/ai-metadata.json` — page + command + compatibility metadata with an
  `interfaces` map documenting where everything lives
- Adding a device/distro/DE requires **zero component changes** — data only
- The matrix columns and filter vocabularies are single arrays, easy to
  extend when new capabilities matter (e.g. GPU acceleration)
