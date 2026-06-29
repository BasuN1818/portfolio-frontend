import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, trend, trendLabel, accentColor = '#6366f1', delay = 0, prefix = '', suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseInt(value, 10) || 0;

  useEffect(() => {
    const duration = 1200;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * numericValue));
      if (progress < 1) requestAnimationFrame(animate);
    };

    const timeout = setTimeout(() => requestAnimationFrame(animate), delay * 1000);
    return () => clearTimeout(timeout);
  }, [numericValue, delay]);

  const isPositive = trend > 0;
  const isNeutral = trend === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="relative group rounded-2xl overflow-hidden
        bg-gradient-to-br from-white/[0.06] to-white/[0.02]
        border border-white/[0.08]
        backdrop-blur-xl
        shadow-[0_4px_6px_rgba(0,0,0,0.07),0_10px_20px_rgba(0,0,0,0.06)]
        hover:shadow-[0_10px_25px_rgba(0,0,0,0.12),0_20px_48px_rgba(0,0,0,0.1)]
        transition-shadow duration-300
        p-6"
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-r-full"
        style={{ backgroundColor: accentColor, boxShadow: `0 0 12px ${accentColor}50` }}
      />

      {/* Background glow */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl"
        style={{ backgroundColor: `${accentColor}15` }}
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: `${accentColor}15`,
              boxShadow: `0 4px 12px ${accentColor}20`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: accentColor }} />
          </div>

          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
              {label}
            </p>
            <h3 className="text-3xl font-heading font-bold text-white tracking-tight">
              {prefix}{displayValue.toLocaleString()}{suffix}
            </h3>
          </div>
        </div>

        {/* Trend badge */}
        {!isNeutral && (
          <div className={`
            px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1
            ${isPositive
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }
          `}>
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      {trendLabel && (
        <p className="text-[11px] text-slate-500 mt-3 font-mono">
          {trendLabel}
        </p>
      )}
    </motion.div>
  );
};

export default StatCard;
