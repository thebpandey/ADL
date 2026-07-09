---
sidebar_position: 3
title: "Style Guide"
description: "Writing style, voice, tone, and formatting conventions for ADL documentation."
---

# Style Guide

This guide defines the voice, tone, and formatting rules for ADL documentation. Consistent style makes the documentation easier to read, easier to search, and easier to maintain.

## Voice and Tone

### Be Friendly and Direct

Write as if you are sitting next to the reader, helping them through a task. Be encouraging without being patronizing. Assume the reader is intelligent but may be unfamiliar with Linux.

```mdx
<!-- Good -->
Run the following command to update your packages.

<!-- Too formal -->
The user is advised to execute the subsequent command to effectuate a package update.

<!-- Too casual -->
Just yeet this command into your terminal and you're golden.
```

### Be Technical but Accessible

Use precise technical language, but explain terms that a newcomer might not know. Link to the glossary for specialized vocabulary.

### Use Second Person

Address the reader as "you." Do not use "we," "one," or "the user."

```mdx
<!-- Good -->
You can install additional packages with apt.

<!-- Avoid -->
We can install additional packages with apt.
The user can install additional packages with apt.
```

### Use Active Voice

Write in active voice. Passive voice obscures who is performing the action.

```mdx
<!-- Active -->
Run the command to start the desktop.

<!-- Passive -->
The command should be run to start the desktop.
```

## Heading Conventions

### Use Sentence Case

Capitalize only the first word and proper nouns. Do not use title case.

```mdx
<!-- Correct -->
## Install the desktop environment

<!-- Incorrect -->
## Install the Desktop Environment
## Install The Desktop Environment
```

### Be Descriptive

Headings should tell the reader what they will learn or do. Avoid single-word headings like "Configuration" or "Issues." Instead, write "Configure display resolution" or "Fix black screen on first launch."

### Heading Levels

- `#` --- Page title only. One per page.
- `##` --- Major sections.
- `###` --- Subsections within a major section.
- `####` --- Use sparingly. If you need this level, consider restructuring.

Do not skip levels. A `###` must always appear under a `##`, never directly under `#`.

## Formatting Standards

### Bold and Italics

Use **bold** for UI elements and key terms on first use:

```mdx
Tap **Allow** when prompted.
The **proot** environment runs entirely in userspace.
```

Use *italics* sparingly, primarily for emphasis within a sentence. Do not use italics for UI elements or technical terms.

### Code Formatting

Use inline backticks for:

- Command names: `apt`, `pkg`, `proot-distro`
- File paths: `/etc/apt/sources.list`
- Package names: `xfce4`, `firefox-esr`
- Configuration values: `true`, `1920x1080`

Use `CopyCommand` for commands the reader should execute.

Use fenced code blocks for:

- Configuration file contents
- Multi-line output examples
- Code that should be read but not executed directly

Always specify a language for fenced code blocks (`bash`, `json`, `yaml`, etc.).

### Lists

Use bulleted lists for unordered items. Use numbered lists only when sequence matters.

```mdx
<!-- Bulleted: order does not matter -->
- File manager
- Terminal emulator
- Text editor

<!-- Numbered: order matters -->
1. Open Termux
2. Run the install command
3. Wait for the download to complete
```

### Em-Dashes

Use three hyphens (`---`) for em-dashes. Do not use Unicode em-dash characters.

```mdx
<!-- Correct -->
This tool --- unlike traditional chroot --- does not require root.

<!-- Incorrect -->
This tool — unlike traditional chroot — does not require root.
```

## Link Conventions

### Internal Links

Use relative file paths with the `.md` extension:

```mdx
See the [Termux Setup](../installation/common/termux-setup.md) guide.
```

### External Links

Use descriptive text. Never use "click here" or bare URLs in prose:

```mdx
<!-- Good -->
Download Termux from the [F-Droid repository](https://f-droid.org/packages/com.termux/).

<!-- Bad -->
Download Termux from https://f-droid.org/packages/com.termux/.
Click [here](https://f-droid.org/packages/com.termux/) to download Termux.
```

### Link Density

Do not overload a paragraph with links. If a sentence needs more than two links, restructure it into a list or break it into multiple sentences.

## Accessibility

### Alt Text for Images

Every image must have descriptive alt text that conveys the same information as the image:

```mdx
<!-- Good -->
![XFCE desktop showing the file manager, terminal, and taskbar](./img/xfce-desktop.png)

<!-- Bad -->
![screenshot](./img/xfce-desktop.png)
![](./img/xfce-desktop.png)
```

### Command Descriptions

When presenting a command, always explain what it does before or after showing it. Do not assume the reader can infer the purpose from the command alone.

### Color and Contrast

Do not rely on color alone to convey information. If you reference a colored element in a screenshot, also describe its position or label. Ensure all text and UI elements in screenshots meet WCAG 2.1 AA contrast requirements.

### Structure

Use headings, lists, and components to break up long sections. A wall of text is harder to scan than well-structured content with clear visual hierarchy.

## Word List

Use the correct capitalization and spelling for project-specific and technical terms.

| Correct | Incorrect | Notes |
|---|---|---|
| Termux | termux, TERMUX | Always capitalize as a proper noun |
| Linux | linux, LINUX | Capitalize in prose; lowercase in commands |
| XFCE | xfce, Xfce, XFce | All caps in prose |
| Ubuntu | ubuntu, UBUNTU | Capitalize in prose; lowercase in commands |
| Android | android | Capitalize in prose |
| proot | Proot, PRoot, PROOT | Always lowercase in prose and commands |
| proot-distro | Proot-Distro | Always lowercase with hyphen |
| Termux:X11 | termux-x11, Termux-X11, TermuxX11 | Colon separator, capital X and numbers |
| PulseAudio | pulseaudio, Pulseaudio, PULSEAUDIO | Capital P, capital A |
| F-Droid | f-droid, FDroid, Fdroid | Capital F, hyphen, capital D |
| Samsung DeX | Samsung Dex, samsung dex | Capital D, lowercase e, lowercase x |
| VNC | vnc, Vnc | All caps |
| HDMI | hdmi, Hdmi | All caps |
| USB-C | usb-c, USB-c, Usb-C | All caps except the lowercase c |
| Wi-Fi | wifi, Wifi, WIFI, WiFi | Capital W, hyphen, capital F |
| APK | apk (when referring to file format) | All caps for the format; lowercase in commands |
| GitHub | Github, github | Capital G, capital H |
| ADL | adl | All caps when referring to the project |

## Numbers and Units

- Spell out numbers one through nine in prose. Use digits for 10 and above.
- Always use digits with units: 4 GB, 1920x1080, 30 minutes.
- Use GB, not gb or Gb. Use MB, not mb or Mb.
- Use "x" (lowercase) for dimensions: 1920x1080, not 1920X1080.

## Punctuation

- Use the Oxford comma: "files, folders, and packages."
- End every sentence with a period, including the last item in a bulleted list if the items are complete sentences.
- Do not use exclamation marks in technical documentation.
- Use straight quotes (`"`), not curly quotes.

## Next Steps

- Read the [Documentation Guide](./documentation-guide.md) for page structure and component usage
- Review the [How to Contribute](./how-to-contribute.md) guide for the submission process
