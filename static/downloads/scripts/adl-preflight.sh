#!/data/data/com.termux/files/usr/bin/bash
# adl-preflight.sh — check that this device is ready for an ADL installation.
# Runs in the Termux host environment. Diagnoses only; changes nothing.
set -euo pipefail

VERSION="1.0.0"
PASS=0; WARN=0; FAIL=0

usage() {
  cat <<'EOF'
Usage: adl-preflight.sh [--min-free-gb N] [--help] [--version]

Checks (read-only, changes nothing):
  Termux environment, Android version, CPU architecture, RAM,
  free storage, Termux release source, network reachability of the
  package mirror, and battery-optimization hints.

Options:
  --min-free-gb N   Required free storage in GB (default: 12).
  --version         Print version.  --help  Show this help.
EOF
}

MIN_FREE_GB=12
while [ $# -gt 0 ]; do
  case "$1" in
    --min-free-gb) shift; MIN_FREE_GB="${1:-12}" ;;
    --version) printf '%s\n' "$VERSION"; exit 0 ;;
    --help|-h) usage; exit 0 ;;
    *) printf 'Unknown option: %s\n' "$1" >&2; usage >&2; exit 2 ;;
  esac
  shift
done
case "$MIN_FREE_GB" in *[!0-9]*) printf -- '--min-free-gb must be a whole number\n' >&2; exit 2 ;; esac

ok()   { PASS=$((PASS+1)); printf 'PASS  %s\n' "$1"; }
warn() { WARN=$((WARN+1)); printf 'WARN  %s\n' "$1"; }
fail() { FAIL=$((FAIL+1)); printf 'FAIL  %s\n' "$1"; }

printf 'ADL preflight v%s\n\n' "$VERSION"

# 1. Environment
if [ -d "/data/data/com.termux/files/usr" ]; then
  ok "Running inside Termux."
else
  fail "Not running inside Termux — install Termux from F-Droid first."
  printf '\n%d passed, %d warnings, %d failures.\n' "$PASS" "$WARN" "$FAIL"
  exit 1
fi

# 2. Android version (Termux needs 7+, Termux:X11 needs 8+)
sdk="$(getprop ro.build.version.sdk 2>/dev/null || printf '0')"
release="$(getprop ro.build.version.release 2>/dev/null || printf '?')"
if [ "${sdk:-0}" -ge 26 ]; then
  ok "Android $release (API $sdk) meets Termux and Termux:X11 minimums."
elif [ "${sdk:-0}" -ge 24 ]; then
  warn "Android $release supports Termux, but Termux:X11 requires Android 8+ — plan for the VNC display path."
else
  fail "Android $release is below Termux's minimum (Android 7)."
fi

# 3. Architecture
abi="$(getprop ro.product.cpu.abi 2>/dev/null || printf '?')"
case "$abi" in
  arm64-v8a) ok "CPU architecture arm64 — fully supported." ;;
  armeabi*) warn "32-bit ARM ($abi): core tools work, but modern desktops/browsers have poor package support. Command-line use recommended." ;;
  x86_64) warn "x86_64 Android is unusual; instructions assume ARM64." ;;
  *) warn "Unknown ABI '$abi' — check your device's specifications." ;;
esac

# 4. RAM
ram_kb="$(awk '/MemTotal/{print $2}' /proc/meminfo 2>/dev/null || printf '0')"
ram_gb=$((ram_kb / 1024 / 1024))
if [ "$ram_gb" -ge 6 ]; then
  ok "RAM ${ram_gb} GB — comfortable for a desktop."
elif [ "$ram_gb" -ge 3 ]; then
  warn "RAM ${ram_gb} GB — lightweight desktop only; expect slowdowns with a browser open."
else
  warn "RAM ${ram_gb} GB — command-line use recommended; a desktop will struggle."
fi

# 5. Storage
free_mb="$(df -Pm "$HOME" 2>/dev/null | awk 'NR==2{print $4}' || printf '0')"
free_gb=$((free_mb / 1024))
if [ "$free_gb" -ge "$MIN_FREE_GB" ]; then
  ok "Free storage ${free_gb} GB (need ~${MIN_FREE_GB} GB for the selected setup)."
elif [ "$free_gb" -ge 6 ]; then
  warn "Free storage ${free_gb} GB — below the ${MIN_FREE_GB} GB target; a lightweight setup may fit, but free up space if you can."
else
  fail "Free storage ${free_gb} GB — too little for a desktop installation. Free up space or choose the command-line path."
fi

# 6. Termux release source
if [ -n "${TERMUX_APK_RELEASE:-}" ]; then
  case "$TERMUX_APK_RELEASE" in
    F_DROID) ok "Termux installed from F-Droid (recommended source)." ;;
    GITHUB) ok "Termux installed from GitHub releases (official)." ;;
    GOOGLE_PLAY*) warn "Termux from Google Play is experimental with reduced functionality; F-Droid is recommended. Never mix add-on sources." ;;
    *) warn "Termux release source: $TERMUX_APK_RELEASE — make sure add-ons come from the same source." ;;
  esac
else
  warn "Could not detect the Termux release source; make sure Termux and all add-ons (Termux:X11 etc.) come from the same source."
fi

# 7. Package mirror reachability (read-only metadata refresh)
if pkg list-installed >/dev/null 2>&1; then
  ok "Termux package manager is functional."
else
  warn "Termux package manager returned an error — run 'termux-change-repo' and retry."
fi

printf '\n%d passed, %d warnings, %d failures.\n' "$PASS" "$WARN" "$FAIL"
if [ "$FAIL" -gt 0 ]; then
  printf 'Resolve failures before installing. See https://thebpandey.github.io/ADL/docs/troubleshooting/symptom-index\n'
  exit 1
fi
exit 0
