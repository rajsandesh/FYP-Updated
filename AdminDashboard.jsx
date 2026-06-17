import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Line, Marker } from "react-simple-maps";
import DashboardLayout from './DashboardLayout';
import { useSimulation } from './src/SimulationContext';
import { Activity } from 'lucide-react';

export default function AdminDashboard({ onNav }) {
  const { isAttacking, isDefending, tick } = useSimulation();

  const [events, setEvents] = useState([
    { id: 1, type: 'BLOCK_INBOUND', text: 'IP: 192.168.0.1 -> HKG_NODE_01', time: '14:02:11', color: 'text-[#22D3EE]', bg: 'bg-[#22D3EE]/10' },
    { id: 2, type: 'BRUTE_FORCE_DETECT', text: 'TARGET: AUTH_GATEWAY_B', time: '14:02:08', color: 'text-[#E11D48]', bg: 'bg-[#E11D48]/10' },
    { id: 3, type: 'LATENCY_SPIKE', text: 'REGION: EU_NORTH_RACK_4', time: '14:01:55', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ]);

  useEffect(() => {
    let interval;
    if (isAttacking || isDefending) {
      interval = setInterval(() => {
        setEvents(prev => {
          const isAtk = isAttacking && (!isDefending || Math.random() > 0.5);
          const newEvent = {
            id: Date.now(),
            type: isAtk ? 'SCAN_DETECTED' : 'DEFLECTED',
            text: `NODE_${Math.floor(Math.random() * 100)}`,
            time: new Date().toLocaleTimeString('en-US', { hour12: false }),
            color: isAtk ? 'text-slate-400' : 'text-[#22D3EE]',
            bg: 'bg-slate-800/50'
          };
          return [newEvent, ...prev].slice(0, 5);
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAttacking, isDefending]);

  return (
    <DashboardLayout active="admin" onNav={onNav}>
      <div className="h-full flex flex-col xl:flex-row gap-6 font-sans text-slate-300">
        
        {/* Left Side - Global Map */}
        <div className="flex-1 flex flex-col bg-[#0B0F19] border border-[#1E293B] relative overflow-hidden min-h-[500px] rounded-xl">
          
          {/* Map Overlay Stats */}
          <div className="absolute top-6 left-6 z-20 bg-[#05070A]/80 backdrop-blur-md border border-[#1E293B] rounded-xl p-5 flex gap-8 shadow-xl">
            <div className="text-xs font-semibold tracking-wide absolute -top-3 left-4 bg-[#05070A] px-2 text-slate-400 rounded-full border border-[#1E293B]">System Operations</div>
            <div>
              <div className="text-2xl font-bold text-white">4,129 <span className="text-xs text-slate-500 font-medium ml-1">TPS</span></div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">98.2% <span className="text-xs text-slate-500 font-medium ml-1">Mitigation</span></div>
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="absolute inset-0 z-10 flex items-center justify-center opacity-70">
             <ComposableMap
               projection="geoMercator"
               projectionConfig={{ scale: 140 }}
               style={{ width: "100%", height: "100%", background: "transparent" }}
             >
               <Geographies geography="https://unpkg.com/world-atlas@2.0.2/countries-110m.json">
                 {({ geographies }) =>
                   geographies.map((geo) => (
                     <Geography
                       key={geo.rsmKey}
                       geography={geo}
                       fill="#1E293B"
                       stroke="#0B0F19"
                       strokeWidth={0.5}
                       style={{
                         default: { outline: "none" },
                         hover: { outline: "none", fill: "#334155" },
                         pressed: { outline: "none" },
                       }}
                     />
                   ))
                 }
               </Geographies>

               {/* Static Connections */}
               <Line from={[0, 51]} to={[-74, 40]} stroke="#1E293B" strokeWidth={2} opacity={0.5} />
               <Line from={[0, 51]} to={[18, 59]} stroke="#1E293B" strokeWidth={2} opacity={0.5} />
               <Line from={[0, 51]} to={[103, 1]} stroke="#1E293B" strokeWidth={2} opacity={0.5} />
               <Line from={[0, 51]} to={[139, 35]} stroke="#1E293B" strokeWidth={2} opacity={0.5} />
               <Line from={[0, 51]} to={[-50, -10]} stroke={isAttacking ? "#E11D48" : "#1E293B"} strokeWidth={2} opacity={0.5} strokeDasharray={isAttacking ? "5 5" : "none"} className={isAttacking ? "animate-map-line" : ""} />

               {/* Central Core (London) */}
               <Marker coordinates={[0, 51]}>
                 <circle cx="0" cy="0" r="14" fill="#22D3EE" fillOpacity="0.2" stroke="#22D3EE" strokeWidth="1" className={(isAttacking || isDefending) ? "animate-pulse" : ""} />
                 <circle cx="0" cy="0" r="4" fill="#22D3EE" />
                 
                 {/* Radar rings */}
                 {isDefending && (
                   <>
                     <circle cx="0" cy="0" r="25" fill="none" stroke="#22D3EE" strokeWidth="0.5" className="animate-ping" style={{ animationDuration: '3s' }} />
                     <circle cx="0" cy="0" r="40" fill="none" stroke="#22D3EE" strokeWidth="0.2" className="animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
                   </>
                 )}
                 
                 <text y="30" textAnchor="middle" fill="#22D3EE" fontSize="10" className="font-semibold tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>Blue Agent Alpha</text>
               </Marker>

               {/* Regional Nodes */}
               <Marker coordinates={[-74, 40]}>
                 <circle cx="0" cy="0" r="3" fill="#22D3EE" />
                 <text y="14" textAnchor="middle" fill="#94a3b8" fontSize="8" className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>US-East</text>
               </Marker>
               <Marker coordinates={[18, 59]}>
                 <circle cx="0" cy="0" r="3" fill="#148092" />
                 <text y="14" textAnchor="middle" fill="#94a3b8" fontSize="8" className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>EU-North</text>
               </Marker>
               <Marker coordinates={[103, 1]}>
                 <circle cx="0" cy="0" r="3" fill="#148092" />
                 <text y="14" textAnchor="middle" fill="#94a3b8" fontSize="8" className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>AP-South</text>
               </Marker>
               <Marker coordinates={[139, 35]}>
                 <circle cx="0" cy="0" r="3" fill="#22D3EE" />
                 <text y="14" textAnchor="middle" fill="#94a3b8" fontSize="8" className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>AP-East</text>
               </Marker>

               {/* Red Team Node (Brazil) */}
               <Marker coordinates={[-50, -10]}>
                 <circle cx="0" cy="0" r="8" fill="#111827" stroke="#E11D48" strokeWidth="1" className={isAttacking ? "animate-pulse" : ""} />
                 <circle cx="0" cy="0" r="3" fill="#E11D48" />
                 <text y="20" textAnchor="middle" fill="#E11D48" fontSize="8" className="font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Red Team Node</text>
               </Marker>

               {/* Active Attack Arcs */}
               {isAttacking && (
                 <>
                   <Line id="attackArc1" from={[-50, -10]} to={[103, 1]} stroke="#E11D48" strokeWidth={1} strokeDasharray="5,5" className="animate-map-line opacity-80" />
                   {/* Attack Packet */}
                   <circle r="2" fill="#E11D48" style={{ filter: 'drop-shadow(0 0 4px #E11D48)' }}>
                     <animateMotion dur="2s" repeatCount="indefinite">
                       <mpath href="#attackArc1" />
                     </animateMotion>
                     <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                   </circle>

                   <Marker coordinates={[103, 1]}>
                     <circle cx="0" cy="0" r="5" fill="none" stroke="#E11D48" className="animate-ping" />
                   </Marker>
                 </>
               )}
               
               {/* Active Defense Arcs */}
               {isDefending && (
                 <>
                   <Line id="defendArc1" from={[18, 59]} to={[-74, 40]} stroke="#22D3EE" strokeWidth={1} strokeDasharray="5,5" className="animate-map-line opacity-80" />
                   {/* Defense Packet */}
                   <circle r="2" fill="#22D3EE" style={{ filter: 'drop-shadow(0 0 4px #22D3EE)' }}>
                     <animateMotion dur="2.5s" repeatCount="indefinite">
                       <mpath href="#defendArc1" />
                     </animateMotion>
                     <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" />
                   </circle>

                   <Marker coordinates={[-74, 40]}>
                     <circle cx="0" cy="0" r="5" fill="none" stroke="#22D3EE" className="animate-ping" />
                   </Marker>
                 </>
               )}
             </ComposableMap>
          </div>

          {/* Bottom Controls / Legend */}
          <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-[#05070A] to-transparent flex items-center justify-between px-6 z-20 border-t border-[#1E293B]">
             <div className="flex gap-4">
               <div className={`flex items-center gap-2 text-xs font-medium border px-3 py-1.5 rounded-lg transition-colors ${isAttacking ? "border-[#E11D48]/50 bg-[#E11D48]/20 text-[#E11D48]" : "border-[#E11D48]/30 bg-[#E11D48]/10 text-[#E11D48]/60"}`}>
                 <div className={`w-2 h-2 rounded-full ${isAttacking ? "bg-[#E11D48] animate-pulse" : "bg-[#E11D48]/60"}`}></div> Scarlet: Offensive
               </div>
               <div className={`flex items-center gap-2 text-xs font-medium border px-3 py-1.5 rounded-lg transition-colors ${isDefending ? "border-[#22D3EE]/50 bg-[#22D3EE]/20 text-[#22D3EE]" : "border-[#22D3EE]/30 bg-[#22D3EE]/10 text-[#22D3EE]/60"}`}>
                 <div className={`w-2 h-2 rounded-full ${isDefending ? "bg-[#22D3EE] animate-pulse" : "bg-[#22D3EE]/60"}`}></div> Cyan: Defensive
               </div>
             </div>
             
             {/* Tech decoration */}
             <div className="flex gap-1 opacity-20">
               {[...Array(20)].map((_, i) => <div key={i} className="w-1 h-3 bg-white"></div>)}
             </div>
          </div>
        </div>

        {/* Right Side - Tactical Feed */}
        <div className="w-full xl:w-80 shrink-0 flex flex-col gap-6">
          
          <div className="space-y-1">
            <h2 className="text-[#E11D48] text-xs font-semibold tracking-wide">Global Analytics</h2>
            <h1 className="text-white text-2xl font-bold tracking-tight">Tactical Feed</h1>
          </div>

          {/* Target Vectors */}
          <div className="space-y-4 pt-4 border-t border-[#1E293B]">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>Target Vectors</span>
              <span className="w-3 h-3 border border-slate-500 rounded-sm"></span>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>United States</span>
                  <span className="text-[#E11D48]">42%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#1E293B] w-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "42%" }} className="h-full bg-[#E11D48]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>Germany</span>
                  <span className="text-[#E11D48]">28%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#1E293B] w-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "28%" }} className="h-full bg-[#E11D48]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>Singapore</span>
                  <span className="text-[#E11D48]">15%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#1E293B] w-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "15%" }} className="h-full bg-[#E11D48]" />
                </div>
              </div>
            </div>
          </div>

          {/* RL Agent Stats */}
          <div className="border border-[#1E293B] rounded-xl bg-[#0A0F1A] p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-2 text-sm font-medium mb-4">
              <div className="w-4 h-4 rounded-full border border-[#22D3EE] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]"></div>
              </div>
              <span className="text-slate-400">RL Agent:</span>
              <span className="text-white">"Neural-V9"</span>
            </div>

            <div className="flex justify-between mb-6">
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">Q-Values</div>
                <div className="text-[#22D3EE] font-bold text-lg">0.8924</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-500 mb-1">Reward Δ</div>
                <div className="text-[#10B981] font-bold text-lg">+12.4%</div>
              </div>
            </div>

            {/* Mini Chart */}
            <div className="flex items-end justify-between h-10 gap-1 border-b border-[#1E293B] pb-1">
               {[40, 60, 45, 80, 50, 75, 90, 85].map((val, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ height: 0 }} 
                   animate={{ height: `${val}%` }} 
                   transition={{ delay: i * 0.1 }}
                   className="w-full bg-[#148092] hover:bg-[#22D3EE] transition-colors"
                 />
               ))}
            </div>
          </div>

          {/* Live Event Log */}
          <div className="flex-1 flex flex-col min-h-0 pt-2">
            <div className="text-xs font-semibold text-slate-500 mb-4">Live Event Log</div>
            <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 flex-1">
              {events.map((event) => (
                <div key={event.id} className={`${event.bg} border-l-2 border-current ${event.color} p-4 rounded-r-lg text-sm relative shadow-sm`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold">{event.type}</span>
                    <span className="text-slate-400 text-xs">{event.time}</span>
                  </div>
                  <div className="text-slate-300 break-words">{event.text}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Global Footer / Scrubber */}
      <footer className="h-16 mt-6 border-t border-[#1E293B] flex items-center justify-between text-sm font-medium text-slate-400">
        <div className="flex items-center gap-6">
          <div className="text-[#22D3EE] font-semibold flex items-center gap-2">
            <Activity size={16} className={(isAttacking || isDefending) ? "animate-pulse" : ""} />
            Global Observer Feed Active
          </div>
        </div>
        
        <div className="flex items-center gap-5 text-slate-500">
          <span className="hover:text-slate-300 cursor-pointer transition-colors">-24h</span>
          <span className="hover:text-slate-300 cursor-pointer transition-colors">-12h</span>
          <span className="hover:text-slate-300 cursor-pointer transition-colors">-6h</span>
          <span className="hover:text-slate-300 cursor-pointer transition-colors">-1h</span>
          <span className="text-[#22D3EE] font-semibold bg-[#22D3EE]/10 px-2 py-0.5 rounded">Now</span>
        </div>

        <div className="text-right">
          <div className="font-semibold text-slate-300">17:16:27</div>
          <div className="text-xs text-slate-500">UTC</div>
        </div>
      </footer>
    </DashboardLayout>
  );
}