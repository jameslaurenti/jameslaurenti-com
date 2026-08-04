import Breadcrumb from "./Breadcrumb";

/**
 * Wraps the Beverly collection so every piece gets a trail back to the hub. The Breadcrumb
 * hides itself on the hub and on the development map, so this can stay a plain wrapper and
 * any new piece added under /work/beverly picks it up for free.
 */
export default function BeverlyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumb />
      {children}
    </>
  );
}
