"use client";

import { useId, useState } from "react";
import guide from "@/data/beverly/zoning-guide.json";
import { trackOnce } from "@/lib/analytics";
import { Unchecked } from "./ui";

/**
 * The two ways zoning bends: change the ordinance for everyone, or get permission for one
 * property. Each step names who acts and the clock that applies. Steps that rest on statute text
 * not yet re-read this session carry the unverified flag.
 */

type Step = { title: string; who: string; when: string; body: React.ReactNode; checked: boolean };

const C = guide.council;

const AMEND: Step[] = [
  {
    title: "Someone proposes a change",
    who: "The City Council, the Planning Board, the Zoning Board of Appeals, an owner of the land affected, ten registered voters, the regional planning agency, or others the city charter allows",
    when: "Day 0",
    checked: false,
    body: (
      <>
        In Beverly most changes arrive as council orders from the Mayor and the Planning Department. The proposed pause on
        data centers, Order #250, was filed this way on October 5, 2026.
      </>
    ),
  },
  {
    title: "The Council sends it to the Planning Board",
    who: "City Council",
    when: "Within 14 days",
    checked: true,
    body: <>The board reviews it and holds its own hearing. The Council cannot skip this step.</>,
  },
  {
    title: "Two public hearings",
    who: "Planning Board and City Council",
    when: "Within 65 days",
    checked: true,
    body: (
      <>
        Each body holds a hearing, together or separately, and anyone can speak. For Order #250 the Council set its hearing for
        November 9, 2026. Notice runs in a newspaper two weeks in a row, the first at least 14 days ahead.
      </>
    ),
  },
  {
    title: "The Planning Board recommends",
    who: "Planning Board",
    when: "Report, or 21 days after its hearing",
    checked: true,
    body: <>The Council cannot vote until the board reports or 21 days pass without a report. The board can say yes, no, or yes with changes.</>,
  },
  {
    title: "The Council votes",
    who: "City Council",
    when: "Within 90 days of its hearing",
    checked: true,
    body: (
      <>
        Adoption takes two-thirds of the full Council: <b>{C.twoThirds.value} of {C.members.value}</b>, so an absent councilor counts
        the same as a no. A short list of housing changes, such as accessory apartments or multifamily housing by right near
        transit, needs only a majority, <b>{C.simpleMajority.value} of {C.members.value}</b>, under the state’s 2021 Housing
        Choice Act. Wait longer than 90 days and the hearings have to be held again.
        <Unchecked />
      </>
    ),
  },
  {
    title: "The Mayor signs, or vetoes",
    who: "Mayor",
    when: "After the vote",
    checked: false,
    body: <>Beverly’s charter sends every ordinance to the Mayor. The Council can override a veto with two-thirds of its members.</>,
  },
  {
    title: "It takes effect, and reaches back",
    who: "Everyone",
    when: "From the vote",
    checked: false,
    body: (
      <>
        A building or special permit applied for after the first hearing notice runs has to follow the new rule if it passes;
        until a 2026 state law, the test was when the permit was issued. If the change fails, the same proposal cannot come back
        for two years unless the Planning Board recommends it.
      </>
    ),
  },
];

const RELIEF: Step[] = [
  {
    title: "Start with a building permit",
    who: "Building Department",
    when: "Day 0",
    checked: false,
    body: (
      <>
        The Building Department checks the plans against zoning. If they comply, the permit issues with no hearing. That is what
        “by right” means. If not, there are a few ways forward.
      </>
    ),
  },
  {
    title: "A special permit, if the ordinance offers one",
    who: "Zoning Board of Appeals or Planning Board",
    when: "Hearing within 65 days of filing; decision within 90 days after",
    checked: true,
    body: (
      <>
        Some uses and features are allowed only after a hearing, where the board decides whether the project fits. On a five-member
        board it takes four votes, though a majority is enough for some housing, such as multifamily homes near transit with
        affordable units. The board can attach conditions. The apartments proposed at {guide.enon.address} need one
        from the Planning Board to build {guide.enon.parkingProposed.value} parking spaces where zoning requires{" "}
        {guide.enon.parkingRequired.value}.
      </>
    ),
  },
  {
    title: "A variance, if a rule cannot fit the lot",
    who: "Zoning Board of Appeals",
    when: "Lapses if unused for two years",
    checked: true,
    body: (
      <>
        Permission to depart from a rule, such as a setback or a height limit, for one lot. Until July 2026 the owner had to show
        a hardship caused by the lot’s soil, shape or slope, a bar few cases cleared. A 2026 state law replaced it with
        “practical difficulty,” weighed against the public benefits, housing among them, and the harms. On a five-member board
        it takes four votes.
      </>
    ),
  },
  {
    title: "A finding, for an older house",
    who: "Zoning Board of Appeals",
    when: "Same hearing rules",
    checked: true,
    body: (
      <>
        Many houses predate today’s rules. Changing one in a way that makes it less conforming, such as an addition into a
        setback, needs a finding that the change is not substantially more detrimental to the neighborhood. Since 2026, a house
        whose only problem is lot size, frontage, lot coverage or floor area has a simpler path.
      </>
    ),
  },
  {
    title: "Neighbors are told, and can appeal",
    who: "Abutters, the board, the courts",
    when: "20 days after the decision is filed",
    checked: true,
    body: (
      <>
        Owners within 300 feet get mailed notice of the hearing. After the decision is filed with the City Clerk, anyone aggrieved
        has 20 days to appeal to court. Then the decision is recorded at the Registry of Deeds, and only then does it take effect.
      </>
    ),
  },
];

export default function ProcessPaths() {
  const [tab, setTab] = useState<"amend" | "relief">("amend");
  const id = useId();
  const steps = tab === "amend" ? AMEND : RELIEF;
  const tabs: { key: "amend" | "relief"; label: string }[] = [
    { key: "amend", label: "Change the rules for everyone" },
    { key: "relief", label: "Get permission for one property" },
  ];

  return (
    <div className="mt-8">
      <div role="tablist" aria-label="Two ways zoning bends" className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            id={`${id}-${t.key}`}
            role="tab"
            type="button"
            aria-selected={tab === t.key}
            aria-controls={`${id}-panel`}
            onClick={() => {
              setTab(t.key);
              trackOnce("tool_used", `beverly-zoning:process-${t.key}`, { surface: "beverly-zoning", control: `process-${t.key}` });
            }}
            className={`rounded-full border px-4 py-2 text-[0.9375rem] font-semibold transition-colors ${
              tab === t.key ? "border-accent bg-accent text-white" : "border-ink-faint/40 text-ink hover:border-accent hover:text-accent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ol id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${tab}`} className="relative mt-6 space-y-0">
        {steps.map((s, i) => (
          <li key={s.title} className="relative grid grid-cols-[2.25rem_1fr] gap-x-3 pb-6 last:pb-0">
            {i < steps.length - 1 && <span className="absolute left-[1.06rem] top-9 h-[calc(100%-2.25rem)] w-px bg-accent/30" aria-hidden />}
            <span className="z-[1] flex h-9 w-9 items-center justify-center rounded-full border-2 border-accent bg-bg font-display text-[0.9375rem] font-bold text-accent">
              {i + 1}
            </span>
            <div className="pt-1">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h4 className="font-display text-lg font-semibold leading-snug">{s.title}</h4>
                <span className="text-[0.8125rem] font-semibold text-gold-strong">{s.when}</span>
              </div>
              <p className="text-[0.8125rem] text-ink-faint">{s.who}</p>
              <p className="mt-1.5 max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-mid">
                {s.body}
                {!s.checked && <Unchecked />}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
