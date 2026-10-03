import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="Fluxo, inicio">
      <span className="relative grid h-8 w-8 place-items-center rounded-full glass sheen overflow-hidden">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary transition-transform duration-500 group-hover:rotate-180">
          <path
            d="M3 9c3-3 6 3 9 0s6 3 9 0M3 15c3-3 6 3 9 0s6 3 9 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-[0.2em]">FLUXO</span>
    </Link>
  );
}
