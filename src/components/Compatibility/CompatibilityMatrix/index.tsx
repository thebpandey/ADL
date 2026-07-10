import React, { useMemo, useState } from "react";
import Link from "@docusaurus/Link";
import { devices, matrix } from "../data";
import TestStatusBadge from "../TestStatusBadge";
import styles from "./styles.module.css";

const COLUMNS: { key: keyof (typeof matrix)[number]; label: string }[] = [
  { key: "usbcVideo", label: "USB-C video" },
  { key: "desktopMode", label: "Desktop mode" },
  { key: "bluetooth", label: "Bluetooth" },
  { key: "keyboard", label: "Keyboard" },
  { key: "mouse", label: "Mouse" },
  { key: "storage", label: "Storage" },
  { key: "linux", label: "Linux" },
  { key: "xfce", label: "XFCE" },
];

/**
 * Part 4/12 — searchable, filterable device compatibility matrix.
 * Fully rendered statically; the search box and filters are a light
 * progressive enhancement (without JavaScript the complete table shows).
 */
export default function CompatibilityMatrix() {
  const [query, setQuery] = useState("");
  const [manufacturer, setManufacturer] = useState("all");
  const [status, setStatus] = useState("all");
  const [android, setAndroid] = useState("all");
  const [minRam, setMinRam] = useState(0);

  const manufacturers = useMemo(
    () => [...new Set(devices.map((d) => d.manufacturer))].sort(),
    [],
  );
  const androidOptions = useMemo(
    () => [...new Set(devices.flatMap((d) => d.androidVersions))].sort((a, b) => Number(a) - Number(b)),
    [],
  );

  const rows = matrix
    .map((row) => ({ row, device: devices.find((d) => d.id === row.deviceId)! }))
    .filter(({ device }) => device)
    .filter(({ row, device }) => {
      const q = query.trim().toLowerCase();
      if (q && !`${device.name} ${device.manufacturer} ${device.chipset}`.toLowerCase().includes(q)) return false;
      if (manufacturer !== "all" && device.manufacturer !== manufacturer) return false;
      if (status !== "all" && row.status !== status) return false;
      if (android !== "all" && !device.androidVersions.includes(android)) return false;
      if (minRam > 0 && Math.max(...device.ramGb) < minRam) return false;
      return true;
    });

  return (
    <div className={styles.wrap}>
      <div className={styles.filters} role="search" aria-label="Filter the compatibility matrix">
        <input
          type="search"
          className={styles.search}
          placeholder="Search device, manufacturer, chipset…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search devices"
        />
        <select value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} className={styles.select} aria-label="Filter by manufacturer">
          <option value="all">All manufacturers</option>
          {manufacturers.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select value={android} onChange={(e) => setAndroid(e.target.value)} className={styles.select} aria-label="Filter by Android version">
          <option value="all">Any Android</option>
          {androidOptions.map((v) => (
            <option key={v} value={v}>Android {v}</option>
          ))}
        </select>
        <select value={minRam} onChange={(e) => setMinRam(Number(e.target.value))} className={styles.select} aria-label="Filter by minimum RAM">
          <option value={0}>Any RAM</option>
          <option value={8}>8 GB+</option>
          <option value={12}>12 GB+</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={styles.select} aria-label="Filter by status">
          <option value="all">Any status</option>
          <option value="fully-supported">Fully Supported</option>
          <option value="supported">Supported</option>
          <option value="partial">Partial</option>
          <option value="experimental">Experimental</option>
          <option value="broken">Broken</option>
          <option value="untested">Untested</option>
        </select>
      </div>

      <div className={styles.scroller} tabIndex={0} role="region" aria-label="Device compatibility matrix">
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Device</th>
              {COLUMNS.map((c) => (
                <th key={c.key} scope="col">{c.label}</th>
              ))}
              <th scope="col">Performance</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ row, device }) => (
              <tr key={row.deviceId}>
                <th scope="row" className={styles.deviceCell}>
                  {device.verifiedConfiguration ? (
                    <Link to={device.verifiedConfiguration}>{device.name}</Link>
                  ) : (
                    device.name
                  )}
                  <span className={styles.deviceMeta}>
                    {device.chipset} · {Math.max(...device.ramGb)} GB
                  </span>
                </th>
                {COLUMNS.map((c) => (
                  <td key={c.key}>
                    <TestStatusBadge status={row[c.key] as never} compact />
                  </td>
                ))}
                <td className={styles.perf}>{row.performance}</td>
                <td>
                  <TestStatusBadge status={row.status} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length + 3} className={styles.empty}>
                  No devices match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className={styles.legend}>
        ✔ fully supported / supported · ◐ partial · ⚗ experimental · ✖ broken · ? untested — hover any icon for
        the exact level. Rows link to verified configurations where one exists.
      </p>
    </div>
  );
}
