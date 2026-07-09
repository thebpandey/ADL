# Android Desktop Linux

A documentation project for Android Desktop Linux (ADL).

## Purpose

This repository hosts the documentation site for Android Desktop Linux, providing guides, references, and resources for the project.

## Repository Structure

```
docs/                   # Documentation content (Markdown/MDX)
src/
    css/                # Custom stylesheets
    components/         # React components
    pages/              # Custom pages
static/
    img/                # Static images and favicon
    robots.txt          # Search engine directives
screenshots/            # Project screenshots
.github/workflows/      # GitHub Actions CI/CD

docusaurus.config.ts    # Docusaurus configuration
sidebars.ts             # Sidebar configuration
package.json            # Dependencies and scripts
tsconfig.json           # TypeScript configuration
README.md               # This file
LICENSE                 # Project license
```

## Tech Stack

- [Docusaurus 3](https://docusaurus.io/) with TypeScript
- React 18
- Mermaid diagrams
- Local search
- Image zoom
- GitHub Pages deployment via GitHub Actions

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Serve production build locally
npm run serve
```

## GitHub Pages

The site is deployed automatically via GitHub Actions on every push to `main`.

The site will be available at `https://thebpandey.github.io/ADL/`.

To configure GitHub Pages manually:

1. Go to **Settings** > **Pages** in this repository.
2. Under **Source**, select **GitHub Actions**.

## License

See the [LICENSE](LICENSE) file for details.
