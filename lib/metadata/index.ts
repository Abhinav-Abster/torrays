/**
 * Unified metadata orchestrator — fetches rich posters & details
 * from TMDb (movies/series) and AniList (anime).
 */
import type { MediaMetadata } from "@/lib/catalog/types";
import { fetchTmdbMetadata } from "./tmdb";
import { fetchAniListMetadata } from "./anilist";

if (typeof window === "undefined") {
  import("node:dns")
    .then((dns) => dns.setDefaultResultOrder?.("ipv4first"))
    .catch(() => {});
}

export async function getMediaMetadata(
  query: string,
  category?: string
): Promise<MediaMetadata | null> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return null;

  const isAnimeCategory =
    category?.toLowerCase() === "anime" ||
    trimmed.toLowerCase().includes("anime");

  if (isAnimeCategory) {
    // If explicitly searching for anime, prioritize AniList
    const anilistResult = await fetchAniListMetadata(trimmed);
    if (anilistResult) return anilistResult;
    return fetchTmdbMetadata(trimmed);
  }

  // Otherwise, query both in parallel
  const [tmdbResult, anilistResult] = await Promise.allSettled([
    fetchTmdbMetadata(trimmed),
    fetchAniListMetadata(trimmed),
  ]);

  const tmdb = tmdbResult.status === "fulfilled" ? tmdbResult.value : null;
  const anilist =
    anilistResult.status === "fulfilled" ? anilistResult.value : null;

  // If both returned, check if query looks like anime title
  if (tmdb && anilist) {
    // If AniList has high popularity / match and TMDb is just an obscure title, prefer AniList
    const queryLower = trimmed.toLowerCase();
    const anilistTitleLower = anilist.title.toLowerCase();
    if (
      anilistTitleLower.includes(queryLower) ||
      queryLower.includes(anilistTitleLower)
    ) {
      if ((anilist.rating || 0) > 75) {
        return anilist;
      }
    }
    return tmdb;
  }

  return tmdb || anilist || null;
}
