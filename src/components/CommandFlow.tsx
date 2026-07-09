import React from "react";

interface CommandStep {
  command: string;
  note?: string;
}

interface CommandFlowProps {
  title?: string;
  steps?: CommandStep[];
}

/**
 * A vertical sequence of commands with short labels, for showing a
 * workflow at a glance (details belong in the surrounding prose).
 */
export default function CommandFlow({ title, steps = [] }: CommandFlowProps) {
  return (
    <div
      className="adl-figure"
      role="group"
      aria-label={title ?? "Command sequence"}
      style={{
        border: "1px solid var(--adl-border-color)",
        borderRadius: 12,
        padding: "1rem 1.25rem",
        marginBottom: "1.5rem",
        background: "var(--adl-card-bg, transparent)",
        maxWidth: 560,
      }}
    >
      {title && (
        <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.75rem" }}>{title}</div>
      )}
      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {steps.map((step, i) => (
          <li key={i}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <code
                style={{
                  background: "var(--adl-code-bg, var(--ifm-code-background))",
                  border: "1px solid var(--adl-border-color)",
                  borderRadius: 8,
                  padding: "0.35rem 0.7rem",
                  fontSize: "0.8125rem",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {step.command}
              </code>
              {step.note && (
                <span style={{ fontSize: "0.75rem", color: "var(--adl-text-muted, var(--ifm-color-emphasis-600))", paddingTop: "0.4rem" }}>
                  {step.note}
                </span>
              )}
            </div>
            {i < steps.length - 1 && (
              <div aria-hidden="true" style={{ color: "var(--ifm-color-primary)", fontWeight: 700, padding: "0.15rem 0 0.15rem 0.9rem", lineHeight: 1 }}>
                ↓
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
