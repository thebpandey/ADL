import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

interface DownloadHubItem {
  application: string;
  version?: string;
  description?: string;
  /** Official download URL only — no unofficial mirrors. */
  officialDownload: string;
  /** Internal docs page covering installation. */
  installationPage?: string;
  icon?: string;
}

interface DownloadHubProps {
  items?: DownloadHubItem[];
}

/** Grid of official downloads, each paired with its installation guide. */
export default function DownloadHub({ items = [] }: DownloadHubProps) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <div key={item.application} className={styles.card}>
          <div className={styles.header}>
            <span aria-hidden="true" className={styles.icon}>
              {item.icon ?? "📥"}
            </span>
            <span className={styles.name}>{item.application}</span>
            {item.version && <span className={styles.version}>{item.version}</span>}
          </div>
          {item.description && <p className={styles.description}>{item.description}</p>}
          <div className={styles.actions}>
            <a
              href={item.officialDownload}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primary}
            >
              Official download ↗
            </a>
            {item.installationPage && (
              <Link to={item.installationPage} className={styles.secondary}>
                Install guide →
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
