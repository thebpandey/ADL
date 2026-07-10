import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

interface HardwareCardProps {
  /** Optional image path under static/, e.g. "/img/heroes/hero-home.webp". */
  image?: string;
  name: string;
  category?: string;
  recommended?: boolean;
  notes?: string;
  /** External product page or internal docs link. */
  link?: string;
  linkLabel?: string;
}

/** Hardware recommendation card: image, name, category, notes, and link. */
export default function HardwareCard({
  image,
  name,
  category,
  recommended = false,
  notes,
  link,
  linkLabel = "Details →",
}: HardwareCardProps) {
  const imgSrc = useBaseUrl(image ?? "");
  const internalHref = useBaseUrl(link && !link.startsWith("http") ? link : "");
  return (
    <div className={recommended ? `${styles.card} ${styles.recommended}` : styles.card}>
      {recommended && <span className={styles.badge}>Recommended</span>}
      {image && <img src={imgSrc} alt="" loading="lazy" className={styles.image} />}
      <div className={styles.body}>
        {category && <span className={styles.category}>{category}</span>}
        <span className={styles.name}>{name}</span>
        {notes && <p className={styles.notes}>{notes}</p>}
        {link &&
          (link.startsWith("http") ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {linkLabel} ↗
            </a>
          ) : (
            <a href={internalHref} className={styles.link}>
              {linkLabel}
            </a>
          ))}
      </div>
    </div>
  );
}
