#!/data/data/com.termux/files/usr/bin/bash
# adl-configure-audio.sh — start PulseAudio forwarding for the Linux desktop.
# Runs in the Termux host environment.
#
# Background: sound from the Linux environment is NOT automatic. A PulseAudio
# server must run in Termux (where it reaches Android's audio output) and the
# Linux side must point at it with PULSE_SERVER=127.0.0.1. This is the
# community-standard recipe (not part of official Termux docs); it is
# restricted to this device only via the 127.0.0.1 ACL.
set -euo pipefail

VERSION="1.0.0"
ACTION="start"

usage() {
  cat <<'EOF'
Usage: adl-configure-audio.sh [start|stop|status] [--help] [--version]

start   Start the PulseAudio server with localhost-only TCP access (default).
stop    Stop the PulseAudio server.
status  Report whether the server is running.

After 'start', inside the Linux distro run (once, persisted by the guide):
    export PULSE_SERVER=127.0.0.1

Security: access is limited to 127.0.0.1 (apps on this device). Do not widen
the ACL. Known issue: audio on Android 16 has an open upstream report
(termux-packages #27978).
EOF
}

for arg in "$@"; do
  case "$arg" in
    start|stop|status) ACTION="$arg" ;;
    --version) printf '%s\n' "$VERSION"; exit 0 ;;
    --help|-h) usage; exit 0 ;;
    *) printf 'Unknown option: %s\n' "$arg" >&2; usage >&2; exit 2 ;;
  esac
done

if [ ! -d "/data/data/com.termux/files/usr" ]; then
  printf 'This script must run inside the Termux app (not inside a Linux distro).\n' >&2
  exit 1
fi

case "$ACTION" in
  status)
    if pgrep -f pulseaudio >/dev/null 2>&1; then
      printf 'PulseAudio is running.\n'
    else
      printf 'PulseAudio is NOT running. Start it with: adl-configure-audio.sh start\n'
    fi
    ;;
  stop)
    if pgrep -f pulseaudio >/dev/null 2>&1; then
      pulseaudio --kill 2>/dev/null || pkill -f pulseaudio || true
      printf 'PulseAudio stopped.\n'
    else
      printf 'PulseAudio was not running.\n'
    fi
    ;;
  start)
    if ! command -v pulseaudio >/dev/null 2>&1; then
      printf 'pulseaudio is not installed. Run: pkg install pulseaudio (or adl-install-base.sh)\n' >&2
      exit 1
    fi
    if pgrep -f pulseaudio >/dev/null 2>&1; then
      printf 'PulseAudio is already running — nothing to do.\n'
      exit 0
    fi
    printf 'Starting PulseAudio (localhost-only TCP access)…\n'
    pulseaudio --start \
      --load="module-native-protocol-tcp auth-ip-acl=127.0.0.1 auth-anonymous=1" \
      --exit-idle-time=-1
    if pgrep -f pulseaudio >/dev/null 2>&1; then
      printf 'Running. Inside the Linux distro, set:  export PULSE_SERVER=127.0.0.1\n'
      printf 'Test with any audio app; sound follows whatever output Android uses\n'
      printf '(speakers, Bluetooth, wired). HDMI/monitor audio depends on Android routing.\n'
    else
      printf 'PulseAudio failed to start. See https://thebpandey.github.io/ADL/docs/troubleshooting/audio\n' >&2
      exit 1
    fi
    ;;
esac
