import React from "react";
import Link from "@docusaurus/Link";

interface DECard {
  name: string;
  ram: string;
  description: string;
  to?: string;
  recommended?: boolean;
}

interface DesktopEnvironmentCardsProps {
  items?: DECard[];
}

const DEFAULT_ITEMS: DECard[] = [
  {
    name: "XFCE",
    ram: "~500 MB RAM",
    description: "Fast, stable, and fully featured. The best balance of performance and usability on a phone.",
    to: "/docs/desktop-environments/xfce",
    recommended: true,
  },
  {
    name: "LXQt",
    ram: "~400 MB RAM",
    description: "Lighter than XFCE with a Qt look. A good choice for older or lower-RAM devices.",
  },
  {
    name: "MATE",
    ram: "~600 MB RAM",
    description: "A traditional desktop with a familiar layout. Slightly heavier than XFCE.",
  },
];

/** Card grid comparing desktop environment options. */
export default function DesktopEnvironmentCards({ items = DEFAULT_ITEMS }: DesktopEnvironmentCardsProps) {
  return (
    <div className="adl-card-grid" style={{ marginBottom: "1.5rem" }}>
      {items.map((de) => {
        const card = (
          <div
            key={de.name}
            className="adl-visual-card"
            style={{
              border: de.recommended
                ? "2px solid var(--ifm-color-primary)"
                : "1px solid var(--adl-border-color)",
              borderRadius: 12,
              padding: "1.1rem 1.25rem",
              background: "var(--adl-card-bg, transparent)",
              height: "100%",
              position: "relative",
            }}
          >
            {de.recommended && (
              <span
                style={{
                  position: "absolute",
                  top: -11,
                  right: 12,
                  background: "var(--ifm-color-primary)",
                  color: "#fff",
                  borderRadius: 999,
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  padding: "0.1rem 0.6rem",
                }}
              >
                Recommended
              </span>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.4rem" }}>
              <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--ifm-font-color-base)" }}>{de.name}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--adl-text-muted, var(--ifm-color-emphasis-600))", whiteSpace: "nowrap" }}>{de.ram}</span>
            </div>
            <p style={{ fontSize: "0.8125rem", lineHeight: 1.6, margin: 0, color: "var(--adl-text-muted, var(--ifm-color-emphasis-700))" }}>
              {de.description}
            </p>
          </div>
        );
        return de.to ? (
          <Link key={de.name} to={de.to} style={{ textDecoration: "none", display: "block" }}>
            {card}
          </Link>
        ) : (
          card
        );
      })}
    </div>
  );
}
