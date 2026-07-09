---
sidebar_position: 2
title: "Termux Setup"
description: "Detailed guide to installing and configuring Termux on Android for the ADL project"
---

# Termux Setup

Termux is a powerful terminal emulator for Android that provides a full Linux environment without requiring root access. ADL uses Termux as the foundation layer — it is the bridge between your Android device and a complete Linux desktop. Every command you run, every package you install, and every Linux distribution you set up flows through Termux.

This guide walks you through each step of installing and configuring Termux in detail. If you want to understand more about what Termux is and how it works under the hood, see the [What is Termux?](/docs/learn/concepts/what-is-termux) concept guide.

<Warning title="Do NOT Use the Play Store Version">
The version of Termux available on the Google Play Store is **outdated and no longer maintained**. It targets an old Android API level, which causes critical failures: packages fail to install, `proot-distro` does not work correctly, and you will encounter cryptic permission errors. Always install Termux from F-Droid. If you already have the Play Store version installed, uninstall it completely before proceeding.
</Warning>

## Step 1: Download F-Droid

F-Droid is an open-source app store for Android. It is the only reliable source for an up-to-date version of Termux.

1. Open your Android device's web browser (Chrome, Firefox, or any browser).
2. Navigate to **https://f-droid.org**.
3. Tap the **Download F-Droid** button on the main page. This downloads an APK file (typically named `F-Droid.apk`).
4. The download is roughly 8-10 MB and should complete in a few seconds on most connections.

<Note title="What is an APK?">
An APK (Android Package Kit) is the file format Android uses to distribute and install apps. Downloading an APK from a website is called "sideloading" — installing an app from outside the Play Store. This is safe when the source is trustworthy, and F-Droid is a well-established, open-source project.
</Note>

## Step 2: Install the F-Droid APK

After the download completes, you need to install the APK. Android has security measures that prevent installation from unknown sources by default.

1. Tap the downloaded `F-Droid.apk` file from your notification bar or file manager.
2. Android will display a prompt saying **"Your phone is not allowed to install unknown apps from this source."**
3. Tap **Settings** when prompted, then enable **"Allow from this source"** for your browser.
4. Go back and tap **Install** to proceed with the installation.
5. Once installed, tap **Open** to launch F-Droid, or find it in your app drawer.

<Tip>
On Android 13 and newer, you may see a slightly different prompt. Look for "Install unknown apps" in your device's Settings under Apps or Security, then enable it for the browser you used to download.
</Tip>

## Step 3: Update F-Droid Repositories

When you first launch F-Droid, it needs to sync its repository index — the catalog of all available apps and their versions.

1. Open F-Droid. On the first launch, you will see a screen that says **"Updating repositories..."** with a progress indicator.
2. This initial sync can take **1-5 minutes** depending on your internet speed. Do not close the app during this process.
3. Once complete, the main screen will populate with app categories and a search bar.

<BestPractice>
Let F-Droid finish its full initial sync before searching for Termux. If you search too early, the app list may be incomplete and Termux might not appear in results.
</BestPractice>

## Step 4: Install Termux from F-Droid

Now that F-Droid is set up, you can install Termux.

1. Tap the **search icon** (magnifying glass) in F-Droid.
2. Type **Termux** in the search field.
3. Look for the result labeled **"Termux - Terminal Emulator"** published by **Fredrik Fornwall**. Confirm the package name is `com.termux`.
4. Tap on the Termux entry, then tap **Install**.
5. F-Droid will download and install Termux. The download is approximately 100-150 MB.
6. After installation, verify the version is **0.118** or newer. Older versions lack critical features ADL depends on.

<CommonMistake title="Mixing Play Store and F-Droid Versions">
If you previously installed Termux from the Play Store and then install the F-Droid version without uninstalling the old one first, Android may block the installation because the two versions are signed with different keys. You will see an error like "App not installed — package conflicts with an existing package." The fix is to **fully uninstall** the Play Store version first, then install from F-Droid. Note that uninstalling removes all Termux data, so back up anything important before doing so.
</CommonMistake>

## Step 5: First Launch Configuration

When you open Termux for the first time, it performs some initial setup automatically.

1. Find and tap the **Termux** icon in your app drawer.
2. On first launch, Termux will display **"Installing bootstrap packages..."** and download its core environment. This takes 30-60 seconds.
3. Once complete, you will see a terminal prompt that looks like:

<ExpectedResult>
A black terminal screen with a blinking cursor and a prompt showing something like `$ ` — this is the Termux shell, ready for commands.
</ExpectedResult>

4. You can now type commands directly into this terminal. Everything from here on is typed into the Termux terminal.

<Note>
Termux uses a touch keyboard by default. You will see an extra row of keys above your keyboard with characters like Tab, Ctrl, and arrow keys. These are essential for terminal work. If you have a physical keyboard connected, Termux works with that as well.
</Note>

## Step 6: Grant Storage Permissions

Termux needs access to your device's shared storage so that files can be exchanged between Termux and Android apps (file managers, galleries, etc.).

Run the following command:

<CopyCommand command="termux-setup-storage" />

When you run this command:

1. Android will display a permission dialog asking **"Allow Termux to access photos, media, and files on your device?"**
2. Tap **Allow**.
3. Termux creates a `~/storage` directory with symlinks to your device's shared storage locations (Downloads, DCIM, Music, etc.).

<ExpectedResult>
After granting permission, you should be able to run `ls ~/storage` and see directories like `dcim`, `downloads`, `movies`, `music`, `pictures`, and `shared`.
</ExpectedResult>

<Warning title="Do Not Skip This Step">
Without storage permissions, you will not be able to transfer files between your Linux desktop environment and Android apps. VNC screenshots, file downloads, and shared documents all depend on this permission being granted.
</Warning>

## Step 7: Update All Packages

Before installing anything else, bring all existing Termux packages up to date. This ensures compatibility and security.

<CopyCommand command="pkg update && pkg upgrade -y" />

This command does two things:

- `pkg update` refreshes the list of available packages from the Termux repositories.
- `pkg upgrade -y` upgrades all installed packages to their latest versions. The `-y` flag automatically answers "yes" to confirmation prompts.

<ExpectedResult>
The terminal will display a series of package download and installation messages. This process typically takes 1-3 minutes. When finished, you will return to the normal `$ ` prompt with no errors.
</ExpectedResult>

<Note title="Repository Mirrors">
During the update, you may be prompted to select a mirror (package download server). If asked, choose a mirror geographically close to you for the best download speeds. The default selection is usually fine.
</Note>

## Step 8: Install Essential Tools

ADL requires two key packages in Termux:

- **proot-distro** — manages Linux distribution installations within Termux (this is how you install Ubuntu).
- **wget** — a command-line download utility used during the ADL setup process.

Install both with a single command:

<CopyCommand command="pkg install proot-distro wget -y" />

<ExpectedResult>
Both packages will be downloaded and installed. You will see confirmation messages for each. The process takes about 30-60 seconds. The prompt returns to `$ ` when complete.
</ExpectedResult>

## Step 9: Verify Installation

Run the following commands one at a time to confirm everything is installed and working correctly.

Check that `proot-distro` is available:

<CopyCommand command="proot-distro --version" />

<ExpectedResult>
A version number is printed, such as `proot-distro 4.x.x`. Any version output confirms the tool is installed.
</ExpectedResult>

Check that `wget` is available:

<CopyCommand command="wget --version" />

<ExpectedResult>
Version and build information for wget is displayed, starting with something like `GNU Wget 1.x.x`.
</ExpectedResult>

List available distributions that proot-distro can install:

<CopyCommand command="proot-distro list" />

<ExpectedResult>
A table listing available Linux distributions, including **Ubuntu**. You should see entries for Ubuntu, Debian, Fedora, Alpine, and others.
</ExpectedResult>

If all three commands produce output without errors, your Termux installation is complete and ready for the next step.

<BestPractice>
Keep Termux updated regularly by running `pkg update && pkg upgrade -y` every week or two. Termux repositories receive frequent updates, and running outdated packages can cause compatibility issues with proot-distro and the Linux distributions it manages.
</BestPractice>

## Troubleshooting

<Troubleshooting items={[
  {
    problem: "F-Droid search returns no results for Termux",
    solution: "F-Droid may not have finished syncing its repository index. Close and reopen F-Droid, wait for the 'Updating repositories' process to complete fully, then search again. If the issue persists, pull down on the main screen to force a manual refresh."
  },
  {
    problem: "pkg update fails with 'Unable to locate package' or repository errors",
    solution: "Run `termux-change-repo` and select a different mirror. The default mirror may be down or unreachable from your location. After switching mirrors, run `pkg update` again."
  },
  {
    problem: "Permission denied errors when running commands",
    solution: "Make sure you are running commands inside the Termux app itself, not in another terminal app. If you recently reinstalled Termux, close and reopen the app. Do not attempt to use `sudo` in Termux — it is not available and not needed."
  },
  {
    problem: "Termux closes or crashes immediately on launch",
    solution: "This is a known issue with the Play Store version on newer Android versions. Uninstall the current Termux installation completely, then install the F-Droid version following this guide from Step 1. If you already have the F-Droid version, try clearing the app data in Android Settings > Apps > Termux > Storage > Clear Data, then relaunch."
  },
  {
    problem: "termux-setup-storage does not show a permission dialog",
    solution: "On some Android versions, the permission may have been previously denied. Go to Android Settings > Apps > Termux > Permissions, and manually enable Storage (or Files and Media) permission. Then run `termux-setup-storage` again."
  },
  {
    problem: "Package installation is extremely slow",
    solution: "The default package mirror may be far from your location. Run `termux-change-repo` to switch to a closer mirror. You can also check your internet connection — Termux uses the same network as your device, so Wi-Fi is recommended for large downloads."
  }
]} />

## Next Step

Your Termux environment is fully configured and ready. The next step is to install Ubuntu Linux inside Termux using proot-distro.

**Continue to [Ubuntu Setup](./ubuntu-setup) to install and configure your Linux distribution.**
