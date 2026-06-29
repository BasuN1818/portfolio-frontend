import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Interactive 3D Bento Card with Radial Glow Tracker ---
const BentoCard = ({ className = '', children, title, icon, glowColor = 'cyan' }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(0);
  const [glowY, setGlowY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    
    // Position of the mouse relative to the card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setGlowX(x);
    setGlowY(y);

    // Compute normalized coordinates: -0.5 to 0.5
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    // Apply tilt limit
    setRotateX(-normY * 12);
    setRotateY(normX * 12);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const glowColors = {
    cyan: 'rgba(6, 182, 212, 0.16)',
    purple: 'rgba(168, 85, 247, 0.16)',
    blue: 'rgba(59, 130, 246, 0.16)',
    amber: 'rgba(245, 158, 11, 0.16)',
    green: 'rgba(16, 185, 129, 0.16)',
  };

  const borderGlows = {
    cyan: 'rgba(6, 182, 212, 0.35)',
    purple: 'rgba(168, 85, 247, 0.35)',
    blue: 'rgba(59, 130, 246, 0.35)',
    amber: 'rgba(245, 158, 11, 0.35)',
    green: 'rgba(16, 185, 129, 0.35)',
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
        transformPerspective: 1000
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 220, mass: 0.4 }}
      className={`relative rounded-3xl overflow-hidden glass-panel-heavy border border-zinc-800/80 p-6 md:p-8 flex flex-col justify-between transition-shadow duration-300 select-none ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Radial Glow overlay */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(350px circle at ${glowX}px ${glowY}px, ${glowColors[glowColor]}, transparent 80%)`
          }}
        />
      )}

      {/* Dynamic Inner Glow Border */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none border border-transparent transition-all duration-300"
          style={{
            boxShadow: `inset 0 0 15px ${borderGlows[glowColor]}`
          }}
        />
      )}

      <div className="relative z-10 flex flex-col h-full justify-between" style={{ transform: 'translateZ(15px)' }}>
        {/* Header containing title and icon */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-zinc-500 font-mono text-[10px] tracking-wider block mb-1 uppercase">
              // {glowColor} card module
            </span>
            <h3 className="text-xl font-bold uppercase tracking-tight text-white">{title}</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300">
            {icon}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-center">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

// --- Terminal Simulator with Live typing logs ---
const TerminalConsole = () => {
  const [logs, setLogs] = useState([]);

  const commandLogs = [
    'npm run build:portfolio',
    'vite v5.2.0 building for production...',
    '✓ 352 modules transformed.',
    'dist/index.html                  0.85 kB │ gzip:   0.42 kB',
    'dist/assets/index-D7h5_48a.css  28.42 kB │ gzip:   8.12 kB',
    'dist/assets/index-A4v9_2bz.js  142.15 kB │ gzip:  46.85 kB',
    '✓ built in 1.45s',
    'initializing Three.js custom shaders...',
    'checking local JSON storage...',
    'ready on port 5000 | storage: JSON files',
    'mounting lenis smooth scroll listener...',
    'rendering high-fidelity 3D bento grids...',
    'optimizing canvas: target 120 FPS'
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setLogs((prev) => {
        const nextLogs = [...prev, commandLogs[index]];
        if (nextLogs.length > 5) {
          nextLogs.shift();
        }
        return nextLogs;
      });
      index = (index + 1) % commandLogs.length;
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#050507]/90 border border-zinc-800/80 rounded-2xl p-4 font-mono text-xs text-green-400/90 shadow-inner flex-1 flex flex-col justify-between min-h-[160px]">
      <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-zinc-800/60">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        <span className="text-[10px] text-zinc-500 ml-2">bash - portfolio-terminal</span>
      </div>
      <div className="flex-1 flex flex-col justify-end gap-1.5 overflow-hidden">
        {logs.map((log, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <span className="text-zinc-600 font-bold select-none">&gt;</span>
            <span className={idx === logs.length - 1 ? 'animate-pulse text-white' : ''}>{log}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Custom SVGs for Visual density ---
const TerminalIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const DatabaseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const HammerIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// --- Main Bento Grid Component ---
const SkillsCommandCenter = () => {
  return (
    <section className="relative w-full py-28 bg-[#000000] overflow-hidden flex flex-col items-center">
      {/* Visual Ambient Grid and Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[70%] h-[50%] bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.04),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8 z-10">
        
        {/* Section Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div data-aos="fade-right">
            <span className="text-cyan-400 font-mono tracking-widest text-xs uppercase block mb-3">
              // TECH STATS & CORE ENGINE
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white">
              Skills <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-500">Command Center</span>
            </h2>
          </div>
          <p className="text-zinc-400 max-w-md text-sm md:text-base leading-relaxed" data-aos="fade-left">
            An ultra-premium, interactive 3D Bento Grid. Move your mouse over each module to experience real-time perspective tilt and reactive radial glows.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] md:auto-rows-[220px]">
          
          {/* Card 1: Frontend (Col-span-2, Row-span-2) */}
          <BentoCard
            title="Frontend Engineering"
            icon={<CodeIcon />}
            glowColor="cyan"
            className="md:col-span-2 md:row-span-2 flex flex-col justify-between"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-full py-2">
              {[
                { name: 'React JS', level: 'Expert', desc: 'Hooks, Suspense, Fiber' },
                { name: 'JavaScript', level: 'Advanced', desc: 'ESNext, Async/Await' },
                { name: 'Tailwind CSS', level: 'Expert', desc: 'Flexbox, Custom Themes' },
                { name: 'Next JS', level: 'Advanced', desc: 'SSR, App Router' },
                { name: 'HTML & CSS', level: 'Expert', desc: 'Semantics, Flex/Grid' },
                { name: 'Framer Motion', level: 'Advanced', desc: '3D Tilt, GSAP physics' }
              ].map((skill, idx) => (
                <div key={idx} className="group/item bg-[#0a0a0d]/90 border border-zinc-800/50 p-4 rounded-2xl flex flex-col justify-between transition-all hover:border-cyan-500/40 hover:bg-[#0c0f16]">
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover/item:text-cyan-400 transition-colors uppercase tracking-tight">
                      {skill.name}
                    </h4>
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      {skill.desc}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      {skill.level}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Card 2: Backend Ecosystem (Col-span-1, Row-span-2) */}
          <BentoCard
            title="Backend Engine"
            icon={<DatabaseIcon />}
            glowColor="purple"
            className="md:col-span-1 md:row-span-2 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-4 py-2 h-full justify-between">
              {[
                { name: 'Node.js', percent: 80, color: 'from-purple-500 to-blue-500' },
                { name: 'Express.js', percent: 80, color: 'from-blue-500 to-cyan-500' },
                { name: 'MySQL Database', percent: 85, color: 'from-indigo-500 to-purple-500' }
              ].map((db, idx) => (
                <div key={idx} className="bg-[#0c0a0f]/80 border border-zinc-800/40 p-4 rounded-2xl hover:border-purple-500/30 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-zinc-300 uppercase">{db.name}</span>
                    <span className="text-xs font-mono text-purple-400 font-bold">{db.percent}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${db.color} rounded-full`}
                      style={{ width: `${db.percent}%` }}
                    />
                  </div>
                </div>
              ))}
              
              <div className="bg-[#050507] border border-zinc-800/50 p-3.5 rounded-xl font-mono text-[10px] text-zinc-500 leading-normal flex-1 flex flex-col justify-center">
                <span className="text-purple-400 font-bold">// Storage Config:</span>
                <span>contacts.json -&gt; active: true</span>
                <span>File schema status: verified</span>
                <span>DB status: JSON file storage active</span>
              </div>
            </div>
          </BentoCard>

          {/* Card 3: Live terminal console (Col-span-2, Row-span-1) */}
          <BentoCard
            title="System Terminal Console"
            icon={<TerminalIcon />}
            glowColor="green"
            className="md:col-span-2 md:row-span-1"
          >
            <TerminalConsole />
          </BentoCard>

          {/* Card 4: Tools & Workspace (Col-span-1, Row-span-1) */}
          <BentoCard
            title="Workspace Arsenal"
            icon={<HammerIcon />}
            glowColor="amber"
            className="md:col-span-1 md:row-span-1"
          >
            <div className="flex flex-wrap gap-2.5 py-1 justify-center items-center">
              {[
                { name: 'Git', bg: 'bg-red-500/10 border-red-500/20 text-red-400' },
                { name: 'GitHub', bg: 'bg-white/10 border-white/20 text-white' },
                { name: 'VS Code', bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
                { name: 'Figma', bg: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
                { name: 'NPM & Node', bg: 'bg-green-500/10 border-green-500/20 text-green-400' }
              ].map((tool, idx) => (
                <span key={idx} className={`px-3 py-1.5 rounded-full border text-xs font-bold tracking-tight uppercase ${tool.bg}`}>
                  {tool.name}
                </span>
              ))}
            </div>
          </BentoCard>

          {/* Card 5: Certifications & System Stats (Col-span-2, Row-span-1) */}
          <BentoCard
            title="Development Metrics & Operations"
            icon={<ShieldIcon />}
            glowColor="blue"
            className="md:col-span-2 md:row-span-1"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full py-2">
              {[
                { label: 'COFFEE INTAKE', val: 'Infinite', sub: 'Single Origin' },
                { label: 'TOTAL PROJECTS', val: '15+', sub: 'Interactive Web' },
                { label: 'STATUS', val: 'Active', sub: 'Open to Work' },
                { label: 'LOCATION', val: 'Remote', sub: 'GMT+5:30' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-[#090b10] border border-zinc-800/40 p-4 rounded-2xl text-center flex flex-col justify-center items-center hover:border-blue-500/20">
                  <span className="text-[9px] font-mono text-zinc-500 tracking-wider block mb-1">
                    {stat.label}
                  </span>
                  <span className="text-2xl font-black text-white tracking-tight">
                    {stat.val}
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-1 block">
                    {stat.sub}
                  </span>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Card 6: Dynamic availability pulse (Col-span-1, Row-span-1) */}
          <BentoCard
            title="Availability Engine"
            icon={
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            }
            glowColor="cyan"
            className="md:col-span-1 md:row-span-1 flex flex-col justify-between"
          >
            <div className="text-center p-3">
              <span className="text-3xl font-black text-cyan-400 tracking-tighter uppercase block">
                HIRE ME
              </span>
              <p className="text-zinc-500 text-xs mt-2 leading-relaxed uppercase">
                Currently taking projects & full-time opportunities.
              </p>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
};

export default SkillsCommandCenter;
