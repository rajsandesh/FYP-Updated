import React from 'react';
import { motion } from 'framer-motion';

const SilicaPanel = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      className={`silica-panel p-6 rounded-2xl relative overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {/* Ghost Glow Effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent opacity-50" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default SilicaPanel;
