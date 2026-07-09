---
sidebar_position: 2
title: "Install Termux"
description: "Installing Termux from F-Droid for use with ADL on Android."
custom_fields:
  estimated_time: "10 minutes"
  difficulty: "Beginner"
---

# Install Termux

Termux is a terminal emulator for Android that gives you a Linux environment on your phone. In this step, you will install Termux from F-Droid.

<Warning title="Do Not Use Google Play Store">
The Play Store version of Termux is outdated and no longer maintained. It will not work correctly with ADL. Always install Termux from F-Droid to get the latest version with all required features.
</Warning>

## Step 1: Download F-Droid

1. Go to [https://f-droid.org](https://f-droid.org) in your phone's browser.
2. Tap **"Download F-Droid"** to get the APK.
3. You may need to allow installs from unknown sources in Android settings.

## Step 2: Install F-Droid

1. Open the downloaded APK.
2. Follow Android's install prompts.
3. Open F-Droid and let it update its repository list (this takes a minute on first launch).

## Step 3: Install Termux from F-Droid

1. Search **"Termux"** in F-Droid.
2. Install **Termux** (by Fredrik Fornwall).
3. Open Termux.

<CommonMistake title="Installing Termux from Play Store">
If you already have Termux from the Play Store, uninstall it first, then install the F-Droid version. The two versions are not compatible and cannot be used side by side.
</CommonMistake>

## Step 4: Grant Storage Permission

Run the following command to grant Termux access to your device storage:

<CopyCommand command="termux-setup-storage" />

<ExpectedResult>
Android will show a permission dialog asking to allow Termux to access your files. Tap "Allow". You should then see a ~/storage directory appear in Termux.
</ExpectedResult>

## Step 5: Update Packages

Update all installed packages to their latest versions:

<CopyCommand command="pkg update && pkg upgrade -y" />

<ExpectedResult>
Termux will download and install the latest package lists and upgrades. This may take 2-3 minutes depending on your connection. When finished, you'll see the Termux prompt again with no errors.
</ExpectedResult>

<Tip>
If you see prompts asking about configuration file changes during the upgrade, press Y and Enter to accept the new versions.
</Tip>

<Note>
Want to understand what Termux is and how it works? See [What is Termux?](/docs/learn/concepts/what-is-termux) in the Learn track.
</Note>

## Troubleshooting

<Troubleshooting items={[
  {
    problem: "\"App not installed\" error when installing F-Droid",
    solution: "Your phone may be blocking installs from unknown sources. Go to Settings > Security (or Settings > Apps > Special access) and enable 'Install unknown apps' for your browser. On newer Android versions, you'll be prompted automatically when opening the APK."
  },
  {
    problem: "Storage permission denied or ~/storage not created",
    solution: "Go to your Android Settings > Apps > Termux > Permissions and manually enable Storage permission. Then run termux-setup-storage again. If the ~/storage directory still doesn't appear, try closing Termux completely and reopening it."
  },
  {
    problem: "pkg update fails with repository errors",
    solution: "Run termux-change-repo to switch to a different mirror. Select the default repositories, then choose a mirror geographically close to you. After changing the mirror, run pkg update && pkg upgrade -y again."
  }
]} />

## Next Step

With Termux installed and updated, proceed to [Install Ubuntu](/docs/quick-start/install-ubuntu) to set up a full Linux environment inside Termux.
