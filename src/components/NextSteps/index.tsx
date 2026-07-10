import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

interface NextStep {
  title: string;
  description?: string;
  to: string;
}

interface NextStepsProps {
  title?: string;
  items?: NextStep[];
}

/** End-of-page cards linking to the documentation pages that follow. */
export default function NextSteps({ title = "Next steps", items = [] }: NextStepsProps) {
  return (
    <nav aria-label={title} className={styles.section}>
      <div className={styles.heading}>
        <span aria-hidden="true">👉</span>
        <span>{title}</span>
      </div>
      <div className={styles.grid}>
        {items.map((item) => (
          <Link key={item.to} to={item.to} className={styles.card}>
            <span className={styles.title}>{item.title}</span>
            {item.description && <span className={styles.description}>{item.description}</span>}
            <span aria-hidden="true" className={styles.arrow}>→</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
