import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

interface ChecklistItem {
  label: string;
  done?: boolean;
}

interface ProgressChecklistProps {
  title?: string;
  items?: ChecklistItem[];
  /**
   * When set, progress persists in the browser's localStorage under
   * `adl-checklist:<storageKey>` and survives page reloads. A Reset
   * button appears once anything is ticked.
   */
  storageKey?: string;
}

/**
 * Interactive progress checklist. Readers tick tasks off with mouse or
 * keyboard; with a storageKey, progress persists locally (offline, no
 * external services) and can be reset. Gracefully degrades: without
 * JavaScript the static list still renders.
 */
export default function ProgressChecklist({ title = "Progress", items = [], storageKey }: ProgressChecklistProps) {
  const defaults = items.map((i) => Boolean(i.done));
  const [checked, setChecked] = useState<boolean[]>(defaults);
  const lsKey = storageKey ? `adl-checklist:${storageKey}` : null;

  useEffect(() => {
    if (!lsKey) return;
    try {
      const saved = window.localStorage.getItem(lsKey);
      if (saved) {
        const parsed = JSON.parse(saved) as boolean[];
        if (Array.isArray(parsed) && parsed.length === items.length) setChecked(parsed);
      }
    } catch {
      /* private mode or storage disabled — degrade to in-memory state */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lsKey]);

  const persist = (next: boolean[]) => {
    setChecked(next);
    if (lsKey) {
      try {
        window.localStorage.setItem(lsKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    }
  };

  const toggle = (idx: number) => persist(checked.map((v, i) => (i === idx ? !v : v)));
  const reset = () => {
    persist(defaults.map(() => false));
    if (lsKey) {
      try {
        window.localStorage.removeItem(lsKey);
      } catch {
        /* ignore */
      }
    }
  };

  const completed = checked.filter(Boolean).length;
  const pct = items.length ? Math.round((completed / items.length) * 100) : 0;

  return (
    <div className={`adl-progress-checklist ${styles.panel}`}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.count}>
          {completed}/{items.length} ({pct}%)
          {completed > 0 && (
            <button type="button" onClick={reset} className={styles.reset}>
              Reset
            </button>
          )}
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
