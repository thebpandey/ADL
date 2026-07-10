import React from "react";
import styles from "./styles.module.css";

interface TroubleshootingCardProps {
  problem: string;
  /** Concrete recovery steps. Accepts a string or rich children. */
  solution?: string;
  children?: React.ReactNode;
}

/**
 * One problem/solution pair as a collapsible card. Uses a native
 * <details> element, so it is keyboard accessible by default.
 */
export default function TroubleshootingCard({ problem, solution, children }: TroubleshootingCardProps) {
  return (
    <details className={styles.card}>
      <summary className={styles.problem}>
        <span aria-hidden="true" className={styles.icon}>🔧</span>
        <span>{problem}</span>
      </summary>
      <div className={styles.solution}>{solution ?? children}</div>
    </details>
  );
}
