import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const chars = "X01_#@$!%&*[]<>";

// Matrix Text morphing/scrambling component
export const MatrixText = ({ text, isHovered }) => {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (!isHovered) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [isHovered, text]);

  return <span className="font-mono">{displayText}</span>;
};

// Unified Cyber Button Component
export const CyberButton = ({ 
  children, 
  onClick, 
  className = "", 
  disabled = false,
  type = "button" 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative inline-block group">
      {/* Radiant Cyber-Cyan Backlight Aura blooming on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.12 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute -inset-2 bg-cyan-500/20 blur-xl rounded-2xl pointer-events-none -z-10"
        />
      )}

      {/* Spring compression bounce container */}
      <motion.button
        type={type}
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 450, damping: 14, mass: 0.1 }}
        className={`
          relative flex items-center justify-center font-mono font-bold text-xs uppercase tracking-widest outline-none select-none transition-all duration-300
          ${isHovered ? 'py-3.5 px-8 text-cyan-400 bg-cyan-950/20 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.25)]' : 'py-3.5 px-6 text-zinc-300 bg-[#09090b]/90 border-zinc-800/80'}
          border rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}
        `}
      >
        <MatrixText text={children} isHovered={isHovered} />
      </motion.button>
    </div>
  );
};

export default CyberButton;
