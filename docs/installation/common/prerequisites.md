---
sidebar_position: 1
title: "Prerequisites"
description: "Everything you need to check and configure on your Android device before starting the ADL installation."
---

# Prerequisites

Before installing ADL, you need to verify that your Android device meets the requirements and configure a few system settings. This page walks you through every check and setting change, step by step.

Completing these prerequisites takes about **10 minutes** and prevents the most common installation failures.

## What You Need

<Requirements items={[
  "Android 10 or newer",
  "ARM64 (aarch64) processor",
  "Minimum 4GB of free storage (8GB recommended)",
  "Wi-Fi connection for downloading packages",
  "Permission to install apps from outside the Play Store",
]} />

<Note title="Why these requirements?">
ADL runs a full Ubuntu Linux distribution inside a proot container on Termux. Android 10 introduced changes to how apps access storage and manage processes that ADL depends on. Older versions of Android lack the necessary kernel features and SELinux policies for proot to function reliably. The ARM64 requirement exists because the Ubuntu packages ADL installs are compiled for the aarch64 architecture, which is standard on phones and tablets manufactured after 2017.
</Note>

For detailed hardware recommendations, including which phones and tablets work best with ADL, see the [Recommended Hardware Setup](/docs/learn/hardware/recommended-setup).

---

## Step 1: Check Your Android Version

ADL requires **Android 10 or newer**. Here is how to find your version:

1. Open the **Settings** app on your device.
2. Scroll to the bottom and tap **About phone** (or **About tablet**).
3. Look for **Android version**. The number displayed must be **10** or higher.

On Samsung devices, the path is **Settings > About phone > Software information > Android version**. On Pixel devices, it is **Settings > About phone > Android version**.

<ExpectedResult>
You should see a number like 10, 11, 12, 13, 14, or 15. Any of these will work. If you see a number below 10 (such as 8 or 9), your device is not compatible with ADL.
</ExpectedResult>

<Warning title="Android 9 and Below Are Not Supported">
Devices running Android 9 (Pie) or earlier cannot run ADL. The proot environment depends on kernel features and system call behavior introduced in Android 10. If your device is on Android 9, check your manufacturer's website for available system updates before proceeding.
</Warning>

<BestPractice>
Update your device to the latest available Android version before starting the ADL installation. System updates often include kernel patches and security fixes that improve Termux compatibility and overall stability. Go to **Settings > System > System update** (or **Settings > Software update** on Samsung) to check for available updates.
</BestPractice>

---

## Step 2: Check Available Storage

ADL needs storage space for Termux, the Ubuntu filesystem, the XFCE desktop environment, and any applications you install inside Linux.

1. Open the **Settings** app.
2. Tap **Storage** (or **Battery and device care > Storage** on Samsung devices).
3. Look at the amount of free space available.

<ExpectedResult>
You need at least **4GB of free space** to install the base system. The number shown under "Available" or "Free" must be 4GB or greater. If you plan to install development tools, browsers, or other applications inside Linux, aim for **8GB or more** of free space.
</ExpectedResult>

| Installation Type | Storage Needed | What's Included |
|---|---|---|
| Base system | ~4 GB | Ubuntu + XFCE desktop |
| Comfortable setup | ~6 GB | Base + common packages (git, vim, htop) |
| Development environment | ~8-10 GB | Base + build tools, editors, compilers |
| Full workstation | 12+ GB | Development + browsers, IDEs, media tools |

<Tip>
If you are low on storage, clear your app caches before starting. Go to **Settings > Storage > Other apps**, then tap on apps with large caches (social media, streaming, and browser apps are common offenders) and tap **Clear cache**. You can also move photos and videos to cloud storage or a computer to free up space.
</Tip>

---

## Step 3: Check Your Processor Architecture

ADL requires an **ARM64 (aarch64)** processor. Nearly all Android phones and tablets sold since 2017 use ARM64, but it is worth confirming before you begin.

The most reliable way to check is from Termux. If you already have Termux installed, open it and run:

<CopyCommand command="uname -m" />

<ExpectedResult>
The output should be **aarch64**. This confirms your device has a 64-bit ARM processor and is compatible with ADL.
</ExpectedResult>

If you do not have Termux installed yet, you can check using a free app:

1. Install **Device Info HW** from the Google Play Store.
2. Open the app and look for the **CPU Architecture** field.
3. It should say **ARM64** or **aarch64** or **ARMv8**.

<Warning title="32-bit ARM Devices Are Not Compatible">
If `uname -m` outputs **armv7l** or the CPU architecture shows **ARMv7** or **32-bit**, your device cannot run ADL. The Ubuntu packages used by ADL are built exclusively for the 64-bit ARM architecture. There is no workaround for this limitation.
</Warning>

<CommonMistake title="Confusing ARM64 with x86">
Some Android devices, particularly older tablets and emulators, use Intel x86 processors instead of ARM. ADL does not support x86 Android devices. If your device reports **x86** or **x86_64** for the processor type, it is not compatible.
</CommonMistake>

---

## Step 4: Enable Installing from Unknown Sources

ADL requires Termux to be installed from F-Droid rather than the Google Play Store. To install F-Droid, you need to allow your browser to install apps from outside the Play Store.

### Android 10 and newer (per-app permission)

Modern Android versions handle this on a per-app basis. You grant permission to the specific app (your browser) that is downloading the APK:

1. Open **Settings > Apps > Special app access > Install unknown apps** (the exact path varies by manufacturer).
2. Find your browser in the list (Chrome, Samsung Internet, Firefox, etc.).
3. Toggle **Allow from this source** to on.

On Samsung devices, the path is **Settings > Apps > Menu (three dots) > Special access > Install unknown apps**.

On Pixel devices, the path is **Settings > Apps > Special app access > Install unknown apps**.

<ExpectedResult>
After enabling this setting, your browser will be able to install APK files you download. Android will still ask you to confirm each installation. You can disable this setting again after installing F-Droid and Termux if you prefer.
</ExpectedResult>

<BestPractice>
Only enable "Install unknown apps" for your browser, not for all apps. This limits the potential for accidentally installing unwanted software. After you have finished setting up ADL, you can return to this setting and disable it again.
</BestPractice>

---

## Step 5: Disable Battery Optimization for Termux

This is one of the most important steps. Android aggressively kills background processes to save battery. If Termux is killed while your Linux desktop is running, you will lose your session and any unsaved work.

### Disable battery optimization

1. Open **Settings > Apps > Termux** (you will do this after installing Termux, but make a note now).
2. Tap **Battery** (or **App battery usage**).
3. Select **Unrestricted** (or disable **Battery optimization**).

On Samsung devices: **Settings > Apps > Termux > Battery > Unrestricted**.

On Pixel devices: **Settings > Apps > Termux > Battery > Unrestricted**.

On Xiaomi/Redmi devices: **Settings > Apps > Manage apps > Termux > Battery saver > No restrictions**. Also disable **MIUI battery optimization** in **Settings > Battery & performance > Battery optimization**.

<Warning title="Termux Will Be Killed Without This Setting">
If you skip this step, Android will terminate Termux after a few minutes in the background. This means your Linux desktop will stop, any running programs will be interrupted, and unsaved files may be lost. This is the single most common cause of "Termux keeps closing" issues.
</Warning>

### Disable additional battery restrictions (manufacturer-specific)

Some manufacturers add extra layers of battery management on top of stock Android. These must also be disabled for Termux to run reliably.

**Samsung:** Disable "Put unused apps to sleep" and "Auto-disable unused apps" in **Settings > Battery and device care > Battery > Background usage limits**. Also remove Termux from the "Sleeping apps" and "Deep sleeping apps" lists if it appears there.

**Xiaomi/Redmi/POCO:** In addition to the battery saver setting above, go to **Settings > Battery & performance > Battery optimization**, find Termux, and set it to "Don't optimize". Also enable **Autostart** for Termux in **Settings > Apps > Manage apps > Termux > Autostart**.

**OnePlus/Realme:** Go to **Settings > Battery > Battery optimization**, find Termux, and select "Don't optimize". Also check **Settings > Battery > Advanced optimization** and disable "Sleep standby optimization".

**Huawei/Honor:** Go to **Settings > Battery > App launch**, find Termux, disable "Manage automatically", and enable all three toggles (Auto-launch, Secondary launch, Run in background).

<Tip>
If you are unsure which battery settings apply to your device, search your device manufacturer's name along with "keep app running in background" for specific instructions. The website [Don't Kill My App](https://dontkillmyapp.com) has detailed guides for every major Android manufacturer.
</Tip>

---

## Step 6: Lock Termux in Recent Apps

After installing Termux (covered in the next guide), lock it in your recent apps list to prevent Android from closing it when you switch to other apps:

1. Open Termux.
2. Open your recent apps view (swipe up and hold on gesture navigation, or tap the square button on three-button navigation).
3. Find the Termux card in the list.
4. Tap the Termux icon at the top of the card, then select **Lock** (or **Pin** or **Keep open**, depending on your device).

On Samsung devices, tap and hold the Termux icon in the recent apps view and select **Lock this app**.

<ExpectedResult>
A small lock icon should appear on the Termux card in your recent apps. This tells Android not to close Termux when it needs to free memory for other apps.
</ExpectedResult>

---

## Verification Checklist

Before moving on to the Termux installation, confirm all of the following:

<Requirements items={[
  "Android version is 10 or newer",
  "At least 4GB of free storage (8GB recommended)",
  "Processor is ARM64 / aarch64",
  "Browser is allowed to install apps from unknown sources",
  "Battery optimization is disabled for Termux (do this after installing Termux)",
]} />

---

## Troubleshooting

<Troubleshooting items={[
  {
    problem: "Cannot find the 'Install unknown apps' setting",
    solution: "The exact location varies by device. Try searching for 'unknown' or 'install unknown' in the Settings search bar (usually a magnifying glass icon at the top of the Settings app). On some devices it is called 'Install other apps' or 'External sources'."
  },
  {
    problem: "My device is running Android 10 but uname -m shows armv7l",
    solution: "Your device has a 32-bit userspace even though the kernel may be 64-bit. This is common on budget devices with 2GB or less of RAM where manufacturers shipped a 32-bit Android build. Unfortunately, ADL requires a 64-bit (aarch64) environment and cannot run on your device."
  },
  {
    problem: "My phone has enough storage but installation still fails with 'No space left on device'",
    solution: "Android partitions storage into sections. The internal storage shown in Settings may not reflect the space available to Termux. Try clearing app caches, uninstalling unused apps, and restarting your device. Also ensure you are not trying to install onto an SD card --- Termux must use internal storage."
  },
  {
    problem: "I have a Chromebook or Chrome OS device",
    solution: "Chromebooks have a Linux development environment built in (Crostini) which is a better option than Termux. ADL's Termux-based approach is designed for Android phones and tablets. For Chromebooks, enable Linux in Settings > Advanced > Developers > Linux development environment."
  },
  {
    problem: "Termux keeps getting killed in the background despite disabling battery optimization",
    solution: "Some manufacturers have multiple layers of battery management. Check the manufacturer-specific instructions in Step 5 above. As a last resort, you can use an ADB command from a computer to fully disable battery restrictions: connect via USB, enable USB debugging, and run 'adb shell dumpsys deviceidle whitelist +com.termux'. See dontkillmyapp.com for your specific device brand."
  },
  {
    problem: "I am not sure if my device is compatible",
    solution: "If your device runs Android 10 or newer and was manufactured after 2017, it is almost certainly compatible. The only common exceptions are devices with x86 processors (rare) and budget devices shipped with 32-bit Android. Install Termux and run 'uname -m' to confirm aarch64 before continuing."
  }
]} />

---

## Next Step

Once you have confirmed all prerequisites, proceed to install Termux:

**[Install Termux →](/docs/installation/common/termux-setup)**
