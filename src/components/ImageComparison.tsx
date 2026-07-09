import React from "react";

interface ImageComparisonProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt?: string;
}

export default function ImageComparison({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  alt = "Comparison",
}: ImageComparisonProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
        marginBottom: "1.5rem",
      }}
    >
      {[
        { src: before, label: beforeLabel },
        { src: after, label: afterLabel },
      ].map(({ src, label }) => (
        <figure key={label} style={{ margin: 0 }}>
          <div
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid var(--adl-border-color)",
              boxShadow: "var(--ifm-global-shadow-lw)",
            }}
          >
            <img src={src} alt={`${alt} — ${label}`} style={{ width: "100%", display: "block" }} loading="lazy" />
          </div>
          <figcaption
            style={{
              textAlign: "center",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--adl-text-muted)",
              marginTop: "0.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
