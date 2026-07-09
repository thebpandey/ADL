---
sidebar_position: 2
title: "Optimization Guide"
description: "Concrete steps to improve ADL performance by reducing proot overhead, managing memory, and tuning your desktop environment."
---

# Optimization Guide

This page covers specific, actionable steps to improve ADL performance. Each section targets a different source of overhead. Apply the changes that match your pain points --- you do not need to do everything here.

The optimizations are ordered roughly by impact. Start at the top and work down until performance meets your needs.

## Reduce Proot Overhead

Proot's syscall translation is the single largest source of overhead in ADL. These changes reduce the number of system calls proot must intercept or eliminate unnecessary work it performs on each call.

### DNS Optimization

By default, proot intercepts DNS resolution calls and translates them. You can bypass this by pointing directly at a DNS resolver, which eliminates thousands of unnecessary syscall translations during network operations.

Create or edit the `resolv.conf` file inside your Ubuntu environment:

<CopyCommand command="echo 'nameserver 8.8.8.8' | tee /etc/resolv.conf" />

<Tip>
You can use any DNS resolver you prefer. Cloudflare's `1.1.1.1` and Quad9's `9.9.9.9` are also good choices. The key is that a hardcoded nameserver avoids proot's DNS interception path.
</Tip>

### Disable Seccomp in Proot

Proot's seccomp filter adds an additional layer of syscall interception. Disabling it reduces overhead at the cost of slightly reduced sandboxing --- which is acceptable since ADL already runs in Android's application sandbox.

Set the environment variable before launching proot. Edit your start script or add this to your Termux shell profile:

<CopyCommand command="export PROOT_NO_SECCOMP=1" />

To make this permanent, add it to your Termux bash profile:

<CopyCommand command="echo 'export PROOT_NO_SECCOMP=1' >> ~/.bashrc" />

<PerformanceNote>
Disabling seccomp typically improves proot performance by 5-15%, with the largest gains on file-intensive workloads like compilation and package installation.
</PerformanceNote>

### Optimize Proot Launch Arguments

If you are using a custom proot launch command, ensure you are binding only the directories you need. Each bind mount adds overhead because proot must check paths against all mounts on every file operation.

Review your start script and remove any bind mounts you do not actively use. A minimal configuration binds only what is necessary:

<CopyCommand command="proot-distro login ubuntu --shared-tmp" />

<BestPractice>
Only bind Android storage directories (via `--bind`) when you need to transfer files between Android and Linux. For sessions where you are working entirely within the Linux filesystem, skip the extra binds.
</BestPractice>

## Memory Management

Running out of RAM is the most common cause of ADL sessions being killed. Proactive memory management keeps your session alive and responsive.

### Monitor Memory Usage

Check current memory usage with `free`:

<CopyCommand command="free -h" />

For a continuously updated view, use `htop`:

<CopyCommand command="htop" />

If `htop` is not installed:

<CopyCommand command="apt install htop -y" />

<Tip>
In htop, press F6 to sort by memory usage. This lets you quickly identify which processes are consuming the most RAM. Press F9 to kill a selected process, or press q to quit htop.
</Tip>

### Kill Unnecessary Processes

Identify and kill processes that consume memory without providing value. Common culprits include background services started automatically:

<CopyCommand command="ps aux --sort=-%mem | head -20" />

This shows the top 20 memory-consuming processes. Kill any you do not need:

<CopyCommand command="kill <PID>" />

Replace `<PID>` with the process ID from the `ps` output.

<Warning>
Do not kill processes you do not recognize without checking what they are first. System-critical processes like `dbus-daemon` and the Xfce session manager are needed for your desktop to function. When in doubt, search for the process name before killing it.
</Warning>

### Disable Unnecessary Services

Several services start automatically on a standard Ubuntu installation that serve no purpose in a proot environment.

Disable Bluetooth-related services (no Bluetooth access through proot):

<CopyCommand command="sudo rm -f /etc/xdg/autostart/blueman.desktop" />

Disable print service (no printer access through proot):

<CopyCommand command="apt remove cups cups-browsed -y 2>/dev/null; apt autoremove -y" />

Disable accessibility services if you do not need them:

<CopyCommand command="sudo rm -f /etc/xdg/autostart/at-spi-dbus-bus.desktop" />

<PerformanceNote>
Each disabled service saves 10-50 MB of RAM and eliminates background CPU usage from periodic polling. On a memory-constrained device, removing three or four unnecessary services can free enough RAM to keep an additional browser tab open.
</PerformanceNote>

Disable evolution data server (calendar/contacts sync, not useful in ADL):

<CopyCommand command="sudo rm -f /etc/xdg/autostart/org.gnome.Evolution-alarm-notify.desktop" />

### Reduce Polkit and Authentication Overhead

Polkit (the authentication framework) spawns agents that consume memory and CPU in an environment where they serve little purpose:

<CopyCommand command="sudo rm -f /etc/xdg/autostart/polkit-gnome-authentication-agent-1.desktop" />

## Configure Swap with Zram

Zram creates a compressed swap space in RAM. This effectively increases your usable memory by compressing rarely-accessed pages, trading CPU cycles for memory capacity.

Install and enable zram tools:

<CopyCommand command="apt install zram-tools -y" />

Configure zram to use a reasonable percentage of your RAM. Edit the configuration:

<CopyCommand command="echo -e 'ALGO=lz4\nPERCENT=50\nPRIORITY=100' | tee /etc/default/zramswap" />

<PerformanceNote>
Lz4 compression is fast enough that the CPU overhead is negligible on modern ARM processors. A 50% allocation on a device with 3 GB available RAM gives you approximately 1.5 GB of compressed swap, effectively extending your usable memory to around 4 GB before Android starts killing processes.
</PerformanceNote>

Restart the zram service:

<CopyCommand command="service zramswap restart" />

Verify zram is active:

<CopyCommand command="swapon --show" />

<Warning>
Do not create a swap file on storage (internal or SD card). Unlike zram, file-based swap writes to flash storage, which is both slow and shortens the lifespan of the storage medium. Zram swap stays entirely in RAM and is the only recommended swap method for ADL.
</Warning>

## Browser Optimization

Web browsers are typically the most resource-hungry applications in ADL. These steps reduce their footprint significantly.

### Reduce Open Tabs

Each browser tab consumes 50-150 MB of RAM. This is the single most impactful thing you can control.

<BestPractice>
Keep open tabs to a maximum of 3-5 at any time. Use bookmarks instead of keeping tabs open "for later." If you need reference material while working, copy the relevant text into a local file rather than keeping the tab open.
</BestPractice>

### Disable Browser Extensions

Every extension adds memory overhead and background CPU usage. In a constrained environment, run with zero extensions or only those you genuinely need for the current task.

In Firefox, go to `about:addons` and disable or remove all non-essential extensions.

### Reduce Browser Resource Usage

Configure Firefox to use less memory. Open `about:config` and set:

- `browser.cache.disk.capacity` to `51200` (50 MB instead of the default 256 MB)
- `browser.sessionhistory.max_entries` to `10` (default 50)
- `browser.tabs.unloadOnLowMemory` to `true`
- `dom.ipc.processCount` to `2` (limits content processes)

<PerformanceNote>
Reducing Firefox content processes from the default 8 to 2 saves several hundred MB of RAM at the cost of tab isolation. A crash in one tab may affect another tab sharing the same process.
</PerformanceNote>

### Consider Lighter Browsers

If Firefox or Chromium feel too heavy, consider lighter alternatives:

<CopyCommand command="apt install midori -y" />

Midori uses significantly less RAM per tab than Firefox or Chromium. Its rendering engine handles most modern websites adequately, though some complex web applications may not work correctly.

## Desktop Environment Optimization

XFCE is already one of the lightest full desktop environments, but it can be tuned further.

### Disable Window Compositing

The XFCE compositor (window manager compositing) adds transparency, shadows, and smooth transitions. It also consumes significant CPU since ADL uses software rendering.

Disable it through XFCE settings:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/use_compositing -s false" />

Or navigate to **Settings > Window Manager Tweaks > Compositor** and uncheck "Enable display compositing."

<PerformanceNote>
Disabling compositing is one of the highest-impact desktop optimizations. It eliminates the overhead of rendering transparency, shadows, and window previews through CPU-based software rendering. Expect a noticeable improvement in window switching and overall desktop responsiveness.
</PerformanceNote>

### Disable Animations

Turn off window animations to reduce rendering work:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/box_move -s true" />

<CopyCommand command="xfconf-query -c xfwm4 -p /general/box_resize -s true" />

These settings make windows display as outlines during move and resize operations instead of rendering the full window contents in real time.

### Reduce Panel Plugins

Each panel plugin (clock, system tray, workspace switcher) runs its own process and update loop. Remove plugins you do not use.

Right-click the XFCE panel, select **Panel > Panel Preferences**, go to the **Items** tab, and remove plugins you can live without. Good candidates for removal:

- Weather plugin
- Notes plugin
- CPU graph (useful for debugging but not needed permanently)
- Multiple workspace switcher (if you use only one workspace)

### Use a Minimal Wallpaper

Solid-color wallpapers require no image decoding or scaling. Set a solid background color:

<CopyCommand command="xfconf-query -c xfce4-desktop -p /backdrop/screen0/monitorscreen/workspace0/image-style -s 0" />

### Consider a Lighter Window Manager

If XFCE still feels heavy, you can switch to a window manager that uses fewer resources:

<CopyCommand command="apt install openbox -y" />

Openbox uses a fraction of XFCE's memory and provides a functional windowed environment. You lose the panel, file manager integration, and settings GUI, but gain significant memory headroom.

<Tip>
You can run Openbox with individual XFCE components. For example, running `openbox` as your window manager with `xfce4-panel` gives you a lightweight taskbar without the full desktop environment overhead.
</Tip>

## Application-Level Optimizations

### Use Lightweight Alternatives

| Heavy Application | Lighter Alternative | RAM Savings |
|---|---|---|
| Firefox | Midori | ~300 MB |
| LibreOffice Writer | Abiword | ~150 MB |
| LibreOffice Calc | Gnumeric | ~150 MB |
| Thunar (with previews) | PCManFM | ~30 MB |
| VS Code (code-server) | Geany | ~400 MB |

### Compile with Limited Parallelism

When compiling code, limit the number of parallel jobs to avoid saturating RAM and triggering thermal throttling:

<CopyCommand command="make -j2" />

<BestPractice>
On most phones, `-j2` strikes the right balance between compilation speed and resource usage. Using `-j4` or higher on a phone will likely cause thermal throttling and may trigger Android's out-of-memory killer if the compile jobs exceed available RAM.
</BestPractice>

### Use Tmpfs for Build Directories

If you have RAM to spare, mounting a tmpfs for build output avoids storage I/O entirely:

<CopyCommand command="mkdir -p /tmp/build && mount -t tmpfs -o size=512M tmpfs /tmp/build" />

<Warning>
Tmpfs data lives entirely in RAM and is lost on reboot or session termination. Only use this for disposable build artifacts, never for source code or important data.
</Warning>

## Verifying Your Optimizations

After applying changes, measure the impact. Check overall memory usage:

<CopyCommand command="free -h" />

Check CPU usage and process counts:

<CopyCommand command="htop" />

Compare the number of running processes before and after your changes:

<CopyCommand command="ps aux | wc -l" />

A well-optimized ADL installation typically runs 40-60 processes. If you see significantly more, there are likely unnecessary services still running.

<PerformanceNote>
Apply optimizations incrementally and test between each change. This lets you identify which changes have the most impact on your specific device and workload, and makes it easy to revert a change that causes problems.
</PerformanceNote>

## Next Steps

- [Battery Management](/docs/performance/battery) --- optimize power consumption while running ADL
- [Storage Management](/docs/performance/storage) --- keep your installation lean and manage disk space
