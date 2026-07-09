---
sidebar_position: 1
title: "Release Notes"
description: "Version history and changelog for the ADL documentation project."
---

# Release Notes

This page documents the version history of the ADL (Android Desktop Linux) documentation project. Each release includes a summary of new content, improvements, and structural changes.

---

## Version 0.1.0

**Released:** July 2026

**Status:** Initial Documentation Platform

This is the inaugural release of the ADL documentation platform, providing a comprehensive foundation for running a full Linux desktop environment on Android devices using Termux, proot, Ubuntu, and XFCE.

### Quick Start Track

Four step-by-step guides that take you from a stock Android device to a running Linux desktop:

- **Termux Setup** --- Installing and configuring the Termux terminal emulator from F-Droid, including initial package updates and essential tool installation.
- **Linux Installation** --- Setting up the proot environment with Ubuntu, configuring the filesystem, and verifying the installation.
- **Desktop Configuration** --- Installing and configuring XFCE as the desktop environment, setting up Termux:X11 as the display server, and launching the graphical interface for the first time.
- **First Steps** --- Post-installation orientation covering basic navigation, package management, and essential customization.

### Learn Track

Conceptual documentation organized into three areas:

- **Concepts** --- Architectural explanations of how ADL works, covering proot internals, display server communication, audio routing, and the relationship between the Android host and Linux guest systems.
- **Hardware Requirements** --- Device-specific considerations including processor architecture, RAM requirements, storage management, display output options, and peripheral connectivity.
- **Software Stack** --- The software stack in detail, from Termux and its packages through the proot layer and into the Ubuntu environment with XFCE.

### Reference Section

Technical reference material for ongoing use, including command documentation and configuration file references for Termux, proot, XFCE, and related components.

### Samsung DeX Integration

A dedicated guide for Samsung Galaxy device owners covering the DeX desktop mode integration with ADL. Includes monitor configuration, resolution settings, keyboard and mouse setup, and optimization techniques specific to the DeX environment.

### Troubleshooting Section

Seven topic-specific troubleshooting pages covering the most common issues encountered during setup and daily use:

- Display and graphics problems
- Audio configuration issues
- Storage and permissions errors
- Network and connectivity failures
- Performance and resource constraints
- Input device and peripheral issues
- Installation and update errors

### Downloads Section

Organized download listings for all required and recommended applications:

- **Required apps** --- Termux, Termux:X11, and other essential components with direct links to F-Droid and GitHub releases.
- **Recommended apps** --- Complementary tools and utilities that enhance the ADL experience.

### FAQ

Frequently asked questions organized into two categories:

- **General questions** --- Covering what ADL is, device compatibility, safety, and expectations.
- **Technical questions** --- Addressing common configuration decisions, performance tuning, and troubleshooting steps.

### Glossary

A comprehensive A-to-Z reference of over 50 technical terms used throughout the documentation, including ADL-specific terminology, Linux concepts, Android internals, and display server vocabulary.

### Contributing Guide

Documentation for contributors, including:

- **How to Contribute** --- Complete workflow from forking the repository to submitting a pull request.
- **Documentation Guide** --- Page structure standards, component usage, cross-linking rules, and the single-source-of-truth principle.
- **Style Guide** --- Voice, tone, formatting conventions, and a word list for correct terminology.
- **Code of Conduct** --- Community standards adapted from the Contributor Covenant.
- **Page Templates** --- Starter templates for guide pages and reference pages.

### Documentation Platform Features

- **21 reusable MDX components** --- Custom components including callouts (Warning, Tip, Note, BestPractice, CommonMistake), interactive elements (CopyCommand, Terminal), layout components (DownloadCard, Requirements), and content organizers (FAQ, Troubleshooting, collapsible sections, tabbed content).
- **Premium documentation theme** --- A custom Docusaurus 3 theme with light and dark mode support, responsive typography, and accessible color schemes.
- **GitHub Actions CI/CD deployment** --- Automated build, validation, and deployment pipeline that checks every change before publishing.
- **Responsive mobile-friendly design** --- Fully adaptive layout that works on phones, tablets, and desktop browsers, ensuring the documentation is accessible from the same devices running ADL.
- **Full-text search** --- Client-side search indexing for fast, offline-capable searching across all documentation content.

### Known Limitations

- Device-specific installation guides are available only for Samsung, OnePlus, and Pixel devices. Other manufacturers will be covered in future releases.
- Video walkthroughs are not yet available. Text and screenshot-based guides are provided for all procedures.
- Application-specific tutorials (IDE setup, browser configuration, development toolchains) are planned but not included in this release.
- Localization is limited to English. Translation support is on the roadmap.

---

## What's Next

### Planned for v0.2.0

The next release will expand the documentation with the following additions:

- **Additional device-specific guides** --- Installation and optimization instructions for Xiaomi, Motorola, and other popular Android manufacturers, along with guidance for generic Android devices.
- **Application tutorials** --- Step-by-step guides for setting up common desktop applications within ADL, including VS Code, Firefox, LibreOffice, GIMP, and development toolchains for Python, Node.js, and Rust.
- **Video walkthroughs** --- Companion video content for the Quick Start track and key configuration procedures, hosted directly within the documentation.
- **Community showcase** --- A gallery of user setups, custom configurations, and creative uses of ADL submitted by community members.
- **Performance benchmarks** --- Quantitative comparisons across devices, helping users understand what level of desktop experience to expect from their hardware.

### Planned for v0.3.0

Further ahead, the project roadmap includes:

- **Alternative desktop environments** --- Guides for running KDE Plasma, LXQt, and i3 as alternatives to XFCE.
- **Advanced networking** --- VPN configuration, SSH server setup, and network service hosting within the ADL environment.
- **Localization** --- Documentation translated into Spanish, Portuguese, Hindi, and other languages based on community interest.

---

<Note>
These plans are subject to change based on community feedback and contributor availability. If you would like to help shape the direction of the project, visit the Contributing section of the documentation.
</Note>
