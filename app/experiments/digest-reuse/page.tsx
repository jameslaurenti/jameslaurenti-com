import type { Metadata } from "next";
import Link from "next/link";

/**
 * How to reuse the Beverly Meeting Digest: the feeds, the terms, and practical starting
 * points for people adapting stories into their own formats. Unlisted under /experiments
 * (noindex via next.config.ts) until it has been tried by someone who actually adapts the
 * content; then it moves to a real route with an entry point in the digest footer.
 */
export const metadata: Metadata = {
  title: "Reuse the Beverly Meeting Digest — James Laurenti",
  description:
    "The Beverly Meeting Digest is free to reuse. Two feeds, what is in them, and how to adapt a story into your own format.",
  robots: { index: false, follow: false },
};

const SITE = "https://www.jameslaurenti.com";
const ISSUES = `${SITE}/beverly/digest/feed.xml`;
const STORIES = `${SITE}/beverly/digest/stories.xml`;

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="mt-14 scroll-mt-24 font-display text-2xl font-bold tracking-tight">
    {children}
  </h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-4 max-w-[63ch] text-[1.0625rem] leading-[1.75]">{children}</p>
);
/** `wrap` is for prose meant to be copied, like the prompt; code keeps its line breaks. */
const Code = ({ children, wrap = false }: { children: string; wrap?: boolean }) => (
  <pre
    className={`mt-4 max-w-[63ch] rounded-md border border-rule bg-bg-card px-4 py-3 text-[0.85rem] leading-relaxed ${
      wrap ? "whitespace-pre-wrap break-words" : "overflow-x-auto"
    }`}
  >
    <code>{children}</code>
  </pre>
);
const Url = ({ href }: { href: string }) => (
  <a href={href} className="rlink break-all font-mono text-[0.9rem]">
    {href}
  </a>
);

const prompt = `You are adapting a story from the Beverly Meeting Digest, a neutral, sourced summary of city meetings in Beverly, Massachusetts. Turn it into [a 60-second video script / a short newsletter item / a social post].

Rules:
- Use only facts in the story. Do not add names, numbers, dates or claims.
- Keep every number and vote count exactly as written. If a vote count is not given, do not guess one.
- Stay neutral. Say what was proposed, said and decided, not whether it is good or bad.
- When the story credits a view to someone, keep it credited to them.
- Do not name residents who spoke during public comment.
- Keep the link to the original story, and the recording link for any moment you use.

Story:
[paste the story here]`;

const python = `import feedparser  # pip install feedparser

feed = feedparser.parse("${STORIES}")
for story in feed.entries[:5]:
    print(story.title)
    print(story.link)                       # the original, where corrections go
    print([t.term for t in story.tags])     # e.g. ["Issue 4", "Environment"]
    html = story.content[0].value           # the full story, sources included`;

export default function DigestReuseGuide() {
  return (
    <div className="bg-bg text-ink">
      <div className="bg-gold-strong/20 px-6 py-2 text-center text-[0.8rem] font-bold uppercase tracking-[0.14em] text-ink">
        Draft guide &middot; feedback welcome
      </div>
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <header className="border-b border-rule pb-7 pt-14">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt">
            Beverly Meeting Digest
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">
            Reuse the digest
          </h1>
          <p className="mt-5 max-w-[63ch] text-xl leading-snug text-ink-mid">
            Everything in the{" "}
            <Link href="/beverly/digest" className="rlink">
              Beverly Meeting Digest
            </Link>{" "}
            is free to reuse. Turn a story into a video, run it in your newsletter, translate
            it, build something new on top of it. You do not need to ask. Here is what is
            available and how to get started.
          </p>
        </header>

        <H2 id="feeds">Two feeds</H2>
        <P>
          The digest comes out on Mondays. Two RSS feeds carry everything it publishes, and both
          update within an hour of a new issue.
        </P>
        <div className="mt-5 grid max-w-[63ch] gap-4">
          <div className="rounded-lg border border-rule bg-white/70 px-5 py-4">
            <p className="font-display text-lg font-bold">Every story, one at a time</p>
            <p className="mt-1">
              <Url href={STORIES} />
            </p>
            <p className="mt-2 text-[0.97rem] leading-relaxed text-ink-mid">
              One entry per story. Start here if you want to carry or adapt single items: a
              video, a post, a paragraph in your newsletter.
            </p>
          </div>
          <div className="rounded-lg border border-rule bg-white/70 px-5 py-4">
            <p className="font-display text-lg font-bold">Every issue, whole</p>
            <p className="mt-1">
              <Url href={ISSUES} />
            </p>
            <p className="mt-2 text-[0.97rem] leading-relaxed text-ink-mid">
              One entry per issue, with everything in it: the summary, corrections, each story
              and the calendar of what is coming up.
            </p>
          </div>
        </div>

        <H2 id="terms">The terms</H2>
        <P>
          There are none you have to follow. The digest is dedicated to the public domain under{" "}
          <a href="https://creativecommons.org/publicdomain/zero/1.0/" className="rlink">
            CC0
          </a>
          , so you can copy, change and republish it, including commercially, without asking
          and without credit.
        </P>
        <P>A few requests, which good-faith reuse will usually follow anyway:</P>
        <ul className="mt-3 max-w-[63ch] list-disc space-y-2 pl-5 text-[1.0625rem] leading-[1.7]">
          <li>A link back to the original story is appreciated.</li>
          <li>
            Keep the links to recordings and documents. They are what let your audience check the
            work, and they are the most useful thing the digest adds.
          </li>
          <li>
            Corrections are made on the original page and in the feeds. Copies do not update on
            their own, so linking the original is the easiest way to stay current.
          </li>
          <li>
            Do not present it as coming from the City of Beverly. The digest is independent, and
            your version will be too.
          </li>
        </ul>

        <H2 id="entries">What is in each entry</H2>
        <div className="mt-4 max-w-[63ch] overflow-x-auto">
          <table className="w-full border-collapse text-left text-[0.93rem]">
            <thead>
              <tr className="border-b-2 border-ink text-[0.72rem] uppercase tracking-wide text-ink-faint">
                <th className="py-1.5 pr-3 font-bold">Field</th>
                <th className="py-1.5 font-bold">What it holds</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["title", "The story's headline, or the issue's name and dates."],
                ["link", "The original on jameslaurenti.com. For a story, it jumps to that story in its issue."],
                ["pubDate", "The issue's date."],
                ["category", "For stories: the issue number, and a label such as Environment or Tonight."],
                ["description", "A short plain-text summary."],
                [
                  "content:encoded",
                  "The full text as simple HTML. Recording moments are links to the exact second, written like (1:02:31). Sources are listed at the end, followed by the reuse note.",
                ],
              ].map(([field, what]) => (
                <tr key={field} className="border-b border-rule align-top">
                  <td className="py-2 pr-3 font-mono text-[0.85rem]">{field}</td>
                  <td className="py-2 leading-relaxed">{what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>
          Recording links go to BevCam&apos;s videos on YouTube, at the second the moment
          starts. If you are making video, that is where to find the clip.
        </P>

        <H2 id="start">Ways to start</H2>
        <h3 className="mt-6 font-display text-lg font-bold">Read it in a feed reader</h3>
        <P>
          Paste either feed address into a reader such as Feedly, Inoreader or NetNewsWire. New
          stories show up on their own each week.
        </P>
        <h3 className="mt-6 font-display text-lg font-bold">Pull it with code</h3>
        <P>Any RSS library works. In Python, with feedparser:</P>
        <Code>{python}</Code>
        <P>Or just look at the raw feed:</P>
        <Code>{`curl ${STORIES}`}</Code>
        <h3 className="mt-6 font-display text-lg font-bold">Adapt a story with an AI tool</h3>
        <P>
          If you use Claude, ChatGPT or similar to reshape stories, this starting prompt carries
          the rules the digest itself follows. Paste a story from the feed where it says to.
        </P>
        <Code wrap>{prompt}</Code>
        <P>
          Whatever you make, read it against the original before you publish. The rules above
          are where adapted versions most often go wrong: a rounded number, a guessed vote, a
          view quietly turned into a fact.
        </P>

        <H2 id="know">Good to know</H2>
        <ul className="mt-4 max-w-[63ch] list-disc space-y-2 pl-5 text-[1.0625rem] leading-[1.7]">
          <li>
            The digest starts from BevCam&apos;s automatic transcripts and checks what it can
            against the city&apos;s posted agendas and documents. Every claim links to its source
            so you can check it too.
          </li>
          <li>
            It covers the meetings BevCam records and posts. Boards that meet without video are
            listed, but there is less to say about them until their minutes are posted.
          </li>
          <li>
            The site&apos;s code is on{" "}
            <a href="https://github.com/jameslaurenti/jameslaurenti-com" className="rlink">
              GitHub
            </a>{" "}
            under the MIT license, if you want to build something similar for another town.
          </li>
        </ul>

        <H2 id="contact">Tell me what you make</H2>
        <P>
          Not required, but I would like to see it, and it helps to know what is useful. If
          something in the feeds is getting in your way, or this guide is unclear,{" "}
          <Link href="/contact" className="rlink">
            let me know
          </Link>
          .
        </P>
      </div>
    </div>
  );
}
