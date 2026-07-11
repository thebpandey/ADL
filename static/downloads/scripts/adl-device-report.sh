#!/data/data/com.termux/files/usr/bin/bash
# adl-device-report.sh — collect non-sensitive device facts for the ADL wizard.
#
# Runs in the Termux host environment. Prints a JSON report you can review,
# edit, and paste into https://thebpandey.github.io/ADL/get-started .
# Collects ONLY technical compatibility facts. It never reads: IMEI, serial
# numbers, phone numbers, accounts, Wi-Fi names, IP/location, contacts, files,
# app usage, or advertising identifiers. It makes no network connections.
set -euo pipefail

VERSION="1.0.0"
SCHEMA_VERSION=1

usage() {
  cat <<'EOF'
Usage: adl-device-report.sh [--save] [--help] [--version]

Prints a JSON device report to the terminal for the ADL Get Started wizard.

Options:
  --save      Also save the report to ~/adl-device-report.json (you will be
              told the exact path; review it before sharing).
  --version   Print the script version.
  --help      Show this help.

Collected fields (all technical, none personally identifying):
  manufacturer, model, device codename, Android version, API level,
  CPU ABIs, kernel version, RAM totals, Termux storage totals,
  shared-storage totals (only if you granted storage permission),
  screen size/density, Termux version and release source, and whether
  termux-x11 / proot-distro / pulseaudio appear installed.

Note: USB DisplayPort Alt Mode support is NOT reliably detectable from
software — the wizard asks about it separately.
EOF
}

SAVE=0
for arg in "$@"; do
  case "$arg" in
    --save) SAVE=1 ;;
    --version) printf '%s\n' "$VERSION"; exit 0 ;;
    --help|-h) usage; exit 0 ;;
    *) printf 'Unknown option: %s\n' "$arg" >&2; usage >&2; exit 2 ;;
  esac
done

if [ ! -d "/data/data/com.termux/files/usr" ]; then
  printf 'This script must run inside the Termux app on Android.\n' >&2
  exit 1
fi

# Every probe fails safely to "unknown"/null.
prop() { getprop "$1" 2>/dev/null || printf ''; }
have() { command -v "$1" >/dev/null 2>&1; }

json_escape() {
  # Minimal JSON string escaping for the values we collect.
  printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' | tr -d '\n\r'
}

jstr() { # jstr <value> — JSON string or null when empty
  if [ -n "$1" ]; then printf '"%s"' "$(json_escape "$1")"; else printf 'null'; fi
}

jnum() { # jnum <value> — JSON number or null
  case "${1:-}" in
    ''|*[!0-9.]*) printf 'null' ;;
    *) printf '%s' "$1" ;;
  esac
}

jbool_cmd() { # jbool_cmd <command> — true when command exists
  if have "$1"; then printf 'true'; else printf 'false'; fi
}

MANUFACTURER="$(prop ro.product.manufacturer)"
MODEL="$(prop ro.product.model)"
DEVICE="$(prop ro.product.device)"
ANDROID_VERSION="$(prop ro.build.version.release)"
API_LEVEL="$(prop ro.build.version.sdk)"
PRIMARY_ABI="$(prop ro.product.cpu.abi)"
ABI_LIST="$(prop ro.product.cpu.abilist)"
KERNEL="$(uname -r 2>/dev/null || printf '')"

RAM_TOTAL_KB="$(awk '/MemTotal/{print $2}' /proc/meminfo 2>/dev/null || printf '')"
RAM_AVAIL_KB="$(awk '/MemAvailable/{print $2}' /proc/meminfo 2>/dev/null || printf '')"
RAM_TOTAL_MB=""; [ -n "$RAM_TOTAL_KB" ] && RAM_TOTAL_MB=$((RAM_TOTAL_KB / 1024))
RAM_AVAIL_MB=""; [ -n "$RAM_AVAIL_KB" ] && RAM_AVAIL_MB=$((RAM_AVAIL_KB / 1024))

TERMUX_HOME="/data/data/com.termux/files/home"
STORAGE_TOTAL_MB="$(df -Pm "$TERMUX_HOME" 2>/dev/null | awk 'NR==2{print $2}' || printf '')"
STORAGE_FREE_MB="$(df -Pm "$TERMUX_HOME" 2>/dev/null | awk 'NR==2{print $4}' || printf '')"

SHARED_TOTAL_MB=""
SHARED_FREE_MB=""
if [ -d "$TERMUX_HOME/storage/shared" ]; then
  SHARED_TOTAL_MB="$(df -Pm "$TERMUX_HOME/storage/shared" 2>/dev/null | awk 'NR==2{print $2}' || printf '')"
  SHARED_FREE_MB="$(df -Pm "$TERMUX_HOME/storage/shared" 2>/dev/null | awk 'NR==2{print $4}' || printf '')"
fi

SCREEN=""
DENSITY=""
# `wm` needs android tools; only use it when callable without error.
if have wm; then
  SCREEN="$(wm size 2>/dev/null | awk -F': ' '/Physical size/{print $2; exit}' || printf '')"
  DENSITY="$(wm density 2>/dev/null | awk -F': ' '/Physical density/{print $2; exit}' || printf '')"
fi

TERMUX_VER="${TERMUX_VERSION:-}"
TERMUX_RELEASE="${TERMUX_APK_RELEASE:-}"

DISTROS=""
if have proot-distro; then
  DISTROS="$(proot-distro list 2>/dev/null | awk '/installed/{print $1}' | paste -sd ',' - || printf '')"
fi

GENERATED_AT="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

json="$(cat <<EOF
{
  "schemaVersion": $SCHEMA_VERSION,
  "scriptVersion": "$VERSION",
  "generatedAt": "$GENERATED_AT",
  "manufacturer": $(jstr "$MANUFACTURER"),
  "model": $(jstr "$MODEL"),
  "device": $(jstr "$DEVICE"),
  "androidVersion": $(jstr "$ANDROID_VERSION"),
  "apiLevel": $(jnum "$API_LEVEL"),
  "primaryAbi": $(jstr "$PRIMARY_ABI"),
  "abiList": $(jstr "$ABI_LIST"),
  "kernel": $(jstr "$KERNEL"),
  "ramTotalMb": $(jnum "$RAM_TOTAL_MB"),
  "ramAvailableMb": $(jnum "$RAM_AVAIL_MB"),
  "termuxStorageTotalMb": $(jnum "$STORAGE_TOTAL_MB"),
  "termuxStorageFreeMb": $(jnum "$STORAGE_FREE_MB"),
  "sharedStorageTotalMb": $(jnum "$SHARED_TOTAL_MB"),
  "sharedStorageFreeMb": $(jnum "$SHARED_FREE_MB"),
  "screen": $(jstr "$SCREEN"),
  "density": $(jstr "$DENSITY"),
  "termuxVersion": $(jstr "$TERMUX_VER"),
  "termuxApkRelease": $(jstr "$TERMUX_RELEASE"),
  "termuxX11PackageInstalled": $(jbool_cmd termux-x11),
  "prootDistroInstalled": $(jbool_cmd proot-distro),
  "pulseaudioInstalled": $(jbool_cmd pulseaudio),
  "installedDistros": $(jstr "$DISTROS")
}
EOF
)"

printf '%s\n' "$json"

if [ "$SAVE" -eq 1 ]; then
  out="$HOME/adl-device-report.json"
  printf '%s\n' "$json" > "$out"
  printf '\nSaved a copy to: %s\n' "$out" >&2
  printf 'Review (and edit) it before sharing: cat %s\n' "$out" >&2
fi

printf '\nReview the values above before pasting them into the ADL wizard.\n' >&2
printf 'Nothing was sent anywhere; this script makes no network connections.\n' >&2
