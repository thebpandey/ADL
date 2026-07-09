---
sidebar_position: 6
title: "Development Tools"
description: "Setting up Git, Python, Node.js, SSH, and other development tools inside your ADL Ubuntu environment."
---

# Development Tools

Your ADL Ubuntu environment is a full Linux system, which means you have access to the same development tools used in professional software engineering. This guide walks you through installing and configuring the essential tools you need to write code, manage projects, and connect to remote systems.

<Note title="Package Manager First">
Most tools are installed through `apt`, Ubuntu's package manager. Always update your package lists before installing anything new.
</Note>

<CopyCommand command="sudo apt update && sudo apt upgrade -y" />

## Package Management with apt

The `apt` package manager is your primary way to install software on Ubuntu. Before installing any development tools, make sure your package lists are current.

<CopyCommand command="sudo apt update" />

Search for available packages:

<CopyCommand command="apt search <package-name>" />

Install a package:

<CopyCommand command="sudo apt install -y <package-name>" />

Remove a package:

<CopyCommand command="sudo apt remove <package-name>" />

<BestPractice>
Run `sudo apt update` before installing new packages. Stale package lists can cause installation failures or install outdated versions.
</BestPractice>

## Build Essentials

Many development workflows require a C/C++ compiler, `make`, and related build tools. The `build-essential` package bundles everything you need.

<CopyCommand command="sudo apt install -y build-essential cmake" />

Verify the installation:

<CopyCommand command="gcc --version" />

<ExpectedResult>
gcc (Ubuntu 13.x.x) 13.x.x or similar version output.
</ExpectedResult>

<CopyCommand command="make --version" />
<CopyCommand command="cmake --version" />

<Tip>
You need `build-essential` even if you do not write C code. Many Python and Node.js packages include native extensions that require a C compiler during installation.
</Tip>

## Git

Git is the standard version control system. Install it, configure your identity, and optionally set up SSH access to GitHub.

### Installation and Configuration

<CopyCommand command="sudo apt install -y git" />

Set your name and email. These appear in every commit you make.

```bash
git config --global user.name "Your Name"
```
```bash
git config --global user.email "your.email@example.com"
```

Verify your configuration:

<CopyCommand command="git config --list" />

<ExpectedResult>
user.name=Your Name
user.email=your.email@example.com
</ExpectedResult>

### SSH Keys for GitHub

SSH keys let you push and pull from GitHub without typing your password each time.

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

Press Enter to accept the default file location, then set a passphrase or press Enter for none.

<CopyCommand command="cat ~/.ssh/id_ed25519.pub" />

Copy the output and add it to your GitHub account under **Settings > SSH and GPG keys > New SSH key**.

Test the connection:

<CopyCommand command="ssh -T git@github.com" />

<ExpectedResult>
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
</ExpectedResult>

### Common Git Workflow

<CopyCommand command="git clone git@github.com:username/repo.git" />
<CopyCommand command="cd repo && git checkout -b my-feature" />
<CopyCommand command="git add ." />
```bash
git commit -m "Add new feature"
```
<CopyCommand command="git push origin my-feature" />

<BestPractice>
Create a new branch for each feature or fix. This keeps your main branch clean and makes code review easier.
</BestPractice>

## Python

Python is pre-installed on most Ubuntu systems, but you should verify the version and set up virtual environments for project isolation.

### Installation

<CopyCommand command="sudo apt install -y python3 python3-pip python3-venv" />

Verify the installation:

<CopyCommand command="python3 --version" />

<ExpectedResult>
Python 3.12.x or similar version output.
</ExpectedResult>

<CopyCommand command="pip3 --version" />

### Virtual Environments

Always use virtual environments to isolate project dependencies. This prevents conflicts between packages required by different projects.

<CopyCommand command="python3 -m venv ~/myproject-env" />
<CopyCommand command="source ~/myproject-env/bin/activate" />

Your prompt changes to show the active environment. Install packages inside it:

<CopyCommand command="pip install requests" />

Deactivate when you are done:

<CopyCommand command="deactivate" />

### Test with a Simple Script

```bash
python3 -c "import sys; print(f'Python {sys.version} is working')"
```

<ExpectedResult>
Python 3.12.x (main, ...) is working
</ExpectedResult>

<CommonMistake title="Using pip without a virtual environment">
Installing packages globally with `pip install` can break system tools. Always activate a virtual environment first, or use `pip install --user` as a fallback.
</CommonMistake>

## Node.js

Node.js lets you run JavaScript outside the browser. You can install it directly with `apt` or use `nvm` for version management.

### Option A: Install via apt

<CopyCommand command="sudo apt install -y nodejs npm" />

<CopyCommand command="node --version" />
<CopyCommand command="npm --version" />

### Option B: Install via nvm (Recommended)

`nvm` (Node Version Manager) lets you switch between Node.js versions per project.

<CopyCommand command="curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash" />
<CopyCommand command="source ~/.bashrc" />
<CopyCommand command="nvm install --lts" />

Verify:

<CopyCommand command="node --version" />

<ExpectedResult>
v22.x.x or the current LTS version.
</ExpectedResult>

<CopyCommand command="npm --version" />

### npm Basics

Initialize a new project:

<CopyCommand command="mkdir ~/my-node-project && cd ~/my-node-project && npm init -y" />

Install a package:

<CopyCommand command="npm install express" />

### Test with a Simple Script

```bash
node -e "console.log('Node.js ' + process.version + ' is working')"
```

<ExpectedResult>
Node.js v22.x.x is working
</ExpectedResult>

<BestPractice>
Use `nvm` if you work on multiple projects that require different Node.js versions. It keeps each project's runtime isolated.
</BestPractice>

## SSH

SSH lets you securely connect to remote servers, transfer files, and tunnel services.

### Generating Keys

If you have not already generated a key for GitHub, create one now:

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

### Configuring SSH Config

Create or edit `~/.ssh/config` to define shortcuts for servers you connect to frequently:

```
Host myserver
    HostName 192.168.1.100
    User ubuntu
    IdentityFile ~/.ssh/id_ed25519
    Port 22
```

Then connect with just:

<CopyCommand command="ssh myserver" />

### Connecting to Remote Servers

<CopyCommand command="ssh user@hostname" />

Copy files to a remote server:

<CopyCommand command="scp localfile.txt user@hostname:/remote/path/" />

<Tip>
Add your public key to the remote server's `~/.ssh/authorized_keys` file to skip password prompts on every connection.
</Tip>

## Common Development Workflows

A typical clone-build-test cycle looks like this:

<CopyCommand command="git clone git@github.com:username/project.git" />
<CopyCommand command="cd project" />
<CopyCommand command="cat README.md" />

For a Python project:

<CopyCommand command="python3 -m venv .venv && source .venv/bin/activate" />
<CopyCommand command="pip install -r requirements.txt" />
<CopyCommand command="python3 -m pytest" />

For a Node.js project:

<CopyCommand command="npm install" />
<CopyCommand command="npm test" />

<PerformanceNote>
Running `npm install` or `pip install` downloads packages from the internet. If your ADL environment has limited bandwidth, expect these commands to take longer on the first run. Subsequent installs use cached packages.
</PerformanceNote>

## Verifying Your Setup

Run these commands to confirm that all tools are installed and working:

<CopyCommand command="git --version" />
<CopyCommand command="python3 --version" />
<CopyCommand command="node --version" />
<CopyCommand command="npm --version" />
<CopyCommand command="gcc --version" />
<CopyCommand command="make --version" />
<CopyCommand command="cmake --version" />
<CopyCommand command="ssh -V" />

<Troubleshooting items={[{problem:"Command not found after installation", solution:"Close and reopen your terminal, or run `source ~/.bashrc` to reload your shell configuration."},{problem:"Permission denied when installing packages", solution:"Use `sudo` before apt commands. For pip, activate a virtual environment first instead of using sudo."},{problem:"SSH connection refused", solution:"Verify the remote server&apos;s SSH service is running and that your public key has been added to its authorized_keys file."},{problem:"nvm: command not found", solution:"Run `source ~/.bashrc` after installing nvm. The installer adds nvm to your shell profile, but the current session needs a reload."},{problem:"pip install fails with build errors", solution:"Install build-essential first: `sudo apt install -y build-essential python3-dev`. Many Python packages compile native extensions during installation."}]} />

<FAQ items={[{question:"Do I need to install all these tools?", answer:"No. Install only what your projects require. Git and build-essential are recommended for everyone. Add Python, Node.js, or other tools as needed."},{question:"Can I use Docker inside ADL?", answer:"Docker support depends on your ADL configuration. Check your environment&apos;s documentation or ask your administrator."},{question:"How do I update tools to newer versions?", answer:"Run `sudo apt update && sudo apt upgrade` to update apt-managed tools. Use `nvm install --lts` to update Node.js via nvm. Python versions are tied to Ubuntu releases unless you use pyenv."}]} />
