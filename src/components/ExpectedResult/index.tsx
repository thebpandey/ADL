import React from "react";
import styles from "./styles.module.css";

interface ExpectedResultProps {
  title?: string;
  children: React.ReactNode;
}

/** Green "what success looks like" panel shown after commands and steps. */
export default function ExpectedResult({ title = "Expected Result", children }: ExpectedResultProps) {
  return (
    <div role="note" aria-label={title} className={`adl-expected-result ${styles.panel}`}>
      <div className={styles.header}>
        <span aria-hidden="true">🎯</span>
        <span>{title}</span>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
