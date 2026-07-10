import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

interface Lesson {
  title: string;
  permalink: string;
}

interface LearningPathNavProps {
  previous?: Lesson | null;
  current: Lesson;
  next?: Lesson | null;
}

/** Previous ◂ current ▸ next lesson strip, driven by frontmatter learning paths. */
export default function LearningPathNav({ previous, current, next }: LearningPathNavProps) {
  if (!previous && !next) return null;
  return (
    <nav className={styles.path} aria-label="Learning path">
      <div className={styles.slot}>
        {previous && (
          <Link to={previous.permalink} className={styles.link}>
            <span className={styles.dir}>← Previous lesson</span>
            <span className={styles.title}>{previous.title}</span>
          </Link>
        )}
      </div>
      <div className={`${styles.slot} ${styles.current}`} aria-current="page">
        <span className={styles.dir}>You are here</span>
        <span className={styles.title}>{current.title}</span>
      </div>
      <div className={`${styles.slot} ${styles.right}`}>
        {next && (
          <Link to={next.permalink} className={styles.link}>
            <span className={styles.dir}>Next lesson →</span>
            <span className={styles.title}>{next.title}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
