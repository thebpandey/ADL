/**
 * Guided installer — personalized guide renderer with progress tracking.
 */
import React, { useEffect, useState } from "react";
import Link from "@docusaurus/Link";
import type { GuidePlan, GuideStep } from "@site/src/lib/guide/generator";
import { loadProgress, saveProgress } from "@site/src/lib/wizard/storage";
import styles from "./styles.module.css";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={styles.btnLink}
      aria-label="Copy command to clipboard"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        });
      }}
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

function StepView({
  step,
  done,
  onToggle,
}: {
  step: GuideStep;
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`${styles.step} ${done ? styles.stepDone : ""}`}>
      <div className={styles.stepHeader}>
        <input
          type="checkbox"
          checked={done}
          onChange={onToggle}
          aria-label={`Mark step complete: ${step.title}`}
        />
        <div>
          <span className={styles.stepName}>
            {step.title}
            {step.optional && " (optional)"}
          </span>
          <span className={styles.envBadge}>{step.environment}</span>
        </div>
      </div>
      <div className={styles.stepBody}>
        <p style={{ margin: "0 0 0.4rem" }}>{step.purpose}</p>
        {step.actions?.map((a) => (
          <p key={a} style={{ margin: "0.2rem 0" }}>
            • {a}
          </p>
        ))}
        {step.commands?.map((c) => (
          <div key={c}>
            <div className={styles.cmdBlock}>{c}</div>
            <CopyButton text={c} />
          </div>
        ))}
        {step.expected && step.expected !== "—" && (
          <p className={styles.stepMeta}>
            <strong>Expected:</strong> {step.expected}
          </p>
        )}
        {step.verify && (
          <p className={styles.stepMeta}>
            <strong>Verify:</strong> <code>{step.verify}</code>
          </p>
        )}
        {step.failures && step.failures.length > 0 && (
          <p className={styles.stepMeta}>
            <strong>If it fails:</strong> {step.failures.join(" · ")}
          </p>
        )}
        {step.recovery && (
          <p className={styles.stepMeta}>
            <strong>Recovery:</strong> {step.recovery}
          </p>
        )}
        {step.security && (
          <p className={styles.stepMeta}>
            <strong>Security note:</strong> {step.security}
          </p>
        )}
        <p className={styles.stepMeta}>
          {step.reversible ? "Reversible." : "Not easily reversible — read twice before running."}{" "}
          {step.kbLink && <Link to={step.kbLink}>Background reading.</Link>}
        </p>
        {step.checkpoint && <div className={styles.checkpoint}>Checkpoint: {step.checkpoint}</div>}
      </div>
    </div>
  );
}

export function Guide({ plan }: { plan: GuidePlan }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setDone(loadProgress());
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) saveProgress(done);
  }, [loaded, done]);

  const total = plan.sections.reduce((n, s) => n + s.steps.length, 0);
  const completed = plan.sections.reduce(
    (n, s) => n + s.steps.filter((st) => done[st.id]).length,
    0,
  );

  return (
    <section aria-label="Personalized installation guide">
      <h2 className={styles.stepTitle}>Your personalized installation guide</h2>
      <p className={styles.stepHelp}>
        {plan.sections.length} sections, {total} steps · {completed} completed. Progress is saved in this
        browser — you can close this page and resume later. Every command states where to run it. Print or
        export this page if you want an offline copy.
      </p>
      <div className={styles.toolRow}>
        <button type="button" className={styles.btnLink} onClick={() => window.print()}>
          Print this guide
        </button>
        <button
          type="button"
          className={styles.btnLink}
          onClick={() => {
            if (window.confirm("Clear guide progress (checkboxes only)? Your Linux installation is not affected.")) {
              setDone({});
            }
          }}
        >
          Reset progress
        </button>
      </div>
      {plan.sections.map((section, i) => (
        <div key={section.id} className={styles.guideSection}>
          <h3 className={styles.guideSectionTitle}>
            {i + 1}. {section.title}
          </h3>
          {section.steps.map((step) => (
            <StepView
              key={step.id}
              step={step}
              done={!!done[step.id]}
              onToggle={() => setDone((d) => ({ ...d, [step.id]: !d[step.id] }))}
            />
          ))}
        </div>
      ))}
      <p className={styles.stepHelp}>
        Stuck anywhere? The <Link to="/docs/troubleshooting/symptom-index">symptom-first troubleshooting index</Link>{" "}
        maps what you see to its fix, and the optional <Link to="/docs/downloads/scripts">adl-doctor.sh</Link>{" "}
        script diagnoses the whole chain automatically.
      </p>
    </section>
  );
}
