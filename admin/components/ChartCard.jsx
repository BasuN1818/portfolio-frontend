import React from 'react';
import { motion } from 'framer-motion';

const ChartCard = ({ title, subtitle, children, delay = 0, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`
        relative rounded-2xl overflow-hidden
        bg-gradient-to-br from-white/[0.06] to-white/[0.02]
        border border-white/[0.08]
        backdrop-blur-xl
        shadow-[0_4px_6px_rgba(0,0,0,0.07),0_10px_20px_rgba(0,0,0,0.06)]
        p-6
        ${className}
      `}
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mb-5">
        <h3 className="font-heading font-semibold text-white text-base">{title}</h3>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-0.5 font-mono">{subtitle}</p>
        )}
      </div>

      <div className="relative">
        {children}
      </div>
    </motion.div>
  );
};

export default ChartCard;
