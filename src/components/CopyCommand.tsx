import React, { useState, useCallback } from "react";

interface CopyCommandProps {
  command: string;
}

export default function CopyCommand({ command }: CopyCommandProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [command]);

  return (
    <div
      className="adl-copy-command"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        background: "var(--adl-code-bg)",
        border: "1px solid var(--adl-border-color)",
        borderRadius: "10px",
        padding: "0.625rem 0.75rem 0.625rem 1rem",
        marginBottom: "1rem",
        fontFamily: "var(--ifm-font-family-monospace)",
        fontSize: "0.8125rem",
      }}
    >
      <span style={{ color: "var(--adl-text-muted)", userSelect: "none" }}>$</span>
      <code style={{ flex: 1, background: "none", border: "none", padding: 0, fontSize: "inherit" }}>{command}</code>
      <button
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy command"}
        style={{
          background: "none",
          border: "1px solid var(--adl-border-color)",
          borderRadius: "6px",
          padding: "0.25rem 0.5rem",
          cursor: "pointer",
          fontSize: "0.75rem",
          color: copied ? "#16a34a" : "var(--adl-text-muted)",
          fontWeight: 500,
          transition: "color 0.15s ease",
          whiteSpace: "nowrap",
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
