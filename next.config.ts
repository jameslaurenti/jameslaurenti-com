import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /experiments/ holds unlisted work: reachable by direct link, never in the nav or the
  // sitemap, and kept out of search results. The header covers every file under the
  // folder (HTML, JSON, PDFs, images) and any app route added there later, so a new
  // experiment is hidden without remembering to tag it.
  //
  // It is deliberately NOT disallowed in robots.ts. Experiments get shared by link, and a
  // disallowed URL that something links to can still show up in results as a bare link,
  // because the crawler never fetches the page and never sees this noindex.
  async headers() {
    return [
      {
        source: "/experiments/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },

  // Review copies that have since been published: send the shared link to the real page.
  async redirects() {
    return [
      {
        source: "/experiments/beverly-digest-2026-10-05",
        destination: "/beverly/digest/2026-10-05",
        permanent: false,
      },
    ];
  },

  // Serve /experiments/<name>/index.html at /experiments/<name>. These run after the
  // filesystem check, so a real file such as /experiments/foo.json is served as itself.
  async rewrites() {
    return [
      {
        source: "/experiments/:name",
        destination: "/experiments/:name/index.html",
      },
    ];
  },
};

export default nextConfig;
