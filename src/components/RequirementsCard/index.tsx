import React from "react";
import styles from "./styles.module.css";

interface RequirementsCardProps {
  difficulty?: "Beginner" | "Intermediate" | "Advanced" | string;
  estimatedTime?: string;
  requiredHardware?: string[];
  requiredSoftware?: string[];
  estimatedDownload?: string;
}

/** "Before you start" panel: difficulty, time, hardware, software, download size. */
export default function RequirementsCard({
  difficulty,
  estimatedTime,
  requiredHardware = [],
  requiredSoftware = [],
  estimatedDownload,
}: RequirementsCardProps) {
  const facts = [
    difficulty && { icon: "🎚️", label: "Difficulty", value: difficulty },
    estimatedTime && { icon: "⏱️", label: "Time", value: estimatedTime },
    estimatedDownload && { icon: "📶", label: "Download", value: estimatedDownload },
  ].filter(Boolean) as { icon: string; label: string; value: string }[];

  return (
    <section className={styles.card} aria-label="Requirements">
      <div className={styles.header}>
        <span aria-hidden="true">📋</span>
        <span>Before you start</span>
      </div>
      {facts.length > 0 && (
        <dl className={styles.facts}>
          {facts.map((f) => (
            <div key={f.label} className={styles.fact}>
              <dt className={styles.factLabel}>
                <span aria-hidden="true">{f.icon}</span> {f.label}
              </dt>
              <dd className={styles.factValue}>{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className={styles.lists}>
        {requiredHardware.length > 0 && (
          <div>
            <div className={styles.listTitle}>Hardware</div>
            <ul className={styles.list}>
              {requiredHardware.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {requiredSoftware.length > 0 && (
          <div>
            <div className={styles.listTitle}>Software</div>
            <ul className={styles.list}>
              {requiredSoftware.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
