/**
 * Guided installer — personalized guide generator.
 *
 * Pure function: generateGuide(assessment, answers, config) returns a typed
 * step plan. Commands come from templates parameterized by distro, desktop,
 * username, display, and audio choice; user-controlled values are sanitized
 * before they reach a command string. Facts and commands are verified against
 * the sources in data/sources.json (see the methodology page).
 */
import { DEFAULT_USERNAME, sanitizeUsername } from "../compatibility/rules";
import type { AssessmentResult, DesktopId, DistroId, WizardAnswers } from "../compatibility/types";

export type StepEnvironment =
  | "Android Settings"
  | "Android browser"
  | "Termux host"
  | "Inside the Linux distro"
  | "Termux:X11 app"
  | "Another computer (ADB)"
  | "Optional advanced step";

export interface GuideStep {
  id: string;
  title: string;
  purpose: string;
  environment: StepEnvironment;
  commands?: string[];
  actions?: string[];
  expected: string;
  verify?: string;
  failures?: string[];
  recovery?: string;
  security?: string;
  reversible: boolean;
  optional?: boolean;
  checkpoint?: string;
  kbLink?: string;
}

export interface GuideSection {
  id: string;
  title: string;
  steps: GuideStep[];
}

export interface GuidePlan {
  version: number;
  distro: DistroId;
  desktop: DesktopId;
  username: string;
  display: string;
  audio: boolean;
  sections: GuideSection[];
}

export const GUIDE_PLAN_VERSION = 1;

const DISTRO_INSTALL_NAME: Record<DistroId, string> = {
  debian: "debian",
  ubuntu: "ubuntu",
  alpine: "alpine",
  archlinux: "archlinux",
};

const SESSION_COMMAND: Record<Exclude<DesktopId, "cli-only">, string> = {
  xfce: "startxfce4",
  mate: "mate-session",
  lxqt: "startlxqt",
  plasma: "startplasma-x11",
  gnome: "gnome-session",
};

const DESKTOP_PACKAGES: Record<DistroId, Partial<Record<DesktopId, string>>> = {
  debian: {
    xfce: "xfce4 xfce4-terminal dbus-x11",
    mate: "mate-desktop-environment dbus-x11",
    lxqt: "lxqt-core qterminal dbus-x11",
    plasma: "kde-plasma-desktop kwin-x11 dbus-x11",
    gnome: "gnome-core dbus-x11",
  },
  ubuntu: {
    xfce: "xfce4 xfce4-terminal dbus-x11",
    mate: "mate-desktop-environment dbus-x11",
    lxqt: "lxqt-core qterminal dbus-x11",
    plasma: "kde-plasma-desktop kwin-x11 dbus-x11",
    gnome: "gnome-core dbus-x11",
  },
  alpine: {},
  archlinux: {
    xfce: "xfce4 xfce4-terminal dbus",
    mate: "mate mate-terminal dbus",
    lxqt: "lxqt dbus",
    plasma: "plasma-desktop dbus",
  },
};

const PKG_UPDATE: Record<DistroId, string[]> = {
  debian: ["apt update", "apt upgrade -y"],
  ubuntu: ["apt update", "apt upgrade -y"],
  alpine: ["apk update", "apk upgrade"],
  archlinux: ["pacman -Syu --noconfirm"],
};

export interface GuideConfig {
  username?: string;
  display?: string; // ":1"
}

export function generateGuide(
  assessment: AssessmentResult,
  answers: WizardAnswers,
  config: GuideConfig = {},
): GuidePlan {
  const distro = assessment.recommendation.distro.id as DistroId;
  const desktop = assessment.recommendation.desktop.id as DesktopId;
  const username = sanitizeUsername(config.username ?? "") ?? DEFAULT_USERNAME;
  const display = /^:\d{1,2}$/.test(config.display ?? "") ? (config.display as string) : ":1";
  const cli = desktop === "cli-only";
  const audio =
    !cli &&
    (answers.audioTargets ?? []).length > 0 &&
    !(answers.audioTargets ?? []).includes("not-required");
  const samsung = (answers.manufacturer ?? "").toLowerCase().includes("samsung");
  const android12plus = (answers.androidVersion ?? 0) >= 12;
  const vnc = assessment.recommendation.displayMethod.id === "vnc";
  const wiredDisplay = assessment.recommendation.displayMethod.id === "termux-x11-external";
  const sessionCmd = cli ? "" : SESSION_COMMAND[desktop as Exclude<DesktopId, "cli-only">];
  const installName = DISTRO_INSTALL_NAME[distro];
  const sections: GuideSection[] = [];

  const dq = (s: string) => s; // readability marker for command strings

  // ------------------------------------------------------------------ 1. Prep
  sections.push({
    id: "prepare",
    title: "Before you start",
    steps: [
      {
        id: "backup",
        title: "Back up important data",
        purpose:
          "Everything here runs in user space, but installations can fill storage and settings will be changed; a current backup is your safety net.",
        environment: "Android Settings",
        actions: [
          "Confirm your photos, contacts, and documents are backed up (Samsung Cloud / Google One / your usual method).",
        ],
        expected: "You know your data is recoverable if anything goes wrong.",
        reversible: true,
      },
      {
        id: "charge-wifi",
        title: "Charge the phone and connect to Wi-Fi",
        purpose:
          "The installation downloads several gigabytes; Wi-Fi avoids mobile-data charges and a charged battery avoids mid-install shutdowns.",
        environment: "Android Settings",
        actions: ["Charge to at least 50% or stay plugged in.", "Connect to a stable Wi-Fi network."],
        expected: "Stable network and power for the next hour.",
        reversible: true,
      },
      {
        id: "check-storage",
        title: `Confirm at least ${assessment.estimatedStorageGb} GB of free storage`,
        purpose:
          "This estimate covers Termux, the Linux system, the desktop, a browser, package caches, and a safety reserve for your selected goals.",
        environment: "Android Settings",
        actions: ["Open Settings > Battery and device care > Storage (or Settings > Storage) and check free space."],
        expected: `${assessment.estimatedStorageGb} GB or more free.`,
        failures: ["Less free space than the estimate."],
        recovery:
          "Free up space first (offload photos/videos), or return to the wizard and pick a lighter configuration — running out of space mid-install leaves broken packages.",
        reversible: true,
      },
    ],
  });

  // --------------------------------------------------------- 2. Android prep
  const prep: GuideStep[] = [];
  if (samsung) {
    prep.push({
      id: "samsung-auto-blocker",
      title: "Samsung only: temporarily allow the Termux:X11 install",
      purpose:
        "One UI 6+ ships Auto Blocker enabled, which blocks sideloaded APKs — including the official Termux:X11 app. You will disable it only for the installation step and turn it back on afterwards.",
      environment: "Android Settings",
      actions: [
        "Open Settings > Security and privacy > Auto Blocker.",
        "If it is On, switch it Off for now — the guide reminds you to re-enable it right after the Termux:X11 APK is installed.",
      ],
      expected: "Auto Blocker temporarily off (or confirmed already off).",
      security:
        "This temporarily reduces install-source protection. Re-enable it immediately after the install step — the guide includes that step.",
      reversible: true,
      kbLink: "/docs/learn/software/termux-x11",
    });
  }
  prep.push({
    id: "battery-optimization",
    title: "Exempt Termux from battery optimization",
    purpose:
      "Android aggressively suspends background apps; long package installs and desktop sessions die without this exemption.",
    environment: "Android Settings",
    actions: [
      "Settings > Apps > Termux > Battery — choose Unrestricted (wording varies by manufacturer).",
      "Repeat for Termux:X11 after it is installed.",
    ],
    expected: "Termux allowed to run without battery restrictions.",
    security:
      "Slightly higher battery use for Termux only. Reversible at any time in the same menu.",
    reversible: true,
  });
  if (android12plus) {
    prep.push({
      id: "phantom-note",
      title: "Android 12+: know the “signal 9” symptom",
      purpose:
        "Android 12 and later can kill background Termux processes (the phantom-process limit). If a session ever dies showing “[Process completed (signal 9)]”, that is this — not something you broke.",
      environment: "Optional advanced step",
      actions: [
        "No action needed now. If it becomes a recurring problem, the troubleshooting index documents optional ADB-based mitigations with their risks — they are never applied automatically.",
      ],
      expected: "You will recognize the symptom if it appears.",
      reversible: true,
      kbLink: "/docs/troubleshooting/symptom-index",
      optional: true,
    });
  }
  sections.push({ id: "android-prep", title: "Prepare Android", steps: prep });

  // --------------------------------------------------------- 3. Install Termux
  sections.push({
    id: "install-termux",
    title: "Install Termux",
    steps: [
      {
        id: "get-termux",
        title: "Install Termux from F-Droid",
        purpose:
          "Termux is the terminal that everything else runs inside. F-Droid is the recommended official source; Google Play's build is experimental with reduced functionality. Never mix sources — add-ons must match Termux's signing key.",
        environment: "Android browser",
        actions: [
          "Open https://f-droid.org/en/packages/com.termux/ and download the latest APK (no need to install the F-Droid app).",
          "Open the downloaded APK; allow your browser to install unknown apps when Android asks (you can revoke this afterwards).",
        ],
        expected: "Termux appears in your app list and opens to a $ prompt.",
        verify: "Open Termux — you should see a welcome message and a $ prompt.",
        failures: ["Install blocked (unknown sources).", "Signature error mentioning an existing installation."],
        recovery:
          "For install blocks, grant the browser the 'install unknown apps' permission (Settings > Apps > your browser > Install unknown apps). A signature error means an old Termux from a different source exists — back up and uninstall it first.",
        security:
          "Sideloading permission for the browser can be revoked after installation.",
        reversible: true,
        kbLink: "/docs/quick-start/install-termux",
        checkpoint: "You can open Termux and see the $ prompt.",
      },
      {
        id: "update-termux",
        title: "Update Termux packages",
        purpose: "A fresh package list avoids 'package not found' errors in every later step.",
        environment: "Termux host",
        commands: ["pkg update && pkg upgrade -y"],
        expected: "Package lists refresh and upgrades complete without errors.",
        failures: ["Repository/mirror errors."],
        recovery: "Run 'termux-change-repo', pick another mirror, and retry.",
        reversible: true,
      },
    ],
  });

  // --------------------------------------------- 4. Display server (or VNC)
  if (!cli && !vnc) {
    const x11: GuideStep[] = [
      {
        id: "x11-packages",
        title: "Install the Termux:X11 packages",
        purpose: "The x11-repo provides the Termux-side companion package the display app talks to.",
        environment: "Termux host",
        commands: ["pkg install -y x11-repo", "pkg install -y termux-x11-nightly"],
        expected: "Both installs complete without errors.",
        reversible: true,
        kbLink: "/docs/learn/software/termux-x11",
      },
      {
        id: "x11-apk",
        title: "Install the Termux:X11 Android app",
        purpose:
          "The APK is the on-screen window your Linux desktop renders into. It must come from the official Termux:X11 releases so its signature matches.",
        environment: "Android browser",
        actions: [
          "Open https://github.com/termux/termux-x11/releases/tag/nightly",
          "Download app-universal-debug.apk (works on all devices) and install it.",
          "Grant Termux:X11 notification permission when asked (needed on Android 13+).",
        ],
        expected: "Termux:X11 appears in your app list.",
        failures: ["Install silently blocked on Samsung (Auto Blocker).", "Signature mismatch error."],
        recovery:
          samsung
            ? "If blocked: Settings > Security and privacy > Auto Blocker — disable, install, then re-enable (next step). A signature mismatch means a Termux:X11 from another source exists; uninstall it first."
            : "A signature mismatch means a Termux:X11 from another source exists; uninstall it first.",
        reversible: true,
        checkpoint: "Termux:X11 is installed and can be opened (it shows a waiting screen).",
      },
    ];
    if (samsung) {
      x11.push({
        id: "reenable-auto-blocker",
        title: "Samsung only: re-enable Auto Blocker",
        purpose: "The APK is installed; restore Samsung's install-source protection now.",
        environment: "Android Settings",
        actions: ["Settings > Security and privacy > Auto Blocker — switch it back On."],
        expected: "Auto Blocker is On again.",
        security: "Restores the protection that was temporarily disabled.",
        reversible: true,
      });
    }
    sections.push({ id: "display-server", title: "Set up the display (Termux:X11)", steps: x11 });
  }
  if (!cli && vnc) {
    sections.push({
      id: "display-server",
      title: "Set up the display (VNC)",
      steps: [
        {
          id: "vnc-install",
          title: "Install the VNC server in Termux",
          purpose:
            "VNC serves the desktop to a viewer app or another computer. It stays on localhost by default and always requires a password.",
          environment: "Termux host",
          commands: ["pkg install -y tigervnc", "vncserver -localhost :1"],
          expected:
            "On first run you are prompted to set a VNC password (max 8 characters). The server reports it is listening on display :1 (port 5901).",
          verify: "Connect a VNC viewer to 127.0.0.1:5901 (on-device) with the password.",
          failures: ["Viewer cannot connect."],
          recovery: "Check the server is running ('vncserver -list'); restart with 'vncserver -kill :1' then 'vncserver -localhost :1'.",
          security:
            "Keep -localhost. Never expose an unauthenticated VNC server on all interfaces; use SSH tunneling to reach it from another computer.",
          reversible: true,
          kbLink: "/docs/troubleshooting/display",
        },
      ],
    });
  }

  // ------------------------------------------------------ 5. Install the distro
  sections.push({
    id: "install-distro",
    title: `Install ${cap(distro)} with proot-distro`,
    steps: [
      {
        id: "proot-distro-install",
        title: "Install proot-distro and the Linux system",
        purpose:
          "proot-distro downloads the Linux system and runs it in user space — Android keeps running and nothing is flashed or rooted.",
        environment: "Termux host",
        commands: ["pkg install -y proot-distro", dq(`proot-distro install ${installName}`)],
        expected: `The ${cap(distro)} image downloads and unpacks (1–2 GB; several minutes on Wi-Fi).`,
        verify: `proot-distro list  # shows ${installName} as installed`,
        failures: ["Download interrupted.", "'No space left on device'."],
        recovery:
          "Re-run the install command (it resumes/retries). For space errors, free storage first — see the troubleshooting index.",
        reversible: true,
        kbLink: "/docs/learn/software/proot-distro",
        checkpoint: `'proot-distro list' shows ${installName} installed.`,
      },
      {
        id: "distro-update",
        title: `Enter ${cap(distro)} and update it`,
        purpose: "First login as (simulated) root to bring the fresh system up to date.",
        environment: "Inside the Linux distro",
        commands: [dq(`proot-distro login ${installName} --shared-tmp`), ...PKG_UPDATE[distro]],
        expected: "You see the distro's root prompt (#) and updates complete.",
        verify: "cat /etc/os-release  # shows the distribution name",
        failures: ["dpkg/apt lock errors after an interruption."],
        recovery:
          distro === "debian" || distro === "ubuntu"
            ? "Run 'dpkg --configure -a' then 'apt --fix-broken install' and retry."
            : "Re-run the update command; check network and storage.",
        reversible: true,
        checkpoint: `You reached the ${cap(distro)} shell prompt.`,
      },
    ],
  });

  // --------------------------------------------------------- 6. Non-root user
  const userCmds: string[] =
    distro === "alpine"
      ? [dq(`adduser ${username}`), dq(`apk add sudo`), dq(`echo '${username} ALL=(ALL) ALL' > /etc/sudoers.d/${username}`)]
      : distro === "archlinux"
        ? [dq(`useradd -m -G wheel -s /bin/bash ${username}`), dq(`passwd ${username}`), "pacman -S --noconfirm sudo", dq(`echo '%wheel ALL=(ALL:ALL) ALL' > /etc/sudoers.d/wheel`)]
        : [dq(`apt install -y sudo`), dq(`adduser ${username}`), dq(`usermod -aG sudo ${username}`)];
  sections.push({
    id: "create-user",
    title: "Create your Linux user",
    steps: [
      {
        id: "adduser",
        title: `Create the user “${username}”`,
        purpose:
          "Browsers and many desktop apps misbehave (or refuse to run) as root, and running everything as root is poor Linux practice. This creates a normal user with sudo for administration. Note: the “root” inside the distro is simulated by proot — it is not Android root either way.",
        environment: "Inside the Linux distro",
        commands: userCmds,
        expected: "The user is created (you will be asked to set a password).",
        verify: `id ${username}  # shows the user and groups`,
        failures: ["'user already exists' on a re-run."],
        recovery: "Already existing is fine — continue.",
        reversible: true,
        kbLink: "/docs/learn/concepts/linux-on-android-explained",
      },
      {
        id: "login-as-user",
        title: "Log in as your user from now on",
        purpose: "All day-to-day sessions should run as this user; keep root logins for maintenance.",
        environment: "Termux host",
        commands: ["exit  # leave the root session first", dq(`proot-distro login ${installName} --user ${username} --shared-tmp`)],
        expected: `The prompt shows ${username}@ instead of root@.`,
        verify: "whoami",
        reversible: true,
        checkpoint: `'whoami' prints ${username}.`,
      },
    ],
  });

  // --------------------------------------------------------- 7. Desktop install
  if (!cli) {
    const pkgs = DESKTOP_PACKAGES[distro][desktop];
    const installCmd =
      distro === "archlinux"
        ? `sudo pacman -S --noconfirm ${pkgs}`
        : `sudo apt install -y ${pkgs}`;
    sections.push({
      id: "install-desktop",
      title: `Install the ${cap(desktop)} desktop`,
      steps: [
        {
          id: "desktop-packages",
          title: `Install ${cap(desktop)}`,
          purpose:
            "This pulls the desktop session, window manager, panel, and a terminal. It is the largest download of the whole process.",
          environment: "Inside the Linux distro",
          commands: pkgs
            ? [installCmd]
            : [`# ${cap(desktop)} on ${cap(distro)} is not covered by this guide's verified templates.`],
          expected: "Several hundred packages install; this takes a while. Keep the screen awake.",
          failures: ["Interrupted install (Android killed the session).", "Out of storage."],
          recovery:
            distro === "debian" || distro === "ubuntu"
              ? "Reopen the session and run 'sudo dpkg --configure -a && sudo apt --fix-broken install', then retry the install command — it resumes where it stopped."
              : "Re-run the install command; the package manager resumes.",
          reversible: true,
          checkpoint: `'which ${sessionCmd}' prints a path.`,
          verify: `which ${sessionCmd}`,
        },
      ],
    });
  }

  // --------------------------------------------------------- 8. Audio
  if (audio) {
    sections.push({
      id: "audio",
      title: "Set up audio",
      steps: [
        {
          id: "pulse-forward",
          title: "Forward sound from Linux to Android",
          purpose:
            "Sound is not automatic: a PulseAudio server must run in Termux (where it can reach Android's audio output) and the Linux side must be told to send audio to it. Because PulseAudio plays through Android, sound follows whatever output Android uses — speakers, Bluetooth, or wired. This recipe is the community standard (it is not in official Termux docs) and is restricted to this device only (127.0.0.1).",
          environment: "Termux host",
          commands: [
            "pkg install -y pulseaudio",
            dq(
              'pulseaudio --start --load="module-native-protocol-tcp auth-ip-acl=127.0.0.1 auth-anonymous=1" --exit-idle-time=-1',
            ),
          ],
          expected: "PulseAudio starts in the background (no output means success).",
          verify: "pgrep -f pulseaudio  # prints a process id",
          security:
            "auth-anonymous is acceptable only because auth-ip-acl restricts connections to this device (localhost). Do not widen the ACL.",
          failures: ["No sound later despite setup.", "Android 16: known upstream audio issue."],
          recovery:
            "Work through the audio troubleshooting page — it verifies each link in the chain. On Android 16 there is a known open upstream issue.",
          reversible: true,
          kbLink: "/docs/troubleshooting/audio",
        },
        {
          id: "pulse-client",
          title: "Point the Linux side at the audio server",
          purpose: "PULSE_SERVER tells Linux applications where to send sound.",
          environment: "Inside the Linux distro",
          commands: [
            dq(`echo 'export PULSE_SERVER=127.0.0.1' >> ~/.profile`),
            "export PULSE_SERVER=127.0.0.1",
          ],
          expected: "The variable is set for this and future sessions.",
          verify: "echo $PULSE_SERVER  # prints 127.0.0.1",
          reversible: true,
        },
      ],
    });
  }

  // --------------------------------------------------------- 9. Launcher + first start
  if (!cli && !vnc) {
    const launcher = buildLauncherScript({ distro: installName, username, display, sessionCmd, audio });
    sections.push({
      id: "launch",
      title: "Create the launcher and start your desktop",
      steps: [
        {
          id: "launcher-script",
          title: "Create a one-command launcher",
          purpose:
            "This script starts audio (if configured), the X11 display, and your desktop session as your user — so future launches are a single command.",
          environment: "Termux host",
          commands: [
            "cat > ~/start-desktop.sh << 'ADL_EOF'\n" + launcher + "\nADL_EOF",
            "chmod +x ~/start-desktop.sh",
          ],
          expected: "The file ~/start-desktop.sh exists and is executable.",
          verify: "ls -l ~/start-desktop.sh",
          reversible: true,
        },
        {
          id: "first-launch",
          title: "First launch",
          purpose: "Start everything and switch to the Termux:X11 app to see your desktop.",
          environment: "Termux host",
          commands: ["~/start-desktop.sh"],
          actions: ["When the command is running, open the Termux:X11 app from your launcher."],
          expected: `The ${cap(desktop)} desktop appears in the Termux:X11 window after a few seconds.`,
          failures: [
            "Black screen with or without cursor.",
            "Colors look wrong (red/blue swapped).",
            "Session exits immediately.",
          ],
          recovery:
            "Each of these has a specific fix (documented flags like -legacy-drawing / -force-bgra, D-Bus checks). Open the display troubleshooting page and match your exact symptom.",
          reversible: true,
          kbLink: "/docs/troubleshooting/display",
          checkpoint: `You can see and interact with the ${cap(desktop)} desktop.`,
        },
      ],
    });
    if (wiredDisplay) {
      sections.push({
        id: "external-display",
        title: "Connect the external display",
        steps: [
          {
            id: "connect-monitor",
            title: "Connect monitor, keyboard, and mouse",
            purpose: "Move the desktop onto your monitor through the hub/adapter.",
            environment: "Android Settings",
            actions: [
              "Connect the USB-C hub (with its power supply, if it has PD) to the phone; connect HDMI/DisplayPort to the monitor.",
              samsung
                ? "On Samsung, choose how the external screen behaves (DeX or screen mirroring) from the notification that appears; open Termux:X11 full-screen on the external display."
                : "Android mirrors or extends to the display automatically; open Termux:X11 full-screen there.",
              "Pair Bluetooth keyboard/mouse in Settings > Connected devices, or plug them into the hub.",
            ],
            expected: "The Linux desktop is visible on the monitor with working input devices.",
            failures: ["Monitor shows no signal.", "Keyboard shortcuts trigger Android actions instead of Linux."],
            recovery:
              "No signal: verify the hub is powered and the cable supports video (see the external displays guide). Shortcut conflicts: see the symptom index.",
            reversible: true,
            kbLink: "/docs/learn/hardware/external-displays",
          },
        ],
      });
    }
  }
  if (!cli && vnc) {
    sections.push({
      id: "launch",
      title: "Start the desktop over VNC",
      steps: [
        {
          id: "vnc-session",
          title: "Start the desktop in the VNC session",
          purpose: "Run the desktop session against the VNC display.",
          environment: "Inside the Linux distro",
          commands: [
            `export DISPLAY=${display}`,
            audio ? `export PULSE_SERVER=127.0.0.1` : `# (no audio forwarding configured)`,
            `dbus-launch --exit-with-session ${sessionCmd} &`,
          ],
          expected: "Your VNC viewer shows the desktop.",
          failures: ["Viewer shows a gray screen."],
          recovery: "The session did not start — check '~/.vnc/*.log' in Termux and the display troubleshooting page.",
          reversible: true,
          kbLink: "/docs/troubleshooting/display",
          checkpoint: "The desktop renders inside your VNC viewer.",
        },
      ],
    });
  }

  // --------------------------------------------------------- 10. Browser
  if (!cli) {
    const firefox: GuideStep =
      distro === "ubuntu"
        ? {
            id: "firefox",
            title: "Install Firefox from Mozilla's official repository",
            purpose:
              "Ubuntu's own firefox package is a Snap stub that cannot run under proot, so Firefox comes from Mozilla's official apt repository (which ships real ARM64 builds).",
            environment: "Inside the Linux distro",
            commands: [
              "sudo install -d -m 0755 /etc/apt/keyrings",
              dq(
                "wget -q https://packages.mozilla.org/apt/repo-signing-key.gpg -O- | sudo tee /etc/apt/keyrings/packages.mozilla.org.asc > /dev/null",
              ),
              dq(
                `echo "deb [signed-by=/etc/apt/keyrings/packages.mozilla.org.asc] https://packages.mozilla.org/apt mozilla main" | sudo tee /etc/apt/sources.list.d/mozilla.list > /dev/null`,
              ),
              "printf 'Package: *\\nPin: origin packages.mozilla.org\\nPin-Priority: 1000\\n' | sudo tee /etc/apt/preferences.d/mozilla > /dev/null",
              "sudo apt update && sudo apt install -y firefox",
            ],
            expected: "Firefox installs from packages.mozilla.org.",
            verify: "which firefox",
            failures: ["Firefox misrenders pages or crashes."],
            recovery:
              "Disable hardware acceleration: Settings > General > Performance — uncheck 'Use recommended performance settings', then uncheck 'Use hardware acceleration when available'. Restart Firefox. This is expected on this stack.",
            reversible: true,
            kbLink: "/docs/applications/browsers",
          }
        : {
            id: "firefox",
            title: "Install Firefox ESR",
            purpose: "Debian ships a real (non-Snap) Firefox ESR package that runs under proot.",
            environment: "Inside the Linux distro",
            commands: ["sudo apt install -y firefox-esr"],
            expected: "Firefox ESR installs.",
            verify: "which firefox-esr",
            failures: ["Firefox misrenders pages or crashes."],
            recovery:
              "Disable hardware acceleration: Settings > General > Performance — uncheck 'Use recommended performance settings', then uncheck 'Use hardware acceleration when available'. Restart Firefox. This is expected on this stack.",
            reversible: true,
            kbLink: "/docs/applications/browsers",
          };
    sections.push({
      id: "browser",
      title: "Install a browser",
      steps: [
        firefox,
        {
          id: "browser-note",
          title: "Why not Chromium?",
          purpose:
            "Chromium refuses to run as root without --no-sandbox (which removes its main security boundary) and its sandbox/GPU process commonly fails under proot. As a non-root user it may work on some setups, but Firefox is the dependable default here.",
          environment: "Optional advanced step",
          actions: ["Nothing to do — this explains the recommendation. Details and options are on the browser page."],
          expected: "—",
          reversible: true,
          optional: true,
          kbLink: "/docs/applications/browsers",
        },
      ],
    });
  }

  // --------------------------------------------------------- 11. Validate
  const checklist: string[] = [
    `proot-distro list shows ${installName}`,
    `whoami inside the distro prints ${username}`,
  ];
  if (!cli) checklist.push(`The ${cap(desktop)} desktop opens via ~/start-desktop.sh`, "A browser opens and loads a page");
  if (audio) checklist.push("A YouTube video or audio file plays with sound");
  if (wiredDisplay) checklist.push("The desktop displays on the external monitor");
  sections.push({
    id: "validate",
    title: "Validate your setup",
    steps: [
      {
        id: "checklist",
        title: "Run through the validation checklist",
        purpose: "Confirms every part of your configuration works before you rely on it.",
        environment: "Termux host",
        actions: checklist,
        expected: "Every item checks out.",
        failures: ["Any unchecked item."],
        recovery:
          "The symptom-first troubleshooting index maps each failure to its fix. The adl-doctor.sh script (Downloads page) also diagnoses the whole chain automatically.",
        reversible: true,
        kbLink: "/docs/troubleshooting/symptom-index",
        checkpoint: "All checklist items pass — your Linux desktop setup is complete.",
      },
    ],
  });

  // --------------------------------------------------------- 12. Backup & removal
  sections.push({
    id: "backup-removal",
    title: "Backups, recovery, and removal",
    steps: [
      {
        id: "backup-distro",
        title: "Back up your Linux system (recommended)",
        purpose: "One command snapshots the whole Linux environment; restoring it takes minutes instead of reinstalling.",
        environment: "Termux host",
        commands: [dq(`proot-distro backup ${installName} --output ~/adl-backup-${installName}.tar.gz`)],
        expected: "A backup archive is created in the Termux home directory.",
        verify: `ls -lh ~/adl-backup-${installName}.tar.gz`,
        reversible: true,
        optional: true,
      },
      {
        id: "how-to-remove",
        title: "How to remove everything later",
        purpose:
          "Removal is as clean as installation: delete the Linux system, then the apps. Nothing outside Termux is touched.",
        environment: "Termux host",
        commands: [
          `# Only when you want to remove it:`,
          dq(`proot-distro remove ${installName}`),
          `# Then uninstall Termux:X11 and Termux from Android Settings > Apps.`,
        ],
        expected: "—",
        security: "Remember to also revoke any sideloading permissions you granted and confirm Auto Blocker / battery settings are back to your preference.",
        reversible: true,
        optional: true,
        kbLink: "/docs/installation/common/uninstall",
      },
    ],
  });

  return {
    version: GUIDE_PLAN_VERSION,
    distro,
    desktop,
    username,
    display,
    audio,
    sections,
  };
}

function cap(s: string): string {
  const names: Record<string, string> = {
    debian: "Debian",
    ubuntu: "Ubuntu",
    alpine: "Alpine",
    archlinux: "Arch Linux",
    xfce: "Xfce",
    mate: "MATE",
    lxqt: "LXQt",
    plasma: "KDE Plasma",
    gnome: "GNOME",
    "cli-only": "command-line",
  };
  return names[s] ?? s;
}

export function buildLauncherScript(opts: {
  distro: string;
  username: string;
  display: string;
  sessionCmd: string;
  audio: boolean;
}): string {
  const { distro, username, display, sessionCmd, audio } = opts;
  const lines = [
    "#!/data/data/com.termux/files/usr/bin/bash",
    "# ADL desktop launcher (generated by the Get Started wizard)",
    "set -eu",
  ];
  if (audio) {
    lines.push(
      'pulseaudio --start --load="module-native-protocol-tcp auth-ip-acl=127.0.0.1 auth-anonymous=1" --exit-idle-time=-1 || true',
    );
  }
  lines.push(
    `termux-x11 ${display} >/dev/null 2>&1 &`,
    "sleep 3",
    `proot-distro login ${distro} --user ${username} --shared-tmp -- env DISPLAY=${display}${audio ? " PULSE_SERVER=127.0.0.1" : ""} dbus-launch --exit-with-session ${sessionCmd}`,
  );
  return lines.join("\n");
}
