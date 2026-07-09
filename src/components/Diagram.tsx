import React from "react";

interface DiagramProps {
  src: string;
  alt: string;
  caption?: string;
}

export default function Diagram({ src, alt, caption }: DiagramProps) {
  return (
    <figure style={{ marginBottom: "1.5rem", textAlign: "center" }}>
      <div
        style={{
          display: "inline-block",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid var(--adl-border-color)",
          boxShadow: "var(--ifm-global-shadow-lw)",
          background: "var(--adl-card-bg)",
          padding: "1.5rem",
          maxWidth: "100%",
        }}
      >
        <img src={src} alt={alt} style={{ maxWidth: "100%", height: "auto", display: "block" }} loading="lazy" />
      </div>
      {caption && (
        <figcaption style={{ fontSize: "0.8125rem", color: "var(--adl-text-muted)", marginTop: "0.5rem" }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
