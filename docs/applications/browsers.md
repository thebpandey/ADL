---
sidebar_position: 2
title: "Web Browsers"
description: "Install and optimize Firefox and Chromium for ARM-based Android devices running ADL."
---

# Web Browsers

A web browser is one of the first things most people install after setting up their ADL desktop. Both Firefox and Chromium run well on ARM processors through Ubuntu's package repositories, though each requires some tuning to get the best performance in a proot environment.

This guide covers installation, configuration, and optimization for both browsers.

## Firefox ESR

Firefox ESR (Extended Support Release) is the version available in the Ubuntu repositories. It receives security updates and major bug fixes without the rapid feature churn of mainline Firefox, which makes it a stable choice for ADL.

### Installation

<CopyCommand command="apt install firefox-esr -y" />

After installation, Firefox appears in the XFCE applications menu under **Internet**, or you can launch it from the terminal:

<CopyCommand command="firefox-esr &" />

### First Launch

The first launch takes longer than subsequent starts. Firefox needs to build its profile directory, initialize caches, and compile shaders. Expect 30-60 seconds on the first run. After that, startup times drop significantly.

<PerformanceNote>Firefox's first launch is slow because it builds its profile and compiles cached data. Subsequent launches are much faster --- be patient the first time.</PerformanceNote>

## Chromium

Chromium is the open-source project behind Google Chrome. It provides a familiar interface for anyone coming from Chrome on Android or desktop.

### Installation

<CopyCommand command="apt install chromium-browser -y" />

Launch from the applications menu or terminal:

<CopyCommand command="chromium-browser --no-sandbox &" />

<Warning>The `--no-sandbox` flag is required because Chromium's sandbox relies on kernel features that proot cannot provide. This is standard for proot environments and does not affect stability.</Warning>

To make this permanent, edit the Chromium desktop entry so it always launches with the correct flag:

<CopyCommand command="sed -i 's/Exec=chromium-browser/Exec=chromium-browser --no-sandbox/' /usr/share/applications/chromium-browser.desktop" />

## Firefox vs. Chromium on ARM

Both browsers work, but they have different strengths in the ADL environment.

| Feature | Firefox ESR | Chromium |
|---|---|---|
| RAM usage (5 tabs) | ~400-600 MB | ~600-900 MB |
| Startup time (warm) | ~8-15 seconds | ~10-20 seconds |
| JavaScript performance | Good | Slightly better |
| Video playback | Better software decoding | Acceptable |
| Extension support | Full (Add-ons) | Full (Chrome Web Store) |
| Sandbox requirement | None | Requires `--no-sandbox` |
| Tab unloading | Built-in | Extension needed |
| Default in Ubuntu repos | Yes | Yes |

<Tip>Firefox is the recommended browser for ADL. It uses less memory, handles tab unloading natively, and does not require sandbox workarounds. Use Chromium if you need Chrome-specific web app compatibility.</Tip>

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
| `layers.acceleration.force-enabled` | `true` | Enables compositing layers even without GPU support |
| `gfx.webrender.all` | `true` | Activates WebRender for smoother page rendering |
| `browser.tabs.unloadOnLowMemory` | `true` | Automatically unloads background tabs when RAM runs low |
| `browser.cache.disk.capacity` | `51200` | Limits disk cache to 50 MB to reduce storage writes |
| `browser.sessionstore.interval` | `30000` | Reduces session save frequency to every 30 seconds |
| `image.mem.decode_bytes_at_a_time` | `16384` | Decodes images in smaller chunks to reduce memory spikes |
| `network.http.max-connections` | `32` | Limits total connections to reduce memory pressure |

<PerformanceNote>The `browser.tabs.unloadOnLowMemory` setting is critical for ADL. Since browser memory is shared with Android, aggressive tab management prevents Android from killing Termux when the system runs low on RAM.</PerformanceNote>

### Chromium Launch Flags

Add these flags when launching Chromium to improve performance on ARM:

<CopyCommand command="chromium-browser --no-sandbox --disable-gpu --disable-software-rasterizer --process-per-site --disable-features=TranslateUI &" />

| Flag | Purpose |
|---|---|
| `--disable-gpu` | Prevents GPU calls that fail under proot |
| `--disable-software-rasterizer` | Reduces CPU-heavy fallback rendering |
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
  problem="Chromium crashes immediately on launch"
  solution="Chromium requires the --no-sandbox flag in proot. Launch with: chromium-browser --no-sandbox. If it still crashes, try adding --disable-gpu to the command."
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
  problem="Chromium shows 'Running without the SUID sandbox' warnings"
  solution="This warning is expected in proot and does not affect browser functionality. It appears because the kernel namespace sandbox is unavailable. The --no-sandbox flag acknowledges this environment limitation."
/>

## Next Steps

With a browser installed and configured, you can access web-based tools, documentation, and cloud applications from your ADL desktop. For related topics:

- Install additional applications from the Ubuntu repositories with `apt search <package-name>`
- Learn about managing packages in the [apt commands reference](/docs/reference/commands/apt-commands)
