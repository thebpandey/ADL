import React from "react";
import styles from "./styles.module.css";

interface DownloadCardProps {
  name: string;
  description: string;
  url: string;
  version?: string;
  size?: string;
  icon?: string;
}

/** Card linking to an official download source. */
export default function DownloadCard({ name, description, url, version, size, icon = "📥" }: DownloadCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={styles.card}>
      <span aria-hidden="true" className={styles.icon}>{icon}</span>
      <span className={styles.main}>
        <span className={styles.titleRow}>
          <span className={styles.name}>{name}</span>
          {version && <span className={styles.version}>{version}</span>}
        </span>
        <span className={styles.description}>{description}</span>
      </span>
      {size && <span className={styles.size}>{size}</span>}
    </a>
  );
}
