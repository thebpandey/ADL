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
  /** Failure modes readers actually hit. */
  commonErrors?: string[];
  /** How to get unstuck when it fails. */
  recoveryTips?: string[];
  /** Where the command runs, e.g. "Termux", "Ubuntu", "Android". */
  os?: string;
  /** Show the hand-drawn terminal icon. Defaults to true. */
  terminalIcon?: boolean;
  /** Prism language for highlighting. Defaults to bash. */
  language?: string;
}

/**
 * A fully documented command: title, purpose, syntax-highlighted command
 * with copy button + copied confirmation (Docusaurus CodeBlock), expected
 * output, common errors, recovery tips, and an OS badge.
 */
export default function CommandCard({
  title,
  command,
  purpose,
  expectedResult,
  commonErrors = [],
  recoveryTips = [],
  os,
  terminalIcon = true,
  language = "bash",
}: CommandCardProps) {
  return (
    <section className={styles.card} aria-label={`Command: ${title}`}>
      <div className={styles.header}>
        {terminalIcon && (
          <img
            src={require("@site/static/img/ui/icons/terminal.svg").default}
            alt=""
            aria-hidden="true"
            className={styles.termIcon}
            loading="lazy"
          />
        )}
        <span className={styles.title}>{title}</span>
        {os && <span className={styles.os}>{os}</span>}
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
      {commonErrors.length > 0 && (
        <details className={styles.errors}>
          <summary className={styles.errorsSummary}>
            <span aria-hidden="true">⚠️</span> Common errors &amp; recovery
          </summary>
          <ul className={styles.errorList}>
            {commonErrors.map((err, i) => (
              <li key={i}>
                <span className={styles.errorText}>{err}</span>
                {recoveryTips[i] && <span className={styles.recovery}> → {recoveryTips[i]}</span>}
              </li>
            ))}
            {recoveryTips.slice(commonErrors.length).map((tip, i) => (
              <li key={`tip-${i}`}>
                <span className={styles.recovery}>→ {tip}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
