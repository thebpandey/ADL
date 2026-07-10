import React from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import DeviceSetupDiagram from "@site/src/components/DeviceSetupDiagram";
import SponsorsBanner from "@site/src/components/SponsorsBanner";
import HeroImage from "@site/src/components/HeroImage";
import styles from "./index.module.css";

const adlIs = [
  "Open documentation for desktop Linux on Android",
  "Reproducible, beginner-friendly installation guidance",
  "Linux education for Android users",
  "Hardware compatibility information",
  "Device and desktop-mode research",
  "Troubleshooting documentation",
  "Community testing and verification",
  "A long-term, vendor-neutral technical reference",
];

const adlIsNot = [
  "A Linux distribution",
  "A replacement Android operating system",
  "A desktop environment",
  "A commercial product",
  "A single installer or setup script",
  "A vendor-specific support site",
  "A replacement for Termux, Local Desktop, or Samsung DeX",
];

const fragmentedSources = [
  "GitHub repositories",
  "Forum discussions",
  "Reddit threads",
  "Videos",
  "Package documentation",
  "Outdated tutorials",
  "Device-specific instructions",
];

const missionValues = [
  {
    title: "Accessible to beginners",
    description:
      "Every step is spelled out — no prior Linux or terminal experience assumed.",
  },
  {
    title: "Accurate",
    description:
      "Commands are verified against official sources before they are published.",
  },
  {
    title: "Vendor-neutral",
    description:
      "No single distribution, desktop environment, manufacturer, or tool is required.",
  },
  {
    title: "Community-driven",
    description:
      "Real reports from real hardware are welcomed, reviewed, and credited.",
  },
  {
    title: "Transparently verified",
    description:
      "Every compatibility claim carries a status; nothing is recorded above what was tested.",
  },
  {
    title: "Maintained for the long term",
    description:
      "Documentation is kept current as the Android desktop ecosystem changes.",
  },
];

const findItems = [
  {
    icon: "🚀",
    title: "Getting Started",
    description:
      "Beginner-friendly paths from an Android phone to a working desktop.",
    to: "/docs/quick-start/overview",
  },
  {
    icon: "🧭",
    title: "Installation Guides",
    description:
      "Documented installation methods using supported tools and Linux distributions.",
    to: "/docs/installation/common/prerequisites",
  },
  {
    icon: "📚",
    title: "Learning Linux",
    description:
      "Plain-language explanations of Termux, proot, distributions, desktops, package managers, filesystems, and commands.",
    to: "/docs/category/learn",
  },
  {
    icon: "🔌",
    title: "Hardware Guidance",
    description:
      "Phones, docks, displays, input devices, storage, cables, and workstation setups.",
    to: "/docs/learn/hardware/recommended-setup",
  },
  {
    icon: "🧩",
    title: "Compatibility Database",
    description:
      "Structured device, Android-version, desktop-mode, Linux, desktop-environment, and peripheral compatibility.",
    to: "/docs/compatibility/overview",
  },
  {
    icon: "🖥️",
    title: "Desktop Environments",
    description:
      "Guidance comparing XFCE, LXQt, KDE Plasma, GNOME, MATE, Cinnamon, and more.",
    to: "/docs/desktop-environments/overview",
  },
  {
    icon: "🧰",
    title: "Applications",
    description:
      "Browsers, development tools, office apps, terminals, file management, and media tools.",
    to: "/docs/applications/overview",
  },
  {
    icon: "🛠️",
    title: "Troubleshooting",
    description:
      "Systematic help for installation, display, permissions, package, performance, audio, and input problems.",
    to: "/docs/troubleshooting/overview",
  },
  {
    icon: "🔍",
    title: "Reference Library",
    description:
      "Commands, configuration files, scripts, glossary terms, architecture diagrams, and official sources.",
    to: "/docs/category/reference",
  },
  {
    icon: "🤝",
    title: "Community Knowledge",
    description:
      "Community testing, verified configurations, compatibility reports, and contributor workflows.",
    to: "/docs/category/contributing",
  },
];

const installationMethods = [
  "Termux",
  "Termux:X11",
  "Local Desktop",
  "Ubuntu",
  "Debian",
  "Arch Linux",
  "Fedora",
  "Alpine Linux",
  "Samsung DeX",
  "Manufacturer desktop modes",
  "Manual proot installations",
];

const methodStatuses = [
  { label: "Documented", description: "Written up in the docs." },
  { label: "Planned", description: "On the roadmap, not yet documented." },
  { label: "Experimental", description: "Documented but not broadly validated." },
  { label: "Community Tested", description: "Reproduced by community reporters." },
  { label: "Maintainer Verified", description: "Reproduced by a maintainer on reference hardware." },
  { label: "Needs Testing", description: "Based on specs, not yet verified." },
];

const openPrinciples = [
  "The documentation is open source and version controlled.",
  "Compatibility data is structured and published openly.",
  "Improvements happen in public, in the open repository.",
  "Anyone can report an error or propose a change.",
  "Maintainers review every change before it is published.",
  "The project stays vendor-neutral and freely accessible.",
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
      "More distributions and desktops",
      "Development environment setup",
      "Performance tuning",
      "Hardware acceleration research",
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
      "Broader device compatibility",
      "Verified configurations",
      "Community showcase",
      "Localization support",
    ],
  },
];

const community = [
  {
    icon: "💖",
    title: "Support ADL",
    description:
      "ADL is free and open-source — donations are optional. Sponsor the project or buy the maintainer a coffee.",
    href: "/docs/support-adl",
  },
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
      "Found a bug or a gap in the docs? Open an issue on GitHub to help us improve.",
    href: "https://github.com/thebpandey/ADL/issues",
  },
  {
    icon: "🤝",
    title: "Contribute",
    description:
      "Improve the documentation, submit fixes, or report a tested configuration.",
    href: "/docs/category/contributing",
  },
];

function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroBadge}>
          An Open Source Project by Bhaskar Pandey
        </div>
        <h1 className={styles.heroTitle}>
          A Full Linux Desktop on Your Android Device
        </h1>
        <p className={styles.heroTagline}>
          The Open Knowledge Base for Desktop Linux on Android
        </p>
        <HeroImage
          image="hero-home.webp"
          alt="Friendly robot mascot at a desk running a full Linux desktop from an Android phone connected to a monitor, keyboard, and mouse"
        />
        <p className={styles.heroSubtitle}>
          Android Desktop Linux (ADL) is an open-source knowledge base that
          helps you turn a modern Android phone into a practical Linux desktop
          workstation — documenting the whole ecosystem, not a single install
          method.
        </p>
        <div className={styles.heroButtons}>
          <Link className={styles.btnPrimary} to="/docs/quick-start/overview">
            Get Started
          </Link>
          <Link className={styles.btnSecondary} to="/docs/intro">
            Browse Documentation
          </Link>
          <Link className={styles.btnSecondary} to="/docs/compatibility/overview">
            Compatibility
          </Link>
          <Link
            className={styles.btnSecondary}
            href="https://github.com/thebpandey/ADL"
          >
            GitHub Repository
          </Link>
        </div>
      </div>
    </header>
  );
}

function WhatIsADL() {
  return (
    <section className={styles.section}>
      <div className={`${styles.sectionInner} ${styles.sectionCenter}`}>
        <span className={styles.sectionLabel}>The knowledge base</span>
        <h2 className={styles.sectionTitle}>What is Android Desktop Linux?</h2>
        <p className={styles.sectionDescription}>
          ADL is an open knowledge base for people who want to use Android
          devices as practical Linux desktop computers. It organizes
          installation methods, hardware requirements, desktop environments,
          compatibility results, troubleshooting, and technical explanations
          into one continuously maintained reference — without requiring you to
          adopt one specific distribution, desktop, manufacturer, or tool.
        </p>
        <div className={styles.compareGrid}>
          <div className={styles.compareCard}>
            <div className={styles.compareHeading}>ADL is</div>
            <ul className={`${styles.compareList} ${styles.isList}`}>
              {adlIs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={styles.compareCard}>
            <div className={styles.compareHeading}>ADL is not</div>
            <ul className={`${styles.compareList} ${styles.isNotList}`}>
              {adlIsNot.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyExists() {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.sectionInner}>
        <span className={styles.sectionLabel}>Why</span>
        <h2 className={styles.sectionTitle}>Why ADL exists</h2>
        <p className={styles.sectionDescription}>
          Modern flagship Android phones have powerful processors, substantial
          memory, external-display output, Bluetooth peripheral support, and
          access to Linux userspace. But the knowledge to build a reliable
          Android desktop is fragmented across:
        </p>
        <div className={styles.chipRow}>
          {fragmentedSources.map((s) => (
            <span key={s} className={styles.chip}>
              {s}
            </span>
          ))}
        </div>
        <p
          className={styles.sectionDescription}
          style={{ marginTop: "1.75rem", marginBottom: 0 }}
        >
          ADL exists to organize that information into one open, structured,
          maintainable, and beginner-friendly knowledge base — with an emphasis
          on practical documentation, reproducible procedures, official
          sources, tested compatibility, clear troubleshooting, and long-term
          maintainability.
        </p>
      </div>
    </section>
  );
}

function Mission() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <span className={styles.sectionLabel}>Mission</span>
        <h2 className={styles.sectionTitle}>Our mission</h2>
        <p className={styles.sectionDescription}>
          Help people get more value from the Android hardware they already own
          by making desktop Linux on Android understandable, reproducible, and
          practical.
        </p>
        <div className={styles.featureGrid}>
          {missionValues.map((v) => (
            <div key={v.title} className={styles.featureCard}>
              <h3 className={styles.featureTitle}>{v.title}</h3>
              <p className={styles.featureDescription}>{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatYouWillFind() {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.sectionInner}>
        <span className={styles.sectionLabel}>What you will find</span>
        <h2 className={styles.sectionTitle}>One reference, many topics</h2>
        <p className={styles.sectionDescription}>
          Everything you need to plan, build, understand, and troubleshoot a
          desktop Linux setup on Android — organized so you can start anywhere.
        </p>
        <div className={styles.featureGrid}>
          {findItems.map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className={styles.featureCard}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDescription}>{f.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function InstallationMethods() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <span className={styles.sectionLabel}>Installation methods</span>
        <h2 className={styles.sectionTitle}>Many methods, one reference</h2>
        <p className={styles.sectionDescription}>
          ADL documents multiple approaches rather than promoting a single one.
          Not every method is complete, tested, or equally recommended — where
          supported, each carries a status so you know how much to trust it.
        </p>
        <div className={styles.chipRow}>
          {installationMethods.map((m) => (
            <span key={m} className={styles.chip}>
              {m}
            </span>
          ))}
        </div>
        <div className={styles.statusLegend}>
          {methodStatuses.map((s) => (
            <div key={s.label} className={styles.statusItem}>
              <strong>{s.label}</strong> — {s.description}
            </div>
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
          power — everything you need for a workstation. ADL documents the
          hardware classes that work.
        </p>
        <DeviceSetupDiagram />
      </div>
    </section>
  );
}

function BuiltInTheOpen() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <span className={styles.sectionLabel}>Open source</span>
        <h2 className={styles.sectionTitle}>Built in the open</h2>
        <p className={styles.sectionDescription}>
          ADL is developed publicly on GitHub. Public access does not mean
          unrestricted direct editing — contributions go through issues and
          pull requests, and maintainers review every change before it is
          published, so the reference stays accurate and vendor-neutral.
        </p>
        <div className={styles.featureGrid}>
          {openPrinciples.map((p) => (
            <div key={p} className={styles.featureCard}>
              <p className={styles.featureDescription}>{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Roadmap() {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={`${styles.sectionInner} ${styles.sectionCenter}`}>
        <span className={styles.sectionLabel}>Roadmap</span>
        <h2 className={styles.sectionTitle}>Documentation roadmap</h2>
        <p className={styles.sectionDescription}>
          We are building comprehensive documentation for every aspect of
          desktop Linux on Android. Here is what is planned.
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
    <section className={styles.section}>
      <div className={`${styles.sectionInner} ${styles.sectionCenter}`}>
        <span className={styles.sectionLabel}>Community</span>
        <h2 className={styles.sectionTitle}>Join the community</h2>
        <p className={styles.sectionDescription}>
          ADL is built in the open, by the community, for the community. Get
          help, share your setup, or contribute to the knowledge base.
        </p>
        <div className={styles.communityGrid}>
          {community.map((c) => {
            const isInternal = c.href.startsWith("/");
            const inner = (
              <>
                <div className={styles.communityIcon}>{c.icon}</div>
                <h3 className={styles.communityTitle}>{c.title}</h3>
                <p className={styles.communityDescription}>{c.description}</p>
              </>
            );
            return isInternal ? (
              <Link key={c.title} className={styles.communityCard} to={c.href}>
                {inner}
              </Link>
            ) : (
              <a
                key={c.title}
                className={styles.communityCard}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {inner}
              </a>
            );
          })}
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
      description="Android Desktop Linux is the open-source knowledge base for desktop Linux on Android, with installation guides, hardware compatibility, troubleshooting, technical reference material, and community-tested configurations."
    >
      <Hero />
      <SponsorsBanner />
      <main>
        <WhatIsADL />
        <WhyExists />
        <Mission />
        <WhatYouWillFind />
        <InstallationMethods />
        <DeskSetup />
        <BuiltInTheOpen />
        <Roadmap />
        <Community />
      </main>
    </Layout>
  );
}
