import React from "react";
import styles from "./styles.module.css";

interface VerificationBannerProps {
  device?: string;
  androidVersion?: string;
  verifiedDate?: string;
  documentationVersion?: string;
}

/** "Verified on" banner: device, Android version, doc version, and date. */
export default function VerificationBanner({
  device,
  androidVersion,
  verifiedDate,
  documentationVersion,
}: VerificationBannerProps) {
  if (!device && !androidVersion && !verifiedDate) return null;
  return (
    <aside className={styles.banner} aria-label="Verification details">
      <span className={styles.check} aria-hidden="true">
        ✓
      </span>
      <span className={styles.label}>Verified on</span>
      <span className={styles.facts}>
        {device && <strong>{device}</strong>}
        {androidVersion && <span>{androidVersion}</span>}
        {verifiedDate && <span>{verifiedDate}</span>}
        {documentationVersion && <span className={styles.version}>docs {documentationVersion}</span>}
      </span>
    </aside>
  );
}
