import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

interface SvgDiagramProps {
  /** Path under static/, e.g. "/img/diagrams/architecture/diagram-linux-stack.svg" */
  src: string;
  /** Descriptive alt text — required for accessibility. */
  alt: string;
  /** Optional caption rendered below the diagram. */
  caption?: string;
  /** Optional max width (CSS value or number of px). Defaults to 760px. */
  maxWidth?: number | string;
  /** Draw a border around the diagram container. Defaults to true. */
  bordered?: boolean;
}

/**
 * Renders an ADL engineering-notebook SVG diagram from static/img/diagrams/
 * as an accessible, responsive <figure>. The SVGs carry their own paper
 * background, so the container stays neutral in light and dark mode.
 */
export default function SvgDiagram({
  src,
  alt,
  caption,
  maxWidth = 760,
  bordered = true,
}: SvgDiagramProps) {
  const url = useBaseUrl(src);
  const width = typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
  return (
    <figure className={styles.figure} style={{ maxWidth: width }}>
      <img
        src={url}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={bordered ? `${styles.diagram} ${styles.bordered}` : styles.diagram}
      />
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
