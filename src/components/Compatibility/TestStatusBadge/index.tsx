import React from "react";
import type { SupportLevel, VerificationLevel } from "@site/src/types/compatibility";
import styles from "./styles.module.css";

const SUPPORT: Record<SupportLevel, { icon: string; label: string; cls: string }> = {
  "fully-supported": { icon: "✔", label: "Fully Supported", cls: styles.full },
  supported: { icon: "✔", label: "Supported", cls: styles.ok },
  partial: { icon: "◐", label: "Partial Support", cls: styles.partial },
  experimental: { icon: "⚗", label: "Experimental", cls: styles.experimental },
  broken: { icon: "✖", label: "Broken", cls: styles.broken },
  untested: { icon: "?", label: "Untested", cls: styles.untested },
};

const VERIFICATION: Record<VerificationLevel, { icon: string; label: string; cls: string }> = {
  "maintainer-verified": { icon: "★", label: "Maintainer Verified", cls: styles.full },
  "community-verified": { icon: "☆", label: "Community Verified", cls: styles.ok },
  experimental: { icon: "⚗", label: "Experimental", cls: styles.experimental },
  "needs-testing": { icon: "?", label: "Needs Testing", cls: styles.untested },
  deprecated: { icon: "✖", label: "Deprecated", cls: styles.broken },
};

interface TestStatusBadgeProps {
  /** A support level (Part 11) or a verification level (Part 9). */
  status: SupportLevel | VerificationLevel;
  /** Compact icon-only rendering for dense tables. */
  compact?: boolean;
  label?: string;
}

/** Automatic status badge for support and verification levels. */
export default function TestStatusBadge({ status, compact = false, label }: TestStatusBadgeProps) {
  const c =
    (SUPPORT as Record<string, { icon: string; label: string; cls: string }>)[status] ??
    (VERIFICATION as Record<string, { icon: string; label: string; cls: string }>)[status] ??
    SUPPORT.untested;
  const text = label ?? c.label;
  if (compact) {
    return (
      <span className={`${styles.compact} ${c.cls}`} title={text} aria-label={text}>
        {c.icon}
      </span>
    );
  }
  return (
    <span className={`${styles.badge} ${c.cls}`}>
      <span aria-hidden="true">{c.icon}</span>
      <span>{text}</span>
    </span>
  );
}
