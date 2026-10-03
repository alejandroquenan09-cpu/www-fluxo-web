/** Slow-moving abstract liquid shapes behind everything. */
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,var(--background)_75%)] opacity-60" />
    </div>
  );
}
