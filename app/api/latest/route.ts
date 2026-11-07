/**
 * GET /api/latest
 *
 * Returns the latest torrents from all sources.
 * Mirrors magnetissimo's /api/latest endpoint.
 */
import { NextRequest, NextResponse } from "next/server";
import { latestAll, latestHome } from "@/lib/crawlers";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const isAll =
    searchParams.get("all") === "true" ||
    searchParams.get("source") === "all";
  const allowNsfw = searchParams.get("nsfw") === "true";

  try {
    let results = isAll ? await latestAll() : await latestHome();

    if (!allowNsfw) {
      results = results.filter(
        (t) => !t.isNsfw && t.category.toLowerCase() !== "xxx"
      );
    }

    return NextResponse.json({
      count: results.length,
      results,
    });
  } catch (err) {
    console.error("Latest API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch latest torrents" },
      { status: 502 }
    );
  }
}
