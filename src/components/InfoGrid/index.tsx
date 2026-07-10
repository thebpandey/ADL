import React from "react";
import styles from "./styles.module.css";

interface InfoGridProps {
  /** Preferred column count on wide screens (2-4). Collapses responsively. */
  columns?: 2 | 3 | 4;
  children: React.ReactNode;
}

/** Generic responsive grid wrapper for cards and small content blocks. */
export default function InfoGrid({ columns = 3, children }: InfoGridProps) {
  const min = { 2: "300px", 3: "220px", 4: "180px" }[columns] ?? "220px";
  return (
    <div
      className={styles.grid}
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}, 100%), 1fr))` }}
    >
      {children}
    </div>
  );
}
