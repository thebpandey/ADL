import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

interface NavigatorLeaf {
  symptom: string;
  advice: string;
  to?: string;
  toLabel?: string;
}

interface NavigatorBranch {
  icon?: string;
  category: string;
  question: string;
  leaves: NavigatorLeaf[];
}

interface TroubleshootingNavigatorProps {
  title?: string;
  branches?: NavigatorBranch[];
}

const DEFAULT_BRANCHES: NavigatorBranch[] = [
  {
    icon: "🖥️",
    category: "Display issue",
    question: "Nothing on the monitor, or the desktop won't appear?",
    leaves: [
      { symptom: "No signal on the external monitor", advice: "Work through cable, dock, and monitor input first — most display problems are physical.", to: "/docs/troubleshooting/display", toLabel: "Display guide →" },
      { symptom: "Termux:X11 shows a black screen", advice: "The desktop process usually isn't running. Restart the launch script and check for errors.", to: "/docs/troubleshooting/display" },
      { symptom: "Wrong resolution or blurry text", advice: "Set the resolution manually in Termux:X11 preferences and adjust XFCE DPI scaling.", to: "/docs/troubleshooting/display" },
    ],
  },
  {
    icon: "📦",
    category: "Installation issue",
    question: "A command failed during setup?",
    leaves: [
      { symptom: "Download or fetch errors", advice: "Check the connection, then update package lists before retrying.", to: "/docs/troubleshooting/termux", toLabel: "Install fixes →" },
      { symptom: "No space left on device", advice: "Free at least 4 GB and clear the package cache.", to: "/docs/troubleshooting/termux" },
      { symptom: "proot-distro errors", advice: "Reinstall the Ubuntu container — your Termux home is untouched.", to: "/docs/troubleshooting/recovery" },
    ],
  },
  {
    icon: "🐢",
    category: "Performance issue",
    question: "Everything works but feels slow?",
    leaves: [
      { symptom: "Desktop is laggy", advice: "Close Android apps, disable XFCE compositing, and reboot before deeper tuning.", to: "/docs/troubleshooting/performance", toLabel: "Performance guide →" },
      { symptom: "Phone gets hot and throttles", advice: "Reduce background load and check thermals — sustained heat halves performance.", to: "/docs/performance/optimization" },
    ],
  },
  {
    icon: "🔒",
    category: "Permissions issue",
    question: "Permission denied when touching files?",
    leaves: [
      { symptom: "Can't access shared storage", advice: "Run termux-setup-storage and grant the Android permission when prompted.", to: "/docs/installation/common/termux-setup", toLabel: "Storage setup →" },
      { symptom: "Android revoked permissions", advice: "Check Settings > Apps > Termux > Permissions, then rerun the command.", to: "/docs/troubleshooting/termux" },
    ],
  },
  {
    icon: "🧩",
    category: "Package issue",
    question: "apt or pkg is complaining?",
    leaves: [
      { symptom: "Broken or held packages", advice: "Update package lists, then fix broken installs before retrying.", to: "/docs/learn/concepts/what-is-a-package-manager", toLabel: "Package recovery →" },
      { symptom: "Repository or mirror errors", advice: "Switch mirrors in Termux with termux-change-repo.", to: "/docs/troubleshooting/network" },
    ],
  },
];

/**
 * Interactive troubleshooting decision tree built from native collapsible
 * cards (details/summary), so it is keyboard accessible and works without
 * JavaScript.
 */
export default function TroubleshootingNavigator({
  title = "Troubleshooting navigator",
  branches = DEFAULT_BRANCHES,
}: TroubleshootingNavigatorProps) {
  return (
    <section className={styles.navigator} aria-label={title}>
      {branches.map((branch) => (
        <details key={branch.category} className={styles.branch}>
          <summary className={styles.summary}>
            {branch.icon && (
              <span aria-hidden="true" className={styles.icon}>
                {branch.icon}
              </span>
            )}
            <span className={styles.category}>{branch.category}</span>
            <span className={styles.question}>{branch.question}</span>
          </summary>
          <ul className={styles.leaves}>
            {branch.leaves.map((leaf) => (
              <li key={leaf.symptom} className={styles.leaf}>
                <span className={styles.symptom}>{leaf.symptom}</span>
                <span className={styles.advice}>
                  {leaf.advice}{" "}
                  {leaf.to && (
                    <Link to={leaf.to} className={styles.link}>
                      {leaf.toLabel ?? "Open the guide →"}
                    </Link>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </section>
  );
}
