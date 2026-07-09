import React from "react";

interface BestPracticeProps {
  title?: string;
  children: React.ReactNode;
}

export default function BestPractice({ title = "Best Practice", children }: BestPracticeProps) {
  return (
    <div
      role="note"
      aria-label={title}
      style={{
        borderLeft: "4px solid #2563eb",
        borderRadius: "12px",
        padding: "1rem 1.25rem",
        marginBottom: "1.5rem",
        background: "var(--adl-badge-bg)",
        fontSize: "0.875rem",
        lineHeight: 1.65,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span>⭐</span>
        <span>{title}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}
