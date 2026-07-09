# Support

## What support is available

- **Documentation** — the published guides at https://thebpandey.github.io/ADL/
  cover installation, troubleshooting, and device-specific setup.
- **Installation help** — open an issue with the
  [installation help template](.github/ISSUE_TEMPLATE/installation_help.yml)
  if you are stuck on a documented step.
- **Bug reports** — use the
  [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml) for errors in
  the documentation itself.
- **GitHub Discussions** — for open-ended questions, ideas, and sharing your
  setup: https://github.com/thebpandey/ADL/discussions

## What support is not available

- **Rooted, bricked, or modified devices** — the project only covers no-root
  setups on stock Android.
- **General Android or Linux support** unrelated to running desktop Linux on
  Android.
- **Third-party app support** — issues inside Termux, Ubuntu, or XFCE that are
  not caused by our instructions belong upstream with those projects.
- **Real-time support** — this is a volunteer project; response times vary.
- **Devices we cannot test** — we will document community findings but cannot
  debug hardware we do not have.

## How to ask for installation help

Open an issue with the installation help template and include **all** of the
following — issues missing this information will be sent back for details:

- **Device model** (exact, e.g. "Samsung Galaxy S22+ SM-S906B")
- **Android version** (Settings > About phone > Software information)
- **Termux version and install source** (F-Droid or GitHub — the Play Store
  build is not supported)
- **The step you are on** — link to the documentation page and name the step
- **The exact command you ran** — copied, not retyped
- **The exact error message** — copied in full, not paraphrased
- **What you already tried**

## How to collect logs safely

- In Termux, capture a command's output to a file:
  `your-command 2>&1 | tee ~/output.log`
- Copy the relevant lines (the command plus everything after it) into the
  issue inside a code block.
- Read the log before posting and remove anything personal.

## Privacy warning

**Never paste tokens, passwords, email addresses, API keys, or the contents
of personal files into an issue.** Issues are public and indexed by search
engines. Check screenshots and logs before posting: usernames, Wi-Fi network
names, and notification content are easy to leak by accident. If you posted
something sensitive by mistake, edit it out immediately and rotate the
credential — edit history remains visible, so treat leaked secrets as
compromised.
