<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Experiments

`/experiments/` is for unlisted work: shared by direct link, never in the site nav, the sitemap, or any index page. Every path under it is sent with `X-Robots-Tag: noindex, nofollow` from `next.config.ts`, so new files are hidden automatically. Keep it that way: don't link to experiments from nav or listing pages, don't add them to `app/sitemap.ts`, and give standalone HTML files a `<meta name="robots" content="noindex, nofollow">` tag as well. A static experiment goes in `public/experiments/<name>/index.html` and is served at `/experiments/<name>`.
