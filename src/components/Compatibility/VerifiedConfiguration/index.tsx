import React from "react";
import { configById } from "../data";
import TestStatusBadge from "../TestStatusBadge";
import { VersionCard } from "../cards";
import styles from "./styles.module.css";

/**
 * Part 5 — reusable verified-configuration page layout, rendered entirely
 * from data/verified-configurations.json.
 */
export default function VerifiedConfiguration({ id }: { id: string }) {
  const c = configById(id);
  if (!c) return null;
  const rows: [string, string | undefined][] = [
    ["Android version", c.androidVersion],
    ["Desktop mode", c.desktopMode],
    ["Linux distribution", c.linuxDistribution],
    ["Desktop environment", c.desktopEnvironment],
    ["Dock", c.dock],
    ["Monitor", c.monitor],
    ["Keyboard", c.keyboard],
    ["Mouse", c.mouse],
    ["SSD", c.ssd],
    ["Date tested", c.dateTested],
    ["Verified by", c.verifiedBy],
  ];
  return (
    <div>
      <div className={styles.badges}>
        <TestStatusBadge status={c.verification} />
      </div>
      <div className={styles.card}>
        <dl className={styles.facts}>
          {rows
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k} className={styles.fact}>
                <dt className={styles.factLabel}>{k}</dt>
                <dd className={styles.factValue}>{v}</dd>
              </div>
            ))}
        </dl>
      </div>
      <section className={styles.section} aria-label="Performance notes">
        <h3 className={styles.heading}>Performance notes</h3>
        <ul className={styles.list}>
          {c.performanceNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>
      <section className={styles.section} aria-label="Known issues and workarounds">
        <h3 className={styles.heading}>Known issues &amp; workarounds</h3>
        <ul className={styles.list}>
          {c.knownIssues.map((issue, i) => (
            <li key={issue}>
              <strong>{issue}</strong>
              {c.workarounds[i] && <span className={styles.workaround}> — {c.workarounds[i]}</span>}
            </li>
          ))}
        </ul>
      </section>
      <VersionCard version={c.version} title="Versions verified" />
    </div>
  );
}
