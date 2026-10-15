<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Experiments

`/experiments/` is for unlisted work: shared by direct link, never in the site nav, the sitemap, or any index page. Every path under it is sent with `X-Robots-Tag: noindex, nofollow` from `next.config.ts`, so new files are hidden automatically. Keep it that way: don't link to experiments from nav or listing pages, don't add them to `app/sitemap.ts`, and give standalone HTML files a `<meta name="robots" content="noindex, nofollow">` tag as well. A static experiment goes in `public/experiments/<name>/index.html` and is served at `/experiments/<name>`.

The one exception is `/admin/experiments`, a private dashboard of everything in the folder for the site owner. It is never linked, is noindex and disallowed in `robots.ts`, and deliberately does not live at `/experiments` so that someone given one experiment's link cannot find the rest by trimming the URL. It scans `app/experiments/` and `public/experiments/` at build time; add a title, a line of description and a status for a new experiment in `data/experiments.ts`. Do not add anything else under `/admin` that is linked from the public site.
