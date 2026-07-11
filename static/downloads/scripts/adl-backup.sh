#!/data/data/com.termux/files/usr/bin/bash
# adl-backup.sh — back up an installed Linux distribution to an archive.
# Runs in the Termux host environment. Uses proot-distro's own backup command.
set -euo pipefail

VERSION="1.0.0"
DISTRO=""
OUTPUT=""

usage() {
  cat <<'EOF'
Usage: adl-backup.sh --distro <debian|ubuntu|alpine|archlinux> [--output FILE]

Creates a restorable archive of the whole Linux environment (system + your
home directory inside it) using 'proot-distro backup'. Restore later with:
    proot-distro restore <file>

Options:
  --distro NAME   Which installed distribution to back up (required).
  --output FILE   Archive path (default: ~/adl-backup-<distro>-<date>.tar.gz).
  --version       Print version.   --help   Show this help.
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --distro) shift; DISTRO="${1:-}" ;;
    --output) shift; OUTPUT="${1:-}" ;;
    --version) printf '%s\n' "$VERSION"; exit 0 ;;
    --help|-h) usage; exit 0 ;;
    *) printf 'Unknown option: %s\n' "$1" >&2; usage >&2; exit 2 ;;
  esac
  shift
done

case "$DISTRO" in
  debian|ubuntu|alpine|archlinux) ;;
  "") printf 'Missing --distro. ' >&2; usage >&2; exit 2 ;;
  *) printf 'Unsupported distro name: %s\n' "$DISTRO" >&2; exit 2 ;;
esac

if [ ! -d "/data/data/com.termux/files/usr" ]; then
  printf 'This script must run inside the Termux app.\n' >&2
  exit 1
fi
if ! command -v proot-distro >/dev/null 2>&1; then
  printf 'proot-distro is not installed.\n' >&2
  exit 1
fi

if [ -z "$OUTPUT" ]; then
  OUTPUT="$HOME/adl-backup-$DISTRO-$(date +%Y%m%d-%H%M%S).tar.gz"
fi

free_mb="$(df -Pm "$HOME" 2>/dev/null | awk 'NR==2{print $4}' || printf '0')"
printf 'Backing up %s to %s\n' "$DISTRO" "$OUTPUT"
printf '(Free space: %s GB — the archive can be several GB.)\n' "$((free_mb / 1024))"

proot-distro backup "$DISTRO" --output "$OUTPUT"

printf '\nBackup complete: %s\n' "$OUTPUT"
ls -lh "$OUTPUT"
printf 'Restore with:  proot-distro restore %s\n' "$OUTPUT"
printf 'Consider copying it off the device (shared storage or a computer).\n'
