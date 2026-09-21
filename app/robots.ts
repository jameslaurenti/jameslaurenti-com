import type { MetadataRoute } from "next";

const SITE = "https://www.jameslaurenti.com";

/**
 * Crawling and indexing are different levers, and mixing them up is the usual mistake.
 *
 * A page that carries `robots: { index: false }` must still be CRAWLABLE, or the crawler
 * never reads the tag telling it to stay out, and the URL can end up listed anyway from
 * inbound links. So the noindex pages are deliberately NOT disallowed here:
 * /beverly/pension-cliff, /beverly/bridge-model, /beverly/who-beverly-is(-v2).
 *
 * Disallow is for things that should not be fetched at all: a private feed keyed by token,
 * the gate pages that guard drafts, and Next's internals.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/harborlight", "/harborlight/", "/unlock", "/api/", "/_next/"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
