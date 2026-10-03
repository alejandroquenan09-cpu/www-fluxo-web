/** Hero visual: digital water/energy streams flowing through a glass orb. */
export function FlowVisual() {
  const paths = [
    "M-50 200 C 150 80, 300 320, 500 180 S 800 60, 950 200",
    "M-50 240 C 180 140, 320 360, 520 220 S 820 120, 950 250",
    "M-50 280 C 120 220, 340 380, 540 260 S 780 180, 950 300",
    "M-50 160 C 200 40, 280 260, 480 140 S 760 20, 950 150",
  ];
  return (
    <div aria-hidden className="pointer-events-none relative mx-auto aspect-[9/4] w-full max-w-5xl">
      <svg viewBox="0 0 900 400" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="flowGrad" x1="0" x2="1">
            <stop offset="0" stopColor="var(--primary)" stopOpacity="0" />
            <stop offset="0.4" stopColor="var(--primary)" stopOpacity="0.9" />
            <stop offset="0.7" stopColor="var(--primary-glow)" stopOpacity="0.8" />
            <stop offset="1" stopColor="var(--primary-glow)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {paths.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke="url(#flowGrad)" strokeOpacity={0.18} strokeWidth={1} />
            <path
              d={d}
              fill="none"
              stroke="url(#flowGrad)"
              strokeWidth={i === 1 ? 2 : 1.2}
              strokeLinecap="round"
              strokeDasharray="60 340"
              className="animate-stream"
              style={{ animationDuration: `${5 + i * 1.3}s`, animationDelay: `${-i * 1.7}s` }}
            />
          </g>
        ))}
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-28 w-28 sm:h-40 sm:w-40">
          <span className="animate-ripple absolute inset-0 rounded-full border border-primary/40" />
          <span className="animate-ripple absolute inset-0 rounded-full border border-primary/30" style={{ animationDelay: "-1.75s" }} />
          <div className="animate-float glass-strong sheen absolute inset-0 overflow-hidden rounded-full">
            <div className="absolute inset-3 rounded-full bg-flow opacity-30 blur-xl" />
            <div className="absolute left-4 top-3 h-6 w-10 rotate-[-25deg] rounded-full bg-foreground/25 blur-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
