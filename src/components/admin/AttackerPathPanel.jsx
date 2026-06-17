const NODE_LABELS = {
  n1: "GW-01",
  n2: "SRV-CORE",
  n3: "DB-REPLICA",
  n4: "EDGE-API",
};

const STATUS_STYLES = {
  safe: "siem-node--safe",
  atRisk: "siem-node--risk",
  infiltrated: "siem-node--crit",
};

export default function AttackerPathPanel({
  nodes = ["n1", "n2", "n3", "n4"],
  networkState,
  attackerFocus,
  defenderFocus,
  tick,
}) {
  const nodeStatus = (id) => {
    if (networkState?.infiltrated?.includes(id)) return "infiltrated";
    if (networkState?.atRisk?.includes(id)) return "atRisk";
    return "safe";
  };

  return (
    <div className="attacker-path">
      <div className="attacker-path__meta">
        <span className="font-mono text-[10px] text-slate-500 tracking-tight">
          TICK <span className="text-slate-300">{String(tick).padStart(4, "0")}</span>
        </span>
        <span className="font-mono text-[10px] text-slate-500">
          FOCUS <span className="text-rose-400">{NODE_LABELS[attackerFocus] || attackerFocus}</span>
          <span className="text-slate-600 mx-1">/</span>
          <span className="text-sky-400">{NODE_LABELS[defenderFocus] || defenderFocus}</span>
        </span>
      </div>

      <div className="attacker-path__track">
        {nodes.map((id, index) => {
          const status = nodeStatus(id);
          const isAttacker = id === attackerFocus;
          const isDefender = id === defenderFocus;

          return (
            <div key={id} className="attacker-path__segment">
              <div
                className={`siem-node ${STATUS_STYLES[status]} ${isAttacker ? "siem-node--atk-focus" : ""} ${isDefender ? "siem-node--def-focus" : ""}`}
              >
                <span className="siem-node__id">{NODE_LABELS[id] || id}</span>
                <span className="siem-node__state">{status === "safe" ? "STABLE" : status === "atRisk" ? "WARN" : "CRIT"}</span>
              </div>
              {index < nodes.length - 1 && <div className="attacker-path__edge" aria-hidden />}
            </div>
          );
        })}
      </div>

      <div className="attacker-path__legend">
        <span><i className="siem-legend-dot siem-legend-dot--crit" /> Infiltrated</span>
        <span><i className="siem-legend-dot siem-legend-dot--warn" /> At risk</span>
        <span><i className="siem-legend-dot siem-legend-dot--stable" /> Stable</span>
      </div>
    </div>
  );
}
