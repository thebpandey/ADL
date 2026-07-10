import React, { useState } from "react";
import styles from "./styles.module.css";

interface ChecklistItem {
  label: string;
  done?: boolean;
}

interface ProgressChecklistProps {
  title?: string;
  items?: ChecklistItem[];
}

/**
 * Interactive progress checklist: readers can tick tasks off as they work
 * (state is local to the page visit). Fully keyboard accessible via native
 * checkboxes.
 */
export default function ProgressChecklist({ title = "Progress", items = [] }: ProgressChecklistProps) {
  const [checked, setChecked] = useState(() => items.map((i) => Boolean(i.done)));
  const completed = checked.filter(Boolean).length;
  const pct = items.length ? Math.round((completed / items.length) * 100) : 0;

  const toggle = (idx: number) =>
    setChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)));

  return (
    <div className={`adl-progress-checklist ${styles.panel}`}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.count}>
          {completed}/{items.length} ({pct}%)
        </span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${title}: ${pct}% complete`}
      >
        <div className={styles.bar} style={{ width: `${pct}%` }} />
      </div>
      <ul className={styles.list}>
        {items.map(({ label }, i) => (
          <li key={label}>
            <label className={checked[i] ? `${styles.item} ${styles.done}` : styles.item}>
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => toggle(i)}
                className={styles.checkbox}
              />
              <span>{label}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
