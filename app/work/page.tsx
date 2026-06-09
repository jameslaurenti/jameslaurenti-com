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

// Civic Assistant retired; full tagged index lands in the content pass.
const projects: Project[] = [];

export default function Work() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
        Work
      </h1>
      <p className="text-ink-mid mb-14 leading-relaxed">
        Things I've built when a problem wouldn't leave me alone.
      </p>

      <div className="flex flex-col gap-14">
        {projects.length === 0 && (
          <p className="text-dim border-t border-line pt-10">
            New work, reorganized — back shortly.
          </p>
        )}
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
            <p className="mt-4 text-sm text-ink-mid leading-relaxed">{project.note}</p>
            {project.disclaimer && (
              <p className="mt-4 text-xs text-dim italic">{project.disclaimer}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
