import clearWater from "@/assets/clear-water.jpg";

/** Slowly rising, gently morphing water bubbles behind the interface. */
const BUBBLES = [
  { size: 68, left: 5, delay: -12, duration: 32, drift: 48, opacity: 0.65 },
  { size: 38, left: 14, delay: -26, duration: 40, drift: -30, opacity: 0.7 },
  { size: 88, left: 24, delay: -8, duration: 46, drift: 60, opacity: 0.5 },
  { size: 46, left: 33, delay: -32, duration: 38, drift: -42, opacity: 0.65 },
  { size: 28, left: 42, delay: -16, duration: 30, drift: 28, opacity: 0.75 },
  { size: 104, left: 51, delay: -28, duration: 52, drift: -55, opacity: 0.45 },
  { size: 36, left: 62, delay: -6, duration: 34, drift: 40, opacity: 0.7 },
  { size: 74, left: 72, delay: -36, duration: 48, drift: -48, opacity: 0.55 },
  { size: 48, left: 82, delay: -19, duration: 36, drift: 38, opacity: 0.7 },
  { size: 92, left: 91, delay: -9, duration: 44, drift: -60, opacity: 0.5 },
  { size: 22, left: 19, delay: -21, duration: 28, drift: 26, opacity: 0.8 },
  { size: 26, left: 88, delay: -25, duration: 32, drift: -28, opacity: 0.75 },
];

export function LiquidBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <img src={clearWater} alt="" width={1920} height={1088} className="water-texture absolute inset-0 h-full w-full object-cover" />
      <div className="water-veil absolute inset-0" />
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="lava-bubble-track absolute"
          style={{
            width: `clamp(${Math.round(b.size * 0.6)}px, ${b.size / 10}vw, ${b.size}px)`,
            aspectRatio: "1",
            left: `${b.left}%`,
            bottom: "-120px",
            ["--bubble-delay" as string]: `${b.delay}s`,
            ["--bubble-duration" as string]: `${b.duration}s`,
            ["--bubble-drift" as string]: `${b.drift}px`,
            ["--bubble-opacity" as string]: b.opacity,
          }}
        >
          <span className="lava-bubble block h-full w-full" />
        </span>
      ))}
    </div>
  );
}
