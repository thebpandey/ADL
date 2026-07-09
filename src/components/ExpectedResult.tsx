import React from "react";

interface ExpectedResultProps {
  children: React.ReactNode;
}

export default function ExpectedResult({ children }: ExpectedResultProps) {
  return (
    <div
      role="note"
      aria-label="Expected result"
      className="adl-expected-result"
      style={{
        border: "1px solid var(--adl-border-color)",
        borderLeft: "4px solid #16a34a",
        borderRadius: "12px",
        padding: "1rem 1.25rem",
        marginBottom: "1.5rem",
        fontSize: "0.875rem",
        lineHeight: 1.65,
        background: "var(--adl-card-bg)",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span>🎯</span>
        <span>Expected Result</span>
      </div>
      <div>{children}</div>
    </div>
  );
}
