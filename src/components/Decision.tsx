import React from "react";

interface DecisionOption {
  label: string;
  description: string;
  recommended?: boolean;
}

interface DecisionProps {
  question: string;
  options: DecisionOption[];
}

export default function Decision({ question, options }: DecisionProps) {
  return (
    <div
      className="adl-decision"
      style={{
        border: "1px solid var(--adl-border-color)",
        borderRadius: "12px",
        overflow: "hidden",
        marginBottom: "1.5rem",
      }}
    >
      <div
        style={{
          background: "var(--adl-code-bg)",
          padding: "0.75rem 1.25rem",
          fontWeight: 700,
          fontSize: "0.875rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          borderBottom: "1px solid var(--adl-border-color)",
        }}
      >
        <span>🤔</span>
        <span>{question}</span>
      </div>
      <div style={{ padding: "0.5rem" }}>
        {options.map(({ label, description, recommended }, i) => (
          <div
            key={i}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: recommended ? "1px solid var(--ifm-color-primary)" : "1px solid transparent",
              background: recommended ? "var(--adl-badge-bg)" : "transparent",
              marginBottom: i < options.length - 1 ? "0.25rem" : 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>{label}</span>
              {recommended && (
                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    color: "var(--ifm-color-primary)",
                    background: "var(--adl-card-bg)",
                    padding: "0.1rem 0.5rem",
                    borderRadius: "100px",
                    border: "1px solid var(--ifm-color-primary)",
                  }}
                >
                  Recommended
                </span>
              )}
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--adl-text-muted)", margin: "0.25rem 0 0", lineHeight: 1.5 }}>
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
