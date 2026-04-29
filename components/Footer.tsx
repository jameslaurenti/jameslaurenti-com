export default function Footer() {
  return (
    <footer className="border-t border-rule mt-20">
      <div className="px-10 py-8 flex items-center justify-between">
        <span
          className="font-display font-bold text-ink-faint"
          style={{ letterSpacing: "-0.02em" }}
        >
          James Laurenti
        </span>
        <div className="flex items-center gap-5">
          <a
            href="https://linkedin.com/in/james-laurenti"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ink-faint hover:text-accent transition-colors"
          >
            LinkedIn ↗
          </a>
          <a
            href="https://github.com/jameslaurenti"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ink-faint hover:text-accent transition-colors"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
