import type { MetadataRoute } from "next";

const SITE = "https://www.jameslaurenti.com";

/**
 * Disallow is for anything that should not be FETCHED, which is a stronger thing than
 * not being indexed.
 *
 * The unfinished Beverly pages are listed here on purpose. They keep their `noindex` tags
 * as well, but the point is that they are drafts, and drafts should not be read by
 * crawlers at all rather than read and then politely left out. The usual argument against
 * this is that a disallowed URL can still surface as a bare link if something points at
 * it; nothing points at any of these, so that does not apply.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Private or token-keyed.
          "/harborlight",
          "/harborlight/",
          "/unlock",
          "/api/",
          "/_next/",
          // Unfinished work. Also noindex; this keeps crawlers out of it entirely.
          "/beverly/pension-cliff",
          "/beverly/bridge-model",
          "/beverly/who-beverly-is",
          "/beverly/who-beverly-is-v2",
        ],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
