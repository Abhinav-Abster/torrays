/**
 * The Movie Database (TMDb) client for fetching movie & TV show metadata.
 * Uses process.env.TMDB_API_KEY or fallback demo key.
 */
import type { MediaMetadata } from "@/lib/catalog/types";
import { fetchWithTimeout } from "@/lib/crawlers/utils";
import dns from "node:dns";

if (typeof dns.setDefaultResultOrder === "function") {
  try {
    dns.setDefaultResultOrder("ipv4first");
  } catch {
    // Edge runtime fallback
  }
}

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_POSTER = "https://image.tmdb.org/t/p/w500";
const TMDB_IMAGE_BACKDROP = "https://image.tmdb.org/t/p/w1280";

// Fallback educational key if user hasn't set TMDB_API_KEY in .env.local
const DEFAULT_KEY = "4e44d9029b1270a757cddc766a1bcb63";

const TMDB_GENRES: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};

interface TmdbResult {
  id: number;
  media_type?: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
}

async function queryTmdbEndpoint(
  endpoint: "search/movie" | "search/tv",
  query: string,
  apiKey: string,
  token?: string
): Promise<TmdbResult[]> {
  try {
    const url = `${TMDB_BASE}/${endpoint}?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}&include_adult=false&page=1`;

    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetchWithTimeout(url, 6_000);
    if (!res.ok) return [];

    const data = await res.json();
    return data?.results ?? [];
  } catch {
    return [];
  }
}

export async function fetchTmdbMetadata(
  query: string
): Promise<MediaMetadata | null> {
  const cleaned = cleanMovieQuery(query);
  if (!cleaned || cleaned.length < 2) return null;

  const apiKey = process.env.TMDB_API_KEY || DEFAULT_KEY;
  const token = process.env.TMDB_ACCESS_TOKEN;

  try {
    // 1. Try movie search first
    const movieResults = await queryTmdbEndpoint(
      "search/movie",
      cleaned,
      apiKey,
      token
    );
    let item = movieResults.find((r) => r.poster_path || r.overview);
    let isTv = false;

    // 2. If no movie match, try TV show search
    if (!item) {
      const tvResults = await queryTmdbEndpoint(
        "search/tv",
        cleaned,
        apiKey,
        token
      );
      item = tvResults.find((r) => r.poster_path || r.overview);
      if (item) isTv = true;
    }

    if (!item) return null;

    const title = (isTv ? item.name : item.title) || "";
    const originalTitle = isTv ? item.original_name : item.original_title;
    const dateStr = isTv ? item.first_air_date : item.release_date;
    const year = dateStr ? new Date(dateStr).getFullYear() : undefined;

    const genres = (item.genre_ids || [])
      .map((id) => TMDB_GENRES[id])
      .filter((g): g is string => Boolean(g));

    return {
      id: `tmdb-${item.id}`,
      title,
      originalTitle: originalTitle !== title ? originalTitle : undefined,
      type: isTv ? "tv" : "movie",
      posterUrl: item.poster_path
        ? `${TMDB_IMAGE_POSTER}${item.poster_path}`
        : undefined,
      backdropUrl: item.backdrop_path
        ? `${TMDB_IMAGE_BACKDROP}${item.backdrop_path}`
        : undefined,
      overview: item.overview || "",
      releaseYear: year,
      rating: item.vote_average
        ? Math.round(item.vote_average * 10) / 10
        : undefined,
      ratingMax: 10,
      genres,
      source: "TMDb",
      url: `https://www.themoviedb.org/${isTv ? "tv" : "movie"}/${item.id}`,
    };
  } catch (err) {
    console.error("[TMDb] Search error:", err);
    return null;
  }
}

/**
 * Strips release tags, year, resolution, codecs from movie queries.
 */
function cleanMovieQuery(raw: string): string {
  return raw
    .replace(/^\[.*?\]/g, "")
    .replace(/\b(19\d{2}|20\d{2})\b/g, "") // remove years like 2024
    .replace(
      /\b(1080p|720p|480p|2160p|4k|bluray|blu-ray|webrip|web-dl|hdrip|dvdrip|x264|x265|hevc|aac)\b/gi,
      ""
    )
    .replace(/[-_.]+/g, " ")
    .trim();
}
