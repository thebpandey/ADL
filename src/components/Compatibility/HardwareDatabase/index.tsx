import React, { useState } from "react";
import { hardware } from "../data";
import { HardwareEntryCard } from "../cards";
import type { HardwareCategory } from "@site/src/types/compatibility";
import styles from "./styles.module.css";

const CATEGORIES: { id: HardwareCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "usb-c-dock", label: "USB-C Docks" },
  { id: "monitor", label: "Monitors" },
  { id: "storage", label: "Storage" },
  { id: "input", label: "Input Devices" },
  { id: "accessory", label: "Accessories" },
  { id: "power-delivery", label: "Power Delivery" },
];

/**
 * Part 6/12 — searchable hardware database with category filters.
 * Statically rendered; search and filters are progressive enhancement.
 */
export default function HardwareDatabase({ category: fixed }: { category?: HardwareCategory }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<HardwareCategory | "all">(fixed ?? "all");

  const items = hardware.filter((h) => {
    if ((fixed ?? category) !== "all" && h.category !== (fixed ?? category)) return false;
    const q = query.trim().toLowerCase();
    if (q && !`${h.name} ${h.description} ${h.keySpecs.join(" ")}`.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div>
      <div className={styles.filters} role="search" aria-label="Filter hardware">
        <input
          type="search"
          className={styles.search}
          placeholder="Search hardware…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search hardware"
        />
        {!fixed && (
          <div className={styles.chips} role="group" aria-label="Hardware category">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={category === c.id ? `${styles.chip} ${styles.active}` : styles.chip}
                aria-pressed={category === c.id}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={styles.grid}>
        {items.map((h) => (
          <HardwareEntryCard key={h.id} id={h.id} />
        ))}
        {items.length === 0 && <p className={styles.empty}>No hardware matches this search.</p>}
      </div>
    </div>
  );
}
