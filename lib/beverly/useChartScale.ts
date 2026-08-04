"use client";

import { RefObject, useEffect, useState } from "react";

/**
 * SVG text drawn in viewBox units shrinks with the chart. A 360-unit chart squeezed onto a
 * 293px phone renders an 8-unit label at 6.5 real pixels, which is not readable.
 *
 * This returns "viewBox units per rendered CSS pixel" for a chart element. Multiply a font
 * size by it and the label lands at that size on screen no matter how the chart is scaled.
 *
 * Capped at 1 on the low side: when a chart is rendered wider than its viewBox (the usual
 * desktop case) labels are already larger than authored, and shrinking them back would be a
 * regression. So this only ever grows text on narrow screens.
 */
/** Smallest on-screen size any chart label may render at, in CSS pixels. */
const MIN_LABEL_PX = 9.5;

export function useChartScale(ref: RefObject<SVGSVGElement | HTMLElement | null>, viewBoxWidth: number) {
  const [u, setU] = useState(1);

  useEffect(() => {
    let ro: ResizeObserver | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    // Charts that fetch their data render a placeholder first, so the element is often absent
    // on the first effect run. Retry until it appears, otherwise the hook silently no-ops and
    // the labels stay unscaled. A timer rather than requestAnimationFrame on purpose: rAF is
    // throttled to a stop in background or non-compositing tabs, and the chart would then
    // render at the wrong size the moment the reader looked at it.
    const attach = () => {
      if (cancelled) return;
      const el = ref.current;
      if (!el) {
        timer = setTimeout(attach, 50);
        return;
      }
      const measure = () => {
        const w = el.getBoundingClientRect().width;
        if (w > 0) setU(Math.max(1, viewBoxWidth / w));
      };
      measure();
      ro = new ResizeObserver(measure);
      ro.observe(el);
    };
    attach();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      ro?.disconnect();
    };
  }, [ref, viewBoxWidth]);

  /**
   * Converts a desired on-screen font size to viewBox units.
   *
   * When the chart is being squeezed (u > 1, i.e. phones) a floor applies, because the sizes
   * these charts are authored at are tuned for a wide render and drop to 7px on a phone.
   * At full size the authored value is used as-is, so desktop is untouched.
   */
  const fs = (px: number) => +((u > 1 ? Math.max(px, MIN_LABEL_PX) : px) * u).toFixed(2);

  return { u, fs };
}
