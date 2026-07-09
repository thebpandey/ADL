# Security Policy

ADL is a documentation project — it ships no executable software of its own.
However, its guides instruct users to download apps and run shell commands, so
the documentation itself is security-sensitive: a malicious link or command in
our docs could compromise readers' devices.

## Supported versions

Only the current published site (built from the `main` branch and deployed at
https://thebpandey.github.io/ADL/) is supported. Older revisions of the
documentation are not maintained.

## How to report a security issue

**Do not open a public issue for security vulnerabilities.**

Instead, report privately using
[GitHub private vulnerability reporting](https://github.com/thebpandey/ADL/security/advisories/new)
on this repository. If that is unavailable, contact the maintainer
([@thebpandey](https://github.com/thebpandey)) through GitHub.

Report privately if you find:

- A download link pointing to a compromised, unofficial, or impersonated source
- A documented command that damages devices, exfiltrates data, or weakens
  device security
- A third-party script referenced by the docs that has become malicious
- Site vulnerabilities (e.g. injected content, dependency compromise)

For non-sensitive documentation errors, a regular issue is fine.

## What we watch for

### APK download risks

Android apps installed outside an app store bypass Play Protect review.
A tampered APK can carry malware with full app permissions. This is why the
docs only ever link to official sources — F-Droid and official GitHub
releases for Termux — and why we verify those links in review.

**Policy: no unofficial APK mirrors, ever.** No APKMirror, APKPure, or
similar sites, regardless of convenience. Pull requests containing such links
are rejected, and existing links found in the docs are treated as security
issues.

### Shell command risks

Readers copy and paste our commands with full trust and little ability to
audit them. Commands in the docs must never:

- Pipe remote content directly into a shell (`curl ... | bash`)
- Weaken device security (disabling verification, granting broad permissions
  without explanation)
- Delete or overwrite user data without a clear warning and explanation

Every command must be explained, its expected output shown, and its failure
modes documented, so readers can tell when something is wrong.

### Third-party script risks

The docs avoid third-party convenience scripts. Where a third-party tool is
genuinely required, we link to its official repository, pin to a specific
release where possible, and describe what the script does so readers can make
an informed choice.

## Responsible disclosure process

1. Report privately (see above) with enough detail to reproduce.
2. We acknowledge within 7 days.
3. We investigate, fix the documentation, and redeploy the site.
4. Once the fix is live, we credit the reporter (if desired) in the changelog.

Please give us reasonable time to fix the issue before public disclosure.
