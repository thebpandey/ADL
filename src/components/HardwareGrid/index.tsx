import React from "react";
import styles from "./styles.module.css";

interface HardwareItem {
  icon?: string;
  name: string;
  description?: string;
  optional?: boolean;
  badge?: string;
}

interface HardwareGridProps {
  items?: HardwareItem[];
}

/** Responsive grid of hardware items with optional/required markers. */
export default function HardwareGrid({ items = [] }: HardwareGridProps) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <div key={item.name} className={styles.card}>
          <div className={styles.header}>
            {item.icon && (
              <span aria-hidden="true" className={styles.icon}>
                {item.icon}
              </span>
            )}
            <span className={styles.name}>{item.name}</span>
            {(item.badge || item.optional) && (
              <span className={item.optional ? styles.optional : styles.badge}>
                {item.badge ?? "Optional"}
              </span>
            )}
          </div>
          {item.description && <p className={styles.description}>{item.description}</p>}
        </div>
      ))}
    </div>
  );
}
