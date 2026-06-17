export default function ShieldWaveform() {
  const points = Array.from({ length: 40 }, (_, i) => {
    const x = (i / 39) * 100;
    const y = 50 + Math.sin(i * 0.45) * 28;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 100 100" className="w-full h-24" preserveAspectRatio="none">
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#4F46E5" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="url(#waveGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        points={points}
        style={{ filter: "drop-shadow(0 0 8px rgba(79,70,229,0.6))" }}
      />
    </svg>
  );
}
