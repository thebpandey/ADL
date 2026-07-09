---
sidebar_position: 1
title: "Supported Devices"
description: "Device compatibility reference for ADL, including tested devices and system requirements."
---

# Supported Devices

ADL targets Android devices with ARM64 processors running Android 10 or later. This page lists system requirements, tested devices, and known compatibility issues.

## System Requirements

A device is compatible with ADL if it meets all of the following:

| Requirement | Minimum | Recommended |
|---|---|---|
| Android version | 10 (API 29) | 13+ (API 33+) |
| Processor architecture | ARM64 (aarch64) | ARM64 (aarch64) |
| RAM | 4 GB | 8 GB+ |
| Free storage | 4 GB | 10 GB+ |
| Root access | Not required | Not required |

<Note title="32-bit devices are not supported">
ADL requires a 64-bit ARM (aarch64) processor. Devices with 32-bit-only ARM chips (armeabi-v7a) cannot run the Linux userspace layer.
</Note>

## Primary Development Device

ADL is developed and tested primarily on a **Samsung Galaxy S22+** with the Snapdragon 8 Gen 1 chipset. This device has full support and receives the most testing across all features, including Samsung DeX integration, Termux-based workflows, and display output.

## Samsung Devices

Samsung devices generally offer the best ADL experience due to DeX support and consistent ARM64 hardware across the lineup.

<Compatibility items={[
  { name: "Galaxy S24 Ultra", status: "full", notes: "Snapdragon 8 Gen 3. DeX supported." },
  { name: "Galaxy S24", status: "full", notes: "Snapdragon 8 Gen 3. DeX supported." },
  { name: "Galaxy S23 Ultra", status: "full", notes: "Snapdragon 8 Gen 2. DeX supported." },
  { name: "Galaxy S23", status: "full", notes: "Snapdragon 8 Gen 2. DeX supported." },
  { name: "Galaxy S22 Ultra", status: "full", notes: "Snapdragon 8 Gen 1. DeX supported." },
  { name: "Galaxy S22+", status: "full", notes: "Primary development device. Snapdragon 8 Gen 1. DeX supported." },
  { name: "Galaxy S22", status: "full", notes: "Snapdragon 8 Gen 1. DeX supported." },
  { name: "Galaxy S21 series", status: "full", notes: "Snapdragon 888 / Exynos 2100. DeX supported." },
  { name: "Galaxy Z Fold 5", status: "full", notes: "DeX supported. Large inner display works well for desktop use." },
  { name: "Galaxy Z Fold 4", status: "full", notes: "DeX supported." },
  { name: "Galaxy Z Fold 3", status: "full", notes: "DeX supported." },
  { name: "Galaxy Z Flip 5", status: "full", notes: "DeX supported. Smaller display than Fold series." },
  { name: "Galaxy Z Flip 4", status: "full", notes: "DeX supported." },
  { name: "Galaxy Tab S9 series", status: "full", notes: "DeX supported. Tablet form factor suits desktop workflows." },
  { name: "Galaxy Tab S8 series", status: "full", notes: "DeX supported." },
  { name: "Galaxy Tab S7 series", status: "full", notes: "DeX supported." },
  { name: "Galaxy A54", status: "partial", notes: "No DeX. Limited RAM on base model may constrain heavier workloads." },
  { name: "Galaxy A53", status: "partial", notes: "No DeX. Exynos 1280; adequate for basic usage." }
]} />

<Tip title="Samsung DeX">
Flagship Samsung devices (S-series, Z-series, Tab S-series) support DeX, which provides a desktop-style windowed environment. ADL integrates with DeX for an experience closer to a traditional Linux desktop. See the DeX Compatibility section below.
</Tip>

## Google Pixel Devices

Pixel devices run stock Android and are well-supported. They lack DeX-style desktop modes but are otherwise fully functional.

<Compatibility items={[
  { name: "Pixel 8 Pro", status: "full", notes: "Tensor G3. Reliable performance." },
  { name: "Pixel 8", status: "full", notes: "Tensor G3." },
  { name: "Pixel 7 Pro", status: "full", notes: "Tensor G2." },
  { name: "Pixel 7", status: "full", notes: "Tensor G2." },
  { name: "Pixel 6 Pro", status: "full", notes: "Tensor G1." },
  { name: "Pixel 6", status: "full", notes: "Tensor G1." },
  { name: "Pixel 5", status: "partial", notes: "Snapdragon 765G. Only 8 GB RAM. Older chipset may limit performance under heavy workloads." }
]} />

## OnePlus Devices

<Compatibility items={[
  { name: "OnePlus 12", status: "full", notes: "Snapdragon 8 Gen 3. 12-16 GB RAM." },
  { name: "OnePlus 11", status: "full", notes: "Snapdragon 8 Gen 2." },
  { name: "OnePlus 10 Pro", status: "full", notes: "Snapdragon 8 Gen 1." },
  { name: "OnePlus 9 Pro", status: "full", notes: "Snapdragon 888." },
  { name: "OnePlus Nord N30", status: "partial", notes: "Snapdragon 695. 8 GB RAM. Adequate for lighter workloads." },
  { name: "OnePlus Nord CE 3", status: "partial", notes: "Dimensity 9000. Functional but not extensively tested." }
]} />

## Other Manufacturers

These devices have limited or no testing. They may work if they meet the system requirements above, but expect potential rough edges.

<Compatibility items={[
  { name: "Xiaomi 14", status: "untested", notes: "Snapdragon 8 Gen 3. Expected to work based on specs." },
  { name: "Xiaomi 13", status: "untested", notes: "Snapdragon 8 Gen 2. Expected to work based on specs." },
  { name: "Motorola Edge 40 Pro", status: "partial", notes: "Snapdragon 8 Gen 2. Basic testing only." },
  { name: "Nothing Phone 2", status: "untested", notes: "Snapdragon 8+ Gen 1. Expected to work." },
  { name: "Sony Xperia 1 V", status: "untested", notes: "Snapdragon 8 Gen 2. Not tested." }
]} />

<Warning title="MIUI and custom Android skins">
Some manufacturers apply aggressive background process restrictions that may interfere with ADL's Linux userspace. Xiaomi's MIUI in particular may require disabling battery optimization and enabling autostart for Termux and related apps.
</Warning>

## Samsung DeX Compatibility

Samsung DeX transforms the phone or tablet UI into a desktop-like windowed environment when connected to an external display (or activated on-device on tablets). ADL benefits from DeX in several ways:

- **Windowed mode** -- run terminal sessions and GUI applications in resizable windows
- **External display output** -- use a monitor, keyboard, and mouse for a full desktop workflow
- **Multi-window multitasking** -- run ADL alongside Android apps side by side

DeX is available on the following device families:

- Galaxy S20 and later (S20, S21, S22, S23, S24 series)
- Galaxy Z Fold series (Fold 2 and later)
- Galaxy Z Flip series (Flip 3 and later)
- Galaxy Tab S7 and later
- Galaxy Note 20 series

<BestPractice>
For the best ADL desktop experience, use a DeX-capable Samsung device with an external display, keyboard, and mouse. The Galaxy Tab S9 series is particularly well-suited due to its large screen and native DeX support without an external display.
</BestPractice>

## Devices Known NOT to Work

The following categories of devices are incompatible with ADL:

- **32-bit ARM devices** -- ADL requires aarch64. Older devices with 32-bit-only processors (common in pre-2017 budget phones) cannot run the Linux userspace.
- **Android versions below 10** -- API level 29 is the minimum. Devices stuck on Android 9 or earlier lack required system APIs.
- **Huawei/Honor devices with HMS only** -- Devices that ship without Google Play Services and rely exclusively on Huawei Mobile Services may have restricted app installation and missing system components that ADL depends on. Some newer Honor devices with GMS restored may work.
- **Devices with locked-down app installation** -- Enterprise-managed devices or heavily restricted OEM builds that prevent sideloading or Termux installation are incompatible.
- **x86/x86_64 Android devices** -- Rare, but some tablets and Chromebooks run Android on x86 hardware. ADL's Linux packages target ARM64 only.

## How to Check Your Device

Run through these checks to determine whether your device can run ADL.

<CollapsibleSection title="Step-by-step device check">

**1. Check your Android version**

Go to **Settings > About phone** (or **About tablet**). Look for the **Android version** field. You need Android 10 or higher.

**2. Check your processor architecture**

Install [Termux](https://f-droid.org/en/packages/com.termux/) and run:

```bash
uname -m
```

The output must be `aarch64`. If it says `armv7l` or `armv8l`, your device has a 32-bit userspace and is not compatible.

**3. Check your RAM**

Go to **Settings > About phone > RAM**, or run in Termux:

```bash
free -h
```

You need at least 4 GB total. 8 GB or more is recommended for a comfortable experience.

**4. Check your available storage**

In Termux, run:

```bash
df -h ~
```

You need at least 4 GB free. 10 GB or more is recommended to accommodate packages and project files.

</CollapsibleSection>

<Note>
If your device meets all four requirements but is not listed on this page, it will likely work. Open an issue on the ADL repository to report your results and help expand the compatibility list.
</Note>
