import React from "react";
import Link from "@docusaurus/Link";
import type { Device, HardwareItem, VersionInfo, SupportLevel } from "@site/src/types/compatibility";
import { devices, deviceById, hardwareById } from "./data";
import TestStatusBadge from "./TestStatusBadge";
import styles from "./cards.module.css";

const DESKTOP_MODE_LABEL: Record<Device["desktopMode"], string> = {
  "samsung-dex": "Samsung DeX",
  "android-desktop-mode": "Android desktop mode",
  none: "None",
  unknown: "Unknown",
};

/** Part 3 — DeviceCard: one Android device from data/devices.json. */
export function DeviceCard({ id }: { id: string }) {
  const d = deviceById(id);
  if (!d) return null;
  return (
    <div className={styles.card}>
      <span className={styles.kicker}>{d.manufacturer}</span>
      <div className={styles.header}>
        <span className={styles.title}>{d.name}</span>
        <TestStatusBadge status={d.status} />
        <TestStatusBadge status={d.verification} />
      </div>
      <dl className={styles.facts}>
        <div className={styles.fact}><dt className={styles.factLabel}>Chipset</dt><dd className={styles.factValue}>{d.chipset}</dd></div>
        <div className={styles.fact}><dt className={styles.factLabel}>RAM</dt><dd className={styles.factValue}>{d.ramGb.join(" / ")} GB</dd></div>
        <div className={styles.fact}><dt className={styles.factLabel}>Desktop mode</dt><dd className={styles.factValue}>{DESKTOP_MODE_LABEL[d.desktopMode]}</dd></div>
        <div className={styles.fact}><dt className={styles.factLabel}>Android</dt><dd className={styles.factValue}>{d.androidVersions.join(", ")}</dd></div>
      </dl>
      {d.notes && <p className={styles.notes}>{d.notes}</p>}
      {d.verifiedConfiguration && (
        <p className={styles.notes}>
          <Link className={styles.link} to={d.verifiedConfiguration}>
            View verified configuration →
          </Link>
        </p>
      )}
    </div>
  );
}

/** Part 3 — grid of all (or selected) devices. */
export function DeviceCardGrid({ ids }: { ids?: string[] }) {
  const items = ids ? devices.filter((d) => ids.includes(d.id)) : devices;
  return (
    <div className={styles.grid}>
      {items.map((d) => (
        <DeviceCard key={d.id} id={d.id} />
      ))}
    </div>
  );
}

/** Part 3/6 — HardwareEntryCard: one item from data/hardware.json. */
export function HardwareEntryCard({ id }: { id: string }) {
  const h = hardwareById(id);
  if (!h) return null;
  return (
    <div className={styles.card}>
      <span className={styles.kicker}>{h.category.replace(/-/g, " ")}</span>
      <div className={styles.header}>
        <span className={styles.title}>{h.name}</span>
        <TestStatusBadge status={h.status} />
        <TestStatusBadge status={h.verification} />
      </div>
      <p className={styles.notes}>{h.description}</p>
      <ul className={styles.list}>
        {h.keySpecs.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      {h.notes && <p className={styles.notes}>{h.notes}</p>}
    </div>
  );
}

/** Part 3 — CompatibilityCard: one labeled capability with a status. */
export function CompatibilityCard({
  label,
  status,
  detail,
}: {
  label: string;
  status: SupportLevel;
  detail?: string;
}) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{label}</span>
        <TestStatusBadge status={status} />
      </div>
      {detail && <p className={styles.notes}>{detail}</p>}
    </div>
  );
}

/** Part 3/10 — VersionCard: version-tracking block for any verified claim. */
export function VersionCard({ version, title = "Version information" }: { version: VersionInfo; title?: string }) {
  const rows = [
    ["Android version", version.androidVersion],
    ["Linux version", version.linuxVersion],
    ["Desktop version", version.desktopVersion],
    ["Documentation version", version.documentationVersion],
    ["Verification date", version.verificationDate],
  ].filter(([, v]) => v) as [string, string][];
  if (rows.length === 0) return null;
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
      </div>
      <dl className={styles.facts}>
        {rows.map(([k, v]) => (
          <div key={k} className={styles.fact}>
            <dt className={styles.factLabel}>{k}</dt>
            <dd className={styles.factValue}>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Part 3 — HardwareRequirements: named hardware items for a configuration. */
export function HardwareRequirements({ ids, title = "Hardware used" }: { ids: string[]; title?: string }) {
  const items = ids.map((id) => hardwareById(id)).filter(Boolean) as HardwareItem[];
  if (items.length === 0) return null;
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
      </div>
      <ul className={styles.list}>
        {items.map((h) => (
          <li key={h.id}>
            <strong>{h.name}</strong> — {h.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
