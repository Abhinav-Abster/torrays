/**
 * The Pirate Bay crawler using the official apibay.org REST API.
 * apibay is a public JSON REST API providing fast, Cloudflare-free search
 * and top100 endpoints that work consistently in serverless environments.
 */
import type { TorrentEntry } from "@/lib/catalog/types";
import { fetchWithTimeout, slugify } from "./utils";

const APIBAY_BASE = "https://apibay.org";

const TRACKERS = [
  "udp://tracker.opentrackr.org:1337/announce",
  "udp://open.tracker.cl:1337/announce",
  "udp://p4p.arenabg.com:1337/announce",
  "udp://tracker.torrent.eu.org:451/announce",
  "udp://tracker.dler.org:6969/announce",
  "udp://open.stealth.si:80/announce",
  "https://opentracker.i2p.rocks:443/announce",
];

function buildMagnetUrl(hash: string, name: string): string {
  const trackerParams = TRACKERS.map(
    (tr) => `&tr=${encodeURIComponent(tr)}`
  ).join("");
  return `?xt=urn:btih:${hash}&dn=${encodeURIComponent(name)}${trackerParams}`;
}

interface ApibayItem {
  id: string;
  name: string;
  info_hash: string;
  leechers: string;
  seeders: string;
  numFiles?: string;
  size: string;
  username?: string;
  added: string;
  status?: string;
  category: string;
  imdb?: string;
}

function parseItem(item: ApibayItem): TorrentEntry | null {
  if (
    !item ||
    item.id === "0" ||
    item.name === "No results returned" ||
    !item.info_hash ||
    item.info_hash === "0000000000000000000000000000000000000000"
  ) {
    return null;
  }

  const hash = item.info_hash.toLowerCase();
  const addedUnix = parseInt(item.added, 10);
  const publishedAt =
    !isNaN(addedUnix) && addedUnix > 0
      ? new Date(addedUnix * 1000).toISOString()
      : new Date().toISOString();

  return {
    id: hash,
    name: item.name,
    slug: slugify(item.name),
    publishedAt,
    description: item.username ? `Uploaded by ${item.username}` : "",
    canonicalUrl: `https://thepiratebay.org/description.php?id=${item.id}`,
    magnetUrl: buildMagnetUrl(hash, item.name),
    magnetHash: hash,
    leechers: parseInt(item.leechers, 10) || 0,
    seeders: parseInt(item.seeders, 10) || 0,
    sizeInBytes: parseInt(item.size, 10) || 0,
    category: mapTpbCategory(item.category),
    source: "ThePirateBay",
    isNsfw: isTpbNsfw(item.category, item.name),
  };
}

function isTpbNsfw(catStr: string, name: string): boolean {
  const code = parseInt(catStr, 10) || 0;
  if (code >= 500 && code < 600) return true;
  return /\b(xxx|porn|hentai|jav|nsfw|erotica|adult|18\+)\b/i.test(name);
}

function mapTpbCategory(catStr: string): string {
  const code = parseInt(catStr, 10) || 0;
  if (code >= 100 && code < 200) return "Audio";
  if (code === 205 || code === 208) return "Television";
  if (code >= 200 && code < 300) return "Movies";
  if (code >= 300 && code < 400) return "Software";
  if (code >= 400 && code < 500) return "Games";
  if (code >= 500 && code < 600) return "XXX";
  if (code === 601 || code === 602) return "Books";
  return "Other";
}

/**
 * Search The Pirate Bay via apibay.org q.php endpoint.
 */
export async function searchPirateBay(query: string): Promise<TorrentEntry[]> {
  try {
    const url = `${APIBAY_BASE}/q.php?q=${encodeURIComponent(query)}`;
    const res = await fetchWithTimeout(url, 8_000);
    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data
      .map(parseItem)
      .filter((entry): entry is TorrentEntry => entry !== null);
  } catch (err) {
    console.error("[ThePirateBay] Search failed:", err);
    return [];
  }
}

/**
 * Fetch latest torrents from The Pirate Bay precompiled recent feeds.
 */
export async function latestPirateBay(): Promise<TorrentEntry[]> {
  const endpoints = [
    `${APIBAY_BASE}/precompiled/data_top100_recent.json`,
    `${APIBAY_BASE}/q.php?q=top100:recent`,
    `${APIBAY_BASE}/precompiled/data_top100_48h.json`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetchWithTimeout(url, 8_000);
      if (!res.ok) continue;

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data
          .map(parseItem)
          .filter((entry): entry is TorrentEntry => entry !== null);
      }
    } catch {
      continue;
    }
  }

  return [];
}

