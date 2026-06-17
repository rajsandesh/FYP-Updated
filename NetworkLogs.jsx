import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useSimulation } from "./src/SimulationContext";
import { Terminal, Activity, Wifi, ShieldAlert, Database, Server } from "lucide-react";

import DashboardLayout from './DashboardLayout';

export default function NetworkLogs({ onNav }) {
  const { tick, isSimulating, attackerLogs, defenderLogs } = useSimulation();
  const [systemLogs, setSystemLogs] = useState([]);
  const bottomRef = useRef(null);

  // Generate continuous system logs when simulating
  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        const types = ['INFO', 'WARN', 'ERROR', 'SYSTEM'];
        const actions = ['Packet dropped', 'Connection established', 'Port scan detected', 'Firewall rule updated', 'Latency spike detected', 'Handshake failed', 'SSL decryption attempted'];
        const ips = ['192.168.1.105', '10.0.0.42', '172.16.0.4', '198.51.100.14', '203.0.113.89', '192.168.1.200'];
        
        const type = types[Math.floor(Math.random() * types.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const ip = ips[Math.floor(Math.random() * ips.length)];
        const time = new Date().toISOString().split('T')[1].slice(0, 12);
        
        let colorClass = "text-slate-400";
        if (type === 'WARN') colorClass = "text-yellow-400";
        if (type === 'ERROR') colorClass = "text-rose-400";
        if (type === 'SYSTEM') colorClass = "text-cyan-400";

        const newLog = {
          id: Date.now() + Math.random(),
          time,
          type,
          message: `${action} - SRC: ${ip}`,
          colorClass
        };

        setSystemLogs(prev => [...prev.slice(-99), newLog]);
      }, 600);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Auto-scroll terminal
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [systemLogs]);

  return (
    <DashboardLayout active="network-logs" onNav={onNav}>
      <div className="flex flex-col h-full gap-6">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Activity className="text-cyan-400" /> Global Network Logs
            </h2>
            <p className="text-slate-400 mt-1 text-sm">Real-time telemetry and system audit trail.</p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-[#0B0F19] border border-[#1E293B] rounded-xl flex items-center gap-3">
               <div className="relative flex h-3 w-3">
                 <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSimulating ? 'bg-green-400' : 'bg-slate-500'}`}></span>
                 <span className={`relative inline-flex rounded-full h-3 w-3 ${isSimulating ? 'bg-green-500' : 'bg-slate-500'}`}></span>
               </div>
               <span className="text-sm font-medium text-slate-300">Live Traffic Monitor</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
          
          {/* Main Terminal View */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-2 flex flex-col bg-[#0B0F19] border border-[#1E293B] rounded-2xl overflow-hidden relative"
          >
            <div className="px-4 py-3 border-b border-[#1E293B] flex items-center justify-between bg-black/20">
               <div className="flex items-center gap-2 text-slate-400">
                 <Terminal size={16} />
                 <span className="text-sm font-medium tracking-wide">/var/log/syslog</span>
               </div>
               <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-700"></span>
                  <span className="w-3 h-3 rounded-full bg-slate-700"></span>
                  <span className="w-3 h-3 rounded-full bg-slate-700"></span>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed space-y-1 bg-[#05070A]/50">
               {systemLogs.length === 0 && !isSimulating && (
                 <div className="text-slate-500 italic mt-2">Waiting for simulation to start...</div>
               )}
               {systemLogs.map(log => (
                 <div key={log.id} className="flex gap-4 hover:bg-white/5 px-2 py-0.5 rounded transition-colors">
                   <span className="text-slate-500 shrink-0">[{log.time}]</span>
                   <span className={`${log.colorClass} w-16 shrink-0 font-semibold`}>[{log.type}]</span>
                   <span className="text-slate-300">{log.message}</span>
                 </div>
               ))}
               <div ref={bottomRef} className="h-2" />
            </div>
          </motion.div>

          {/* Side Panels */}
          <div className="flex flex-col gap-6 overflow-y-auto pb-4 pr-2 xl:pr-0">
            
            {/* Agent Activity */}
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-5 flex flex-col flex-1"
            >
              <h3 className="text-white font-semibold flex items-center gap-2 mb-4 shrink-0">
                 <ShieldAlert size={18} className="text-indigo-400" /> Agent Intel Feeds
              </h3>
              <div className="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
                 <div>
                   <div className="text-xs font-bold tracking-widest text-rose-500 mb-2 border-b border-rose-500/20 pb-1 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> RED TEAM
                   </div>
                   <div className="space-y-2">
                     {attackerLogs.slice(0, 4).map((log, i) => (
                       <div key={i} className="text-xs font-mono text-slate-300 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 leading-relaxed shadow-sm">
                         {log}
                       </div>
                     ))}
                     {attackerLogs.length === 0 && <div className="text-xs text-slate-500 italic">No red team activity recorded.</div>}
                   </div>
                 </div>
                 <div>
                   <div className="text-xs font-bold tracking-widest text-indigo-400 mb-2 border-b border-indigo-500/20 pb-1 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div> BLUE TEAM
                   </div>
                   <div className="space-y-2">
                     {defenderLogs.slice(0, 4).map((log, i) => (
                       <div key={i} className="text-xs font-mono text-slate-300 bg-indigo-500/10 p-2.5 rounded-lg border border-indigo-500/20 leading-relaxed shadow-sm">
                         {log}
                       </div>
                     ))}
                     {defenderLogs.length === 0 && <div className="text-xs text-slate-500 italic">No blue team activity recorded.</div>}
                   </div>
                 </div>
              </div>
            </motion.div>

            {/* Active Nodes */}
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-5 shrink-0"
            >
              <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                 <Server size={18} className="text-emerald-400" /> Active Edge Nodes
              </h3>
              <div className="space-y-3">
                 {[
                   { ip: "192.168.1.100", status: "Secure", ping: "12ms" },
                   { ip: "10.0.0.5", status: "Monitoring", ping: "45ms" },
                   { ip: "172.16.0.1", status: "Warning", ping: "120ms" }
                 ].map((node, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-[#05070A] rounded-xl border border-[#1E293B]">
                     <div className="flex items-center gap-3">
                       <Database size={16} className={node.status === 'Warning' ? 'text-yellow-400' : 'text-slate-400'} />
                       <div>
                         <div className="text-sm text-slate-200 font-mono">{node.ip}</div>
                         <div className="text-xs text-slate-500 mt-0.5">{node.status}</div>
                       </div>
                     </div>
                     <div className="text-xs text-slate-400 font-mono bg-slate-800/50 px-2 py-1 rounded">{node.ping}</div>
                   </div>
                 ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
