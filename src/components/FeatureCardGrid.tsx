import React from "react";
import Link from "@docusaurus/Link";

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  to?: string;
}

interface FeatureCardGridProps {
  items?: FeatureCard[];
}

const DEFAULT_ITEMS: FeatureCard[] = [
  { icon: "🖥️", title: "Full desktop", description: "A real XFCE desktop with windows, panels, and apps — not a remote session." },
  { icon: "🔓", title: "No root required", description: "Everything runs in userspace with proot. Your warranty and banking apps stay intact." },
  { icon: "📦", title: "Real Linux packages", description: "apt on Ubuntu gives you Firefox, VS Code, LibreOffice, and thousands more." },
  { icon: "🖱️", title: "Desk-ready", description: "Connect a monitor, keyboard, and mouse over USB-C for a workstation setup." },
];

/** Responsive grid of icon + title + description feature cards. */
export default function FeatureCardGrid({ items = DEFAULT_ITEMS }: FeatureCardGridProps) {
  return (
    <div className="adl-card-grid" style={{ marginBottom: "1.5rem" }}>
      {items.map((f) => {
        const card = (
          <div
            key={f.title}
            className="adl-visual-card"
            style={{
              border: "1px solid var(--adl-border-color)",
              borderRadius: 12,
              padding: "1.1rem 1.25rem",
              background: "var(--adl-card-bg, transparent)",
              height: "100%",
            }}
          >
            <div aria-hidden="true" style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "0.3rem", color: "var(--ifm-font-color-base)" }}>{f.title}</div>
            <p style={{ fontSize: "0.8125rem", lineHeight: 1.6, margin: 0, color: "var(--adl-text-muted, var(--ifm-color-emphasis-700))" }}>
              {f.description}
            </p>
          </div>
        );
        return f.to ? (
          <Link key={f.title} to={f.to} style={{ textDecoration: "none", display: "block" }}>
            {card}
          </Link>
        ) : (
          card
        );
      })}
    </div>
  );
}
