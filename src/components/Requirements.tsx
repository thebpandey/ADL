import React from "react";

interface RequirementsProps {
  items: string[];
}

export default function Requirements({ items }: RequirementsProps) {
  return (
    <div
      className="adl-requirements"
      style={{
        border: "1px solid var(--adl-border-color)",
        borderRadius: "12px",
        padding: "1.25rem",
        marginBottom: "1.5rem",
        background: "var(--adl-card-bg)",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span>📋</span>
        <span>Requirements</span>
      </div>
      <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.875rem", lineHeight: 1.8 }}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
