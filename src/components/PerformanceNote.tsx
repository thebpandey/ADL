import React from "react";

interface PerformanceNoteProps {
  impact: "low" | "medium" | "high";
  children: React.ReactNode;
}

const impactConfig = {
  low: { icon: "🟢", label: "Low Impact", color: "#16a34a" },
  medium: { icon: "🟡", label: "Medium Impact", color: "#d97706" },
  high: { icon: "🔴", label: "High Impact", color: "#dc2626" },
};

export default function PerformanceNote({ impact = "medium", children }: PerformanceNoteProps) {
  const c = impactConfig[impact];
  return (
    <div
      role="note"
      aria-label={`Performance: ${c.label}`}
      style={{
        border: "1px solid var(--adl-border-color)",
        borderRadius: "12px",
        padding: "1rem 1.25rem",
        marginBottom: "1.5rem",
        background: "var(--adl-card-bg)",
        fontSize: "0.875rem",
        lineHeight: 1.65,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span>{c.icon}</span>
        <span>Performance — {c.label}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}
