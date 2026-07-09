---
id: installation-template
title: "Installation Page Template"
sidebar_position: 3
---

# Installation Page Template

Copy this template when creating a new installation guide. Replace all placeholder text with actual content.

---

````md
---
id: your-page-id
title: "Installing [Software Name]"
sidebar_position: 1
---

# Installing [Software Name]

**Estimated time:** 10 minutes · **Difficulty:** Beginner

<Requirements items={[
  "Android 10 or newer",
  "Termux installed and updated",
  "At least [X] MB of free storage",
  "Active internet connection",
]} />

## What is [Software Name]?

**[Software Name]** is [one-sentence definition]. It is used in ADL to
[purpose].

### Why [Software Name]?

We recommend [Software Name] because:

- [Advantage 1]
- [Advantage 2]
- [Advantage 3]

### Alternatives

| Software | Pros | Cons |
|---|---|---|
| [Software Name] (recommended) | [pro] | [con] |
| [Alternative A] | [pro] | [con] |
| [Alternative B] | [pro] | [con] |

## Download

<Warning title="Only use official sources">
  Always download [Software Name] from the official source linked below.
  Do not use third-party APK mirrors.
</Warning>

<DownloadCard
  name="[Software Name]"
  description="[Short description]"
  url="[official-download-url]"
  version="[version]"
  size="[file size]"
/>

## Installation steps

### Step 1: [Action]

Explanation of what this step does.

<CopyCommand command="installation-command" />

<ExpectedResult>
  What the reader should see.
</ExpectedResult>

### Step 2: [Action]

Next step with explanation.

<CopyCommand command="next-command" />

<ExpectedResult>
  Expected output.
</ExpectedResult>

### Step 3: Verify the installation

Explain how to confirm the software is installed correctly.

<CopyCommand command="software --version" />

<ExpectedResult>
  [Software Name] version [X.Y.Z]
</ExpectedResult>

## Post-installation configuration

Any recommended configuration after installation.

<Tip>
  Helpful tip about configuration.
</Tip>

## Troubleshooting

<Troubleshooting items={[
  {
    problem: "Installation fails with error [X]",
    solution: "Step-by-step fix."
  },
  {
    problem: "[Software Name] does not start",
    solution: "Step-by-step fix."
  },
]} />

## Summary

You have successfully installed [Software Name] on your Android device.
It is now ready to [purpose].

## Next steps

- Continue to [Next Page](/docs/next-page) to [next action].
- See [Configuration Guide](/docs/config) for advanced settings.
````
