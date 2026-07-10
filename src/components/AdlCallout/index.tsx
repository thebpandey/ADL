import React from "react";
import styles from "./styles.module.css";

type CalloutKind = "tip" | "warning" | "danger" | "note" | "success";

interface AdlCalloutProps {
  type?: CalloutKind;
  title?: string;
  children: React.ReactNode;
}

const config: Record<CalloutKind, { icon: string; label: string; className: string }> = {
  tip: { icon: "💡", label: "Tip", className: styles.tip },
  warning: { icon: "⚠️", label: "Warning", className: styles.warning },
  danger: { icon: "🛑", label: "Danger", className: styles.danger },
  note: { icon: "📝", label: "Note", className: styles.note },
  success: { icon: "✅", label: "Success", className: styles.success },
};

/** Unified callout for tips, warnings, dangers, notes, and successes. */
export default function AdlCallout({ type = "note", title, children }: AdlCalloutProps) {
  const c = config[type] ?? config.note;
  return (
    <div role="note" aria-label={title ?? c.label} className={`${styles.callout} ${c.className}`}>
      <div className={styles.header}>
        <span aria-hidden="true">{c.icon}</span>
        <span>{title ?? c.label}</span>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
