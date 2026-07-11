/**
 * Guided installer — engine, guide, and storage unit tests.
 * Includes the 18 required scenario fixtures.
 */
import { describe, expect, it } from "vitest";
import catalogJson from "../data/device-catalog.json";
import issuesJson from "../data/wizard-issues.json";
import { estimateStorageGb, evaluate, findDevice } from "../src/lib/compatibility/engine";
import { sanitizeUsername } from "../src/lib/compatibility/rules";
import type { DeviceRecord, IssueRecord, WizardAnswers } from "../src/lib/compatibility/types";
import { QUESTIONNAIRE_SCHEMA_VERSION } from "../src/lib/compatibility/types";
import { generateGuide } from "../src/lib/guide/generator";
import { exportPlan, importPlan, parseDeviceReport, reportToAnswers } from "../src/lib/wizard/storage";

const CATALOG = (catalogJson as { devices: DeviceRecord[] }).devices;
const ISSUES = (issuesJson as { issues: IssueRecord[] }).issues;

const base = (over: Partial<WizardAnswers> = {}): WizardAnswers => ({
  schemaVersion: QUESTIONNAIRE_SCHEMA_VERSION,
  manufacturer: "Samsung",
  marketingName: "Galaxy S22+",
  modelNumber: "SM-S906B",
  androidVersion: 14,
  ramGb: 8,
  freeStorageGb: 30,
  cpuArchitecture: "arm64",
  primaryObjective: "general-desktop",
  experience: "can-follow-terminal",
  displayTargets: ["wired-monitor"],
  keyboard: "bluetooth",
  pointer: "bluetooth-mouse",
  audioTargets: ["bluetooth"],
  recommendMode: "auto-everything",
  ownership: "personal",
  ...over,
});

describe("device lookup", () => {
  it("matches by exact model number", () => {
    const m = findDevice(base(), CATALOG);
    expect(m?.matchType).toBe("model-number");
    expect(m?.record.id).toBe("samsung-galaxy-s22-plus");
  });
  it("matches by marketing name when model number missing", () => {
    const m = findDevice(base({ modelNumber: undefined }), CATALOG);
    expect(m?.matchType).toBe("marketing-name");
  });
  it("regional variant model numbers resolve to the same record", () => {
    const m = findDevice(base({ modelNumber: "SM-S906U1" }), CATALOG);
    expect(m?.record.id).toBe("samsung-galaxy-s22-plus");
  });
  it("returns null for unknown devices (no auto-rejection)", () => {
    const m = findDevice(base({ modelNumber: "XYZ-000", marketingName: "Nonexistent Phone 9" }), CATALOG);
    expect(m).toBeNull();
  });
});

describe("required fixtures", () => {
  // 1. Galaxy S22+ — the reference field-report path
  it("1: S22+ with DeX display path gets Ubuntu-or-Debian + Xfce and field-report warnings", () => {
    const r = evaluate(base(), CATALOG, ISSUES);
    expect(r.overallStatus).not.toBe("blocked");
    expect(r.recommendation.desktop.id).toBe("xfce");
    expect(["debian", "ubuntu"]).toContain(r.recommendation.distro.id);
    expect(r.recommendation.displayMethod.id).toBe("termux-x11-external");
    // Samsung Auto Blocker warning surfaces
    expect(r.matchedIssueIds).toContain("samsung-auto-blocker-blocks-apk");
    // audio is not automatic
    expect(r.recommendation.audioMethod?.id).toBe("pulseaudio-forward");
    // browser recommendation is firefox, chromium explained
    expect(r.recommendation.browser?.id).toBe("firefox");
    expect(r.notRecommendedNotes.join(" ")).toMatch(/Chromium/);
  });

  // 2. High-end Samsung with monitor + hub + BT input
  it("2: S24 with powered hub gets wired external display", () => {
    const r = evaluate(
      base({ marketingName: "Galaxy S24", modelNumber: "SM-S921B", ramGb: 8, hasHubOrDock: "yes", hubHasPowerDelivery: "yes" }),
      CATALOG,
      ISSUES,
    );
    expect(r.recommendation.displayMethod.id).toBe("termux-x11-external");
    const hub = r.recommendation.peripherals.find((p) => p.id === "powered-hub");
    expect(hub?.warnings.length).toBe(0);
  });

  // 3. Pixel without wired output
  it("3: Pixel 6 wanting a monitor is NOT rejected — phone-screen path with explanation", () => {
    const r = evaluate(
      base({ manufacturer: "Google", marketingName: "Pixel 6", modelNumber: "GB7N6" }),
      CATALOG,
      ISSUES,
    );
    expect(r.overallStatus).not.toBe("blocked");
    expect(r.recommendation.displayMethod.id).toBe("termux-x11-phone");
    const wired = r.dimensions.find((d) => d.id === "wired-display");
    expect(wired?.status).toBe("compatible-with-limitations");
    expect(wired?.reason).toMatch(/Linux still runs/i);
  });

  // 4. Motorola with desktop mode
  it("4: Motorola Edge+ (2023) matches catalog with Ready For wired display", () => {
    const r = evaluate(
      base({ manufacturer: "Motorola", marketingName: "Motorola Edge+ (2023)", modelNumber: "XT2301" }),
      CATALOG,
      ISSUES,
    );
    expect(r.matchedDevice?.id).toBe("motorola-edge-plus-2023");
    expect(r.recommendation.displayMethod.id).toBe("termux-x11-external");
  });

  // 5. 4 GB midrange
  it("5: 4 GB midrange device gets a lightweight desktop with warnings", () => {
    const r = evaluate(
      base({ marketingName: "Galaxy A54 5G", modelNumber: "SM-A546B", ramGb: 4, displayTargets: ["phone-screen"] }),
      CATALOG,
      ISSUES,
    );
    expect(r.recommendation.desktop.id).toBe("lxqt");
    expect(r.recommendation.desktop.warnings.join(" ")).toMatch(/memory pressure|slowdown/i);
  });

  // 6. Low-memory CLI-only
  it("6: 2 GB device gets command-line recommendation", () => {
    const r = evaluate(base({ ramGb: 2, modelNumber: undefined, marketingName: "Generic Phone" }), CATALOG, ISSUES);
    expect(r.recommendation.desktop.id).toBe("cli-only");
    const mem = r.dimensions.find((d) => d.id === "memory");
    expect(mem?.status).toBe("cli-recommended");
  });

  // 7. 32-bit device
  it("7: 32-bit ARM device is steered to CLI with honest arch reason", () => {
    const r = evaluate(
      base({ cpuArchitecture: "arm32", modelNumber: undefined, marketingName: "Old Phone", ramGb: 3 }),
      CATALOG,
      ISSUES,
    );
    expect(r.recommendation.desktop.id).toBe("cli-only");
    expect(r.notRecommendedNotes.join(" ")).toMatch(/32-bit/);
  });

  // 8. Unknown device, manual specs
  it("8: unknown device gets spec-based result, never 'blocked' for absence", () => {
    const r = evaluate(
      base({ manufacturer: "Fairphone", marketingName: "Fairphone 5", modelNumber: "FP5", ramGb: 8 }),
      CATALOG,
      ISSUES,
    );
    expect(r.matchedDevice).toBeNull();
    expect(r.overallStatus).not.toBe("blocked");
    expect(r.confidence).toBe("inferred-from-specs");
    const ev = r.dimensions.find((d) => d.id === "evidence");
    expect(ev?.reason).toMatch(/does not mean it is incompatible/i);
  });

  // 9. Android below graphical minimum
  it("9: Android 7 device gets CLI path (Termux OK, Termux:X11 blocked)", () => {
    const r = evaluate(base({ androidVersion: 7, modelNumber: undefined, marketingName: "Old Phone" }), CATALOG, ISSUES);
    expect(r.recommendation.desktop.id).toBe("cli-only");
    const g = r.dimensions.find((d) => d.id === "graphical");
    expect(g?.status).toBe("unlikely-graphical");
  });

  // 10. Managed device
  it("10: employer-managed device is blocked with explanation", () => {
    const r = evaluate(base({ ownership: "employer" }), CATALOG, ISSUES);
    expect(r.overallStatus).toBe("blocked");
    expect(r.requiredWarnings.some((w) => w.text.match(/Managed devices/))).toBe(true);
  });

  // 11. Headless server goal
  it("11: local web server goal gets CLI recommendation, no desktop install", () => {
    const r = evaluate(base({ primaryObjective: "local-web-server" }), CATALOG, ISSUES);
    expect(r.recommendation.desktop.id).toBe("cli-only");
    const guide = generateGuide(r, base({ primaryObjective: "local-web-server" }));
    expect(guide.sections.find((s) => s.id === "install-desktop")).toBeUndefined();
    expect(guide.sections.find((s) => s.id === "browser")).toBeUndefined();
  });

  // 12. GNOME despite warnings
  it("12: manual GNOME selection is honored but marked experimental with warnings", () => {
    const r = evaluate(
      base({ recommendMode: "manual-both", manualDistro: "debian", manualDesktop: "gnome", experience: "experimental-ok", stableOnly: false }),
      CATALOG,
      ISSUES,
    );
    expect(r.recommendation.desktop.id).toBe("gnome");
    expect(r.recommendation.desktop.status).toBe("experimental");
    expect(r.recommendation.desktop.warnings.join(" ")).toMatch(/systemd|proot/i);
  });

  // 13. 4K monitor, no powered hub
  it("13: wired 4K display without PD hub warns about power", () => {
    const r = evaluate(
      base({ monitorResolution: "3840x2160", hasHubOrDock: "yes", hubHasPowerDelivery: "no" }),
      CATALOG,
      ISSUES,
    );
    const hub = r.recommendation.peripherals.find((p) => p.id === "powered-hub");
    expect(hub?.warnings.join(" ")).toMatch(/Power Delivery|drains/i);
  });

  // 14. HDMI audio
  it("14: HDMI audio request carries the routing caveat", () => {
    const r = evaluate(base({ audioTargets: ["hdmi-monitor"] }), CATALOG, ISSUES);
    expect(r.recommendation.audioMethod?.warnings.join(" ")).toMatch(/HDMI|routing/i);
  });

  // 15. No physical keyboard
  it("15: no keyboard produces input limitation + Bluetooth keyboard recommendation", () => {
    const r = evaluate(base({ keyboard: "none" }), CATALOG, ISSUES);
    const input = r.dimensions.find((d) => d.id === "input");
    expect(input?.status).toBe("compatible-with-limitations");
    expect(r.recommendation.peripherals.some((p) => p.id === "bluetooth-keyboard")).toBe(true);
  });

  // 16. Mismatched Termux source — issue exists and matches generically
  it("16: signature-mismatch issue record is available and matched", () => {
    const r = evaluate(base(), CATALOG, ISSUES);
    expect(ISSUES.some((i) => i.id === "termux-source-signature-mismatch")).toBe(true);
    expect(r.matchedIssueIds).toContain("termux-source-signature-mismatch");
  });

  // 17. Insufficient storage
  it("17: 3 GB free storage blocks the desktop path with actionable text", () => {
    const r = evaluate(base({ freeStorageGb: 3 }), CATALOG, ISSUES);
    expect(r.overallStatus).toBe("blocked");
    expect(r.requiredWarnings.some((w) => w.text.match(/free storage|Free up space/i))).toBe(true);
  });

  // 18. Malformed device report
  it("18: malformed and wrong-schema reports produce errors, valid ones map onto answers", () => {
    expect(parseDeviceReport("not json").error).toMatch(/not valid JSON/);
    expect(parseDeviceReport('{"foo": 1}').error).toMatch(/schemaVersion/);
    expect(parseDeviceReport('{"schemaVersion": 99}').error).toMatch(/newer schema/);
    const good = parseDeviceReport(
      JSON.stringify({
        schemaVersion: 1,
        manufacturer: "samsung",
        model: "SM-S906B",
        androidVersion: "14",
        primaryAbi: "arm64-v8a",
        ramTotalMb: 7723,
        termuxStorageFreeMb: 51200,
        unexpectedField: { nested: true },
      }),
    );
    expect(good.error).toBeNull();
    const mapped = reportToAnswers(good.report!, base({ ramGb: null, modelNumber: undefined }));
    expect(mapped.modelNumber).toBe("SM-S906B");
    expect(mapped.androidVersion).toBe(14);
    expect(mapped.cpuArchitecture).toBe("arm64");
    expect(mapped.ramGb).toBeCloseTo(7.5, 1);
    expect(mapped.freeStorageGb).toBe(50);
  });
});

describe("storage estimate", () => {
  it("adds workload storage and safety reserve", () => {
    const light = estimateStorageGb("debian", "xfce", base());
    const dev = estimateStorageGb("debian", "xfce", base({ primaryObjective: "software-development" }));
    expect(dev).toBeGreaterThan(light);
    expect(light).toBeGreaterThanOrEqual(6);
  });
  it("cli-only Alpine is small", () => {
    expect(estimateStorageGb("alpine", "cli-only", base({ primaryObjective: "headless-server" }))).toBeLessThan(6);
  });
});

describe("username sanitization", () => {
  it("accepts valid usernames", () => {
    expect(sanitizeUsername("androidlinux")).toBe("androidlinux");
    expect(sanitizeUsername("  Dev-User_1 ")).toBe("dev-user_1");
  });
  it("rejects dangerous or reserved input", () => {
    expect(sanitizeUsername("root")).toBeNull();
    expect(sanitizeUsername("bob; rm -rf /")).toBeNull();
    expect(sanitizeUsername("$(whoami)")).toBeNull();
    expect(sanitizeUsername("1abc")).toBeNull();
    expect(sanitizeUsername("")).toBeNull();
    expect(sanitizeUsername("a".repeat(40))).toBeNull();
  });
});

describe("guide generation", () => {
  const assessment = evaluate(base(), CATALOG, ISSUES);
  const guide = generateGuide(assessment, base(), { username: "tester" });

  it("labels every step with an execution environment", () => {
    for (const section of guide.sections) {
      for (const step of section.steps) {
        expect(step.environment).toBeTruthy();
        expect(step.purpose.length).toBeGreaterThan(10);
        expect(step.expected.length).toBeGreaterThan(0);
      }
    }
  });
  it("uses the sanitized username in commands", () => {
    const all = JSON.stringify(guide);
    expect(all).toContain("--user tester");
    expect(all).not.toContain("--user androidlinux");
  });
  it("falls back to the default username when input is invalid", () => {
    const g2 = generateGuide(assessment, base(), { username: "Bad;Name" });
    expect(JSON.stringify(g2)).toContain("--user androidlinux");
  });
  it("includes Samsung Auto Blocker steps (disable + re-enable) for Samsung devices", () => {
    const all = JSON.stringify(guide);
    expect(all).toMatch(/Auto Blocker/);
    expect(guide.sections.some((s) => s.steps.some((st) => st.id === "reenable-auto-blocker"))).toBe(true);
  });
  it("includes audio forwarding only when audio requested", () => {
    expect(guide.sections.some((s) => s.id === "audio")).toBe(true);
    const noAudio = generateGuide(evaluate(base({ audioTargets: ["not-required"] }), CATALOG, ISSUES), base({ audioTargets: ["not-required"] }));
    expect(noAudio.sections.some((s) => s.id === "audio")).toBe(false);
  });
  it("Ubuntu guide uses Mozilla apt repo; Debian guide uses firefox-esr", () => {
    const ub = generateGuide(
      evaluate(base({ recommendMode: "manual-both", manualDistro: "ubuntu", manualDesktop: "xfce" }), CATALOG, ISSUES),
      base(),
    );
    expect(JSON.stringify(ub)).toContain("packages.mozilla.org");
    const deb = generateGuide(
      evaluate(base({ recommendMode: "manual-both", manualDistro: "debian", manualDesktop: "xfce" }), CATALOG, ISSUES),
      base(),
    );
    expect(JSON.stringify(deb)).toContain("firefox-esr");
  });
  it("never emits --no-sandbox in any command", () => {
    for (const section of guide.sections) {
      for (const step of section.steps) {
        for (const cmd of step.commands ?? []) {
          expect(cmd).not.toContain("--no-sandbox");
        }
      }
    }
  });
});

describe("export / import round-trip", () => {
  it("round-trips answers and rejects foreign or newer files", () => {
    const answers = base({ marketingName: "Round Trip" });
    const json = exportPlan(answers, null);
    const back = importPlan(json);
    expect(back.error).toBeNull();
    expect(back.answers?.marketingName).toBe("Round Trip");
    expect(importPlan('{"format":"other"}').error).toMatch(/not an ADL/);
    expect(importPlan('{"format":"adl-assessment","exportVersion":99,"answers":{}}').error).toMatch(/newer version/);
    expect(importPlan("garbage").error).toMatch(/JSON/);
  });
});
