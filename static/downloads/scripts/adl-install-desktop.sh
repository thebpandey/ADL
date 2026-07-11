#!/bin/bash
# adl-install-desktop.sh — install a desktop environment inside the distro.
# Runs INSIDE the Linux distribution (Debian/Ubuntu/Arch; Alpine is documented
# as command-line-first in ADL), as root or with sudo.
set -euo pipefail

VERSION="1.0.0"
DESKTOP=""
DRY_RUN=0

usage() {
  cat <<'EOF'
Usage: adl-install-desktop.sh --desktop <xfce|mate|lxqt|plasma> [--dry-run]

Installs the desktop's packages plus dbus. GNOME is intentionally not offered:
it depends on systemd session services that proot does not provide, and ADL
documents it as unsupported under proot.

Run inside the distro (as root, or a sudo-capable user):
    proot-distro login <distro> -- bash adl-install-desktop.sh --desktop xfce

Options:
  --desktop NAME  One of: xfce, mate, lxqt, plasma (required).
  --dry-run       Show what would run without installing.
  --version       Print version.   --help   Show this help.
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --desktop) shift; DESKTOP="${1:-}" ;;
    --dry-run) DRY_RUN=1 ;;
    --version) printf '%s\n' "$VERSION"; exit 0 ;;
    --help|-h) usage; exit 0 ;;
    *) printf 'Unknown option: %s\n' "$1" >&2; usage >&2; exit 2 ;;
  esac
  shift
done

case "$DESKTOP" in
  xfce|mate|lxqt|plasma) ;;
  "") printf 'Missing --desktop. ' >&2; usage >&2; exit 2 ;;
  gnome) printf 'GNOME is unsupported under proot (systemd session dependencies). Choose xfce, mate, lxqt, or plasma.\n' >&2; exit 2 ;;
  *) printf 'Unsupported desktop: %s\n' "$DESKTOP" >&2; exit 2 ;;
esac

if [ -d "/data/data/com.termux/files/usr" ] && [ ! -f /etc/os-release ]; then
  printf 'This script must run INSIDE the Linux distro, not in the Termux host.\n' >&2
  exit 1
fi
if [ ! -f /etc/os-release ]; then
  printf 'Cannot detect the distribution (/etc/os-release missing).\n' >&2
  exit 1
fi
# shellcheck disable=SC1091
. /etc/os-release
DISTRO_ID="${ID:-unknown}"

SUDO=""
if [ "$(id -u)" -ne 0 ]; then
  if command -v sudo >/dev/null 2>&1; then SUDO="sudo"; else
    printf 'Run as root or install sudo first.\n' >&2; exit 1
  fi
fi

apt_pkgs=""
pacman_pkgs=""
session=""
case "$DESKTOP" in
  xfce)   apt_pkgs="xfce4 xfce4-terminal dbus-x11"; pacman_pkgs="xfce4 xfce4-terminal dbus"; session="startxfce4" ;;
  mate)   apt_pkgs="mate-desktop-environment dbus-x11"; pacman_pkgs="mate mate-terminal dbus"; session="mate-session" ;;
  lxqt)   apt_pkgs="lxqt-core qterminal dbus-x11"; pacman_pkgs="lxqt dbus"; session="startlxqt" ;;
  plasma) apt_pkgs="kde-plasma-desktop kwin-x11 dbus-x11"; pacman_pkgs="plasma-desktop dbus"; session="startplasma-x11" ;;
esac

run() {
  if [ "$DRY_RUN" -eq 1 ]; then printf '[dry-run] %s\n' "$*"; else printf '+ %s\n' "$*"; "$@"; fi
}

if command -v "$session" >/dev/null 2>&1; then
  printf '%s appears already installed (%s found) — nothing to do.\n' "$DESKTOP" "$session"
  exit 0
fi

free_mb="$(df -Pm / 2>/dev/null | awk 'NR==2{print $4}' || printf '0')"
if [ "${free_mb:-0}" -lt 4096 ]; then
  printf 'WARNING: only %s GB free inside the distro — a desktop install may not fit.\n' "$((free_mb / 1024))"
fi

printf 'Installing %s on %s (large download; keep the screen on)…\n' "$DESKTOP" "$DISTRO_ID"
case "$DISTRO_ID" in
  debian|ubuntu)
    run "${SUDO:-env}" apt-get update
    # shellcheck disable=SC2086 # intentional word splitting of the package list
    run ${SUDO} apt-get install -y $apt_pkgs
    ;;
  arch|archlinux)
    # shellcheck disable=SC2086
    run ${SUDO} pacman -S --noconfirm $pacman_pkgs
    ;;
  alpine)
    printf 'ADL documents Alpine as command-line-first; desktop packaging there is not covered by this script.\n' >&2
    exit 1
    ;;
  *)
    printf 'Unsupported distribution "%s".\n' "$DISTRO_ID" >&2
    exit 1
    ;;
esac

printf '\nDone. Session command: %s\n' "$session"
printf 'Create a launcher from Termux with adl-create-launcher.sh, or start manually:\n'
printf '  termux-x11 :1 -xstartup "dbus-launch --exit-with-session %s"\n' "$session"
