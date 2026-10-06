/**
 * YTS crawler — ported from magnetissimo/lib/magnetissimo/crawlers/yts.ex
 *
 * YTS has a public JSON API which makes it the simplest crawler.
 * We hit their list_movies endpoint with a query term and normalise
 * the response into TorrentEntry[].
 */
import type { TorrentEntry } from "@/lib/catalog/types";
import { slugify, fetchWithTimeout } from "./utils";

const YTS_ENDPOINTS = [
  "https://yts.gg/api/v2/list_movies.json",
  "https://movies-api.accel.li/api/v2/list_movies.json",
  "https://yts.mx/api/v2/list_movies.json",
];

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

interface YtsMovie {
  id: number;
  title_long: string;
  url: string;
  description_full?: string;
  medium_cover_image?: string;
  large_cover_image?: string;
  rating?: number;
  year?: number;
  torrents?: YtsTorrent[];
}

interface YtsTorrent {
  hash: string;
  quality: string;
  type: string;
  seeds: number;
  peers: number;
  size_bytes: number;
  date_uploaded_unix: number;
}

function parseMovie(movie: YtsMovie): TorrentEntry[] {
  if (!movie.torrents) return [];

  return movie.torrents.map((t) => ({
    id: t.hash.toLowerCase(),
    name: `${movie.title_long} [${t.quality}] [${t.type}]`,
    slug: slugify(movie.title_long),
    publishedAt: new Date(
      (t.date_uploaded_unix || Math.floor(Date.now() / 1000)) * 1000
    ).toISOString(),
    description: movie.description_full ?? "",
    canonicalUrl: movie.url,
    magnetUrl: buildMagnetUrl(t.hash, movie.title_long),
    magnetHash: t.hash.toLowerCase(),
    leechers: t.peers ?? 0,
    seeders: t.seeds ?? 0,
    sizeInBytes: t.size_bytes ?? 0,
    category: "Movies",
    source: "YTS",
    posterUrl: movie.medium_cover_image || movie.large_cover_image,
    rating: movie.rating,
    year: movie.year,
  }));
}

async function fetchMovies(queryParams: string): Promise<YtsMovie[]> {
  for (const endpoint of YTS_ENDPOINTS) {
    try {
      const url = `${endpoint}?${queryParams}`;
      const res = await fetchWithTimeout(url, 8_000);
      if (!res.ok) continue;

      const json = await res.json();
      const movies: YtsMovie[] = json?.data?.movies;
      if (Array.isArray(movies) && movies.length > 0) {
        return movies;
      }
    } catch {
      // Try next endpoint fallback
      continue;
    }
  }
  return [];
}

export async function searchYts(query: string): Promise<TorrentEntry[]> {
  try {
    const movies = await fetchMovies(
      `query_term=${encodeURIComponent(query)}&limit=50`
    );
    return movies.flatMap(parseMovie);
  } catch (err) {
    console.error("[YTS] Search failed:", err);
    return [];
  }
}

export async function latestYts(): Promise<TorrentEntry[]> {
  try {
    const movies = await fetchMovies(
      `limit=50&sort_by=date_added&order_by=desc`
    );
    return movies.flatMap(parseMovie);
  } catch (err) {
    console.error("[YTS] Latest failed:", err);
    return [];
  }
}
