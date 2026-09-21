import type { MetadataRoute } from "next";
import { issues } from "@/data/beverly/digestIssues";
import { getAllPosts } from "@/lib/posts";

const SITE = "https://www.jameslaurenti.com";

/**
 * Only pages that should be found. A sitemap is a set of recommendations, so anything
 * carrying `robots: { index: false }` is left out rather than listed and then disavowed.
 *
 * Deliberately absent, and why:
 *   /beverly/pension-cliff        noindex, held pending its own review
 *   /beverly/bridge-model         noindex, unlinked exploratory work
 *   /beverly/who-beverly-is(-v2)  behind the unlock gate
 *   /harborlight/*, /unlock       private or token-based
 *   /work                         still resolves for old links, but nothing points at it
 *                                 any more and it is not worth surfacing again
 */
const pages: [path: string, priority: number][] = [
  ["/", 1.0],
  ["/beverly", 0.9],
  ["/beverly/digest", 0.9],
  ["/writing", 0.7],
  ["/writing/the-crystal-and-the-salute", 0.6],
  ["/about", 0.6],
  ["/beverly/budget-explainer", 0.7],
  ["/beverly/fy27-budget", 0.7],
  ["/beverly/budget-challenge", 0.7],
  ["/beverly/property-tax", 0.7],
  ["/beverly/what-sets-your-taxes", 0.7],
  ["/beverly/development-map", 0.6],
  ["/making-things", 0.5],
  ["/contact", 0.4],
  ["/privacy", 0.3],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const statics = pages.map(([path, priority]) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: (path === "/beverly/digest" ? "weekly" : "monthly") as
      | "weekly"
      | "monthly",
    priority,
  }));

  // Issues are dated and never revised after publication, so their own date is the
  // honest lastModified rather than the build time.
  const digest = issues.map((issue) => ({
    url: `${SITE}/beverly/digest/${issue.slug}`,
    lastModified: new Date(`${issue.slug}T12:00:00Z`),
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  const posts = getAllPosts()
    .filter((p) => !p.external_url)
    .map((p) => ({
      url: `${SITE}/making-things/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    }));

  return [...statics, ...digest, ...posts];
}
