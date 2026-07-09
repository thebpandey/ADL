import React, { useState } from "react";
import Link from "@docusaurus/Link";

interface DecisionOption {
  label: string;
  description: string;
  recommended?: boolean;
  /** Extra guidance shown in a panel below when this option is selected. */
  details?: string;
  /** Optional link shown with the details panel. */
  to?: string;
  toLabel?: string;
}

interface DecisionProps {
  question?: string;
  /** Some pages use title= instead of question=; both are accepted. */
  title?: string;
  options?: DecisionOption[];
}

export default function Decision({ question, title, options = [] }: DecisionProps) {
  const heading = question ?? title ?? "Which option fits you?";
  const headingId = `decision-${heading.replace(/\W+/g, "-")}`;
  const defaultIndex = Math.max(
    options.findIndex((o) => o.recommended),
    0,
  );
  const [selected, setSelected] = useState(defaultIndex);
  const current = options[selected];
  const hasPanel = current && (current.details || current.to);

  return (
    <div
      className="adl-decision"
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
        <span>🤔</span>
        <span id={headingId}>{heading}</span>
      </div>
      <div
        role="radiogroup"
        aria-labelledby={headingId}
        style={{ padding: "0.5rem" }}
      >
        {options.map(({ label, description, recommended }, i) => {
          const isSelected = i === selected;
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelected(i)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
                font: "inherit",
                color: "inherit",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: isSelected
                  ? "1px solid var(--ifm-color-primary)"
                  : "1px solid transparent",
                boxShadow: isSelected
                  ? "inset 3px 0 0 var(--ifm-color-primary)"
                  : "none",
                background: isSelected ? "var(--adl-badge-bg)" : "transparent",
                marginBottom: i < options.length - 1 ? "0.25rem" : 0,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: `2px solid ${isSelected ? "var(--ifm-color-primary)" : "var(--adl-border-color)"}`,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {isSelected && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--ifm-color-primary)",
                      }}
                    />
                  )}
                </span>
                <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>{label}</span>
                {recommended && (
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      color: "var(--ifm-color-primary)",
                      background: "var(--adl-card-bg)",
                      padding: "0.1rem 0.5rem",
                      borderRadius: "100px",
                      border: "1px solid var(--ifm-color-primary)",
                    }}
                  >
                    Recommended
                  </span>
                )}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  color: "var(--adl-text-muted)",
                  margin: "0.25rem 0 0 1.5rem",
                  lineHeight: 1.5,
                }}
              >
                {description}
              </span>
            </button>
          );
        })}
      </div>
      {hasPanel && (
        <div
          role="region"
          aria-live="polite"
          aria-label={`Guidance for ${current.label}`}
          style={{
            borderTop: "1px solid var(--adl-border-color)",
            padding: "0.85rem 1.25rem",
            fontSize: "0.8125rem",
            lineHeight: 1.6,
            background:
              "color-mix(in srgb, var(--ifm-color-primary) 5%, transparent)",
          }}
        >
          {current.details && <span>{current.details} </span>}
          {current.to && (
            <Link to={current.to} style={{ fontWeight: 600 }}>
              {current.toLabel ?? "Open the guide →"}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
