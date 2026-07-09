import React from "react";

interface DownloadCardProps {
  name: string;
  description: string;
  url: string;
  version?: string;
  size?: string;
  icon?: string;
}

export default function DownloadCard({ name, description, url, version, size, icon = "📥" }: DownloadCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        border: "1px solid var(--adl-border-color)",
        borderRadius: "12px",
        padding: "1.25rem",
        marginBottom: "1rem",
        background: "var(--adl-card-bg)",
        textDecoration: "none",
        color: "inherit",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--ifm-color-primary)";
        e.currentTarget.style.boxShadow = "var(--ifm-global-shadow-md)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--adl-border-color)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
        <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{name}</span>
            {version && (
              <span style={{
                fontSize: "0.6875rem", fontWeight: 600, background: "var(--adl-badge-bg)", color: "var(--adl-badge-color)",
                padding: "0.15rem 0.5rem", borderRadius: "100px",
              }}>
                {version}
              </span>
            )}
          </div>
          <p style={{ fontSize: "0.8125rem", color: "var(--adl-text-muted)", margin: "0.25rem 0 0", lineHeight: 1.5 }}>{description}</p>
        </div>
        {size && <span style={{ fontSize: "0.75rem", color: "var(--adl-text-muted)", whiteSpace: "nowrap", flexShrink: 0 }}>{size}</span>}
      </div>
    </a>
  );
}
