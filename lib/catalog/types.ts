/**
 * TorrentEntry — source of truth for the shape of every torrent
 * in the catalog. Modelled after magnetissimo's Ecto schema
 * (magnetissimo/lib/magnetissimo/torrents/torrent.ex) but adapted
 * for a static-JSON / API-driven Next.js frontend.
 *
 * If you add a field here, update **every** crawler in lib/crawlers/
 * and every component that renders entries.
 */
export interface TorrentEntry {
  /** Unique identifier (magnet hash serves as natural key) */
  id: string;
  /** Human-readable name */
  name: string;
  /** URL-safe slug derived from name */
  slug: string;
  /** ISO-8601 date string of when the torrent was published */
  publishedAt: string;
  /** Optional description / synopsis */
  description: string;
  /** Original page URL on the source site */
  canonicalUrl: string;
  /**
   * Magnet URI **without** the leading `magnet:` prefix.
   * The UI prepends `magnet:` when building the clickable link —
   * this mirrors magnetissimo's convention.
   */
  magnetUrl: string;
  /** 40-char hex info-hash */
  magnetHash: string;
  /** Current leecher count (may be 0 if unavailable) */
  leechers: number;
  /** Current seeder count */
  seeders: number;
  /** File size in bytes */
  sizeInBytes: number;
  /** Category label (e.g. "Movies", "Anime", "Software") */
  category: string;
  /** Source site name (e.g. "YTS", "1337x", "Nyaa.si") */
  source: string;
  /** Optional poster/thumbnail URL */
  posterUrl?: string;
  /** Optional rating score (e.g. 8.4) */
  rating?: number;
  /** Optional release year */
  year?: number;
}

/**
 * Rich movie/show/anime metadata returned by TMDb or AniList.
 */
export interface MediaMetadata {
  id: string | number;
  title: string;
  originalTitle?: string;
  type: "movie" | "tv" | "anime";
  posterUrl?: string;
  backdropUrl?: string;
  overview?: string;
  releaseYear?: number | string;
  rating?: number;
  ratingMax?: number; // 10 for TMDb, 100 for AniList
  genres?: string[];
  status?: string;
  episodes?: number;
  source: "TMDb" | "AniList";
  url?: string;
}

/** The categories magnetissimo seeds into its database. */
export const CATEGORIES = [
  "Anime",
  "Audio",
  "Books",
  "Video",
  "Movies",
  "Television",
  "Software",
  "Games",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
