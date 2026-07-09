import React from "react";

interface TerminalProps {
  title?: string;
  children: React.ReactNode;
}

export default function Terminal({ title = "Terminal", children }: TerminalProps) {
  return (
    <div
      className="adl-terminal"
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        marginBottom: "1.5rem",
        border: "1px solid var(--adl-border-color)",
        boxShadow: "var(--ifm-global-shadow-lw)",
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "0.5rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span style={{ display: "flex", gap: "6px" }}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#eab308", display: "inline-block" }} />
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
        </span>
        <span style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 500, marginLeft: "0.5rem" }}>{title}</span>
      </div>
      <div
        style={{
          background: "#0f172a",
          color: "#e2e8f0",
          padding: "1rem",
          fontFamily: "var(--ifm-font-family-monospace)",
          fontSize: "0.8125rem",
          lineHeight: 1.7,
          overflowX: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}
