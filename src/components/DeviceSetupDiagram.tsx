import React from "react";

interface DeviceSetupDiagramProps {
  /** "hub" shows phone -> USB-C hub -> peripherals; "dex" shows the Samsung DeX desktop workflow. */
  variant?: "hub" | "dex";
  title?: string;
}

const box: React.CSSProperties = {
  fill: "var(--adl-card-bg, #fff)",
  stroke: "var(--ifm-color-emphasis-400)",
  strokeWidth: 2.5,
};

const label: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  fill: "var(--ifm-font-color-base)",
  fontFamily: "var(--ifm-font-family-base)",
};

const wire = (
  d: string,
  key?: string,
): React.ReactElement => (
  <path
    key={key}
    d={d}
    fill="none"
    stroke="var(--ifm-color-primary)"
    strokeWidth="3"
    strokeLinecap="round"
  />
);

/**
 * Original illustration of the physical desk setup. Two variants:
 * a USB-C hub fan-out and a Samsung DeX workflow.
 */
export default function DeviceSetupDiagram({ variant = "hub", title }: DeviceSetupDiagramProps) {
  if (variant === "dex") {
    const t = title ?? "Samsung DeX workflow: phone connects to a monitor and shows the DeX desktop while the phone stays usable";
    return (
      <div className="adl-figure">
        <svg viewBox="0 0 560 240" role="img" aria-label={t} style={{ width: "100%", maxWidth: 560, height: "auto" }}>
          <title>{t}</title>
          {/* Phone */}
          <rect x="24" y="60" width="70" height="130" rx="12" style={box} />
          <rect x="32" y="72" width="54" height="96" rx="4" fill="var(--ifm-color-primary)" opacity="0.15" />
          <text x="59" y="215" textAnchor="middle" style={label}>Phone</text>
          {/* Arrow with USB-C label */}
          {wire("M 100 125 H 180")}
          <polygon points="180,119 192,125 180,131" fill="var(--ifm-color-primary)" />
          <text x="140" y="112" textAnchor="middle" style={{ ...label, fontSize: 11, fill: "var(--ifm-color-primary)" }}>USB-C / HDMI</text>
          {/* Monitor with DeX desktop */}
          <rect x="200" y="30" width="250" height="150" rx="10" style={box} />
          <rect x="210" y="40" width="230" height="130" rx="4" fill="var(--ifm-color-primary)" opacity="0.1" />
          <rect x="210" y="152" width="230" height="18" fill="var(--ifm-color-primary)" opacity="0.5" />
          <rect x="222" y="52" width="100" height="70" rx="4" fill="var(--adl-card-bg, #fff)" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5" />
          <rect x="334" y="66" width="92" height="70" rx="4" fill="var(--adl-card-bg, #fff)" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5" />
          <text x="325" y="215" textAnchor="middle" style={label}>DeX desktop on the monitor</text>
          {/* Keyboard + mouse */}
          <rect x="470" y="70" width="70" height="26" rx="6" style={box} />
          <text x="505" y="87" textAnchor="middle" style={{ ...label, fontSize: 10 }}>Keyboard</text>
          <ellipse cx="505" cy="130" rx="16" ry="22" style={box} />
          <text x="505" y="176" textAnchor="middle" style={{ ...label, fontSize: 10 }}>Mouse</text>
          {wire("M 468 83 H 452")}
          {wire("M 487 130 H 452")}
        </svg>
      </div>
    );
  }

  const t = title ?? "USB-C hub connecting an Android phone to power, a display, a keyboard, and a mouse";
  return (
    <div className="adl-figure">
      <svg viewBox="0 0 560 260" role="img" aria-label={t} style={{ width: "100%", maxWidth: 560, height: "auto" }}>
        <title>{t}</title>
        {/* Phone */}
        <rect x="24" y="80" width="70" height="130" rx="12" style={box} />
        <rect x="32" y="92" width="54" height="96" rx="4" fill="var(--ifm-color-primary)" opacity="0.15" />
        <text x="59" y="235" textAnchor="middle" style={label}>Phone</text>
        {/* Hub */}
        <rect x="180" y="120" width="120" height="50" rx="10" style={box} />
        <circle cx="205" cy="145" r="5" fill="var(--ifm-color-primary)" opacity="0.5" />
        <circle cx="225" cy="145" r="5" fill="var(--ifm-color-primary)" opacity="0.5" />
        <circle cx="245" cy="145" r="5" fill="var(--ifm-color-primary)" opacity="0.5" />
        <rect x="262" y="140" width="24" height="10" rx="3" fill="var(--ifm-color-primary)" opacity="0.5" />
        <text x="240" y="192" textAnchor="middle" style={label}>USB-C hub</text>
        {/* Phone -> hub */}
        {wire("M 100 145 H 176", "w1")}
        {/* Hub -> monitor */}
        {wire("M 300 132 C 340 110 350 80 380 66", "w2")}
        <rect x="384" y="24" width="150" height="90" rx="8" style={box} />
        <rect x="392" y="32" width="134" height="74" rx="4" fill="var(--ifm-color-primary)" opacity="0.12" />
        <text x="459" y="134" textAnchor="middle" style={label}>Display (HDMI)</text>
        {/* Hub -> keyboard */}
        {wire("M 300 152 C 340 158 350 168 380 172", "w3")}
        <rect x="384" y="158" width="110" height="28" rx="6" style={box} />
        <text x="439" y="176" textAnchor="middle" style={{ ...label, fontSize: 11 }}>Keyboard (USB-A)</text>
        {/* Hub -> mouse */}
        {wire("M 296 168 C 330 196 340 214 366 222", "w4")}
        <ellipse cx="390" cy="226" rx="15" ry="20" style={box} />
        <text x="432" y="230" style={{ ...label, fontSize: 11 }}>Mouse</text>
        {/* Power -> hub */}
        {wire("M 240 174 V 216", "w5")}
        <rect x="214" y="218" width="52" height="30" rx="6" style={box} />
        <text x="240" y="238" textAnchor="middle" style={{ ...label, fontSize: 11 }}>⚡ PD</text>
        <text x="164" y="252" style={{ ...label, fontSize: 11, fill: "var(--adl-text-muted, var(--ifm-color-emphasis-600))" }}>Charger keeps the phone powered</text>
      </svg>
    </div>
  );
}
