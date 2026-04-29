import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work — James Laurenti",
  description: "Things I've built.",
};

type Project = {
  name: string;
  description: string;
  href: string;
  note: string;
  disclaimer?: string;
};

const projects: Project[] = [
  {
    name: "Beverly Civic Assistant",
    description:
      "A civic assistant for Beverly, MA. Ask it about the budget, the planning board's latest decisions, what's on a future agenda. It pulls from the public record so you don't have to.",
    href: "https://beverly-civic.onrender.com",
    note: "Beverly's civic information is public but scattered: zoning records, budget documents, planning board minutes, meeting schedules. Getting informed means either attending in person or spending real time digging through city department pages. Most people don't, not from lack of interest but lack of time. A community that stays informed tends to advocate for better priorities. This is a small attempt at closing that gap.",
    disclaimer: "Heads up: hosted on Render's free tier, so the first load can take 30–60 seconds. It's not broken — just waking up.",
  },
];

export default function Work() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
        Work
      </h1>
      <p className="text-dim mb-14 leading-relaxed">
        Things I've built when a problem wouldn't leave me alone.
      </p>

      <div className="flex flex-col gap-14">
        {projects.map((project) => (
          <article key={project.name} className="border-t border-line pt-10">
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-block"
            >
              <h2 className="font-display text-2xl font-semibold tracking-tight group-hover:text-accent transition-colors">
                {project.name} ↗
              </h2>
            </a>
            <p className="mt-3 text-base leading-relaxed">{project.description}</p>
            <p className="mt-4 text-sm text-dim leading-relaxed">{project.note}</p>
            {project.disclaimer && (
              <p className="mt-4 text-xs text-dim italic">{project.disclaimer}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
