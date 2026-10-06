/**
 * GET /api/latest
 *
 * Returns the latest torrents from all sources.
 * Mirrors magnetissimo's /api/latest endpoint.
 */
import { NextResponse } from "next/server";
import { latestAll } from "@/lib/crawlers";

export async function GET() {
  try {
    const results = await latestAll();

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
