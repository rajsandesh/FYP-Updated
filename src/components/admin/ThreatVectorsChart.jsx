import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const SLICE_COLORS = ["#DC2626", "#F59E0B", "#38BDF8", "#64748B", "#94A3B8"];

export default function ThreatVectorsChart({ data = [] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  return (
    <div className="threat-vectors">
      <div className="threat-vectors__chart">
        <ResponsiveContainer width="100%" height={168}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={46}
              outerRadius={72}
              paddingAngle={1}
              dataKey="value"
              stroke="#0F172A"
              strokeWidth={1}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={entry.color || SLICE_COLORS[index % SLICE_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="threat-vectors__center">
          <span className="threat-vectors__center-value">{total}</span>
          <span className="threat-vectors__center-label">EVENTS</span>
        </div>
      </div>
      <ul className="threat-vectors__legend">
        {data.map((item, i) => (
          <li key={item.name} className="threat-vectors__legend-row">
            <span
              className="threat-vectors__swatch"
              style={{ background: item.color || SLICE_COLORS[i % SLICE_COLORS.length] }}
            />
            <span className="threat-vectors__legend-name">{item.name}</span>
            <span className="threat-vectors__legend-pct">
              {((item.value / total) * 100).toFixed(0)}%
            </span>
            <span className="threat-vectors__legend-val">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
