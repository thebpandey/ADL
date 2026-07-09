import React from "react";

interface HardwareCard {
  icon: string;
  title: string;
  items: string[];
  optional?: boolean;
}

interface HardwareChecklistCardsProps {
  items?: HardwareCard[];
}

const DEFAULT_ITEMS: HardwareCard[] = [
  {
    icon: "📱",
    title: "Phone",
    items: ["Android 10 or newer", "6 GB+ RAM (8 GB recommended)", "15 GB+ free storage", "DP Alt Mode for external display"],
  },
  {
    icon: "🔌",
    title: "USB-C hub",
    items: ["HDMI output", "USB Power Delivery pass-through (45 W+)", "At least one USB-A port"],
    optional: true,
  },
  {
    icon: "🖥️",
    title: "Display",
    items: ["Any HDMI monitor or TV", "1080p works well", "Or use the phone screen only"],
    optional: true,
  },
  {
    icon: "⌨️",
    title: "Input",
    items: ["Bluetooth or USB keyboard", "Bluetooth or USB mouse", "On-screen keyboard works in a pinch"],
    optional: true,
  },
];

/** Checklist cards for the hardware needed (and optional) for an ADL setup. */
export default function HardwareChecklistCards({ items = DEFAULT_ITEMS }: HardwareChecklistCardsProps) {
  return (
    <div className="adl-card-grid" style={{ marginBottom: "1.5rem" }}>
      {items.map((card) => (
        <div
          key={card.title}
          className="adl-visual-card"
          style={{
            border: "1px solid var(--adl-border-color)",
            borderRadius: 12,
            padding: "1.1rem 1.25rem",
            background: "var(--adl-card-bg, transparent)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
            <span aria-hidden="true" style={{ fontSize: "1.25rem" }}>{card.icon}</span>
            <span style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{card.title}</span>
            {card.optional && (
              <span
                style={{
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--adl-text-muted, var(--ifm-color-emphasis-600))",
                  border: "1px solid var(--adl-border-color)",
                  borderRadius: 999,
                  padding: "0.05rem 0.5rem",
                }}
              >
                Optional
              </span>
            )}
          </div>
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", fontSize: "0.8125rem", lineHeight: 1.7 }}>
            {card.items.map((item) => (
              <li key={item} style={{ display: "flex", gap: "0.5rem", alignItems: "baseline" }}>
                <span aria-hidden="true" style={{ color: "var(--ifm-color-primary)", fontWeight: 700 }}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
