#!/data/data/com.termux/files/usr/bin/bash
# adl-doctor.sh — diagnose an ADL installation. Diagnoses only; changes nothing.
# Runs in the Termux host environment.
set -euo pipefail

VERSION="1.0.0"
REDACT=0
PASS=0; WARN=0; FAIL=0

usage() {
  cat <<'EOF'
Usage: adl-doctor.sh [--redact] [--help] [--version]

Checks the whole ADL chain: Android version, architecture, Termux source,
required packages, storage, RAM, Termux:X11 package, proot-distro and
installed distros, shared tmp, DISPLAY/X11 socket, PulseAudio, and
package-manager locks. Prints PASS / WARN / FAIL per check with the next
diagnostic step. It never modifies anything.

Options:
  --redact    Omit device-identifying values (model, codename) so the output
              is safe to paste into a public issue.
  --version   Print version.   --help   Show this help.
EOF
}

for arg in "$@"; do
  case "$arg" in
    --redact) REDACT=1 ;;
    --version) printf '%s\n' "$VERSION"; exit 0 ;;
    --help|-h) usage; exit 0 ;;
    *) printf 'Unknown option: %s\n' "$arg" >&2; usage >&2; exit 2 ;;
  esac
done

ok()   { PASS=$((PASS+1)); printf 'PASS  %s\n' "$1"; }
warn() { WARN=$((WARN+1)); printf 'WARN  %s\n      -> %s\n' "$1" "${2:-See the ADL troubleshooting index.}"; }
fail() { FAIL=$((FAIL+1)); printf 'FAIL  %s\n      -> %s\n' "$1" "${2:-See the ADL troubleshooting index.}"; }

printf 'ADL doctor v%s (read-only)\n\n' "$VERSION"

if [ ! -d "/data/data/com.termux/files/usr" ]; then
  fail "Not running inside Termux." "Run this from the Termux app."
  exit 1
fi
ok "Running inside Termux."

if [ "$REDACT" -eq 0 ]; then
  printf 'Device: %s %s (Android %s)\n' \
    "$(getprop ro.product.manufacturer 2>/dev/null || printf '?')" \
    "$(getprop ro.product.model 2>/dev/null || printf '?')" \
    "$(getprop ro.build.version.release 2>/dev/null || printf '?')"
else
  printf 'Device: [redacted] (Android %s)\n' "$(getprop ro.build.version.release 2>/dev/null || printf '?')"
fi
printf '\n'

# Android version
sdk="$(getprop ro.build.version.sdk 2>/dev/null || printf '0')"
if [ "${sdk:-0}" -ge 26 ]; then ok "Android API $sdk meets Termux:X11's minimum (Android 8+)."
elif [ "${sdk:-0}" -ge 24 ]; then warn "Android API $sdk: Termux works, Termux:X11 needs Android 8+." "Use the VNC display path."
else fail "Android API $sdk below Termux minimum (Android 7)." "This device cannot run the stack."; fi

# Architecture
abi="$(getprop ro.product.cpu.abi 2>/dev/null || printf '?')"
case "$abi" in
  arm64-v8a) ok "Architecture arm64." ;;
  *) warn "Architecture $abi (expected arm64-v8a)." "Package availability may be limited." ;;
esac

# Termux source
if [ -n "${TERMUX_APK_RELEASE:-}" ]; then
  ok "Termux release source: $TERMUX_APK_RELEASE."
else
  warn "Termux release source not detectable." "Ensure Termux and add-ons share one source."
fi

# Storage / RAM
free_mb="$(df -Pm "$HOME" 2>/dev/null | awk 'NR==2{print $4}' || printf '0')"
if [ "${free_mb:-0}" -ge 3072 ]; then ok "Free storage: $((free_mb / 1024)) GB."
else warn "Free storage: $((free_mb / 1024)) GB — low." "Free space before installing more."; fi
ram_kb="$(awk '/MemTotal/{print $2}' /proc/meminfo 2>/dev/null || printf '0')"
ok "RAM: $((ram_kb / 1024 / 1024)) GB total."

# Packages
for p in proot-distro pulseaudio; do
  if command -v "$p" >/dev/null 2>&1; then ok "$p installed."
  else warn "$p not installed." "pkg install $p (or run adl-install-base.sh)."; fi
done
if command -v termux-x11 >/dev/null 2>&1; then
  ok "termux-x11 companion package installed."
else
  warn "termux-x11 package missing." "pkg install x11-repo && pkg install termux-x11-nightly"
fi

# Distro
if command -v proot-distro >/dev/null 2>&1; then
  installed="$(proot-distro list 2>/dev/null | grep -ci 'installed' || true)"
  if [ "${installed:-0}" -gt 0 ]; then
    ok "proot-distro reports an installed distribution."
  else
    warn "No Linux distribution installed yet." "adl-install-distro.sh --distro debian"
  fi
fi

# Shared tmp / X11 socket
if [ -d "$PREFIX/tmp" ]; then
  ok "Termux tmp directory exists ($PREFIX/tmp)."
  if [ -S "$PREFIX/tmp/.X11-unix/X1" ] || [ -S "$PREFIX/tmp/.X11-unix/X0" ]; then
    ok "An X11 socket exists — a display server has been started."
  else
    warn "No X11 socket found." "Start the display first (termux-x11 :1); sessions need proot-distro --shared-tmp."
  fi
else
  warn "Termux tmp directory missing." "Reinstall termux tools; \$PREFIX/tmp should exist."
fi

# PulseAudio
if pgrep -f pulseaudio >/dev/null 2>&1; then
  ok "PulseAudio is running."
else
  warn "PulseAudio not running." "adl-configure-audio.sh start (needed for desktop audio)."
fi

# Package-manager lock inside default distro (informational; read-only)
if command -v proot-distro >/dev/null 2>&1; then
  for d in debian ubuntu; do
    if proot-distro list 2>/dev/null | grep -qi "$d.*installed"; then
      if proot-distro login "$d" -- test -e /var/lib/dpkg/lock-frontend 2>/dev/null; then
        ok "$d: dpkg lock file present (normal); no stale-lock check performed (read-only)."
      fi
      break
    fi
  done
fi

# Network / DNS (lightweight, no data sent beyond a HEAD request)
if command -v curl >/dev/null 2>&1; then
  if curl -sI --max-time 8 https://packages.termux.dev >/dev/null 2>&1; then
    ok "Network and DNS reach the Termux package mirror."
  else
    warn "Cannot reach the Termux package mirror." "Check Wi-Fi/DNS; try termux-change-repo."
  fi
fi

printf '\n%d passed, %d warnings, %d failures.\n' "$PASS" "$WARN" "$FAIL"
printf 'Troubleshooting index: https://thebpandey.github.io/ADL/docs/troubleshooting/symptom-index\n'
[ "$FAIL" -eq 0 ]
