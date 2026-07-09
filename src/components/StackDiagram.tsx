import React from "react";

interface StackLayer {
  name: string;
  detail?: string;
}

interface StackDiagramProps {
  title?: string;
  layers?: StackLayer[];
}

const DEFAULT_LAYERS: StackLayer[] = [
  { name: "XFCE Desktop", detail: "The desktop environment you see and use" },
  { name: "Ubuntu", detail: "A full Linux distribution with apt and thousands of packages" },
  { name: "proot-distro", detail: "Runs Ubuntu in userspace — no root required" },
  { name: "Termux", detail: "The Linux terminal environment on Android" },
  { name: "Android", detail: "Your phone's operating system — untouched" },
];

/**
 * Layered architecture diagram: how XFCE runs on Ubuntu on proot on
 * Termux on Android. Top layer = what the user sees.
 */
export default function StackDiagram({ title = "The ADL software stack", layers = DEFAULT_LAYERS }: StackDiagramProps) {
  return (
    <figure
      className="adl-figure"
      role="img"
      aria-label={`${title}: ${layers.map((l) => l.name).join(", over ")}`}
      style={{ margin: "0 0 1.5rem", maxWidth: 560 }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {layers.map((layer, i) => {
          const emphasis = 1 - i * 0.16;
          return (
            <div
              key={layer.name}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.75rem",
                flexWrap: "wrap",
                border: "1px solid var(--adl-border-color)",
                borderLeft: `4px solid var(--ifm-color-primary)`,
                borderRadius: 10,
                padding: "0.6rem 1rem",
                background: `color-mix(in srgb, var(--ifm-color-primary) ${Math.max(emphasis * 14, 3)}%, var(--adl-card-bg, transparent))`,
              }}
            >
              <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{layer.name}</span>
              {layer.detail && (
                <span style={{ fontSize: "0.8125rem", color: "var(--adl-text-muted, var(--ifm-color-emphasis-600))" }}>
                  {layer.detail}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <figcaption
        style={{
          fontSize: "0.75rem",
          color: "var(--adl-text-muted, var(--ifm-color-emphasis-600))",
          marginTop: "0.5rem",
          textAlign: "center",
        }}
      >
        {title} — each layer runs on the one below it
      </figcaption>
    </figure>
  );
}
