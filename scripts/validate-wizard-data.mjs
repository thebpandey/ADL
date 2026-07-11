#!/usr/bin/env node
/**
 * Validate the guided-installer data files (zero-dependency schema checks):
 *   data/device-catalog.json, data/wizard-issues.json, data/sources.json
 *
 * Checks: required fields, duplicate ids, evidence levels, issue references,
 * sources present on every record, and stale lastVerified warnings (>6 months
 * for volatile records — warning only, does not fail CI).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let errors = 0;
let warnings = 0;
const err = (msg) => {
  console.error(`ERROR  ${msg}`);
  errors++;
};
const warn = (msg) => {
  console.warn(`WARN   ${msg}`);
  warnings++;
};

const load = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));

const EVIDENCE = new Set([
  "official-doc",
  "adl-verified",
  "reproduced-community",
  "field-report",
  "inferred-from-specs",
  "unknown",
]);
const SEVERITY = new Set(["low", "medium", "high", "blocker"]);
const STALE_MS = 1000 * 60 * 60 * 24 * 183; // ~6 months

// --- device catalog ---------------------------------------------------------
const catalog = load("data/device-catalog.json");
const deviceIds = new Set();
for (const d of catalog.devices ?? []) {
  const where = `device-catalog:${d.id ?? "?"}`;
  if (!d.id) err(`${where} missing id`);
  else if (deviceIds.has(d.id)) err(`${where} duplicate id`);
  else deviceIds.add(d.id);
  for (const field of ["manufacturer", "marketingName", "cpuArchitecture", "evidenceLevel"]) {
    if (!d[field]) err(`${where} missing ${field}`);
  }
  if (!Array.isArray(d.modelNumbers) || d.modelNumbers.length === 0) err(`${where} needs modelNumbers`);
  if (!Array.isArray(d.ramVariantsGb) || d.ramVariantsGb.length === 0) err(`${where} needs ramVariantsGb`);
  if (!EVIDENCE.has(d.evidenceLevel)) err(`${where} bad evidenceLevel "${d.evidenceLevel}"`);
  if (!(d.displayPortAltMode === true || d.displayPortAltMode === false || d.displayPortAltMode === "unknown")) {
    err(`${where} displayPortAltMode must be true|false|"unknown"`);
  }
  if (!Array.isArray(d.sources) || d.sources.length === 0) err(`${where} has no sources (citation required)`);
  for (const s of d.sources ?? []) if (!s.url) err(`${where} source missing url`);
  if (!d.lastVerified) warn(`${where} has no lastVerified date`);
  else if (Date.now() - Date.parse(d.lastVerified) > STALE_MS) warn(`${where} lastVerified ${d.lastVerified} is >6 months old — re-verify`);
}

// --- issues -----------------------------------------------------------------
const issues = load("data/wizard-issues.json");
const issueIds = new Set();
for (const i of issues.issues ?? []) {
  const where = `wizard-issues:${i.id ?? "?"}`;
  if (!i.id) err(`${where} missing id`);
  else if (issueIds.has(i.id)) err(`${where} duplicate id`);
  else issueIds.add(i.id);
  if (!i.title) err(`${where} missing title`);
  if (!Array.isArray(i.symptoms) || i.symptoms.length === 0) err(`${where} needs symptoms`);
  if (!SEVERITY.has(i.severity)) err(`${where} bad severity "${i.severity}"`);
  if (!EVIDENCE.has(i.confidence)) err(`${where} bad confidence "${i.confidence}"`);
  if (!Array.isArray(i.sources) || i.sources.length === 0) err(`${where} has no sources (evidence required)`);
  if (i.lastVerified && Date.now() - Date.parse(i.lastVerified) > STALE_MS) warn(`${where} lastVerified is >6 months old — re-verify`);
}

// Cross-reference: device knownIssueIds must exist.
for (const d of catalog.devices ?? []) {
  for (const id of d.knownIssueIds ?? []) {
    if (!issueIds.has(id)) err(`device-catalog:${d.id} references unknown issue "${id}"`);
  }
}

// --- sources registry ---------------------------------------------------------
const sources = load("data/sources.json");
const srcIds = new Set();
for (const s of sources.sources ?? []) {
  const where = `sources:${s.id ?? "?"}`;
  if (!s.id) err(`${where} missing id`);
  else if (srcIds.has(s.id)) err(`${where} duplicate id`);
  else srcIds.add(s.id);
  for (const field of ["title", "url", "reliability", "accessedAt"]) {
    if (!s[field]) err(`${where} missing ${field}`);
  }
  if (s.lastVerified && Date.now() - Date.parse(s.lastVerified) > STALE_MS) warn(`${where} lastVerified is >6 months old — re-verify`);
}

console.log(
  `Validated ${deviceIds.size} devices, ${issueIds.size} issues, ${srcIds.size} sources — ${errors} errors, ${warnings} warnings.`,
);
process.exit(errors > 0 ? 1 : 0);
