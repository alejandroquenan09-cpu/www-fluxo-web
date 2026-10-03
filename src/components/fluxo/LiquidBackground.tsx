/** Slow-moving abstract liquid shapes behind everything. */
const BUBBLES = [
  { size: 10, left: 6, delay: 0, duration: 26, drift: 18, opacity: 0.55 },
  { size: 16, left: 14, delay: -6, duration: 34, drift: -22, opacity: 0.4 },
  { size: 7, left: 23, delay: -14, duration: 24, drift: 12, opacity: 0.6 },
  { size: 22, left: 31, delay: -20, duration: 40, drift: -16, opacity: 0.35 },
  { size: 12, left: 39, delay: -3, duration: 30, drift: 20, opacity: 0.5 },
  { size: 8, left: 47, delay: -11, duration: 22, drift: -14, opacity: 0.6 },
  { size: 26, left: 55, delay: -24, duration: 44, drift: 24, opacity: 0.3 },
  { size: 10, left: 63, delay: -8, duration: 27, drift: -18, opacity: 0.55 },
  { size: 15, left: 71, delay: -17, duration: 33, drift: 14, opacity: 0.4 },
  { size: 7, left: 79, delay: -2, duration: 21, drift: -12, opacity: 0.65 },
  { size: 18, left: 86, delay: -13, duration: 37, drift: 20, opacity: 0.35 },
  { size: 11, left: 93, delay: -9, duration: 29, drift: -20, opacity: 0.5 },
];

export function LiquidBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="animate-blob absolute -left-[15%] -top-[20%] h-[60vmax] w-[60vmax] rounded-full bg-primary/20 blur-[120px]" />
      <div
        className="animate-blob absolute -bottom-[25%] -right-[10%] h-[55vmax] w-[55vmax] rounded-full bg-primary-glow/15 blur-[130px]"
        style={{ animationDelay: "-9s" }}
      />
      <div
        className="animate-blob absolute left-[35%] top-[40%] h-[30vmax] w-[30vmax] rounded-full bg-chart-3/15 blur-[110px]"
        style={{ animationDelay: "-17s" }}
      />
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="bubble animate-bubble-rise absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            bottom: "-8%",
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
            ["--bubble-drift" as string]: `${b.drift}px`,
            ["--bubble-opacity" as string]: b.opacity,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,var(--background)_75%)] opacity-60" />
    </div>
  );
}
