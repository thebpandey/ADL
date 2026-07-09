---
id: guide-template
title: "Guide Page Template"
sidebar_position: 1
---

# Guide Page Template

Copy this template when creating a new guide or tutorial page. Replace all placeholder text with actual content.

---

````md
---
id: your-page-id
title: "Your Page Title"
sidebar_position: 1
---

# Your Page Title

**Estimated time:** 15 minutes · **Difficulty:** Beginner

<Requirements items={[
  "Requirement one",
  "Requirement two",
  "Requirement three",
]} />

## Introduction

One or two paragraphs explaining what the reader will accomplish on this page
and why it matters. Keep it short and motivating.

## What is [concept]?

**[Concept]** is [plain-language explanation]. Think of it as [analogy the
reader already understands].

We use [concept] because [reason]. The main alternatives are [alternative A]
and [alternative B], but [concept] is recommended because [advantage].

## Step 1: [First action]

Explain what the reader is about to do and why.

<CopyCommand command="your-command-here" />

<ExpectedResult>
  Describe what the reader should see after running the command.
</ExpectedResult>

<CollapsibleSection title="What does this command do?">
  Detailed explanation of each part of the command for curious readers.
</CollapsibleSection>

## Step 2: [Second action]

Continue with the next step, following the same pattern.

```bash
multi-line-command \
  --with-options
```

<ExpectedResult>
  Expected output description.
</ExpectedResult>

## Step 3: [Third action]

Final step in this section.

<Tip title="Helpful shortcut">
  Share a useful tip related to this step.
</Tip>

## Verify your setup

Explain how the reader can confirm that everything worked correctly.

<CopyCommand command="verification-command" />

<ExpectedResult>
  What a successful verification looks like.
</ExpectedResult>

## Troubleshooting

<Troubleshooting items={[
  {
    problem: "Error message or symptom",
    solution: "Step-by-step fix for this problem."
  },
  {
    problem: "Another common error",
    solution: "How to resolve this issue."
  },
]} />

## Summary

Summarize what the reader accomplished in two or three sentences.

## Next steps

- Continue to [Next Page Title](/docs/category/next-page) to learn about the next topic.
- If you ran into issues, see the [Troubleshooting](/docs/troubleshooting/common-issues) section.
````
