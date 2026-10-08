import Link from "next/link";
import { headers } from "next/headers";
import DigestSignup from "@/components/beverly/DigestSignup";
import { latestStories } from "@/lib/beverly/digestFeed";
import { latestIssue } from "@/data/beverly/digestIssues";

/**
 * The two pages every off-site link leads to. jameslaurenti.com/digest (social bios,
 * texts, QR codes on flyers) lands on the signup page; Kit sends people to the welcome
 * page after they click the confirmation link, instead of its own branded page.
 *
 * Both are built for a phone first, since that is where a QR scan or a texted link opens.
 * The signup page shows the newest issue's headlines and one-sentence summaries, read from
 * the published issue the same way the feeds are, so it is always a real sample of what
 * the email carries.
 */

const EYEBROW = "text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt";

async function origin() {
  const h = await headers();
  const host = h.get("host") ?? "www.jameslaurenti.com";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function SubscribeBody({ placement }: { placement: string }) {
  const latest = await latestStories(await origin());
  const issue = latest?.issue ?? latestIssue();

  return (
    <div className="bg-bg text-ink">
      <div className="mx-auto max-w-3xl px-6 pb-20">
        <header className="pt-12 sm:pt-16">
          <p className={EYEBROW}>Beverly Meeting Digest</p>
          <h1 className="mt-2 font-display text-[2.1rem] font-extrabold leading-[1.06] tracking-tight sm:text-5xl">
            Beverly&apos;s city meetings, once a week, by email
          </h1>
          <p className="mt-4 max-w-[60ch] text-lg leading-snug text-ink-mid">
            What the City Council, School Committee and city boards did, and what is coming up.
            Built from the meeting recordings and the city&apos;s posted documents, with links so
            you can check any of it. Independent, not a City of Beverly publication.
          </p>
        </header>

        <div className="mt-7">
          <DigestSignup placement={placement} title={null} />
        </div>

        <section className="mt-14" aria-labelledby="sample-title">
          <h2
            id="sample-title"
            className="border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight"
          >
            The latest issue
            <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
              No. {issue.number} &middot; {issue.published.replace(/, \d{4}$/, "")}
            </span>
          </h2>
          {latest && latest.stories.length > 0 ? (
            <ul className="mt-2 max-w-[63ch]">
              {latest.stories.map((s) => (
                <li key={s.link} className="border-b border-rule py-4">
                  <a href={s.link} className="font-display text-[1.1rem] font-bold leading-snug hover:text-accent">
                    {s.title}
                  </a>
                  <p className="mt-1 text-[0.97rem] leading-relaxed text-ink-mid">{s.summary}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 max-w-[63ch] leading-relaxed text-ink-mid">{issue.teaser}</p>
          )}
          <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[0.95rem]">
            <Link href={`/beverly/digest/${issue.slug}`} className="rlink">
              Read this issue in full
            </Link>
            <Link href="/beverly/digest" className="rlink">
              All issues
            </Link>
          </p>
        </section>

        <p className="mt-12 max-w-[63ch] text-[0.88rem] leading-relaxed text-ink-faint">
          By James Laurenti.{" "}
          <Link href="/privacy" className="rlink">
            Privacy
          </Link>{" "}
          &middot;{" "}
          <Link href="/contact" className="rlink">
            Questions or corrections
          </Link>
        </p>
      </div>
    </div>
  );
}

export function WelcomeBody() {
  const issue = latestIssue();
  return (
    <div className="bg-bg text-ink">
      <div className="mx-auto max-w-3xl px-6 pb-20">
        <header className="pt-12 sm:pt-16">
          <p className={EYEBROW}>Beverly Meeting Digest</p>
          <h1 className="mt-2 font-display text-[2.1rem] font-extrabold leading-[1.06] tracking-tight sm:text-5xl">
            You are subscribed
          </h1>
          <p className="mt-4 max-w-[60ch] text-lg leading-snug text-ink-mid">
            The digest arrives on Mondays from Beverly Meeting Digest. If the first one
            lands in spam or a Promotions tab, moving it to your inbox keeps the next ones there.
          </p>
        </header>

        <Link
          href={`/beverly/digest/${issue.slug}`}
          className="group mt-9 block max-w-[63ch] rounded-lg border border-accent/35 bg-accent-glow px-6 py-6 transition-colors hover:bg-bg-card"
        >
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent">
            The latest issue
          </span>
          <span className="mt-2 block font-display text-2xl font-semibold tracking-tight group-hover:text-accent">
            No. {issue.number} &middot; Covering {issue.covering}
          </span>
          <span className="mt-2 block leading-relaxed text-ink-mid">{issue.teaser}</span>
          <span className="mt-4 inline-block text-[0.85rem] text-accent">Read it now &rarr;</span>
        </Link>

        <p className="mt-10 max-w-[63ch] text-[0.97rem] leading-relaxed">
          Know someone who would want it? Send them to{" "}
          <Link href="/digest" className="rlink font-semibold">
            jameslaurenti.com/digest
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
