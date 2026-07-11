/**
 * Guided installer — local persistence, export/import, device-report parsing.
 *
 * All state is local (localStorage). Nothing is transmitted anywhere.
 * Saved state is versioned; an unknown newer version is left untouched and
 * reported so the UI can offer a reset instead of silently corrupting it.
 */
import type { DeviceReport, WizardAnswers } from "../compatibility/types";
import {
  DEVICE_REPORT_SCHEMA_VERSION,
  PLAN_EXPORT_VERSION,
  QUESTIONNAIRE_SCHEMA_VERSION,
  SAVED_STATE_VERSION,
} from "../compatibility/types";

const STATE_KEY = "adl.getstarted.v1";
const ACK_KEY = "adl.disclaimer.ack";
const PROGRESS_KEY = "adl.guide.progress.v1";

export const DISCLAIMER_VERSION = 1;

export interface SavedState {
  stateVersion: number;
  savedAt: string;
  stepIndex: number;
  answers: WizardAnswers;
}

export interface DisclaimerAck {
  version: number;
  acknowledgedAt: string;
}

const hasStorage = () => typeof window !== "undefined" && !!window.localStorage;

export function emptyAnswers(): WizardAnswers {
  return { schemaVersion: QUESTIONNAIRE_SCHEMA_VERSION };
}

export function loadState(): { state: SavedState | null; incompatible: boolean } {
  if (!hasStorage()) return { state: null, incompatible: false };
  try {
    const raw = window.localStorage.getItem(STATE_KEY);
    if (!raw) return { state: null, incompatible: false };
    const parsed = JSON.parse(raw) as SavedState;
    if (typeof parsed?.stateVersion !== "number") return { state: null, incompatible: true };
    if (parsed.stateVersion > SAVED_STATE_VERSION) return { state: null, incompatible: true };
    // v1 is current; future migrations go here.
    if (!parsed.answers || typeof parsed.answers !== "object") return { state: null, incompatible: true };
    return { state: parsed, incompatible: false };
  } catch {
    return { state: null, incompatible: true };
  }
}

export function saveState(stepIndex: number, answers: WizardAnswers): void {
  if (!hasStorage()) return;
  const state: SavedState = {
    stateVersion: SAVED_STATE_VERSION,
    savedAt: new Date().toISOString(),
    stepIndex,
    answers,
  };
  try {
    window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    /* storage full/blocked — non-fatal */
  }
}

export function clearState(): void {
  if (!hasStorage()) return;
  window.localStorage.removeItem(STATE_KEY);
  window.localStorage.removeItem(PROGRESS_KEY);
}

// --- Disclaimer acknowledgment ---------------------------------------------

export function loadAck(): DisclaimerAck | null {
  if (!hasStorage()) return null;
  try {
    const raw = window.localStorage.getItem(ACK_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DisclaimerAck;
    // A materially changed disclaimer requires renewed acknowledgment.
    if (parsed.version !== DISCLAIMER_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveAck(): DisclaimerAck {
  const ack: DisclaimerAck = { version: DISCLAIMER_VERSION, acknowledgedAt: new Date().toISOString() };
  if (hasStorage()) {
    try {
      window.localStorage.setItem(ACK_KEY, JSON.stringify(ack));
    } catch {
      /* non-fatal */
    }
  }
  return ack;
}

// --- Guide progress ----------------------------------------------------------

export function loadProgress(): Record<string, boolean> {
  if (!hasStorage()) return {};
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && parsed.version === 1 ? (parsed.done ?? {}) : {};
  } catch {
    return {};
  }
}

export function saveProgress(done: Record<string, boolean>): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify({ version: 1, done }));
  } catch {
    /* non-fatal */
  }
}

// --- Export / import ----------------------------------------------------------

export interface ExportedPlan {
  format: "adl-assessment";
  exportVersion: number;
  exportedAt: string;
  disclaimerVersion: number | null;
  answers: WizardAnswers;
}

export function exportPlan(answers: WizardAnswers, ack: DisclaimerAck | null): string {
  const payload: ExportedPlan = {
    format: "adl-assessment",
    exportVersion: PLAN_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    disclaimerVersion: ack?.version ?? null,
    answers,
  };
  return JSON.stringify(payload, null, 2);
}

export function importPlan(json: string): { answers: WizardAnswers | null; error: string | null } {
  try {
    const parsed = JSON.parse(json) as ExportedPlan;
    if (parsed?.format !== "adl-assessment") {
      return { answers: null, error: "This file is not an ADL assessment export." };
    }
    if (typeof parsed.exportVersion !== "number" || parsed.exportVersion > PLAN_EXPORT_VERSION) {
      return { answers: null, error: "This export was created by a newer version of the wizard." };
    }
    if (!parsed.answers || typeof parsed.answers !== "object") {
      return { answers: null, error: "The export contains no answers." };
    }
    return { answers: { ...parsed.answers, schemaVersion: QUESTIONNAIRE_SCHEMA_VERSION }, error: null };
  } catch {
    return { answers: null, error: "Could not parse the file as JSON." };
  }
}

// --- Device report parsing -----------------------------------------------------

export function parseDeviceReport(json: string): { report: DeviceReport | null; error: string | null } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { report: null, error: "The pasted text is not valid JSON. Paste the full output of adl-device-report.sh." };
  }
  const r = parsed as Partial<DeviceReport>;
  if (typeof r !== "object" || r === null) return { report: null, error: "The report must be a JSON object." };
  if (typeof r.schemaVersion !== "number") {
    return { report: null, error: "Missing schemaVersion — is this an adl-device-report.sh output?" };
  }
  if (r.schemaVersion > DEVICE_REPORT_SCHEMA_VERSION) {
    return { report: null, error: "This report uses a newer schema than this site understands. Update the site or re-run an older script." };
  }
  // Tolerate unknown/missing fields; coerce obvious numeric strings.
  const num = (v: unknown): number | undefined => {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && /^\d+(\.\d+)?$/.test(v.trim())) return Number(v);
    return undefined;
  };
  const report: DeviceReport = {
    schemaVersion: r.schemaVersion,
    generatedAt: typeof r.generatedAt === "string" ? r.generatedAt : undefined,
    scriptVersion: typeof r.scriptVersion === "string" ? r.scriptVersion : undefined,
    manufacturer: typeof r.manufacturer === "string" ? r.manufacturer : undefined,
    model: typeof r.model === "string" ? r.model : undefined,
    device: typeof r.device === "string" ? r.device : undefined,
    androidVersion: typeof r.androidVersion === "string" ? r.androidVersion : undefined,
    apiLevel: num(r.apiLevel),
    primaryAbi: typeof r.primaryAbi === "string" ? r.primaryAbi : undefined,
    abiList: Array.isArray(r.abiList) ? r.abiList.filter((x): x is string => typeof x === "string") : undefined,
    ramTotalMb: num(r.ramTotalMb),
    ramAvailableMb: num(r.ramAvailableMb),
    termuxStorageTotalMb: num(r.termuxStorageTotalMb),
    termuxStorageFreeMb: num(r.termuxStorageFreeMb),
    sharedStorageTotalMb: num(r.sharedStorageTotalMb) ?? null,
    sharedStorageFreeMb: num(r.sharedStorageFreeMb) ?? null,
    screen: typeof r.screen === "string" ? r.screen : undefined,
    density: typeof r.density === "string" ? r.density : undefined,
    termuxVersion: typeof r.termuxVersion === "string" ? r.termuxVersion : undefined,
    termuxApkRelease: typeof r.termuxApkRelease === "string" ? r.termuxApkRelease : undefined,
    termuxX11PackageInstalled: typeof r.termuxX11PackageInstalled === "boolean" ? r.termuxX11PackageInstalled : undefined,
    prootDistroInstalled: typeof r.prootDistroInstalled === "boolean" ? r.prootDistroInstalled : undefined,
    pulseaudioInstalled: typeof r.pulseaudioInstalled === "boolean" ? r.pulseaudioInstalled : undefined,
    installedDistros: Array.isArray(r.installedDistros)
      ? r.installedDistros.filter((x): x is string => typeof x === "string")
      : undefined,
  };
  return { report, error: null };
}

/** Map a parsed report onto answers (user reviews/edits before applying). */
export function reportToAnswers(report: DeviceReport, base: WizardAnswers): WizardAnswers {
  const androidMajor = report.androidVersion ? parseInt(report.androidVersion, 10) : undefined;
  const abi = report.primaryAbi ?? "";
  const arch = abi.includes("arm64") ? "arm64" : abi.startsWith("armeabi") ? "arm32" : abi.includes("x86_64") ? "x86_64" : undefined;
  return {
    ...base,
    manufacturer: report.manufacturer ?? base.manufacturer,
    marketingName: base.marketingName, // marketing name rarely equals ro.product.model; leave user-entered
    modelNumber: report.model ?? base.modelNumber,
    androidVersion: Number.isFinite(androidMajor) ? (androidMajor as number) : base.androidVersion,
    cpuArchitecture: arch ?? base.cpuArchitecture,
    ramGb: report.ramTotalMb ? Math.round((report.ramTotalMb / 1024) * 10) / 10 : base.ramGb,
    freeStorageGb: report.termuxStorageFreeMb
      ? Math.round((report.termuxStorageFreeMb / 1024) * 10) / 10
      : base.freeStorageGb,
    importedReport: report,
  };
}
