import React from "react";

interface CompatibilityItem {
  name: string;
  status: "full" | "partial" | "none" | "untested";
  notes?: string;
}

interface CompatibilityProps {
  title?: string;
  items: CompatibilityItem[];
}

const statusConfig = {
  full: { icon: "✅", label: "Full Support", color: "#16a34a" },
  partial: { icon: "⚠️", label: "Partial", color: "#d97706" },
  none: { icon: "❌", label: "Not Supported", color: "#dc2626" },
  untested: { icon: "❓", label: "Untested", color: "#6b7280" },
};

export default function Compatibility({ title = "Compatibility", items = [] }: CompatibilityProps) {
  return (
    <div
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
        <span>📋</span>
        <span>{title}</span>
      </div>
      <table style={{ width: "100%", margin: 0, border: "none", borderRadius: 0, fontSize: "0.8125rem" }}>
        <thead>
          <tr>
            <th style={{ padding: "0.5rem 1rem", textAlign: "left" }}>Item</th>
            <th style={{ padding: "0.5rem 1rem", textAlign: "center", width: "120px" }}>Status</th>
            <th style={{ padding: "0.5rem 1rem", textAlign: "left" }}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ name, status, notes }, i) => {
            const s = statusConfig[status];
            return (
              <tr key={i}>
                <td style={{ padding: "0.5rem 1rem", fontWeight: 500 }}>{name}</td>
                <td style={{ padding: "0.5rem 1rem", textAlign: "center" }}>
                  <span title={s.label}>{s.icon}</span>
                </td>
                <td style={{ padding: "0.5rem 1rem", color: "var(--adl-text-muted)" }}>{notes || "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
