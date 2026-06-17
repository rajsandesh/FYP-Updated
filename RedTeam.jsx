import React from 'react';
import { 
  Bell, Monitor, User, Search, Rocket, Activity, Play, Pause, SkipBack, SkipForward
} from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from './DashboardLayout';
import { useSimulation } from './src/SimulationContext';

export default function RedTeam({ onNav }) {
  const { isAttacking, setIsAttacking, tick } = useSimulation();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60).toString().padStart(2, '0');
    const s = (t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <DashboardLayout active="red-team" onNav={onNav} accent="#F43F5E">
      <div className="flex flex-col min-h-full bg-[#060B14] text-slate-300 font-sans">
        
        {/* CUSTOM HEADER OVERRIDE */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="h-16 flex items-center justify-between px-8 border-b border-[#1E293B] bg-[#0A0F1A] shrink-0"
        >
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-8 text-xs font-medium tracking-wide">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse"></span>
                <span className="text-[#22D3EE] font-semibold">Threat Level:<br/>42%</span>
              </div>
              <div className="text-slate-500 font-semibold">Active Mitigations:<br/><span className="text-slate-300">12</span></div>
              <div className="text-slate-500 font-semibold">Model Confidence:<br/><span className="text-slate-300">0.89</span></div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search Logs..." 
                className="bg-[#111827] border border-[#1E293B] rounded-lg text-sm font-medium pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-[#F43F5E] transition-colors"
              />
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <button className="hover:text-white transition-colors relative">
                <Bell size={18} />
              </button>
              <button className="hover:text-white transition-colors"><Monitor size={18} /></button>
              <button className="hover:text-white transition-colors"><User size={18} /></button>
            </div>
          </div>
        </motion.header>

        {/* CONTENT AREA */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex-1 flex flex-col xl:flex-row p-6 gap-6 bg-[#060B14]"
        >
          
          {/* LEFT COLUMN */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
             
             {/* NEURAL TOPOLOGY */}
             <motion.div variants={itemVariants} className="bg-[#0A0F1A] border border-[#1E293B] rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-start mb-6">
                   <div>
                     <h2 className="text-xl font-bold text-slate-200 mb-1 tracking-tight">Network Topology</h2>
                     <p className="text-xs text-slate-500 font-medium">Real-Time Simulation Exploration</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="border border-[#F43F5E]/50 text-[#F43F5E] bg-[#F43F5E]/10 px-3 py-1.5 text-xs font-semibold rounded-lg">Attack Active</div>
                      <div className="border border-[#22D3EE]/50 text-[#22D3EE] px-3 py-1.5 text-xs font-semibold rounded-lg">Step {340 + tick}</div>
                   </div>
                </div>
                
                {/* Graph Area */}
                <div className="relative h-64 flex items-center justify-center border-t border-b border-[#1E293B]/50 my-4 overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                  
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <radialGradient id="redGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#F43F5E" stopOpacity="0"/>
                      </radialGradient>
                      <path id="attackPath" d="M 300 250 Q 450 150 550 50" fill="none" />
                      <path id="attackPath2" d="M 200 120 Q 300 150 420 140" fill="none" />
                      <path id="attackPath3" d="M 540 230 Q 500 200 420 140" fill="none" />
                      
                      <linearGradient id="scanLine" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F43F5E" stopOpacity="0"/>
                        <stop offset="50%" stopColor="#F43F5E" stopOpacity="0.5"/>
                        <stop offset="100%" stopColor="#F43F5E" stopOpacity="0"/>
                      </linearGradient>
                    </defs>

                    {/* Horizon line */}
                    <line x1="0" y1="150" x2="800" y2="150" stroke="#1E293B" strokeWidth="1" />
                    <line x1="0" y1="180" x2="800" y2="180" stroke="#1E293B" strokeWidth="1" strokeDasharray="2 4" opacity="0.3" />
                    
                    {/* Scanning Line overlay */}
                    {isAttacking && (
                      <rect width="800" height="20" fill="url(#scanLine)" opacity="0.4">
                        <animate attributeName="y" values="-20;320" dur="2.5s" repeatCount="indefinite" />
                      </rect>
                    )}

                    {/* Connections */}
                    <path d="M 300 250 Q 450 150 550 50" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <path d="M 200 120 Q 300 150 420 140" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
                    <path d="M 540 230 Q 500 200 420 140" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
                    
                    {/* Animated Packets */}
                    {isAttacking && (
                      <>
                        {/* Packet 1 */}
                        <circle r="3" fill="#F43F5E" style={{ filter: 'drop-shadow(0 0 4px #F43F5E)' }}>
                          <animateMotion dur="2s" repeatCount="indefinite">
                            <mpath href="#attackPath" />
                          </animateMotion>
                          <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                        </circle>
                        
                        {/* Packet 2 */}
                        <circle r="2" fill="#F43F5E" style={{ filter: 'drop-shadow(0 0 4px #F43F5E)' }}>
                          <animateMotion dur="1.5s" repeatCount="indefinite" begin="0.5s">
                            <mpath href="#attackPath2" />
                          </animateMotion>
                          <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
                        </circle>

                        {/* Packet 3 */}
                        <circle r="2" fill="#F43F5E" style={{ filter: 'drop-shadow(0 0 4px #F43F5E)' }}>
                          <animateMotion dur="2.5s" repeatCount="indefinite" begin="1s">
                            <mpath href="#attackPath3" />
                          </animateMotion>
                          <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" begin="1s" />
                        </circle>
                      </>
                    )}

                    {/* Central active node (Target) */}
                    <g transform="translate(420, 140)">
                      {isAttacking && (
                        <>
                          {/* Expanding attack rings */}
                          <circle cx="0" cy="0" r="15" fill="none" stroke="#F43F5E" strokeWidth="0.5">
                            <animate attributeName="r" values="4;40" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite" />
                          </circle>
                          
                          {/* Rotating Crosshair */}
                          <g stroke="#F43F5E" strokeWidth="1" opacity="0.8">
                            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" />
                            <circle cx="0" cy="0" r="10" fill="none" strokeDasharray="2 4" />
                            <line x1="-15" y1="0" x2="-8" y2="0" />
                            <line x1="15" y1="0" x2="8" y2="0" />
                            <line x1="0" y1="-15" x2="0" y2="-8" />
                            <line x1="0" y1="15" x2="0" y2="8" />
                          </g>
                        </>
                      )}
                      <circle cx="0" cy="0" r="4" fill="#F43F5E" className={isAttacking ? "animate-pulse" : ""} />
                    </g>
                    
                    {/* Peripheral nodes */}
                    <circle cx="300" cy="250" r="3" fill="#22D3EE" opacity="0.8" />
                    <circle cx="550" cy="50" r="3" fill="#22D3EE" opacity="0.8" />
                    <circle cx="320" cy="50" r="2" fill="#22D3EE" opacity="0.6" />
                    <circle cx="200" cy="120" r="2" fill="#22D3EE" opacity="0.4" />
                    <circle cx="540" cy="230" r="2" fill="#22D3EE" opacity="0.6" />
                    <circle cx="680" cy="140" r="2" fill="#475569" opacity="0.4" />
                    
                    {/* Labels for cool factor */}
                    <text x="305" y="245" fill="#22D3EE" fontSize="10" opacity="0.8" className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Source 1</text>
                    <text x="555" y="45" fill="#22D3EE" fontSize="10" opacity="0.8" className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Source 2</text>
                    <text x="430" y="135" fill="#F43F5E" fontSize="11" opacity="0.9" className="font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Target Server</text>
                  </svg>
                </div>
             </motion.div>

             {/* AGENT REASONING TRACE */}
             <motion.div variants={itemVariants} className="bg-[#0A0F1A] border border-[#1E293B] rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6 text-xs font-semibold text-slate-500">
                   <span>Model Reasoning Trace: [Bot-1]</span>
                   <div className="flex gap-4">
                      <span className="text-[#22D3EE]">Observation: 0.82</span>
                      <span className="text-[#22D3EE]">Policy: Stable</span>
                   </div>
                </div>
                <div className="space-y-4 font-sans text-sm">
                   <div className="flex gap-4 items-start">
                     <span className="text-slate-500 mt-0.5">[{formatTime(tick)}]</span>
                     <span className="text-[#22D3EE] font-semibold w-20 shrink-0">Reward</span>
                     <span className="text-slate-300">Policy improvement score: +0.002. Exploring adjacent node.</span>
                   </div>
                   <div className="flex gap-4 items-start">
                     <span className="text-slate-500 mt-0.5">[{formatTime(tick + 1)}]</span>
                     <span className="text-[#F43F5E] font-semibold w-20 shrink-0">Decision</span>
                     <span className="text-slate-300">Initiating lateral movement towards Database.</span>
                   </div>
                   <div className="flex gap-4 items-start">
                     <span className="text-slate-500 mt-0.5">[{formatTime(tick + 3)}]</span>
                     <span className="text-[#22D3EE] font-semibold w-20 shrink-0">Observation</span>
                     <span className="text-slate-300">Intrusion Detection System ping detected.<br/>Shifting to low-noise protocol.</span>
                   </div>
                </div>
             </motion.div>

             {/* INITIALIZE NEURAL STRIKE */}
             <motion.div variants={itemVariants} className="bg-[#0A0F1A] border border-[#1E293B] rounded-xl p-6 max-w-lg mt-auto shadow-lg">
                 <h3 className="text-xs font-semibold text-slate-500 mb-4">Run Attack Scenario</h3>
                 <div className="flex gap-4 mb-6">
                    <div className="bg-[#111827] border border-[#1E293B] rounded-lg px-4 py-3 flex-1">
                      <div className="text-xs text-slate-500 font-semibold mb-1">Current Step</div>
                      <div className="text-xl font-bold text-slate-200">340.02.1</div>
                    </div>
                    <div className="bg-[#111827] border border-[#1E293B] rounded-lg px-4 py-3 flex-1">
                      <div className="text-xs text-slate-500 font-semibold mb-1">Tick Rate</div>
                      <div className="text-xl font-bold text-slate-200">1882/ms</div>
                    </div>
                 </div>
                 <button 
                   onClick={() => setIsAttacking(!isAttacking)}
                   className={`w-full font-semibold text-sm py-4 rounded-xl transition-all flex items-center justify-center gap-3 mb-4 shadow-lg ${
                     isAttacking 
                     ? "bg-[#111827] border border-[#F43F5E] text-[#F43F5E] hover:bg-[#F43F5E]/10" 
                     : "bg-[#F43F5E] border border-[#F43F5E] text-white hover:bg-[#F43F5E]/90"
                   }`}
                 >
                    <Rocket size={18} /> {isAttacking ? "Stop Scenario" : "Start Scenario"}
                 </button>
                 <p className="text-xs text-slate-500 font-medium text-center">
                   Note: Attack actions are monitored by defensive systems.
                 </p>
             </motion.div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full xl:w-[380px] flex flex-col gap-6 shrink-0">
             
             {/* Q-VALUE PROGRESSION */}
             <motion.div variants={itemVariants} className="bg-[#0A0F1A] border border-[#1E293B] rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xs font-semibold text-slate-500">Model Training Progress</h3>
                  <Activity size={16} className="text-[#22D3EE]" />
                </div>
                
                {/* Fake Bar Chart */}
                <div className="flex justify-between items-end h-6 mb-8 gap-1.5 opacity-80">
                   {[20, 20, 20, 20, 20, 25, 25, 30, 40, 100].map((h, i) => (
                     <div key={i} className="flex-1 bg-[#F43F5E] rounded-t-sm" style={{ height: `${h}%`, opacity: h/100 + 0.2 }} />
                   ))}
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-[#1E293B] pt-6">
                   <div>
                     <div className="text-xs font-semibold text-slate-500 mb-1">Attack Success Rate</div>
                     <div className="text-3xl font-bold text-slate-200">94.2<span className="text-lg text-slate-500 ml-1">%</span></div>
                   </div>
                   <div>
                     <div className="text-xs font-semibold text-slate-500 mb-1">Average Reward</div>
                     <div className="text-3xl font-bold text-[#F43F5E]">+0.85</div>
                   </div>
                </div>
             </motion.div>

             {/* TARGET MATRIX: NEURAL STRESS */}
             <motion.div variants={itemVariants} className="bg-[#0A0F1A] border border-[#1E293B] rounded-xl p-6 flex-1 shadow-lg">
                 <h3 className="text-xs font-semibold text-slate-500 mb-6">Target System Load</h3>
                 <div className="space-y-4">
                    {/* Item 1 */}
                    <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4">
                       <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-slate-300 text-sm">Admin-Node-1</span>
                              <span className="bg-[#F43F5E]/20 text-[#F43F5E] text-xs px-2 py-0.5 rounded-md font-medium border border-[#F43F5E]/30">Target</span>
                            </div>
                            <div className="text-xs text-slate-500 font-medium">Priority: High</div>
                          </div>
                          <div className="border border-[#F43F5E]/50 text-[#F43F5E] text-xs font-medium px-2 py-1 rounded-md">Targeting</div>
                       </div>
                       <div className="w-full bg-[#1E293B] h-1.5 mb-2 mt-4 rounded overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: '78%' }} transition={{ duration: 1 }} className="bg-[#F43F5E] h-full"></motion.div>
                       </div>
                       <div className="flex justify-between text-xs font-medium text-slate-500">
                         <span>Load: 0.78</span>
                         <span>Success Est: 65%</span>
                       </div>
                    </div>
                    {/* Item 2 */}
                    <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4">
                       <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-slate-300 text-sm">DB-Node-1</span>
                              <span className="bg-[#F43F5E]/20 text-[#F43F5E] text-xs px-2 py-0.5 rounded-md font-medium border border-[#F43F5E]/30">Target</span>
                            </div>
                            <div className="text-xs text-slate-500 font-medium">Priority: Medium</div>
                          </div>
                          <div className="border border-[#22D3EE]/50 text-[#22D3EE] text-xs font-medium px-2 py-1 rounded-md">Monitoring</div>
                       </div>
                       <div className="w-full bg-[#1E293B] h-1.5 mb-2 mt-4 rounded overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: '32%' }} transition={{ duration: 1, delay: 0.2 }} className="bg-[#22D3EE] h-full"></motion.div>
                       </div>
                       <div className="flex justify-between text-xs font-medium text-slate-500">
                         <span>Load: 0.32</span>
                         <span>Success Est: 12%</span>
                       </div>
                    </div>
                    {/* Item 3 */}
                    <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4 opacity-60">
                       <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-slate-300 text-sm">Ext-Node-1</span>
                              <span className="bg-[#F43F5E]/20 text-[#F43F5E] text-xs px-2 py-0.5 rounded-md font-medium border border-[#F43F5E]/30">Target</span>
                            </div>
                            <div className="text-xs text-slate-500 font-medium">Priority: Low</div>
                          </div>
                          <div className="border border-[#1E293B] text-slate-500 text-xs font-medium px-3 py-1 rounded-md">Idle</div>
                       </div>
                    </div>
                 </div>
             </motion.div>
          </div>
        </motion.div>

        {/* BOTTOM BAR */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="h-24 border-t border-[#1E293B] bg-[#0A0F1A] px-8 flex items-center justify-between shrink-0"
        >
          <div className="flex-1 max-w-4xl">
            <div className="flex justify-between text-xs text-slate-400 font-semibold mb-3">
               <span className="text-[#22D3EE]">Simulation Timeline</span>
               <span>Step 0 - 500</span>
            </div>
            
            <div className="relative h-2 bg-[#111827] border border-[#1E293B] rounded-full overflow-hidden mb-4">
              <div className="absolute inset-y-0 left-0 bg-[#F43F5E]/40" style={{ width: '60%' }}></div>
              <div className="absolute inset-y-0 left-0 w-1 bg-[#22D3EE]" style={{ left: '60%' }}></div>
            </div>

            <div className="flex gap-6 text-xs text-slate-500 font-medium">
               <button className="hover:text-white transition-colors text-slate-300">Live View</button>
               <button className="hover:text-white transition-colors">Archive</button>
               <button className="hover:text-white transition-colors">Export</button>
            </div>
          </div>

          <div className="flex items-center gap-12 shrink-0">
             {/* Playback Controls */}
             <div className="flex items-center gap-3">
                <button className="w-10 h-10 border border-[#1E293B] hover:border-[#22D3EE] hover:text-[#22D3EE] rounded-lg flex items-center justify-center transition-colors">
                  <SkipBack size={16} />
                </button>
                <button 
                  onClick={() => setIsAttacking(!isAttacking)}
                  className="w-10 h-10 border border-[#1E293B] hover:border-[#22D3EE] hover:text-[#22D3EE] rounded-lg flex items-center justify-center transition-colors"
                >
                  {isAttacking ? <Pause size={16} /> : <Play size={16} className="ml-1" />}
                </button>
                <button className="w-10 h-10 border border-[#1E293B] hover:border-[#22D3EE] hover:text-[#22D3EE] rounded-lg flex items-center justify-center transition-colors">
                  <SkipForward size={16} />
                </button>
             </div>

             {/* Footer Branding */}
             <div className="text-right text-xs font-semibold text-slate-500 leading-relaxed opacity-60">
                <div>© 2024 Cyber Sim</div>
                <div className="text-[#22D3EE]">Engine v1.0</div>
             </div>
          </div>
        </motion.div>

      </div>
    </DashboardLayout>
  );
}
