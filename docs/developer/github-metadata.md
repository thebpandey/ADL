---
sidebar_position: 3
title: "GitHub Repository Metadata"
description: "Canonical values and manual steps for the ADL GitHub repository description, website, and topics."
---

# GitHub Repository Metadata

GitHub's repository **description**, **website**, and **topics** live in
repository settings, not in the codebase, so they cannot be changed by a
normal commit. This page is the canonical record of the values ADL should
use and the exact steps to apply them.

Apply these manually (or with an authenticated GitHub CLI that has
repository-administration permission). Updating them keeps the repository
sidebar consistent with the site's positioning as **the open knowledge base
for desktop Linux on Android**.

## Repository description

```text
Open-source knowledge base for running desktop Linux on Android. Installation guides, hardware compatibility, troubleshooting, and community documentation.
```

**Set it manually:** open
[`github.com/thebpandey/ADL`](https://github.com/thebpandey/ADL) → click the
**⚙ (gear/Edit)** button next to **About** in the right sidebar → paste the
text into **Description** → **Save changes**.

**Set it with the GitHub CLI** (only if it is installed, authenticated, and
has admin rights on the repo):

```bash
gh repo edit thebpandey/ADL \
  --description "Open-source knowledge base for running desktop Linux on Android. Installation guides, hardware compatibility, troubleshooting, and community documentation."
```

## Website

```text
https://thebpandey.github.io/ADL/
```

**Set it manually:** same **About → ⚙ Edit** dialog → **Website** field →
paste the URL → **Save changes**. (You can also tick *"Use your GitHub Pages
website"* if offered.)

**Set it with the GitHub CLI:**

```bash
gh repo edit thebpandey/ADL --homepage "https://thebpandey.github.io/ADL/"
```

## Topics

Add these topics (each is a single lowercase token, no `#`):

```text
android
linux
desktop-linux
linux-desktop
android-desktop
termux
proot
ubuntu
samsung-dex
mobile-computing
usb-c
developer-tools
documentation
knowledge-base
open-source
```

**Set them manually:** **About → ⚙ Edit** dialog → **Topics** field → type
each topic and press <kbd>Enter</kbd> → **Save changes**. Keep any useful
existing topics; only remove a topic if it is misleading.

**Set them with the GitHub CLI:**

```bash
gh repo edit thebpandey/ADL \
  --add-topic android \
  --add-topic linux \
  --add-topic desktop-linux \
  --add-topic linux-desktop \
  --add-topic android-desktop \
  --add-topic termux \
  --add-topic proot \
  --add-topic ubuntu \
  --add-topic samsung-dex \
  --add-topic mobile-computing \
  --add-topic usb-c \
  --add-topic developer-tools \
  --add-topic documentation \
  --add-topic knowledge-base \
  --add-topic open-source
```

:::note Why not automate this in the repo?
Repository description, website, and topics are account/settings data, not
files in the repository, so a pull request cannot change them. They must be
set through the GitHub web UI or an authenticated admin CLI/API call. This
page exists so the intended values are version-controlled and reproducible.
:::
