#!/bin/bash
# adl-create-user.sh — create a normal (non-root) Linux user inside the distro.
# Runs INSIDE the Linux distribution (Debian/Ubuntu/Alpine/Arch), not in Termux.
# Why: browsers and desktop apps misbehave as root, and day-to-day desktop use
# should never run as root. Note: "root" here is simulated by proot — this
# script has nothing to do with Android root either way.
set -euo pipefail

VERSION="1.0.0"
USERNAME=""
DRY_RUN=0

usage() {
  cat <<'EOF'
Usage: adl-create-user.sh --username <name> [--dry-run]

Creates a normal user with a home directory and sudo access (where the
distro supports it). Run this inside the Linux distribution as root:
    proot-distro login <distro> -- bash adl-create-user.sh --username myname

Username rules: starts with a lowercase letter; lowercase letters, digits,
'-' or '_' only; at most 32 characters; not a reserved system name.

Options:
  --username NAME  The user to create (required).
  --dry-run        Show what would run without changing anything.
  --version        Print version.   --help   Show this help.
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --username) shift; USERNAME="${1:-}" ;;
    --dry-run) DRY_RUN=1 ;;
    --version) printf '%s\n' "$VERSION"; exit 0 ;;
    --help|-h) usage; exit 0 ;;
    *) printf 'Unknown option: %s\n' "$1" >&2; usage >&2; exit 2 ;;
  esac
  shift
done

# Strict allowlist validation of the user-controlled value.
if ! printf '%s' "$USERNAME" | grep -Eq '^[a-z][a-z0-9_-]{0,31}$'; then
  printf 'Invalid or missing --username (lowercase, starts with a letter, max 32 chars).\n' >&2
  exit 2
fi
case "$USERNAME" in
  root|admin|daemon|bin|sys|sync|mail|nobody)
    printf '"%s" is a reserved name — choose another username.\n' "$USERNAME" >&2
    exit 2 ;;
esac

# Environment detection: refuse to run in the Termux host.
if [ -d "/data/data/com.termux/files/usr" ] && [ ! -f /etc/os-release ]; then
  printf 'This script must run INSIDE the Linux distro, not in the Termux host.\n' >&2
  printf 'Enter the distro first:  proot-distro login <distro>\n' >&2
  exit 1
fi
if [ ! -f /etc/os-release ]; then
  printf 'Cannot detect the distribution (/etc/os-release missing).\n' >&2
  exit 1
fi
# shellcheck disable=SC1091
. /etc/os-release
DISTRO_ID="${ID:-unknown}"

if id "$USERNAME" >/dev/null 2>&1; then
  printf 'User %s already exists — nothing to do.\n' "$USERNAME"
  exit 0
fi

run() {
  if [ "$DRY_RUN" -eq 1 ]; then printf '[dry-run] %s\n' "$*"; else printf '+ %s\n' "$*"; "$@"; fi
}

printf 'Creating user "%s" on %s…\n' "$USERNAME" "$DISTRO_ID"

case "$DISTRO_ID" in
  debian|ubuntu)
    if ! command -v sudo >/dev/null 2>&1; then run apt-get update; run apt-get install -y sudo; fi
    run adduser --gecos "" "$USERNAME"
    run usermod -aG sudo "$USERNAME"
    ;;
  alpine)
    run adduser "$USERNAME"
    if ! command -v sudo >/dev/null 2>&1; then run apk add sudo; fi
    if [ "$DRY_RUN" -eq 0 ]; then
      printf '%s ALL=(ALL) ALL\n' "$USERNAME" > "/etc/sudoers.d/$USERNAME"
      chmod 0440 "/etc/sudoers.d/$USERNAME"
      printf '+ wrote /etc/sudoers.d/%s\n' "$USERNAME"
    else
      printf '[dry-run] write /etc/sudoers.d/%s\n' "$USERNAME"
    fi
    ;;
  arch|archlinux)
    run useradd -m -G wheel -s /bin/bash "$USERNAME"
    run passwd "$USERNAME"
    if ! command -v sudo >/dev/null 2>&1; then run pacman -S --noconfirm sudo; fi
    if [ "$DRY_RUN" -eq 0 ]; then
      printf '%%wheel ALL=(ALL:ALL) ALL\n' > /etc/sudoers.d/wheel
      chmod 0440 /etc/sudoers.d/wheel
      printf '+ wrote /etc/sudoers.d/wheel\n'
    else
      printf '[dry-run] write /etc/sudoers.d/wheel\n'
    fi
    ;;
  *)
    printf 'Unsupported distribution "%s" — create the user manually.\n' "$DISTRO_ID" >&2
    exit 1
    ;;
esac

printf '\nDone. From Termux, log in as this user with:\n'
printf '  proot-distro login <distro> --user %s --shared-tmp\n' "$USERNAME"
printf 'The root account remains available for maintenance (login without --user).\n'
