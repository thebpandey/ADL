---
id: documentation-guide
title: "Documentation Guide"
sidebar_position: 2
---

# Documentation Guide

This guide defines the standards, patterns, and templates that all ADL documentation pages must follow. Consistency across every page ensures that readers always know where to find information, regardless of which section they are reading.

## Writing Principles

Every page in this documentation follows these principles:

- **Assume no prior knowledge.** Never assume the reader has used Linux, Termux, or any command line before. If a concept is needed, introduce it first.
- **Explain before you instruct.** Before telling someone to run a command, explain what the command does and why it is needed.
- **One idea per paragraph.** Short paragraphs are easier to scan on mobile devices.
- **Use headings liberally.** Readers scan before they read. Every section should have a clear heading.
- **Show expected results.** After every command or action, show what the reader should see. This builds confidence.
- **Provide recovery paths.** After every section that could fail, include troubleshooting steps.

## Terminology Rules

### Introducing New Terms

Every technical term must be introduced before it is used. Use this pattern:

```md
## What is Termux?

**Termux** is a terminal emulator for Android. Think of it as a way to type
commands on your phone, similar to the Terminal app on a Mac or Command Prompt
on Windows.

We use Termux because it lets us run Linux tools directly on Android without
needing to modify (or "root") the device.
```

### Acronyms

Spell out acronyms on first use, with the abbreviation in parentheses:

```md
Android Desktop Linux (ADL) uses a Virtual Network Computing (VNC) server
to display the Linux desktop.
```

After the first use, the abbreviation alone is acceptable.

### Avoid Jargon

Instead of saying "bootstrap the proot environment," write "set up the Linux environment using proot." Whenever a simpler phrase works, use it.

## Page Structure

Every documentation page must include these sections in this order.

### Front Matter

Every page starts with YAML front matter:

```yaml
---
id: page-id
title: "Page Title"
sidebar_position: 1
---
```

### Page Header

Immediately after front matter, include a metadata block using our components:

```mdx
<Requirements items={[
  "Android 10 or newer",
  "Termux installed (see previous section)",
  "At least 2 GB of free storage",
]} />
```

Include estimated time and difficulty as a brief note at the top:

```md
**Estimated time:** 15 minutes · **Difficulty:** Beginner
```

### Main Content

Write the guide content with frequent headings, code blocks, and component usage. See the component reference below.

### Expected Results

After every command or significant action, show what the reader should expect:

```mdx
<ExpectedResult>
  You should see the text `Hello from Linux!` printed in your terminal.
  If you see an error message instead, check the troubleshooting section below.
</ExpectedResult>
```

### Troubleshooting

Every page that includes commands or installation steps must end with a troubleshooting section:

```mdx
<Troubleshooting items={[
  {
    problem: "Command not found: apt",
    solution: "You may be running this outside of the Linux environment. Make sure you have started proot-distro first by running: proot-distro login ubuntu"
  },
  {
    problem: "Permission denied",
    solution: "Do not use sudo inside proot. Run the command without sudo. If the issue persists, check that you are logged into the correct distribution."
  },
]} />
```

### Summary and Next Steps

End every page with a brief summary and links to the next logical page:

```md
## Summary

In this section, you installed Termux and verified that it works correctly
on your device.

## Next Steps

Continue to [Installing a Linux Distribution](/docs/installation/install-linux-distro)
to set up Ubuntu inside Termux.
```

## Component Reference

These components are available in every MDX page without imports. Use them consistently.

### Callout Variants

Use `<Note>` for supplementary information:

```mdx
<Note title="About storage space">
  The Linux distribution download is approximately 150 MB. After extraction,
  it uses about 500 MB of storage.
</Note>
```

Use `<Tip>` for helpful shortcuts or best practices:

```mdx
<Tip title="Save time with tab completion">
  You can press the Tab key to auto-complete file names and commands in the
  terminal. This saves typing and reduces errors.
</Tip>
```

Use `<Warning>` for actions that could cause problems:

```mdx
<Warning title="Do not install Termux from the Play Store">
  The Google Play Store version of Termux is outdated and will not work
  correctly. Always install Termux from F-Droid.
</Warning>
```

Use `<Callout type="danger">` for actions that could cause data loss:

```mdx
<Callout type="danger" title="This will delete your Linux installation">
  Running this command removes all files inside your Linux distribution.
  Make sure you have backed up any important data before proceeding.
</Callout>
```

### Commands

Use `<CopyCommand>` for single commands the reader needs to copy:

```mdx
<CopyCommand command="pkg update && pkg upgrade -y" />
```

Use `<Terminal>` to show multi-line terminal sessions with output:

```mdx
<Terminal title="Termux">
  $ pkg update
  Hit:1 https://packages.termux.dev/apt/termux-main stable InRelease
  Reading package lists... Done
</Terminal>
```

### Downloads

Use `<DownloadCard>` for any software download:

```mdx
<DownloadCard
  name="Termux"
  description="Terminal emulator for Android"
  url="https://f-droid.org/en/packages/com.termux/"
  version="0.118"
  icon="📱"
/>
```

### Media

Use `<Diagram>` for architecture or flow diagrams:

```mdx
<Diagram
  src="/img/architecture-overview.png"
  alt="ADL architecture showing Termux, proot-distro, and VNC layers"
  caption="How Android Desktop Linux components connect"
/>
```

Use `<ImageComparison>` for before/after screenshots:

```mdx
<ImageComparison
  before="/img/phone-homescreen.png"
  after="/img/phone-linux-desktop.png"
  beforeLabel="Stock Android"
  afterLabel="With ADL"
/>
```

Use `<Video>` for embedded video tutorials:

```mdx
<Video
  src="/video/termux-setup.mp4"
  title="Setting up Termux on a Samsung Galaxy device"
/>
```

### Interactive Elements

Use `<FAQ>` for question-and-answer sections:

```mdx
<FAQ items={[
  {
    question: "Does ADL work on tablets?",
    answer: "Yes. ADL works on any Android device running Android 10 or newer, including tablets."
  },
]} />
```

Use `<CollapsibleSection>` for optional detail:

```mdx
<CollapsibleSection title="What does this command do?">
  The `pkg update` command refreshes the list of available packages from
  the Termux repository. This ensures you get the latest versions when
  you install new software.
</CollapsibleSection>
```

Use `<ProgressChecklist>` for multi-step processes:

```mdx
<ProgressChecklist title="Installation Progress" items={[
  { label: "Install Termux", done: true },
  { label: "Update packages", done: true },
  { label: "Install proot-distro", done: false },
  { label: "Install Ubuntu", done: false },
]} />
```

Use `<Requirements>` at the top of any guide:

```mdx
<Requirements items={[
  "Android 10 or newer",
  "At least 4 GB of free storage",
  "Wi-Fi connection recommended",
]} />
```

## Screenshot Standards

When documentation is ready for screenshots:

- Capture at the highest resolution available on the device.
- Use PNG format for interface screenshots, JPEG for photographs.
- Crop to show only the relevant area.
- Add a descriptive alt text for accessibility.
- Save screenshots to `static/img/` in a folder matching the doc section (for example, `static/img/installation/`).
- Use placeholder text `[Screenshot: description]` until the actual screenshot is available.

## Command Documentation Pattern

Every command shown in the documentation must follow this pattern:

1. **Explain** what the command does in plain language.
2. **Show** the command using `<CopyCommand>` or a code block.
3. **Show expected output** using `<ExpectedResult>` or `<Terminal>`.
4. **List common errors** using `<Troubleshooting>` if the command could fail.

## Download Link Policy

- Every download **must** link to the official project website or official GitHub repository.
- Never link to third-party APK mirrors, file hosting sites, or unofficial sources.
- When multiple installation methods exist, recommend one method and explain why it was chosen.
- Always include the version number when referencing specific software.
