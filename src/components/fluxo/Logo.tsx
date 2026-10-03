import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center ${className}`} aria-label="Fluxo, inicio">
      <span className="font-display text-lg font-semibold tracking-[0.2em]">FLUXO</span>
    </Link>
  );
}
