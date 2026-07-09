import React from "react";

interface TroubleshootingItem {
  problem: string;
  solution: string;
}

interface TroubleshootingProps {
  items: TroubleshootingItem[];
}

export default function Troubleshooting({ items }: TroubleshootingProps) {
  return (
    <div
      className="adl-troubleshooting"
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
        <span>🔧</span>
        <span>Troubleshooting</span>
      </div>
      <div style={{ padding: "0.25rem 0" }}>
        {items.map(({ problem, solution }, i) => (
          <details
            key={i}
            style={{
              padding: "0.75rem 1.25rem",
              borderBottom: i < items.length - 1 ? "1px solid var(--adl-border-color)" : "none",
              fontSize: "0.875rem",
            }}
          >
            <summary style={{ fontWeight: 600, cursor: "pointer", lineHeight: 1.5 }}>{problem}</summary>
            <div style={{ marginTop: "0.5rem", color: "var(--adl-text-muted)", lineHeight: 1.65 }}>{solution}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
