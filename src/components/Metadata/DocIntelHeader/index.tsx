import React from "react";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import { useLocation } from "@docusaurus/router";
import PageMeta from "@site/src/components/PageMeta";
import RequirementsCard from "@site/src/components/RequirementsCard";
import CompatibilityBadge from "@site/src/components/CompatibilityBadge";
import VerificationBanner from "@site/src/components/Verification/VerificationBanner";
import PageHealth from "@site/src/components/Metadata/PageHealth";
import { lookupDoc } from "@site/src/components/Metadata/docsIndex";
import styles from "./styles.module.css";

const BADGE_TYPES = new Set([
  "samsung-dex",
  "displayport",
  "bluetooth",
  "external-storage",
  "external-display",
  "keyboard",
  "mouse",
  "tested",
  "experimental",
  "community-verified",
]);

/**
 * Auto-rendered page intelligence header. Everything comes from frontmatter
 * (Feature 1 schema) — pages opt in simply by declaring metadata. Statically
 * rendered; no client JavaScript.
 */
export default function DocIntelHeader() {
  const { frontMatter, metadata } = useDoc();
  const location = useLocation();
  const fm = frontMatter as Record<string, any>;
  const entry = lookupDoc(location.pathname.replace(/^\/ADL/, ""));

  const difficulty = fm.difficulty;
  const estimatedTime = fm.estimated_time;
  const readingTime = fm.estimated_reading_time
    ? String(fm.estimated_reading_time)
    : entry
      ? `${entry.readingTimeMinutes} min`
      : undefined;
  const compat: string[] = Array.isArray(fm.compatibility) ? fm.compatibility : [];
  const hardware: string[] = Array.isArray(fm.required_hardware) ? fm.required_hardware : [];
  const software: string[] = Array.isArray(fm.required_software) ? fm.required_software : [];
  const hasFacts = difficulty || estimatedTime || fm.tested_device;

  if (!hasFacts && compat.length === 0 && hardware.length === 0 && !fm.last_verified) {
    return null;
  }

  return (
    <header className={styles.intel}>
      {(difficulty || estimatedTime || readingTime) && (
        <div className={styles.metaRow}>
          <PageMeta
            difficulty={difficulty}
            estimatedTime={estimatedTime ?? (readingTime ? `${readingTime} read` : undefined)}
            device={undefined}
          />
          <PageHealth
            lastVerified={fm.last_verified ?? null}
            status={fm.status ?? null}
            lastUpdated={null}
          />
        </div>
      )}
      {fm.tested_device && (
        <VerificationBanner
          device={fm.tested_device}
          androidVersion={fm.tested_android_version}
          verifiedDate={fm.tested_date ?? fm.last_verified}
          documentationVersion={fm.documentation_version}
        />
      )}
      {compat.length > 0 && (
        <div className={styles.badges}>
          {compat
            .filter((c) => BADGE_TYPES.has(c))
            .map((c) => (
              <CompatibilityBadge key={c} type={c as any} />
            ))}
        </div>
      )}
      {(hardware.length > 0 || software.length > 0) && (
        <RequirementsCard
          difficulty={undefined}
          estimatedTime={undefined}
          requiredHardware={hardware}
          requiredSoftware={software}
          estimatedDownload={fm.estimated_download}
        />
      )}
    </header>
  );
}
