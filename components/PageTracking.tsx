"use client";

import { useEffect } from "react";
import { track, trackOnce, type Surface, type TrackEvent } from "@/lib/analytics";

/**
 * Mounted once per instrumented page. Does two jobs without the page it measures having
 * to become a client component:
 *
 *   1. Delegated click tracking. Links declare intent with data-track attributes and a
 *      single listener reads them, so an article that is entirely links ships no
 *      per-link JavaScript and stays a server component.
 *   2. Section depth. One IntersectionObserver over section[id], firing once each.
 *
 * The section a click happened in is derived by walking up to the nearest section[id],
 * so individual links never have to be told where they live.
 */
export default function PageTracking({
  surface,
  issue,
  depth = false,
}: {
  surface: Surface;
  /** Digest issues only, so weeks can be compared instead of blended. */
  issue?: string;
  /** Section-level read depth. Only worth it on long, sectioned pages. */
  depth?: boolean;
}) {
  useEffect(() => {
    const base: Record<string, string> = { surface };
    if (issue) base.issue = issue;

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;

      const { track: name, ...rest } = el.dataset;
      if (!name) return;

      const section = el.closest("section[id]")?.id;

      // Recording vs filed document is knowable from the URL, so no link has to be
      // told which it is and none can drift out of sync with where it points.
      const href = el.getAttribute("href") ?? "";
      const sourceType =
        name === "source_opened"
          ? /youtube\.com|youtu\.be/.test(href)
            ? "recording"
            : "document"
          : undefined;

      // dataset camelCases attribute names, so data-meeting-date arrives as
      // meetingDate. GA4 parameters are snake_case by convention and mixing the two
      // makes reports quietly inconsistent, so normalise on the way out.
      const extra: Record<string, string> = {};
      for (const [k, v] of Object.entries(rest)) {
        if (typeof v === "string" && v !== "") {
          extra[k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)] = v;
        }
      }

      track(name as TrackEvent, {
        ...base,
        ...(section ? { section } : {}),
        ...(sourceType ? { source_type: sourceType } : {}),
        ...extra,
      });
    };

    // Capture phase, so a click is recorded even if something downstream stops it.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [surface, issue]);

  useEffect(() => {
    if (!depth) return;
    if (typeof IntersectionObserver === "undefined") return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    if (!sections.length) return;

    const order = new Map(sections.map((el, i) => [el.id, i + 1]));

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          trackOnce("read_depth", id, {
            surface,
            ...(issue ? { issue } : {}),
            section: id,
            position: order.get(id) ?? 0,
          });
          io.unobserve(entry.target);
        }
      },
      // A heading grazing the bottom edge is not "read". Require a bit of commitment.
      { rootMargin: "0px 0px -45% 0px", threshold: 0.01 }
    );

    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [surface, issue, depth]);

  return null;
}
