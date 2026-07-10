import React from "react";
import Link from "@docusaurus/Link";

interface FlowStep {
  label: string;
  detail?: string;
  to?: string;
}

interface InstallFlowDiagramProps {
  title?: string;
  steps?: FlowStep[];
}

const DEFAULT_STEPS: FlowStep[] = [
  { label: "Install Termux", detail: "~10 min", to: "/docs/quick-start/install-termux" },
  { label: "Install Ubuntu", detail: "~15 min", to: "/docs/quick-start/install-ubuntu" },
  { label: "Install Desktop", detail: "~20 min", to: "/docs/quick-start/install-desktop" },
  { label: "First Launch", detail: "~10 min", to: "/docs/quick-start/first-launch" },
  { label: "Samsung DeX", detail: "optional", to: "/docs/quick-start/samsung-dex" },
];

/**
 * The installation path as a numbered step flow. Steps link to their
 * guides; wraps to a vertical layout on narrow screens.
 */
export default function InstallFlowDiagram({ title = "Installation path", steps = DEFAULT_STEPS }: InstallFlowDiagramProps) {
  return (
    <nav aria-label={title} className="adl-figure" style={{ marginBottom: "1.5rem" }}>
      <ol
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.15rem",
          listStyle: "none",
          padding: 0,
          margin: 0,
          alignItems: "stretch",
        }}
      >
        {steps.map((step, i) => {
          const inner = (
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span
                aria-hidden="true"
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "var(--ifm-color-primary)",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
                <span style={{ fontWeight: 600, fontSize: "0.6875rem", color: "var(--ifm-font-color-base)" }}>{step.label}</span>
                {step.detail && (
                  <span style={{ fontSize: "0.5625rem", color: "var(--adl-text-muted, var(--ifm-color-emphasis-600))" }}>
                    {step.detail}
                  </span>
                )}
              </span>
            </span>
          );
          return (
            <li key={step.label} style={{ display: "flex", alignItems: "center", gap: "0.15rem" }}>
              {step.to ? (
                <Link
                  to={step.to}
                  className="adl-flow-node"
                  style={{
                    border: "1px solid var(--adl-border-color)",
                    borderRadius: 10,
                    padding: "0.3rem 0.35rem",
                    background: "var(--adl-card-bg, transparent)",
                    textDecoration: "none",
                    display: "block",
                  }}
                >
                  {inner}
                </Link>
              ) : (
                <span
                  className="adl-flow-node"
                  style={{
                    border: "1px solid var(--adl-border-color)",
                    borderRadius: 10,
                    padding: "0.3rem 0.35rem",
                    background: "var(--adl-card-bg, transparent)",
                    display: "block",
                  }}
                >
                  {inner}
                </span>
              )}
              {i < steps.length - 1 && (
                <span aria-hidden="true" style={{ color: "var(--ifm-color-primary)", fontWeight: 700, fontSize: "0.625rem" }}>
                  →
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
