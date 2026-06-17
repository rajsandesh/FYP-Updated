import { useMemo } from "react";

const palette = ["#1e1b4b", "#4c1d95", "#7c3aed", "#c026d3", "#f97316", "#fbbf24"];

export default function QValueHeatmap({ values = [] }) {
  const grid = useMemo(() => {
    const src = values.length >= 16 ? values : Array.from({ length: 16 }, (_, i) => values[i] ?? Math.random());
    return src.map((v) => palette[Math.min(palette.length - 1, Math.floor(v * palette.length))]);
  }, [values]);

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {grid.map((color, i) => (
        <div
          key={i}
          className="aspect-square rounded-md border border-white/5"
          style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}55` }}
        />
      ))}
    </div>
  );
}
