# Android Desktop Linux

A documentation project for Android Desktop Linux (ADL).

## Purpose

This repository hosts the documentation site for Android Desktop Linux, providing guides, references, and resources for the project.

## Repository Structure

```
docs/
    index.html          # Documentation site entry point
    .nojekyll           # Disables Jekyll processing on GitHub Pages
    assets/
        css/            # Stylesheets
        js/             # JavaScript files
        images/         # Image assets
        diagrams/       # Diagram files
    chapters/           # Documentation chapters
    downloads/          # Downloadable resources

screenshots/            # Project screenshots

README.md               # This file
LICENSE                 # Project license
```

## GitHub Pages

This site is configured to be served via GitHub Pages from the `docs/` directory on the `main` branch.

To enable GitHub Pages:

1. Go to **Settings** > **Pages** in this repository.
2. Under **Source**, select **Deploy from a branch**.
3. Choose the `main` branch and `/docs` folder.
4. Click **Save**.

The site will be available at `https://<username>.github.io/ADL/`.

## License

See the [LICENSE](LICENSE) file for details.
