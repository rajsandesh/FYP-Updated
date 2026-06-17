import React, { useEffect, useRef } from 'react';

const Terminal = ({ logs, className = '' }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={`font-mono text-xs rounded-lg p-4 h-full overflow-hidden flex flex-col border border-[var(--app-border)] ${className}`} style={{ background: "var(--terminal-bg)" }}>
      <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
        <div className="w-2 h-2 rounded-full bg-roseCrimson animate-pulse" />
        <span className="text-[var(--app-text-muted)] tracking-[0.2em] uppercase">Activity log</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-3 leading-relaxed">
            <span className="text-white/20 select-none">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
            <span className="text-neuralCyan/80">{log}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-white/20 italic">Awaiting neural handshake...</div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
