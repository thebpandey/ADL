---
sidebar_position: 99
title: "About"
description: "About Android Desktop Linux — the open knowledge base for desktop Linux on Android: mission, vendor-neutral approach, verification model, and how to contribute."
---

# About Android Desktop Linux

## What ADL is

Android Desktop Linux (ADL) is an **open-source knowledge base** for people
who want to use Android devices as practical Linux desktop computers. It
brings beginner-friendly installation guides, hardware compatibility
information, Linux education, technical diagrams, troubleshooting resources,
and community-tested configurations together into one continuously maintained
reference.

ADL is **documentation**, not a product you install. It is not a Linux
distribution, an Android operating system, a desktop environment, a single
installer script, or a vendor-specific support site. Instead, it documents
the broader ecosystem — so whether you use Termux, Termux:X11, Local Desktop,
Ubuntu, Debian, Arch Linux, Samsung DeX, another desktop mode, or a future
solution, ADL helps you understand the options and build a reliable setup.

## Why ADL exists

Modern flagship Android phones have powerful processors, substantial memory,
external-display output, and Bluetooth peripheral support — enough to drive a
real desktop. But the knowledge needed to build a reliable Android desktop is
scattered across GitHub repositories, forum threads, Reddit posts, videos,
package docs, and device-specific tutorials that go stale quickly.

ADL exists to organize that information into one open, structured,
maintainable, and beginner-friendly knowledge base.

## Our mission

Help people get more value from the Android hardware they already own by
making desktop Linux on Android **understandable, reproducible, and
practical**. In service of that mission, ADL commits to:

- **Accessibility for beginners** — every step is spelled out, no prior Linux
  experience assumed.
- **Accuracy** — commands are verified against official sources before they
  are published.
- **Vendor neutrality** — no single distribution, desktop environment,
  manufacturer, or tool is required.
- **Community knowledge** — real reports from real hardware are welcomed and
  credited.
- **Transparent verification** — every compatibility claim carries a status,
  and nothing is recorded above what was actually tested.
- **Long-term maintenance** — documentation is kept current as the ecosystem
  changes.

## Vendor-neutral approach

ADL documents multiple installation methods and technologies side by side
rather than promoting one. Where a method is only partially tested, it is
labeled accordingly (**Documented**, **Planned**, **Experimental**,
**Community Tested**, **Maintainer Verified**, or **Needs Testing**) so
readers always know how much trust to place in it.

## Documentation philosophy

- Write for absolute beginners; assume no terminal experience.
- Never duplicate content — link to the canonical page instead.
- Prefer official sources: project websites, official repositories, and
  F-Droid for Termux. Never link unofficial APK mirrors.
- Every command explains what it does, what output to expect, common errors,
  and how to recover.

## Compatibility and verification model

The [compatibility database](/docs/compatibility/overview) is structured JSON
plus components — devices, hardware, distributions, desktop environments,
Android versions, and verified configurations. Community reports enter as
`community-verified` or `needs-testing`; a maintainer promotes an entry to
`maintainer-verified` only after reproducing it on reference hardware.
Anything that stops working is downgraded, never silently deleted.

## Open-source contribution model

ADL is built in the open. Documentation is version controlled, compatibility
data is structured, and improvements happen publicly. Anyone can report an
error or propose a change through GitHub issues and pull requests. Public
access does **not** mean unrestricted direct editing — maintainers review
every change before it is published, so the reference stays accurate and
vendor-neutral. The documentation will remain freely accessible.

Changes are proposed through issues and pull requests, reviewed by the
maintainer, and merged when they meet the project's standards — see the
[contributing guide](/docs/category/contributing) and
[governance model](https://github.com/thebpandey/ADL/blob/main/GOVERNANCE.md).
**Contributors are credited when their contributions are approved** — merged
work is attributed to its author in the git history, and notable
contributions are acknowledged in the
[changelog](/docs/release-notes/changelog).

## Author and maintainer

ADL is created and maintained by **Bhaskar Pandey**
([@thebpandey](https://github.com/thebpandey)) under the
**Android Desktop Linux Project - Almora Technology**.

- GitHub: [github.com/thebpandey](https://github.com/thebpandey)
- LinkedIn: [linkedin.com/in/pandeybhaskar](https://www.linkedin.com/in/pandeybhaskar)
- Website: [bhaskarpandey.com](https://www.bhaskarpandey.com)
- Almora Technology: [almora.tech](https://almora.tech)

## License

Copyright © 2026 Bhaskar Pandey. Released under the MIT License.

The full license text is in the
[LICENSE](https://github.com/thebpandey/ADL/blob/main/LICENSE) file. In
short: you are free to use, copy, modify, and redistribute this
documentation, provided the copyright notice is preserved.

## Independence disclaimer

ADL is an **independent open-source project**. It is **not affiliated with,
endorsed by, or sponsored by** Samsung, Google, the Termux project, Canonical
(Ubuntu), the Xfce project, or any other company or project referenced in
this documentation, unless explicitly stated otherwise.

All product names, trademarks, and registered trademarks — including
Android, Samsung DeX, Ubuntu, Termux, and XFCE — are the property of their
respective owners and are used here for identification purposes only.

This documentation is provided "as is", without warranty of any kind.
Following these guides is at your own risk; always back up your data first.

## Where to go next

- [Get Started — Quick Start](/docs/quick-start/overview)
- [Compatibility database](/docs/compatibility/overview)
- [Contributing](/docs/category/contributing)
- [Governance](https://github.com/thebpandey/ADL/blob/main/GOVERNANCE.md)
- [Support ADL](/docs/support-adl)
- [GitHub repository](https://github.com/thebpandey/ADL)
