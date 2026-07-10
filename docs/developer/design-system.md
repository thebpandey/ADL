---
sidebar_position: 1
title: "Design System & Components"
description: "How contributors use the ADL component library, metadata schema, and documentation intelligence features."
---

# Design System & Components

This page is the contributor reference for the ADL design system: every
reusable component, the frontmatter metadata schema, and how the automatic
"documentation intelligence" features work. Reader-facing pages should never
need custom HTML — compose these components instead.

All components are registered globally for MDX: use them in any `docs/` page
without imports. Everything works offline, statically, with dark mode,
mobile layouts, and keyboard accessibility built in.

## The metadata schema

Every documentation page supports this standardized frontmatter. Declare only
what applies — every field is optional, and pages without metadata render
exactly as before.

```yaml
---
title: "Install Termux"
description: "Installing Termux from F-Droid."
sidebar_position: 2

# Learning metadata
difficulty: Beginner            # Beginner | Intermediate | Advanced
estimated_time: "10 minutes"
estimated_reading_time: "4 min" # optional; computed automatically if omitted
prerequisites:
  - /docs/quick-start/install-termux
next_topics:
  - /docs/quick-start/install-ubuntu
related_topics:
  - /docs/learn/concepts/what-is-termux

# Verification metadata
tested_device: "Samsung Galaxy S22+"
tested_android_version: "Android 16"
tested_date: "July 2026"
last_verified: "2026-07-10"
documentation_version: "1.0"
status: verified                # verified | community | deprecated

# Requirements metadata
required_hardware:
  - "USB-C hub with HDMI"
required_software:
  - "Termux from F-Droid"
estimated_download: "2 GB"

# Discoverability
keywords:
  - samsung dex
  - usb-c hub
compatibility:
  - samsung-dex
  - displayport
  - tested
---
```

### What the metadata does automatically

A theme wrapper (`src/theme/DocItem/Content`) reads this frontmatter on every
page and renders — with zero markup in the page itself:

- **Difficulty / time pills** (`difficulty`, `estimated_time`) plus the
  computed reading time
- **Page health indicator** — Verified (fresh `last_verified`), Needs Review
  (stale), Community Updated, or Deprecated (`status`)
- **Verification banner** (`tested_device`, `tested_android_version`,
  `tested_date`, `documentation_version`)
- **Compatibility badges** (`compatibility` list)
- **Requirements card** (`required_hardware`, `required_software`,
  `estimated_download`)
- **Learning path navigation** — previous lesson is derived automatically
  from other pages' `next_topics`; next lesson from this page's
- **"Continue learning" cards** (`next_topics`) and **Related articles**
  (`related_topics`, falling back to same-category pages with shared
  `keywords`)
- **Reading progress bar** with percent complete and the current heading

The data source is `src/data/docs-index.json`, generated at build time by
`scripts/generate-docs-index.mjs` (runs automatically via `npm run build` /
`npm start`, or manually with `npm run docs:index`). Regenerate it after
adding pages or changing learning-path frontmatter.

## Component reference

### Callouts and notices

- `<AdlCallout type="tip|warning|danger|note|success" title="...">` — the
  standard callout. Prefer it over raw blockquotes.
- `<VersionCallout status="verified|updated|deprecated|experimental|community" detail="July 2026">` —
  version and lifecycle notices.
- `<ExpectedResult>` — green "what success looks like" panel after a step.
- `<VerificationBanner device="..." androidVersion="..." verifiedDate="..." />` —
  standalone verified-on banner (usually driven by frontmatter instead).

### Commands

`<CommandCard>` is the standard way to document a command:

```mdx
<CommandCard
  title="Update packages"
  command="pkg update && pkg upgrade -y"
  purpose="Refreshes the package list and installs updates."
  expectedResult="Package lists download and upgrades complete without errors."
  os="Termux"
  commonErrors={[
    "repository is under maintenance or down",
  ]}
  recoveryTips={[
    "Run termux-change-repo and pick another mirror.",
  ]}
/>
```

Copy button and copied confirmation come from the Docusaurus code block.
Every command needs: explanation, expected output, common errors, recovery
steps (see CLAUDE.md).

### Learning and navigation

- `<NextSteps items={[{title, description, to}]} />` — end-of-page cards.
  Auto-generated from `next_topics`; use manually only for curated sets.
- `<RelatedArticles items={[...]} />` — responsive related-page cards
  (auto-generated from `related_topics`).
- `<LearningPathNav previous={...} current={...} next={...} />` — lesson
  strip (auto-generated for pages in a learning path).
- `<ProgressChecklist title="..." storageKey="quick-start" items={[{label, done}]} />` —
  interactive checklist. With `storageKey`, ticked steps persist in
  localStorage and a Reset button appears.

### Requirements and metadata

- `<RequirementsCard difficulty estimatedTime requiredHardware requiredSoftware estimatedDownload />`
- `<PageMeta difficulty estimatedTime device lastTested />` — compact pills
  (usually driven by frontmatter instead).

### Compatibility

`<CompatibilityBadge type="..." />` with types: `samsung-dex`,
`displayport`, `bluetooth`, `external-storage`, `external-display`,
`keyboard`, `mouse`, `tested`, `experimental`, `community-verified`.
Or declare a `compatibility:` list in frontmatter for an automatic row.

### Glossary tooltips

Wrap a term's first use per page:

```mdx
<GlossaryTerm term="proot">proot</GlossaryTerm>
```

Known terms: Termux, proot, XFCE, desktop environment, DisplayPort, USB-C
dock, Linux distribution, Samsung DeX, package manager, shell. Unknown terms
degrade to a link to the glossary. The tooltip works on hover and keyboard
focus, with no JavaScript.

### Troubleshooting

- `<TroubleshootingCard problem="..." solution="..." />` — one collapsible
  problem/solution pair.
- `<Troubleshooting items={[{problem, solution}]} />` — the classic list.
- `<TroubleshootingNavigator />` — the interactive decision tree (display /
  install / performance / permissions / packages). Pass `branches` to
  customize; built from native `details` so it needs no JavaScript.

### Downloads and hardware

- `<DownloadHub items={[{application, version, officialDownload, installationPage}]} />` —
  official downloads paired with install guides. Official sources only.
- `<DownloadCard name description url version size />` — single download.
- `<HardwareCard name category recommended notes link image />` — hardware
  recommendation card.
- `<HardwareGrid items={[...]} />`, `<HardwareChecklistCards />` — grids.

### Layout and visuals

- `<InfoGrid columns={3}>` / `<FeatureGrid columns={3}>` +
  `<FeatureCard icon title description to />` — responsive 2–4 column grids
- `<ChapterHeader kicker title description />` — section opener
- `<HeroImage image alt caption />` — section hero (static/img/heroes/)
- `<SvgDiagram src alt caption />` — notebook diagrams (static/img/diagrams/,
  see `diagram-manifest.json`)
- SVG UI assets live under `static/img/ui/` (dividers, corners, patterns,
  icons, badges)

## Search & discoverability

Add `keywords:` frontmatter with synonyms, aliases, hardware names, and
command names — they feed the docs index and page SEO. Write headings with
the words readers actually search for.

## Future AI integration hooks

No AI is implemented. The stable, machine-readable interface for future
assistants is generated at build time:

- `static/ai-metadata.json` — every page's metadata: learning paths,
  prerequisites, compatibility, verification state, and the commands the
  page teaches (extracted from CommandCard/CopyCommand/bash blocks)
- Schema is versioned (`schemaVersion`); breaking changes bump it

An assistant can consume this file offline to answer "what do I install
next?", "which commands does this page run?", or "is this guide verified on
my device?" without scraping HTML.

## Best practices

1. **Metadata first.** Prefer frontmatter over hand-placed components — one
   source of truth, consistent rendering, machine-readable.
2. **Never duplicate documentation.** Link to the canonical page; use
   `related_topics` rather than restating content.
3. **Official sources only** in every DownloadHub/DownloadCard.
4. **One glossary tooltip per term per page** — first use only.
5. **Run `npm run build`** before opening a PR: it regenerates the docs
   index and fails on broken links.
