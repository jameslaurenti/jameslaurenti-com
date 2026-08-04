"use client";

import { useMemo, useState } from "react";
import { type TaxData, MAX_SELECTED, SELECT_COLORS, HOME_TOWN } from "@/lib/beverly/taxData";

type Props = {
  data: TaxData;
  selected: string[];
  onChange: (names: string[]) => void;
};

export default function TownSearch({ data, selected, onChange }: Props) {
  const [query, setQuery] = useState("");
  const atMax = selected.length >= MAX_SELECTED;

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return data.towns
      .filter((t) => t.name.toLowerCase().includes(q) && !selected.includes(t.name))
      .slice(0, 6);
  }, [query, data, selected]);

  const add = (name: string) => {
    if (atMax || selected.includes(name)) return;
    onChange([...selected, name]);
    setQuery("");
  };
  const remove = (name: string) => onChange(selected.filter((n) => n !== name));

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        {selected.map((name, i) => (
          <span
            key={name}
            className="inline-flex items-center gap-1.5 rounded-full py-0.5 pl-2 pr-1 text-xs font-medium text-white"
            style={{ backgroundColor: SELECT_COLORS[i % SELECT_COLORS.length] }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-white/90"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.5)" }}
            />
            {name}
            <button
              type="button"
              onClick={() => remove(name)}
              aria-label={`Remove ${name}`}
              className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/20 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
              // Keep the home town removable but re-addable via search like any other.
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={atMax ? `Max ${MAX_SELECTED} towns. Remove one to add another.` : "Add a town to compare…"}
          disabled={atMax}
          aria-label="Search for a town to highlight"
          className="w-full rounded-md border border-rule bg-bg-card px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent disabled:opacity-60"
        />
        {matches.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border border-rule bg-bg shadow-md">
            {matches.map((t) => (
              <li key={t.name}>
                <button
                  type="button"
                  onClick={() => add(t.name)}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-sm text-ink hover:bg-bg-card"
                >
                  <span>{t.name}</span>
                  <span className="text-xs text-ink-faint">{t.county}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {!selected.includes(HOME_TOWN) && (
        <button
          type="button"
          onClick={() => add(HOME_TOWN)}
          className="mt-2 text-xs text-accent underline underline-offset-2 hover:text-accent-lt"
        >
          + Add {HOME_TOWN} back
        </button>
      )}
    </div>
  );
}
