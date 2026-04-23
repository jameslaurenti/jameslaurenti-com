export default function Footer() {
  return (
    <footer className="border-t border-line mt-20">
      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-dim">
          © {new Date().getFullYear()} James Laurenti
        </p>
        <a
          href="https://linkedin.com/in/james-laurenti"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-dim hover:text-accent transition-colors"
        >
          LinkedIn ↗
        </a>
      </div>
    </footer>
  );
}
