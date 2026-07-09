import React from "react";

interface ChecklistItem {
  label: string;
  done?: boolean;
}

interface ProgressChecklistProps {
  title?: string;
  items: ChecklistItem[];
}

export default function ProgressChecklist({ title = "Progress", items }: ProgressChecklistProps) {
  const completed = items.filter((i) => i.done).length;
  const pct = Math.round((completed / items.length) * 100);

  return (
    <div
      className="adl-progress-checklist"
      style={{
        border: "1px solid var(--adl-border-color)",
        borderRadius: "12px",
        padding: "1.25rem",
        marginBottom: "1.5rem",
        background: "var(--adl-card-bg)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>{title}</span>
        <span style={{ fontSize: "0.75rem", color: "var(--adl-text-muted)", fontWeight: 500 }}>
          {completed}/{items.length} ({pct}%)
        </span>
      </div>
      <div
        style={{
          height: 4,
          background: "var(--adl-border-color)",
          borderRadius: 2,
          marginBottom: "1rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "var(--ifm-color-primary)",
            borderRadius: 2,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.875rem" }}>
        {items.map(({ label, done }) => (
          <li
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.3rem 0",
              color: done ? "var(--adl-text-muted)" : "inherit",
              textDecoration: done ? "line-through" : "none",
            }}
          >
            <span style={{ fontSize: "0.875rem" }}>{done ? "✅" : "⬜"}</span>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
