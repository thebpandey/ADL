# Android Desktop Linux

## The Open Knowledge Base for Desktop Linux on Android

Android Desktop Linux (ADL) is an open-source knowledge base for running
practical desktop Linux environments on Android devices.

ADL brings together beginner-friendly installation guides, hardware
compatibility information, Linux education, technical diagrams, troubleshooting
resources, and community-tested configurations.

Rather than promoting one distribution, device manufacturer, desktop
environment, or installation method, ADL documents the broader
desktop-Linux-on-Android ecosystem.

Created and maintained by **Bhaskar Pandey** ([@thebpandey](https://github.com/thebpandey))
· Android Desktop Linux Project - Almora Technology · [MIT License](LICENSE)

**📖 Published website:** https://thebpandey.github.io/ADL/

## Why ADL exists

Modern flagship Android phones have powerful processors, substantial memory,
external-display output, Bluetooth peripheral support, and access to Linux
userspace environments. But the knowledge needed to build a reliable Android
desktop setup is fragmented across GitHub repositories, forum discussions,
Reddit threads, videos, package documentation, outdated tutorials, and
device-specific instructions.

ADL exists to organize that information into one open, structured,
maintainable, and beginner-friendly knowledge base — with an emphasis on
practical documentation, reproducible procedures, official sources, tested
compatibility, clear troubleshooting, and long-term maintainability.

## What ADL is

- Open documentation for desktop Linux on Android
- Reproducible, beginner-friendly installation guidance
- Linux education for Android users
- Hardware compatibility information
- Device and desktop-mode research
- Troubleshooting documentation
- Community testing and verification
- A long-term, vendor-neutral technical reference

## What ADL is not

- A Linux distribution
- A replacement Android operating system
- A desktop environment
- A commercial product
- A single installer or setup script
- A vendor-specific support site
- A replacement for Termux, Local Desktop, or Samsung DeX

## Project mission

Help people get more value from the Android hardware they already own by
making desktop Linux on Android understandable, reproducible, and practical —
with accessibility for beginners, accuracy, vendor neutrality, community
knowledge, transparent verification, and long-term documentation maintenance.

## Who ADL is for

- **Beginners** who want a working Linux desktop on their phone without prior
  Linux experience.
- **Tinkerers and power users** who want to understand how the pieces fit
  together and optimize their setup.
- **Developers** who want a portable Linux workstation on hardware they
  already own.
- **Contributors** who want to test devices, report compatibility, and
  improve the documentation.

## What you will find

- **Getting Started** — beginner-friendly paths from an Android phone to a
  working desktop.
- **Installation Guides** — documented installation methods using supported
  tools and Linux distributions.
- **Learning Linux** — plain-language explanations of Termux, proot, Linux
  distributions, desktop environments, package managers, filesystems, and
  commands.
- **Hardware Guidance** — information about phones, docks, displays, input
  devices, storage, cables, and workstation setups.
- **Compatibility Database** — structured device, Android-version,
  desktop-mode, Linux, desktop-environment, and peripheral compatibility
  information.
- **Desktop Environments** — guidance comparing XFCE, LXQt, KDE Plasma,
  GNOME, MATE, Cinnamon, and future supported environments.
- **Applications** — guidance for browsers, development tools, office
  applications, terminals, file management, and media tools.
- **Troubleshooting** — systematic help for installation, display,
  permissions, package, performance, audio, and input-device problems.
- **Reference Library** — commands, configuration files, scripts, glossary
  terms, architecture diagrams, and official sources.
- **Community Knowledge** — community testing, verified configurations,
  compatibility reports, documentation improvements, and contributor
  workflows.

## Installation methods

ADL documents multiple approaches rather than a single one. Methods it covers
or plans to cover include Termux, Termux:X11, Local Desktop, Ubuntu, Debian,
Arch Linux, Fedora, Alpine Linux, Samsung DeX, manufacturer desktop modes,
manual proot installations, and future Android–Linux integrations.

Not every method is complete, tested, or equally recommended. Where supported,
each is labeled with a status so readers know how much to trust it:

| Status | Meaning |
|---|---|
| **Documented** | Written up in the docs |
| **Planned** | On the roadmap, not yet documented |
| **Experimental** | Documented but not broadly validated |
| **Community Tested** | Reproduced by community reporters |
| **Maintainer Verified** | Reproduced by a maintainer on reference hardware |
| **Needs Testing** | Based on specs, not yet verified |

Unverified methods are never presented as supported.

## Compatibility platform

The compatibility database is static JSON plus React components — no backend,
fully GitHub Pages compatible. It tracks devices, hardware, distributions,
desktop environments, Android versions, test results, and full verified
configurations, and is also published as a machine-readable interface under
`/ADL/data/*.json` and `/ADL/ai-metadata.json`. Claims never record a status
above what was actually tested; manufacturer-spec claims stay at
`needs-testing`.

See: https://thebpandey.github.io/ADL/docs/compatibility/overview

## Hardware guidance

ADL documents the hardware around the phone — USB-C hubs and docks, external
displays, keyboards, mice, storage, cables, and power — describing hardware
**classes by their specifications** (for example, "USB-C hub with HDMI + 45 W
PD") rather than promoting specific store listings.

## Documentation tracks

- **Quick Start** — for users who want a working desktop as quickly as
  possible.
- **Learn** — for users who want to understand the technologies and
  architecture.
- **Reference** — for commands, configurations, compatibility, troubleshooting,
  glossary terms, and technical lookup.

## Project status

ADL is actively maintained. The documentation, compatibility platform, and
component library are in place; coverage of devices, distributions, desktop
environments, and installation methods continues to expand as configurations
are tested and verified. Compatibility entries reflect only what has actually
been tested — reference-hardware verification is currently focused on the
Samsung Galaxy S22+.

## Published website

**https://thebpandey.github.io/ADL/**

Start with the
[Quick Start guide](https://thebpandey.github.io/ADL/docs/quick-start/overview)
— it walks the full path from installing Termux to launching your desktop.

## Contributing

Contributions are welcome from everyone. Changes are proposed through GitHub
issues and pull requests, reviewed by the maintainer, and merged when they
meet the project's standards. Public access does not mean unrestricted direct
editing — maintainers review every change before it is published.

- **[Contributing](CONTRIBUTING.md)** — how to propose changes, writing
  standards, and pull request workflow
- **[Governance](GOVERNANCE.md)** — roles, decision-making, and reviews

## Support

- **[Support](SUPPORT.md)** — how to get installation help and what to include
  when asking

ADL is **free and open-source** — donations are entirely optional and never
required to use the documentation or to get help. If the project saved you
time and you'd like to support it:

- 💖 **[Sponsor on GitHub](https://github.com/sponsors/thebpandey)**
- ☕ **[Buy Me a Coffee](https://buymeacoffee.com/thebpandey)**
- 💵 **[Cash App — $thebpandey](https://cash.app/$thebpandey)**

All payments go through these external platforms; this project never collects
payment information. You can also support ADL by starring the repo, reporting
bugs, or [contributing](CONTRIBUTING.md).

### Sponsors

Thank you to everyone supporting ADL! GitHub Sponsors are updated
automatically; Buy Me a Coffee and Cash App donors are added on request
(recognition is opt-in).

<!-- sponsors:start -->
_Become the first sponsor!_
<!-- sponsors:end -->

## Security

- **[Security](SECURITY.md)** — how to report security issues privately

## Roadmap

- **Foundation** — installation guides, desktop environment setup, package
  management basics, and troubleshooting.
- **Expansion** — additional distributions and desktop environments,
  development environment setup, and performance guidance.
- **Ecosystem** — application compatibility, workflows, and media and
  networking tools.
- **Community** — broader device and hardware compatibility coverage,
  verified configurations, and contribution growth.

## Local development

The site is built with [Docusaurus 3](https://docusaurus.io/) and TypeScript.

```bash
# Install dependencies
npm ci

# Start the development server (http://localhost:3000)
npm start

# Build for production — fails on broken internal links
npm run build

# Serve the production build locally
npm run serve

# Type-check
npm run typecheck
```

### Repository structure

```text
docs/                   # Documentation content (Markdown/MDX)
data/                   # Compatibility database (source of truth, JSON)
src/
    css/                # Custom stylesheets
    components/         # React components used in docs
    pages/              # Custom pages (landing page)
    theme/              # Theme overrides and MDX component registry
static/
    img/                # Static images and favicon
.github/                # Workflows, issue/PR templates, governance
docusaurus.config.ts    # Docusaurus configuration
sidebars.ts             # Sidebar / navigation configuration
CLAUDE.md               # AI assistant operating standards
```

The site deploys to GitHub Pages automatically via GitHub Actions
(`.github/workflows/deploy.yml`) on every push to `main`. Pull requests are
verified by a build-only workflow that never deploys. If you fork this
project, enable GitHub Pages in **Settings → Pages** with **GitHub Actions**
as the source.

## License

Copyright © 2026 Bhaskar Pandey. Released under the MIT License.
See the [LICENSE](LICENSE) file for details.

## Project attribution

- **Author / project owner:** Bhaskar Pandey ([@thebpandey](https://github.com/thebpandey))
- **Organization:** Android Desktop Linux Project - Almora Technology
- **Copyright:** Copyright © 2026 Bhaskar Pandey. Released under the MIT License.
- **Published website:** https://thebpandey.github.io/ADL/
- **Profiles:** [GitHub](https://github.com/thebpandey) ·
  [LinkedIn](https://www.linkedin.com/in/pandeybhaskar) ·
  [bhaskarpandey.com](https://www.bhaskarpandey.com) ·
  [almora.tech](https://almora.tech)

Contributors are credited when their contributions are approved — merged work
is attributed in the git history and acknowledged in the changelog.

## Trademark disclaimer

Android Desktop Linux is an independent project, not affiliated with or
endorsed by Google or Samsung. All product names, trademarks, and registered
trademarks — including Android, Samsung DeX, Ubuntu, Termux, and XFCE — are
the property of their respective owners.
