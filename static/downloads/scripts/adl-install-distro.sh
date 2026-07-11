#!/data/data/com.termux/files/usr/bin/bash
# adl-install-distro.sh — install a Linux distribution with proot-distro.
# Runs in the Termux host environment.
set -euo pipefail

VERSION="1.0.0"
DRY_RUN=0
DISTRO=""

usage() {
  cat <<'EOF'
Usage: adl-install-distro.sh --distro <debian|ubuntu|alpine|archlinux> [--dry-run]

Installs the chosen distribution via proot-distro. Detects an existing
installation and refuses to overwrite it.

Note on proot-distro versions: proot-distro v5+ (May 2026) resolves names as
OCI (Docker Hub) image references — a bare name like "ubuntu" means the
image's latest tag. To pin a release on v5+, run proot-distro directly, e.g.:
    proot-distro install ubuntu:24.04
Older proot-distro v4.x uses curated aliases with the same bare names, so the
bare-name commands this script runs work on both versions.

Options:
  --distro NAME  One of: debian, ubuntu, alpine, archlinux (required).
  --dry-run      Show what would run without running it.
  --version      Print version.   --help   Show this help.
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --distro) shift; DISTRO="${1:-}" ;;
    --dry-run) DRY_RUN=1 ;;
    --version) printf '%s\n' "$VERSION"; exit 0 ;;
    --help|-h) usage; exit 0 ;;
    *) printf 'Unknown option: %s\n' "$1" >&2; usage >&2; exit 2 ;;
  esac
  shift
done

# Allowlist — never pass unvalidated input to a command line.
case "$DISTRO" in
  debian|ubuntu|alpine|archlinux) ;;
  "") printf 'Missing --distro. ' >&2; usage >&2; exit 2 ;;
  *) printf 'Unsupported distro: %s (allowed: debian, ubuntu, alpine, archlinux)\n' "$DISTRO" >&2; exit 2 ;;
esac

if [ ! -d "/data/data/com.termux/files/usr" ]; then
  printf 'This script must run inside the Termux app (not inside a Linux distro).\n' >&2
  exit 1
fi
if ! command -v proot-distro >/dev/null 2>&1; then
  printf 'proot-distro is not installed. Run adl-install-base.sh first.\n' >&2
  exit 1
fi

if [ "$DISTRO" = "archlinux" ]; then
  printf 'NOTE: the Arch route is for experienced users (rolling release).\n' >&2
  printf 'On proot-distro v5+, ARM64 image availability for "archlinux" should be\n' >&2
  printf 'confirmed before relying on it — see the ADL distro chooser page.\n' >&2
fi

LOG="$HOME/adl-install-distro.$(date +%Y%m%d-%H%M%S).log"
say() { printf '%s\n' "$*" | tee -a "$LOG"; }

if proot-distro list 2>/dev/null | grep -qi "installed" && proot-distro list 2>/dev/null | grep -qi "^.*${DISTRO}.*installed"; then
  say "'$DISTRO' already appears installed (proot-distro list). Nothing to do."
  say "To reinstall, remove it first: proot-distro remove $DISTRO   (this DELETES its data)"
  exit 0
fi

free_mb="$(df -Pm "$HOME" 2>/dev/null | awk 'NR==2{print $4}' || printf '0')"
if [ "${free_mb:-0}" -lt 4096 ]; then
  say "WARNING: only $((free_mb / 1024)) GB free — the download and unpack may not fit."
fi

if [ "$DRY_RUN" -eq 1 ]; then
  say "[dry-run] proot-distro install $DISTRO"
  exit 0
fi

say "Installing $DISTRO (1–2 GB download; keep the screen on)…"
proot-distro install "$DISTRO" 2>&1 | tee -a "$LOG"

say ""
say "Done. Log in with:  proot-distro login $DISTRO --shared-tmp"
say "Then update it, and create a non-root user (adl-create-user.sh)."
say "Log saved to: $LOG"
