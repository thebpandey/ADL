---
sidebar_position: 1
title: "Device Page Template"
description: "Reusable MDX template for a new verified-configuration device page."
---

# Device Page Template

Copy everything below into `docs/compatibility/devices/<device-slug>.md` after adding your entries to `data/devices.json` and `data/verified-configurations.json`.

````mdx
---
sidebar_position: 3
title: "<Device Name> Verified Configuration"
description: "Community-verified configuration for the <Device Name>."
device: "<Device Name>"
android_version: "<Android XX>"
linux_distribution: "<Distribution + version>"
desktop_environment: "<DE + version>"
verified: true
verification_date: "<YYYY-MM-DD>"
community_verified: true
compatibility_level: "supported"
---

# <Device Name> — Verified Configuration

<VerifiedConfiguration id="<your-config-id>" />

<HardwareRequirements ids={["<hardware-id-1>", "<hardware-id-2>"]} />

## Reproduce this setup

Follow the [Quick Start](/docs/quick-start/overview), then any device-specific notes.
````
