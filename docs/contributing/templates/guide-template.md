---
sidebar_position: 1
title: "Guide Page Template"
description: "A starter template for writing guide and tutorial pages in the ADL documentation."
---

# Guide Page Template

This page is a template for writing guide and tutorial pages. Copy the structure below as a starting point, then replace the placeholder content with your own.

<Note>This is a template, not a real guide. Do not link to this page from other documentation as if it contains actual instructions.</Note>

---

## How to use this template

1. Copy this file to the appropriate directory under `docs/`.
2. Rename it to match your topic: `your-topic-name.md`.
3. Replace all placeholder text with real content.
4. Update the frontmatter with the correct `sidebar_position`, `title`, and `description`.
5. Remove the "How to use this template" section before publishing.
6. Delete all HTML comments once you have filled in each section.

---

## Template starts below

Copy everything below this line into your new file.

---

```mdx
---
sidebar_position: 1
title: "Your Guide Title"
description: "A one-sentence description of what this guide covers and what the reader will accomplish."
---

<!-- TITLE: Use a single # heading that matches the frontmatter title exactly. -->
# Your Guide Title

<!-- OVERVIEW: Write one to three paragraphs introducing the guide. Explain what
     the reader will accomplish, why it matters, and what the end result looks
     like. Set expectations for time required and difficulty level. -->

Write your introduction here. Explain what the reader will accomplish by following
this guide, why it matters, and roughly how long it takes.

<!-- PREREQUISITES: List everything the reader needs before starting. Use the
     Requirements component for a clean checklist. Link to any setup guides the
     reader should complete first. -->
## Prerequisites

<Requirements items={[
  "Android 10 or later",
  "Termux installed from F-Droid",
  "A working Ubuntu installation inside proot",
  "At least 500 MB of free storage"
]} />

<Warning>If you skip the prerequisites, later steps may fail with confusing errors. Complete each item above before continuing.</Warning>

<!-- STEP-BY-STEP INSTRUCTIONS: Break the procedure into numbered steps. Each
     step section should accomplish one discrete action. Use CopyCommand for
     every command the reader should run. Use Terminal to show expected output
     so the reader can verify each step succeeded. -->
## Step 1: Describe the first action

Explain what this step does and why it is necessary. Then show the command:

<CopyCommand command="your-command-here" />

Describe what the reader should see after running the command:

<Terminal command="your-command-here" output="Expected output appears here" />

<Tip>If the command takes more than a minute, mention that so the reader does not think it has frozen.</Tip>

## Step 2: Describe the second action

Continue with the next logical step. Each step should accomplish one thing.

<CopyCommand command="another-command" />

<CommonMistake>Describe a common error that occurs at this step and how to fix it.</CommonMistake>

## Step 3: Describe the third action

Continue as needed. Most guides have between three and eight major steps.

<BestPractice>Describe the recommended approach or configuration for this step.</BestPractice>

<!-- VERIFICATION: Provide a concrete way for the reader to confirm that the
     entire procedure worked. This should be a command they can run or an
     observable result they can check. -->
## Verify it works

After completing all steps, verify your work. Run the following command and
confirm the output matches what is shown below:

<CopyCommand command="verification-command" />

<Terminal command="verification-command" output="Output that confirms success" />

If the reader sees different output, point them to the troubleshooting section below.

<!-- TROUBLESHOOTING: Cover the most common problems readers encounter when
     following this guide. Organize each issue with a descriptive heading,
     a cause explanation, and a concrete solution. -->
## Troubleshooting

### Problem: Describe the symptom

**Cause:** Explain why this happens.

**Solution:** Provide the fix.

<CopyCommand command="fix-command-if-applicable" />

### Problem: Describe another common issue

**Cause:** Explain why this happens.

**Solution:** Provide the fix.

<!-- NEXT STEPS: Link to two or three related pages so the reader knows where
     to go after completing this guide. Use descriptive link text. -->
## Next steps

Now that you have completed this guide, you can:

- [Link to a related guide](./related-guide.md) to continue learning
- [Link to a reference page](../reference/commands/relevant-commands.md) for detailed command documentation
- [Link to another topic](./another-topic.md) that builds on this one
```
