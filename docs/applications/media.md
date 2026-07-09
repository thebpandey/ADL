---
sidebar_position: 5
title: "Media Applications"
description: "Install and configure media players, image editors, and audio tools in ADL, with lightweight alternatives for resource-limited devices."
---

# Media Applications

ADL can handle media playback, image editing, and audio work using the same open-source tools found on full Linux desktops. The main constraint is that proot does not provide GPU access, so every media operation runs on the CPU. Choosing the right application and configuring it properly makes a significant difference in performance.

## Video Playback

### VLC Media Player

VLC is the most popular media player on Linux. It plays virtually every video and audio format without needing separate codec packages, and it has a full graphical interface with playlist management, subtitle support, and streaming capabilities.

<CopyCommand command="apt update && apt install vlc -y" />

After installation, VLC appears in your application menu under **Multimedia**. You can also launch it from the terminal with `vlc`.

<PerformanceNote>
VLC without hardware acceleration relies entirely on your CPU for video decoding. On most Android devices running ADL, 720p video plays smoothly, but 1080p may stutter depending on your processor. Avoid 4K playback entirely.
</PerformanceNote>

#### VLC Performance Settings

Open VLC and navigate to **Tools > Preferences**. Set "Show settings" to **All** at the bottom left, then adjust these values:

| Setting Path | Value | Purpose |
|---|---|---|
| Video > Output modules | X11 video output | Avoids GPU-dependent output modules |
| Input/Codecs > Video codecs > FFmpeg | Threads: 2-4 | Distributes decoding across CPU cores |
| Video > Deinterlace | Off | Saves CPU on progressive content |
| Playlist > Auto | Uncheck preparse | Stops VLC from scanning all files on startup |

<Tip>
If video playback stutters, try reducing the resolution. In VLC, you cannot downscale a local file on the fly, but for network streams you can select a lower quality. For local files, re-encoding to 480p with FFmpeg before playback is a practical workaround.
</Tip>

### Codec Setup

VLC bundles its own codecs, so it handles most formats without extra packages. If you use other media players or need system-wide codec support, install the restricted extras package:

<CopyCommand command="apt install ubuntu-restricted-extras -y" />

This installs commonly needed codecs, fonts, and the FFmpeg suite. It covers MP4, MP3, AAC, H.264, and many other formats.

If you prefer a minimal installation instead of the full extras bundle, install only the codecs you need:

<CopyCommand command="apt install ffmpeg libavcodec-extra -y" />

<Note title="Codec licensing">
The ubuntu-restricted-extras package includes codecs that are free to use but carry patent restrictions in some jurisdictions. For personal use on your own device, this is not a practical concern.
</Note>

### mpv -- Lightweight Alternative

If VLC feels sluggish on your device, mpv is a lighter alternative. It uses fewer resources, has no heavy GUI, and is often faster for simple playback tasks.

<CopyCommand command="apt install mpv -y" />

Play a video file from the terminal:

<CopyCommand command="mpv /path/to/video.mp4" />

mpv uses keyboard controls by default: space to pause, arrow keys to seek, q to quit. It does not have a traditional menu bar, which is what makes it fast.

<Decision
  title="Video Player: VLC vs mpv"
  options={[
    {
      choice: "VLC",
      pros: [
        "Full graphical interface with menus and playlists",
        "Built-in codec support for virtually every format",
        "Familiar to most users"
      ],
      cons: [
        "Higher memory usage (150-300 MB)",
        "GUI overhead can slow playback on weaker devices",
        "Longer startup time"
      ]
    },
    {
      choice: "mpv",
      pros: [
        "Minimal resource usage (50-100 MB)",
        "Faster startup and smoother playback",
        "Excellent for scripting and automation"
      ],
      cons: [
        "No graphical menus or playlist interface",
        "Controlled entirely by keyboard shortcuts",
        "Less intuitive for beginners"
      ]
    }
  ]}
/>

## Image Editing

### GIMP

GIMP is a full-featured image editor comparable to Photoshop. It supports layers, masks, filters, custom brushes, and plugin extensions. Install it from the Ubuntu repositories:

<CopyCommand command="apt install gimp -y" />

GIMP appears in the application menu under **Graphics**. First launch takes longer than usual because it loads fonts, brushes, and plugin data.

<PerformanceNote>
GIMP loads slowly on first launch (30-60 seconds is normal in ADL). Subsequent launches are faster because it caches plugin data. Working with images larger than 3000x3000 pixels may cause noticeable lag during filter operations.
</PerformanceNote>

#### GIMP Memory Configuration

GIMP defaults to using a large tile cache, which can overwhelm devices with limited RAM. Adjust this under **Edit > Preferences > System Resources**:

- **Tile cache size** -- set to 512 MB or less on devices with 4 GB RAM
- **Maximum undo memory** -- set to 128 MB to prevent undo history from consuming too much RAM
- **Number of undo levels** -- reduce to 10-15 for large images

### mtPaint -- Lightweight Alternative

For quick image edits, crops, and simple drawings, mtPaint uses a fraction of the resources GIMP requires. It loads in seconds and handles common tasks without the overhead of a professional editing suite.

<CopyCommand command="apt install mtpaint -y" />

<Decision
  title="Image Editor: GIMP vs mtPaint"
  options={[
    {
      choice: "GIMP",
      pros: [
        "Professional-grade editing with layers and masks",
        "Extensive filter and plugin ecosystem",
        "Handles complex photo manipulation"
      ],
      cons: [
        "Slow startup (30-60 seconds)",
        "High memory usage with large images",
        "Steep learning curve"
      ]
    },
    {
      choice: "mtPaint",
      pros: [
        "Starts in under 2 seconds",
        "Very low memory footprint (under 30 MB)",
        "Simple interface for basic tasks"
      ],
      cons: [
        "No layer support",
        "Limited filter options",
        "Not suitable for complex photo editing"
      ]
    }
  ]}
/>

## Audio Editing

### Audacity

Audacity is the standard open-source audio editor. It records, edits, and exports audio in multiple formats. It works well for podcasting, voice recording, music editing, and basic audio cleanup.

<CopyCommand command="apt install audacity -y" />

Audacity appears in the application menu under **Multimedia**. It requires a working audio setup, which in ADL means PulseAudio must be configured and connected to Termux's audio server.

<Warning title="Audio output in proot">
Audio playback in proot requires PulseAudio to be running and properly configured. If you hear no sound, verify that PulseAudio is started and that the PULSE_SERVER environment variable is set. See your desktop setup guide for audio configuration details.
</Warning>

#### Audacity Performance Tips

- Set the project sample rate to 44100 Hz (CD quality) rather than higher rates unless you specifically need them
- Use 16-bit depth instead of 32-bit float for basic editing tasks
- Close the spectrogram view when not needed, as it continuously recalculates and uses CPU
- Export to OGG or MP3 rather than uncompressed WAV to save storage space

### Alternative: Command-Line Audio with FFmpeg

For batch audio conversion, trimming, or format changes, FFmpeg handles these tasks without a GUI and with minimal resource usage:

<CopyCommand command="apt install ffmpeg -y" />

Convert an audio file to MP3:

<CopyCommand command="ffmpeg -i input.wav -codec:audio libmp3lame -qscale:audio 2 output.mp3" />

Trim audio to a specific time range:

<CopyCommand command="ffmpeg -i input.mp3 -ss 00:00:30 -to 00:02:00 -c copy trimmed.mp3" />

<Tip>
FFmpeg is already included if you installed ubuntu-restricted-extras or libavcodec-extra earlier. Check with `ffmpeg -version` before installing it again.
</Tip>

## General Performance Considerations

Every media application in ADL shares the same constraints: no GPU acceleration, limited RAM shared with Android, and CPU-only processing. These guidelines apply across the board:

- **Close Android apps** before doing media work. Games, social media apps, and browsers running on the Android side consume RAM that ADL applications need.
- **Avoid multitasking heavy applications.** Running VLC and GIMP simultaneously on a 4 GB device will cause both to slow down or crash.
- **Prefer lightweight alternatives** on devices with 4 GB of RAM or less. mpv, mtPaint, and FFmpeg cover most everyday needs with far less overhead.
- **Monitor memory usage** with `free -h` in the terminal. If available memory drops below 500 MB, close applications before they start swapping.

<CopyCommand command="free -h" />

<Decision
  title="Overall Media Strategy by Device RAM"
  options={[
    {
      choice: "4 GB RAM or less: lightweight tools",
      pros: [
        "mpv, mtPaint, and FFmpeg run comfortably",
        "Leaves headroom for Android to function",
        "Fast startup and responsive editing"
      ],
      cons: [
        "No professional image editing (no GIMP)",
        "No graphical audio editor",
        "Requires comfort with terminal commands"
      ]
    },
    {
      choice: "6 GB RAM or more: full applications",
      pros: [
        "VLC, GIMP, and Audacity all run well",
        "Full graphical interfaces for every task",
        "Closer to a traditional desktop experience"
      ],
      cons: [
        "Still need to manage open applications carefully",
        "Longer startup times for heavy applications",
        "Android background apps may need to be closed"
      ]
    }
  ]}
/>
