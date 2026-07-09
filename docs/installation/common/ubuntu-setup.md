---
sidebar_position: 3
title: "Ubuntu Setup"
description: "Installing and configuring Ubuntu via proot-distro on your Android device for the ADL project."
---

# Ubuntu Setup

Ubuntu is the foundation of your ADL desktop environment. In this guide, you will install a full Ubuntu userspace on your Android device using proot-distro, a lightweight tool that runs Linux distributions without root access or device modifications.

If you are unfamiliar with Ubuntu or proot, you can read more about them in our concept guides:

- [What is Ubuntu?](/docs/learn/concepts/what-is-ubuntu) --- an overview of the Ubuntu distribution and why it is well-suited for ADL.
- [What is proot?](/docs/learn/concepts/what-is-proot) --- how proot-distro creates a Linux environment on Android without root.

## Why Ubuntu?

Ubuntu is the most widely supported Linux distribution. The vast majority of tutorials, packages, and community answers you find online assume Ubuntu, which means troubleshooting is straightforward. The `apt` package manager gives you access to tens of thousands of pre-built packages, so you can install desktop environments, development tools, and applications with a single command.

proot-distro handles the heavy lifting: it downloads an official Ubuntu rootfs, configures it for use inside Termux, and provides a `login` command that drops you into a fully functional Ubuntu shell. No rooting, no custom kernels, no risk of bricking your device.

---

## Step 1: Install Ubuntu

Run the following command inside Termux to download and install the Ubuntu distribution:

<CopyCommand command="proot-distro install ubuntu" />

This will download the Ubuntu rootfs archive and extract it into proot-distro's managed directory. The download size is typically around 30--50 MB, but the extracted filesystem will use approximately 200--400 MB of storage.

<ExpectedResult>
You should see download progress followed by extraction output. The final line will confirm that the distribution has been installed, similar to:

```
Distribution ubuntu was successfully installed.
```

</ExpectedResult>

<Note>
The installation only needs to be done once. After it completes, the Ubuntu filesystem persists across Termux sessions. You can remove it later with `proot-distro remove ubuntu` if you ever need to start fresh.
</Note>

---

## Step 2: First Login

Log in to your newly installed Ubuntu environment:

<CopyCommand command="proot-distro login ubuntu" />

<ExpectedResult>
Your shell prompt will change from the Termux prompt to something like:

```
root@localhost:~#
```

This indicates you are now inside the Ubuntu environment, logged in as the root user. The hostname `localhost` is the default.
</ExpectedResult>

Notice the prompt change. You were previously in Termux (which runs a minimal Android-native Linux environment). Now you are inside a full Ubuntu userspace. Commands you run from this point forward execute within Ubuntu, with access to Ubuntu's package manager and filesystem layout.

<Tip>
To return to Termux at any time, type `exit` or press `Ctrl+D`. Your Ubuntu installation remains intact and you can log back in with `proot-distro login ubuntu` whenever you want.
</Tip>

---

## Step 3: System Update

Before installing anything, update the package lists and upgrade any pre-installed packages to their latest versions:

<CopyCommand command="apt update && apt upgrade -y" />

The `apt update` command refreshes the list of available packages from Ubuntu's repositories. The `apt upgrade -y` command installs newer versions of any packages that are already present. The `-y` flag automatically confirms the upgrade so you do not have to type "yes" for each package.

<ExpectedResult>
You will see output showing package lists being fetched from Ubuntu archive mirrors, followed by a list of packages being upgraded (if any). It ends with something like:

```
Reading package lists... Done
Building dependency tree... Done
X upgraded, Y newly installed, 0 to remove and 0 not upgraded.
```

</ExpectedResult>

<BestPractice>
Run `apt update && apt upgrade -y` regularly --- at least once a week, or whenever you install new software. Keeping your system updated ensures you have the latest security patches and bug fixes. Outdated packages can cause compatibility issues with newly installed software.
</BestPractice>

---

## Step 4: Install Essential Packages

Install the core utilities that you will need throughout the rest of the ADL setup:

<CopyCommand command="apt install sudo nano wget curl git -y" />

Here is what each package provides:

| Package | Purpose |
|---------|---------|
| **sudo** | Run commands with elevated privileges. Required if you create a non-root user account later. |
| **nano** | A simple, beginner-friendly text editor for editing configuration files from the terminal. |
| **wget** | Download files from the internet via the command line. Used by many installation scripts. |
| **curl** | Transfer data to and from servers. Similar to wget but also supports uploading and API requests. |
| **git** | Version control system. Essential for cloning repositories, including ADL itself. |

<ExpectedResult>
The output will show each package being downloaded and installed. It concludes with a summary of how many packages were installed:

```
Setting up git (1:2.xx.x-xubuntuX) ...
Setting up sudo (1.x.xxpX-xubuntuX) ...
```

No errors should appear.
</ExpectedResult>

<Note>
Some of these packages may already be present in the base Ubuntu image. `apt install` will simply skip anything that is already installed at the latest version.
</Note>

---

## Step 5: Create a User Account (Optional)

By default, proot-distro logs you in as root. For single-user setups, this is perfectly fine and simplifies the workflow. However, if you plan to share the environment with others or want to follow Linux security best practices, creating a dedicated user account is recommended.

### Why use a non-root user?

Running as root means every command has unrestricted access to the entire system. A mistyped `rm` command could delete critical files. A non-root user provides a safety net: destructive operations require an explicit `sudo` prefix, giving you a moment to reconsider.

### Create the user

Replace `yourname` with your preferred username:

<CopyCommand command="adduser yourname" />

<ExpectedResult>
You will be prompted to set a password and fill in optional user information (full name, room number, etc.). You can press Enter to skip the optional fields. The output ends with:

```
Is the information correct? [Y/n]
```

Type `Y` and press Enter.
</ExpectedResult>

### Grant sudo privileges

Add the new user to the sudo group so they can run administrative commands:

<CopyCommand command="usermod -aG sudo yourname" />

### Switch to the new user

<CopyCommand command="su - yourname" />

<ExpectedResult>
Your prompt changes to reflect the new username:

```
yourname@localhost:~$
```

Notice the `$` instead of `#` --- this indicates a normal user rather than root.
</ExpectedResult>

<Tip>
To log in directly as your new user in future sessions, use:

```
proot-distro login ubuntu --user yourname
```

</Tip>

---

## Step 6: Configure Locale

Locale settings control the language, character encoding, and formatting conventions used by your system. Configuring the locale correctly prevents character rendering issues in terminal applications and desktop environments.

### Install the locales package

<CopyCommand command="apt install locales -y" />

### Generate your locale

For most users, the `en_US.UTF-8` locale is the best choice. It provides full Unicode support, which means international characters, emoji, and special symbols will all display correctly.

<CopyCommand command="sed -i 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && locale-gen" />

<ExpectedResult>
You should see output confirming that the locale was generated:

```
Generating locales (this might take a while)...
  en_US.UTF-8... done
Generation complete.
```

</ExpectedResult>

### Set the locale as default

<CopyCommand command="echo 'LANG=en_US.UTF-8' > /etc/default/locale" />

<Note>
If you need a different locale (for example, `de_DE.UTF-8` for German or `ja_JP.UTF-8` for Japanese), replace `en_US.UTF-8` in the commands above with your preferred locale. You can view all available locales by running `cat /etc/locale.gen | grep -v '#'`.
</Note>

<Warning title="Desktop environments require a valid locale">
If you skip this step, you may encounter garbled text, missing characters, or outright crashes when you install a desktop environment in the next guide. Always configure your locale before proceeding.
</Warning>

---

## Verification

Before moving on, verify that your Ubuntu environment is configured correctly by running these checks.

### Check Ubuntu version

<CopyCommand command="cat /etc/os-release | grep -E 'PRETTY_NAME|VERSION'" />

<ExpectedResult>
Output showing Ubuntu version information, for example:

```
PRETTY_NAME="Ubuntu 24.04.x LTS"
VERSION="24.04.x LTS (Noble Numbat)"
VERSION_ID="24.04"
VERSION_CODENAME=noble
```

</ExpectedResult>

### Check installed packages

<CopyCommand command="which sudo nano wget curl git" />

<ExpectedResult>
Each tool should return a path, confirming it is installed:

```
/usr/bin/sudo
/usr/bin/nano
/usr/bin/wget
/usr/bin/curl
/usr/bin/git
```

</ExpectedResult>

### Check locale

<CopyCommand command="locale" />

<ExpectedResult>
The output should show `en_US.UTF-8` (or your chosen locale) for the `LANG` variable:

```
LANG=en_US.UTF-8
```

</ExpectedResult>

### Check network connectivity

<CopyCommand command="curl -s -o /dev/null -w '%{http_code}' https://archive.ubuntu.com" />

<ExpectedResult>
The output should be `200`, indicating that your Ubuntu environment can reach the Ubuntu package archives. If you see a different code, check your device's internet connection.
</ExpectedResult>

---

## Troubleshooting

<Troubleshooting items={[
  {
    problem: "proot-distro install ubuntu fails with a download error",
    solution: "Check your internet connection and try again. If you are behind a restrictive network, try switching to mobile data or a different Wi-Fi network. You can also try running `pkg update` in Termux first to ensure proot-distro itself is up to date."
  },
  {
    problem: "apt update shows 'Release file not valid yet' or GPG errors",
    solution: "This usually means your device's clock is incorrect. Go to your Android Settings > Date & Time and enable automatic date and time. Then log out of Ubuntu with `exit`, log back in, and try `apt update` again."
  },
  {
    problem: "locale-gen command not found or locale errors persist",
    solution: "Make sure you installed the locales package with `apt install locales -y`. If the issue persists, try running `dpkg-reconfigure locales` and selecting en_US.UTF-8 from the interactive menu."
  },
  {
    problem: "Permission denied errors when running commands as a non-root user",
    solution: "Prefix the command with `sudo`. If sudo itself fails, log back in as root with `proot-distro login ubuntu` and verify the user is in the sudo group by running `groups yourname`. The output should include 'sudo'. If not, run `usermod -aG sudo yourname` as root."
  },
  {
    problem: "apt install hangs or is extremely slow",
    solution: "Ubuntu's default mirrors may be slow depending on your geographic location. You can switch to a faster mirror by editing /etc/apt/sources.list, or you can wait --- proot I/O is slower than native Linux, so large installations naturally take longer. Avoid closing Termux while apt is running, as this can corrupt your package database."
  }
]} />

---

## Next Step

Your Ubuntu environment is installed and ready. In the next guide, you will install a desktop environment and configure a VNC server so you can interact with Ubuntu through a graphical interface.

**[Continue to Desktop Setup &rarr;](desktop-setup)**
