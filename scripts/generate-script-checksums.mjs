#!/usr/bin/env node
/**
 * Generate SHA256SUMS and manifest.json for static/downloads/scripts/*.sh.
 *
 *   node scripts/generate-script-checksums.mjs          # write files
 *   node scripts/generate-script-checksums.mjs --check  # verify (CI)
 *
 * The manifest records name, version (parsed from VERSION="…"), size, sha256,
 * and environment (from the shebang) for the downloads page and verification.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "static/downloads/scripts");
const CHECK = process.argv.includes("--check");

const files = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith(".sh"))
  .sort();

if (files.length === 0) {
  console.error("No scripts found in", DIR);
  process.exit(1);
}

const entries = files.map((name) => {
  const buf = fs.readFileSync(path.join(DIR, name));
  const text = buf.toString("utf8");
  const sha256 = createHash("sha256").update(buf).digest("hex");
  const version = text.match(/^VERSION="([^"]+)"/m)?.[1] ?? "unknown";
  const shebang = text.split("\n", 1)[0] ?? "";
  const environment = shebang.includes("com.termux") ? "Termux host" : "Inside the Linux distro";
  const description = text.split("\n").find((l) => l.startsWith("# adl-"))?.replace(/^# /, "") ?? "";
  return { name, version, sha256, sizeBytes: buf.length, environment, description };
});

const sumsText = entries.map((e) => `${e.sha256}  ${e.name}`).join("\n") + "\n";
const manifest = {
  $schema: "adl-script-manifest",
  schemaVersion: 1,
  generatedAt: CHECK ? undefined : new Date().toISOString(),
  scripts: entries,
};

const sumsPath = path.join(DIR, "SHA256SUMS");
const manifestPath = path.join(DIR, "manifest.json");

if (CHECK) {
  let failed = false;
  const existing = fs.existsSync(sumsPath) ? fs.readFileSync(sumsPath, "utf8") : "";
  if (existing !== sumsText) {
    console.error("SHA256SUMS is stale. Run: node scripts/generate-script-checksums.mjs");
    failed = true;
  }
  const existingManifest = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
    : null;
  if (existingManifest) {
    for (const e of entries) {
      const m = existingManifest.scripts?.find((s) => s.name === e.name);
      if (!m || m.sha256 !== e.sha256 || m.version !== e.version) {
        console.error(`manifest.json is stale for ${e.name}.`);
        failed = true;
      }
    }
  } else {
    console.error("manifest.json missing.");
    failed = true;
  }
  if (failed) process.exit(1);
  console.log(`Checksums OK for ${entries.length} scripts.`);
} else {
  fs.writeFileSync(sumsPath, sumsText);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Wrote SHA256SUMS + manifest.json for ${entries.length} scripts.`);
}
