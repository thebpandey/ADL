import React from "react";
import styles from "./styles.module.css";

interface PageMetaProps {
  difficulty?: string;
  estimatedTime?: string;
  lastTested?: string;
  device?: string;
}

/** Compact metadata strip shown under a page title. */
export default function PageMeta({ difficulty, estimatedTime, lastTested, device }: PageMetaProps) {
  const entries = [
    difficulty && { icon: "🎚️", label: "Difficulty", value: difficulty },
    estimatedTime && { icon: "⏱️", label: "Time", value: estimatedTime },
    device && { icon: "📱", label: "Tested on", value: device },
    lastTested && { icon: "📅", label: "Last tested", value: lastTested },
  ].filter(Boolean) as { icon: string; label: string; value: string }[];

  if (entries.length === 0) return null;

  return (
    <dl className={styles.meta} aria-label="Page information">
      {entries.map((e) => (
        <div key={e.label} className={styles.entry}>
          <dt className={styles.label}>
            <span aria-hidden="true">{e.icon}</span> {e.label}
          </dt>
          <dd className={styles.value}>{e.value}</dd>
        </div>
      ))}
    </dl>
  );
}
