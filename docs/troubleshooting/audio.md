---
sidebar_position: 4
title: "Audio Issues"
description: "Troubleshooting audio problems including PulseAudio configuration, sound routing, and latency."
---

# Audio Issues

Audio in ADL relies on forwarding sound from the proot Linux environment to the Android host via PulseAudio over TCP. Because the Linux session runs inside proot --- not a true VM or container --- there is no direct access to hardware audio devices. Instead, PulseAudio inside the proot environment connects to a PulseAudio server running in Termux, which hands audio off to Android's native audio subsystem.

Understanding this chain is key to diagnosing most audio problems: **Linux app -> PulseAudio (proot) -> TCP -> PulseAudio (Termux) -> Android audio**.

## No Sound at All

<Troubleshooting items={[
  {
    problem: "No audio output from any application",
    solution: "First, verify that PulseAudio is running in both Termux and the proot environment. In Termux, run `pulseaudio --check` to confirm the server is alive. Inside proot, check that the PULSE_SERVER environment variable points to the correct TCP address. The standard configuration uses 127.0.0.1 on port 4713."
  },
  {
    problem: "PULSE_SERVER is not set or points to the wrong address",
    solution: "The environment variable must be exported in your shell profile so that all applications can find the PulseAudio server running in Termux. Add the export to your .bashrc or the ADL startup script."
  },
  {
    problem: "PulseAudio is running but applications report 'connection refused'",
    solution: "The Termux PulseAudio instance must load module-native-protocol-tcp to accept connections from the proot environment. This module listens on a TCP port and allows the proot PulseAudio client to forward audio. Check that the module is loaded and that the auth-anonymous option is enabled, since cookie-based authentication does not work reliably across the proot boundary."
  },
  {
    problem: "Android media volume is muted or set to zero",
    solution: "ADL audio ultimately passes through Android's media stream. Even if PulseAudio levels are at 100%, a muted Android media volume will produce silence. Use the Android volume buttons or system settings to raise the media volume."
  }
]} />

Confirm PulseAudio is running in Termux:

<CopyCommand command="pulseaudio --check && echo 'PulseAudio is running' || echo 'PulseAudio is NOT running'" />

If it is not running, start it with TCP module support:

<CopyCommand command="pulseaudio --start --load='module-native-protocol-tcp auth-ip-acl=127.0.0.1 auth-anonymous=1'" />

<Note>The `auth-ip-acl=127.0.0.1` option matters: it restricts connections to this device only. Anonymous authentication is acceptable **only** because of that localhost restriction --- never widen the ACL. This forwarding recipe is the community standard (documented in Termux issue trackers), not part of official Termux documentation.</Note>

<Warning>Known issue: audio output on **Android 16** has an open upstream report ([termux-packages #27978](https://github.com/termux/termux-packages/issues/27978)) affecting the PulseAudio Android sink. If your setup is correct but silent on Android 16, check that issue's status before debugging further.</Warning>

Inside the proot environment, set the server address:

<CopyCommand command="export PULSE_SERVER=tcp:127.0.0.1:4713" />

To make this persistent, add it to your profile:

<CopyCommand command="echo 'export PULSE_SERVER=tcp:127.0.0.1:4713' >> ~/.bashrc" />

Test that audio is working with a simple playback command:

<CopyCommand command="paplay /usr/share/sounds/freedesktop/stereo/bell.oga" />

<Note>
If `paplay` hangs without producing sound, the TCP connection is likely blocked. Verify with `pactl info` inside proot --- it should display the server name as your Termux PulseAudio instance, not report a connection failure.
</Note>

## Crackling or Distortion

<Troubleshooting items={[
  {
    problem: "Audio plays but has crackling, popping, or static noise",
    solution: "This is almost always caused by buffer underruns --- the audio pipeline cannot fill playback buffers fast enough. Increase the PulseAudio fragment size and buffer count in the Termux daemon configuration. Larger buffers trade latency for stability, which is usually the right tradeoff on Android devices."
  },
  {
    problem: "Distortion occurs only at higher sample rates (48kHz or above)",
    solution: "The TCP forwarding layer adds overhead that can cause problems at higher sample rates on slower devices. Force PulseAudio to resample everything to 44100 Hz, which reduces the data throughput and is sufficient for most use cases."
  },
  {
    problem: "Audio sounds fine initially but degrades after running for a while",
    solution: "This can indicate memory pressure or CPU throttling by Android. When the device heats up, Android may throttle CPU frequency, starving PulseAudio of processing time. Close unnecessary Android apps to free resources, and consider lowering the sample rate and channel count."
  }
]} />

Edit the Termux PulseAudio daemon configuration to increase buffer sizes:

<CopyCommand command="mkdir -p ~/.config/pulse && cp /data/data/com.termux/files/usr/etc/pulse/daemon.conf ~/.config/pulse/daemon.conf" />

Add or modify these lines in `~/.config/pulse/daemon.conf`:

<CopyCommand command="sed -i 's/; default-fragment-size-msec = .*/default-fragment-size-msec = 25/' ~/.config/pulse/daemon.conf" />

<CopyCommand command="sed -i 's/; default-fragments = .*/default-fragments = 4/' ~/.config/pulse/daemon.conf" />

To force a lower sample rate for stability:

<CopyCommand command="sed -i 's/; default-sample-rate = .*/default-sample-rate = 44100/' ~/.config/pulse/daemon.conf" />

Restart PulseAudio after making changes:

<CopyCommand command="pulseaudio --kill && pulseaudio --start --load='module-native-protocol-tcp auth-ip-acl=127.0.0.1 auth-anonymous=1'" />

<Warning>
Do not set fragment sizes below 10ms. Very small fragments increase CPU usage significantly and are more likely to cause underruns on mobile hardware, making the crackling worse rather than better.
</Warning>

## Audio Delay and Latency

<Troubleshooting items={[
  {
    problem: "Noticeable delay between actions and their sounds (e.g., clicking a button and hearing the click)",
    solution: "Some latency is inherent in the TCP forwarding architecture --- audio must traverse two PulseAudio instances and the Android audio HAL. A delay of 100--200ms is typical. You can reduce this by lowering buffer sizes, but this risks introducing crackling. Find the balance that works for your device."
  },
  {
    problem: "Audio and video are out of sync during media playback",
    solution: "Media players like VLC and mpv allow you to set an audio delay offset to compensate. This is preferable to aggressive buffer tuning because it addresses the symptom directly without risking stability. In VLC, use Tools > Track Synchronization. In mpv, use the --audio-delay flag."
  },
  {
    problem: "Latency suddenly increased after a system update or configuration change",
    solution: "Check whether the PulseAudio tsched (timer-based scheduling) setting has changed. In the proot environment, tsched should generally be disabled because it relies on kernel features not fully available under proot. Verify your module-udev-detect or module-detect load lines include tsched=0."
  }
]} />

To reduce latency, lower the fragment size (at the cost of stability):

<CopyCommand command="sed -i 's/default-fragment-size-msec = .*/default-fragment-size-msec = 15/' ~/.config/pulse/daemon.conf" />

Compensate for audio delay in mpv:

<CopyCommand command="mpv --audio-delay=-0.15 your_video_file.mp4" />

Disable timer-based scheduling inside proot (add to `/etc/pulse/default.pa` inside the proot environment):

<CopyCommand command="sed -i 's/load-module module-udev-detect.*/load-module module-detect tsched=0/' /etc/pulse/default.pa" />

<Tip>
For interactive use cases like gaming or music production, a latency of 50--100ms is the practical minimum with TCP forwarding. If lower latency is critical, consider using Termux-native audio tools instead of routing through the proot environment.
</Tip>

## PulseAudio Won't Start or Crashes

<Troubleshooting items={[
  {
    problem: "PulseAudio exits immediately on startup with 'failed to open cookie file' or authentication errors",
    solution: "In the proot environment, PulseAudio may try to create or read a cookie file for authentication. Since we use TCP with anonymous auth, the cookie file is not needed but its absence can still cause errors. Create the runtime directory and an empty cookie file to satisfy the check."
  },
  {
    problem: "PulseAudio fails with 'Unable to contact D-Bus session bus'",
    solution: "PulseAudio optionally integrates with D-Bus for session management. Inside proot, D-Bus may not be running or may not be properly configured. You can either start dbus-daemon manually or configure PulseAudio to run without D-Bus support by disabling the module-dbus-protocol module."
  },
  {
    problem: "PulseAudio crashes with segfault or 'failed to open module' errors",
    solution: "This usually indicates a version mismatch between PulseAudio and its modules, or missing dependencies. Reinstall PulseAudio and its modules to ensure consistency."
  },
  {
    problem: "Multiple PulseAudio instances conflict with each other",
    solution: "If both the Termux and proot instances try to act as a full server, they can conflict. The proot instance should run as a client-only configuration that forwards to the Termux server. Ensure that the proot PulseAudio default.pa does not try to load hardware-related modules like module-udev-detect or module-alsa-sink."
  }
]} />

Create the PulseAudio runtime directory and cookie file inside proot:

<CopyCommand command="mkdir -p /run/user/$(id -u)/pulse && touch /run/user/$(id -u)/pulse/cookie" />

<CopyCommand command="chmod 700 /run/user/$(id -u)/pulse" />

Disable D-Bus integration if it causes startup failures (comment it out in default.pa):

<CopyCommand command="sed -i 's/^load-module module-dbus-protocol/#load-module module-dbus-protocol/' /etc/pulse/default.pa" />

Kill all existing PulseAudio instances before restarting:

<CopyCommand command="pkill -9 pulseaudio; sleep 1; pulseaudio --start --load='module-native-protocol-tcp auth-ip-acl=127.0.0.1 auth-anonymous=1'" />

Reinstall PulseAudio if modules are corrupted:

<CopyCommand command="sudo apt install --reinstall pulseaudio pulseaudio-utils" />

Check PulseAudio logs for specific error details:

<CopyCommand command="pulseaudio -vvv --log-target=stderr 2>&1 | head -50" />

<Note>
Running PulseAudio with `-vvv` produces extremely verbose output. Redirect to a file if you need to capture more than the initial startup sequence for debugging: `pulseaudio -vvv --log-target=file=/tmp/pulse.log`.
</Note>

## Audio Works in Android but Not in Linux

<Troubleshooting items={[
  {
    problem: "Android apps play sound normally, but no Linux application in proot produces audio",
    solution: "This confirms the Android audio stack is functional and the problem is in the PulseAudio forwarding chain. Verify that the Termux PulseAudio server has the TCP module loaded and that the proot environment has PULSE_SERVER set correctly. Run `pactl info` inside proot to check connectivity."
  },
  {
    problem: "Some Linux apps produce sound but others do not",
    solution: "Applications that use ALSA directly rather than PulseAudio will not work, because ALSA requires kernel-level access to sound devices that proot cannot provide. Install the PulseAudio ALSA plugin (libasound2-plugins) so that ALSA-only applications route through PulseAudio transparently."
  },
  {
    problem: "Audio stopped working in Linux after Android updated or Termux was restarted",
    solution: "Android may reassign the port or the Termux PulseAudio server may not have restarted. Re-run the PulseAudio startup command in Termux and verify the TCP module is loaded. If you use the ADL startup script, it should handle this automatically --- see the installation guide for the recommended startup configuration."
  },
  {
    problem: "Firefox or Chromium in proot produces no audio",
    solution: "Browsers often use their own audio backend and may not default to PulseAudio. For Firefox, ensure the media.cubeb.backend preference is not overridden. For Chromium, launch with the --use-pulseaudio flag. Both browsers must see the PULSE_SERVER variable, so launch them from a terminal where the variable is set."
  }
]} />

Install the ALSA-to-PulseAudio bridge for applications that only support ALSA:

<CopyCommand command="sudo apt install libasound2-plugins" />

Create or update the ALSA configuration to route through PulseAudio:

<CopyCommand command="echo -e 'pcm.default pulse\nctl.default pulse' > ~/.asoundrc" />

Verify PulseAudio connectivity from inside proot:

<Terminal command="pactl info" output="Server String: tcp:127.0.0.1:4713
Library Protocol Version: 35
Server Protocol Version: 35
Default Sink: auto_null
Default Source: auto_null" />

<Warning>
If `pactl info` shows `Default Sink: auto_null`, the Termux PulseAudio server is reachable but has no output sink configured. Restart PulseAudio in Termux to reinitialize the Android audio sink.
</Warning>

Launch Chromium with PulseAudio support:

<CopyCommand command="chromium-browser --use-pulseaudio --no-sandbox" />

<BestPractice>
Add the PulseAudio environment variable and ALSA configuration to the ADL startup script rather than setting them manually each session. This ensures audio is ready as soon as the desktop environment launches. Refer to the [installation guide](/docs/quick-start/overview) for the recommended startup configuration.
</BestPractice>

## Audio Cuts Out When Screen Turns Off

<Troubleshooting items={[
  {
    problem: "Audio stops playing as soon as the device screen turns off",
    solution: "Android suspends background processes when the screen is off to conserve battery. Since audio in ADL flows through Termux's PulseAudio server, suspending Termux kills the audio pipeline. Acquire a Termux wake lock before starting audio playback --- this prevents Android from suspending the process when the screen is off."
  },
  {
    problem: "Audio cuts out intermittently when the screen is on but Termux is not the foreground app",
    solution: "Android's battery optimization may be throttling Termux even while the screen is on if another app is in the foreground. Disable battery optimization for Termux in Android Settings > Apps > Termux > Battery and select 'Unrestricted'. On Samsung devices, also check Settings > Battery > Background usage limits."
  },
  {
    problem: "Audio resumes after waking the screen but there is a gap or restart",
    solution: "When Android suspends and then resumes PulseAudio, the audio stream is interrupted rather than paused. The application must restart playback. There is no way to seamlessly resume because the PulseAudio connection is broken during suspension. The only reliable prevention is keeping the wake lock active during audio playback."
  },
  {
    problem: "Wake lock is active but audio still stops after extended screen-off time",
    solution: "Some aggressive manufacturer ROMs (especially Xiaomi MIUI and Huawei EMUI) override wake locks for apps they consider non-essential. In addition to the Termux wake lock, configure your device manufacturer's app protection settings. See [Termux Issues](/docs/troubleshooting/termux) for manufacturer-specific battery management steps."
  }
]} />

Acquire a wake lock to prevent audio interruption:

<CopyCommand command="termux-wake-lock" />

Release the wake lock when you no longer need background audio:

<CopyCommand command="termux-wake-unlock" />

<BestPractice>
If you regularly use ADL for audio playback (music, video calls, media editing), add `termux-wake-lock` to the beginning of your ADL startup script so it is always active during desktop sessions. This prevents audio dropouts without having to remember to acquire it manually each time.
</BestPractice>

## Further Resources

- For general environment issues that affect audio, see the [Environment Setup](/docs/troubleshooting/display) troubleshooting page.
- If audio problems coincide with display or performance issues, review [Performance Optimization](/docs/performance/overview) for system-wide tuning.
- PulseAudio's upstream documentation on [network setup](https://www.freedesktop.org/wiki/Software/PulseAudio/Documentation/User/Network/) covers the TCP module in detail.
