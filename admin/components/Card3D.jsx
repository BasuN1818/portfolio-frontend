import React from 'react';
import { motion } from 'framer-motion';

const Card3D = ({
  children,
  className = '',
  hoverable = true,
  glowColor = null,
  padding = true,
  onClick = null,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hoverable ? {
        y: -4,
        transition: { duration: 0.2, ease: 'easeOut' }
      } : {}}
      onClick={onClick}
      className={`
        relative rounded-2xl
        bg-white/[0.03] dark:bg-white/[0.03]
        bg-gradient-to-br from-white/[0.07] to-transparent
        border border-white/[0.08]
        shadow-[0_4px_6px_rgba(0,0,0,0.07),0_10px_20px_rgba(0,0,0,0.06)]
        hover:shadow-[0_10px_25px_rgba(0,0,0,0.1),0_20px_48px_rgba(0,0,0,0.08)]
        backdrop-blur-xl
        transition-shadow duration-300 ease-out
        ${padding ? 'p-6' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={glowColor ? {
        boxShadow: `0 4px 6px rgba(0,0,0,0.07), 0 10px 20px rgba(0,0,0,0.06), 0 0 30px ${glowColor}15`,
      } : {}}
    >
      {/* Inner glow line at top */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {children}
    </motion.div>
  );
};

export default Card3D;
