import React from "react";

type CalloutType = "info" | "success" | "warning" | "danger";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const config: Record<CalloutType, { icon: string; label: string; border: string; bg: string; bgDark: string }> = {
  info: { icon: "ℹ️", label: "Info", border: "#2563eb", bg: "#eff6ff", bgDark: "rgba(37,99,235,0.1)" },
  success: { icon: "✅", label: "Success", border: "#16a34a", bg: "#f0fdf4", bgDark: "rgba(22,163,74,0.1)" },
  warning: { icon: "⚠️", label: "Warning", border: "#d97706", bg: "#fffbeb", bgDark: "rgba(217,119,6,0.1)" },
  danger: { icon: "🚨", label: "Danger", border: "#dc2626", bg: "#fef2f2", bgDark: "rgba(220,38,38,0.1)" },
};

export default function Callout({ type = "info", title, children }: CalloutProps) {
  const c = config[type];
  return (
    <div
      role="note"
      aria-label={title || c.label}
      style={{
        borderLeft: `4px solid ${c.border}`,
        borderRadius: "12px",
        padding: "1rem 1.25rem",
        marginBottom: "1.5rem",
        background: `var(--adl-callout-bg, ${c.bg})`,
        fontSize: "0.875rem",
        lineHeight: 1.65,
      }}
    >
      <style>{`[data-theme="dark"] [aria-label="${title || c.label}"] { --adl-callout-bg: ${c.bgDark}; }`}</style>
      <div style={{ fontWeight: 700, marginBottom: children ? "0.35rem" : 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span>{c.icon}</span>
        <span>{title || c.label}</span>
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
