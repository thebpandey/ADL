/**
 * Guided installer — core types.
 *
 * Pure data contracts shared by the wizard UI, the recommendation engine,
 * the guide generator, and the tests. No React, no side effects.
 */

/** Version stamps. Bump when the corresponding shape changes. */
export const QUESTIONNAIRE_SCHEMA_VERSION = 1;
export const DEVICE_REPORT_SCHEMA_VERSION = 1;
export const RULES_VERSION = 1;
export const SAVED_STATE_VERSION = 1;
export const PLAN_EXPORT_VERSION = 1;

/** Tri-state for facts a normal user may not know. */
export type TriState = "yes" | "no" | "unknown";

// ---------------------------------------------------------------------------
// Questionnaire answers
// ---------------------------------------------------------------------------

export type DeviceOwnership = "personal" | "employer" | "school" | "restricted";

export type Objective =
  | "learn-linux"
  | "general-desktop"
  | "web-browsing"
  | "browser-devtools"
  | "software-development"
  | "cli-development"
  | "local-web-server"
  | "office-documents"
  | "remote-administration"
  | "self-hosted-tools"
  | "data-analysis"
  | "image-editing"
  | "media"
  | "security-lab"
  | "desktop-replacement"
  | "portable-workstation"
  | "headless-server"
  | "other";

export type ExperienceLevel =
  | "new"
  | "can-follow-terminal"
  | "intermediate"
  | "advanced"
  | "experimental-ok";

export type DisplayTarget =
  | "phone-screen"
  | "tablet-screen"
  | "wired-monitor"
  | "wired-tv"
  | "wireless-display"
  | "remote-desktop";

export type KeyboardKind =
  | "none"
  | "bluetooth"
  | "usb"
  | "rf-2_4ghz"
  | "dock-integrated"
  | "keyboard-case"
  | "unsure";

export type PointerKind =
  | "touchscreen"
  | "phone-as-touchpad"
  | "bluetooth-mouse"
  | "usb-mouse"
  | "rf-2_4ghz-mouse"
  | "trackpad"
  | "dock-integrated"
  | "unsure";

export type AudioTarget =
  | "phone-speakers"
  | "bluetooth"
  | "wired-headphones"
  | "hdmi-monitor"
  | "usb-audio"
  | "not-required";

export type PeripheralId =
  | "usb-hub"
  | "usbc-dock"
  | "pd-charger"
  | "ethernet-adapter"
  | "external-storage"
  | "usb-audio-device"
  | "bluetooth-headphones"
  | "wired-headphones"
  | "speakers"
  | "game-controller"
  | "webcam"
  | "printer"
  | "other-usb";

export type DistroId = "debian" | "ubuntu" | "alpine" | "archlinux";
export type DesktopId = "xfce" | "mate" | "lxqt" | "plasma" | "gnome" | "cli-only";

export type RecommendMode =
  | "auto-everything"
  | "auto-distro-choose-desktop"
  | "auto-desktop-choose-distro"
  | "manual-both";

export type CpuArch = "arm64" | "arm32" | "x86_64" | "unknown";

export interface WizardAnswers {
  schemaVersion: number;

  // 5.1 Device identity
  manufacturer?: string;
  marketingName?: string;
  modelNumber?: string;
  regionalVariant?: string;
  androidVersion?: number | null; // major version, null/undefined = unknown
  manufacturerSkin?: string;
  manufacturerSkinVersion?: string;
  securityPatchDate?: string;
  rooted?: TriState;
  customRom?: TriState;
  bootloaderUnlocked?: TriState;
  ownership?: DeviceOwnership;

  // 5.2 Device hardware
  cpuArchitecture?: CpuArch;
  soc?: string;
  ramGb?: number | null;
  freeStorageGb?: number | null;
  totalStorageGb?: number | null;
  usbConnector?: "usb-c" | "micro-usb" | "unknown";
  usbDataCapable?: TriState;
  displayPortAltMode?: TriState;
  manufacturerDesktopMode?: TriState;
  wirelessDisplaySupport?: TriState;
  screenResolution?: string;
  batteryHealthConcern?: TriState;
  sustainedUseWhileCharging?: TriState;
  externalCooling?: TriState;

  // 5.3 Objectives
  primaryObjective?: Objective;
  secondaryObjectives?: Objective[];

  // 5.4 Experience
  experience?: ExperienceLevel;

  // 5.5 Display
  displayTargets?: DisplayTarget[];
  monitorModel?: string;
  monitorInputs?: Array<"hdmi" | "displayport" | "usb-c" | "dvi-vga">;
  monitorResolution?: string;
  monitorTouch?: TriState;
  monitorMiracast?: TriState;
  hasCablesAdapters?: TriState;
  hasHubOrDock?: TriState;
  hubHasPowerDelivery?: TriState;

  // 5.6–5.8 Input + peripherals
  keyboard?: KeyboardKind;
  keyboardConnector?: "bluetooth" | "usb-a" | "usb-c" | "proprietary" | "unknown";
  keyboardLayout?: string;
  pointer?: PointerKind;
  peripherals?: PeripheralId[];

  // 5.9 Audio
  audioTargets?: AudioTarget[];

  // 5.10 Preferences
  recommendMode?: RecommendMode;
  manualDistro?: DistroId;
  manualDesktop?: DesktopId;
  stableOnly?: boolean;

  // From an imported device report (informational)
  importedReport?: DeviceReport | null;
}

// ---------------------------------------------------------------------------
// Device report (adl-device-report.sh output)
// ---------------------------------------------------------------------------

export interface DeviceReport {
  schemaVersion: number;
  generatedAt?: string;
  scriptVersion?: string;
  manufacturer?: string;
  model?: string;
  device?: string; // codename
  androidVersion?: string;
  apiLevel?: number;
  primaryAbi?: string;
  abiList?: string[];
  kernel?: string;
  ramTotalMb?: number;
  ramAvailableMb?: number;
  termuxStorageTotalMb?: number;
  termuxStorageFreeMb?: number;
  sharedStorageTotalMb?: number | null;
  sharedStorageFreeMb?: number | null;
  screen?: string;
  density?: string;
  termuxVersion?: string;
  termuxApkRelease?: string;
  termuxX11PackageInstalled?: boolean;
  prootDistroInstalled?: boolean;
  pulseaudioInstalled?: boolean;
  installedDistros?: string[];
}

// ---------------------------------------------------------------------------
// Device catalog
// ---------------------------------------------------------------------------

export type EvidenceLevel =
  | "official-doc"
  | "adl-verified"
  | "reproduced-community"
  | "field-report"
  | "inferred-from-specs"
  | "unknown";

export interface SourceRef {
  url: string;
  title?: string;
  accessedAt?: string;
}

export interface DeviceRecord {
  id: string;
  manufacturer: string;
  marketingName: string;
  modelNumbers: string[];
  regionalVariants?: Array<{ region: string; modelNumber?: string; soc?: string }>;
  releaseYear?: number;
  soc?: string;
  cpuArchitecture: CpuArch;
  ramVariantsGb: number[];
  storageVariantsGb: number[];
  usbConnector?: "usb-c" | "micro-usb";
  usbVersion?: string;
  displayPortAltMode: boolean | "unknown";
  manufacturerDesktopMode?: string | null;
  wirelessDisplay?: boolean | "unknown";
  knownAndroidVersions?: number[];
  testedConfigurations?: Array<{
    distro: DistroId;
    desktop: DesktopId;
    displayMethod: string;
    result: string;
    evidenceLevel: EvidenceLevel;
  }>;
  knownIssueIds?: string[];
  evidenceLevel: EvidenceLevel;
  sources: SourceRef[];
  lastVerified?: string;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Known issues
// ---------------------------------------------------------------------------

export interface IssueRecord {
  id: string;
  title: string;
  symptoms: string[];
  affectedManufacturers?: string[];
  affectedModels?: string[];
  affectedAndroidVersions?: string;
  affectedManufacturerVersions?: string;
  affectedDistros?: DistroId[];
  affectedDesktops?: DesktopId[];
  affectedApps?: string[];
  displayMethods?: string[];
  severity: "low" | "medium" | "high" | "blocker";
  confidence: EvidenceLevel;
  cause?: string;
  diagnostics?: string[];
  safeFix?: string;
  workaround?: string;
  rollback?: string;
  securityImpact?: string;
  sources: SourceRef[];
  lastVerified?: string;
  relatedPages?: string[];
}

// ---------------------------------------------------------------------------
// Assessment result
// ---------------------------------------------------------------------------

export type CompatibilityStatus =
  | "likely-compatible"
  | "compatible-with-limitations"
  | "experimental"
  | "unknown"
  | "unlikely-graphical"
  | "cli-recommended"
  | "blocked";

export interface DimensionResult {
  id: string;
  label: string;
  status: CompatibilityStatus;
  confidence: EvidenceLevel;
  reason: string;
}

export interface RecommendationOption {
  id: string;
  label: string;
  reasons: string[];
  warnings: string[];
  status: "recommended" | "supported" | "experimental" | "not-recommended";
}

export interface Warning {
  id: string;
  severity: "info" | "warning" | "critical";
  text: string;
  kbLink?: string;
}

export interface AlternativeConfiguration {
  label: string;
  distro: DistroId;
  desktop: DesktopId;
  reason: string;
}

export interface AssessmentResult {
  rulesVersion: number;
  overallStatus: CompatibilityStatus;
  confidence: EvidenceLevel;
  dimensions: DimensionResult[];
  recommendation: {
    distro: RecommendationOption;
    desktop: RecommendationOption;
    displayMethod: RecommendationOption;
    audioMethod?: RecommendationOption;
    browser?: RecommendationOption;
    peripherals: RecommendationOption[];
  };
  estimatedStorageGb: number;
  requiredWarnings: Warning[];
  optionalWarnings: Warning[];
  alternatives: AlternativeConfiguration[];
  matchedIssueIds: string[];
  matchedDevice: { id: string; matchType: "model-number" | "marketing-name" | "none" } | null;
  evidence: SourceRef[];
  notRecommendedNotes: string[];
}
