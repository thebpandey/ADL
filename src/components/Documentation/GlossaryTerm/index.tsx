import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

/** Built-in glossary. Keys are lowercase; add new terms here and in the glossary page. */
const GLOSSARY: Record<string, string> = {
  termux: "A terminal emulator app that provides a real Linux environment on Android — no root needed.",
  proot: "A userspace tool that lets a full Linux distribution run inside Android without root access.",
  xfce: "A fast, lightweight Linux desktop environment — the one ADL recommends.",
  "desktop environment": "The graphical layer of Linux: windows, panels, menus, and the file manager.",
  displayport: "The video standard that lets a phone output display over USB-C (DisplayPort Alt Mode).",
  "usb-c dock": "A hub that fans one USB-C port out to HDMI, USB ports, and charging.",
  "linux distribution": "A complete Linux operating system bundle, like Ubuntu or Debian.",
  "samsung dex": "Samsung's desktop mode: connect a monitor and the phone drives a desktop interface.",
  "package manager": "The tool (like apt) that installs, updates, and removes software for you.",
  shell: "The program that reads your typed commands and runs them — usually bash.",
};

interface GlossaryTermProps {
  /** Term to define. Defaults to the visible text. */
  term?: string;
  children: React.ReactNode;
}

/**
 * Inline glossary tooltip. Pure CSS tooltip on hover and keyboard focus;
 * degrades to a normal link to the glossary when the term is unknown or
 * when CSS is unavailable.
 */
export default function GlossaryTerm({ term, children }: GlossaryTermProps) {
  const key = (term ?? (typeof children === "string" ? children : "")).toLowerCase().trim();
  const definition = GLOSSARY[key];
  if (!definition) {
    return <Link to="/docs/glossary/terms">{children}</Link>;
  }
  return (
    <span className={styles.term} tabIndex={0} role="term" aria-describedby={undefined}>
      {children}
      <span role="definition" className={styles.tooltip}>
        {definition}{" "}
        <Link to="/docs/glossary/terms" className={styles.more}>
          Glossary →
        </Link>
      </span>
    </span>
  );
}
