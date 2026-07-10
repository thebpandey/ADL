import React from "react";
import Content from "@theme-original/DocItem/Content";
import type ContentType from "@theme/DocItem/Content";
import type { WrapperProps } from "@docusaurus/types";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import { useLocation } from "@docusaurus/router";
import DocIntelHeader from "@site/src/components/Metadata/DocIntelHeader";
import DocIntelFooter from "@site/src/components/Metadata/DocIntelFooter";
import ReadingProgress from "@site/src/components/Progress/ReadingProgress";
import { lookupDoc } from "@site/src/components/Metadata/docsIndex";

type Props = WrapperProps<typeof ContentType>;

/**
 * DocItem wrapper: injects the Documentation Intelligence layer around
 * every doc page — reading progress, the metadata-driven header, and the
 * learning-path footer. Pages without intelligence frontmatter render
 * exactly as before.
 */
export default function ContentWrapper(props: Props): React.ReactElement {
  const location = useLocation();
  const entry = lookupDoc(location.pathname.replace(/^\/ADL/, ""));
  return (
    <>
      <ReadingProgress readingTimeMinutes={entry?.readingTimeMinutes} />
      <DocIntelHeader />
      <Content {...props} />
      <DocIntelFooter />
    </>
  );
}
