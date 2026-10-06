/**
 * GET /api/search?q=<query>&source=<source>&category=<category>
 *
 * Searches all crawlers concurrently and returns filtered results.
 * Mirrors magnetissimo's /api/search/:search_term endpoint.
 */
import { NextRequest, NextResponse } from "next/server";
import { searchAll } from "@/lib/crawlers";
import { getMediaMetadata } from "@/lib/metadata";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim();
  const sourceFilter = searchParams.get("source")?.trim();
  const categoryFilter = searchParams.get("category")?.trim();

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
      const sf = sourceFilter.toLowerCase();
      results = results.filter((t) => {
        const s = t.source.toLowerCase();
        if (
          (sf === "1337x" || sf === "1377x") &&
          (s === "1337x" || s === "1377x")
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
