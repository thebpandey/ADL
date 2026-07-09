---
sidebar_position: 4
title: "Development Environment"
description: "Set up a complete development environment in ADL with VS Code, Git, Python, Node.js, SSH, and essential build tools."
---

# Development Environment

ADL gives you a full Ubuntu Linux system running on ARM64 hardware. That means you can run the same development tools that professionals use on desktop Linux workstations. This guide walks you through setting up a complete coding environment from scratch.

<Note title="ARM64 Architecture">
Your Android device uses an ARM (aarch64) processor. Most development tools work without issues, but some software only ships x86 binaries. This guide focuses on tools with native ARM64 support.
</Note>

## VS Code / Code OSS

Visual Studio Code is the most popular code editor for nearly every language. On ARM64 Ubuntu, you have two options for getting it.

### Option A: Code OSS from Ubuntu Repositories

Code OSS is the open-source build of VS Code available directly from `apt`. It lacks some Microsoft-proprietary features (such as the built-in marketplace and certain extensions), but it is the simplest path to a working editor.

<CopyCommand command="apt update && apt install -y code-oss" />

Launch it from the terminal or your application menu:

<CopyCommand command="code-oss" />

### Option B: Official VS Code .deb for ARM64

Microsoft provides an official ARM64 `.deb` package at [code.visualstudio.com](https://code.visualstudio.com). This build includes the full extension marketplace and all proprietary features.

```bash
curl -L -o /tmp/vscode.deb 'https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-arm64'
```

<CopyCommand command="apt install -y /tmp/vscode.deb" />
<CopyCommand command="rm /tmp/vscode.deb" />

Launch with:

<CopyCommand command="code" />

<Warning title="x86 Binaries Will Not Work">
Do not download the standard x86-64 `.deb` from the VS Code site. It will not run on your ARM64 device. Always select the **ARM64** or **aarch64** variant.
</Warning>

<BestPractice>
If you need extensions from the Microsoft marketplace (such as the official Python or C++ extensions), use the official ARM64 `.deb`. If you want a lighter install with no proprietary components, Code OSS is a solid choice.
</BestPractice>

### Recommended Extensions

After installing VS Code, add these extensions to improve your workflow:

- **Python** (ms-python.python) -- language support, linting, debugging
- **GitLens** -- visualize Git blame, history, and branches inline
- **Prettier** -- automatic code formatting for JavaScript, HTML, CSS, JSON
- **Remote - SSH** -- edit files on remote servers directly from VS Code

Install extensions from the terminal:

<CopyCommand command="code --install-extension ms-python.python" />

## Git

Git is the standard version control system. Every developer needs it, regardless of language or project type.

### Install and Configure

<CopyCommand command="apt install -y git" />

Set your identity. These values appear in every commit you create.

```bash
git config --global user.name "Your Name"
```

```bash
git config --global user.email "you@example.com"
```

Set a default branch name and a helpful pull strategy:

<CopyCommand command="git config --global init.defaultBranch main" />
<CopyCommand command="git config --global pull.rebase false" />

Verify your configuration:

<CopyCommand command="git config --list" />

### Basic Git Workflow

Clone a repository, make changes, and push:

<CopyCommand command="git clone https://github.com/username/repo.git" />
<CopyCommand command="cd repo && git checkout -b my-feature" />
<CopyCommand command="git add ." />
```bash
git commit -m "Describe what you changed"
```
<CopyCommand command="git push origin my-feature" />

<BestPractice>
Create a new branch for every feature or bug fix. Work on the branch, then open a pull request to merge it. This keeps your `main` branch stable.
</BestPractice>

For a deeper look at Git commands and workflows, see the [development tools reference](/docs/learn/software/development-tools).

## Python Environment

Python is one of the most beginner-friendly languages and is widely used for scripting, automation, data science, and web development. Ubuntu includes Python by default, but you should install the full toolkit.

### Install Python, pip, and venv

<CopyCommand command="apt install -y python3 python3-pip python3-venv" />

Verify:

<CopyCommand command="python3 --version" />
<CopyCommand command="pip3 --version" />

### Virtual Environments

Virtual environments isolate each project's dependencies so they do not conflict with each other or with system packages.

Create and activate a virtual environment:

<CopyCommand command="python3 -m venv ~/myproject-env" />
<CopyCommand command="source ~/myproject-env/bin/activate" />

Your shell prompt changes to show the active environment. Install packages inside it:

<CopyCommand command="pip install requests flask" />

When you are finished, deactivate:

<CopyCommand command="deactivate" />

<BestPractice>
Never install Python packages globally with `pip install` outside a virtual environment. Global installs can break system tools that depend on specific package versions. Always create a venv first.
</BestPractice>

## Node.js via nvm

Node.js lets you run JavaScript outside the browser. The recommended way to install it is through `nvm` (Node Version Manager), which lets you switch between Node versions per project.

### Install nvm

<CopyCommand command="curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash" />

Reload your shell so the `nvm` command becomes available:

<CopyCommand command="source ~/.bashrc" />

Verify nvm is installed:

<CopyCommand command="nvm --version" />

### Install Node.js

Install the current LTS (Long Term Support) release:

<CopyCommand command="nvm install --lts" />

Verify:

<CopyCommand command="node --version" />
<CopyCommand command="npm --version" />

<Tip>
If you work on multiple projects that require different Node versions, use `nvm install <version>` and `nvm use <version>` to switch between them. Each version is isolated.
</Tip>

### Quick Test

```bash
node -e "console.log('Node.js ' + process.version + ' running on ' + process.arch)"
```

This should print your Node version and `arm64` as the architecture.

## SSH Client and Server

SSH lets you connect securely to remote machines and lets other machines connect to yours.

### SSH Client

The client is what you use to connect to other servers. Install it:

<CopyCommand command="apt install -y openssh-client" />

#### Generate an SSH Key

```bash
ssh-keygen -t ed25519 -C "you@example.com"
```

Press Enter to accept the default file location (`~/.ssh/id_ed25519`). Set a passphrase for extra security, or press Enter for none.

Display your public key:

<CopyCommand command="cat ~/.ssh/id_ed25519.pub" />

Copy this key and add it to services like GitHub (**Settings > SSH and GPG keys**) or to a remote server's `~/.ssh/authorized_keys` file.

Test your GitHub connection:

<CopyCommand command="ssh -T git@github.com" />

#### SSH Config File

Create shortcuts for servers you connect to frequently. Edit `~/.ssh/config`:

```
Host myserver
    HostName 192.168.1.50
    User ubuntu
    IdentityFile ~/.ssh/id_ed25519
```

Then connect with:

<CopyCommand command="ssh myserver" />

### SSH Server

The server component lets other machines connect to your ADL environment. This is useful for editing files remotely with VS Code's Remote SSH extension, or for accessing your device from a laptop on the same network.

<CopyCommand command="apt install -y openssh-server" />

<Note title="No systemctl in proot">
ADL runs inside a proot environment, which does not support `systemctl`. You cannot enable the SSH server to start automatically at boot. Instead, start it manually each session.
</Note>

Start the SSH server:

<CopyCommand command="/usr/sbin/sshd" />

Check that it is running:

<CopyCommand command="ps aux | grep sshd" />

Find your IP address so other devices can connect:

<CopyCommand command="hostname -I" />

<BestPractice>
If you use the SSH server regularly, add `/usr/sbin/sshd` to a startup script or your `.bashrc` file so it launches when you open your terminal.
</BestPractice>

## Additional Tools

Round out your environment with these utilities that many development workflows depend on.

### Build Essentials

Compilers and build tools required by many Python and Node.js packages that include native extensions:

<CopyCommand command="apt install -y build-essential cmake" />

### curl and wget

HTTP clients for downloading files and interacting with APIs from the command line:

<CopyCommand command="apt install -y curl wget" />

### Text Editors

If you prefer working entirely in the terminal, install a terminal-based editor:

<CopyCommand command="apt install -y nano" />

Or for a more powerful (but steeper learning curve) option:

<CopyCommand command="apt install -y vim" />

<Tip>
New to terminal editors? Start with `nano`. It shows keyboard shortcuts at the bottom of the screen. Press `Ctrl+O` to save and `Ctrl+X` to exit.
</Tip>

### Install Everything at Once

If you want the full toolkit in one command:

<CopyCommand command="apt install -y git python3 python3-pip python3-venv build-essential cmake curl wget nano openssh-client openssh-server" />

## Verify Your Setup

Run these commands to confirm all tools are installed and working:

<CopyCommand command="git --version && python3 --version && node --version && npm --version && gcc --version && ssh -V" />

For more development tool details and workflows, see the [development tools reference](/docs/learn/software/development-tools) and the [VS Code guide](/docs/learn/software/vscode).
