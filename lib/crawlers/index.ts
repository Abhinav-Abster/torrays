/**
 * Aggregator — orchestrates all crawlers in parallel.
 * Mirrors magnetissimo's `search_torrents/1` which fans out to all
 * crawler modules via Task.async_stream.
 */
import type { TorrentEntry } from "@/lib/catalog/types";
import { searchYts, latestYts } from "./yts";
import { searchLeetx } from "./leetx";
import { searchNyaa, latestNyaa } from "./nyaa";
import { searchDemo, latestDemo } from "./demo";

/**
 * Search all configured sources concurrently.
 * Returns de-duplicated results sorted by seeders (descending).
 * Falls back to demo catalog if all live upstream scrapers yield no results.
 */
export async function searchAll(query: string): Promise<TorrentEntry[]> {
  const results = await Promise.allSettled([
    searchYts(query),
    searchLeetx(query),
    searchNyaa(query),
  ]);

  const allEntries = results.flatMap((r) =>
    r.status === "fulfilled" ? r.value : []
  );

  const deduplicated = deduplicateAndSort(allEntries);
  if (deduplicated.length > 0) {
    return deduplicated;
  }

  // Graceful fallback so search & filter UI remains fully testable
  return searchDemo(query);
}

/**
 * Fetch latest torrents from sources that support it.
 */
export async function latestAll(): Promise<TorrentEntry[]> {
  const results = await Promise.allSettled([latestYts(), latestNyaa()]);

  const allEntries = results.flatMap((r) =>
    r.status === "fulfilled" ? r.value : []
  );

  const deduplicated = deduplicateAndSort(allEntries);
  if (deduplicated.length > 0) {
    return deduplicated;
  }

  return latestDemo();
}

function deduplicateAndSort(entries: TorrentEntry[]): TorrentEntry[] {
  const seen = new Map<string, TorrentEntry>();

  for (const entry of entries) {
    // Deduplicate by magnet hash — keep the one with more seeders
    const existing = seen.get(entry.magnetHash);
    if (!existing || entry.seeders > existing.seeders) {
      seen.set(entry.magnetHash, entry);
    }
  }

  return Array.from(seen.values()).sort((a, b) => b.seeders - a.seeders);
}
