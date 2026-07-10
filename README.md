# Android Desktop Linux (ADL)

Documentation for turning modern Android phones into desktop Linux
computers — **no root required**.

Created and maintained by **Bhaskar Pandey** ([@thebpandey](https://github.com/thebpandey))
· Android Desktop Linux Project - Almora Technology · [MIT License](LICENSE)

ADL guides you through installing Termux, Ubuntu (via proot-distro), and a
full XFCE desktop on your Android phone, then connecting it to a monitor,
keyboard, and mouse for a real desktop workstation. Written for beginners:
no prior Linux experience needed.

**📖 Published site:** https://thebpandey.github.io/ADL/

## Getting started

Start with the [Quick Start guide](https://thebpandey.github.io/ADL/docs/quick-start/overview)
— it walks the full path from installing Termux to launching your desktop.

## Project links

- **[Contributing](CONTRIBUTING.md)** — how to propose changes, writing
  standards, and pull request workflow
- **[Support](SUPPORT.md)** — how to get installation help and what to
  include when asking
- **[Security](SECURITY.md)** — how to report security issues privately
- **[Governance](GOVERNANCE.md)** — roles, decision-making, and reviews
- **[License](LICENSE)** — project license

## Repository structure

```
docs/                   # Documentation content (Markdown/MDX)
src/
    css/                # Custom stylesheets
    components/         # React components used in docs
    pages/              # Custom pages (landing page)
static/
    img/                # Static images and favicon
.github/                # Workflows, issue/PR templates, governance
docusaurus.config.ts    # Docusaurus configuration
sidebars.ts             # Sidebar / navigation configuration
CLAUDE.md               # AI assistant operating standards
```

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

## Deployment

The site deploys to GitHub Pages automatically via GitHub Actions
(`.github/workflows/deploy.yml`) on every push to `main`. Pull requests are
verified by a build-only workflow that never deploys.

If you fork this project, enable GitHub Pages in **Settings → Pages** with
**GitHub Actions** as the source.

## Support ADL

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

## Attribution

- **Author / project owner:** Bhaskar Pandey ([@thebpandey](https://github.com/thebpandey))
- **Organization:** Android Desktop Linux Project - Almora Technology
- **Copyright:** Copyright © 2026 Bhaskar Pandey. Released under the MIT License.
- **Published site:** https://thebpandey.github.io/ADL/
- **Profiles:** [GitHub](https://github.com/thebpandey) ·
  [LinkedIn](https://www.linkedin.com/in/pandeybhaskar) ·
  [bhaskarpandey.com](https://www.bhaskarpandey.com) ·
  [almora.tech](https://almora.tech)

Contributors are credited when their contributions are approved — merged work
is attributed in the git history and acknowledged in the changelog.

## License

Copyright © 2026 Bhaskar Pandey. Released under the MIT License.
See the [LICENSE](LICENSE) file for details.

## Trademark Disclaimer

Android Desktop Linux is an independent project, not affiliated with or
endorsed by Google or Samsung.
