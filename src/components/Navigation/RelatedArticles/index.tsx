import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

interface RelatedItem {
  title: string;
  description?: string;
  permalink: string;
  category?: string;
}

interface RelatedArticlesProps {
  title?: string;
  items?: RelatedItem[];
}

/** Responsive card row of related pages (from frontmatter or the docs index). */
export default function RelatedArticles({ title = "Related articles", items = [] }: RelatedArticlesProps) {
  if (items.length === 0) return null;
  return (
    <nav aria-label={title} className={styles.section}>
      <div className={styles.heading}>
        <span aria-hidden="true">🔗</span>
        <span>{title}</span>
      </div>
      <div className={styles.grid}>
        {items.map((item) => (
          <Link key={item.permalink} to={item.permalink} className={styles.card}>
            {item.category && <span className={styles.category}>{item.category.replace(/-/g, " ")}</span>}
            <span className={styles.title}>{item.title}</span>
            {item.description && <span className={styles.description}>{item.description}</span>}
          </Link>
        ))}
      </div>
    </nav>
  );
}
