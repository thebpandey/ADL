# Governance

ADL uses a lightweight, maintainer-led governance model suited to a small
documentation project. This document will grow as the community does.

## Roles

### Maintainer

The maintainer ([@thebpandey](https://github.com/thebpandey)) is responsible
for:

- Reviewing and merging pull requests
- Setting documentation standards and project direction
- Triaging issues and moderating discussions
- Managing releases and site deployments
- Enforcing the code of conduct and security policy

Additional maintainers may be invited based on a sustained record of
high-quality contributions and reviews.

### Contributor

Anyone who opens an issue, submits a pull request, or participates in
discussions. Contributors are expected to follow
[CONTRIBUTING.md](CONTRIBUTING.md) and the code of conduct. No permission is
needed to start contributing.

## Decision-making

- **Day-to-day decisions** (wording, page structure, small fixes) are made in
  pull request review.
- **Larger decisions** (new sections, restructuring, tooling changes) are
  discussed in an issue before implementation. The maintainer makes the final
  call after considering community input.
- Decisions favor the project's core principles: beginner-first writing,
  official sources only, no root, and no duplicate content.

## Pull request review

- Every change to `main` goes through a pull request — including the
  maintainer's own changes whenever practical.
- At least one maintainer review is required (enforced via CODEOWNERS).
- CI must pass: the Docusaurus build must succeed with no broken internal
  links.
- Reviews check factual accuracy, official-source policy, beginner
  readability, and duplicate-content avoidance.

## Release process

- The site deploys automatically from `main` via GitHub Actions; merging to
  `main` is a release.
- Notable documentation changes are recorded in the
  [changelog](docs/release-notes/changelog.md).
- There are no versioned releases; the published site always reflects `main`.

## Documentation Decision Records

Significant documentation-architecture decisions (e.g. the 3-track structure)
may be captured as Documentation Decision Records (DDRs) in the future.
**DDRs will be introduced after the content stabilizes** — until then, major
decisions are recorded in issue and pull request discussions.

## How major technical decisions are handled

1. An issue is opened describing the problem, the options, and a
   recommendation.
2. Community feedback is gathered for a reasonable period (typically a week
   for significant changes).
3. The maintainer decides, documents the rationale in the issue, and links it
   from the implementing pull request.
4. Once DDRs are adopted, decisions of lasting consequence get a DDR entry.
