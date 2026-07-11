---
sidebar_position: 2
title: "Web Browsers"
description: "Install and optimize Firefox and Chromium for ARM-based Android devices running ADL."
---

# Web Browsers

A web browser is one of the first things most people install after setting up their ADL desktop. **Firefox is the recommended browser** on this stack; Chromium is possible on some configurations but commonly fails under proot. Two facts shape everything on this page:

1. **Ubuntu's own `firefox` and `chromium-browser` packages are Snap stubs** — they only install a Snap, and Snaps cannot run under proot. On Ubuntu, Firefox must come from Mozilla's official apt repository instead. Debian is unaffected: its `firefox-esr` and `chromium` packages are real builds.
2. **Run browsers as a normal (non-root) user.** Browsers misbehave — and Chromium refuses to start — as root. The [guided installer](/get-started) creates a non-root user as a standard step; log in with `proot-distro login <distro> --user <name> --shared-tmp`.

## Firefox

### Installation on Debian

Debian ships a real Firefox ESR (Extended Support Release) package — security updates without rapid feature churn:

<CopyCommand command="sudo apt install firefox-esr -y" />

After installation, Firefox appears in the XFCE applications menu under **Internet**, or you can launch it from the terminal:

<CopyCommand command="firefox-esr &" />

### Installation on Ubuntu (Mozilla's official apt repository)

Ubuntu's `firefox` deb is a transitional Snap stub that cannot work under proot. Install from Mozilla's official repository (it serves real ARM64 builds):

<CopyCommand command="sudo install -d -m 0755 /etc/apt/keyrings" />
<CopyCommand command="wget -q https://packages.mozilla.org/apt/repo-signing-key.gpg -O- | sudo tee /etc/apt/keyrings/packages.mozilla.org.asc > /dev/null" />
<CopyCommand command={'echo "deb [signed-by=/etc/apt/keyrings/packages.mozilla.org.asc] https://packages.mozilla.org/apt mozilla main" | sudo tee /etc/apt/sources.list.d/mozilla.list > /dev/null'} />
<CopyCommand command={"printf 'Package: *\nPin: origin packages.mozilla.org\nPin-Priority: 1000\n' | sudo tee /etc/apt/preferences.d/mozilla > /dev/null"} />
<CopyCommand command="sudo apt update && sudo apt install firefox -y" />

### Hardware acceleration: disable it if pages break

The GL stack under proot + Termux:X11 is software-only and unusual; Firefox's hardware-acceleration path can crash or render black/corrupted pages here. If that happens: **Settings → General → Performance** — uncheck *Use recommended performance settings*, then uncheck *Use hardware acceleration when available*, and restart Firefox. (Equivalent `about:config` switch: `gfx.webrender.software` = `true`.) This was exactly the fix in the [Galaxy S22+ field report](/docs/compatibility/devices/galaxy-s22-plus).

### Backing up your profile

Your bookmarks, passwords, and settings live in `~/.mozilla/firefox/`. Back it up with `tar czf ~/firefox-profile-backup.tar.gz ~/.mozilla/firefox/` and restore by unpacking it into your home directory.

### First Launch

The first launch takes longer than subsequent starts. Firefox needs to build its profile directory, initialize caches, and compile shaders. Expect 30-60 seconds on the first run. After that, startup times drop significantly.

<PerformanceNote>Firefox's first launch is slow because it builds its profile and compiles cached data. Subsequent launches are much faster --- be patient the first time.</PerformanceNote>

## Chromium (experimental under proot)

Chromium is the open-source project behind Google Chrome. **Treat it as experimental on this stack** — its sandbox and GPU process commonly fail under proot, and it is not the default recommendation.

### Availability

- **Debian:** ships a real `chromium` package on ARM64: `sudo apt install chromium -y`
- **Ubuntu:** `chromium-browser` is a Snap stub — it cannot work under proot. There is no supported Chromium path on Ubuntu here; use Firefox from Mozilla's repository instead.

### Why not `--no-sandbox`

Running as root, Chromium exits with *"Running as root without --no-sandbox is not supported."* The sandbox is Chromium's **main security boundary** — it is what limits the damage a malicious web page can do if it exploits the renderer. Launching with `--no-sandbox` removes that boundary, so ADL does not recommend it, and never as a default or in desktop entries.

The correct response to that error is to **run as a normal user** (`proot-distro login <distro> --user <name>`). As a non-root user, Chromium may still fail under proot (namespace and GPU-process limitations) — if it does, that configuration is simply unsupported; use Firefox.

## Firefox vs. Chromium on ARM

Both browsers work, but they have different strengths in the ADL environment.

| Feature | Firefox | Chromium |
|---|---|---|
| RAM usage (5 tabs) | ~400-600 MB | ~600-900 MB |
| Startup time (warm) | ~8-15 seconds | ~10-20 seconds |
| Works under proot | Yes (disable hardware acceleration if needed) | Unreliable — sandbox/GPU failures common |
| Real package on Debian | Yes (`firefox-esr`) | Yes (`chromium`) |
| Real package on Ubuntu | Via Mozilla's apt repo | No (Snap stub only) |
| Tab unloading | Built-in | Extension needed |

<Tip>Firefox is the recommended browser for ADL: it has the most reliable field results, real packages on both Debian and Ubuntu (via Mozilla's repository), and a documented fix (software rendering) for its one common failure mode.</Tip>

## Recommended Extensions

Extensions improve both usability and performance. Ad blockers in particular reduce memory usage and speed up page loads significantly on ARM devices.

| Extension | Purpose | Available On |
|---|---|---|
| uBlock Origin | Ad and tracker blocking, reduces memory and bandwidth | Firefox, Chromium |
| Auto Tab Discard | Automatically suspends inactive tabs to free RAM | Firefox, Chromium |
| Dark Reader | Dark mode for all websites, easier on OLED screens | Firefox, Chromium |
| NoScript | Block JavaScript on untrusted sites for speed and security | Firefox |
| h264ify | Force H.264 video codec for better software playback | Firefox, Chromium |

<Note>uBlock Origin is strongly recommended. Blocking ads and trackers on ARM hardware frees substantial memory and CPU cycles, making every page load noticeably faster.</Note>

## Performance Configuration

### Firefox about:config Tweaks

Open `about:config` in the Firefox address bar, accept the warning, and search for each setting below. These changes optimize Firefox for ARM processors with limited resources.

| Setting | Value | Purpose |
|---|---|---|
| `gfx.webrender.software` | `true` | Forces software WebRender — the reliable renderer on this GL stack |
| `browser.tabs.unloadOnLowMemory` | `true` | Automatically unloads background tabs when RAM runs low |
| `browser.cache.disk.capacity` | `51200` | Limits disk cache to 50 MB to reduce storage writes |
| `browser.sessionstore.interval` | `30000` | Reduces session save frequency to every 30 seconds |
| `image.mem.decode_bytes_at_a_time` | `16384` | Decodes images in smaller chunks to reduce memory spikes |
| `network.http.max-connections` | `32` | Limits total connections to reduce memory pressure |

<PerformanceNote>The `browser.tabs.unloadOnLowMemory` setting is critical for ADL. Since browser memory is shared with Android, aggressive tab management prevents Android from killing Termux when the system runs low on RAM.</PerformanceNote>

### Chromium Launch Flags (non-root user, Debian)

If you experiment with Chromium as a non-root user on Debian, these flags reduce GPU-related failures — note that none of them is `--no-sandbox`:

<CopyCommand command="chromium --disable-gpu --process-per-site --disable-features=TranslateUI &" />

| Flag | Purpose |
|---|---|
| `--disable-gpu` | Prevents GPU calls that fail under proot |
| `--process-per-site` | Uses one process per site instead of per tab, saving RAM |
| `--disable-features=TranslateUI` | Removes the translate popup that wastes resources |

## Hardware Acceleration

Hardware acceleration is limited in ADL because proot cannot access the Android GPU directly. Both Firefox and Chromium fall back to software rendering, which works but uses more CPU.

What this means in practice:

- **Scrolling** may be slightly less smooth on complex pages
- **Video playback** relies on software decoding, which increases CPU load
- **WebGL** content and canvas-heavy sites run slowly or not at all
- **CSS animations** work but may stutter on older devices

Despite these limitations, both browsers handle standard web browsing, web apps, and media consumption well. Most users will not notice a significant difference for everyday tasks like reading, email, and document editing.

<Tip>If you use video-heavy sites, install the h264ify extension. It forces the H.264 codec, which has better software decoding performance than VP9 or AV1 on ARM processors.</Tip>

## Troubleshooting

<Troubleshooting
  problem="Firefox takes over a minute to start"
  solution="First launch is always slow. For subsequent launches, try reducing extensions and disabling session restore: set browser.sessionstore.resume_from_crash to false in about:config. Also ensure you are running firefox-esr, not a snap version."
/>

<Troubleshooting
  problem="Chromium refuses to start: 'Running as root without --no-sandbox is not supported'"
  solution="You are running as root. Do not add --no-sandbox (it removes the browser's main security boundary). Log in as a normal user instead: proot-distro login <distro> --user <name>. If Chromium still fails as a non-root user, that configuration is unsupported under proot --- use Firefox."
/>

<Troubleshooting
  problem="High memory usage causes Termux to be killed by Android"
  solution="Android's low-memory killer can terminate Termux when browsers consume too much RAM. Limit open tabs to 3-5, enable browser.tabs.unloadOnLowMemory in Firefox, install Auto Tab Discard, and close other Android apps running in the background."
/>

<Troubleshooting
  problem="Videos stutter or refuse to play"
  solution="Software decoding is CPU-intensive on ARM. Lower video quality to 480p or 720p, install h264ify to force H.264 codec, and close unnecessary tabs. If a video still will not play, try the other browser --- Firefox and Chromium use different media pipelines."
/>

<Troubleshooting
  problem="Pages render incorrectly or fonts are missing"
  solution="Install additional font packages to fix rendering issues: apt install fonts-noto fonts-noto-cjk fonts-dejavu -y. This covers Latin, CJK, and symbol characters that many websites expect."
/>

<Troubleshooting
  problem="Firefox installed on Ubuntu but nothing launches"
  solution="Ubuntu's firefox deb is a Snap transitional stub, and Snaps cannot run under proot. Remove it (apt remove firefox) and install from Mozilla's official apt repository as shown above."
/>

## Next Steps

With a browser installed and configured, you can access web-based tools, documentation, and cloud applications from your ADL desktop. For related topics:

- Install additional applications from the Ubuntu repositories with `apt search <package-name>`
- Learn about managing packages in the [apt commands reference](/docs/reference/commands/apt-commands)
