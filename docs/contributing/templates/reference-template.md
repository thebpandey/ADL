---
id: reference-template
title: "Reference Page Template"
sidebar_position: 2
---

# Reference Page Template

Copy this template when creating a new reference page (application guides, compatibility tables, glossary entries). Replace all placeholder text with actual content.

---

````md
---
id: your-page-id
title: "Your Page Title"
sidebar_position: 1
---

# Your Page Title

One or two sentences explaining what this reference page covers.

## Overview

Brief context about this topic and how it fits into ADL.

## [Item One]

### What is [Item One]?

**[Item One]** is [plain-language definition].

### Installation

<CopyCommand command="apt install item-one" />

<ExpectedResult>
  What the reader should see after installation completes.
</ExpectedResult>

### Configuration

Key configuration details in a table:

| Setting | Default | Description |
|---|---|---|
| `setting-a` | `value` | What this setting controls |
| `setting-b` | `value` | What this setting controls |

### Compatibility

<Note>
  Any important notes about compatibility with specific devices or
  Android versions.
</Note>

## [Item Two]

Repeat the same structure for each item in the reference.

## Comparison

| Feature | Item One | Item Two |
|---|---|---|
| Resource usage | Low | Medium |
| Ease of setup | Easy | Moderate |
| Best for | [use case] | [use case] |

## Recommendation

State which option is recommended for most users and why.

<Tip>
  A helpful tip about choosing between options.
</Tip>

## Frequently asked questions

<FAQ items={[
  {
    question: "Common question about this topic?",
    answer: "Clear, helpful answer."
  },
]} />
````
