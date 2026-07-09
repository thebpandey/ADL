import React from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HeroIllustration from "@site/src/components/HeroIllustration";
import DeviceSetupDiagram from "@site/src/components/DeviceSetupDiagram";
import styles from "./index.module.css";

const tracks = [
  {
    icon: "🚀",
    title: "Quick Start",
    description:
      "The guided path: install Termux, Ubuntu, and a desktop in about an hour.",
    to: "/docs/quick-start/overview",
  },
  {
    icon: "📚",
    title: "Learn",
    description:
      "Understand the concepts — Termux, proot, display servers, and the hardware.",
    to: "/docs/category/learn",
  },
  {
    icon: "🔍",
    title: "Reference",
    description:
      "Look things up: commands, configuration files, and compatibility tables.",
    to: "/docs/category/reference",
  },
];

const features = [
  {
    icon: "🖥️",
    title: "Full Desktop Environment",
    description:
      "Run XFCE, LXDE, or other desktop environments directly on your Android device with full window management and multitasking.",
  },
  {
    icon: "📱",
    title: "Samsung DeX Integration",
    description:
      "Connect a monitor, keyboard, and mouse to your Samsung device and use a full Linux desktop alongside your Android apps.",
  },
  {
    icon: "⚡",
    title: "No Root Required",
    description:
      "ADL runs entirely in userspace using Termux and proot. No root access, no unlocked bootloader, no voided warranty.",
  },
  {
    icon: "📦",
    title: "Real Linux Packages",
    description:
      "Install and run thousands of Linux packages from official repositories. Use apt, Python, Node.js, Docker, and more.",
  },
  {
    icon: "🔒",
    title: "Secure by Design",
    description:
      "Everything runs sandboxed within Android's security model. Your device stays protected while you run a full desktop.",
  },
  {
    icon: "🌐",
    title: "Open Source",
    description:
      "ADL is completely free and open source. Inspect the code, contribute improvements, or fork it for your own needs.",
  },
];

const quickStartSteps = [
  {
    step: 1,
    title: "Install Termux",
    description:
      "Download Termux from F-Droid, the trusted open-source Android app repository. This gives you a Linux terminal on Android.",
  },
  {
    step: 2,
    title: "Run the Setup Script",
    description:
      "Execute the ADL setup script in Termux. It downloads a Linux distribution and configures your desktop environment automatically.",
  },
  {
    step: 3,
    title: "Launch Your Desktop",
    description:
      "Start the desktop environment and open Termux:X11. You now have a full Linux desktop running on your Android device.",
  },
];

const roadmap = [
  {
    phase: "Phase 1 — Foundation",
    title: "Core Documentation",
    items: [
      "Installation guides for all devices",
      "Desktop environment setup",
      "Package management basics",
      "Troubleshooting guides",
    ],
  },
  {
    phase: "Phase 2 — Expansion",
    title: "Advanced Guides",
    items: [
      "Samsung DeX optimization",
      "Development environment setup",
      "Performance tuning",
      "Hardware acceleration",
    ],
  },
  {
    phase: "Phase 3 — Ecosystem",
    title: "Applications & Workflows",
    items: [
      "Application compatibility database",
      "Workflow automation",
      "Media and creative tools",
      "Server and networking",
    ],
  },
  {
    phase: "Phase 4 — Community",
    title: "Community & Growth",
    items: [
      "Contribution guides",
      "Community showcase",
      "Video tutorials",
      "Localization support",
    ],
  },
];

const community = [
  {
    icon: "💬",
    title: "GitHub Discussions",
    description: "Ask questions, share tips, and connect with other ADL users.",
    href: "https://github.com/thebpandey/ADL/discussions",
  },
  {
    icon: "🐛",
    title: "Report Issues",
    description:
      "Found a bug or have a suggestion? Open an issue on GitHub to help us improve.",
    href: "https://github.com/thebpandey/ADL/issues",
  },
  {
    icon: "🤝",
    title: "Contribute",
    description:
      "Help improve the documentation, submit fixes, or add new guides for the community.",
    href: "https://github.com/thebpandey/ADL",
  },
];

function Hero() {
  return (
    <header className={styles.hero}>
      <div
        className={styles.heroInner}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2.5rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 320px", minWidth: 280 }}>
          <div className={styles.heroBadge}>Open Source Project</div>
          <h1 className={styles.heroTitle}>
            A Full Linux Desktop
            <br />
            on Your Android Device
          </h1>
          <p className={styles.heroSubtitle}>
            Run desktop Linux environments on Android phones and tablets. No root
            required. Works with Samsung DeX for a complete workstation experience.
          </p>
          <div className={styles.heroButtons}>
            <Link className={styles.btnPrimary} to="/docs/quick-start/overview">
              Quick Start
            </Link>
            <Link
              className={styles.btnSecondary}
              href="https://github.com/thebpandey/ADL"
            >
              GitHub
            </Link>
          </div>
        </div>
        <div style={{ flex: "1 1 320px", minWidth: 280 }}>
          <HeroIllustration />
        </div>
      </div>
    </header>
  );
}

function Tracks() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <span className={styles.sectionLabel}>Documentation</span>
        <h2 className={styles.sectionTitle}>Three ways in</h2>
        <p className={styles.sectionDescription}>
          Follow the guided path, learn how it all works, or jump straight to
          the reference you need.
        </p>
        <div className="adl-card-grid">
          {tracks.map((t) => (
            <Link
              key={t.title}
              to={t.to}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div
                className="adl-visual-card"
                style={{
                  border: "1px solid var(--adl-border-color)",
                  borderRadius: 12,
                  padding: "1.25rem 1.4rem",
                  background: "var(--adl-card-bg, transparent)",
                  height: "100%",
                }}
              >
                <div aria-hidden="true" style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
                  {t.icon}
                </div>
                <div style={{ fontWeight: 700, fontSize: "1.0625rem", marginBottom: "0.35rem", color: "var(--ifm-font-color-base)" }}>
                  {t.title}
                </div>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.6, margin: 0, color: "var(--adl-text-muted, var(--ifm-color-emphasis-700))" }}>
                  {t.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeskSetup() {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.sectionInner}>
        <span className={styles.sectionLabel}>The setup</span>
        <h2 className={styles.sectionTitle}>One phone, one hub, a whole desk</h2>
        <p className={styles.sectionDescription}>
          A USB-C hub connects your phone to a monitor, keyboard, mouse, and
          power — everything you need for a workstation.
        </p>
        <DeviceSetupDiagram />
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <span className={styles.sectionLabel}>Features</span>
        <h2 className={styles.sectionTitle}>Everything you need to get started</h2>
        <p className={styles.sectionDescription}>
          ADL transforms your Android device into a portable Linux workstation
          with real desktop environments and full package management.
        </p>
        <div className={styles.featureGrid}>
          {features.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDescription}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickStart() {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.sectionInner}>
        <span className={styles.sectionLabel}>Quick Start</span>
        <h2 className={styles.sectionTitle}>Up and running in minutes</h2>
        <p className={styles.sectionDescription}>
          Go from a stock Android device to a full Linux desktop in three steps.
          No technical experience required.
        </p>
        <div className={styles.quickStartGrid}>
          {quickStartSteps.map((s) => (
            <div key={s.step} className={styles.stepCard}>
              <div className={styles.stepNumber}>{s.step}</div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDescription}>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Roadmap() {
  return (
    <section className={styles.section}>
      <div className={`${styles.sectionInner} ${styles.sectionCenter}`}>
        <span className={styles.sectionLabel}>Roadmap</span>
        <h2 className={styles.sectionTitle}>Documentation roadmap</h2>
        <p className={styles.sectionDescription}>
          We are building comprehensive documentation for every aspect of
          Android Desktop Linux. Here is what is planned.
        </p>
        <div className={styles.roadmapTimeline}>
          {roadmap.map((r) => (
            <div key={r.phase} className={styles.roadmapCard}>
              <div className={styles.roadmapPhase}>{r.phase}</div>
              <h3 className={styles.roadmapTitle}>{r.title}</h3>
              <ul className={styles.roadmapItems}>
                {r.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Community() {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={`${styles.sectionInner} ${styles.sectionCenter}`}>
        <span className={styles.sectionLabel}>Community</span>
        <h2 className={styles.sectionTitle}>Join the community</h2>
        <p className={styles.sectionDescription}>
          ADL is built by the community, for the community. Get help, share your
          setup, or contribute to the project.
        </p>
        <div className={styles.communityGrid}>
          {community.map((c) => (
            <a
              key={c.title}
              className={styles.communityCard}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.communityIcon}>{c.icon}</div>
              <h3 className={styles.communityTitle}>{c.title}</h3>
              <p className={styles.communityDescription}>{c.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Run desktop Linux environments on Android phones and tablets. No root required. Complete documentation for Android Desktop Linux."
    >
      <Hero />
      <main>
        <Tracks />
        <Features />
        <DeskSetup />
        <QuickStart />
        <Roadmap />
        <Community />
      </main>
    </Layout>
  );
}
