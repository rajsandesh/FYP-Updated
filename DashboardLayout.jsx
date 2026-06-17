import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Crosshair,
  Shield,
  Terminal,
  Rocket,
  Search,
  Bell,
  Settings,
  Power,
  Menu,
  X,
  Activity,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./src/AuthContext";
import { useSimulation } from "./src/SimulationContext";
// inline SVG logo — no image file needed

const NAV_ITEMS = [
  { id: "admin", label: "Dashboard", icon: Globe, accent: "#22D3EE", activeColor: "text-[#22D3EE]" },
  { id: "red-team", label: "Offensive Tests", icon: Crosshair, accent: "#E11D48", activeColor: "text-[#E11D48]" },
  { id: "blue-team", label: "Defensive Tests", icon: Shield, accent: "#4F46E5", activeColor: "text-[#4F46E5]" },
  { id: "network-logs", label: "Network Logs", icon: Activity, accent: "#10B981", activeColor: "text-emerald-400" },
  { id: "reports", label: "Reports", icon: FileText, accent: "#F59E0B", activeColor: "text-amber-400" },
];

export default function DashboardLayout({ children, active, onNav }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { networkState, tick, isSimulating, setIsSimulating } = useSimulation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const sidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full bg-[#0B0F19] border-r border-[#1E293B]">
      {/* Title */}
      <div className="px-5 py-5">
        <h1 className="text-white font-semibold text-xl tracking-tight leading-tight flex items-center gap-3">
          {/* Shield SVG Icon */}
          <span className="relative flex items-center justify-center w-9 h-9 shrink-0">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
              <defs>
                <linearGradient id="shieldGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#38BDF8"/>
                  <stop offset="100%" stopColor="#6366F1"/>
                </linearGradient>
              </defs>
              <path d="M18 3L5 8.5V18c0 6.6 5.6 12.4 13 14 7.4-1.6 13-7.4 13-14V8.5L18 3z" fill="url(#shieldGrad)" opacity="0.15" stroke="url(#shieldGrad)" strokeWidth="1.5" strokeLinejoin="round"/>
              {/* circuit nodes */}
              <circle cx="18" cy="15" r="1.5" fill="#38BDF8"/>
              <circle cx="13" cy="19" r="1" fill="#38BDF8" opacity="0.7"/>
              <circle cx="23" cy="19" r="1" fill="#38BDF8" opacity="0.7"/>
              <circle cx="18" cy="23" r="1" fill="#6366F1" opacity="0.8"/>
              {/* circuit lines */}
              <line x1="18" y1="15" x2="13" y2="19" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6"/>
              <line x1="18" y1="15" x2="23" y2="19" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6"/>
              <line x1="13" y1="19" x2="18" y2="23" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6"/>
              <line x1="23" y1="19" x2="18" y2="23" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6"/>
            </svg>
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Cyber Sim</span>
        </h1>
      </div>

      {isMobile && (
        <button onClick={() => setMobileOpen(false)} className="absolute top-6 right-6 text-slate-500">
          <X size={20} />
        </button>
      )}

      {/* Nav Items */}
      <div className="px-4 mb-2 text-xs font-semibold text-slate-500 tracking-wide mt-2">NAVIGATION</div>
      <nav className="flex-1 space-y-1 px-4 font-sans">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => { onNav(item.id); if (isMobile) setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium rounded-xl transition-colors relative group
                ${isActive ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}
              `}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile / Action */}
      <div className="p-4 space-y-4">
        <button 
          onClick={() => setIsSimulating(!isSimulating)}
          className={`w-full flex items-center justify-center gap-2 border rounded-xl py-2.5 text-sm font-medium transition-all ${
            isSimulating 
              ? "bg-[#111827] border-[#F43F5E] text-[#F43F5E] hover:bg-[#F43F5E]/10" 
              : "bg-slate-900 border-slate-800 hover:bg-slate-800 text-white"
          }`}
        >
          <Rocket size={16} /> {isSimulating ? "Stop Simulation" : "Run Simulation"}
        </button>
        <div className="flex items-center gap-3 pt-4 border-t border-[#1E293B]">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-[#1E293B] overflow-hidden shrink-0">
             {/* Mock Avatar */}
             <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
          </div>
          <div className="font-sans text-sm min-w-0">
            <div className="text-slate-900 dark:text-white font-semibold truncate">Admin User</div>
            <div className="text-slate-500 text-xs truncate">System Administrator</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#05070A] text-slate-300 font-sans overflow-hidden">
      
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              onClick={(e) => e.stopPropagation()}
              className="w-64 h-full"
            >
              {sidebarContent(true)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-full shrink-0 z-40 relative">
        {sidebarContent(false)}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-[#05070A] border-b border-[#1E293B] shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-400" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="text-white font-semibold text-lg tracking-tight flex items-center gap-2 lg:hidden">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]">
                <defs>
                  <linearGradient id="shieldGradMob" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#38BDF8"/>
                    <stop offset="100%" stopColor="#6366F1"/>
                  </linearGradient>
                </defs>
                <path d="M18 3L5 8.5V18c0 6.6 5.6 12.4 13 14 7.4-1.6 13-7.4 13-14V8.5L18 3z" fill="url(#shieldGradMob)" opacity="0.15" stroke="url(#shieldGradMob)" strokeWidth="1.5" strokeLinejoin="round"/>
                <circle cx="18" cy="15" r="1.5" fill="#38BDF8"/>
                <line x1="18" y1="15" x2="13" y2="19" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6"/>
                <line x1="18" y1="15" x2="23" y2="19" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6"/>
              </svg>
              Cyber Sim
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 font-sans text-xs font-medium tracking-wide">
            <div className="flex flex-col text-center">
              <span className="text-slate-500">System Health</span>
              <span className="text-[#10B981]">Nominal</span>
            </div>
            <div className="flex flex-col text-center border-b-2 border-[#22D3EE] pb-0.5">
              <span className="text-slate-500">Active Threats</span>
              <span className="text-[#22D3EE]">Monitoring</span>
            </div>
            <div className="flex flex-col text-center">
              <span className="text-slate-500">Current Step</span>
              <span className="text-white">{tick}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden md:flex relative items-center">
               <Search size={16} className="absolute left-3 text-slate-500" />
               <input 
                 type="text" 
                 placeholder="Search..." 
                 className="bg-[#0B0F19] border border-[#1E293B] text-sm font-medium text-slate-300 pl-10 pr-4 py-2 w-64 outline-none focus:border-[#22D3EE]/50 transition-colors rounded-lg"
               />
             </div>
             <div className="flex items-center gap-4 text-slate-400">
               <button className="hover:text-white transition-colors relative">
                 <Bell size={16} />
                 <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#E11D48] rounded-full"></span>
               </button>
               <button className="hover:text-white transition-colors"><Settings size={16} /></button>
               <button onClick={handleLogout} className="hover:text-[#E11D48] transition-colors"><Power size={16} /></button>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden bg-[#05070A] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
