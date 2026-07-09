# CLAUDE.md — AI Operating Standards for ADL

This file defines how Claude Code (and other AI assistants) must operate in
this repository. These rules are binding for all AI-generated contributions.

## About this project

ADL (Android Desktop Linux) is an open-source documentation project that helps
users turn modern Android phones into desktop Linux computers **without root**.
The site is built with Docusaurus 3 (TypeScript) and deployed to GitHub Pages.

## Git workflow

- **Never push directly to `main`.**
- **Always create a feature branch** for any change.
- **Always open a pull request** — every change reaches `main` through review.
- Do not force-push shared branches without explicit approval.

## Content rules

- **Never duplicate documentation.** Before writing, search `docs/` for an
  existing page covering the topic. **Always reuse canonical pages** and link
  to them instead of restating their content.
- **Never link to unofficial APK mirrors.** No APKMirror, APKPure, or similar.
- **Always prefer official sources**: official project websites, official
  GitHub repositories, official documentation, and F-Droid for Termux.
- **Always verify commands before publishing.** Run them where possible, or
  verify against official documentation. Do not publish guessed commands.
- **Always write for beginners.** Assume the reader has never used Linux or a
  terminal. Spell out every step.

## Required structure for commands

Every command shown in documentation must include:

1. **Explanation** — what the command does and why the reader is running it
2. **Expected output** — what the reader should see when it works
3. **Common errors** — the failure modes readers actually hit
4. **Recovery steps** — how to get unstuck when it fails

## Required structure for documentation pages

Every documentation page must include:

- **Estimated time** to complete
- **Difficulty** level
- **Requirements** (hardware, software, prior steps)
- **Expected outcome** — what the reader will have when done
- **Summary** of what was covered
- **Next steps** — links to the pages that follow

## Site integrity

- **Preserve internal links.** When renaming or moving pages, update every
  page that links to them. Build with `onBrokenLinks: "throw"` and fix all
  errors before committing.
- **Update navigation** (`sidebars.ts` and category files) when adding pages.
- Run `npm run build` before opening a pull request; a failing build must not
  be pushed.

## When uncertain

- **Do not guess.** Open an issue describing the uncertainty, or leave a
  clearly marked `TODO:` comment explaining what needs verification.
- **Do not delete content without explicit approval** from a maintainer.

## Hard limits

- **Do not change repository settings** — no branch protection, rulesets,
  GitHub Pages settings, or collaborator permissions.
- **Do not touch secrets** — never read, write, log, or commit tokens, keys,
  or credentials of any kind.
