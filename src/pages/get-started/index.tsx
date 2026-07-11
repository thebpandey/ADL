/**
 * /get-started — the guided installer and compatibility wizard.
 */
import React from "react";
import Link from "@docusaurus/Link";
import BrowserOnly from "@docusaurus/BrowserOnly";
import Layout from "@theme/Layout";
import Wizard from "@site/src/components/GetStarted/Wizard";

export default function GetStartedPage(): React.JSX.Element {
  return (
    <Layout
      title="Get Started — Personalized Linux installation guide"
      description="Answer a few questions about your Android device, check compatibility, and get a personalized step-by-step guide to a working Linux desktop. Runs entirely in your browser — no account, nothing uploaded."
    >
      <main>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 1rem 0" }}>
          <h1 style={{ marginBottom: "0.5rem" }}>Get started</h1>
          <p style={{ color: "var(--adl-text-muted)", lineHeight: 1.6 }}>
            Answer a few questions about your phone, what you want to build, and the hardware you have. You'll
            get a transparent compatibility assessment — every conclusion shows its status, confidence, and
            reason — and a personalized, step-by-step installation guide. Everything runs locally in your
            browser: no account, and your answers never leave this device.{" "}
            <Link to="/docs/get-started/start-here">What this wizard does and doesn't do.</Link>
          </p>
        </div>
        <noscript>
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "1rem" }}>
            <p>
              <strong>The interactive wizard needs JavaScript.</strong> Everything it produces is also available
              as regular documentation:
            </p>
            <ul>
              <li>
                <a href="/ADL/docs/quick-start/overview">Quick Start</a> — the standard installation path
                (Termux → Debian/Ubuntu → Xfce), step by step.
              </li>
              <li>
                <a href="/ADL/docs/get-started/methodology">Compatibility methodology</a> — how to assess your
                device manually.
              </li>
              <li>
                <a href="/ADL/docs/compatibility/overview">Device compatibility matrix</a>.
              </li>
            </ul>
          </div>
        </noscript>
        <BrowserOnly fallback={<div style={{ maxWidth: 860, margin: "0 auto", padding: "1rem" }}>Loading the wizard…</div>}>
          {() => <Wizard />}
        </BrowserOnly>
      </main>
    </Layout>
  );
}
