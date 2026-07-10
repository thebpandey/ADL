import React from "react";
import CodeBlock from "@theme/CodeBlock";
import { androidVersions, deById, distroById } from "./data";
import TestStatusBadge from "./TestStatusBadge";
import styles from "./cards.module.css";

/** Part 7 — reusable MDX template body for a Linux distribution page. */
export function DistroProfile({ id }: { id: string }) {
  const d = distroById(id);
  if (!d) return null;
  return (
    <div>
      <div className={styles.header}>
        <TestStatusBadge status={d.status} />
        <TestStatusBadge status={d.verification} />
      </div>
      <p>{d.summary}</p>
      <h2>Installation</h2>
      <CodeBlock language="bash">{d.installCommand}</CodeBlock>
      <h2>Performance</h2>
      <p>{d.performance}</p>
      <h2>Memory usage</h2>
      <p>{d.memoryUsageMb} MB (typical, on the reference setup)</p>
      <h2>Advantages</h2>
      <ul>{d.advantages.map((a) => <li key={a}>{a}</li>)}</ul>
      <h2>Disadvantages</h2>
      <ul>{d.disadvantages.map((a) => <li key={a}>{a}</li>)}</ul>
      <h2>Known issues</h2>
      <ul>{d.knownIssues.map((a) => <li key={a}>{a}</li>)}</ul>
    </div>
  );
}

/** Part 8 — reusable MDX template body for a desktop environment page. */
export function DesktopEnvProfile({ id }: { id: string }) {
  const d = deById(id);
  if (!d) return null;
  return (
    <div>
      <div className={styles.header}>
        <TestStatusBadge status={d.status} />
        <TestStatusBadge status={d.verification} />
      </div>
      <p>{d.summary}</p>
      <div className={styles.card}>
        <dl className={styles.facts}>
          <div className={styles.fact}><dt className={styles.factLabel}>Performance</dt><dd className={styles.factValue}><TestStatusBadge status={d.performance} /></dd></div>
          <div className={styles.fact}><dt className={styles.factLabel}>Memory</dt><dd className={styles.factValue}>{d.memoryUsageMb} MB</dd></div>
          <div className={styles.fact}><dt className={styles.factLabel}>Responsiveness</dt><dd className={styles.factValue}>{d.responsiveness}</dd></div>
          <div className={styles.fact}><dt className={styles.factLabel}>Touch friendliness</dt><dd className={styles.factValue}>{d.touchFriendliness}</dd></div>
          <div className={styles.fact}><dt className={styles.factLabel}>Recommended devices</dt><dd className={styles.factValue}>{d.recommendedDevices}</dd></div>
        </dl>
      </div>
      <h2>Installation</h2>
      <CodeBlock language="bash">{d.installCommand}</CodeBlock>
      <h2>Advantages</h2>
      <ul>{d.advantages.map((a) => <li key={a}>{a}</li>)}</ul>
      <h2>Disadvantages</h2>
      <ul>{d.disadvantages.map((a) => <li key={a}>{a}</li>)}</ul>
    </div>
  );
}

/** Android version support table from data/android-versions.json. */
export function AndroidVersionList() {
  return (
    <div>
      {androidVersions.map((v) => (
        <div key={v.version} className={styles.card}>
          <div className={styles.header}>
            <span className={styles.title}>{v.name ?? `Android ${v.version}`}</span>
            <TestStatusBadge status={v.status} />
          </div>
          <p className={styles.notes}>{v.notes}</p>
        </div>
      ))}
    </div>
  );
}
