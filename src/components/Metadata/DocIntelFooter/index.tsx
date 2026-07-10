import React from "react";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import { useLocation } from "@docusaurus/router";
import NextSteps from "@site/src/components/NextSteps";
import LearningPathNav from "@site/src/components/Learning/LearningPathNav";
import RelatedArticles from "@site/src/components/Navigation/RelatedArticles";
import { lookupDoc, resolveMany } from "@site/src/components/Metadata/docsIndex";

/**
 * Auto-rendered page intelligence footer: learning-path navigation,
 * "Continue Learning" next steps, and related articles — all statically
 * generated from frontmatter via the docs index.
 */
export default function DocIntelFooter() {
  const { frontMatter, metadata } = useDoc();
  const location = useLocation();
  const fm = frontMatter as Record<string, any>;
  const permalink = location.pathname.replace(/^\/ADL/, "").replace(/\/$/, "");
  const entry = lookupDoc(permalink);
  if (!entry) return null;

  const nextTopics = resolveMany(entry.nextTopics);
  const prevTopics = resolveMany(entry.previousTopics ?? []);
  const relatedSource =
    entry.relatedTopics.length > 0 ? entry.relatedTopics : (entry.computedRelated ?? []);
  const related = resolveMany(relatedSource).filter(
    (r) => !entry.nextTopics.includes(r.permalink),
  );
  const isLesson = nextTopics.length > 0 || prevTopics.length > 0;

  if (!isLesson && related.length === 0) return null;

  return (
    <footer>
      {isLesson && (
        <LearningPathNav
          previous={prevTopics[0] ?? null}
          current={{ title: metadata.title, permalink: entry.permalink }}
          next={nextTopics[0] ?? null}
        />
      )}
      {nextTopics.length > 0 && (
        <NextSteps
          title="Continue learning"
          items={nextTopics.map((t) => ({
            title: t.title,
            description: t.description,
            to: t.permalink,
          }))}
        />
      )}
      {related.length > 0 && (
        <RelatedArticles
          items={related.map((r) => ({
            title: r.title,
            description: r.description,
            permalink: r.permalink,
            category: r.category,
          }))}
        />
      )}
    </footer>
  );
}
