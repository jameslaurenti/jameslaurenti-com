"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { trackOnce } from "@/lib/analytics";

/**
 * Shared selection for the zoning guide. The address lookup, the district explorer and the map
 * all read and write the same two things: which district is in focus, and which address (if
 * any) the reader looked up. Keeping them in one place is what lets "look up your street" in
 * the hero open the right district further down and drop a pin on the map.
 */

export type AddressHit = {
  address: string;
  zone: string;
  lat: number;
  lon: number;
  lotSqft: number;
  use: string;
};

type ZoningState = {
  selected: string | null;
  hit: AddressHit | null;
  select: (zone: string | null, control: string) => void;
  lookUp: (hit: AddressHit | null) => void;
};

const Ctx = createContext<ZoningState | null>(null);

export function ZoningProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hit, setHit] = useState<AddressHit | null>(null);

  // Analytics records which control was touched, never the address or the district.
  const select = useCallback((zone: string | null, control: string) => {
    setSelected(zone);
    trackOnce("tool_used", `beverly-zoning:${control}`, { surface: "beverly-zoning", control });
  }, []);

  const lookUp = useCallback((h: AddressHit | null) => {
    setHit(h);
    if (h) {
      setSelected(h.zone);
      trackOnce("tool_used", "beverly-zoning:address", { surface: "beverly-zoning", control: "address" });
    }
  }, []);

  const value = useMemo(() => ({ selected, hit, select, lookUp }), [selected, hit, select, lookUp]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useZoning(): ZoningState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useZoning must be used inside <ZoningProvider>");
  return v;
}
