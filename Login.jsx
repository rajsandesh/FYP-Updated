import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, Lock, ScanLine, Shield, Activity } from "lucide-react";
import { useAuth } from "./src/AuthContext";

const LiveMapBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#030014]">
      {/* Deep obsidian and royal purple gradient base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030014] to-[#030014]"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.05) 1px, transparent 1px)', 
             backgroundSize: '40px 40px',
             maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
           }}>
      </div>

      {/* SVG Map (Abstracted nodes and lines) */}
      <svg className="absolute w-full h-full opacity-60" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="cyanArc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0" />
            <stop offset="50%" stopColor="#22D3EE" stopOpacity="1" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="purpleArc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0" />
            <stop offset="50%" stopColor="#A855F7" stopOpacity="1" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="redArc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0" />
            <stop offset="50%" stopColor="#EF4444" stopOpacity="1" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Attack arcs - using basic curved paths and animations */}
        <motion.path 
          d="M 200 250 Q 400 100 600 200" 
          stroke="url(#redArc)" strokeWidth="2" fill="none" filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.path 
          d="M 700 150 Q 500 300 300 250" 
          stroke="url(#cyanArc)" strokeWidth="2" fill="none" filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 4, delay: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.path 
          d="M 800 350 Q 500 50 250 150" 
          stroke="url(#redArc)" strokeWidth="1.5" fill="none" filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 3.5, delay: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.path 
          d="M 100 400 Q 300 200 600 200" 
          stroke="url(#purpleArc)" strokeWidth="1.5" fill="none" filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: "linear" }}
        />

        {/* Map Nodes */}
        {[
          {x: 200, y: 250, color: '#EF4444', type: 'origin'},
          {x: 600, y: 200, color: '#10B981', type: 'target'},
          {x: 700, y: 150, color: '#22D3EE', type: 'target'},
          {x: 300, y: 250, color: '#EF4444', type: 'origin'},
          {x: 800, y: 350, color: '#EF4444', type: 'origin'},
          {x: 250, y: 150, color: '#10B981', type: 'target'},
          {x: 100, y: 400, color: '#EF4444', type: 'origin'},
        ].map((node, i) => (
          <g key={i} transform={`translate(${node.x}, ${node.y})`}>
            <circle r={node.type === 'origin' ? "4" : "5"} fill={node.color} filter="url(#glow)" />
            <circle r="12" fill="none" stroke={node.color} strokeWidth="1" opacity="0.5">
              <animate attributeName="r" values={node.type === 'origin' ? "4; 24" : "5; 15"} dur={node.type === 'origin' ? "1.5s" : "3s"} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8; 0" dur={node.type === 'origin' ? "1.5s" : "3s"} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
    </div>
  );
};

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [epoch, setEpoch] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    if (user) navigate("/admin", { replace: true });
    const interval = setInterval(() => setEpoch(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const result = login(username, password);
    if (result.ok) navigate("/admin", { replace: true });
    else setError(result.error);
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans bg-[#030014] text-slate-300 overflow-hidden selection:bg-cyan-500/30">
      
      {/* Background Map Simulation */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <LiveMapBackground />
      </div>

      {/* Top HUD / Navbar */}
      <header className="relative z-20 flex items-center justify-between px-8 py-6 text-sm font-medium tracking-wide">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-cyan-400" />
          <span className="text-white font-bold tracking-wider text-lg">CyberSim</span>
        </div>
        
        {!showLogin && (
          <nav className="hidden md:flex gap-8 text-slate-400">
            <a href="#" className="hover:text-cyan-400 transition-colors">Home</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Simulations</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Intelligence</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Contact Us</a>
          </nav>
        )}
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Status:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Online
              </span>
            </div>
            <div className="text-slate-500 font-mono mt-0.5">{epoch}</div>
          </div>
          {!showLogin && (
            <button 
              onClick={() => setShowLogin(true)}
              className="text-white bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-20 p-4">
        <AnimatePresence mode="wait">
          {!showLogin ? (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between text-left mt-[-8vh] px-8"
            >
              {/* Left Side Metadata */}
              <div className="hidden md:flex flex-col gap-6 w-1/4">
                <div className="bg-transparent border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                  <div className="text-5xl font-bold text-cyan-400 mb-2">2.5M</div>
                  <div className="text-xs text-slate-400 font-medium tracking-widest uppercase">Simulations Run</div>
                </div>
                <div className="bg-transparent border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                  <div className="text-3xl font-bold text-purple-400 mb-2">142+</div>
                  <div className="text-xs text-slate-400 font-medium tracking-widest uppercase">Active Vectors</div>
                </div>
              </div>

              {/* Center Content */}
              <div className="flex flex-col items-center text-center max-w-3xl flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
                  <Activity size={16} />
                  <span>AI-Powered Cybersecurity</span>
                </div>
                
                <h1 className="text-white text-5xl md:text-7xl font-bold tracking-[0.1em] mb-6 leading-tight w-full">
                  CYBER SIM: <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                    ADVANCED PREDICTION
                  </span>
                </h1>
                
                <p className="text-xl text-slate-400 max-w-2xl mb-12">
                  Stops Threats Before They Strike. Next-generation threat detection 
                  and live environment simulation for enterprise defense.
                </p>

                <button 
                  onClick={() => setShowLogin(true)}
                  className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-full font-bold text-white tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-[2px] bg-[#030014] rounded-full group-hover:bg-opacity-80 transition-all"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 blur-md"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    LAUNCH LIVE SIMULATION
                  </span>
                </button>
              </div>

              {/* Right Side Empty or About Us */}
              <div className="hidden md:flex flex-col gap-6 w-1/4 justify-end h-full mt-auto">
                <div className="bg-transparent border border-white/10 p-6 rounded-2xl backdrop-blur-sm mt-[20vh]">
                  <div className="text-lg font-bold text-white mb-2">Leader of Cybersecurity</div>
                  <div className="text-sm text-slate-400 leading-relaxed">
                    Founded by former experts and AI researchers, CyberSim protects 2,500+ organizations worldwide with real-time predictive modeling.
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="login"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-[440px] bg-[#0A0F1A]/40 backdrop-blur-[12px] border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(34,211,238,0.15)]"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 mb-4 ring-1 ring-cyan-500/20">
                  <Shield className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                </div>
                <h2 className="text-white text-2xl font-bold tracking-wide">WELCOME BACK</h2>
                <p className="text-slate-400 text-sm mt-2">Authenticate to access command center</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Username */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Username</label>
                  <div className="relative flex items-center">
                    <Hexagon size={18} className="absolute left-4 text-slate-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl text-slate-900 pl-11 pr-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                  <div className="relative flex items-center">
                    <Lock size={18} className="absolute left-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl text-slate-900 pl-11 pr-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  {error && <div className="text-red-500 text-xs mt-1 font-medium">{error}</div>}
                </div>

                {/* MFA Status */}
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-200/50 rounded-lg">
                      <ScanLine size={18} className="text-slate-600" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-sm font-bold text-slate-900">Two-Factor Auth</div>
                      <div className="text-xs text-slate-500 font-medium">Ready for verification</div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold tracking-wide rounded-xl py-3.5 transition-all shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98] mt-6"
                >
                  SIGN IN
                </button>

              </form>

              <div className="mt-6 flex justify-between text-xs font-medium text-slate-400">
                <div className="hover:text-cyan-400 cursor-pointer transition-colors" onClick={() => setShowLogin(false)}>
                  ← Back to Portal
                </div>
                <div className="hover:text-white cursor-pointer transition-colors">
                  Forgot Password?
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom HUD - Always visible but styled appropriately */}
        <motion.div 
          layout
          className="absolute bottom-8 flex gap-8 md:gap-16 text-xs font-medium text-slate-500 text-center bg-[#030014]/50 backdrop-blur-md px-8 py-3 rounded-2xl border border-white/5"
        >
          <div>
            <div className="mb-1 uppercase tracking-widest text-[10px]">Latency</div>
            <div className="text-cyan-400">14ms</div>
          </div>
          <div>
            <div className="mb-1 uppercase tracking-widest text-[10px]">Server</div>
            <div className="text-slate-300">US-East</div>
          </div>
          <div>
            <div className="mb-1 uppercase tracking-widest text-[10px]">Security</div>
            <div className="text-emerald-400">Standard</div>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
