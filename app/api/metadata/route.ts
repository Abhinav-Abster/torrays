/**
 * GET /api/metadata?q=<query>&category=<category>
 *
 * Fetches rich poster, backdrop, rating, and details from TMDb or AniList.
 */
import { NextRequest, NextResponse } from "next/server";
import { getMediaMetadata } from "@/lib/metadata";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim();
  const category = searchParams.get("category")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: "Query must be at least 2 characters" },
      { status: 400 }
    );
  }

  try {
    const metadata = await getMediaMetadata(query, category || undefined);
    return NextResponse.json({
      query,
      metadata,
    });
  } catch (err) {
    console.error("Metadata API error:", err);
    return NextResponse.json({ query, metadata: null });
  }
}
