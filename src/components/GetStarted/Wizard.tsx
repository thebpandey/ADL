/**
 * Guided installer — multi-step questionnaire, review, assessment, and guide.
 *
 * All state is local. The wizard renders nothing stateful during SSR; state
 * loads from localStorage after mount (resume support).
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "@docusaurus/Link";
import catalogJson from "@site/data/device-catalog.json";
import issuesJson from "@site/data/wizard-issues.json";
import { evaluate } from "@site/src/lib/compatibility/engine";
import type {
  DeviceRecord,
  IssueRecord,
  TriState,
  WizardAnswers,
} from "@site/src/lib/compatibility/types";
import {
  clearState,
  emptyAnswers,
  exportPlan,
  importPlan,
  loadAck,
  loadState,
  parseDeviceReport,
  reportToAnswers,
  saveState,
} from "@site/src/lib/wizard/storage";
import { Assessment } from "./Assessment";
import { CheckboxGroup, NumberField, RadioGroup, SelectField, TextField, type Option } from "./fields";
import styles from "./styles.module.css";

const CATALOG = (catalogJson as { devices: DeviceRecord[] }).devices;
const ISSUES = (issuesJson as { issues: IssueRecord[] }).issues;

const TRI: Option<TriState>[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unknown", label: "I don't know" },
];

interface StepDef {
  id: string;
  title: string;
  help?: string;
  validate?: (a: WizardAnswers) => string[];
  render: (a: WizardAnswers, set: (patch: Partial<WizardAnswers>) => void) => React.ReactNode;
}

const STEPS: StepDef[] = [
  {
    id: "device",
    title: "Your device",
    help:
      "Exact model numbers matter: phones with the same marketing name can have different chipsets, USB capabilities, and regional restrictions. Find yours in Settings > About phone (Samsung: About phone > Model number).",
    validate: (a) => {
      const errors: string[] = [];
      if (!a.manufacturer?.trim()) errors.push("Enter the manufacturer (or 'Unknown').");
      return errors;
    },
    render: (a, set) => (
      <>
        <TextField
          label="Manufacturer"
          hint="For example: Samsung, Google, Motorola, OnePlus, Xiaomi."
          value={a.manufacturer ?? ""}
          onChange={(v) => set({ manufacturer: v })}
          placeholder="Samsung"
        />
        <TextField
          label="Marketing name"
          hint="The name on the box, e.g. 'Galaxy S22+' or 'Pixel 8'."
          value={a.marketingName ?? ""}
          onChange={(v) => set({ marketingName: v })}
          placeholder="Galaxy S22+"
        />
        <TextField
          label="Exact model number (recommended)"
          hint="Settings > About phone > Model number, e.g. SM-S906B. This distinguishes regional variants."
          value={a.modelNumber ?? ""}
          onChange={(v) => set({ modelNumber: v })}
          placeholder="SM-S906B"
        />
        <SelectField
          label="Android version"
          hint="Settings > About phone > Software information > Android version."
          options={[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((v) => ({
            value: String(v),
            label: `Android ${v}`,
          }))}
          value={a.androidVersion != null ? String(a.androidVersion) : undefined}
          onChange={(v) => set({ androidVersion: v ? Number(v) : null })}
          placeholder="I don't know"
        />
        <TextField
          label="Manufacturer interface (optional)"
          hint="For example One UI 6.1, Pixel UI, OxygenOS 14, HyperOS."
          value={a.manufacturerSkin ?? ""}
          onChange={(v) => set({ manufacturerSkin: v })}
        />
        <RadioGroup
          label="Is the phone rooted or running a custom ROM?"
          hint="The guide covers the standard no-root path either way."
          options={TRI}
          value={a.rooted}
          onChange={(v) => set({ rooted: v, customRom: v })}
          inline
        />
        <RadioGroup
          label="Who controls this device?"
          hint="Employer- or school-managed devices often block sideloading."
          options={[
            { value: "personal", label: "It's my personal device" },
            { value: "employer", label: "Employer-managed" },
            { value: "school", label: "School-managed" },
            { value: "restricted", label: "Otherwise restricted" },
          ]}
          value={a.ownership}
          onChange={(v) => set({ ownership: v })}
        />
      </>
    ),
  },
  {
    id: "hardware",
    title: "Hardware",
    help:
      "Answer what you know — 'I don't know' is always allowed, and the result will say what was assumed. RAM and free storage matter most.",
    render: (a, set) => (
      <>
        <NumberField
          label="RAM"
          unit="GB"
          hint="Settings > About phone (or the spec sheet). Common values: 4, 6, 8, 12."
          value={a.ramGb}
          onChange={(v) => set({ ramGb: v })}
          min={1}
          max={32}
        />
        <NumberField
          label="Free internal storage"
          unit="GB"
          hint="Settings > Storage. Free space, not total."
          value={a.freeStorageGb}
          onChange={(v) => set({ freeStorageGb: v })}
          min={0}
          max={2048}
        />
        <RadioGroup
          label="CPU architecture"
          hint="Almost every phone since 2017 is ARM64. The device report script detects this exactly."
          options={[
            { value: "arm64", label: "ARM64 / aarch64", detail: "The normal case" },
            { value: "arm32", label: "32-bit ARM", detail: "Older or very low-end devices" },
            { value: "unknown", label: "I don't know" },
          ]}
          value={a.cpuArchitecture}
          onChange={(v) => set({ cpuArchitecture: v })}
        />
        <RadioGroup
          label="USB connector"
          options={[
            { value: "usb-c", label: "USB-C" },
            { value: "micro-usb", label: "Micro-USB" },
            { value: "unknown", label: "I don't know" },
          ]}
          value={a.usbConnector}
          onChange={(v) => set({ usbConnector: v })}
          inline
        />
        <RadioGroup
          label="Does the phone support video output over USB-C (DisplayPort Alt Mode)?"
          hint="USB-C alone does not mean video output. If your device is in the ADL catalog this is filled in automatically — 'I don't know' is fine."
          options={TRI}
          value={a.displayPortAltMode}
          onChange={(v) => set({ displayPortAltMode: v })}
          inline
        />
        <RadioGroup
          label="Do you plan long sessions while charging?"
          hint="Sustained use while charging is when phones heat up and throttle."
          options={TRI}
          value={a.sustainedUseWhileCharging}
          onChange={(v) => set({ sustainedUseWhileCharging: v })}
          inline
        />
      </>
    ),
  },
  {
    id: "objective",
    title: "What do you want to do with it?",
    help: "The primary goal steers the distribution, desktop, browser, and storage recommendations.",
    validate: (a) => (!a.primaryObjective ? ["Choose a primary objective."] : []),
    render: (a, set) => (
      <>
        <RadioGroup
          label="Primary objective"
          options={[
            { value: "learn-linux", label: "Learn Linux" },
            { value: "general-desktop", label: "General desktop use" },
            { value: "web-browsing", label: "Web browsing" },
            { value: "software-development", label: "Software development (graphical)" },
            { value: "cli-development", label: "Command-line development" },
            { value: "local-web-server", label: "Local web server" },
            { value: "office-documents", label: "Office & documents" },
            { value: "remote-administration", label: "Remote administration" },
            { value: "self-hosted-tools", label: "Self-hosted tools" },
            { value: "data-analysis", label: "Data analysis" },
            { value: "image-editing", label: "Image editing" },
            { value: "media", label: "Media use" },
            { value: "security-lab", label: "Security lab / education" },
            { value: "desktop-replacement", label: "Desktop replacement" },
            { value: "portable-workstation", label: "Portable workstation" },
            { value: "headless-server", label: "Lightweight server (no desktop)" },
            { value: "other", label: "Something else" },
          ]}
          value={a.primaryObjective}
          onChange={(v) => set({ primaryObjective: v })}
        />
        <CheckboxGroup
          label="Secondary objectives (optional)"
          options={[
            { value: "web-browsing", label: "Web browsing" },
            { value: "browser-devtools", label: "Browser developer tools" },
            { value: "office-documents", label: "Office & documents" },
            { value: "software-development", label: "Software development" },
            { value: "media", label: "Media use" },
            { value: "data-analysis", label: "Data analysis" },
          ]}
          value={a.secondaryObjectives ?? []}
          onChange={(v) => set({ secondaryObjectives: v })}
        />
      </>
    ),
  },
  {
    id: "experience",
    title: "Your Linux experience",
    help: "This adjusts how conservative the recommendation is and how much is explained — it never hides risk information.",
    validate: (a) => (!a.experience ? ["Choose the option that best matches your experience."] : []),
    render: (a, set) => (
      <RadioGroup
        label="Which best describes you?"
        options={[
          { value: "new", label: "New to Linux", detail: "Never used a terminal" },
          { value: "can-follow-terminal", label: "Comfortable following terminal instructions" },
          { value: "intermediate", label: "Intermediate Linux user" },
          { value: "advanced", label: "Advanced user" },
          { value: "experimental-ok", label: "Advanced — happy to troubleshoot experimental setups" },
        ]}
        value={a.experience}
        onChange={(v) => set({ experience: v })}
      />
    ),
  },
  {
    id: "display",
    title: "Display",
    help:
      "A phone can run Linux even if it cannot output video over USB-C — the desktop then runs on the phone screen, a wireless display, or another computer via VNC.",
    validate: (a) => (!(a.displayTargets ?? []).length ? ["Choose at least one display option."] : []),
    render: (a, set) => (
      <>
        <CheckboxGroup
          label="Where do you want to see the desktop?"
          options={[
            { value: "phone-screen", label: "On the phone screen" },
            { value: "tablet-screen", label: "On a tablet screen" },
            { value: "wired-monitor", label: "On a wired monitor" },
            { value: "wired-tv", label: "On a wired TV" },
            { value: "wireless-display", label: "On a wireless display (Miracast/Cast)" },
            { value: "remote-desktop", label: "From another computer (VNC)" },
          ]}
          value={a.displayTargets ?? []}
          onChange={(v) => set({ displayTargets: v })}
        />
        {(a.displayTargets ?? []).some((t) => t === "wired-monitor" || t === "wired-tv") && (
          <>
            <CheckboxGroup
              label="Which inputs does your monitor/TV have?"
              options={[
                { value: "hdmi", label: "HDMI" },
                { value: "displayport", label: "DisplayPort" },
                { value: "usb-c", label: "USB-C video input" },
                { value: "dvi-vga", label: "DVI or VGA only" },
              ]}
              value={a.monitorInputs ?? []}
              onChange={(v) => set({ monitorInputs: v })}
            />
            <TextField
              label="Monitor native resolution (optional)"
              hint="For example 1920×1080 or 3840×2160 (4K)."
              value={a.monitorResolution ?? ""}
              onChange={(v) => set({ monitorResolution: v })}
            />
            <RadioGroup
              label="Do you already own a USB-C hub or dock?"
              options={TRI}
              value={a.hasHubOrDock}
              onChange={(v) => set({ hasHubOrDock: v })}
              inline
            />
            {a.hasHubOrDock === "yes" && (
              <RadioGroup
                label="Does the hub support Power Delivery pass-through (charging while connected)?"
                options={TRI}
                value={a.hubHasPowerDelivery}
                onChange={(v) => set({ hubHasPowerDelivery: v })}
                inline
              />
            )}
          </>
        )}
        {(a.displayTargets ?? []).includes("wireless-display") && (
          <RadioGroup
            label="Does the display support Miracast (or is it a Cast/Smart TV device)?"
            options={TRI}
            value={a.monitorMiracast}
            onChange={(v) => set({ monitorMiracast: v })}
            inline
          />
        )}
      </>
    ),
  },
  {
    id: "input",
    title: "Keyboard & mouse",
    render: (a, set) => (
      <>
        <RadioGroup
          label="Keyboard"
          options={[
            { value: "none", label: "No physical keyboard" },
            { value: "bluetooth", label: "Bluetooth keyboard" },
            { value: "usb", label: "USB keyboard" },
            { value: "rf-2_4ghz", label: "2.4 GHz wireless keyboard (USB receiver)" },
            { value: "dock-integrated", label: "Keyboard integrated into a dock" },
            { value: "keyboard-case", label: "Keyboard case" },
            { value: "unsure", label: "Not sure yet" },
          ]}
          value={a.keyboard}
          onChange={(v) => set({ keyboard: v })}
        />
        <RadioGroup
          label="Pointing device"
          options={[
            { value: "touchscreen", label: "Touchscreen only" },
            { value: "phone-as-touchpad", label: "Phone as touchpad" },
            { value: "bluetooth-mouse", label: "Bluetooth mouse" },
            { value: "usb-mouse", label: "Wired USB mouse" },
            { value: "rf-2_4ghz-mouse", label: "2.4 GHz mouse (USB receiver)" },
            { value: "trackpad", label: "Trackpad" },
            { value: "dock-integrated", label: "Dock-integrated input" },
            { value: "unsure", label: "Not sure yet" },
          ]}
          value={a.pointer}
          onChange={(v) => set({ pointer: v })}
        />
      </>
    ),
  },
  {
    id: "peripherals",
    title: "Peripherals & audio",
    render: (a, set) => (
      <>
        <CheckboxGroup
          label="Which accessories do you have or plan to use?"
          options={[
            { value: "usb-hub", label: "USB hub" },
            { value: "usbc-dock", label: "USB-C dock" },
            { value: "pd-charger", label: "Power Delivery charger" },
            { value: "ethernet-adapter", label: "Ethernet adapter" },
            { value: "external-storage", label: "External storage" },
            { value: "usb-audio-device", label: "USB audio device" },
            { value: "bluetooth-headphones", label: "Bluetooth headphones" },
            { value: "wired-headphones", label: "Wired headphones" },
            { value: "speakers", label: "Speakers" },
            { value: "game-controller", label: "Game controller" },
            { value: "webcam", label: "Webcam" },
            { value: "printer", label: "Printer" },
            { value: "other-usb", label: "Other USB devices" },
          ]}
          value={a.peripherals ?? []}
          onChange={(v) => set({ peripherals: v })}
        />
        <CheckboxGroup
          label="How should audio work?"
          hint="Sound from the Linux desktop needs a one-time forwarding setup — it is not automatic. Graphical output working does not imply audio works."
          options={[
            { value: "phone-speakers", label: "Phone speakers" },
            { value: "bluetooth", label: "Bluetooth headphones or speakers" },
            { value: "wired-headphones", label: "Wired headphones" },
            { value: "hdmi-monitor", label: "HDMI / monitor audio" },
            { value: "usb-audio", label: "USB audio device" },
            { value: "not-required", label: "I don't need audio" },
          ]}
          value={a.audioTargets ?? []}
          onChange={(v) => set({ audioTargets: v })}
        />
      </>
    ),
  },
  {
    id: "preferences",
    title: "Installation preferences",
    validate: (a) => (!a.recommendMode ? ["Choose how much you want decided for you."] : []),
    render: (a, set) => (
      <>
        <RadioGroup
          label="How much should ADL decide for you?"
          options={[
            { value: "auto-everything", label: "Recommend everything automatically", detail: "The default — every choice is explained" },
            { value: "auto-distro-choose-desktop", label: "Recommend a distro, but let me choose the desktop" },
            { value: "auto-desktop-choose-distro", label: "Recommend a desktop, but let me choose the distro" },
            { value: "manual-both", label: "I already know which distro and desktop I want" },
          ]}
          value={a.recommendMode}
          onChange={(v) => set({ recommendMode: v })}
        />
        {(a.recommendMode === "manual-both" || a.recommendMode === "auto-desktop-choose-distro") && (
          <SelectField
            label="Distribution"
            options={[
              { value: "debian", label: "Debian (stable, conservative)" },
              { value: "ubuntu", label: "Ubuntu (familiar, beginner-friendly)" },
              { value: "alpine", label: "Alpine (tiny, CLI-focused)" },
              { value: "archlinux", label: "Arch Linux (rolling, advanced)" },
            ]}
            value={a.manualDistro}
            onChange={(v) => set({ manualDistro: v })}
          />
        )}
        {(a.recommendMode === "manual-both" || a.recommendMode === "auto-distro-choose-desktop") && (
          <SelectField
            label="Desktop environment"
            options={[
              { value: "xfce", label: "Xfce (recommended default)" },
              { value: "mate", label: "MATE" },
              { value: "lxqt", label: "LXQt (lightest)" },
              { value: "plasma", label: "KDE Plasma (heavy)" },
              { value: "gnome", label: "GNOME (experimental — expect problems under proot)" },
              { value: "cli-only", label: "No desktop (command line only)" },
            ]}
            value={a.manualDesktop}
            onChange={(v) => set({ manualDesktop: v })}
          />
        )}
        <RadioGroup
          label="Which options should be shown?"
          options={[
            { value: "stable", label: "Only stable, well-tested options" },
            { value: "experimental", label: "Include experimental options (with warnings)" },
          ]}
          value={a.stableOnly === undefined ? undefined : a.stableOnly ? "stable" : "experimental"}
          onChange={(v) => set({ stableOnly: v === "stable" })}
        />
      </>
    ),
  },
];

const REVIEW_LABELS: Array<[keyof WizardAnswers, string, number]> = [
  ["manufacturer", "Manufacturer", 0],
  ["marketingName", "Marketing name", 0],
  ["modelNumber", "Model number", 0],
  ["androidVersion", "Android version", 0],
  ["ownership", "Device control", 0],
  ["ramGb", "RAM (GB)", 1],
  ["freeStorageGb", "Free storage (GB)", 1],
  ["cpuArchitecture", "CPU architecture", 1],
  ["displayPortAltMode", "USB-C video out", 1],
  ["primaryObjective", "Primary objective", 2],
  ["experience", "Linux experience", 3],
  ["displayTargets", "Display", 4],
  ["keyboard", "Keyboard", 5],
  ["pointer", "Pointing device", 5],
  ["peripherals", "Peripherals", 6],
  ["audioTargets", "Audio", 6],
  ["recommendMode", "Recommendation mode", 7],
];

export default function Wizard(): React.JSX.Element {
  const [ready, setReady] = useState(false);
  const [stepIndex, setStepIndex] = useState(0); // 0..STEPS.length-1, STEPS.length = review, +1 = result
  const [answers, setAnswers] = useState<WizardAnswers>(emptyAnswers());
  const [errors, setErrors] = useState<string[]>([]);
  const [resumed, setResumed] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [reportText, setReportText] = useState("");
  const [reportNotice, setReportNotice] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const REVIEW = STEPS.length;
  const RESULT = STEPS.length + 1;

  useEffect(() => {
    const { state } = loadState();
    if (state) {
      setAnswers(state.answers);
      setStepIndex(Math.min(state.stepIndex, REVIEW));
      setResumed(true);
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready) saveState(stepIndex, answers);
  }, [ready, stepIndex, answers]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [stepIndex]);

  const set = (patch: Partial<WizardAnswers>) => setAnswers((prev) => ({ ...prev, ...patch }));

  const assessment = useMemo(
    () => (stepIndex === RESULT ? evaluate(answers, CATALOG, ISSUES) : null),
    [stepIndex, answers, RESULT],
  );

  const goNext = () => {
    if (stepIndex < STEPS.length) {
      const stepErrors = STEPS[stepIndex].validate?.(answers) ?? [];
      if (stepErrors.length) {
        setErrors(stepErrors);
        return;
      }
    }
    setErrors([]);
    setStepIndex((i) => Math.min(i + 1, RESULT));
  };
  const goBack = () => {
    setErrors([]);
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const doReset = () => {
    if (!window.confirm("Reset the wizard? Your answers and guide progress on this device will be cleared. (Your phone is not affected.)")) return;
    clearState();
    setAnswers(emptyAnswers());
    setStepIndex(0);
    setResumed(false);
  };

  const doExport = () => {
    const blob = new Blob([exportPlan(answers, loadAck())], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "adl-assessment.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImportFile = (file: File) => {
    file.text().then((text) => {
      const { answers: imported, error } = importPlan(text);
      if (error) {
        setImportError(error);
      } else if (imported) {
        setImportError(null);
        setAnswers(imported);
        setStepIndex(REVIEW);
      }
    });
  };

  const applyReport = () => {
    const { report, error } = parseDeviceReport(reportText);
    if (error) {
      setReportNotice(error);
      return;
    }
    if (report) {
      setAnswers((prev) => reportToAnswers(report, prev));
      setReportNotice(
        "Report applied. Review the filled-in values below and on the next steps — you can correct any of them before generating your plan.",
      );
    }
  };

  if (!ready) {
    return <div className={styles.wizard} aria-busy="true">Loading the wizard…</div>;
  }

  // ------------------------------------------------------------- Result view
  if (stepIndex === RESULT && assessment) {
    return (
      <div className={styles.wizard}>
        <div className={styles.toolRow}>
          <button type="button" className={styles.btnLink} onClick={() => setStepIndex(REVIEW)}>
            ← Edit answers
          </button>
          <button type="button" className={styles.btnLink} onClick={doExport}>
            Export plan (JSON)
          </button>
          <button type="button" className={styles.btnLink} onClick={() => window.print()}>
            Print
          </button>
          <button type="button" className={styles.btnLink} onClick={doReset}>
            Reset wizard
          </button>
        </div>
        <Assessment assessment={assessment} answers={answers} issues={ISSUES} />
      </div>
    );
  }

  // ------------------------------------------------------------- Review view
  if (stepIndex === REVIEW) {
    return (
      <div className={styles.wizard}>
        <Progress current={REVIEW} />
        <div className={styles.stepCard}>
          <h2 ref={headingRef} tabIndex={-1} className={styles.stepTitle}>
            Review your answers
          </h2>
          <p className={styles.stepHelp}>
            Check everything before generating your personalized plan. Use Edit to change a section.
          </p>
          <table className={styles.reviewTable}>
            <tbody>
              {REVIEW_LABELS.map(([key, label, step]) => {
                const raw = answers[key];
                const value = Array.isArray(raw)
                  ? raw.length
                    ? raw.join(", ")
                    : "—"
                  : raw === undefined || raw === null || raw === ""
                    ? "—"
                    : String(raw);
                return (
                  <tr key={String(key)}>
                    <th scope="row">{label}</th>
                    <td>{value}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.btnLink}
                        onClick={() => setStepIndex(step)}
                        aria-label={`Edit ${label}`}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className={styles.navRow}>
            <button type="button" className={styles.btnSecondary} onClick={goBack}>
              Back
            </button>
            <button type="button" className={styles.btnPrimary} onClick={goNext}>
              Generate my plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------- Step view
  const step = STEPS[stepIndex];
  return (
    <div className={styles.wizard}>
      {resumed && stepIndex === 0 && (
        <p className={styles.stepHelp} role="status">
          Welcome back — your previous answers were restored from this browser. Use “Reset wizard” to start over.
        </p>
      )}
      <div className={styles.toolRow}>
        <button type="button" className={styles.btnLink} onClick={doExport}>
          Export answers
        </button>
        <button type="button" className={styles.btnLink} onClick={() => fileRef.current?.click()}>
          Import a saved plan
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => e.target.files?.[0] && doImportFile(e.target.files[0])}
        />
        <button type="button" className={styles.btnLink} onClick={doReset}>
          Reset wizard
        </button>
      </div>
      {importError && (
        <div className={styles.errorBox} role="alert">
          {importError}
        </div>
      )}
      <Progress current={stepIndex} />
      <div className={styles.stepCard}>
        <h2 ref={headingRef} tabIndex={-1} className={styles.stepTitle}>
          {step.title}
        </h2>
        {step.help && <p className={styles.stepHelp}>{step.help}</p>}
        {errors.length > 0 && (
          <div className={styles.errorBox} role="alert">
            <strong>Before continuing:</strong>
            <ul style={{ margin: "0.3rem 0 0", paddingLeft: "1.2rem" }}>
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        )}
        {step.render(answers, set)}

        {step.id === "device" && (
          <details style={{ marginTop: "0.5rem" }}>
            <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>
              Already have Termux? Import a device report instead
            </summary>
            <p className={styles.fieldHint} style={{ marginTop: "0.5rem" }}>
              Run the <Link to="/docs/downloads/scripts">adl-device-report.sh</Link> script in Termux, then paste
              its JSON output here. A browser cannot reliably detect Android hardware, so the script reads it on
              the device — you review every value before it is used, and nothing is uploaded anywhere.
            </p>
            <textarea
              className={styles.textInput}
              style={{ maxWidth: "100%", minHeight: 120, fontFamily: "var(--ifm-font-family-monospace)", fontSize: "0.78rem" }}
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              aria-label="Paste the device report JSON here"
              placeholder='{"schemaVersion": 1, "manufacturer": "samsung", ...}'
            />
            <div style={{ marginTop: "0.5rem" }}>
              <button type="button" className={styles.btnSecondary} onClick={applyReport}>
                Apply report
              </button>
            </div>
            {reportNotice && (
              <p className={styles.fieldHint} role="status" style={{ marginTop: "0.5rem" }}>
                {reportNotice}
              </p>
            )}
          </details>
        )}

        <div className={styles.navRow}>
          <button type="button" className={styles.btnSecondary} onClick={goBack} disabled={stepIndex === 0}>
            Back
          </button>
          <button type="button" className={styles.btnPrimary} onClick={goNext}>
            {stepIndex === STEPS.length - 1 ? "Review answers" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Progress({ current }: { current: number }) {
  const total = STEPS.length + 1; // + review
  const pct = Math.round((current / total) * 100);
  return (
    <div className={styles.progress}>
      <div
        className={styles.progressBar}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label={`Section ${Math.min(current + 1, total)} of ${total}`}
      >
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.progressText}>
        Section {Math.min(current + 1, total)} of {total}
      </span>
    </div>
  );
}
