/**
 * Guided installer — recommendation engine.
 *
 * evaluate(answers, catalog, issues) is a pure function. Every rule that
 * changes a recommendation adds a human-readable reason; scores exist only
 * to order candidates and are never shown as opaque percentages.
 */
import {
  ANDROID,
  CLI_OBJECTIVES,
  DESKTOPS,
  DISTROS,
  RAM,
  STORAGE,
  STORAGE_COMPONENTS,
  WORKLOAD_STORAGE,
} from "./rules";
import type {
  AlternativeConfiguration,
  AssessmentResult,
  CompatibilityStatus,
  DesktopId,
  DeviceRecord,
  DimensionResult,
  DistroId,
  EvidenceLevel,
  IssueRecord,
  RecommendationOption,
  SourceRef,
  Warning,
  WizardAnswers,
} from "./types";
import { RULES_VERSION } from "./types";

// ---------------------------------------------------------------------------
// Device lookup
// ---------------------------------------------------------------------------

const norm = (s: string) => s.trim().toLowerCase().replace(/[\s_-]+/g, "");

export function findDevice(
  answers: WizardAnswers,
  catalog: DeviceRecord[],
): { record: DeviceRecord; matchType: "model-number" | "marketing-name" } | null {
  const model = answers.modelNumber ? norm(answers.modelNumber) : "";
  if (model) {
    for (const record of catalog) {
      if (record.modelNumbers.some((m) => norm(m) === model || model.startsWith(norm(m)))) {
        return { record, matchType: "model-number" };
      }
    }
  }
  const name = answers.marketingName ? norm(answers.marketingName) : "";
  const maker = answers.manufacturer ? norm(answers.manufacturer) : "";
  if (name) {
    for (const record of catalog) {
      if (
        norm(record.marketingName) === name &&
        (!maker || norm(record.manufacturer) === maker)
      ) {
        return { record, matchType: "marketing-name" };
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Effective value: explicit answer wins, then catalog record, then unknown. */
function effective<T>(answer: T | null | undefined, fromCatalog: T | undefined): T | undefined {
  if (answer !== undefined && answer !== null && answer !== ("unknown" as unknown as T)) return answer;
  return fromCatalog;
}

const statusRank: Record<CompatibilityStatus, number> = {
  blocked: 0,
  "unlikely-graphical": 1,
  "cli-recommended": 2,
  unknown: 3,
  experimental: 4,
  "compatible-with-limitations": 5,
  "likely-compatible": 6,
};

function worst(statuses: CompatibilityStatus[]): CompatibilityStatus {
  return statuses.reduce((a, b) => (statusRank[b] < statusRank[a] ? b : a), "likely-compatible");
}

// ---------------------------------------------------------------------------
// Issue matching
// ---------------------------------------------------------------------------

export function matchIssues(
  answers: WizardAnswers,
  distro: DistroId,
  desktop: DesktopId,
  device: DeviceRecord | null,
  issues: IssueRecord[],
): IssueRecord[] {
  const maker = (answers.manufacturer ?? device?.manufacturer ?? "").toLowerCase();
  const android = answers.androidVersion ?? undefined;
  return issues.filter((issue) => {
    if (issue.affectedManufacturers?.length) {
      if (!maker || !issue.affectedManufacturers.some((m) => maker.includes(m.toLowerCase()))) {
        return false;
      }
    }
    if (issue.affectedDistros?.length && !issue.affectedDistros.includes(distro)) return false;
    if (issue.affectedDesktops?.length && !issue.affectedDesktops.includes(desktop)) return false;
    if (issue.affectedAndroidVersions && android !== undefined) {
      // Format: ">=12", "<=11", "13" or "12-14"
      const spec = issue.affectedAndroidVersions;
      const range = spec.match(/^(\d+)-(\d+)$/);
      if (spec.startsWith(">=")) {
        if (!(android >= Number(spec.slice(2)))) return false;
      } else if (spec.startsWith("<=")) {
        if (!(android <= Number(spec.slice(2)))) return false;
      } else if (range) {
        if (!(android >= Number(range[1]) && android <= Number(range[2]))) return false;
      } else if (/^\d+$/.test(spec)) {
        if (android !== Number(spec)) return false;
      }
    }
    if (device?.knownIssueIds?.includes(issue.id)) return true;
    return true;
  });
}

// ---------------------------------------------------------------------------
// Distro / desktop selection
// ---------------------------------------------------------------------------

interface Pick {
  id: DistroId | DesktopId;
  reasons: string[];
  warnings: string[];
  status: RecommendationOption["status"];
}

function pickDistro(answers: WizardAnswers, cliOnly: boolean): Pick {
  const objective = answers.primaryObjective ?? "general-desktop";
  const experience = answers.experience ?? "new";
  const storage = answers.freeStorageGb ?? null;

  // Manual selection is honored, with warnings preserved.
  if ((answers.recommendMode === "manual-both" || answers.recommendMode === "auto-desktop-choose-distro") && answers.manualDistro) {
    const id = answers.manualDistro;
    const warnings: string[] = [];
    if (id === "archlinux" && (experience === "new" || experience === "can-follow-terminal")) {
      warnings.push(
        "Arch Linux is a rolling release. It expects comfort with reading release notes and fixing occasional breakage; Debian or Ubuntu is an easier start.",
      );
    }
    if (id === "alpine" && !cliOnly) {
      warnings.push(
        "Alpine uses musl instead of glibc, so some desktop applications (including most browsers' official builds) are unavailable or behave differently.",
      );
    }
    return {
      id,
      reasons: [`You selected ${DISTROS[id].label} manually.`],
      warnings,
      status: warnings.length ? "supported" : "recommended",
    };
  }

  // Alpine for tight-storage CLI use.
  if (cliOnly && storage !== null && storage < STORAGE.NO_DESKTOP_BELOW) {
    return {
      id: "alpine",
      reasons: [
        "Your goal does not need a graphical desktop and free storage is very limited; Alpine has the smallest footprint of the supported distributions.",
      ],
      warnings: [
        "Alpine uses musl instead of glibc; some prebuilt Linux software will not run. Debian is the fallback if you hit missing packages.",
      ],
      status: "recommended",
    };
  }

  // Ubuntu for beginners / familiarity-driven objectives.
  if (experience === "new" || objective === "learn-linux") {
    return {
      id: "ubuntu",
      reasons: [
        "Ubuntu has the largest volume of beginner documentation and most third-party instructions assume it.",
        "You indicated you are new to Linux, so instruction availability outweighs Ubuntu's slightly larger footprint.",
      ],
      warnings: [
        "Ubuntu's own firefox/chromium packages are Snap stubs that cannot run under proot; the guide installs Firefox from Mozilla's official apt repository instead.",
      ],
      status: "recommended",
    };
  }

  // Advanced users wanting newest packages.
  if ((experience === "advanced" || experience === "experimental-ok") && !answers.stableOnly && objective === "software-development") {
    return {
      id: "debian",
      reasons: [
        "Debian offers stable, broad ARM64 package coverage for development. Arch is listed as an alternative if you need newer toolchains and accept rolling-release maintenance.",
      ],
      warnings: [],
      status: "recommended",
    };
  }

  return {
    id: "debian",
    reasons: [
      "Debian is the conservative default: stable releases, broad ARM64 package availability, and instructions that stay valid for years.",
      "Its firefox-esr package is a real (non-Snap) build that works under proot without extra repositories.",
    ],
    warnings: [],
    status: "recommended",
  };
}

function pickDesktop(
  answers: WizardAnswers,
  cliOnly: boolean,
  ram: number | null,
): Pick {
  const experience = answers.experience ?? "new";

  if (cliOnly) {
    return {
      id: "cli-only",
      reasons: [
        "Your primary goal runs in a terminal; skipping the desktop saves several gigabytes of storage and hundreds of megabytes of RAM.",
      ],
      warnings: [],
      status: "recommended",
    };
  }

  if ((answers.recommendMode === "manual-both" || answers.recommendMode === "auto-distro-choose-desktop") && answers.manualDesktop) {
    const id = answers.manualDesktop;
    const meta = DESKTOPS[id];
    const warnings: string[] = [];
    let status: RecommendationOption["status"] = "supported";
    if (id === "gnome") {
      warnings.push(
        "GNOME under proot is experimental: it expects systemd/logind session services that proot does not provide. Expect missing functionality; Xfce is the reliable fallback.",
      );
      status = "experimental";
    }
    if (ram !== null && ram < meta.minRamGb) {
      warnings.push(
        `${meta.label} generally wants at least ${meta.minRamGb} GB of RAM; your device reports ${ram} GB. Expect slow performance.`,
      );
    }
    if (id === "plasma") {
      warnings.push(
        "KDE Plasma is a large install with higher resource use; make sure you have the storage headroom shown in the estimate.",
      );
    }
    return { id, reasons: [`You selected ${meta.label} manually.`], warnings, status };
  }

  if (ram !== null && ram < RAM.CLI_ONLY_BELOW) {
    return {
      id: "cli-only",
      reasons: [
        `With under ${RAM.CLI_ONLY_BELOW} GB of RAM, a graphical desktop competes with Android itself for memory; the command line is the usable path.`,
      ],
      warnings: [
        "If you still want graphics, LXQt is the least demanding option, but expect Android to kill the session under memory pressure.",
      ],
      status: "recommended",
    };
  }

  if (ram !== null && ram <= RAM.LIGHTWEIGHT_MAX) {
    return {
      id: "lxqt",
      reasons: [
        `With ${ram} GB of RAM (shared with Android), the lightest desktop gives the most headroom. LXQt was preferred over Xfce because every hundred megabytes matters at this level.`,
      ],
      warnings: [
        "Expect visible slowdowns with a browser plus another application open. Android may terminate the session under memory pressure.",
      ],
      status: "recommended",
    };
  }

  if (
    ram !== null &&
    ram >= RAM.PLASMA_MIN &&
    (experience === "advanced" || experience === "experimental-ok") &&
    !answers.stableOnly &&
    (answers.primaryObjective === "desktop-replacement" || answers.primaryObjective === "portable-workstation")
  ) {
    return {
      id: "plasma",
      reasons: [
        `With ${ram} GB of RAM, a desktop-replacement goal, and Linux experience, KDE Plasma's full feature set is workable.`,
      ],
      warnings: [
        "Plasma is a multi-gigabyte install with more moving parts than Xfce; keep Xfce in mind as the fallback if the session misbehaves under proot.",
      ],
      status: "supported",
    };
  }

  const ramNote =
    ram === null
      ? "RAM is unknown, so the safest broadly compatible desktop was chosen"
      : `this device has ${ram} GB of RAM`;
  return {
    id: "xfce",
    reasons: [
      `Xfce was preferred because ${ramNote}, and Xfce is lightweight, traditional, and the most widely documented desktop with Termux:X11.`,
    ],
    warnings: [],
    status: "recommended",
  };
}

// ---------------------------------------------------------------------------
// Storage estimate
// ---------------------------------------------------------------------------

export function estimateStorageGb(
  distro: DistroId,
  desktop: DesktopId,
  answers: WizardAnswers,
): number {
  let total =
    STORAGE_COMPONENTS.termuxBase +
    STORAGE_COMPONENTS.distroRootfs[distro] +
    STORAGE_COMPONENTS.desktop[desktop] +
    (desktop === "cli-only" ? 0 : STORAGE_COMPONENTS.browser) +
    STORAGE_COMPONENTS.packageCache +
    STORAGE_COMPONENTS.safetyReserve;
  const objectives = [answers.primaryObjective, ...(answers.secondaryObjectives ?? [])];
  let workloadExtra = 0;
  for (const o of objectives) {
    if (o && WORKLOAD_STORAGE[o]) workloadExtra = Math.max(workloadExtra, WORKLOAD_STORAGE[o]!);
  }
  total += workloadExtra;
  return Math.round(total * 2) / 2;
}

// ---------------------------------------------------------------------------
// Main evaluation
// ---------------------------------------------------------------------------

export function evaluate(
  answers: WizardAnswers,
  catalog: DeviceRecord[],
  issues: IssueRecord[],
): AssessmentResult {
  const match = findDevice(answers, catalog);
  const device = match?.record ?? null;

  const requiredWarnings: Warning[] = [];
  const optionalWarnings: Warning[] = [];
  const notRecommendedNotes: string[] = [];
  const evidence: SourceRef[] = device ? [...device.sources] : [];

  // Baseline confidence from device evidence.
  const baseConfidence: EvidenceLevel = device
    ? match!.matchType === "model-number"
      ? device.evidenceLevel
      : device.evidenceLevel === "unknown"
        ? "unknown"
        : "inferred-from-specs"
    : answers.ramGb != null || answers.cpuArchitecture
      ? "inferred-from-specs"
      : "unknown";

  // Effective hardware facts.
  const arch = effective(answers.cpuArchitecture, device?.cpuArchitecture) ?? "unknown";
  const ram =
    answers.ramGb ??
    (device && device.ramVariantsGb.length === 1 ? device.ramVariantsGb[0] : null);
  const free = answers.freeStorageGb ?? null;
  const android = answers.androidVersion ?? null;
  const dpAltMode: boolean | "unknown" =
    answers.displayPortAltMode === "yes"
      ? true
      : answers.displayPortAltMode === "no"
        ? false
        : device?.displayPortAltMode ?? "unknown";

  const cliOnly =
    CLI_OBJECTIVES.includes(answers.primaryObjective ?? "general-desktop") ||
    answers.manualDesktop === "cli-only";

  // --- Hard blockers -------------------------------------------------------
  const blockers: string[] = [];
  if (answers.ownership === "employer" || answers.ownership === "school" || answers.ownership === "restricted") {
    blockers.push(
      "Managed devices commonly block sideloading and developer settings. If your organization's policy prevents installing apps from outside an app store, this path is blocked — check with the device administrator first.",
    );
  }
  if (android !== null && android < ANDROID.TERMUX_MIN) {
    blockers.push(
      `Android ${android} is below Termux's minimum supported version (Android ${ANDROID.TERMUX_MIN}); the required apps cannot be installed.`,
    );
  }
  if (arch === "x86_64") {
    optionalWarnings.push({
      id: "arch-x86",
      severity: "warning",
      text: "x86_64 Android devices are rare and less tested with this stack; instructions assume ARM64.",
    });
  }

  const graphicalBlocked =
    android !== null && android < ANDROID.TERMUX_X11_MIN && !cliOnly;

  // --- Selection -----------------------------------------------------------
  const distroPick = pickDistro(answers, cliOnly);
  let desktopPick = pickDesktop(answers, cliOnly, ram);

  // 32-bit constraint: modern desktops and browsers are poorly served.
  if (arch === "arm32" && desktopPick.id !== "cli-only") {
    desktopPick = {
      id: "cli-only",
      reasons: [
        "This device's 32-bit ARM processor has shrinking package support; modern browsers and desktops are unreliable there. Command-line use is the honest recommendation.",
      ],
      warnings: ["If you experiment with a desktop anyway, treat it as unsupported."],
      status: "recommended",
    };
    notRecommendedNotes.push(
      "A graphical desktop was not recommended because 32-bit ARM package availability for desktops and browsers is now poor.",
    );
  }

  if (graphicalBlocked && desktopPick.id !== "cli-only") {
    desktopPick = {
      id: "cli-only",
      reasons: [
        `Termux:X11 requires Android ${ANDROID.TERMUX_X11_MIN} or newer and this device runs Android ${android}. A VNC-based desktop is possible but slower; start with the command line or the VNC path.`,
      ],
      warnings: ["The VNC display path remains available; see the display methods guide."],
      status: "recommended",
    };
  }

  // Storage feasibility against selection.
  const desktopId = desktopPick.id as DesktopId;
  const distroId = distroPick.id as DistroId;
  const estimatedStorageGb = estimateStorageGb(distroId, desktopId, answers);
  if (free !== null && free < estimatedStorageGb && desktopId !== "cli-only") {
    if (free < STORAGE.NO_DESKTOP_BELOW) {
      blockers.push(
        `About ${estimatedStorageGb} GB of free storage is needed for the selected setup, but only ${free} GB is free. Free up space or choose the command-line path (Alpine needs under 2 GB).`,
      );
    } else {
      requiredWarnings.push({
        id: "storage-tight",
        severity: "critical",
        text: `The selected setup needs about ${estimatedStorageGb} GB but only ${free} GB is free. Installation may fail partway; free up space first.`,
      });
    }
  }

  // --- Dimensions -----------------------------------------------------------
  const dims: DimensionResult[] = [];
  const dim = (
    id: string,
    label: string,
    status: CompatibilityStatus,
    confidence: EvidenceLevel,
    reason: string,
  ) => dims.push({ id, label, status, confidence, reason });

  // 1. Linux user-space compatibility
  dim(
    "userspace",
    "Linux user-space (Termux + proot)",
    android !== null && android < ANDROID.TERMUX_MIN ? "blocked" : android === null ? "unknown" : "likely-compatible",
    android === null ? "unknown" : "official-doc",
    android === null
      ? "Android version was not provided; Termux requires Android " + ANDROID.TERMUX_MIN + "+."
      : android < ANDROID.TERMUX_MIN
        ? `Android ${android} is below Termux's minimum (Android ${ANDROID.TERMUX_MIN}).`
        : `Android ${android} meets Termux's minimum (Android ${ANDROID.TERMUX_MIN}+); proot runs in user space with no root required.`,
  );

  // 2. Architecture & packages
  dim(
    "architecture",
    "CPU architecture & package availability",
    arch === "arm64" ? "likely-compatible" : arch === "arm32" ? "compatible-with-limitations" : arch === "unknown" ? "unknown" : "compatible-with-limitations",
    arch === "unknown" ? "unknown" : baseConfidence,
    arch === "arm64"
      ? "ARM64 is the primary architecture for Termux, proot-distro images, and distro packages."
      : arch === "arm32"
        ? "32-bit ARM works for core tools but modern desktop and browser packages are increasingly unavailable."
        : arch === "unknown"
          ? "Architecture unknown — run the device report script or check the spec sheet."
          : "Non-ARM Android devices are unusual; expect rough edges.",
  );

  // 3. Graphical desktop feasibility
  dim(
    "graphical",
    "Graphical desktop feasibility",
    graphicalBlocked
      ? "unlikely-graphical"
      : cliOnly || desktopId === "cli-only"
        ? "cli-recommended"
        : ram !== null && ram <= RAM.LIGHTWEIGHT_MAX
          ? "compatible-with-limitations"
          : ram === null
            ? "unknown"
            : "likely-compatible",
    android === null || ram === null ? "unknown" : baseConfidence,
    graphicalBlocked
      ? `Termux:X11 requires Android ${ANDROID.TERMUX_X11_MIN}+; this device runs Android ${android}. VNC remains possible.`
      : cliOnly
        ? "Your goal does not require a desktop, so the command-line path is recommended."
        : ram === null
          ? "RAM unknown — desktop feasibility cannot be confirmed."
          : ram <= RAM.LIGHTWEIGHT_MAX
            ? `With ${ram} GB RAM shared with Android, only a lightweight desktop is realistic.`
            : `${ram} GB RAM and Android ${android ?? "?"} support a desktop session via Termux:X11.`,
  );

  // 4. Memory
  dim(
    "memory",
    "Available memory",
    ram === null ? "unknown" : ram < RAM.CLI_ONLY_BELOW ? "cli-recommended" : ram <= RAM.LIGHTWEIGHT_MAX ? "compatible-with-limitations" : "likely-compatible",
    ram === null ? "unknown" : baseConfidence,
    ram === null
      ? "RAM not provided."
      : ram < RAM.CLI_ONLY_BELOW
        ? `${ram} GB is below the ${RAM.CLI_ONLY_BELOW} GB planning floor for graphical use.`
        : ram <= RAM.LIGHTWEIGHT_MAX
          ? `${ram} GB supports a lightweight desktop with warnings.`
          : `${ram} GB comfortably supports the recommended desktop.`,
  );

  // 5. Storage
  dim(
    "storage",
    "Available storage",
    free === null ? "unknown" : free < STORAGE.NO_DESKTOP_BELOW && desktopId !== "cli-only" ? "blocked" : free < estimatedStorageGb ? "compatible-with-limitations" : "likely-compatible",
    free === null ? "unknown" : "adl-verified",
    free === null
      ? `Free storage not provided; the selected setup needs about ${estimatedStorageGb} GB.`
      : `About ${estimatedStorageGb} GB is needed; ${free} GB is free.`,
  );

  // 6. Android version & background behavior
  dim(
    "android-version",
    "Android version & background-process behavior",
    android === null ? "unknown" : android >= ANDROID.PHANTOM_PROCESS_FROM ? "compatible-with-limitations" : "likely-compatible",
    android === null ? "unknown" : "official-doc",
    android === null
      ? "Android version not provided."
      : android >= ANDROID.PHANTOM_PROCESS_FROM
        ? `Android ${android} enforces phantom-process limits that can kill background sessions (seen as “signal 9”); the guide includes mitigations.`
        : `Android ${android} predates the phantom-process killer introduced in Android ${ANDROID.PHANTOM_PROCESS_FROM}.`,
  );

  // 7. Manufacturer restrictions
  const samsung = (answers.manufacturer ?? device?.manufacturer ?? "").toLowerCase().includes("samsung");
  dim(
    "manufacturer",
    "Manufacturer restrictions",
    samsung ? "compatible-with-limitations" : "likely-compatible",
    samsung ? "adl-verified" : baseConfidence,
    samsung
      ? "Samsung's Auto Blocker and battery management need one-time adjustments during installation (documented, reversible)."
      : "No manufacturer-specific blockers are known for this brand; aggressive battery optimization may still need per-app exemptions.",
  );

  // 8. Termux & display server install feasibility
  dim(
    "install-feasibility",
    "Termux & display-server installation",
    blockers.some((b) => b.includes("Managed devices")) ? "blocked" : "likely-compatible",
    "official-doc",
    blockers.some((b) => b.includes("Managed devices"))
      ? "Sideloading appears blocked by device management policy."
      : "Termux installs from F-Droid and Termux:X11 from its official GitHub releases; both are sideloaded (no root).",
  );

  // 9. Wired external display
  dim(
    "wired-display",
    "External wired display",
    dpAltMode === true ? "likely-compatible" : dpAltMode === false ? "compatible-with-limitations" : "unknown",
    dpAltMode === "unknown" ? "unknown" : device ? device.evidenceLevel : "inferred-from-specs",
    dpAltMode === true
      ? "This device supports USB-C DisplayPort Alt Mode, so a wired monitor works via a USB-C hub or cable."
      : dpAltMode === false
        ? "This device does not output video over USB-C. Linux still runs — use the phone screen, wireless display, or VNC from another computer."
        : "Wired video output cannot be confirmed — USB-C alone does not guarantee DisplayPort Alt Mode. Check the manufacturer's specs.",
  );

  // 10. Wireless display
  const wirelessWanted = answers.displayTargets?.includes("wireless-display") ?? false;
  dim(
    "wireless-display",
    "Wireless display",
    wirelessWanted ? (answers.monitorMiracast === "yes" ? "compatible-with-limitations" : "unknown") : "likely-compatible",
    "inferred-from-specs",
    wirelessWanted
      ? "Wireless display mirrors the Android screen; expect latency. Miracast/Cast support depends on both the phone and the display."
      : "Not requested; available as a fallback if wired output is unavailable.",
  );

  // 11. Keyboard & mouse
  const kb = answers.keyboard ?? "unsure";
  const noKb = kb === "none";
  dim(
    "input",
    "Keyboard & mouse connectivity",
    noKb ? "compatible-with-limitations" : "likely-compatible",
    "official-doc",
    noKb
      ? "No physical keyboard: Termux:X11 provides an on-screen input mode, but a Bluetooth keyboard dramatically improves desktop usability."
      : "Bluetooth and USB keyboards/mice work through Android and are passed to the Linux session.",
  );

  // 12. Audio
  const audioWanted = !(answers.audioTargets ?? []).includes("not-required") && (answers.audioTargets ?? []).length > 0;
  dim(
    "audio",
    "Audio feasibility",
    audioWanted ? "compatible-with-limitations" : "likely-compatible",
    "reproduced-community",
    audioWanted
      ? "Audio needs explicit PulseAudio forwarding from Termux to the Linux environment (the guide sets this up); it does not work automatically after installing a desktop."
      : "Audio not required, so no PulseAudio forwarding is configured (it can be added later).",
  );

  // 13. Workload suitability
  const heavy = ["image-editing", "media", "data-analysis", "desktop-replacement"].includes(
    answers.primaryObjective ?? "",
  );
  dim(
    "workload",
    "Workload suitability",
    heavy && ram !== null && ram < RAM.COMFORTABLE_MIN ? "compatible-with-limitations" : "likely-compatible",
    "inferred-from-specs",
    heavy && ram !== null && ram < RAM.COMFORTABLE_MIN
      ? "Heavier creative/analysis workloads will feel constrained below 6 GB RAM; expect to work with smaller files."
      : "The stated workload fits the recommended configuration. There is no GPU acceleration by default — rendering is CPU-based.",
  );

  // 14. Thermals
  const sustained = answers.sustainedUseWhileCharging === "yes";
  dim(
    "thermal",
    "Thermal & sustained performance",
    sustained ? "compatible-with-limitations" : "likely-compatible",
    "field-report",
    sustained
      ? "Long sessions while charging cause heat and throttling on most phones; a stand with airflow (or a cooling accessory) helps."
      : "Short sessions rarely throttle. Sustained heavy use while charging is when heat becomes noticeable.",
  );

  // 15. Evidence quality
  dim(
    "evidence",
    "Evidence quality for this exact device",
    device ? (device.evidenceLevel === "adl-verified" ? "likely-compatible" : "compatible-with-limitations") : "unknown",
    device ? device.evidenceLevel : "unknown",
    device
      ? match!.matchType === "model-number"
        ? `Matched catalog record "${device.marketingName}" by model number (evidence: ${device.evidenceLevel}).`
        : `Matched "${device.marketingName}" by marketing name only — regional variants can differ in chipset and USB capability.`
      : "This device is not in the ADL catalog; results are based on the specifications you entered. That does not mean it is incompatible.",
  );

  // --- Warnings from selections --------------------------------------------
  for (const w of distroPick.warnings) optionalWarnings.push({ id: `distro-${distroPick.id}`, severity: "warning", text: w });
  for (const w of desktopPick.warnings) optionalWarnings.push({ id: `desktop-${desktopPick.id}`, severity: "warning", text: w });
  for (const b of blockers) requiredWarnings.push({ id: "blocker", severity: "critical", text: b });
  if (android !== null && android >= ANDROID.PHANTOM_PROCESS_FROM) {
    requiredWarnings.push({
      id: "phantom-process",
      severity: "warning",
      text: "Android 12+ can kill long-running Termux processes (“signal 9”). The guide covers battery-optimization exemptions; deeper ADB mitigations are optional and clearly separated.",
      kbLink: "/docs/troubleshooting/symptom-index",
    });
  }
  if (answers.rooted === "yes" || answers.customRom === "yes") {
    optionalWarnings.push({
      id: "rooted",
      severity: "info",
      text: "Rooted devices and custom ROMs follow a different risk profile; this guide covers the standard rootless path, which also works on rooted devices.",
    });
  }

  // --- Display method -------------------------------------------------------
  const wantsWired = (answers.displayTargets ?? []).some((t) => t === "wired-monitor" || t === "wired-tv");
  let displayMethod: RecommendationOption;
  if (graphicalBlocked || desktopId === "cli-only") {
    displayMethod = {
      id: "terminal",
      label: "Terminal (no graphical session)",
      reasons: ["No graphical session is part of the recommended configuration."],
      warnings: [],
      status: "recommended",
    };
  } else if (wantsWired && dpAltMode === true) {
    displayMethod = {
      id: "termux-x11-external",
      label: "Termux:X11 on a wired external display",
      reasons: [
        "The device supports USB-C DisplayPort Alt Mode, so the desktop can run full-screen on your monitor via a hub or USB-C cable.",
      ],
      warnings: samsung
        ? ["On Samsung, the desktop appears inside a DeX or mirrored screen session; the guide covers both."]
        : [],
      status: "recommended",
    };
  } else if (wantsWired && dpAltMode === false) {
    displayMethod = {
      id: "termux-x11-phone",
      label: "Termux:X11 on the phone screen (wired output unavailable)",
      reasons: [
        "This device cannot output video over USB-C, so the session runs on the phone screen; wireless display or VNC from another computer are the external options.",
      ],
      warnings: ["A wired monitor was requested but is not possible on this hardware."],
      status: "supported",
    };
  } else if ((answers.displayTargets ?? []).includes("remote-desktop")) {
    displayMethod = {
      id: "vnc",
      label: "VNC from another computer",
      reasons: ["You plan to use another computer's screen; VNC serves the desktop over the local network."],
      warnings: [
        "VNC adds overhead and must stay localhost-bound or password-protected; the guide configures it safely.",
      ],
      status: "supported",
    };
  } else {
    displayMethod = {
      id: "termux-x11-phone",
      label: "Termux:X11 on the phone screen",
      reasons: ["Termux:X11 renders the desktop directly on the device screen with the lowest overhead."],
      warnings: [],
      status: "recommended",
    };
  }

  // --- Audio method ----------------------------------------------------------
  let audioMethod: RecommendationOption | undefined;
  if (audioWanted) {
    const targets = answers.audioTargets ?? [];
    const hdmi = targets.includes("hdmi-monitor");
    audioMethod = {
      id: "pulseaudio-forward",
      label: "PulseAudio forwarding (Termux → Linux)",
      reasons: [
        "PulseAudio runs in Termux and plays through Android's audio stack, so sound follows whatever output Android uses (speakers, Bluetooth, wired).",
      ],
      warnings: hdmi
        ? ["HDMI/monitor audio depends on Android routing audio to the external display; it is not guaranteed on all devices."]
        : [],
      status: "recommended",
    };
  }

  // --- Browser ----------------------------------------------------------------
  let browser: RecommendationOption | undefined;
  if (desktopId !== "cli-only") {
    browser = {
      id: "firefox",
      label: distroId === "debian" ? "Firefox ESR (Debian package)" : "Firefox (Mozilla apt repository)",
      reasons: [
        "Firefox is the browser with the most reliable field results under proot once hardware acceleration is disabled.",
        distroId === "ubuntu"
          ? "Ubuntu's own firefox package is a Snap stub that cannot run under proot, so the guide adds Mozilla's official apt repository."
          : "Debian ships a real firefox-esr package that runs under proot without extra repositories.",
      ],
      warnings: [
        "If pages render black or the browser crashes, disable hardware acceleration in Firefox settings (the guide shows how).",
        "Chromium commonly fails under proot (sandbox and GPU-process issues) and is not the default recommendation.",
      ],
      status: "recommended",
    };
    notRecommendedNotes.push(
      "Chromium was not recommended: as root it refuses to start without --no-sandbox (unsafe), and under proot its sandbox and GPU process frequently fail. Firefox with hardware acceleration disabled is the dependable choice.",
    );
  }

  // --- Peripherals -------------------------------------------------------------
  const peripherals: RecommendationOption[] = [];
  if (wantsWired && dpAltMode === true) {
    const hasPd = answers.hubHasPowerDelivery === "yes";
    peripherals.push({
      id: "powered-hub",
      label: "USB-C hub with HDMI/DisplayPort + Power Delivery pass-through",
      reasons: [
        "A hub drives the monitor, keeps the phone charged, and adds USB ports for wired input devices.",
      ],
      warnings: hasPd
        ? []
        : [
            "Without Power Delivery pass-through, the battery drains during long desktop sessions — especially at 4K.",
          ],
      status: "recommended",
    });
  }
  if (noKb) {
    peripherals.push({
      id: "bluetooth-keyboard",
      label: "Bluetooth keyboard (recommended addition)",
      reasons: ["Desktop Linux is far more usable with a physical keyboard; Bluetooth avoids using the only USB port."],
      warnings: [],
      status: "recommended",
    });
  }
  if ((answers.peripherals ?? []).includes("ethernet-adapter")) {
    peripherals.push({
      id: "ethernet",
      label: "USB Ethernet adapter",
      reasons: ["Wired networking works when Android recognizes the adapter; it appears to Linux via Android's network stack."],
      warnings: [],
      status: "supported",
    });
  }

  // --- Issues -------------------------------------------------------------------
  const matched = matchIssues(answers, distroId, desktopId, device, issues);
  for (const issue of matched) {
    if (issue.severity === "blocker" || issue.severity === "high") {
      requiredWarnings.push({
        id: issue.id,
        severity: issue.severity === "blocker" ? "critical" : "warning",
        text: `${issue.title}: ${issue.symptoms[0] ?? ""}`.trim(),
        kbLink: issue.relatedPages?.[0],
      });
    }
  }

  // --- Alternatives ---------------------------------------------------------------
  const alternatives: AlternativeConfiguration[] = [];
  if (desktopId === "xfce") {
    alternatives.push({
      label: "MATE on Debian",
      distro: "debian",
      desktop: "mate",
      reason: "A slightly heavier but very traditional desktop if you prefer its layout.",
    });
    if (ram !== null && ram >= RAM.PLASMA_MIN) {
      alternatives.push({
        label: "KDE Plasma on Debian",
        distro: "debian",
        desktop: "plasma",
        reason: `With ${ram} GB RAM, Plasma is viable if you want a full-featured desktop and accept the larger install.`,
      });
    }
  }
  if (desktopId === "cli-only" && !cliOnly) {
    alternatives.push({
      label: "LXQt on Debian (experimental on this hardware)",
      distro: "debian",
      desktop: "lxqt",
      reason: "The lightest graphical option if you want to try a desktop despite the constraints above.",
    });
  }
  if (desktopId !== "cli-only") {
    alternatives.push({
      label: "Command line only on Alpine",
      distro: "alpine",
      desktop: "cli-only",
      reason: "The minimal path: under 2 GB of storage, ideal for servers and shell work.",
    });
  }

  // --- Overall -------------------------------------------------------------------
  const overallStatus = blockers.length
    ? "blocked"
    : worst(dims.filter((d) => d.id !== "evidence" && d.id !== "wired-display" && d.id !== "wireless-display").map((d) => d.status));

  const confidence: EvidenceLevel = device ? device.evidenceLevel : baseConfidence;

  return {
    rulesVersion: RULES_VERSION,
    overallStatus,
    confidence,
    dimensions: dims,
    recommendation: {
      distro: {
        id: distroPick.id,
        label: DISTROS[distroId].label,
        reasons: distroPick.reasons,
        warnings: distroPick.warnings,
        status: distroPick.status,
      },
      desktop: {
        id: desktopPick.id,
        label: DESKTOPS[desktopId].label,
        reasons: desktopPick.reasons,
        warnings: desktopPick.warnings,
        status: desktopPick.status,
      },
      displayMethod,
      audioMethod,
      browser,
      peripherals,
    },
    estimatedStorageGb,
    requiredWarnings,
    optionalWarnings,
    alternatives,
    matchedIssueIds: matched.map((i) => i.id),
    matchedDevice: match ? { id: device!.id, matchType: match.matchType } : null,
    evidence,
    notRecommendedNotes,
  };
}
