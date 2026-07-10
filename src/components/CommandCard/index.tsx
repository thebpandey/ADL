import React from "react";
import CodeBlock from "@theme/CodeBlock";
import styles from "./styles.module.css";

interface CommandCardProps {
  title: string;
  command: string;
  /** Why the reader is running this command. */
  purpose?: string;
  /** What the reader should see when it works. */
  expectedResult?: string;
  /** Prism language for highlighting. Defaults to bash. */
  language?: string;
}

/**
 * A single documented command: title, purpose, the command itself with
 * syntax highlighting and a copy button (via Docusaurus CodeBlock), and
 * the expected result.
 */
export default function CommandCard({
  title,
  command,
  purpose,
  expectedResult,
  language = "bash",
}: CommandCardProps) {
  return (
    <section className={styles.card} aria-label={`Command: ${title}`}>
      <div className={styles.header}>
        <span aria-hidden="true">▸</span>
        <span className={styles.title}>{title}</span>
      </div>
      {purpose && <p className={styles.purpose}>{purpose}</p>}
      <div className={styles.code}>
        <CodeBlock language={language}>{command}</CodeBlock>
      </div>
      {expectedResult && (
        <div className={styles.expected} role="note" aria-label="Expected result">
          <span className={styles.expectedLabel} aria-hidden="true">🎯 Expected:</span>{" "}
          {expectedResult}
        </div>
      )}
    </section>
  );
}
