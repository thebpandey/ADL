/**
 * Guided installer — compatibility policy constants.
 *
 * These are ADL planning heuristics, not guarantees. They are deliberately
 * conservative and documented in /docs/get-started/methodology. RULES_VERSION
 * in types.ts must be bumped when bands or rankings change materially.
 */
import type { DesktopId, DistroId, Objective } from "./types";

/** RAM bands (GB, total device RAM). See methodology page. */
export const RAM = {
  /** Below this: CLI-first recommendation. */
  CLI_ONLY_BELOW: 3,
  /** 3–4 GB: lightweight desktop only, with explicit warnings. */
  LIGHTWEIGHT_MAX: 4,
  /** ~6 GB: XFCE or MATE generally preferred. */
  COMFORTABLE_MIN: 6,
  /** ≥8 GB + capable SoC: XFCE/MATE or optionally Plasma. */
  PLASMA_MIN: 8,
} as const;

/** Free-storage bands (GB). */
export const STORAGE = {
  /** Below this: do not recommend a normal full desktop installation. */
  NO_DESKTOP_BELOW: 6,
  /** 6–10 GB free: lightweight installation only. */
  LIGHTWEIGHT_MAX: 10,
  /** ≥12 GB free: preferred baseline for a desktop + browser + updates. */
  PREFERRED_MIN: 12,
} as const;

/**
 * Storage estimate components (GB). Conservative round numbers; the guide
 * tells users to expect variation. Sum = base Termux + distro rootfs +
 * desktop + browser + package cache + workload + safety reserve.
 */
export const STORAGE_COMPONENTS = {
  termuxBase: 0.5,
  distroRootfs: { debian: 1.5, ubuntu: 2, alpine: 0.3, archlinux: 2 } as Record<DistroId, number>,
  desktop: { xfce: 1.5, mate: 2, lxqt: 1.2, plasma: 3.5, gnome: 4, "cli-only": 0 } as Record<
    DesktopId,
    number
  >,
  browser: 1,
  packageCache: 1.5,
  safetyReserve: 2,
} as const;

/** Extra storage by workload (GB). */
export const WORKLOAD_STORAGE: Partial<Record<Objective, number>> = {
  "software-development": 5,
  "cli-development": 3,
  "data-analysis": 4,
  "image-editing": 3,
  media: 3,
  "security-lab": 4,
  "desktop-replacement": 5,
};

/** Objectives that do not need a graphical desktop. */
export const CLI_OBJECTIVES: Objective[] = [
  "headless-server",
  "local-web-server",
  "remote-administration",
  "cli-development",
];

/** Desktop metadata used for ranking and explanation. */
export const DESKTOPS: Record<
  DesktopId,
  { label: string; minRamGb: number; sizeCategory: "none" | "small" | "medium" | "large"; note: string }
> = {
  "cli-only": {
    label: "Command line only",
    minRamGb: 0,
    sizeCategory: "none",
    note: "No graphical desktop; smallest footprint, best for servers and shells.",
  },
  lxqt: {
    label: "LXQt",
    minRamGb: 2,
    sizeCategory: "small",
    note: "Very light Qt desktop for low-memory devices.",
  },
  xfce: {
    label: "Xfce",
    minRamGb: 3,
    sizeCategory: "medium",
    note: "Lightweight, traditional, and the most widely used desktop with Termux:X11.",
  },
  mate: {
    label: "MATE",
    minRamGb: 3,
    sizeCategory: "medium",
    note: "Traditional full desktop with moderate resource use.",
  },
  plasma: {
    label: "KDE Plasma",
    minRamGb: 8,
    sizeCategory: "large",
    note: "Full-featured desktop; larger install and higher resource use.",
  },
  gnome: {
    label: "GNOME",
    minRamGb: 8,
    sizeCategory: "large",
    note: "Experimental under proot: GNOME expects systemd/logind session services that proot does not provide.",
  },
};

/** Distro metadata used for ranking and explanation. */
export const DISTROS: Record<
  DistroId,
  { label: string; stability: "stable" | "rolling"; note: string }
> = {
  debian: {
    label: "Debian",
    stability: "stable",
    note: "Stable, broad ARM64 package availability, long-lived instructions.",
  },
  ubuntu: {
    label: "Ubuntu",
    stability: "stable",
    note: "Familiar documentation and beginner-friendly; slightly larger than Debian. Browser installs need Mozilla's apt repository because Ubuntu's firefox package is a Snap stub that cannot run under proot.",
  },
  alpine: {
    label: "Alpine",
    stability: "stable",
    note: "Tiny, musl-based; ideal for CLI and services, weaker desktop-app coverage (glibc software may not run).",
  },
  archlinux: {
    label: "Arch Linux",
    stability: "rolling",
    note: "Newest packages, rolling release; requires comfort with maintenance and occasional breakage.",
  },
};

/** Username sanitization: POSIX-ish conservative allowlist. */
export const USERNAME_PATTERN = /^[a-z][a-z0-9_-]{0,31}$/;

export function sanitizeUsername(input: string): string | null {
  const candidate = input.trim().toLowerCase();
  if (!USERNAME_PATTERN.test(candidate)) return null;
  // Reserved names that would collide with system accounts.
  const reserved = new Set(["root", "admin", "daemon", "bin", "sys", "sync", "shutdown", "halt", "mail", "nobody"]);
  if (reserved.has(candidate)) return null;
  return candidate;
}

export const DEFAULT_USERNAME = "androidlinux";

/** Minimum Android versions (verified against official sources; see data/sources.json). */
export const ANDROID = {
  /** Termux app minimum (F-Droid build). */
  TERMUX_MIN: 7,
  /** Termux:X11 minimum per its repository README ("requires Android 8 or later"). */
  TERMUX_X11_MIN: 8,
  /** Android 12+ phantom process killer applies. */
  PHANTOM_PROCESS_FROM: 12,
} as const;
