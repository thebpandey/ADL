import React from "react";

interface VideoProps {
  src: string;
  title: string;
  poster?: string;
}

export default function Video({ src, title, poster }: VideoProps) {
  return (
    <figure style={{ marginBottom: "1.5rem" }}>
      <div
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid var(--adl-border-color)",
          boxShadow: "var(--ifm-global-shadow-lw)",
        }}
      >
        <video
          controls
          preload="metadata"
          poster={poster}
          style={{ width: "100%", display: "block" }}
          aria-label={title}
        >
          <source src={src} />
          Your browser does not support video playback.
        </video>
      </div>
      <figcaption
        style={{
          textAlign: "center",
          fontSize: "0.8125rem",
          color: "var(--adl-text-muted)",
          marginTop: "0.5rem",
        }}
      >
        {title}
      </figcaption>
    </figure>
  );
}
