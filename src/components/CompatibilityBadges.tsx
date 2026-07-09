import React from "react";

type BadgeStatus = "full" | "partial" | "none" | "untested";

interface Badge {
  label: string;
  status: BadgeStatus;
}

interface CompatibilityBadgesProps {
  items?: Badge[];
}

const config: Record<BadgeStatus, { icon: string; text: string; color: string }> = {
  full: { icon: "✅", text: "Supported", color: "#16a34a" },
  partial: { icon: "⚠️", text: "Partial", color: "#d97706" },
  none: { icon: "❌", text: "Not supported", color: "#dc2626" },
  untested: { icon: "❓", text: "Untested", color: "#6b7280" },
};

/** Inline row of compatibility badges, e.g. per-device feature support. */
export default function CompatibilityBadges({ items = [] }: CompatibilityBadgesProps) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
      {items.map(({ label, status }) => {
        const c = config[status] ?? config.untested;
        return (
          <span
            key={label}
            title={c.text}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              border: "1px solid var(--adl-border-color)",
              borderRadius: 999,
              padding: "0.25rem 0.8rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              background: "var(--adl-card-bg, transparent)",
            }}
          >
            <span aria-hidden="true">{c.icon}</span>
            <span>{label}</span>
            <span style={{ color: c.color, fontSize: "0.6875rem" }}>{c.text}</span>
          </span>
        );
      })}
    </div>
  );
}
