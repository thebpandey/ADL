---
sidebar_position: 2
title: "Reference Page Template"
description: "A starter template for writing reference and documentation pages in the ADL documentation."
---

# Reference Page Template

This page is a template for writing reference and technical documentation pages. Copy the structure below as a starting point, then replace the placeholder content with your own.

<Note>This is a template, not a real reference page. Do not link to this page from other documentation as if it contains actual technical details.</Note>

---

## How to use this template

1. Copy this file to the appropriate directory under `docs/`.
2. Rename it to match your topic: `your-reference-topic.md`.
3. Replace all placeholder text with real content.
4. Update the frontmatter with the correct `sidebar_position`, `title`, and `description`.
5. Remove the "How to use this template" section before publishing.
6. Delete all HTML comments once you have filled in each section.

---

## Template starts below

Copy everything below this line into your new file.

---

````mdx
---
sidebar_position: 1
title: "Your Reference Title"
description: "A one-sentence description of what this reference page documents."
---

<!-- TITLE: Use a single # heading that matches the frontmatter title exactly. -->
# Your Reference Title

<!-- OVERVIEW: Write one to two paragraphs summarizing what this reference page
     covers. State the scope clearly --- what is included and what is not.
     Reference pages are for looking things up, not for teaching concepts. -->

Write a brief overview of what this reference page documents. State the scope
and mention any related pages the reader might be looking for instead.

<!-- SYNTAX / USAGE: Show the general syntax or invocation pattern. Use fenced
     code blocks for syntax and CopyCommand for commands the reader can run
     directly. -->
## Syntax

```bash
command [options] <required-argument> [optional-argument]
```

### Common flags

| Flag | Description | Default |
|---|---|---|
| `-v`, `--verbose` | Enable verbose output | Off |
| `-o`, `--output` | Specify output directory | Current directory |
| `-h`, `--help` | Show help message | --- |

<!-- CONFIGURATION OPTIONS: Document each configuration option with its type,
     default value, and a brief description. Use a table for simple options
     or subsections for complex ones. -->
## Configuration options

### Option: `option_name`

- **Type:** `string`
- **Default:** `"default_value"`
- **Required:** No

Description of what this option controls and when you might change it.

```yaml
option_name: "your_value"
```

### Option: `another_option`

- **Type:** `boolean`
- **Default:** `true`
- **Required:** No

Description of the second option.

<Warning>Changing this option while a session is running may cause unexpected behavior. Stop the session first.</Warning>

<!-- EXAMPLES: Provide two or three realistic examples that demonstrate common
     use cases. Each example should have a brief description, the command or
     configuration, and the expected result. -->
## Examples

### Basic usage

Description of what this example demonstrates:

<CopyCommand command="command --flag value" />

<Terminal command="command --flag value" output="Expected output from the command" />

### Advanced usage

Description of a more complex scenario:

<CopyCommand command="command --verbose --output /path/to/dir argument" />

<Terminal command="command --verbose --output /path/to/dir argument" output="Verbose output showing
additional details about the operation" />

<Tip>Describe a useful shortcut or non-obvious behavior related to this example.</Tip>

### Configuration file example

When configuring via file instead of command-line flags:

```yaml
# /path/to/config.yaml
option_name: "value"
another_option: false
nested:
  setting: 42
```

<BestPractice>Describe the recommended configuration for most users.</BestPractice>

<!-- RELATED PAGES: Link to pages that complement this reference. Include both
     conceptual pages (for understanding) and guide pages (for step-by-step
     instructions). -->
## Related pages

- [Concept page that explains the underlying system](../learn/concepts/related-concept.md)
- [Guide that uses this command or configuration](../guides/related-guide.md)
- [Another reference page for a related tool](./related-reference.md)
````
