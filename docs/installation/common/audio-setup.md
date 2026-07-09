---
sidebar_position: 5
title: "Audio Setup"
description: "Configuring PulseAudio for audio support in ADL (Android Desktop Linux)."
custom_fields:
  estimated_time: "15 minutes"
  difficulty: "Intermediate"
---

# Audio Setup

Audio in ADL works by bridging PulseAudio between two layers: the Termux environment running on Android, and the Ubuntu proot installation running inside Termux. Android handles the actual hardware audio output, Termux's PulseAudio server connects to Android's audio system, and Ubuntu's PulseAudio client forwards audio through Termux's server to reach the hardware. This guide walks you through installing and configuring PulseAudio on both sides so that applications running in your Ubuntu desktop can play sound through your Android device's speakers, headphones, or Bluetooth audio.

<Note>
Audio setup is optional. Your desktop environment will work without it, but you will not hear any sound from applications. If you do not need audio, you can skip this page and go directly to [Post-Install Configuration](/docs/installation/common/post-install).
</Note>

## Step 1: Install PulseAudio in Termux

PulseAudio must be installed in Termux first because Termux is the layer that talks directly to Android's audio subsystem. The Termux PulseAudio package is built specifically to interface with Android's audio HAL (Hardware Abstraction Layer).

Open Termux (not the Ubuntu proot session) and run:

<CopyCommand command="pkg install pulseaudio -y" />

<ExpectedResult>
Termux will download and install PulseAudio and its dependencies. When finished, you will see the Termux prompt with no errors. You can verify the installation by running `pulseaudio --version`, which should print a version number like `pulseaudio 17.0`.
</ExpectedResult>

<Warning title="Run This in Termux, Not Ubuntu">
This command must be run in the Termux shell, not inside your Ubuntu proot environment. The Termux PulseAudio package is compiled for Android's audio stack. Installing PulseAudio inside Ubuntu alone will not give you working audio because Ubuntu running under proot has no direct access to Android's audio hardware.
</Warning>

## Step 2: Install PulseAudio in Ubuntu

Now enter your Ubuntu proot session and install the PulseAudio client tools. These allow applications inside Ubuntu to send audio to a PulseAudio server (which will be the Termux PulseAudio instance).

<CopyCommand command="apt install pulseaudio -y" />

<ExpectedResult>
Ubuntu will install the PulseAudio client libraries and utilities. You should see the package manager complete without errors. The installed tools include `paplay` (for playing audio files), `pactl` (for controlling PulseAudio), and `pacmd` (for advanced configuration).
</ExpectedResult>

<Tip>
If you also want volume control in your desktop environment, install the PulseAudio volume control GUI:

<CopyCommand command="apt install pavucontrol -y" />

This gives you a graphical mixer that lets you adjust per-application volume levels, select output devices, and monitor audio streams.
</Tip>

## Step 3: Configure PulseAudio

Ubuntu's PulseAudio client needs to know where to send audio. Instead of trying to start its own server (which will fail under proot), it should connect to the Termux PulseAudio server over a TCP socket.

### 3a: Configure Termux's PulseAudio Server

In Termux (not Ubuntu), edit the PulseAudio configuration to enable TCP connections. First, create or edit the PulseAudio configuration file:

<CopyCommand command="nano $PREFIX/etc/pulse/default.pa" />

Add the following lines at the end of the file. If the file already contains a `load-module module-native-protocol-tcp` line, replace it with the version below:

```
load-module module-native-protocol-tcp auth-ip-acl=127.0.0.1 auth-anonymous=1
```

This tells the Termux PulseAudio server to accept TCP connections from localhost without requiring authentication cookies. Since proot shares the same network namespace as Termux, Ubuntu can connect over 127.0.0.1.

<BestPractice>
The `auth-ip-acl=127.0.0.1` setting restricts connections to localhost only. Do not change this to `0.0.0.0` or remove the ACL, as that would allow any device on your network to stream audio through your phone.
</BestPractice>

### 3b: Configure Ubuntu's PulseAudio Client

Inside your Ubuntu proot session, edit the PulseAudio client configuration:

<CopyCommand command="nano /etc/pulse/client.conf" />

Add or modify these settings:

```
default-server = 127.0.0.1
autospawn = no
```

The `default-server` line tells Ubuntu's PulseAudio client to connect to the Termux PulseAudio server running on localhost. The `autospawn = no` line prevents Ubuntu from trying to start its own PulseAudio server, which would fail inside proot and cause confusing error messages.

<Note>
The `autospawn = no` setting is important. Without it, every application that tries to play audio will first attempt to spawn a new PulseAudio server inside proot, which will fail and add a several-second delay before falling back to the configured server.
</Note>

## Step 4: Update the Launch Script

To make audio work automatically every time you start your desktop, you need to add PulseAudio startup commands to your launch script. The PulseAudio server in Termux must be running before Ubuntu tries to connect to it.

Edit your launch script:

<CopyCommand command="nano ~/start-desktop.sh" />

Add the following lines near the top of the script, before the command that launches Ubuntu (the `proot-distro login` line):

```bash
# Kill any existing PulseAudio server to avoid conflicts
pulseaudio --kill 2>/dev/null

# Start PulseAudio server in Termux
pulseaudio --start --load="module-native-protocol-tcp auth-ip-acl=127.0.0.1 auth-anonymous=1" --exit-idle-time=-1

# Export PULSE_SERVER so Ubuntu knows where to connect
export PULSE_SERVER=127.0.0.1
```

Then make sure the `PULSE_SERVER` variable is passed into the proot environment. In your `proot-distro login` command, add the `--shared-tmp` flag if it is not already present, and pass the environment variable. Your launch command should look similar to this:

```bash
proot-distro login ubuntu --shared-tmp -- /bin/bash -c "export PULSE_SERVER=127.0.0.1 && /usr/bin/startxfce4"
```

<Warning title="Order Matters">
The PulseAudio server must start before the `proot-distro login` command. If you place the PulseAudio startup lines after the proot login, they will never execute because the proot session takes over the shell.
</Warning>

The `--exit-idle-time=-1` flag prevents PulseAudio from shutting itself down when no audio is playing. Without this, the server would stop after a period of silence, and you would lose audio until the next restart.

## Step 5: Test Audio

Restart your desktop session by running your launch script, or if you want to test immediately, start PulseAudio manually in Termux first:

```bash
pulseaudio --start --load="module-native-protocol-tcp auth-ip-acl=127.0.0.1 auth-anonymous=1" --exit-idle-time=-1
```

Then, inside your Ubuntu session, verify the connection to the PulseAudio server:

<CopyCommand command="pactl info" />

<ExpectedResult>
You should see output that includes `Server Name: pulseaudio` and `Server String: 127.0.0.1`. If you see `Connection refused` or `Connection failure`, the Termux PulseAudio server is not running or the configuration is incorrect.
</ExpectedResult>

### Test with a Sound File

Generate and play a test tone:

<CopyCommand command="speaker-test -t sine -f 440 -l 1" />

<ExpectedResult>
You should hear a short sine wave tone (440 Hz, the standard A note) through your device's speaker or connected headphones. Press Ctrl+C to stop if it continues playing.
</ExpectedResult>

If `speaker-test` is not available, install ALSA utilities:

<CopyCommand command="apt install alsa-utils -y" />

Alternatively, you can test with a WAV file if you have one:

<CopyCommand command="paplay /usr/share/sounds/freedesktop/stereo/bell.oga" />

<Tip>
If the freedesktop sound theme is not installed, you can install it with `apt install sound-theme-freedesktop -y` to get a collection of test sounds.
</Tip>

### Check Audio Volume

If the test commands run without errors but you hear nothing, check the volume level:

<CopyCommand command="pactl get-sink-volume @DEFAULT_SINK@" />

If the volume is at 0%, set it to a reasonable level:

<CopyCommand command="pactl set-sink-volume @DEFAULT_SINK@ 70%" />

Also ensure the output is not muted:

<CopyCommand command="pactl set-sink-mute @DEFAULT_SINK@ 0" />

<CollapsibleSection title="How PulseAudio Bridging Works">

Understanding the audio path helps with troubleshooting. Here is how sound travels from an application in Ubuntu to your Android device's speaker:

1. **Application layer**: An app like Firefox or VLC uses the PulseAudio client library (libpulse) to output audio. The app does not know or care that it is running under proot.

2. **PulseAudio client (Ubuntu)**: The client library reads `/etc/pulse/client.conf`, sees `default-server = 127.0.0.1`, and opens a TCP connection to port 4713 on localhost.

3. **Network namespace**: Because proot does not create a separate network namespace (unlike Docker or full VMs), localhost inside Ubuntu is the same as localhost in Termux. The TCP connection reaches the Termux PulseAudio server directly.

4. **PulseAudio server (Termux)**: The Termux PulseAudio server receives the audio stream over TCP. It was compiled against Android's audio libraries (OpenSL ES or AAudio depending on the Android version).

5. **Android audio HAL**: PulseAudio in Termux passes the audio to Android's audio system, which handles mixing with other apps, routing to the correct output device (speaker, headphones, Bluetooth), and volume control.

This architecture means that system-level volume controls on Android still work. Pressing the hardware volume buttons adjusts the final output even for audio originating from Ubuntu applications.

The TCP-based approach is used instead of Unix sockets because proot's filesystem isolation can make Unix socket paths unreliable. TCP on localhost is both simpler and more reliable in the proot environment.

</CollapsibleSection>

## Troubleshooting

<Troubleshooting items={[
  {
    problem: "No sound at all - pactl info shows &apos;Connection refused&apos;",
    solution: "The Termux PulseAudio server is not running. Exit your Ubuntu session back to Termux and run: pulseaudio --start --load=\"module-native-protocol-tcp auth-ip-acl=127.0.0.1 auth-anonymous=1\" --exit-idle-time=-1. If it reports &apos;already running&apos; but still does not work, kill it first with pulseaudio --kill, then start it again. Verify it is running with pulseaudio --check; the command should return silently with exit code 0."
  },
  {
    problem: "Crackling or distorted audio during playback",
    solution: "This is usually caused by buffer underruns when the system is under load. Increase the PulseAudio buffer size by editing $PREFIX/etc/pulse/daemon.conf in Termux and adding: default-fragment-size-msec = 25 and default-fragments = 4. Then restart PulseAudio. If the problem persists on older or lower-end devices, try increasing default-fragment-size-msec to 50. Larger buffers reduce crackling but increase latency."
  },
  {
    problem: "Noticeable audio delay or latency (audio lags behind video)",
    solution: "Some latency is inherent in the bridged architecture. To minimize it, edit $PREFIX/etc/pulse/daemon.conf in Termux and set: default-fragment-size-msec = 10 and default-fragments = 2. This reduces the buffer size for lower latency at the cost of potential crackling on slower devices. For video playback, most media players (VLC, mpv) have an audio delay adjustment in their settings that can compensate for the remaining latency."
  },
  {
    problem: "Audio works in Termux but not inside Ubuntu",
    solution: "Check that /etc/pulse/client.conf inside Ubuntu contains default-server = 127.0.0.1 and autospawn = no. Verify the PULSE_SERVER environment variable is set by running echo $PULSE_SERVER inside Ubuntu - it should print 127.0.0.1. If it is empty, add export PULSE_SERVER=127.0.0.1 to your ~/.bashrc inside Ubuntu or to the launch command in your start-desktop.sh script. Also confirm that the PulseAudio client package is installed in Ubuntu with dpkg -l | grep pulseaudio."
  },
  {
    problem: "Bluetooth audio does not work or cuts out frequently",
    solution: "Bluetooth audio is managed entirely by Android, not by PulseAudio. Ensure your Bluetooth headphones or speaker are connected through Android&apos;s Bluetooth settings (not through any Linux Bluetooth manager). Once connected at the Android level, PulseAudio in Termux will automatically route audio to the Bluetooth device. If audio cuts out, check that Android&apos;s battery optimization is disabled for Termux (Settings > Apps > Termux > Battery > Unrestricted). Bluetooth audio codecs like LDAC or aptX are handled by Android and will work normally."
  }
]} />

<Note>
To learn more about how PulseAudio works and why it is used for audio in ADL, see [What is PulseAudio?](/docs/learn/concepts/what-is-pulseaudio) in the Learn track.
</Note>

## Next Step

With audio configured, proceed to [Post-Install Configuration](/docs/installation/common/post-install) to finalize your ADL setup.
