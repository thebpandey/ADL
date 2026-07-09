---
sidebar_position: 5
title: "VS Code"
description: "Installing and configuring Visual Studio Code or lightweight alternatives for development in the ADL environment."
---

# VS Code

Visual Studio Code is a full-featured code editor that runs on ARM64 Linux. You have several options for running it in ADL — from the full desktop application to a browser-based setup. This page covers installation, configuration, and alternatives for devices with limited resources.

## Installation Options

There are three ways to run VS Code in ADL. Each has different trade-offs.

<Decision
  question="Which VS Code setup should you use?"
  options={[
    {
      label: "Code OSS (from Ubuntu repos)",
      description: "Open-source build available via apt. Easiest to install. Cannot use Microsoft's proprietary extension marketplace — uses Open VSX instead.",
      recommended: true
    },
    {
      label: "Official VS Code .deb (ARM64)",
      description: "Microsoft's build with full marketplace access and Settings Sync. Requires manual download and updates. Slightly heavier than Code OSS.",
      recommended: false
    },
    {
      label: "code-server (browser-based)",
      description: "Runs VS Code as a local web server, accessed through Firefox. No X11 display required. Good for devices where the desktop app is too heavy.",
      recommended: false
    }
  ]}
/>

### Option 1: Code OSS from Ubuntu Repos

The simplest installation path. Code OSS is the open-source base of VS Code.

<CopyCommand command="sudo apt update && sudo apt install code-oss" />

<ExpectedResult>
Code OSS appears in your application menu under **Development**. Launch it from the terminal with `code-oss`.
</ExpectedResult>

<Note title="Extension marketplace">
Code OSS uses the Open VSX marketplace instead of Microsoft's marketplace. Most popular extensions are available on Open VSX, but some Microsoft-published extensions (like Python, C#, Remote SSH) are not. If you need those, use the official VS Code .deb instead.
</Note>

### Option 2: Official VS Code .deb

Download the ARM64 .deb package directly from Microsoft:

```bash
curl -L -o /tmp/vscode.deb 'https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-arm64'
```

Install the downloaded package:

<CopyCommand command="sudo apt install /tmp/vscode.deb" />

<ExpectedResult>
VS Code appears in your application menu. Launch it with `code` from the terminal.
</ExpectedResult>

<Warning title="Updates">
The official .deb does not auto-update through apt. You need to download and install new versions manually. Check for updates at https://code.visualstudio.com periodically.
</Warning>

### Option 3: code-server (Browser-Based)

code-server runs VS Code as a web application that you access through your browser. This is useful if the desktop application is too resource-heavy, or if you want to skip X11 setup entirely.

<CopyCommand command="curl -fsSL https://code-server.dev/install.sh | sh" />

Start code-server:

<CopyCommand command="code-server --bind-addr 127.0.0.1:8080" />

Then open Firefox and navigate to `http://127.0.0.1:8080`. The default password is in `~/.config/code-server/config.yaml`.

<Tip>
code-server uses significantly less memory than the desktop application because it offloads rendering to the browser. On devices with 3-4 GB of RAM, this can be the difference between a usable and unusable editor.
</Tip>

## Display Configuration

If you are running VS Code or Code OSS as a desktop application, it needs a working X11 display through Termux:X11.

Make sure the `DISPLAY` environment variable is set:

<CopyCommand command="echo $DISPLAY" />

<ExpectedResult>
You should see `:0` or `:1`. If the variable is empty, your display server is not configured. See the [display setup guide](/docs/learn/software/termux-x11).
</ExpectedResult>

If VS Code launches but the window is blank or flickering, disable GPU acceleration:

<CopyCommand command="code --disable-gpu" />

To make this permanent, add the flag to your VS Code desktop entry or alias:

```bash
echo "alias code='code --disable-gpu'" >> ~/.bashrc
```

## Recommended Extensions

These extensions work well on ARM64 and are useful for development in ADL:

| Extension | ID | Purpose |
|---|---|---|
| **Python** | `ms-python.python` | Python language support, linting, debugging |
| **GitLens** | `eamodio.gitlens` | Enhanced Git integration and blame annotations |
| **Prettier** | `esbenp.prettier-vscode` | Code formatting for JS, TS, CSS, HTML, JSON |
| **ESLint** | `dbaeumer.vscode-eslint` | JavaScript and TypeScript linting |
| **Remote - SSH** | `ms-vscode-remote.remote-ssh` | Connect to remote servers from within VS Code |
| **Markdown All in One** | `yzhang.markdown-all-in-one` | Markdown editing with preview and shortcuts |

<Warning title="Extension availability">
Extensions marked with `ms-` prefixes are Microsoft-published and only available on the official VS Code marketplace. If you installed Code OSS, search for community alternatives on Open VSX or switch to the official .deb.
</Warning>

<BestPractice>
Install only the extensions you actively use. Each extension adds to startup time and memory usage. Five well-chosen extensions are better than twenty rarely-used ones.
</BestPractice>

## Performance Optimization

VS Code can be resource-hungry. These settings help keep it responsive on constrained devices.

### settings.json Tweaks

Open settings with `Ctrl+Shift+P` then type "Preferences: Open Settings (JSON)". Add these entries:

```json
{
  "telemetry.telemetryLevel": "off",
  "extensions.autoUpdate": false,
  "workbench.enableExperiments": false,
  "search.followSymlinks": false,
  "files.watcherExclude": {
    "**/.git/**": true,
    "**/node_modules/**": true,
    "**/dist/**": true
  },
  "editor.minimap.enabled": false,
  "editor.renderWhitespace": "none",
  "editor.cursorBlinking": "solid",
  "editor.smoothScrolling": false,
  "workbench.list.smoothScrolling": false,
  "breadcrumbs.enabled": false,
  "editor.bracketPairColorization.enabled": false
}
```

<PerformanceNote>
Disabling the minimap, smooth scrolling, and bracket colorization reduces rendering overhead noticeably. On lower-end devices, these changes can cut editor frame times in half.
</PerformanceNote>

### Memory Management

VS Code's memory usage grows with workspace size and extension count. Monitor and manage it with these strategies:

<Troubleshooting items={[
  {
    problem: "VS Code uses over 1 GB of memory on a small project",
    solution: "Disable unused extensions for this workspace (right-click extension > Disable for Workspace). Check the Process Explorer (Help > Open Process Explorer) to find which extensions consume the most memory."
  },
  {
    problem: "VS Code becomes sluggish after running for several hours",
    solution: "Restart VS Code periodically. The editor accumulates memory over time, especially with large files and many undo steps. Use the command palette: Developer: Reload Window."
  },
  {
    problem: "Large projects cause VS Code to freeze during file indexing",
    solution: "Add large directories (node_modules, build outputs, data files) to files.watcherExclude and files.exclude in your workspace settings. This prevents VS Code from scanning and indexing them."
  }
]} />

<CommonMistake title="Running VS Code alongside a browser">
Opening VS Code and Firefox simultaneously on a device with 4 GB of RAM will likely cause swapping and severe slowdowns. If you need both, use code-server inside Firefox instead of running two separate heavy applications.
</CommonMistake>

## Lightweight Alternatives

If VS Code is too heavy for your device, consider these alternatives:

<Decision
  question="Which editor fits your device and workflow?"
  options={[
    {
      label: "VS Code / Code OSS",
      description: "Full IDE experience with extensions, debugging, and Git integration. Requires 500 MB-1 GB of RAM. Best for complex projects.",
      recommended: true
    },
    {
      label: "code-server",
      description: "Same VS Code experience in a browser tab. Lower total memory when you already have Firefox open. Requires ~300-500 MB.",
      recommended: false
    },
    {
      label: "Neovim",
      description: "Powerful terminal-based editor. Uses under 50 MB of RAM. Steep learning curve but extremely efficient once learned. Install with: sudo apt install neovim",
      recommended: false
    },
    {
      label: "Micro",
      description: "Simple terminal editor with familiar keybindings (Ctrl+S, Ctrl+C). Uses under 20 MB. Good for quick edits without learning Vim keybindings. Install with: sudo apt install micro",
      recommended: false
    },
    {
      label: "Geany",
      description: "Lightweight GUI IDE with syntax highlighting, project management, and a built-in terminal. Uses ~100 MB. Good middle ground between a terminal editor and VS Code. Install with: sudo apt install geany",
      recommended: false
    }
  ]}
/>

<CollapsibleSection title="Setting up Neovim as a VS Code replacement">

Neovim can replicate most of VS Code's features with plugins while using a fraction of the resources. A minimal productive setup:

<CopyCommand command="sudo apt install neovim git curl" />

Install a plugin manager like vim-plug:

<CopyCommand command={"sh -c 'curl -fLo \"${XDG_DATA_HOME:-$HOME/.local/share}\"/nvim/site/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'"} />

Key plugins to consider: **nvim-lspconfig** (language server support), **telescope.nvim** (fuzzy finder), **nvim-treesitter** (syntax highlighting), and **gitsigns.nvim** (Git integration).

</CollapsibleSection>

<FAQ items={[
  {
    question: "Can I use VS Code&apos;s Remote SSH to develop on a remote server?",
    answer: "Yes. The Remote SSH extension works on ARM64 VS Code. This is useful if you want to edit code on a more powerful remote machine while using your phone as a thin client."
  },
  {
    question: "Do VS Code devcontainers work in ADL?",
    answer: "No. Devcontainers require Docker, which does not run inside a proot environment. Use Remote SSH to connect to a machine that supports Docker if you need containers."
  },
  {
    question: "Is there a performance difference between Code OSS and the official VS Code?",
    answer: "They are nearly identical in performance. The official build includes Microsoft telemetry and branding, but the underlying editor engine is the same. Code OSS may feel slightly lighter since it ships without some proprietary services."
  },
  {
    question: "Can I use VS Code extensions that require native compilation?",
    answer: "Most extensions with native components include ARM64 builds. If an extension fails to install, check its marketplace page for architecture support. C/C++ and Rust extensions generally work. Some niche extensions may only ship x86_64 binaries."
  }
]} />
