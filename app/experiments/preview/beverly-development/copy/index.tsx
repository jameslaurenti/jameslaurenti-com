import type { ReactNode } from "react";
import type { DevSite, SiteStatus } from "@/lib/beverly/developmentRegister";
import boulderLane from "./boulder-lane";
import cabotSt from "./218-226-cabot-st";
import dunhamRd from "./40-dunham-rd";
import enonSt from "./37-enon-st";
import follyHill from "./folly-hill";

/**
 * The written part of a site page: the prose that needs judgment and a neutrality pass. Everything else on a
 * page (facts, approvals, figures, zoning, PlanBeverly, history, sources) comes from the register. A site with
 * no entry here still gets a page, built from its data alone.
 */
export type SiteCopy = {
  /** Headings to use instead of the stage defaults from pageLabels(), for a site that doesn't fit them. */
  labels?: Partial<Record<"section" | "shows" | "needs" | "current" | "history", string>>;
  /** The line under the proposal heading naming its documents, linked once. */
  from?: ReactNode;
  lead: ReactNode;
  /** A sentence introducing the approvals list. */
  approvalsIntro?: ReactNode;
  afterApprovals?: ReactNode;
  /** Story-specific subsections, shown before "How it fits the rules". */
  sections?: { title: string; body: ReactNode }[];
  fits?: ReactNode;
  /** Whole sections after the history, for sites with a long public record (public comment, say). */
  afterHistory?: { id: string; title: string; body: ReactNode }[];
};

export type CopyContext = { site: DevSite; status: SiteStatus };

export const COPY: Record<string, (ctx: CopyContext) => SiteCopy> = {
  "boulder-lane": boulderLane,
  "37-enon-st": enonSt,
  "folly-hill": follyHill,
  "40-dunham-rd": dunhamRd,
  "218-226-cabot-st": cabotSt,
};
