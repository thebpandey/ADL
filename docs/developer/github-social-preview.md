---
sidebar_position: 4
title: "GitHub Social Preview"
description: "Specification for the ADL GitHub social preview image (Open Graph card)."
---

# GitHub Social Preview

GitHub's **social preview** is the image shown when the repository is shared
on social platforms and chat apps. It must be uploaded through the repository
settings — it cannot be set from a commit — so this page specifies what to
create and how to upload it. No approved 1280 × 640 social-card asset exists
yet, so this is a specification, not a finished image.

## Recommended dimensions

- **Size:** 1280 × 640 pixels (GitHub's exact recommended ratio, 2:1)
- **Format:** PNG or JPG (PNG preferred for crisp text; keep under **1 MB**)
- **Color space:** sRGB

## Recommended content

| Element | Value |
|---|---|
| **Title** | Android Desktop Linux |
| **Tagline** | The Open Knowledge Base for Desktop Linux on Android |
| **Visual** | An ADL illustration of an Android phone powering a Linux desktop workstation (monitor, keyboard, mouse), with generous negative space for the title. |

Use an existing approved ADL illustration (for example the home hero,
`static/img/heroes/hero-home.webp`) rather than generating new artwork. Do
not modify existing artwork to produce the card; compose the card around it.

## Layout and safe margins

- Keep all text within a **safe area** inset ~64 px from every edge.
- Platforms crop social cards differently (some to ~1.91:1, some near
  square on mobile). Keep the **title and tagline horizontally centered and
  vertically within the middle 60%** so they survive a mobile-centered crop.
- Left-align the title block over a calm region of the illustration, or place
  the illustration on one side and the text on the other with clear
  separation.

## ADL color palette

Use the site's notebook-paper palette so the card matches the website:

| Token | Light value | Use |
|---|---|---|
| Primary (slate blue) | `#3e5c76` | Title text / accent |
| Ink | `#1F2933` | Body text on paper |
| Paper | `#f7f1e6` | Background |
| Paper (highlight) | `#fbf8f1` | Background gradient stop |
| Muted | `#7a7264` | Tagline / secondary text |
| Border | `#e3dccb` | Hairline framing |

A dark variant may use background `#1a1c20` with primary `#8fb4d6` and body
text `#d6d3cc`.

## Accessibility and contrast

- Title text must meet **WCAG AA** contrast against its background
  (≥ 4.5:1 for normal text, ≥ 3:1 for large display text). Slate blue
  `#3e5c76` on paper `#f7f1e6` passes for large text; verify any smaller
  text.
- Do not rely on color alone to convey meaning; the words must be legible in
  grayscale.

## How to upload it (manual step)

1. Open [`github.com/thebpandey/ADL`](https://github.com/thebpandey/ADL).
2. Go to **Settings → General**.
3. Scroll to **Social preview**.
4. Click **Edit → Upload an image…** and select the 1280 × 640 file.
5. Save. The preview updates within a few minutes on most platforms.

:::note Why this is not automated
The social preview is repository-settings data, not a file in the repo, and
GitHub provides no commit-based way to set it. This page keeps the intended
design version-controlled so the card can be produced and uploaded
consistently.
:::
