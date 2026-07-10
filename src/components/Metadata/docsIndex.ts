import rawIndex from "@site/src/data/docs-index.json";

export interface DocIndexEntry {
  id: string;
  permalink: string;
  title: string;
  description: string;
  category: string;
  difficulty: string | null;
  estimatedTime: string | null;
  readingTimeMinutes: number;
  words: number;
  testedDevice: string | null;
  testedAndroidVersion: string | null;
  testedDate: string | null;
  lastVerified: string | null;
  documentationVersion: string | null;
  status: string | null;
  keywords: string[];
  tags: string[];
  compatibility: string[];
  requiredHardware: string[];
  requiredSoftware: string[];
  prerequisites: string[];
  nextTopics: string[];
  relatedTopics: string[];
  previousTopics: string[];
  computedRelated?: string[];
  commands: string[];
}

const index = rawIndex as unknown as {
  pages: Record<string, DocIndexEntry>;
};

/** Look up a page in the static docs index by its permalink. */
export function lookupDoc(permalink: string): DocIndexEntry | undefined {
  const clean = permalink.replace(/\/$/, "");
  return index.pages[clean];
}

export function resolveMany(permalinks: string[]): DocIndexEntry[] {
  return permalinks.map((p) => lookupDoc(p)).filter(Boolean) as DocIndexEntry[];
}
