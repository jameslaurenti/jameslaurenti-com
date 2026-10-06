import type { NextRequest } from "next/server";
import { FEED_HEADERS, issuesFeed } from "@/lib/beverly/digestFeed";

// Built per request from the live issue pages and cached at the edge; see lib/beverly/digestFeed.ts.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return new Response(await issuesFeed(req.nextUrl.origin), { headers: FEED_HEADERS });
}
