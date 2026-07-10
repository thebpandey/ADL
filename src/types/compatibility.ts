/**
 * ADL Compatibility Platform — TypeScript schemas for every JSON data file
 * under /data. These types are the contract between the data layer, the
 * Compatibility components, and the static AI-metadata interface.
 */

/** Part 11 — support levels rendered by TestStatusBadge. */
export type SupportLevel =
  | "fully-supported"
  | "supported"
  | "partial"
  | "experimental"
  | "broken"
  | "untested";

/** Part 9 — community verification model. */
export type VerificationLevel =
  | "maintainer-verified"
  | "community-verified"
  | "experimental"
  | "needs-testing"
  | "deprecated";

/** Part 10 — version tracking attached to any verified claim. */
export interface VersionInfo {
  androidVersion?: string;
  linuxVersion?: string;
  desktopVersion?: string;
  documentationVersion?: string;
  verificationDate?: string; // ISO date
}

/** data/devices.json */
export interface Device {
  id: string;
  name: string;
  manufacturer: string;
  chipset: string;
  ramGb: number[];
  storageGb: number[];
  androidVersions: string[];
  desktopMode: "samsung-dex" | "android-desktop-mode" | "none" | "unknown";
  usbcVideo: SupportLevel;
  releaseYear?: number;
  notes?: string;
  status: SupportLevel;
  verification: VerificationLevel;
  version?: VersionInfo;
  /** Slug of a verified-configuration page, when one exists. */
  verifiedConfiguration?: string;
}

/** data/hardware.json */
export type HardwareCategory =
  | "usb-c-dock"
  | "monitor"
  | "storage"
  | "input"
  | "accessory"
  | "power-delivery";

export interface HardwareItem {
  id: string;
  name: string;
  category: HardwareCategory;
  description: string;
  keySpecs: string[];
  worksWith?: string[]; // device ids
  status: SupportLevel;
  verification: VerificationLevel;
  notes?: string;
  version?: VersionInfo;
}

/** data/desktop-environments.json */
export interface DesktopEnvironment {
  id: string;
  name: string;
  performance: SupportLevel;
  memoryUsageMb: string;
  responsiveness: string;
  touchFriendliness: string;
  recommendedDevices: string;
  summary: string;
  advantages: string[];
  disadvantages: string[];
  installCommand: string;
  status: SupportLevel;
  verification: VerificationLevel;
}

/** data/linux-distributions.json */
export interface LinuxDistribution {
  id: string;
  name: string;
  installCommand: string;
  performance: string;
  memoryUsageMb: string;
  advantages: string[];
  disadvantages: string[];
  knownIssues: string[];
  summary: string;
  status: SupportLevel;
  verification: VerificationLevel;
}

/** data/android-versions.json */
export interface AndroidVersion {
  version: string;
  name?: string;
  notes: string;
  status: SupportLevel;
}

/** data/compatibility-matrix.json — Part 4 columns per device. */
export interface MatrixRow {
  deviceId: string;
  usbcVideo: SupportLevel;
  desktopMode: SupportLevel;
  bluetooth: SupportLevel;
  keyboard: SupportLevel;
  mouse: SupportLevel;
  storage: SupportLevel;
  linux: SupportLevel;
  xfce: SupportLevel;
  performance: "excellent" | "good" | "fair" | "poor" | "unknown";
  status: SupportLevel;
  verification: VerificationLevel;
}

/** data/test-results.json — one community/maintainer test report. */
export interface TestResult {
  id: string;
  deviceId: string;
  tester: string;
  verification: VerificationLevel;
  date: string;
  version: VersionInfo;
  hardwareIds?: string[];
  linuxDistribution?: string;
  desktopEnvironment?: string;
  result: SupportLevel;
  notes?: string;
}

/** data/verified-configurations.json — Part 5 full-page configuration. */
export interface VerifiedConfigurationEntry {
  id: string;
  title: string;
  deviceId: string;
  androidVersion: string;
  desktopMode: string;
  linuxDistribution: string;
  desktopEnvironment: string;
  dock?: string;
  monitor?: string;
  keyboard?: string;
  mouse?: string;
  ssd?: string;
  performanceNotes: string[];
  knownIssues: string[];
  workarounds: string[];
  dateTested: string;
  verifiedBy: string;
  verification: VerificationLevel;
  version: VersionInfo;
}
