import React from "react";
import styles from "./styles.module.css";

type BadgeType =
  | "samsung-dex"
  | "displayport"
  | "bluetooth"
  | "external-storage"
  | "keyboard"
  | "mouse"
  | "tested"
  | "experimental";

interface CompatibilityBadgeProps {
  type: BadgeType;
  /** Override the default label. */
  label?: string;
}

const config: Record<BadgeType, { icon: string; label: string; className: string }> = {
  "samsung-dex": { icon: "🖥️", label: "Samsung DeX", className: styles.feature },
  displayport: { icon: "🔌", label: "DisplayPort", className: styles.feature },
  bluetooth: { icon: "📶", label: "Bluetooth", className: styles.feature },
  "external-storage": { icon: "💾", label: "External Storage", className: styles.feature },
  keyboard: { icon: "⌨️", label: "Keyboard", className: styles.feature },
  mouse: { icon: "🖱️", label: "Mouse", className: styles.feature },
  tested: { icon: "✅", label: "Tested", className: styles.tested },
  experimental: { icon: "🧪", label: "Experimental", className: styles.experimental },
};

/** Small pill badge marking a capability or support status. */
export default function CompatibilityBadge({ type, label }: CompatibilityBadgeProps) {
  const c = config[type] ?? config.tested;
  return (
    <span className={`${styles.badge} ${c.className}`}>
      <span aria-hidden="true">{c.icon}</span>
      <span>{label ?? c.label}</span>
    </span>
  );
}
