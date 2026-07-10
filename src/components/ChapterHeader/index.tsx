import React from "react";
import styles from "./styles.module.css";

interface ChapterHeaderProps {
  /** Small kicker above the title, e.g. "Part 2" or "Quick Start". */
  kicker?: string;
  title: string;
  description?: string;
}

/** Section opener with kicker, title, and short description. */
export default function ChapterHeader({ kicker, title, description }: ChapterHeaderProps) {
  return (
    <header className={styles.header}>
      {kicker && <p className={styles.kicker}>{kicker}</p>}
      <p className={styles.title} role="heading" aria-level={2}>
        {title}
      </p>
      {description && <p className={styles.description}>{description}</p>}
      <div aria-hidden="true" className={styles.rule} />
    </header>
  );
}
