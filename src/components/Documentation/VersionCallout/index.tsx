import React from "react";
import styles from "./styles.module.css";

type VersionStatus = "verified" | "updated" | "deprecated" | "experimental" | "community";

interface VersionCalloutProps {
  status: VersionStatus;
  /** e.g. a date, version number, or short context line. */
  detail?: string;
  children?: React.ReactNode;
}

const config: Record<VersionStatus, { icon: string; label: string; className: string }> = {
  verified: { icon: "✅", label: "Verified", className: styles.verified },
  updated: { icon: "🆕", label: "Updated", className: styles.updated },
  deprecated: { icon: "🗑️", label: "Deprecated", className: styles.deprecated },
  experimental: { icon: "🧪", label: "Experimental", className: styles.experimental },
  community: { icon: "🤝", label: "Community Tested", className: styles.community },
};

/** Reusable version/status notice: verified, updated, deprecated, experimental, community. */
export default function VersionCallout({ status, detail, children }: VersionCalloutProps) {
  const c = config[status] ?? config.verified;
  return (
    <aside role="note" aria-label={c.label} className={`${styles.callout} ${c.className}`}>
      <span aria-hidden="true">{c.icon}</span>
      <strong className={styles.label}>{c.label}</strong>
      {detail && <span className={styles.detail}>{detail}</span>}
      {children && <span className={styles.body}>{children}</span>}
    </aside>
  );
}
