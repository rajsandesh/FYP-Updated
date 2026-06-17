import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, CheckCircle, Clock, BarChart3, ShieldAlert, Activity } from "lucide-react";
import DashboardLayout from './DashboardLayout';

export default function Reports({ onNav }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generated, setGenerated] = useState(false);

  const handleGenerateAll = () => {
    setIsGenerating(true);
    setGenerated(false);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setGenerated(true);
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  const reports = [
    { title: "Executive Summary", icon: BarChart3, desc: "High-level overview of system status and threat metrics.", color: "text-blue-400", bg: "bg-blue-400/10" },
    { title: "Threat Analysis", icon: ShieldAlert, desc: "Detailed breakdown of intercepted attacks and vulnerabilities.", color: "text-rose-400", bg: "bg-rose-400/10" },
    { title: "Network Telemetry", icon: Activity, desc: "Raw traffic data, latency metrics, and edge node performance.", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  return (
    <DashboardLayout active="reports" onNav={onNav}>
      <div className="flex flex-col h-full gap-6">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FileText className="text-amber-400" /> System Reports
            </h2>
            <p className="text-slate-400 mt-1 text-sm">Generate and download comprehensive system analytics.</p>
          </div>
          <button 
            onClick={handleGenerateAll}
            disabled={isGenerating}
            className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
              isGenerating ? "bg-amber-500/20 text-amber-500 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            }`}
          >
            {isGenerating ? (
              <><Clock className="animate-spin" size={18} /> Generating ({progress}%)...</>
            ) : generated ? (
              <><CheckCircle size={18} /> Regenerate All Reports</>
            ) : (
              <><Download size={18} /> Generate All Reports</>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {reports.map((report, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-6 relative overflow-hidden group hover:border-[#334155] transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl ${report.bg} flex items-center justify-center mb-4`}>
                <report.icon className={report.color} size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{report.title}</h3>
              <p className="text-sm text-slate-400 mb-6">{report.desc}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-mono text-slate-500">
                  {generated ? "Status: Ready" : "Status: Pending"}
                </span>
                <button 
                  disabled={!generated}
                  className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    generated ? "text-amber-400 hover:text-amber-300 cursor-pointer" : "text-slate-600 cursor-not-allowed"
                  }`}
                >
                  <Download size={16} /> Download
                </button>
              </div>
              
              {/* Progress bar overlay for individual item */}
              {isGenerating && (
                <div className="absolute bottom-0 left-0 h-1 bg-[#1E293B] w-full">
                   <div className="h-full bg-amber-500 transition-all duration-200" style={{ width: `${progress}%` }}></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Recent Generations List */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl flex-1 min-h-0 flex flex-col mt-2"
        >
          <div className="px-6 py-4 border-b border-[#1E293B]">
             <h3 className="text-white font-semibold">Generation History</h3>
          </div>
          <div className="p-6 overflow-y-auto">
             {generated ? (
               <div className="space-y-4">
                 <div className="flex items-center justify-between bg-[#05070A] p-4 rounded-xl border border-[#1E293B]">
                   <div className="flex items-center gap-3">
                     <FileText className="text-slate-400" size={18} />
                     <div>
                       <div className="text-sm font-medium text-slate-200">Full System Export ({new Date().toISOString().split('T')[0]})</div>
                       <div className="text-xs text-slate-500 mt-1">{new Date().toLocaleString()}</div>
                     </div>
                   </div>
                   <button className="text-slate-400 hover:text-white transition-colors">
                     <Download size={18} />
                   </button>
                 </div>
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                 <FileText size={48} className="opacity-20" />
                 <p>No recent reports generated.</p>
               </div>
             )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
