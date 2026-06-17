const THREAT_TYPES = [
  { name: "Lateral Movement", color: "#DC2626" },
  { name: "Privilege Esc.", color: "#F59E0B" },
  { name: "Reconnaissance", color: "#38BDF8" },
  { name: "Policy Evasion", color: "#64748B" },
];

export function computeEquilibrium({
  attackerReward,
  qTable,
  networkState,
  tick,
}) {
  const lastReward = attackerReward[attackerReward.length - 1]?.reward ?? 0;
  const qMean = qTable.reduce((a, b) => a + b, 0) / (qTable.length || 1);
  const safeBoost = (networkState.safe?.length ?? 0) * 4;
  const riskPenalty = (networkState.atRisk?.length ?? 0) * 6;
  const infiltratedPenalty = (networkState.infiltrated?.length ?? 0) * 18;

  const attackerScore = Math.min(100, lastReward * 2.8 + tick * 0.15);
  const defenderScore = Math.min(
    100,
    Math.max(0, qMean * 95 + safeBoost - riskPenalty - infiltratedPenalty)
  );

  const value = Math.max(0, Math.min(100, 50 + (attackerScore - defenderScore) / 2));
  const delta = value - 50;

  return { value, delta, attackerScore, defenderScore };
}

export function computeThreatVectors(qTable, networkState) {
  const buckets = [0, 0, 0, 0];
  qTable.forEach((q, i) => {
    buckets[i % 4] += q;
  });

  const riskWeight =
    (networkState.atRisk?.length ?? 0) * 3 + (networkState.infiltrated?.length ?? 0) * 8;

  return THREAT_TYPES.map((type, i) => ({
    name: type.name,
    color: type.color,
    value: Math.max(1, Math.round(buckets[i] * 12 + (i === 0 ? riskWeight : 0))),
  }));
}

export function parseLogSeverity(message) {
  const lower = message.toLowerCase();
  if (
    lower.includes("infiltrat") ||
    lower.includes("critical") ||
    lower.includes("breach") ||
    lower.includes("compromis")
  ) {
    return "critical";
  }
  if (
    lower.includes("threat") ||
    lower.includes("elevated") ||
    lower.includes("unusual") ||
    lower.includes("exploring")
  ) {
    return "warning";
  }
  return "stable";
}

export function buildSiemEvents(attackerLogs, defenderLogs, tick) {
  const stamp = () =>
    new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const mapLog = (message, source, index) => ({
    id: `${source}-${tick}-${index}-${message.slice(0, 12)}`,
    time: stamp(),
    severity: parseLogSeverity(message),
    source,
    message: message.replace(/^\[[^\]]+\]\s*/, ""),
  });

  const events = [
    ...attackerLogs.map((m, i) => mapLog(m, "RED_AGENT", i)),
    ...defenderLogs.map((m, i) => mapLog(m, "BLUE_AGENT", i)),
  ];

  return events.slice(0, 24);
}

export const ADMIN_KPI_DEFAULTS = [
  { key: "agents", label: "Active Agents", unit: "" },
  { key: "events", label: "Event Rate", unit: "/s" },
  { key: "nodes", label: "Monitored Nodes", unit: "" },
  { key: "qmean", label: "Q-Table Mean", unit: "" },
  { key: "infiltrated", label: "Compromised", unit: "" },
  { key: "mitigation", label: "Mitigation", unit: "%" },
];
