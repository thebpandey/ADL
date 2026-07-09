import React from "react";

interface CommonMistakeProps {
  title?: string;
  children: React.ReactNode;
}

export default function CommonMistake({ title = "Common Mistake", children }: CommonMistakeProps) {
  return (
    <div
      role="note"
      aria-label={title}
      style={{
        borderLeft: "4px solid #dc2626",
        borderRadius: "12px",
        padding: "1rem 1.25rem",
        marginBottom: "1.5rem",
        background: "var(--adl-card-bg)",
        border: "1px solid var(--adl-border-color)",
        borderLeftWidth: "4px",
        borderLeftColor: "#dc2626",
        fontSize: "0.875rem",
        lineHeight: 1.65,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span>🚫</span>
        <span>{title}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}
