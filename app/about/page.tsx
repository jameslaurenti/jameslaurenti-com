import type { Metadata } from "next";
import Link from "next/link";

const DESCRIPTION =
  "Curiosity, where it started in a Classics department, and where it points now: mostly at Beverly, Massachusetts.";

export const metadata: Metadata = {
  title: "About — James Laurenti",
  description: DESCRIPTION,
  // Its own openGraph, so link previews show this page's description and URL rather than
  // the site-wide ones from the root layout. Setting openGraph here drops the image the root
  // segment's app/opengraph-image.tsx would supply, so it is named again.
  openGraph: {
    type: "website",
    title: "About James Laurenti",
    description: DESCRIPTION,
    url: "/about",
    siteName: "James Laurenti",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

/**
 * Rewritten November 2026 to lead with curiosity rather than the job. The arc runs: the
 * trait, where it started (Classics at BU), the habit it became, where it points now
 * (Beverly), then work and life. This page carries James's own view of why the civic work
 * matters; the Beverly pages themselves stay neutral.
 */
export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-10">
        About
      </h1>

      <div className="prose text-ink">
        <p>
          The thing I&apos;d point to first about myself is curiosity. When something
          catches me, I want to understand it whole, including why it works the way it
          does, why it isn&apos;t built some other way, and what the strongest argument
          looks like from the other side. That instinct runs through everything here, my
          day job included.
        </p>
        <p>
          It started in college, though not where I planned. I arrived at Boston University
          as a chemistry major. I was learning plenty, but the skills I cared about most were
          atrophying: writing, speaking, thinking about anything outside a lab. Then an
          honors requirement put me in a class called The Decline and Fall of the Roman
          Empire.{" "}
          <a href="https://www.bu.edu/classics/loren-j-samons" className="rlink">
            Professor Samons
          </a>{" "}
          challenged me in a way no one had before and pushed me to
          get better at things that mattered. That class is why I switched to Classics,
          diving into Latin and Greek, Homer, Catullus and Ovid, with professors who trained
          me to read closely, argue, and parse out what a text meant.
        </p>
        <p>
          I went to college thinking it was how you get a job and become an adult. What I
          found was that I&apos;d come to learn how to learn. Classics built the muscles I
          still use every day: sitting with what doesn&apos;t resolve, reading for
          what&apos;s underneath, not settling for the first answer.
        </p>
        <p>
          One of my favorite films is Princess Mononoke. A town of ironworkers is cutting
          into an ancient forest and killing the creatures that live there, and the film
          never lets you write them off as villains. They are earnest people building better
          lives, and the industry that makes those lives possible carries a real cost. Most
          conflicts look like that up close, even a zoning fight down the street. The first
          version of a story is rarely the whole one, so I try not to fall in love with my
          first opinion. Understanding takes work, and I&apos;d rather do the work than pick
          a side early.
        </p>
        <p>
          Right now most of that curiosity points at{" "}
          <Link href="/beverly" className="rlink">
            Beverly, Massachusetts
          </Link>
          . I&apos;m not from here. We moved in 2022, it&apos;s my daughters&apos; home, and
          we&apos;re putting roots down. When I tried to understand how the city works, the
          information was scattered, hard to get, and usually missing context. In the summer
          of 2026 I started reading the packets and watching the meetings myself, learning how
          budgets, ordinances, zoning, development, and conservation fit together, then
          translating what I found. That became the{" "}
          <Link href="/beverly/digest" className="rlink">
            Beverly Meeting Digest
          </Link>
          , a weekly summary of what the city&apos;s boards did. It&apos;s as neutral as I
          can make it, linking straight into the recordings so neighbors can hear what was
          said, and how, and decide for themselves.
        </p>
        <p>
          At work, the same habit looks like adaptability. I&apos;m a Principal PM at
          Grubhub, seven and a half years in, and I&apos;ve worked on four different teams. I
          started in analytics and marketing technology, SEO included. Then I moved to the
          new verticals team. Alcohol needed compliance tooling, and grocery needed support
          for much larger menus and items sold by weight. After that I joined the Care
          product team, which shapes the policies and support for orders that don&apos;t go
          to plan, so customers keep coming back. Now I&apos;m on the driver app. Each time,
          the job has been to walk into an unfamiliar system, learn how it works from the
          ground up, and figure out what deserves attention. Before Grubhub, I spent a
          decade building ecommerce for wine and spirits retailers, after growing up around
          my family&apos;s liquor store in New Jersey.
        </p>
        <p>
          Outside the job, there are small daily rituals like the NYT crossword and trading
          texts with friends over stubborn clues. I also try to make room for art, whether
          that means live music, museums, or anything that asks you to sit with it and
          quietly shifts how you see the world and the people around you. Digging into local
          government has pulled me further into my community too, and reminded me how much I
          value connecting with the people who live here. At home, two daughters who are
          sharper and funnier than I am keep my ego correctly sized.
        </p>
        <p>
          Always up for a conversation about local government, live music, or whatever
          rabbit hole you have been down lately.
        </p>
      </div>
    </div>
  );
}
