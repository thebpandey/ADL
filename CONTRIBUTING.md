# Contributing to ADL

Thank you for helping make desktop Linux on Android accessible to everyone.

## Project purpose

ADL (Android Desktop Linux) documents how to turn a modern Android phone into
a desktop Linux computer **without root**, using Termux, proot-distro, and a
desktop environment. Our audience is beginners: people who have never opened
a terminal before should be able to follow every guide.

## Contributor expectations

- Be respectful and constructive — see our [Code of Conduct](docs/contributing/code-of-conduct.md).
- Test what you document. Do not submit commands you have not run or verified
  against official documentation.
- Write for beginners. Explain every step; never assume prior Linux knowledge.
- Keep the scope of each pull request small and focused.

## How to propose changes

1. **Small fixes** (typos, broken links, clarifications): open a pull request
   directly.
2. **New pages or restructuring**: open an issue first using the
   [documentation improvement template](.github/ISSUE_TEMPLATE/documentation_improvement.yml)
   so maintainers can confirm the direction before you invest time.
3. **New device documentation**: open a
   [device support request](.github/ISSUE_TEMPLATE/device_support_request.yml) first.

## How to submit pull requests

1. Fork the repository and create a feature branch (see naming below).
2. Make your changes and run `npm run build` — the build must pass with no
   broken links.
3. Push your branch and open a pull request against `main`.
4. Fill in every section of the pull request template.
5. A maintainer will review; respond to feedback and update your branch.

## Documentation writing standards

Every documentation page must include:

- **Estimated time** and **difficulty** in the intro
- **Requirements** before the first step
- **Expected outcome** so readers know what success looks like
- **Summary** and **next steps** at the end

Every command must include:

- What it does and why the reader is running it
- The expected output
- Common errors and how to recover from them

Style:

- Short sentences. One idea per paragraph.
- Define jargon on first use, or link to the glossary.
- Use the custom MDX components (`<Warning>`, `<Tip>`, `<ExpectedResult>`,
  `<Troubleshooting>`, etc.) consistently — see existing pages for examples.

## Source and citation policy

- Claims about hardware or software behavior must be verifiable: link to
  official documentation, official release notes, or your own tested results
  (state the device and versions you tested on).
- Do not copy text from other sites. Link to sources instead.

## Official download source policy

**Every download link must point to the official project website or the
official GitHub repository.** For Termux and its add-ons, link to F-Droid or
the official termux GitHub organization.

**Never link to unofficial APK mirrors** (APKMirror, APKPure, or similar).
Pull requests containing unofficial mirror links will be rejected.

## Device-specific contribution rules

- Put device-specific content under `docs/installation/<vendor>/`; keep
  shared steps in `docs/installation/common/` and link to them.
- State the exact device model, Android version, and chipset you tested on.
- Do not present one device's behavior as universal — mark differences
  explicitly.

## How to add screenshots

- Place images in `static/img/` using descriptive kebab-case names
  (e.g. `termux-x11-first-launch.png`).
- Crop to the relevant area; compress before committing (PNG or WebP).
- Always include meaningful alt text.
- **Redact personal information** — account names, email addresses, Wi-Fi
  names, and notification content must not appear in screenshots.

## How to add troubleshooting entries

- Add entries to the relevant page in `docs/troubleshooting/` using the
  `<Troubleshooting>` component's `items` prop.
- Each entry needs a `problem` (the symptom as the user sees it) and a
  `solution` (concrete recovery steps).
- If the fix applies to one specific page's workflow, put it on that page
  instead and link to it from the troubleshooting section.

## How to avoid duplicate content

- Search `docs/` for the topic before writing anything new.
- Each concept has one canonical page (usually under `docs/learn/`). Link to
  it; never restate it.
- If two pages start covering the same ground, open an issue proposing a
  merge instead of adding a third.

## Branch naming conventions

```
docs/<short-topic>        # documentation content changes
fix/<short-topic>         # bug fixes (broken links, build errors)
feature/<short-topic>     # site features, components, config
chore/<short-topic>       # tooling, CI, dependencies
```

Example: `docs/pixel-8-installation`, `fix/broken-dex-links`.

## Commit message conventions

- First line: imperative mood, under 72 characters
  (e.g. `Add Pixel 8 installation guide`).
- Leave a blank line, then explain *why* in the body if not obvious.
- One logical change per commit where practical.
