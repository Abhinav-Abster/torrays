/**
 * 1377x crawler — ported from magnetissimo/lib/magnetissimo/crawlers/leetx.ex
 *
 * Scrapes search results table, then follows detail pages for magnets & metadata.
 * Uses 1377x.to with automatic mirror fallback (e.g. 1337x.torrentbay.to) to ensure
 * reliable access across different networks and DNS configurations.
 */
import * as cheerio from "cheerio";
import type { TorrentEntry } from "@/lib/catalog/types";
import { slugify, sizeToBytes, fetchWithTimeout } from "./utils";

const CANDIDATE_BASES = [
  "https://1377x.to",
  "https://www.1377x.to",
  "https://1337x.torrentbay.to",
  "https://www.1337x.to",
  "https://1337x.to",
];

async function fetchSearchPage(
  query: string
): Promise<{ html: string; base: string } | null> {
  const encodedQuery = encodeURIComponent(query);
  for (const base of CANDIDATE_BASES) {
    try {
      const searchUrl = `${base}/search/${encodedQuery}/1/`;
      const res = await fetchWithTimeout(searchUrl, 6_000);
      if (!res.ok) continue;

      const html = await res.text();
      if (html.includes("/torrent/") && html.includes("<table")) {
        return { html, base };
      }
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * Search 1377x/1337x for the given query (first page only for speed).
 */
export async function searchLeetx(query: string): Promise<TorrentEntry[]> {
  try {
    const pageData = await fetchSearchPage(query);
    if (!pageData) return [];

    const { html, base } = pageData;
    const detailUrls = parseSearchTable(html, base);

    // Fetch detail pages concurrently (limit to 10 at a time)
    const results = await Promise.allSettled(
      detailUrls.slice(0, 10).map((url) => parseTorrentPage(url))
    );

    return results
      .filter(
        (r): r is PromiseFulfilledResult<TorrentEntry | null> =>
          r.status === "fulfilled" && r.value !== null
      )
      .map((r) => r.value!);
  } catch (err) {
    console.error("[1377x] Search failed:", err);
    return [];
  }
}

function parseSearchTable(html: string, base: string): string[] {
  const $ = cheerio.load(html);
  const urls: string[] = [];

  $("table a").each((_, el) => {
    const href = $(el).attr("href");
    if (href?.startsWith("/torrent/")) {
      urls.push(`${base}${href}`);
    }
  });

  return urls;
}

async function parseTorrentPage(url: string): Promise<TorrentEntry | null> {
  try {
    const res = await fetchWithTimeout(url, 6_000);
    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    const name = $("title")
      .text()
      .replace(/ Torrent \| (1337x|1377x)$/i, "")
      .replace(/^Download /i, "")
      .trim();

    const seeders = parseInt($("span.seeds").first().text(), 10) || 0;
    const leechers = parseInt($("span.leeches").first().text(), 10) || 0;

    // Find magnet link
    let magnetFull = "";
    $(".box-info a").each((_, el) => {
      const href = $(el).attr("href") ?? "";
      if (href.startsWith("magnet:")) {
        magnetFull = href;
      }
    });

    if (!magnetFull) return null;

    const magnetUrl = magnetFull.replace(/^magnet:/, "");

    // Extract info hash
    const hashMatch = magnetFull.match(/btih:([a-fA-F0-9]{40})/i);
    const magnetHash = hashMatch ? hashMatch[1].toLowerCase() : "";
    if (!magnetHash) return null;

    // Size
    let sizeText = "";
    $(".torrent-detail-page ul.list li").each((_, el) => {
      const text = $(el).text();
      if (text.startsWith("Total size")) {
        sizeText = text.replace("Total size", "").trim();
      }
    });

    // Category
    let categoryText = "Other";
    $(".torrent-detail-page ul.list li").each((_, el) => {
      const text = $(el).text();
      if (text.startsWith("Category")) {
        categoryText = text.replace("Category", "").trim();
      }
    });

    return {
      id: magnetHash,
      name,
      slug: slugify(name),
      publishedAt: new Date().toISOString(),
      description: ($("#description").html() ?? "").slice(0, 500),
      canonicalUrl: url,
      magnetUrl,
      magnetHash,
      leechers,
      seeders,
      sizeInBytes: sizeToBytes(sizeText),
      category: mapCategory(categoryText),
      source: "1377x",
    };
  } catch (err) {
    console.error(`[1377x] Failed to parse ${url}:`, err);
    return null;
  }
}

function mapCategory(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes("movie")) return "Movies";
  if (lower.includes("tv")) return "Television";
  if (lower.includes("anime")) return "Anime";
  if (lower.includes("music") || lower.includes("audio")) return "Audio";
  if (lower.includes("game")) return "Games";
  if (lower.includes("app") || lower.includes("software")) return "Software";
  if (lower.includes("book") || lower.includes("ebook")) return "Books";
  if (lower.includes("doc")) return "Video";
  return "Other";
}
