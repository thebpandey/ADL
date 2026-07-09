---
sidebar_position: 4
title: "Firefox"
description: "Installing and optimizing Firefox as your primary browser in the ADL desktop environment."
---

# Firefox

Firefox is the recommended browser for ADL. It has strong ARM64 support, runs well under proot, and is available directly from the Ubuntu repositories. You do not need to hunt for third-party builds or worry about architecture mismatches.

## Why Firefox?

Several factors make Firefox the best default choice for browsing in ADL:

- **Native ARM64 packages** — Ubuntu's repositories include a fully optimized ARM64 build
- **Lower memory footprint** — Firefox uses less RAM than Chromium-based browsers, which matters on devices with 4-8 GB
- **Strong privacy defaults** — built-in tracking protection reduces network requests and speeds up page loads
- **Reliable rendering** — Firefox handles software rendering gracefully when GPU acceleration is unavailable

<BestPractice>
Start with Firefox before trying other browsers. It has the fewest compatibility issues in a proot environment and requires the least configuration to get running.
</BestPractice>

## Installation

Install Firefox from the Ubuntu repositories:

<CopyCommand command="sudo apt update && sudo apt install firefox" />

<ExpectedResult>
Firefox appears in your application menu under **Internet**. You can also launch it from the terminal by running `firefox`.
</ExpectedResult>

If you are using a minimal Ubuntu installation that does not include a display server, make sure Termux:X11 is configured first. See the [display setup guide](/docs/learn/software/termux-x11) for details.

## Performance Configuration

Firefox works out of the box, but you can improve performance significantly by adjusting a few internal settings. Open a new tab and navigate to `about:config`, then accept the warning.

<Warning title="about:config changes">
These settings are safe to modify, but changing random settings in about:config without understanding them can break your browser. Stick to the values listed here.
</Warning>

### Recommended about:config Tweaks

| Setting | Value | Why |
|---|---|---|
| `gfx.webrender.all` | `false` | Disables WebRender, which depends on GPU acceleration not available in proot |
| `layers.acceleration.disabled` | `true` | Forces software compositing, preventing rendering glitches |
| `image.mem.surfacecache.max_size_kb` | `131072` | Limits image cache to 128 MB to reduce memory pressure |
| `browser.sessionstore.interval` | `60000` | Reduces session save frequency to once per minute, lowering disk I/O |
| `browser.tabs.unloadOnLowMemory` | `true` | Automatically unloads background tabs when memory is low |
| `dom.ipc.processCount` | `2` | Limits content processes to reduce memory usage |

<Tip>
After changing these settings, restart Firefox completely for all changes to take effect.
</Tip>

### Disable Unnecessary Features

Reduce background resource usage by turning off features you likely do not need in an ADL environment:

<CopyCommand command="# In about:config, set these values:" />

| Setting | Value | Purpose |
|---|---|---|
| `toolkit.telemetry.enabled` | `false` | Stops telemetry data collection |
| `datareporting.healthreport.uploadEnabled` | `false` | Stops health report uploads |
| `extensions.pocket.enabled` | `false` | Removes Pocket integration |
| `reader.parse-on-load.enabled` | `false` | Disables reader view background parsing |

## Essential Extensions

These extensions work well on ARM64 Firefox and improve the browsing experience:

| Extension | Purpose |
|---|---|
| **uBlock Origin** | Blocks ads and trackers. Reduces page weight and speeds up loading significantly |
| **Dark Reader** | Applies dark mode to all websites. Easier on your eyes when using a phone screen |
| **Auto Tab Discard** | Suspends inactive tabs to free memory |
| **LocalCDN** | Serves common libraries locally instead of fetching from CDNs |

<PerformanceNote>
uBlock Origin alone can reduce memory usage by 20-30% on ad-heavy sites. Install it first.
</PerformanceNote>

## Fixing Common Issues

### Font Rendering Problems

If web pages show missing characters, boxes, or incorrect fonts, you need to install font packages:

<CopyCommand command="sudo apt install fonts-noto fonts-noto-cjk fonts-noto-color-emoji fonts-liberation" />

This installs comprehensive Unicode coverage including CJK characters and emoji.

### Blank or Garbled Display

If Firefox opens but the window is blank or garbled, force software rendering:

<CopyCommand command="export MOZ_X11_EGL=0 && firefox" />

To make this permanent, add the export to your shell profile:

<CopyCommand command="echo 'export MOZ_X11_EGL=0' >> ~/.bashrc" />

### High Memory Usage

<Troubleshooting items={[
  {
    problem: "Firefox uses too much memory and the system becomes sluggish",
    solution: "Reduce dom.ipc.processCount to 1 in about:config, install Auto Tab Discard, and keep fewer than 5 tabs open simultaneously."
  },
  {
    problem: "Firefox crashes on memory-intensive pages",
    solution: "Enable zram swap if not already active. Close other applications before opening heavy websites. Consider using a lighter browser for casual browsing."
  },
  {
    problem: "Pages load very slowly",
    solution: "Install uBlock Origin to reduce page weight. Disable JavaScript on sites that don't need it using uBlock's per-site controls. Check that dns.prefetch is not overloading your connection."
  }
]} />

## Performance Tips

Follow these practices to keep Firefox responsive on constrained hardware:

<BestPractice>
Keep your open tab count below 5. Each tab consumes 50-150 MB of RAM depending on page complexity. On a device with 4 GB of RAM, 10 open tabs can consume half your available memory.
</BestPractice>

- **Set a lightweight homepage** — use `about:blank` or a static HTML page instead of a content-heavy start page
- **Disable animations** — set `ui.prefersReducedMotion` to `1` in about:config
- **Clear cache regularly** — Firefox's cache can grow large over time; set a cache limit in Preferences > Privacy & Security
- **Use Reader View** — on article-heavy sites, Reader View strips out heavy page elements and reduces memory usage per tab
- **Avoid streaming video in multiple tabs** — video decoding without hardware acceleration is CPU-intensive

## Browser Alternatives

Firefox is the best default, but other browsers work in ADL depending on your needs.

<Decision
  question="Which browser should you use?"
  options={[
    {
      label: "Firefox",
      description: "Best overall balance of compatibility, memory usage, and features. Native ARM64 support from Ubuntu repos.",
      recommended: true
    },
    {
      label: "Chromium",
      description: "Better web app compatibility (PWAs, some Google services). Uses more memory and CPU than Firefox. Install with sudo apt install chromium-browser.",
      recommended: false
    },
    {
      label: "Falkon",
      description: "KDE's lightweight browser. Uses QtWebEngine (Chromium-based) but with a smaller memory footprint. Good for basic browsing.",
      recommended: false
    },
    {
      label: "Midori",
      description: "Minimalist browser with very low resource usage. Limited extension support and some rendering issues on complex sites.",
      recommended: false
    }
  ]}
/>

<Note title="Chromium on ARM64">
Chromium works in ADL but typically uses 30-50% more memory than Firefox for the same set of tabs. If you need Chromium for web app compatibility, apply the same process count and telemetry tweaks described above — Chromium has similar settings under `chrome://flags`.
</Note>

<FAQ items={[
  {
    question: "Can I use Google Chrome instead of Chromium?",
    answer: "Google does not provide an official ARM64 Linux build of Chrome. Use Chromium instead, which is the open-source base of Chrome and is available in the Ubuntu repos."
  },
  {
    question: "Does hardware-accelerated video work?",
    answer: "No. The proot environment does not have access to the GPU for video decoding. All video playback uses software decoding, which is CPU-intensive. Lower the video quality to 480p or 720p for smoother playback."
  },
  {
    question: "Can I sync my Firefox profile from my desktop?",
    answer: "Yes. Sign in to Firefox Sync in both browsers to sync bookmarks, passwords, history, and open tabs between your ADL setup and your desktop Firefox."
  }
]} />
