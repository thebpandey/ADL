import React from "react";

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function CollapsibleSection({ title, defaultOpen = false, children }: CollapsibleSectionProps) {
  return (
    <details
      open={defaultOpen || undefined}
      className="adl-collapsible"
      style={{
        border: "1px solid var(--adl-border-color)",
        borderRadius: "12px",
        marginBottom: "1rem",
        overflow: "hidden",
      }}
    >
      <summary
        style={{
          padding: "0.875rem 1.25rem",
          fontWeight: 600,
          fontSize: "0.9375rem",
          cursor: "pointer",
          background: "var(--adl-code-bg)",
          borderBottom: "1px solid transparent",
          userSelect: "none",
        }}
      >
        {title}
      </summary>
      <div style={{ padding: "1rem 1.25rem", fontSize: "0.875rem", lineHeight: 1.65 }}>
        {children}
      </div>
    </details>
  );
}
