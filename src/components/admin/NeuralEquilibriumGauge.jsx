const CX = 120;
const CY = 108;
const R = 88;
const START = Math.PI;
const END = 0;

function polar(angle, radius = R) {
  return {
    x: CX + radius * Math.cos(angle),
    y: CY - radius * Math.sin(angle),
  };
}

function valueToAngle(value) {
  return START + (END - START) * (value / 100);
}

export default function NeuralEquilibriumGauge({
  value = 50,
  attackerScore = 0,
  defenderScore = 0,
  delta = 0,
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const needleAngle = valueToAngle(clamped);
  const needleTip = polar(needleAngle, R - 14);
  const needleBaseL = polar(needleAngle, 18);
  const needleBaseR = polar(needleAngle + 0.04, 18);

  const ticks = Array.from({ length: 11 }, (_, i) => {
    const v = i * 10;
    const angle = valueToAngle(v);
    const outer = polar(angle, R + 2);
    const inner = polar(angle, R - (i % 5 === 0 ? 14 : 8));
    const labelPos = polar(angle, R + 16);
    return { v, outer, inner, labelPos, major: i % 5 === 0 };
  });

  const arcPath = () => {
    const start = polar(START, R);
    const end = polar(END, R);
    return `M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${end.x} ${end.y}`;
  };

  const fillEnd = polar(needleAngle, R);
  const fillStart = polar(START, R);
  const fillLarge = clamped > 50 ? 1 : 0;

  const leanAttacker = delta > 0;
  const leanLabel = delta === 0 ? "BALANCED" : leanAttacker ? "ATTACKER LEAN" : "DEFENDER LEAN";

  return (
    <div className="neural-gauge">
      <svg viewBox="0 0 240 130" className="w-full max-w-[280px] mx-auto" aria-hidden>
        <path d={arcPath()} fill="none" stroke="#1E293B" strokeWidth="3" />
        <path
          d={`M ${fillStart.x} ${fillStart.y} A ${R} ${R} 0 ${fillLarge} 1 ${fillEnd.x} ${fillEnd.y}`}
          fill="none"
          stroke={leanAttacker ? "#DC2626" : "#38BDF8"}
          strokeWidth="3"
          strokeLinecap="butt"
          opacity="0.85"
        />
        {ticks.map(({ v, outer, inner, labelPos, major }) => (
          <g key={v}>
            <line
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke={major ? "#64748B" : "#334155"}
              strokeWidth={major ? 1.5 : 1}
            />
            {major && (
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-500 text-[8px] font-mono"
                style={{ letterSpacing: "-0.02em" }}
              >
                {v}
              </text>
            )}
          </g>
        ))}
        <polygon
          points={`${needleTip.x},${needleTip.y} ${needleBaseL.x},${needleBaseL.y} ${needleBaseR.x},${needleBaseR.y}`}
          fill="#E2E8F0"
        />
        <circle cx={CX} cy={CY} r="4" fill="#0F172A" stroke="#475569" strokeWidth="1" />
      </svg>

      <div className="neural-gauge__readout">
        <div className="neural-gauge__metric">
          <span className="neural-gauge__metric-label neural-gauge__metric-label--atk">ATK</span>
          <span className="neural-gauge__metric-value">{attackerScore.toFixed(1)}</span>
        </div>
        <div className="neural-gauge__center">
          <span className="neural-gauge__delta">{delta >= 0 ? "+" : ""}{delta.toFixed(1)}</span>
          <span className="neural-gauge__lean">{leanLabel}</span>
        </div>
        <div className="neural-gauge__metric">
          <span className="neural-gauge__metric-label neural-gauge__metric-label--def">DEF</span>
          <span className="neural-gauge__metric-value">{defenderScore.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
