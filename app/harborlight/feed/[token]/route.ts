import digestData from "@/data/harborlight/digest.json";
import type { DigestItem } from "@/lib/harborlight/types";

// RSS for the parent digest, served at an unguessable path so it can be handed to
// a feed reader (a password gate would break most readers). The token is a server
// secret, kept out of the client bundle. Set HARBORLIGHT_FEED_TOKEN in the deploy
// env to rotate it; the fallback is the local-dev token.
const FEED_TOKEN = process.env.HARBORLIGHT_FEED_TOKEN || "seahorse-feed";
const BASE = "https://www.jameslaurenti.com";
const ITEMS = digestData.items as DigestItem[];

function xml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rfc822(date: string): string {
  return new Date(`${date}T12:00:00Z`).toUTCString();
}

function itemXml(item: DigestItem): string {
  const link = item.links[0]?.url ?? `${BASE}/harborlight`;
  const cats = [item.categoryLabel, item.classroom].filter(Boolean) as string[];
  const bodyLines = [
    item.summary,
    ...(item.actionItems.length
      ? ["", "What to do:", ...item.actionItems.map((a) => `- ${a}`)]
      : []),
    ...(item.keyDates.length
      ? ["", "Dates:", ...item.keyDates.map((k) => `- ${k.date}: ${k.label}`)]
      : []),
  ];
  const description = bodyLines.join("\n");
  return `    <item>
      <title>${xml(item.title)}</title>
      <link>${xml(link)}</link>
      <guid isPermaLink="false">harborlight-${item.id}</guid>
      <pubDate>${rfc822(item.date)}</pubDate>
${cats.map((c) => `      <category>${xml(c)}</category>`).join("\n")}
      <description><![CDATA[${description}]]></description>
    </item>`;
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ token: string }> },
) {
  const { token } = await ctx.params;
  if (token !== FEED_TOKEN) {
    return new Response("Not found", { status: 404 });
  }

  const latest = ITEMS[0]?.date ?? "2026-08-16";
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Harborlight parent digest</title>
    <link>${BASE}/harborlight</link>
    <description>The important bits from Harborlight Montessori school notes.</description>
    <language>en-us</language>
    <lastBuildDate>${rfc822(latest)}</lastBuildDate>
${ITEMS.map(itemXml).join("\n")}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=1800",
      "x-robots-tag": "noindex",
    },
  });
}
