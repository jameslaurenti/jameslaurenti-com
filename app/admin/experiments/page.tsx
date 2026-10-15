import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import Link from "next/link";
import { EXPERIMENTS, STATUS_LABEL, type Experiment } from "@/data/experiments";
import CopyLink from "./CopyLink";

/**
 * A private dashboard of everything under /experiments, for opening drafts on any device and
 * grabbing a link to share one. Not linked from anywhere, not in the sitemap, noindex (header
 * from next.config.ts plus the robots tag below), disallowed in robots.ts, and behind the draft
 * password (proxy.ts). The experiments themselves stay open to anyone with a link.
 *
 * It lives at /admin/experiments rather than /experiments on purpose: someone given one
 * experiment's link can guess /experiments, but nothing in that link leads here.
 *
 * Folders are scanned at build time, so an experiment shows up here as soon as it exists;
 * data/experiments.ts adds titles, descriptions and status.
 */

export const metadata: Metadata = {
  title: "Experiments — James Laurenti",
  robots: { index: false, follow: false },
};

type Row = Experiment & { source: "app" | "public" | "missing"; described: boolean };

function listDirs(dir: string): string[] {
  try {
    return fs
      .readdirSync(path.join(/*turbopackIgnore: true*/ process.cwd(), dir), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return [];
  }
}

function rows(): Row[] {
  const app = new Set(listDirs("app/experiments"));
  const pub = new Set(
    listDirs("public/experiments").filter((d) => fs.existsSync(path.join(/*turbopackIgnore: true*/ process.cwd(), "public/experiments", d, "index.html"))),
  );
  const found = new Set([...app, ...pub]);
  const known = new Map(EXPERIMENTS.map((e) => [e.slug, e]));

  const out: Row[] = EXPERIMENTS.map((e) => ({
    ...e,
    source: app.has(e.slug) ? "app" : pub.has(e.slug) ? "public" : "missing",
    described: true,
  }));
  for (const slug of found) {
    if (!known.has(slug)) {
      out.push({
        slug,
        title: slug.replace(/-/g, " "),
        blurb: "No description yet. Add an entry in data/experiments.ts.",
        status: "draft",
        source: app.has(slug) ? "app" : "public",
        described: false,
      });
    }
  }
  return out.sort((a, b) => (b.updated ?? "").localeCompare(a.updated ?? ""));
}

const CHIP: Record<string, string> = {
  draft: "border-accent text-accent",
  paused: "border-gold-strong text-gold-strong",
  review: "border-cuts text-cuts",
  internal: "border-ink-faint/60 text-ink-mid",
  reference: "border-ink-faint/60 text-ink-mid",
};

export default function ExperimentsDashboard() {
  const list = rows();
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <p className="text-[0.75rem] font-bold uppercase tracking-[0.16em] text-ink-faint">Private · not linked anywhere</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Experiments</h1>
      <p className="mt-3 max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-mid">
        Everything under /experiments, newest first. Each opens in place; copy a link to share one on its own. {list.length}{" "}
        {list.length === 1 ? "item" : "items"}.
      </p>

      <ul className="mt-8 space-y-4">
        {list.map((e) => {
          const href = `/experiments/${e.slug}`;
          return (
            <li key={e.slug} className="rounded-lg border border-rule bg-white/60 px-5 py-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 className="font-display text-xl font-semibold">
                  {e.source === "missing" ? (
                    e.title
                  ) : (
                    <Link href={href} className="hover:text-accent">
                      {e.title}
                    </Link>
                  )}
                </h2>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] ${CHIP[e.status]}`}
                >
                  {STATUS_LABEL[e.status]}
                </span>
                {e.updated && <span className="text-[0.75rem] text-ink-faint">{e.updated}</span>}
              </div>
              <p className={`mt-1.5 text-[0.9375rem] leading-relaxed ${e.described ? "text-ink-mid" : "italic text-ink-faint"}`}>
                {e.blurb}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {e.source === "missing" ? (
                  <span className="text-[0.8125rem] text-debt">Listed in data/experiments.ts, but no folder exists.</span>
                ) : (
                  <>
                    <Link
                      href={href}
                      className="rounded-md bg-accent px-3 py-1.5 text-[0.8125rem] font-semibold hover:bg-accent-lt"
                    >
                      {/* The site-wide `a` reset outranks text-white on the link itself. */}
                      <span className="text-white">Open</span>
                    </Link>
                    <CopyLink path={href} />
                    <code className="text-[0.75rem] text-ink-faint">{href}</code>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
