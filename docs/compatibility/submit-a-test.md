---
sidebar_position: 8
title: "Submit a Test"
description: "How to contribute device tests, hardware tests, and compatibility updates to the database."
---

# Submit a Test

The compatibility database grows through community testing. Everything lives in plain JSON files under `data/` in the repository, so contributing is a normal pull request.

## Submitting a device test

1. Set up ADL on your device following the [Quick Start](/docs/quick-start/overview).
2. Note your exact device model, Android version, Linux distribution, desktop environment, and the hardware you used.
3. Add an entry to `data/test-results.json` (see the schema in the [compatibility system guide](/docs/developer/compatibility-system)).
4. If your device is missing, add it to `data/devices.json` and a row to `data/compatibility-matrix.json` — set `verification` to `community-verified` for things you tested and `untested` for anything you did not.
5. Open a pull request using the [device support template](https://github.com/thebpandey/ADL/issues/new/choose) or directly with the JSON changes.

## Submitting a hardware test

1. Confirm the hardware works (or does not) with a device already in the database.
2. Add or update the entry in `data/hardware.json`, listing key specs rather than store links.
3. Reference the device ids in `worksWith`.

## Updating compatibility

Statuses use fixed vocabularies — support levels (`fully-supported`, `supported`, `partial`, `experimental`, `broken`, `untested`) and verification levels (`maintainer-verified`, `community-verified`, `experimental`, `needs-testing`, `deprecated`). Never raise a status above what you personally verified.

## Screenshots and benchmarks

- Screenshots go in `static/img/` with descriptive names; redact personal information first.
- Benchmarks belong in your test result's `notes` field with the tool and conditions named (e.g. "Geekbench 6, plugged in, cool device").

Maintainer review promotes entries to `maintainer-verified` once reproduced on reference hardware.
