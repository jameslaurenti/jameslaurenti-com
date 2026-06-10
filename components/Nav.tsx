"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  // { href: "/making-things", label: "Making Things" }, // hidden until content exists
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-rule bg-bg">
      <div className="h-full px-6 flex items-center justify-between gap-4">

        {/* Left: logo mark + name */}
        <Link href="/" className="flex items-center gap-2.5 group w-fit">
          <span
            className="w-[26px] h-[26px] rounded-[6px] bg-accent flex items-center justify-center text-white font-bold transition-all group-hover:rotate-[-8deg] group-hover:bg-accent-lt"
            style={{ fontSize: "0.72rem" }}
          >
            JL
          </span>
          <span className="font-display text-base font-bold tracking-tight text-ink">
            James Laurenti
          </span>
        </Link>

        {/* Center: nav links */}
        <nav className="hidden sm:flex items-center justify-center h-full gap-1 flex-1">
          {links.map(({ href, label }) => (
            <div key={href} className="relative h-full flex items-center">
              <Link
                href={href}
                className={`px-3 py-1.5 rounded-[6px] text-sm transition-colors ${
                  isActive(href)
                    ? "bg-accent-glow text-accent"
                    : "text-ink-mid hover:bg-bg-card hover:text-ink"
                }`}
              >
                {label}
              </Link>
              {isActive(href) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-accent" />
              )}
            </div>
          ))}
        </nav>

        {/* Right: location indicator (desktop) / hamburger (mobile) */}
        <div className="flex items-center justify-end gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-ink-faint" style={{ fontSize: "0.74rem" }}>
              Beverly, MA
            </span>
          </div>

          <button
            className="sm:hidden text-ink-mid hover:text-ink transition-colors p-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-rule bg-bg">
          <div className="px-6 py-4 flex flex-col gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2 rounded-[6px] text-sm transition-colors ${
                  isActive(href)
                    ? "bg-accent-glow text-accent font-medium"
                    : "text-ink-mid hover:bg-bg-card hover:text-ink"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
