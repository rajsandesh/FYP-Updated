import { useSimulation } from "./src/SimulationContext";
import DashboardLayout from "./DashboardLayout";
import SilicaPanel from "./src/components/SilicaPanel";
import Terminal from "./src/components/Terminal";
import MetricCard from "./src/components/dashboard/MetricCard";
import ShieldWaveform from "./src/components/dashboard/ShieldWaveform";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Users, Shield } from "lucide-react";

const ATTACK_WAVE = [12, 28, 18, 42, 35, 48, 38, 42, 30, 45, 40, 42];

function AttackWaveform() {
  return (
    <div className="flex items-end justify-center gap-0.5 h-12">
      {ATTACK_WAVE.map((h, i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-gradient-to-t from-purple-600 to-violet-400"
          style={{ height: `${h}%`, opacity: 0.5 + (i % 3) * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function BlueTeam({ onNav }) {
  const { defenderLogs, attackerReward, setIsDefending, isDefending } = useSimulation();

  const healthData = [
    { name: "Stable", value: 88, color: "#10B981" },
    { name: "Gap", value: 12, color: "transparent" },
  ];

  const mitigationData = attackerReward.slice(-8).map((d, i) => ({
    t: i,
    v: 60 + Math.min(20, d.reward * 0.8),
  }));

  return (
    <DashboardLayout active="blueTeam" onNav={onNav} accent="#22D3EE">
      <div className="p-4 sm:p-5 lg:p-6 max-w-[1600px] mx-auto space-y-4">

        {/* Top Header Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0A0F1A] border border-[#1E293B] p-5 rounded-xl shadow-lg">
          <div>
            <h2 className="text-[#22D3EE] font-bold text-lg tracking-wide flex items-center gap-2">
              <Shield size={20} className={isDefending ? "animate-pulse" : ""} />
              Blue Team Operations Center
            </h2>
            <p className="text-slate-400 text-sm mt-1">Manage active defensive measures and monitor system health.</p>
          </div>
          <button 
            onClick={() => setIsDefending(!isDefending)}
            className={`font-semibold text-sm px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
              isDefending 
              ? "bg-[#111827] border border-[#22D3EE] text-[#22D3EE] hover:bg-[#22D3EE]/10" 
              : "bg-[#22D3EE] border border-[#22D3EE] text-[#0A0F1A] hover:bg-[#22D3EE]/90"
            }`}
          >
             {isDefending ? "Stop Defense Simulation" : "Start Defense Simulation"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard title="System health">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={healthData}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={38}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      stroke="none"
                    >
                      {healthData.map((e, i) => (
                        <Cell key={i} fill={e.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-[#10B981]">
                  88%
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                Healthy
              </span>
            </div>
          </MetricCard>

          <MetricCard title="Active attacks">
            <div className="flex items-center justify-between gap-2">
              <span className="text-4xl font-black text-violet-400">42</span>
              <AttackWaveform />
            </div>
          </MetricCard>

          <MetricCard title="Mitigation rate">
            <div className="flex items-end justify-between gap-2">
              <span className="text-3xl font-black text-[#22D3EE]">75%</span>
              <div className="h-14 w-28">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mitigationData}>
                    <Area type="monotone" dataKey="v" stroke="#22D3EE" fill="#22D3EE33" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </MetricCard>

          <MetricCard title="Active agents">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/20">
                <Users size={28} className="text-[#22D3EE]" />
              </div>
              <span className="text-4xl font-black">2</span>
            </div>
          </MetricCard>
        </div>

        <SilicaPanel className={`flex flex-col gap-4 shadow-lg rounded-xl transition-all duration-500 ${isDefending ? "border-[#22D3EE]/50 shadow-[0_0_20px_rgba(34,211,238,0.1)]" : ""}`}>
          <div>
            <h3 className="text-lg font-semibold text-slate-200 mb-1 flex items-center gap-2">
              Defender <span className={`w-2 h-2 rounded-full ${isDefending ? "bg-[#22D3EE] animate-pulse" : "bg-slate-600"}`}></span>
            </h3>
            <p className="text-sm font-medium text-slate-500">
              Defense status
            </p>
          </div>
          <ShieldWaveform isDefending={isDefending} />
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">
              Recent events
            </p>
            <ul className="space-y-2 text-sm font-medium text-slate-400">
              {defenderLogs.slice(0, 3).map((log, i) => (
                <li key={i} className="border-l-2 border-[#6366F1]/40 pl-3 py-1">
                  {log}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-h-[120px]">
            <p className="text-sm font-medium text-slate-500 mb-2">Live logs</p>
            <Terminal logs={defenderLogs} className="h-28" />
          </div>
        </SilicaPanel>
      </div>
    </DashboardLayout>
  );
}
