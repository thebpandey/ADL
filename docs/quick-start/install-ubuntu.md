---
sidebar_position: 3
title: "Install Ubuntu"
description: "Installing Ubuntu via proot-distro"
estimated_time: "10 minutes"
difficulty: "Beginner"
---

# Install Ubuntu

Now that Termux is set up, install a full Ubuntu Linux distribution inside it using proot-distro.

## Step 1: Install proot-distro

<CopyCommand command="pkg install proot-distro" />

<ExpectedResult>
Termux will download and install the proot-distro package. You'll see download progress and a confirmation message. The process takes about 30 seconds.
</ExpectedResult>

## Step 2: Install Ubuntu

<CopyCommand command="proot-distro install ubuntu" />

<ExpectedResult>
This downloads the Ubuntu root filesystem (approximately 500MB). You'll see a download progress bar. The entire process takes 3-5 minutes on a typical Wi-Fi connection. When complete, you'll see a message confirming the distribution was installed.
</ExpectedResult>

<Tip>
If the download seems slow, make sure you're on Wi-Fi rather than mobile data. The Ubuntu filesystem is a large download.
</Tip>

## Step 3: Log into Ubuntu

<CopyCommand command="proot-distro login ubuntu" />

<ExpectedResult>
Your prompt will change from the Termux `$` prompt to a `root@localhost:~#` prompt. You are now inside a full Ubuntu environment. You can run standard Linux commands like `ls`, `cat`, and `apt`.
</ExpectedResult>

## Step 4: Update Ubuntu packages

<CopyCommand command="apt update && apt upgrade -y" />

<ExpectedResult>
Ubuntu will download its package lists and apply any available upgrades. This takes 2-3 minutes. You'll see repository fetching progress and package installation output. When finished, you'll be back at the root prompt with no errors.
</ExpectedResult>

<BestPractice>
Always run `apt update && apt upgrade -y` after a fresh Ubuntu install to ensure you have the latest security patches and package versions.
</BestPractice>

<Note title="Learn more">
Want to understand how proot works and why you don't need root access? See [What is proot?](/docs/learn/concepts/what-is-proot) in the Learn track.
</Note>

<Note title="Learn more">
Learn more about why Ubuntu was chosen and what alternatives exist in [What is Ubuntu?](/docs/learn/concepts/what-is-ubuntu).
</Note>

<Troubleshooting items={[
  {
    problem: "\"proot-distro: command not found\"",
    solution: "Make sure you ran the install command in Termux, not inside another environment. Run pkg install proot-distro again. If it still fails, run pkg update first to refresh your package list, then try the install again."
  },
  {
    problem: "Download interrupted or incomplete",
    solution: "If the Ubuntu download was interrupted, run proot-distro remove ubuntu to clean up the partial install, then run proot-distro install ubuntu again. Make sure you have a stable Wi-Fi connection before retrying."
  },
  {
    problem: "apt update fails with connection errors",
    solution: "This usually means DNS resolution is not working inside proot. Exit Ubuntu by typing exit, then log back in with proot-distro login ubuntu. If the problem persists, check that your phone's Wi-Fi connection is active and try again."
  }
]} />

## Next Step

Continue to [Install Desktop Environment](/docs/quick-start/install-desktop).
