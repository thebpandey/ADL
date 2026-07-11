#!/data/data/com.termux/files/usr/bin/bash
# adl-install-base.sh — install the Termux-side base packages for ADL.
# Runs in the Termux host environment. Installs: x11-repo, termux-x11-nightly,
# pulseaudio, proot-distro. Idempotent; already-installed packages are skipped.
set -euo pipefail

VERSION="1.0.0"
DRY_RUN=0
WITH_X11=1

usage() {
  cat <<'EOF'
Usage: adl-install-base.sh [--no-x11] [--dry-run] [--help] [--version]

Installs the Termux host packages ADL setups use:
  x11-repo, termux-x11-nightly (unless --no-x11), pulseaudio, proot-distro.

It does NOT install the Termux:X11 Android APK — that must come from the
official releases page (https://github.com/termux/termux-x11/releases) so its
signature matches your Termux install. This script never touches Android
settings or downloads executable code from anywhere but Termux's own
package repositories.

Options:
  --no-x11     Skip display packages (command-line-only setups).
  --dry-run    Show what would be installed without installing.
  --version    Print version.   --help   Show this help.
EOF
}

for arg in "$@"; do
  case "$arg" in
    --no-x11) WITH_X11=0 ;;
    --dry-run) DRY_RUN=1 ;;
    --version) printf '%s\n' "$VERSION"; exit 0 ;;
    --help|-h) usage; exit 0 ;;
    *) printf 'Unknown option: %s\n' "$arg" >&2; usage >&2; exit 2 ;;
  esac
done

if [ ! -d "/data/data/com.termux/files/usr" ]; then
  printf 'This script must run inside the Termux app (not inside a Linux distro).\n' >&2
  exit 1
fi

LOG="$HOME/adl-install-base.$(date +%Y%m%d-%H%M%S).log"
say() { printf '%s\n' "$*" | tee -a "$LOG"; }
run() {
  if [ "$DRY_RUN" -eq 1 ]; then
    say "[dry-run] $*"
  else
    say "+ $*"
    "$@" 2>&1 | tee -a "$LOG"
  fi
}

installed() { pkg list-installed 2>/dev/null | grep -q "^$1/"; }

say "ADL base installer v$VERSION — log: $LOG"

say "Updating package lists…"
run pkg update -y

if [ "$WITH_X11" -eq 1 ]; then
  if installed x11-repo; then say "x11-repo already installed — skipping."; else run pkg install -y x11-repo; fi
  if installed termux-x11-nightly; then say "termux-x11-nightly already installed — skipping."; else run pkg install -y termux-x11-nightly; fi
else
  say "Skipping display packages (--no-x11)."
fi

if installed pulseaudio; then say "pulseaudio already installed — skipping."; else run pkg install -y pulseaudio; fi
if installed proot-distro; then say "proot-distro already installed — skipping."; else run pkg install -y proot-distro; fi

say ""
say "Done. Next steps:"
if [ "$WITH_X11" -eq 1 ]; then
  say "  1. Install the Termux:X11 APK from https://github.com/termux/termux-x11/releases/tag/nightly"
  say "     (app-universal-debug.apk). On Samsung One UI 6+, temporarily disable"
  say "     Auto Blocker for this install and re-enable it afterwards."
fi
say "  2. Install a Linux system: adl-install-distro.sh --distro debian"
say "Log saved to: $LOG"
