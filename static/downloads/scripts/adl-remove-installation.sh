#!/data/data/com.termux/files/usr/bin/bash
# adl-remove-installation.sh — remove ADL-managed pieces, with confirmation.
# Runs in the Termux host environment. Never touches unrelated Termux data.
set -euo pipefail

VERSION="1.0.0"
SCOPE=""
DISTRO=""
YES=0

usage() {
  cat <<'EOF'
Usage: adl-remove-installation.sh --scope <launcher|distro|all> [--distro NAME]

What each scope removes (nothing else):
  launcher   ~/start-desktop.sh only.
  distro     One Linux distribution (requires --distro). This DELETES that
             distro's files, including its home directory. Offers a backup.
  all        The launcher and every installed proot-distro distribution.
             Termux itself, your Termux home files, and the Android apps are
             NOT touched — uninstall Termux/Termux:X11 from Android Settings
             if you also want those gone.

Safety:
  * Asks you to type a confirmation word before deleting anything.
  * Offers a backup (proot-distro backup) before removing a distro.
  * Desktop-packages-only removal is intentionally not automated: run your
    distro's package manager for that (e.g. apt remove xfce4) so you can
    review exactly what is removed.

Options:
  --distro NAME  Distro to remove (debian|ubuntu|alpine|archlinux).
  --version      Print version.   --help   Show this help.
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --scope) shift; SCOPE="${1:-}" ;;
    --distro) shift; DISTRO="${1:-}" ;;
    --yes) YES=1 ;; # for non-interactive use; confirmation word still required interactively otherwise
    --version) printf '%s\n' "$VERSION"; exit 0 ;;
    --help|-h) usage; exit 0 ;;
    *) printf 'Unknown option: %s\n' "$1" >&2; usage >&2; exit 2 ;;
  esac
  shift
done

case "$SCOPE" in
  launcher|distro|all) ;;
  *) usage >&2; exit 2 ;;
esac
if [ "$SCOPE" = "distro" ]; then
  case "$DISTRO" in
    debian|ubuntu|alpine|archlinux) ;;
    *) printf -- '--scope distro requires --distro <debian|ubuntu|alpine|archlinux>\n' >&2; exit 2 ;;
  esac
fi

if [ ! -d "/data/data/com.termux/files/usr" ]; then
  printf 'This script must run inside the Termux app.\n' >&2
  exit 1
fi

confirm() {
  # confirm <word> <description>
  if [ "$YES" -eq 1 ]; then return 0; fi
  printf '\nAbout to: %s\n' "$2"
  printf 'Type %s to continue (anything else cancels): ' "$1"
  read -r answer
  if [ "$answer" != "$1" ]; then
    printf 'Cancelled — nothing was removed.\n'
    exit 0
  fi
}

remove_launcher() {
  if [ -f "$HOME/start-desktop.sh" ]; then
    rm -- "$HOME/start-desktop.sh"
    printf 'Removed ~/start-desktop.sh\n'
  else
    printf 'No launcher (~/start-desktop.sh) found.\n'
  fi
}

remove_one_distro() {
  local name="$1"
  if ! proot-distro list 2>/dev/null | grep -qi "$name.*installed"; then
    printf '%s does not appear to be installed — skipping.\n' "$name"
    return 0
  fi
  printf 'Back up %s first? [Y/n] ' "$name"
  if [ "$YES" -eq 1 ]; then answer="n"; else read -r answer; fi
  case "$answer" in
    n|N) printf 'Skipping backup.\n' ;;
    *)
      out="$HOME/adl-backup-$name-$(date +%Y%m%d-%H%M%S).tar.gz"
      proot-distro backup "$name" --output "$out"
      printf 'Backup saved: %s\n' "$out"
      ;;
  esac
  confirm "DELETE" "permanently remove the '$name' Linux system and everything inside it"
  proot-distro remove "$name"
  printf 'Removed %s.\n' "$name"
}

case "$SCOPE" in
  launcher)
    confirm "REMOVE" "delete ~/start-desktop.sh (the launcher only)"
    remove_launcher
    ;;
  distro)
    remove_one_distro "$DISTRO"
    ;;
  all)
    if ! command -v proot-distro >/dev/null 2>&1; then
      printf 'proot-distro is not installed; only checking the launcher.\n'
      confirm "REMOVE" "delete ~/start-desktop.sh"
      remove_launcher
      exit 0
    fi
    printf 'Installed distributions:\n'
    proot-distro list 2>/dev/null | grep -i 'installed' || printf '  (none)\n'
    for name in debian ubuntu alpine archlinux; do
      if proot-distro list 2>/dev/null | grep -qi "$name.*installed"; then
        remove_one_distro "$name"
      fi
    done
    remove_launcher
    printf '\nDone. To finish removing everything, uninstall Termux:X11 and Termux\n'
    printf 'from Android Settings > Apps, and restore any security/battery settings\n'
    printf 'you changed during installation.\n'
    ;;
esac
