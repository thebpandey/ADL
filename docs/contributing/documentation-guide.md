---
sidebar_position: 2
title: "Documentation Guide"
description: "Standards for writing and structuring ADL documentation pages --- frontmatter, components, cross-linking, and the single-source-of-truth principle."
---

# Documentation Guide

This guide defines the standards for all ADL documentation pages. Follow these conventions to keep the documentation consistent, maintainable, and easy to navigate.

## Page Structure

Every documentation page follows the same general structure:

1. **Frontmatter** --- metadata that controls sidebar placement and SEO
2. **Title heading** --- a single `#` heading matching the frontmatter title
3. **Introduction** --- one to three paragraphs explaining what the page covers and who it is for
4. **Body sections** --- the main content, organized under `##` headings
5. **Cross-links** --- links to related pages, usually in a "Next Steps" or "Related Pages" section at the bottom

### Frontmatter

Every page must begin with YAML frontmatter:

```yaml
---
sidebar_position: 1
title: "Your Page Title"
description: "A one-sentence description of what this page covers."
---
```

- `sidebar_position` controls the ordering within a sidebar category. Lower numbers appear first.
- `title` is displayed in the sidebar and in browser tabs. Use sentence case.
- `description` appears in search results and link previews. Keep it under 160 characters.

### Title Heading

After the frontmatter, include a single `#` heading that matches the `title` field:

```mdx
# Your Page Title
```

Do not use more than one `#` heading per page.

### Introduction

Write one to three paragraphs that answer these questions:

- What does this page cover?
- Who is this page for?
- What will the reader be able to do after reading it?

Do not start the introduction with "This page..." every time. Vary your openings.

## Component Usage Guide

ADL documentation uses custom MDX components. These are globally available --- you do not need to import them.

### Warning

Use `Warning` for actions that could cause data loss, break a setup, or are difficult to reverse.

```mdx
<Warning>Uninstalling Termux removes all Linux distributions and their data. Back up important files first.</Warning>
```

### Tip

Use `Tip` for helpful shortcuts, time-savers, or non-obvious features.

```mdx
<Tip>Long-press the Termux notification to access session controls without leaving your current app.</Tip>
```

### Note

Use `Note` for supplementary information that is relevant but not critical.

```mdx
<Note>This feature was introduced in Termux version 0.118. Earlier versions do not support it.</Note>
```

### BestPractice

Use `BestPractice` for recommended approaches and patterns.

```mdx
<BestPractice>Run apt update before installing any new package to ensure you get the latest version.</BestPractice>
```

### CommonMistake

Use `CommonMistake` for errors that readers frequently make.

```mdx
<CommonMistake>Do not install Termux from the Google Play Store --- it is outdated. Use F-Droid or the GitHub releases page instead.</CommonMistake>
```

### CopyCommand

Use `CopyCommand` for any command the reader should run. It renders a code block with a copy button.

```mdx
<CopyCommand command="pkg install git -y" />
```

<CopyCommand command="pkg install git -y" />

Always prefer `CopyCommand` over a plain fenced code block for executable commands. Reserve fenced code blocks for configuration files, code snippets, and output examples.

### Terminal

Use `Terminal` to show a command alongside its expected output. This helps readers verify that a command worked correctly.

```mdx
<Terminal command="proot-distro list" output="Installed:
  ubuntu - Ubuntu 22.04" />
```

<Terminal command="proot-distro list" output="Installed:
  ubuntu - Ubuntu 22.04" />

### Requirements

Use `Requirements` to present a checklist of prerequisites at the top of a guide.

```mdx
<Requirements items={["Android 10 or later", "At least 4 GB of RAM", "2 GB of free storage"]} />
```

<Requirements items={["Android 10 or later", "At least 4 GB of RAM", "2 GB of free storage"]} />

### DownloadCard

Use `DownloadCard` to present a downloadable app or resource with a clear call to action. These are typically used in the Downloads section.

### FAQ and Troubleshooting

For FAQ sections, use standard Markdown headings with a question-and-answer structure. For troubleshooting pages, organize entries under `###` headings named after the symptom, followed by **Cause** and **Solution** subheadings.

## Command Documentation Pattern

When documenting a command, follow this pattern:

1. Briefly explain what the command does
2. Show the command with `CopyCommand`
3. Show the expected result with `Terminal` or describe what the reader should see
4. Note any common errors with `CommonMistake`

Example:

```mdx
Update your package list to ensure you can install the latest versions:

<CopyCommand command="apt update && apt upgrade -y" />

<Terminal command="apt update" output="Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Reading package lists... Done" />

<CommonMistake>If you see "Permission denied," make sure you are inside the Ubuntu proot environment, not in the Termux shell.</CommonMistake>
```

## Cross-Linking Rules

### Use Relative Paths

Always use relative file paths for internal links, not absolute URLs:

```mdx
<!-- Correct -->
See the [Architecture Overview](../learn/concepts/architecture.md) page.

<!-- Incorrect -->
See the [Architecture Overview](https://adl-docs.example.com/learn/concepts/architecture) page.
```

Relative paths are validated at build time. If a linked page is moved or deleted, the build will fail, alerting you to fix the link. Absolute URLs break silently.

### Link Text

Write descriptive link text. Avoid "click here" or "this page."

```mdx
<!-- Correct -->
Learn how to [install Ubuntu in proot](../installation/common/ubuntu-setup.md).

<!-- Incorrect -->
To install Ubuntu in proot, [click here](../installation/common/ubuntu-setup.md).
```

### Linking to Sections

Link to specific sections using the heading's anchor:

```mdx
See [Storage Permissions](../installation/common/termux-setup.md#storage-permissions).
```

## Screenshot Standards

When adding screenshots to documentation:

- **Format:** PNG only.
- **Width:** Maximum 1200 pixels wide. Resize larger images before adding them.
- **Annotations:** Use red rectangles or arrows to highlight relevant areas. Use a consistent annotation style.
- **Alt text:** Always include descriptive alt text for accessibility.
- **File naming:** Use lowercase, hyphen-separated names: `termux-storage-permission.png`, not `Screenshot_2024.png`.
- **Location:** Store screenshots in a `img/` subdirectory alongside the page that uses them.

Example:

```mdx
![Termux storage permission dialog showing Allow and Deny buttons](./img/termux-storage-permission.png)
```

## The Single-Source-of-Truth Principle

Define every concept, procedure, or configuration detail in exactly one place. Everywhere else, link to that canonical location.

### Why This Matters

When the same information appears on multiple pages, updates become error-prone. If you change the Termux installation steps on one page but forget the other three, readers get conflicting instructions.

### How to Apply It

- **Procedures:** Write the full steps on one page. On other pages, write a brief summary and link to the canonical page.
- **Definitions:** Define terms in the [Glossary](/docs/glossary/terms). Reference them rather than redefining them.
- **Commands:** If a command appears in multiple guides, document it fully in the relevant reference page and link to it from guides.

<BestPractice>Before writing a new section, search the existing documentation. If the information already exists, link to it instead of duplicating it.</BestPractice>

### Exception

Brief reminders are acceptable when the reader needs context to continue. For example, a guide can say "Make sure you have completed the [Termux setup](../installation/common/termux-setup.md) before proceeding" without repeating the full setup instructions.

## File and Directory Conventions

- **File names:** Lowercase, hyphen-separated. Example: `install-termux.md`, not `InstallTermux.md`.
- **Category files:** Each directory must have a `_category_.json` file defining its sidebar label and position.
- **Page templates:** Use the templates in the [Page Templates](./templates/guide-template.md) section as a starting point for new pages.

## Next Steps

- Review the [Style Guide](./style-guide.md) for voice, tone, and formatting conventions
- Use the [Guide Page Template](./templates/guide-template.md) or [Reference Page Template](./templates/reference-template.md) when creating new pages
- Read [How to Contribute](./how-to-contribute.md) for the pull request workflow
