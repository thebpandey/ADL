---
sidebar_position: 2
title: "Application Compatibility"
description: "Linux application compatibility status for browsers, editors, IDEs, and tools on ADL."
---

# Application Compatibility

This reference covers the compatibility status of common Linux applications when running under ADL. Applications are tested on ARM64 (aarch64) within the proot environment. Status ratings reflect typical behavior across supported Android devices.

## Web Browsers

<Compatibility items={[
  { name: "Firefox", status: "full", notes: "Best option for ADL. Runs reliably with good performance." },
  { name: "Chromium", status: "partial", notes: "Requires launch flags (--no-sandbox --disable-gpu). May crash on low-RAM devices." },
  { name: "Midori", status: "full", notes: "Lightweight WebKit-based browser. Good for low-resource devices." },
  { name: "Epiphany / GNOME Web", status: "full", notes: "WebKit-based. Works well for basic browsing." },
  { name: "Lynx", status: "full", notes: "Terminal-based browser. No graphical dependencies." },
  { name: "w3m", status: "full", notes: "Terminal-based browser with inline image support in some terminals." }
]} />

## Text Editors

<Compatibility items={[
  { name: "Vim / Neovim", status: "full", notes: "Fully functional. Recommended terminal-based editor." },
  { name: "Nano", status: "full", notes: "Simple and reliable. Pre-installed in most distributions." },
  { name: "Geany", status: "full", notes: "Lightweight GUI editor with syntax highlighting and basic IDE features." },
  { name: "Mousepad", status: "full", notes: "XFCE default text editor. Fast and minimal." },
  { name: "Emacs", status: "full", notes: "Both terminal and GUI modes work correctly." },
  { name: "Sublime Text", status: "none", notes: "No ARM64 Linux build available from the vendor." },
  { name: "Kate", status: "partial", notes: "Functional but pulls in heavy KDE dependencies. Use Geany instead." }
]} />

## IDEs and Development Environments

<Compatibility items={[
  { name: "VS Code / Code-OSS", status: "partial", notes: "Native builds have display issues under proot. Use code-server instead." },
  { name: "Code-Server", status: "full", notes: "Browser-based VS Code. Recommended IDE solution for ADL." },
  { name: "Geany", status: "full", notes: "Lightweight IDE with project management, build commands, and plugin support." },
  { name: "Thonny", status: "full", notes: "Python-focused IDE. Good for learning and small projects." },
  { name: "Eclipse", status: "none", notes: "Too resource-intensive. Exceeds available memory on most devices." },
  { name: "Android Studio", status: "none", notes: "Cannot run nested Android emulation. Not functional under proot." }
]} />

<Tip title="Browser-Based IDEs">
code-server provides the full VS Code experience through a browser tab, avoiding the display and performance issues of native desktop VS Code under proot. Install it with the official install script and access it at localhost.
</Tip>

## Office and Documents

<Compatibility items={[
  { name: "LibreOffice", status: "partial", notes: "Runs but is resource-heavy. Expect slow startup and high memory use." },
  { name: "AbiWord", status: "full", notes: "Lightweight word processor. Opens common document formats." },
  { name: "Gnumeric", status: "full", notes: "Lightweight spreadsheet application. Fast and capable." },
  { name: "Evince", status: "full", notes: "GNOME document viewer. Handles PDF and other formats well." },
  { name: "Okular", status: "partial", notes: "Works but brings in KDE dependencies. Prefer Evince or Zathura." },
  { name: "Zathura", status: "full", notes: "Minimal, keyboard-driven PDF viewer. Very fast." }
]} />

## Media Players

<Compatibility items={[
  { name: "VLC", status: "partial", notes: "Audio playback works. Video may lag without hardware acceleration." },
  { name: "MPV", status: "partial", notes: "Audio works well. Video performance varies by device and resolution." },
  { name: "Audacious", status: "full", notes: "Lightweight audio player. Reliable for music playback." },
  { name: "Celluloid", status: "partial", notes: "MPV frontend. Same video limitations as MPV apply." },
  { name: "ffmpeg", status: "full", notes: "CLI media tool. Encoding, decoding, and conversion all work." },
  { name: "ImageMagick", status: "full", notes: "CLI image processing. All operations work as expected." }
]} />

## Graphics and Image Editing

<Compatibility items={[
  { name: "GIMP", status: "partial", notes: "Runs but can be slow on lower-end devices. Usable for light editing." },
  { name: "Inkscape", status: "partial", notes: "Heavy resource usage. Functional for simple vector work." },
  { name: "Feh", status: "full", notes: "Fast CLI image viewer. Minimal resource usage." },
  { name: "Ristretto", status: "full", notes: "XFCE image viewer. Lightweight and responsive." },
  { name: "Shotwell", status: "partial", notes: "Photo manager. Import and basic editing work but performance varies." },
  { name: "Drawing", status: "full", notes: "Simple raster image editor. Good alternative to GIMP for basic tasks." }
]} />

## Development Tools

<Compatibility items={[
  { name: "Git", status: "full", notes: "Fully functional. All operations work as expected." },
  { name: "Python 3", status: "full", notes: "Interpreter and pip work correctly. Most pure-Python packages install fine." },
  { name: "Node.js", status: "full", notes: "Available via package manager or nvm. npm and npx work." },
  { name: "GCC / G++", status: "full", notes: "Compiles C and C++ for ARM64. Performance is device-dependent." },
  { name: "Make / CMake", status: "full", notes: "Build systems work without issues." },
  { name: "Docker", status: "none", notes: "Requires kernel features unavailable under proot. Not functional." },
  { name: "Java / OpenJDK", status: "full", notes: "JRE and JDK available. Maven and Gradle work." },
  { name: "Ruby", status: "full", notes: "Interpreter and gem install work correctly." },
  { name: "Go", status: "full", notes: "Compiler and toolchain work. Cross-compilation supported." },
  { name: "Rust", status: "partial", notes: "Compiles correctly but compilation is slow due to high resource demands." }
]} />

## Terminal Emulators

<Compatibility items={[
  { name: "xfce4-terminal", status: "full", notes: "Default ADL terminal. Reliable and well-integrated with XFCE." },
  { name: "xterm", status: "full", notes: "Minimal terminal emulator. Always available as a fallback." },
  { name: "Sakura", status: "full", notes: "Lightweight VTE-based terminal with tabs and configuration." },
  { name: "Alacritty", status: "partial", notes: "Requires OpenGL support. May fail on devices without GPU passthrough." },
  { name: "Kitty", status: "none", notes: "Requires GPU rendering. Not compatible with proot display layer." }
]} />

## System Utilities

<Compatibility items={[
  { name: "Thunar", status: "full", notes: "XFCE file manager. Default in ADL, works well." },
  { name: "PCManFM", status: "full", notes: "Lightweight file manager. Good alternative to Thunar." },
  { name: "htop", status: "full", notes: "Process viewer. Shows proot-visible processes." },
  { name: "Neofetch / Fastfetch", status: "full", notes: "System info display. Reports the proot environment details." },
  { name: "Synaptic", status: "partial", notes: "Package manager GUI. Works but apt operations may need manual fixes under proot." },
  { name: "GParted", status: "none", notes: "Requires direct disk access. No real block devices available under proot." }
]} />

---

## Compatibility Notes

### Why Some Applications Do Not Work

Several factors can prevent applications from running correctly under ADL:

- **No kernel access.** ADL runs inside proot, which intercepts system calls in userspace. Applications that require direct kernel features (cgroups, namespaces, device nodes) will fail. This affects Docker, GParted, and similar system-level tools.
- **No GPU acceleration.** The proot display layer does not provide hardware-accelerated OpenGL or Vulkan. Applications that require GPU rendering (Kitty, Alacritty) will not start or will fall back to software rendering with poor performance.
- **ARM64 architecture only.** ADL runs on the device's native ARM64 architecture. Applications that only ship x86_64 binaries (Sublime Text) cannot run without an emulation layer, which ADL does not provide.
- **Resource constraints.** Mobile devices have limited RAM and CPU compared to desktop hardware. Resource-intensive applications (Eclipse, LibreOffice, GIMP) may run but with degraded performance, especially on devices with 4 GB RAM or less.

### Finding Alternatives

When a preferred application is not compatible, look for lightweight alternatives that achieve the same goal:

- Prefer GTK applications over Qt/KDE applications to reduce dependency overhead.
- CLI tools often work better than their GUI equivalents under resource constraints.
- Browser-based tools (code-server, web-based office suites) bypass many display layer limitations.

<BestPractice>
Choose lightweight alternatives whenever possible. Applications designed for low-resource environments (Geany over VS Code, AbiWord over LibreOffice, Zathura over Okular) will run faster, use less memory, and provide a more responsive experience under ADL. Reserve heavy applications for tasks where no lightweight alternative exists.
</BestPractice>

<Warning title="Container and Virtualization Tools">
Tools that require kernel-level isolation (Docker, Podman, LXC, VirtualBox) are not compatible with ADL. The proot environment does not expose the necessary kernel interfaces. For containerized workflows, consider using remote Docker hosts or cloud-based development environments.
</Warning>

<CollapsibleSection title="Testing Your Own Applications">

To check whether an application works under ADL:

1. Install it through your distribution's package manager (`apt install <package>`).
2. Launch it from the terminal to see any error output.
3. Common failure modes to watch for:
   - "Operation not permitted" errors indicate missing kernel capabilities.
   - Segmentation faults on launch may indicate GPU or architecture issues.
   - Extremely slow startup usually means the application exceeds available resources.
4. If an application fails, search for a lightweight alternative in the same category.

</CollapsibleSection>
