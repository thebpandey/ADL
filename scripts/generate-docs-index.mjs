#!/usr/bin/env node
/**
 * ADL Documentation Intelligence — static index generator.
 *
 * Scans docs/ frontmatter and content, then emits:
 *   - src/data/docs-index.json    (consumed by theme components at runtime)
 *   - static/ai-metadata.json     (stable machine-readable interface; see
 *     docs/developer/design-system.md — "Future AI integration hooks")
 *
 * Runs automatically via the prebuild/prestart npm hooks. No dependencies:
 * the frontmatter used in this repo is flat YAML (strings + string lists).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = path.join(ROOT, "docs");

/** Minimal YAML: top-level `key: value` and `key:\n  - item` lists. */
function parseFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const out = {};
  let currentList = null;
  for (const rawLine of m[1].split(/\r?\n/)) {
    const listItem = rawLine.match(/^\s+-\s+(.*)$/);
    if (listItem && currentList) {
      out[currentList].push(stripQuotes(listItem[1].trim()));
      continue;
    }
    const kv = rawLine.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    const [, key, value] = kv;
    if (value === "") {
      out[key] = [];
      currentList = key;
    } else if (value.startsWith("[") && value.endsWith("]")) {
      out[key] = value
        .slice(1, -1)
        .split(",")
        .map((v) => stripQuotes(v.trim()))
        .filter(Boolean);
      currentList = null;
    } else {
      out[key] = stripQuotes(value.trim());
      currentList = null;
    }
  }
  return out;
}

const stripQuotes = (s) => s.replace(/^["']|["']$/g, "");

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (/\.(md|mdx)$/.test(entry.name)) yield p;
  }
}

function permalinkFor(relPath, fm) {
  if (fm.slug) return path.posix.join("/docs", fm.slug);
  const noExt = relPath.replace(/\.(md|mdx)$/, "");
  return "/docs/" + noExt.split(path.sep).join("/");
}

function extractCommands(body) {
  const commands = new Set();
  for (const m of body.matchAll(/<(?:CopyCommand|CommandCard)[^>]*command="([^"]+)"/g)) {
    commands.add(m[1]);
  }
  for (const m of body.matchAll(/```(?:bash|shell|sh)\r?\n([\s\S]*?)```/g)) {
    for (const line of m[1].split(/\r?\n/)) {
      const t = line.trim();
      if (t && !t.startsWith("#") && t.length < 120) commands.add(t);
    }
  }
  return [...commands].slice(0, 40);
}

const pages = [];
for (const file of walk(DOCS)) {
  const rel = path.relative(DOCS, file);
  const src = fs.readFileSync(file, "utf8");
  const fm = parseFrontmatter(src);
  const body = src.replace(/^---\r?\n[\s\S]*?\r?\n---/, "");
  const words = body
    .replace(/<[^>]+>/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const h1 = body.match(/^# (.+)$/m);
  pages.push({
    id: rel.replace(/\.(md|mdx)$/, "").split(path.sep).join("/"),
    permalink: permalinkFor(rel, fm),
    title: fm.title || (h1 ? h1[1].trim() : rel),
    description: fm.description || "",
    category: rel.split(path.sep)[0],
    difficulty: fm.difficulty || null,
    estimatedTime: fm.estimated_time || null,
    readingTimeMinutes: Math.max(1, Math.round(words / 220)),
    words,
    testedDevice: fm.tested_device || null,
    testedAndroidVersion: fm.tested_android_version || null,
    testedDate: fm.tested_date || null,
    lastVerified: fm.last_verified || null,
    documentationVersion: fm.documentation_version || null,
    status: fm.status || null,
    keywords: fm.keywords ? (Array.isArray(fm.keywords) ? fm.keywords : [fm.keywords]) : [],
    tags: fm.tags || [],
    compatibility: fm.compatibility || [],
    requiredHardware: fm.required_hardware || [],
    requiredSoftware: fm.required_software || [],
    prerequisites: fm.prerequisites || [],
    nextTopics: fm.next_topics || [],
    relatedTopics: fm.related_topics || [],
    // Part 14 — compatibility frontmatter extensions
    device: fm.device || null,
    androidVersion: fm.android_version || null,
    linuxDistribution: fm.linux_distribution || null,
    desktopEnvironment: fm.desktop_environment || null,
    verified: fm.verified === "true" || fm.verified === true || null,
    verificationDate: fm.verification_date || null,
    maintainer: fm.maintainer || null,
    communityVerified: fm.community_verified === "true" || null,
    compatibilityLevel: fm.compatibility_level || null,
    commands: extractCommands(body),
  });
}

// Reverse learning-path lookup: prev = pages that list me in next_topics.
const byPermalink = new Map(pages.map((p) => [p.permalink, p]));
for (const p of pages) {
  p.previousTopics = pages
    .filter((q) => q.nextTopics.includes(p.permalink))
    .map((q) => q.permalink);
}

// Related fallback: same category, shared keywords/tags — used when a page
// declares no related_topics of its own.
for (const p of pages) {
  if (p.relatedTopics.length > 0) continue;
  const scored = pages
    .filter((q) => q !== p && q.category === p.category)
    .map((q) => ({
      q,
      score:
        q.keywords.filter((k) => p.keywords.includes(k)).length +
        q.tags.filter((t) => p.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ q }) => q.permalink);
  p.computedRelated = scored;
}

const index = {
  generatedBy: "scripts/generate-docs-index.mjs",
  schemaVersion: 1,
  pageCount: pages.length,
  pages: Object.fromEntries(pages.map((p) => [p.permalink, p])),
};

fs.mkdirSync(path.join(ROOT, "src/data"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "src/data/docs-index.json"),
  JSON.stringify(index, null, 2) + "\n",
);

// AI-integration interface: same data, stable schema, served statically.
const ai = {
  $schema: "adl-ai-metadata",
  schemaVersion: 1,
  site: "https://thebpandey.github.io/ADL/",
  description:
    "Machine-readable metadata for the ADL documentation. Interface for future AI assistant integration; no AI is implemented.",
  interfaces: {
    pageMetadata: "pages[].{permalink,title,description,difficulty,estimatedTime}",
    commandMetadata: "pages[].commands",
    troubleshootingMetadata: "pages[] where category == 'troubleshooting'",
    learningMetadata: "pages[].{prerequisites,nextTopics,previousTopics,relatedTopics}",
    compatibilityMetadata: "pages[].{compatibility,testedDevice,testedAndroidVersion,device,compatibilityLevel}",
    hardwareMetadata: "/data/hardware.json (also served at /ADL/data/hardware.json)",
    compatibilityDatabase:
      "/data/{devices,hardware,desktop-environments,linux-distributions,android-versions,compatibility-matrix,test-results,verified-configurations}.json",
  },
  pages,
};
fs.writeFileSync(
  path.join(ROOT, "static/ai-metadata.json"),
  JSON.stringify(ai, null, 2) + "\n",
);

// Part 15 — publish the compatibility database as a static interface.
const dataDir = path.join(ROOT, "data");
const outDir = path.join(ROOT, "static/data");
fs.mkdirSync(outDir, { recursive: true });
let copied = 0;
if (fs.existsSync(dataDir)) {
  for (const f of fs.readdirSync(dataDir).filter((n) => n.endsWith(".json"))) {
    fs.copyFileSync(path.join(dataDir, f), path.join(outDir, f));
    copied++;
  }
}

console.log(
  `docs index: ${pages.length} pages -> src/data/docs-index.json, static/ai-metadata.json; ${copied} data files -> static/data/`,
);
