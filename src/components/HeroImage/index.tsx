import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

interface HeroImageProps {
  /** Filename inside static/img/heroes/, e.g. "hero-quick-start.webp" */
  image: string;
  /** Descriptive alt text — required for accessibility. */
  alt: string;
  /** Optional caption rendered below the image. */
  caption?: string;
}

/**
 * Section hero image. Resolves files from static/img/heroes/, lazy-loads,
 * and renders as an accessible <figure> with responsive, rounded styling
 * that adapts to light and dark mode (see styles.module.css).
 */
export default function HeroImage({ image, alt, caption }: HeroImageProps) {
  const src = useBaseUrl(`/img/heroes/${image}`);
  return (
    <figure className={styles.heroFigure}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        width={512}
        height={512}
        className={styles.heroImage}
      />
      {caption && (
        <figcaption className={styles.heroCaption}>{caption}</figcaption>
      )}
    </figure>
  );
}
