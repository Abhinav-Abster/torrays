/**
 * AniList GraphQL client for fetching rich anime metadata.
 * Free, public API with no authentication key required.
 */
import type { MediaMetadata } from "@/lib/catalog/types";

const ANILIST_API = "https://graphql.anilist.co";

const ANIME_SEARCH_QUERY = `
query ($search: String) {
  Page(page: 1, perPage: 1) {
    media(search: $search, type: ANIME, sort: [POPULARITY_DESC, SEARCH_MATCH]) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        large
        extraLarge
        color
      }
      bannerImage
      averageScore
      format
      episodes
      status
      seasonYear
      startDate {
        year
      }
      genres
      description(asHtml: false)
      siteUrl
    }
  }
}
`;

interface AniListResponse {
  data?: {
    Page?: {
      media?: Array<{
        id: number;
        title?: {
          romaji?: string;
          english?: string;
          native?: string;
        };
        coverImage?: {
          large?: string;
          extraLarge?: string;
          color?: string;
        };
        bannerImage?: string;
        averageScore?: number;
        format?: string;
        episodes?: number;
        status?: string;
        seasonYear?: number;
        startDate?: {
          year?: number;
        };
        genres?: string[];
        description?: string;
        siteUrl?: string;
      }>;
    };
  };
  errors?: unknown[];
}

export async function fetchAniListMetadata(
  query: string
): Promise<MediaMetadata | null> {
  const cleaned = cleanAnimeQuery(query);
  if (!cleaned || cleaned.length < 2) return null;

  try {
    const res = await fetch(ANILIST_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "Torrays/1.0",
      },
      body: JSON.stringify({
        query: ANIME_SEARCH_QUERY,
        variables: { search: cleaned },
      }),
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return null;

    const json: AniListResponse = await res.json();
    const media = json.data?.Page?.media?.[0];
    if (!media) return null;

    const mainTitle = media.title?.english || media.title?.romaji || "";
    if (!mainTitle) return null;

    const year = media.seasonYear || media.startDate?.year;

    // Clean html artifacts in description
    let overview = media.description || "";
    overview = overview
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]*>/g, "")
      .replace(/\(Source:.*?\)/gi, "")
      .trim();

    return {
      id: `anilist-${media.id}`,
      title: mainTitle,
      originalTitle:
        media.title?.romaji !== mainTitle
          ? media.title?.romaji
          : media.title?.native,
      type: "anime",
      posterUrl: media.coverImage?.extraLarge || media.coverImage?.large,
      backdropUrl: media.bannerImage,
      overview,
      releaseYear: year,
      rating: media.averageScore,
      ratingMax: 100,
      genres: media.genres || [],
      status: media.status,
      episodes: media.episodes,
      source: "AniList",
      url: media.siteUrl || `https://anilist.co/anime/${media.id}`,
    };
  } catch (err) {
    console.error("[AniList] Fetch error:", err);
    return null;
  }
}

/**
 * Remove torrent release group tags, quality tags, and season indicators
 * to improve search matching on AniList.
 */
function cleanAnimeQuery(raw: string): string {
  return raw
    .replace(/^\[.*?\]/g, "") // strip leading [SubGroup]
    .replace(/\(.*?\)/g, "") // strip parentheticals
    .replace(/\b(1080p|720p|480p|2160p|4k|bdrip|web-dl|mkv|mp4|hevc|x264|x265)\b/gi, "")
    .replace(/\b(s\d{1,2}|season\s*\d{1,2}|e\d{1,2}|episode\s*\d{1,2})\b/gi, "")
    .replace(/[-_.]+/g, " ")
    .trim();
}
