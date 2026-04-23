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
};

const projects: Project[] = [
  {
    name: "Beverly Civic Assistant",
    description:
      "An AI wrapper that aggregates fragmented civic data from Beverly, MA to answer questions about local government.",
    href: "https://beverly-civic.onrender.com",
    note: "Beverly's public information is scattered across dozens of PDFs and municipal sites. I built this to answer the kinds of questions neighbors actually ask — budget line items, meeting schedules, permit status — without having to hunt through a maze of city pages.",
  },
];

export default function Work() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
        Work
      </h1>
      <p className="text-dim mb-14 leading-relaxed">
        Things I've built. Real tools, not demos.
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
          </article>
        ))}
      </div>
    </div>
  );
}
