# Android Desktop Linux (ADL)

Documentation for turning modern Android phones into desktop Linux
computers — **no root required**.

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

## License

See the [LICENSE](LICENSE) file for details.
