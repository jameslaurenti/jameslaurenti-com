# jameslaurenti.com

My personal site. Product work, civic tools for my town, and writing. Based in Beverly, Massachusetts.

**Live site:** [jameslaurenti.com](https://jameslaurenti.com)

## Stack

- [Next.js 16](https://nextjs.org) (App Router) and TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- Markdown content via gray-matter and remark
- Deployed on [Vercel](https://vercel.com)

## Pages

- **Home.** The thesis, what I'm currently into, and the two modes the work splits into.
- **About.** Background, in my own words.
- **Work.** A tagged index, sorted by two kinds of curiosity: how things work, and what things mean.
- **Civic Tools: Beverly** (`/work/beverly`). Three tools for my town: a budget explainer, a budget challenge, and a development map. The first two are full-bleed static HTML in `public/`; the map embeds a separate app.
- **The Crystal and the Salute** (`/work/the-crystal-and-the-salute`). An essay.
- **Making Things.** A route reserved for future writing and experiments. Hidden from the nav for now.
- **Contact.** A Formspree-backed form.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Built with

Designed and built with [Claude Code](https://claude.ai/code).

## License

- **Code** is MIT licensed; see [LICENSE](LICENSE). Fork it, adapt it, build your own town's version.
- **The Beverly Meeting Digest** (the issues under `app/beverly/digest/`, and the feeds at
  `/beverly/digest/feed.xml` and `/beverly/digest/stories.xml`) is dedicated to the public domain
  under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Reuse, adapt or republish it,
  no permission needed. A link back is appreciated, and please keep the links to recordings and
  documents so readers can check the work.
- **Other writing on the site** (essays and explainers) is not covered by either and remains
  © James Laurenti unless it says otherwise.
