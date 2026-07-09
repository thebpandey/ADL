import React from "react";
import Link from "@docusaurus/Link";

interface DecisionBranch {
  question: string;
  yes: string;
  no: string;
  yesTo?: string;
  noTo?: string;
}

interface TroubleshootingDecisionTreeProps {
  title?: string;
  branches?: DecisionBranch[];
}

const DEFAULT_BRANCHES: DecisionBranch[] = [
  {
    question: "Does Termux open and show a prompt?",
    yes: "Continue below",
    no: "Termux problems",
    noTo: "/docs/troubleshooting/termux",
  },
  {
    question: "Does the desktop appear in Termux:X11?",
    yes: "Continue below",
    no: "Display problems",
    noTo: "/docs/troubleshooting/display",
  },
  {
    question: "Do you hear sound from Linux apps?",
    yes: "Continue below",
    no: "Audio problems",
    noTo: "/docs/troubleshooting/audio",
  },
  {
    question: "Is everything working but slow?",
    yes: "Performance tuning",
    yesTo: "/docs/troubleshooting/performance",
    no: "You're all set 🎉",
  },
];

const answerPill = (text: string, to: string | undefined, kind: "yes" | "no") => {
  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    borderRadius: 999,
    padding: "0.2rem 0.75rem",
    textDecoration: "none",
    border: `1px solid ${kind === "yes" ? "var(--ifm-color-success-dark, #16a34a)" : "var(--ifm-color-danger-dark, #dc2626)"}`,
    color: kind === "yes" ? "var(--ifm-color-success-darkest, #15803d)" : "var(--ifm-color-danger-darkest, #b91c1c)",
    background: "transparent",
  };
  const content = (
    <>
      <span aria-hidden="true">{kind === "yes" ? "✓" : "✗"}</span>
      <span>{kind === "yes" ? "Yes" : "No"}: {text}</span>
    </>
  );
  return to ? (
    <Link to={to} style={style}>{content}</Link>
  ) : (
    <span style={style}>{content}</span>
  );
};

/**
 * A vertical "start here" decision flow for diagnosing problems.
 * Each row is a question with yes/no outcomes linking to the right page.
 */
export default function TroubleshootingDecisionTree({
  title = "Where is the problem?",
  branches = DEFAULT_BRANCHES,
}: TroubleshootingDecisionTreeProps) {
  return (
    <div className="adl-figure" role="group" aria-label={title} style={{ marginBottom: "1.5rem", maxWidth: 620 }}>
      <div style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "0.75rem" }}>{title}</div>
      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {branches.map((b, i) => (
          <li key={i}>
            <div
              style={{
                border: "1px solid var(--adl-border-color)",
                borderLeft: "4px solid var(--ifm-color-primary)",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                background: "var(--adl-card-bg, transparent)",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.5rem" }}>{b.question}</div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {answerPill(b.yes, b.yesTo, "yes")}
                {answerPill(b.no, b.noTo, "no")}
              </div>
            </div>
            {i < branches.length - 1 && (
              <div aria-hidden="true" style={{ color: "var(--ifm-color-primary)", fontWeight: 700, padding: "0.15rem 0 0.15rem 1.1rem", lineHeight: 1 }}>
                ↓
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
