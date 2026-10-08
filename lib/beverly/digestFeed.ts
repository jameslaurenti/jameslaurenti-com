/**
 * RSS feeds for the Beverly Meeting Digest, built from the published issue pages.
 *
 * Two feeds, one source:
 *   /beverly/digest/feed.xml     one entry per issue, the whole issue. Email services
 *                                (Buttondown) watch this one to draft each send.
 *   /beverly/digest/stories.xml  one entry per story, for anyone who wants to carry or
 *                                adapt a single item: a newsletter, a video, a post.
 *
 * Both read the rendered issue page rather than a parallel copy of its text, so an issue
 * is written once and a correction made on the page reaches the feeds too. That ties the
 * feeds to the page structure, which every issue already follows:
 *   - each story is a <section id="..."> whose <h2> is its headline;
 *   - recording moments are links with data-placement "inline-moment" or "hear-button";
 *   - calendar controls are <details> elements;
 *   - each story section may carry data-dek, a one-sentence summary written with the issue.
 *     It becomes the entry's description. Issues before October 2026 fall back to the
 *     story's first long paragraph.
 * Sections that are calendars rather than stories are listed in NOT_STORIES.
 *
 * Every entry carries the reuse terms: CC0, no permission needed, a link back appreciated.
 */
import { parse, type HTMLElement } from "node-html-parser";
import { issues, type DigestIssue } from "@/data/beverly/digestIssues";

export const SITE = "https://www.jameslaurenti.com";
const CC0 = "https://creativecommons.org/publicdomain/zero/1.0/";

/** Section ids that hold dates and listings, not stories. */
const NOT_STORIES = new Set(["ahead", "horizon", "dates", "corrections"]);

const issueUrl = (slug: string) => `${SITE}/beverly/digest/${slug}`;

/** 9am Eastern on the issue's date, which is when issues go out. */
const issueDate = (slug: string) => {
  const [y, m, d] = slug.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 13));
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;

const reuseNote = (canonical: string) =>
  `<hr/><p><em>From the <a href="${canonical}">Beverly Meeting Digest</a>, by James Laurenti. ` +
  `Any corrections are posted at that link. Free to reuse, adapt or republish, no permission ` +
  `needed (<a href="${CC0}">CC0</a>). A link back is appreciated, and please keep the links to ` +
  `recordings and documents so readers can check the work.</em></p>`;

/**
 * Strip a block of issue markup down to plain, portable HTML: no classes, no controls,
 * absolute links, and recording moments as readable links.
 */
function clean(el: HTMLElement, canonical: string): HTMLElement {
  for (const n of el.querySelectorAll("nav, script, style, svg, button, details, form")) n.remove();

  // A full-width "hear this" button becomes one plain line.
  for (const a of el.querySelectorAll('a[data-placement="hear-button"]')) {
    const href = a.getAttribute("href") ?? "";
    const parts = a
      .querySelectorAll("span")
      .filter((s) => !s.querySelector("span") && s.getAttribute("aria-hidden") === undefined)
      .map((s) => s.text.trim())
      .filter(Boolean);
    const [title, meeting] = parts;
    a.replaceWith(
      `<p>&#9654; Listen: <a href="${esc(href)}">${esc(title ?? "the recording")}</a>` +
        (meeting ? ` (${esc(meeting)})` : "") +
        `</p>`
    );
  }

  // An inline timestamp chip becomes "(1:23:13)", still linked to that second.
  for (const a of el.querySelectorAll('a[data-placement="inline-moment"]')) {
    const href = a.getAttribute("href") ?? "";
    a.replaceWith(`(<a href="${esc(href)}">${esc(a.getAttribute("data-moment") ?? a.text.trim())}</a>)`);
  }

  for (const n of el.querySelectorAll('[aria-hidden="true"]')) n.remove();

  // "Go deeper" and "Read more" rows: a label and its links, with separators that the
  // page gets from layout and plain HTML does not.
  for (const span of el.querySelectorAll("span")) {
    const label = span.text.trim();
    if (label !== "Go deeper" && label !== "Read more") continue;
    const row = span.parentNode as HTMLElement;
    const links = row.querySelectorAll("a").map((a) => a.outerHTML);
    row.replaceWith(`<p><strong>${label}:</strong> ${links.join(" &middot; ")}</p>`);
  }

  for (const n of el.querySelectorAll("*")) {
    const href = n.getAttribute("href");
    for (const k of Object.keys(n.attributes)) {
      if (k !== "href" && k !== "colspan" && k !== "rowspan") n.removeAttribute(k);
    }
    if (href?.startsWith("/")) n.setAttribute("href", SITE + href);
    else if (href?.startsWith("#")) n.setAttribute("href", canonical + href);
  }
  return el;
}

type Loaded = { issue: DigestIssue; container: HTMLElement };

/** Fetch an issue page from this deployment and find the block that holds the issue. */
async function load(origin: string, issue: DigestIssue): Promise<Loaded | null> {
  try {
    const res = await fetch(`${origin}/beverly/digest/${issue.slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const root = parse(await res.text());
    let el = root.querySelector("section[id]") as HTMLElement | null;
    while (el && !el.querySelector("h1")) el = el.parentNode as HTMLElement | null;
    return el ? { issue, container: el } : null;
  } catch {
    return null;
  }
}

type Item = {
  title: string;
  link: string;
  date: Date;
  summary: string;
  html: string;
  categories?: string[];
};

function rss(opts: { title: string; self: string; description: string; items: Item[] }) {
  const items = opts.items
    .map(
      (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${esc(i.link)}</link>
      <guid isPermaLink="true">${esc(i.link)}</guid>
      <pubDate>${i.date.toUTCString()}</pubDate>
${(i.categories ?? []).map((c) => `      <category>${esc(c)}</category>\n`).join("")}      <description>${esc(i.summary)}</description>
      <content:encoded>${cdata(i.html)}</content:encoded>
    </item>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(opts.title)}</title>
    <link>${SITE}/beverly/digest</link>
    <atom:link href="${esc(opts.self)}" rel="self" type="application/rss+xml"/>
    <description>${esc(opts.description)}</description>
    <language>en-us</language>
    <copyright>No rights reserved. CC0 1.0, ${CC0}. A link back is appreciated.</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

const recent = () => issues.slice(0, 20);

export async function issuesFeed(origin: string) {
  const loaded = (await Promise.all(recent().map((i) => load(origin, i)))).filter(
    (x): x is Loaded => x !== null
  );
  const items: Item[] = loaded.map(({ issue, container }) => {
    const canonical = issueUrl(issue.slug);
    const body = clean(parse(container.outerHTML), canonical);
    body.querySelector("h1")?.remove();
    return {
      title: `Beverly Meeting Digest, No. ${issue.number}: ${issue.covering}`,
      link: canonical,
      date: issueDate(issue.slug),
      summary: issue.teaser,
      html: body.innerHTML + reuseNote(canonical),
    };
  });
  return rss({
    title: "Beverly Meeting Digest",
    self: `${SITE}/beverly/digest/feed.xml`,
    description:
      "A weekly digest of Beverly, Massachusetts city meetings, built from the recordings and the city's posted documents. Independent, not a City of Beverly publication. Free to reuse (CC0).",
    items,
  });
}

/** Each story in one issue as a feed item, calendars and corrections left out. */
function storyItems({ issue, container }: Loaded): Item[] {
  const items: Item[] = [];
  const canonical = issueUrl(issue.slug);
  for (const section of container.querySelectorAll("section[id]")) {
    const id = section.getAttribute("id") ?? "";
    if (NOT_STORIES.has(id)) continue;
    // The one-sentence summary written with the issue; read before clean() strips data-*.
    const dek = section.getAttribute("data-dek")?.trim();
    const s = clean(parse(section.outerHTML), canonical);
    const h2 = s.querySelector("h2");
    if (!h2) continue;
    const title = h2.text.trim();
    h2.remove();
    // The eyebrow ("05 · Tonight · New") becomes the category, without its number.
    const eyebrow = s.querySelector("span");
    const kicker = eyebrow?.text.replace(/^\s*\d+\s*·\s*/, "").trim();
    if (kicker && kicker.length < 80) eyebrow?.remove();
    // Fallback for issues without a dek: the first real paragraph of the story, skipping
    // the dateline ("City Council · Monday ..."), the listen line and the source rows, with
    // timestamp links like "(1:02:31)" dropped.
    const firstPara = s
      .querySelectorAll("p")
      .map((p) => p.text.replace(/\s*\(\d{1,2}(?::\d{2}){1,2}\)/g, "").replace(/\s+/g, " ").trim())
      .find(
        (t) =>
          t.length > 80 &&
          !t.slice(0, 90).includes(" · ") &&
          !t.startsWith("▶") &&
          !/^(Go deeper|Read more):/.test(t)
      );
    const link = `${canonical}#${id}`;
    items.push({
      title,
      link,
      date: issueDate(issue.slug),
      summary: dek || firstPara || title,
      categories: [`Issue ${issue.number}`, ...(kicker ? [kicker] : [])],
      html: s.innerHTML + reuseNote(link),
    });
  }
  return items;
}

export async function storiesFeed(origin: string) {
  const loaded = (await Promise.all(recent().map((i) => load(origin, i)))).filter(
    (x): x is Loaded => x !== null
  );
  const items = loaded.flatMap(storyItems);
  return rss({
    title: "Beverly Meeting Digest, story by story",
    self: `${SITE}/beverly/digest/stories.xml`,
    description:
      "Every story from the Beverly Meeting Digest as its own entry, for carrying or adapting one item at a time. Free to reuse (CC0).",
    items,
  });
}

/**
 * The newest issue's stories as headline, one-sentence summary and link: what the signup
 * page shows as a sample, and what the weekly email is built from. Null if the page could
 * not be read, so callers can fall back to the issue's teaser.
 */
export async function latestStories(origin: string) {
  const issue = issues[0];
  const loaded = await load(origin, issue);
  if (!loaded) return null;
  return {
    issue,
    stories: storyItems(loaded).map(({ title, summary, link }) => ({ title, summary, link })),
  };
}

export const FEED_HEADERS = {
  "Content-Type": "application/rss+xml; charset=utf-8",
  // Cached at the edge for an hour; a new issue appears within the hour after it ships.
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};
