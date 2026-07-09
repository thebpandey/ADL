---
id: style-guide
title: "Style Guide"
sidebar_position: 4
---

# Style Guide

This style guide ensures consistency across all ADL documentation. Every contributor should read this before writing or editing any page.

## Voice and Tone

- **Friendly and encouraging.** The reader is learning something new. Celebrate small wins.
- **Conversational but accurate.** Write as if explaining to a friend, but never sacrifice technical accuracy.
- **Direct and active.** Use "Run this command" instead of "The command should be run."
- **Inclusive.** Use "you" to address the reader. Avoid "we" when giving instructions (reserve "we" for describing project decisions).

## Formatting Standards

### Headings

- Use sentence case for all headings: "Installing a desktop environment" not "Installing a Desktop Environment."
- Use heading levels sequentially. Never skip from `##` to `####`.
- Start each page with a single `#` heading that matches the front matter `title`.

### Code

- Use backticks for inline code: `apt install`, `~/.bashrc`, `port 5901`.
- Use fenced code blocks with language tags for multi-line code.
- Always specify the language: ` ```bash `, ` ```json `, ` ```yaml `.
- Include the `title` attribute for code blocks that represent files:

````md
```bash title="~/.bashrc"
export DISPLAY=:1
```
````

### Lists

- Use numbered lists for sequential steps (order matters).
- Use bullet lists for non-sequential items (order does not matter).
- Keep list items parallel in grammar: all start with a verb, or all are noun phrases.

### Links

- Use descriptive link text: "see the [installation guide](/docs/installation/overview)" not "click [here](/docs/installation/overview)."
- Use relative paths for internal links: `/docs/installation/overview`.
- Use full URLs for external links with `target="_blank"`.

### Images

- Always include descriptive `alt` text.
- Use captions to explain what the reader should notice.
- Place images immediately after the text that references them.

## Page Metadata Template

Every page that includes instructions must start with these two lines below the `#` heading:

```md
**Estimated time:** 15 minutes · **Difficulty:** Beginner
```

Difficulty levels are: **Beginner**, **Intermediate**, **Advanced**.

## Word List

Use these terms consistently:

| Use This | Not This |
|---|---|
| Android Desktop Linux | android desktop linux, ADL (first use) |
| Termux | termux |
| desktop environment | Desktop Environment, DE |
| proot | PRoot, PROOT |
| Samsung DeX | Samsung Dex, DEX, dex |
| command line | command-line (as adjective only) |
| Wi-Fi | wifi, Wifi, WIFI |
| open source | open-source (as adjective only) |

## Accessibility Checklist

Every page should meet these standards:

- All images have descriptive alt text.
- Code blocks have language identifiers.
- Links have descriptive text (not "click here").
- Color is not the only way to convey information.
- Headings are used for structure, not for visual styling.
- Tables have header rows.
