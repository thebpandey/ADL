import React from "react";
import Link from "@docusaurus/Link";
import sponsors from "@site/src/data/sponsors.json";

interface Sponsor {
  name: string;
  url?: string;
  avatar?: string;
  source?: string;
}

/**
 * Donor & sponsor recognition banner for the homepage.
 * Data comes from src/data/sponsors.json, kept up to date automatically by
 * .github/workflows/sponsors.yml (GitHub Sponsors) and manual entries
 * (Buy Me a Coffee / Cash App donors who opt in to recognition).
 * When there are no sponsors yet, it shows a quiet invitation instead.
 */
export default function SponsorsBanner() {
  const list = sponsors as Sponsor[];
  return (
    <section
      aria-label="Donor and sponsor recognition"
      style={{
        borderTop: "1px solid var(--adl-border-color)",
        borderBottom: "1px solid var(--adl-border-color)",
        background:
          "color-mix(in srgb, var(--ifm-color-primary) 4%, transparent)",
        padding: "0.9rem 1rem",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          flexWrap: "wrap",
          fontSize: "0.875rem",
          textAlign: "center",
        }}
      >
        {list.length > 0 ? (
          <>
            <span aria-hidden="true">💖</span>
            <span style={{ fontWeight: 600 }}>
              Thank you to our sponsors and donors:
            </span>
            <span style={{ display: "inline-flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center" }}>
              {list.map((s) =>
                s.url ? (
                  <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
                    {s.name}
                  </a>
                ) : (
                  <span key={s.name} style={{ fontWeight: 600 }}>{s.name}</span>
                ),
              )}
            </span>
            <Link to="/docs/support-adl">Support ADL →</Link>
          </>
        ) : (
          <>
            <span aria-hidden="true">💖</span>
            <span>
              ADL is free and open-source — donations are optional.{" "}
              <Link to="/docs/support-adl" style={{ fontWeight: 600 }}>
                Support ADL →
              </Link>
            </span>
          </>
        )}
      </div>
    </section>
  );
}
