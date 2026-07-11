/**
 * Guided installer — assessment result, risk acknowledgment gate, and guide.
 */
import React, { useMemo, useState } from "react";
import Link from "@docusaurus/Link";
import { generateGuide } from "@site/src/lib/guide/generator";
import { DEFAULT_USERNAME, sanitizeUsername } from "@site/src/lib/compatibility/rules";
import type {
  AssessmentResult,
  CompatibilityStatus,
  IssueRecord,
  RecommendationOption,
  WizardAnswers,
} from "@site/src/lib/compatibility/types";
import { loadAck, saveAck } from "@site/src/lib/wizard/storage";
import { Guide } from "./Guide";
import styles from "./styles.module.css";

const STATUS_LABEL: Record<CompatibilityStatus, string> = {
  "likely-compatible": "Likely compatible",
  "compatible-with-limitations": "Compatible with limitations",
  experimental: "Experimental",
  unknown: "Unknown / insufficient evidence",
  "unlikely-graphical": "Unlikely to run a usable graphical desktop",
  "cli-recommended": "Command-line use recommended",
  blocked: "Blocked by a known requirement",
};

const CONFIDENCE_LABEL: Record<string, string> = {
  "official-doc": "Officially documented",
  "adl-verified": "Verified by the ADL project",
  "reproduced-community": "Reproduced community report",
  "field-report": "Single-device field report",
  "inferred-from-specs": "Inferred from specifications",
  unknown: "Unknown",
};

function statusClass(status: CompatibilityStatus): string {
  switch (status) {
    case "likely-compatible":
      return styles.statusGood;
    case "compatible-with-limitations":
    case "cli-recommended":
      return styles.statusLimited;
    case "experimental":
      return styles.statusExperimental;
    case "blocked":
    case "unlikely-graphical":
      return styles.statusBad;
    default:
      return styles.statusUnknown;
  }
}

function RecCard({ kind, option }: { kind: string; option: RecommendationOption }) {
  return (
    <div className={styles.recCard}>
      <div className={styles.recKind}>{kind}</div>
      <div className={styles.recTitle}>{option.label}</div>
      <ul className={styles.recList}>
        {option.reasons.map((r) => (
          <li key={r}>{r}</li>
        ))}
        {option.warnings.map((w) => (
          <li key={w} className={styles.recWarning}>
            ⚠ {w}
          </li>
        ))}
      </ul>
    </div>
  );
}

const ACK_ITEMS = [
  "I understand compatibility is not guaranteed.",
  "I understand instructions may change security or battery settings.",
  "I have backed up important data, or accept the risk of proceeding without a backup.",
  "I will review commands and scripts before running them.",
  "I accept responsibility for changes made to my device.",
];

export function Assessment({
  assessment,
  answers,
  issues,
}: {
  assessment: AssessmentResult;
  answers: WizardAnswers;
  issues: IssueRecord[];
}) {
  const [acked, setAcked] = useState<boolean>(() => loadAck() !== null);
  const [checks, setChecks] = useState<boolean[]>(ACK_ITEMS.map(() => false));
  const [usernameInput, setUsernameInput] = useState(DEFAULT_USERNAME);
  const [showGuide, setShowGuide] = useState(false);

  const username = sanitizeUsername(usernameInput);
  const usernameError =
    usernameInput && !username
      ? "Usernames must start with a lowercase letter and contain only lowercase letters, digits, '-' or '_' (max 32 characters), and cannot be a reserved name like 'root'."
      : undefined;

  const guide = useMemo(
    () => (showGuide ? generateGuide(assessment, answers, { username: username ?? DEFAULT_USERNAME }) : null),
    [showGuide, assessment, answers, username],
  );

  const matchedIssues = issues.filter((i) => assessment.matchedIssueIds.includes(i.id));
  const blocked = assessment.overallStatus === "blocked";

  return (
    <div>
      <h2 className={styles.stepTitle}>Your compatibility assessment</h2>
      <p style={{ margin: "0.25rem 0 1rem" }}>
        <span className={`${styles.statusBadge} ${statusClass(assessment.overallStatus)}`}>
          {STATUS_LABEL[assessment.overallStatus]}
        </span>{" "}
        <span className={styles.dimConfidence} style={{ marginLeft: "0.5rem" }}>
          Confidence: {CONFIDENCE_LABEL[assessment.confidence]}
        </span>
      </p>
      <p className={styles.stepHelp}>
        A compatibility result is an estimate, not a guarantee — every conclusion below shows its own status,
        confidence, and reason. Devices absent from the ADL catalog are never marked incompatible; they get
        specification-based results.{" "}
        <Link to="/docs/get-started/methodology">How these results are produced.</Link>
      </p>

      {assessment.requiredWarnings.length > 0 && (
        <section aria-label="Required warnings">
          {assessment.requiredWarnings.map((w) => (
            <div key={w.id + w.text} className={styles.warnBox} role="alert">
              {w.text} {w.kbLink && <Link to={w.kbLink}>Learn more.</Link>}
            </div>
          ))}
        </section>
      )}
      {assessment.optionalWarnings.map((w) => (
        <div key={w.id + w.text} className={`${styles.warnBox} ${styles.warnBoxSoft}`}>
          {w.text} {w.kbLink && <Link to={w.kbLink}>Learn more.</Link>}
        </div>
      ))}

      <h3>Compatibility by dimension</h3>
      <div className={styles.dimGrid}>
        {assessment.dimensions.map((d) => (
          <div key={d.id} className={styles.dimRow}>
            <span className={styles.dimLabel}>{d.label}</span>
            <span>
              <span className={`${styles.statusBadge} ${statusClass(d.status)}`}>{STATUS_LABEL[d.status]}</span>{" "}
              <span className={styles.dimConfidence}>{CONFIDENCE_LABEL[d.confidence]}</span>
            </span>
            <span className={styles.dimReason}>{d.reason}</span>
          </div>
        ))}
      </div>

      <h3>Recommended configuration</h3>
      <RecCard kind="Linux distribution" option={assessment.recommendation.distro} />
      <RecCard kind="Desktop" option={assessment.recommendation.desktop} />
      <RecCard kind="Display method" option={assessment.recommendation.displayMethod} />
      {assessment.recommendation.audioMethod && (
        <RecCard kind="Audio" option={assessment.recommendation.audioMethod} />
      )}
      {assessment.recommendation.browser && <RecCard kind="Browser" option={assessment.recommendation.browser} />}
      {assessment.recommendation.peripherals.map((p) => (
        <RecCard key={p.id} kind="Hardware" option={p} />
      ))}
      <p className={styles.stepHelp}>
        Estimated storage requirement: <strong>about {assessment.estimatedStorageGb} GB free</strong> (Termux +
        Linux system + desktop + browser + package cache + your workloads + safety reserve).
      </p>

      {assessment.notRecommendedNotes.length > 0 && (
        <>
          <h3>Why other common choices were not recommended</h3>
          <ul className={styles.recList}>
            {assessment.notRecommendedNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </>
      )}

      {assessment.alternatives.length > 0 && (
        <>
          <h3>Alternatives</h3>
          <ul className={styles.recList}>
            {assessment.alternatives.map((alt) => (
              <li key={alt.label}>
                <strong>{alt.label}</strong> — {alt.reason} (Change your choice in Installation preferences via
                “Edit answers”.)
              </li>
            ))}
          </ul>
        </>
      )}

      {matchedIssues.length > 0 && (
        <>
          <h3>Known issues that may affect this configuration</h3>
          <ul className={styles.recList}>
            {matchedIssues.map((i) => (
              <li key={i.id}>
                <strong>{i.title}.</strong> {i.safeFix ?? i.workaround ?? ""}{" "}
                {i.relatedPages?.[0] && <Link to={i.relatedPages[0]}>Details.</Link>}
              </li>
            ))}
          </ul>
        </>
      )}

      {blocked ? (
        <div className={styles.warnBox} role="alert">
          A hard requirement is not met (see the warnings above), so a personalized installation guide is not
          offered for this configuration. The knowledge base remains fully available:{" "}
          <Link to="/docs/intro">browse the documentation</Link> or{" "}
          <Link to="/docs/get-started/methodology">read how compatibility is assessed</Link>.
        </div>
      ) : !acked ? (
        <section className={styles.ackBox} aria-label="Risk acknowledgment">
          <h3 style={{ marginTop: 0 }}>Before your personalized guide</h3>
          <p className={styles.stepHelp}>
            The guide contains executable commands and settings changes. Please confirm each statement — none are
            pre-checked, and you can keep browsing the knowledge base without accepting. Your acknowledgment is
            stored only in this browser.{" "}
            <Link to="/docs/get-started/disclaimer">Read the full disclaimer.</Link>
          </p>
          {ACK_ITEMS.map((item, i) => (
            <label key={item} className={styles.ackItem}>
              <input
                type="checkbox"
                checked={checks[i]}
                onChange={() => setChecks((c) => c.map((v, j) => (j === i ? !v : v)))}
              />
              <span>{item}</span>
            </label>
          ))}
          <div style={{ marginTop: "1rem" }}>
            <button
              type="button"
              className={styles.btnPrimary}
              disabled={!checks.every(Boolean)}
              onClick={() => {
                saveAck();
                setAcked(true);
              }}
            >
              I acknowledge — show my guide
            </button>
          </div>
        </section>
      ) : !showGuide ? (
        <section className={styles.ackBox} aria-label="Guide options">
          <h3 style={{ marginTop: 0 }}>Generate your step-by-step guide</h3>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="adl-username">
              Linux username to create
            </label>
            <span className={styles.fieldHint}>
              The guide creates a normal (non-root) Linux user — browsers and desktop apps behave better that way.
            </span>
            <input
              id="adl-username"
              className={styles.textInput}
              type="text"
              value={usernameInput}
              aria-invalid={usernameError ? true : undefined}
              onChange={(e) => setUsernameInput(e.target.value)}
            />
            {usernameError && (
              <span role="alert" className={styles.fieldHint} style={{ color: "#b3402f" }}>
                {usernameError}
              </span>
            )}
          </div>
          <button
            type="button"
            className={styles.btnPrimary}
            disabled={!username}
            onClick={() => setShowGuide(true)}
          >
            Show my personalized guide
          </button>
        </section>
      ) : (
        guide && <Guide plan={guide} />
      )}
    </div>
  );
}
