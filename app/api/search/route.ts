/**
 * GET /api/search?q=<query>&source=<source>&category=<category>
 *
 * Searches all crawlers concurrently and returns filtered results.
 * Mirrors magnetissimo's /api/search/:search_term endpoint.
 */
import { searchAll } from "@/lib/crawlers";
import { getMediaMetadata } from "@/lib/metadata";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim();
  const sourceFilter = searchParams.get("source")?.trim();
  const categoryFilter = searchParams.get("category")?.trim();
  const allowNsfw = searchParams.get("nsfw") === "true";

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: "Query must be at least 2 characters" },
      { status: 400 }
    );
  }

  try {
    const [searchResults, media] = await Promise.all([
      searchAll(query),
      getMediaMetadata(query, categoryFilter || undefined).catch(() => null),
    ]);

    let results = searchResults;

    // Apply filters
    if (sourceFilter) {
      const sf = sourceFilter.toLowerCase().replace(/[\s.-]/g, "");
      results = results.filter((t) => {
        const s = t.source.toLowerCase().replace(/[\s.-]/g, "");
        if (
          (sf === "thepiratebay" || sf === "piratebay" || sf === "tpb") &&
          (s === "thepiratebay" || s === "piratebay" || s === "tpb")
        ) {
          return true;
        }
        return s === sf;
      });
    }
    if (categoryFilter) {
      results = results.filter(
        (t) => t.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    if (!allowNsfw) {
      results = results.filter(
        (t) => !t.isNsfw && t.category.toLowerCase() !== "xxx"
      );
    }

    return NextResponse.json({
      query,
      count: results.length,
      media,
      results,
    });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json(
      { error: "Search failed — upstream sources may be unavailable" },
      { status: 502 }
    );
  }
}
