import React from "react";
import styles from "./styles.module.css";

interface PageHealthProps {
  lastVerified?: string | null;
  status?: string | null;
  /** Injected at render time from the doc metadata (falls back to lastVerified). */
  lastUpdated?: string | null;
}

const FRESH_DAYS = 240;

/**
 * Health pill computed from metadata: Verified (recently checked),
 * Needs Review (stale), Community Updated, or Deprecated.
 */
export default function PageHealth({ lastVerified, status, lastUpdated }: PageHealthProps) {
  let kind: "verified" | "review" | "community" | "deprecated" | null = null;
  let label = "";

  if (status === "deprecated") {
    kind = "deprecated";
    label = "Deprecated";
  } else if (status === "community") {
    kind = "community";
    label = "Community Updated";
  } else if (lastVerified) {
    const age = (Date.now() - new Date(lastVerified).getTime()) / 86_400_000;
    if (Number.isFinite(age) && age <= FRESH_DAYS) {
      kind = "verified";
      label = `Verified ${lastVerified}`;
    } else {
      kind = "review";
      label = `Needs review — last verified ${lastVerified}`;
    }
  }

  if (!kind && !lastUpdated) return null;

  return (
    <span className={styles.row}>
      {kind && <span className={`${styles.pill} ${styles[kind]}`}>{label}</span>}
      {lastUpdated && <span className={styles.updated}>Last updated {lastUpdated}</span>}
    </span>
  );
}
