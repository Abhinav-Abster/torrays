/**
 * Nyaa.si crawler — ported from magnetissimo/lib/magnetissimo/crawlers/nyaa.ex
 *
 * Nyaa is an anime-focused torrent index. We scrape the HTML search results
 * table, which contains all the info we need (magnet, size, seeders, etc.)
 * inline — no detail-page follow needed for the table data.
 */
import * as cheerio from "cheerio";
import type { TorrentEntry } from "@/lib/catalog/types";
import { slugify, sizeToBytes, fetchWithTimeout } from "./utils";

const NYAA_BASES = ["https://nyaa.si", "https://nyaa.net"];

async function fetchNyaaHtml(
  pathWithQuery: string
): Promise<{ html: string; base: string } | null> {
  for (const base of NYAA_BASES) {
    try {
      const url = `${base}${pathWithQuery}`;
      const res = await fetchWithTimeout(url, 6_000);
      if (!res.ok) continue;

      const html = await res.text();
      if (html.includes("<table") && html.includes("magnet:")) {
        return { html, base };
      }
    } catch {
      continue;
    }
  }
  return null;
}

export async function searchNyaa(query: string): Promise<TorrentEntry[]> {
  try {
    const pageData = await fetchNyaaHtml(
      `/?f=0&c=0_0&q=${encodeURIComponent(query)}&p=1`
    );
    if (!pageData) return [];

    return parseSearchPage(pageData.html, pageData.base);
  } catch (err) {
    console.error("[Nyaa] Search failed:", err);
    return [];
  }
}

export async function latestNyaa(): Promise<TorrentEntry[]> {
  try {
    const pageData = await fetchNyaaHtml(`/?p=1`);
    if (!pageData) return [];

    return parseSearchPage(pageData.html, pageData.base);
  } catch (err) {
    console.error("[Nyaa] Latest failed:", err);
    return [];
  }
}

function parseSearchPage(html: string, base: string): TorrentEntry[] {
  const $ = cheerio.load(html);
  const results: TorrentEntry[] = [];

  $("table tbody tr").each((_, row) => {
    const $row = $(row);
    const tds = $row.find("td");
    if (tds.length < 7) return;

    // Column layout: category | name | links | size | date | seeders | leechers | downloads
    const categoryTitle =
      $row.find("a").first().attr("title") ?? "Other";

    const nameLink = tds.eq(1).find("a").last();
    const name = nameLink.text().trim();
    const href = nameLink.attr("href") ?? "";
    const canonicalUrl = href.startsWith("http") ? href : `${base}${href}`;

    // Find magnet link in the links column
    let magnetFull = "";
    tds.eq(2).find("a").each((_, el) => {
      const linkHref = $(el).attr("href") ?? "";
      if (linkHref.startsWith("magnet:")) {
        magnetFull = linkHref;
      }
    });

    if (!magnetFull || !name) return;

    const magnetUrl = magnetFull.replace(/^magnet:/, "");
    const hashMatch = magnetFull.match(/btih:([a-fA-F0-9]{40})/i);
    const magnetHash = hashMatch ? hashMatch[1].toLowerCase() : "";
    if (!magnetHash) return;

    const sizeText = tds.eq(3).text().trim();
    const timestamp = tds.eq(4).attr("data-timestamp");
    const dateText = tds.eq(4).text().trim();
    const seeders = parseInt(tds.eq(5).text().trim(), 10) || 0;
    const leechers = parseInt(tds.eq(6).text().trim(), 10) || 0;

    let publishedAt = new Date().toISOString();
    if (timestamp) {
      publishedAt = new Date(parseInt(timestamp, 10) * 1000).toISOString();
    } else if (dateText) {
      const parsedDate = new Date(dateText);
      if (!isNaN(parsedDate.getTime())) {
        publishedAt = parsedDate.toISOString();
      }
    }

    results.push({
      id: magnetHash,
      name,
      slug: slugify(name),
      publishedAt,
      description: "",
      canonicalUrl,
      magnetUrl,
      magnetHash,
      leechers,
      seeders,
      sizeInBytes: sizeToBytes(sizeText),
      category: mapNyaaCategory(categoryTitle),
      source: "Nyaa.si",
    });
  });

  return results;
}

function mapNyaaCategory(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes("anime")) return "Anime";
  if (lower.includes("audio") || lower.includes("music")) return "Audio";
  if (lower.includes("literature") || lower.includes("book")) return "Books";
  if (lower.includes("live action") || lower.includes("movie")) return "Movies";
  if (lower.includes("software") || lower.includes("app")) return "Software";
  if (lower.includes("game")) return "Games";
  return "Other";
}
