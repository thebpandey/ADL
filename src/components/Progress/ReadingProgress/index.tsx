import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

interface ReadingProgressProps {
  /** Estimated reading time in minutes (from the docs index). */
  readingTimeMinutes?: number;
}

/**
 * Slim reading-progress bar fixed under the navbar, with percent complete,
 * the current section heading, and estimated reading time. Progressive
 * enhancement only: renders nothing until mounted, so pages work fully
 * without JavaScript and nothing is emitted in static HTML.
 */
export default function ReadingProgress({ readingTimeMinutes }: ReadingProgressProps) {
  const [mounted, setMounted] = useState(false);
  const [pct, setPct] = useState(0);
  const [heading, setHeading] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const total = doc.scrollHeight - window.innerHeight;
        setPct(total > 0 ? Math.min(100, Math.round((window.scrollY / total) * 100)) : 100);
        // current heading: last h2 above the viewport top third
        const h2s = Array.from(document.querySelectorAll<HTMLElement>("article h2"));
        let current = "";
        for (const h of h2s) {
          if (h.getBoundingClientRect().top < window.innerHeight * 0.34) current = h.innerText;
        }
        setHeading(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.track}>
        <div className={styles.bar} style={{ width: `${pct}%` }} />
      </div>
      <div className={styles.chip}>
        {heading && <span className={styles.heading}>{heading}</span>}
        <span className={styles.pct}>{pct}%</span>
        {readingTimeMinutes ? <span className={styles.time}>· {readingTimeMinutes} min read</span> : null}
      </div>
    </div>
  );
}
