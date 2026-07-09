---
sidebar_position: 1
title: "How to Contribute"
description: "Learn how to contribute to the ADL documentation --- from fixing a typo to writing a full guide."
---

# How to Contribute

The ADL documentation is open source and lives alongside the project on GitHub. Whether you want to fix a typo, clarify a confusing section, or write an entirely new guide, your contributions are welcome.

This page walks you through the entire process --- from setting up your local environment to submitting a pull request.

## Before You Start

Read our [Code of Conduct](./code-of-conduct.md) before contributing. We expect all contributors to follow it.

Familiarize yourself with the project's documentation standards by reading the [Documentation Guide](./documentation-guide.md) and [Style Guide](./style-guide.md). These will save you revision cycles during review.

## Ways to Contribute

There are many ways to help, and not all of them require writing new pages:

- **Fix typos and broken links** --- small fixes are always appreciated
- **Improve existing guides** --- add missing steps, clarify confusing instructions, update outdated commands
- **Report documentation issues** --- open a GitHub Issue describing what is wrong or missing
- **Write new guides** --- cover a topic that the documentation does not address yet
- **Add screenshots** --- annotated screenshots help visual learners
- **Test instructions** --- follow a guide on your own device and report whether it works as written

## GitHub Workflow

### 1. Fork the Repository

Go to the ADL repository on GitHub and click the **Fork** button in the top-right corner. This creates your own copy of the repository.

### 2. Clone Your Fork

<CopyCommand command="git clone https://github.com/YOUR-USERNAME/ADL.git" />

Replace `YOUR-USERNAME` with your actual GitHub username.

### 3. Create a Branch

Always create a new branch for your changes. Use a descriptive name that reflects what you are working on.

<CopyCommand command="cd ADL" />

<CopyCommand command="git checkout -b docs/fix-termux-setup-typo" />

Branch naming conventions:

- `docs/add-bluetooth-guide` --- for new documentation
- `docs/fix-termux-setup-typo` --- for fixing existing content
- `docs/update-xfce-screenshots` --- for updating visuals or media

### 4. Make Your Changes

Edit or create files in the `docs/` directory. See the [Documentation Guide](./documentation-guide.md) for page structure and component usage.

### 5. Test Locally

Before submitting, always verify your changes look correct in the browser. See the [Local Development](#local-development) section below.

### 6. Commit and Push

<CopyCommand command="git add docs/" />

<CopyCommand command="git commit -m 'docs: fix typo in Termux setup guide'" />

<CopyCommand command="git push origin docs/fix-termux-setup-typo" />

Use descriptive commit messages. Prefix documentation commits with `docs:`.

### 7. Open a Pull Request

Go to your fork on GitHub and click **Compare & pull request**. In your PR description:

- Summarize what you changed and why
- Link to any related GitHub Issues
- Note if you tested the instructions on a specific device

## Local Development

### Prerequisites

You need Node.js (version 18 or later) and npm installed on your machine.

### Install Dependencies

<CopyCommand command="npm install" />

### Start the Development Server

<CopyCommand command="npm start" />

This launches a local server at `http://localhost:3000` with hot reloading. Changes you make to documentation files will appear in the browser immediately.

### Build for Production

To verify that your changes build without errors:

<CopyCommand command="npm run build" />

<Warning>Always run a production build before submitting a pull request. Some issues --- like broken links or invalid MDX syntax --- only surface during the build step, not during local development.</Warning>

## Using Components

ADL documentation uses custom MDX components that are globally available. You do not need to import them. Here are the most common ones:

### Callout Components

Use callouts to highlight important information:

```mdx
<Warning>This action cannot be undone.</Warning>

<Tip>You can press Ctrl+C to cancel at any time.</Tip>

<Note>This feature requires Android 10 or later.</Note>
```

### Copyable Commands

Use `CopyCommand` for any command the reader should run:

```mdx
<CopyCommand command="pkg update && pkg upgrade -y" />
```

### Terminal Output

Use `Terminal` to show a command alongside its expected output:

```mdx
<Terminal command="proot-distro list" output="ubuntu - Ubuntu 22.04" />
```

### Best Practices and Common Mistakes

```mdx
<BestPractice>Always update packages before installing new ones.</BestPractice>

<CommonMistake>Do not run Termux commands inside the Ubuntu proot environment.</CommonMistake>
```

For the full component reference, see the [Documentation Guide](./documentation-guide.md).

## Writing Guidelines Summary

These are the key points. See the [Style Guide](./style-guide.md) for the full reference.

1. **Write in the second person.** Address the reader as "you."
2. **Use active voice.** Write "Run the command" instead of "The command should be run."
3. **Be specific.** Write "Tap the three-dot menu in the top-right corner" instead of "Open the menu."
4. **Test every command.** If you include a command, verify that it works.
5. **One idea per paragraph.** Keep paragraphs short and focused.
6. **Use components.** Prefer `CopyCommand` over plain code blocks for commands the reader should run.

## Pull Request Review Process

After you submit a pull request:

1. A maintainer will review your changes, usually within a few days
2. You may receive feedback requesting changes --- this is normal and constructive
3. Make any requested changes by pushing additional commits to the same branch
4. Once approved, a maintainer will merge your pull request

<Tip>Small, focused pull requests are reviewed faster than large ones. If you are making many changes, consider splitting them into separate PRs.</Tip>

## Reporting Issues

If you find a problem but do not have time to fix it, open a GitHub Issue. Include:

- The page URL or file path
- What is wrong (broken command, outdated information, confusing instructions)
- What device and Android version you are using, if relevant
- The expected behavior or correct information, if you know it

## Getting Help

If you are unsure about anything, open a GitHub Issue with your question. The maintainers and community are happy to help you get started.

## Next Steps

- Read the [Documentation Guide](./documentation-guide.md) for page structure and component details
- Read the [Style Guide](./style-guide.md) for writing conventions
- Browse the [Page Templates](./templates/guide-template.md) for a starting point when writing new pages
