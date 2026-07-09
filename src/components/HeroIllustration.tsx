import React from "react";

/**
 * Original abstract illustration: Android phone driving an external monitor.
 * Inline SVG, themed via CSS variables so it adapts to light/dark mode.
 */
export default function HeroIllustration({
  title = "An Android phone connected to an external monitor showing a Linux desktop",
}: {
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 560 360"
      role="img"
      aria-label={title}
      style={{ width: "100%", maxWidth: 560, height: "auto", display: "block" }}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id="adl-hero-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--ifm-color-primary)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--ifm-color-primary)" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* Monitor */}
      <rect x="150" y="30" width="380" height="240" rx="14" fill="var(--adl-card-bg, #fff)" stroke="var(--ifm-color-emphasis-400)" strokeWidth="3" />
      <rect x="166" y="46" width="348" height="208" rx="6" fill="url(#adl-hero-screen)" />
      {/* Desktop: panel + windows */}
      <rect x="166" y="46" width="348" height="20" rx="6" fill="var(--ifm-color-primary)" opacity="0.75" />
      <circle cx="178" cy="56" r="4" fill="var(--adl-card-bg, #fff)" />
      <circle cx="192" cy="56" r="4" fill="var(--adl-card-bg, #fff)" opacity="0.7" />
      <rect x="186" y="86" width="180" height="120" rx="6" fill="var(--adl-card-bg, #fff)" stroke="var(--ifm-color-emphasis-300)" strokeWidth="2" />
      <rect x="186" y="86" width="180" height="18" rx="6" fill="var(--ifm-color-emphasis-200)" />
      <rect x="198" y="116" width="120" height="7" rx="3.5" fill="var(--ifm-color-emphasis-300)" />
      <rect x="198" y="132" width="150" height="7" rx="3.5" fill="var(--ifm-color-emphasis-300)" />
      <rect x="198" y="148" width="96" height="7" rx="3.5" fill="var(--ifm-color-primary)" opacity="0.6" />
      <rect x="198" y="164" width="132" height="7" rx="3.5" fill="var(--ifm-color-emphasis-300)" />
      <rect x="386" y="106" width="110" height="86" rx="6" fill="var(--adl-card-bg, #fff)" stroke="var(--ifm-color-emphasis-300)" strokeWidth="2" />
      <rect x="386" y="106" width="110" height="16" rx="6" fill="var(--ifm-color-primary)" opacity="0.35" />
      <rect x="396" y="132" width="80" height="6" rx="3" fill="var(--ifm-color-emphasis-300)" />
      <rect x="396" y="146" width="64" height="6" rx="3" fill="var(--ifm-color-emphasis-300)" />
      <rect x="396" y="160" width="88" height="6" rx="3" fill="var(--ifm-color-emphasis-300)" />
      {/* Monitor stand */}
      <rect x="320" y="270" width="40" height="34" rx="4" fill="var(--ifm-color-emphasis-400)" />
      <rect x="270" y="304" width="140" height="12" rx="6" fill="var(--ifm-color-emphasis-400)" />

      {/* Phone */}
      <rect x="30" y="130" width="96" height="190" rx="16" fill="var(--adl-card-bg, #fff)" stroke="var(--ifm-color-emphasis-400)" strokeWidth="3" />
      <rect x="40" y="146" width="76" height="150" rx="6" fill="url(#adl-hero-screen)" />
      <rect x="48" y="160" width="60" height="7" rx="3.5" fill="var(--ifm-color-primary)" opacity="0.6" />
      <rect x="48" y="176" width="44" height="6" rx="3" fill="var(--ifm-color-emphasis-300)" />
      <rect x="48" y="190" width="54" height="6" rx="3" fill="var(--ifm-color-emphasis-300)" />
      <text x="78" y="240" textAnchor="middle" fontSize="26" fill="var(--ifm-color-primary)" fontFamily="monospace" fontWeight="bold" opacity="0.85">
        &gt;_
      </text>
      <rect x="64" y="302" width="28" height="5" rx="2.5" fill="var(--ifm-color-emphasis-400)" />

      {/* USB-C cable */}
      <path
        d="M 126 250 C 190 250 180 300 240 304"
        fill="none"
        stroke="var(--ifm-color-primary)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="1 9"
      />
      <circle cx="126" cy="250" r="5" fill="var(--ifm-color-primary)" />
      <circle cx="240" cy="304" r="5" fill="var(--ifm-color-primary)" />
    </svg>
  );
}
