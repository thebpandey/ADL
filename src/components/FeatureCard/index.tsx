import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

interface FeatureCardProps {
  icon?: string;
  title: string;
  description?: string;
  to?: string;
  children?: React.ReactNode;
}

/** One feature card: icon, title, description. Links when `to` is set. */
export default function FeatureCard({ icon, title, description, to, children }: FeatureCardProps) {
  const body = (
    <>
      {icon && (
        <div aria-hidden="true" className={styles.icon}>
          {icon}
        </div>
      )}
      <div className={styles.title}>{title}</div>
      {(description || children) && <div className={styles.description}>{description ?? children}</div>}
    </>
  );
  return to ? (
    <Link to={to} className={`${styles.card} ${styles.linked}`}>
      {body}
    </Link>
  ) : (
    <div className={styles.card}>{body}</div>
  );
}

interface FeatureGridProps {
  /** Preferred column count on wide screens (2-4). Collapses responsively. */
  columns?: 2 | 3 | 4;
  children: React.ReactNode;
}

/** Responsive 2-4 column grid of FeatureCards. */
export function FeatureGrid({ columns = 3, children }: FeatureGridProps) {
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
