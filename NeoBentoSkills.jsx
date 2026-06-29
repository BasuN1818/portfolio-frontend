import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

// --- Interactive 3D Bento Card with Radial Glow Tracker & Energy-Line Border Tracer ---
const BentoCard = ({ className = '', children, title, subtitle, glowColor = 'cyan', index }) => {
  const cardRef = useRef(null);
  
  // Framer Motion spring values for smooth tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 25 });
  
  const [isHovered, setIsHovered] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setGlowPos({ x: mouseX, y: mouseY });

    // Normalized coordinate (-0.5 to 0.5)
    const normX = (mouseX / rect.width) - 0.5;
    const normY = (mouseY / rect.height) - 0.5;
    x.set(normX);
    y.set(normY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Color mappings for glowing accents
  const glowColors = {
    cyan: 'rgba(6, 182, 212, 0.3)',
    magenta: 'rgba(236, 72, 153, 0.3)',
    purple: 'rgba(168, 85, 247, 0.3)',
    emerald: 'rgba(16, 185, 129, 0.3)',
    amber: 'rgba(245, 158, 11, 0.3)',
    blue: 'rgba(59, 130, 246, 0.3)',
    lime: 'rgba(132, 204, 22, 0.3)',
  };

  const borderStrokeColors = {
    cyan: '#00f0ff',
    magenta: '#ec4899',
    purple: '#a855f7',
    emerald: '#10b981',
    amber: '#f59e0b',
    blue: '#3b82f6',
    lime: '#84cc16',
  };

  const borderStrokeGradientId = `grad-${glowColor}-${index}`;

  // Framer motion variants for stagger-fade entrance
  const cardVariants = {
    hidden: { y: 55, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 75,
        damping: 18,
        mass: 0.9,
      }
    }
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className={`group relative rounded-3xl border border-zinc-800/80 bg-zinc-950/45 p-6 md:p-8 backdrop-blur-xl transition-all duration-500 hover:border-zinc-700/60 overflow-hidden flex flex-col justify-between ${className}`}
    >
      {/* Interactive Radial Lighting */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] w-64 h-64 transition-opacity duration-500 z-0"
          style={{
            left: `${glowPos.x}px`,
            top: `${glowPos.y}px`,
            background: `radial-gradient(circle, ${glowColors[glowColor]} 0%, transparent 70%)`
          }}
        />
      )}

      {/* SVG Energy-Line Border Tracer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl z-30">
        <defs>
          <linearGradient id={borderStrokeGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={borderStrokeColors[glowColor]} stopOpacity="1" />
            <stop offset="50%" stopColor={borderStrokeColors[glowColor]} stopOpacity="0.5" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="22"
          fill="none"
          stroke={`url(#${borderStrokeGradientId})`}
          strokeWidth="2"
          pathLength="100"
          strokeDasharray="25 75"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            animation: 'borderTrace 3s linear infinite',
          }}
        />
      </svg>

      {/* Internal Content (TranslateZ for 3D depth) */}
      <div className="relative z-10 flex flex-col h-full justify-between" style={{ transform: 'translateZ(20px)' }}>
        {/* Card Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
              // SYS.{title.replace(/[^a-zA-Z]/g, '').toUpperCase()}.ENGINE
            </span>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-colors">
              {title}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
          </div>
          
          <div className="px-2 py-0.5 rounded bg-zinc-900/60 border border-zinc-800/80 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            {glowColor}
          </div>
        </div>

        {/* Display Area for animation */}
        <div className="flex-1 flex items-center justify-center min-h-[140px] my-2 select-none">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

// --- Custom Animated Subcomponents for each skill ---

// 1. React: Rotating Atom with Glowing Orbits
const ReactAtom = () => {
  const [telemetry, setTelemetry] = useState({ renders: 12, state: 'STABLE', fps: 120 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry(prev => ({
        renders: prev.renders + Math.floor(Math.random() * 2),
        state: Math.random() > 0.98 ? 'REFRESHING' : 'STABLE',
        fps: 118 + Math.floor(Math.random() * 5)
      }));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center py-2">
      <div className="relative w-40 h-40 flex items-center justify-center scale-90">
        {/* Core Pulsating Nucleus */}
        <div className="absolute w-6 h-6 bg-cyan-400 rounded-full blur-[4px] animate-ping opacity-60" />
        <div className="absolute w-5 h-5 bg-cyan-300 rounded-full shadow-[0_0_12px_#22d3ee] z-10" />

        <svg className="absolute w-full h-full" viewBox="0 0 200 200">
          {/* Orbit 1 */}
          <g className="origin-center animate-[spin_10s_linear_infinite]">
            <ellipse cx="100" cy="100" rx="90" ry="25" fill="none" stroke="rgba(34, 211, 238, 0.25)" strokeWidth="1.5" />
            <circle cx="10" cy="100" r="3" fill="#22d3ee" className="shadow-[0_0_8px_#22d3ee]" />
          </g>
          {/* Orbit 2 */}
          <g className="origin-center rotate-[60deg]">
            <g className="origin-center animate-[spin_13s_linear_infinite_reverse]">
              <ellipse cx="100" cy="100" rx="90" ry="25" fill="none" stroke="rgba(34, 211, 238, 0.25)" strokeWidth="1.5" />
              <circle cx="10" cy="100" r="3" fill="#22d3ee" className="shadow-[0_0_8px_#22d3ee]" />
            </g>
          </g>
          {/* Orbit 3 */}
          <g className="origin-center rotate-[120deg]">
            <g className="origin-center animate-[spin_8s_linear_infinite]">
              <ellipse cx="100" cy="100" rx="90" ry="25" fill="none" stroke="rgba(34, 211, 238, 0.25)" strokeWidth="1.5" />
              <circle cx="10" cy="100" r="3" fill="#22d3ee" className="shadow-[0_0_8px_#22d3ee]" />
            </g>
          </g>
        </svg>
      </div>

      <div className="w-full flex justify-between items-center px-4 font-mono text-[10px] text-zinc-500">
        <span>FIBER_SYS: OK</span>
        <span>RENDERS: {telemetry.renders}</span>
        <span className={telemetry.state === 'REFRESHING' ? 'text-cyan-400' : ''}>STATE: {telemetry.state}</span>
        <span>{telemetry.fps} FPS</span>
      </div>
    </div>
  );
};

// 2. Node.js: Flowing data packets in pipes
const NodePipes = () => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between py-2 px-1">
      <div className="relative w-full h-32 bg-[#050507]/60 border border-zinc-900 rounded-2xl overflow-hidden p-2 flex items-center justify-center">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        <svg className="w-full h-full" viewBox="0 0 240 100" preserveAspectRatio="none">
          <defs>
            <filter id="glow-emerald">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Pipe Layout Guides */}
          <path id="npipe1" d="M 10 20 L 110 20 C 120 20, 120 80, 130 80 L 230 80" fill="none" stroke="rgba(24, 24, 27, 0.8)" strokeWidth="6" />
          <path d="M 10 20 L 110 20 C 120 20, 120 80, 130 80 L 230 80" fill="none" stroke="rgba(16, 185, 129, 0.12)" strokeWidth="2" />

          <path id="npipe2" d="M 10 50 L 230 50" fill="none" stroke="rgba(24, 24, 27, 0.8)" strokeWidth="6" />
          <path d="M 10 50 L 230 50" fill="none" stroke="rgba(16, 185, 129, 0.12)" strokeWidth="2" />

          <path id="npipe3" d="M 10 80 L 110 80 C 120 80, 120 20, 130 20 L 230 20" fill="none" stroke="rgba(24, 24, 27, 0.8)" strokeWidth="6" />
          <path d="M 10 80 L 110 80 C 120 80, 120 20, 130 20 L 230 20" fill="none" stroke="rgba(16, 185, 129, 0.12)" strokeWidth="2" />

          {/* Flowing packet nodes */}
          <circle r="3" fill="#10b981" filter="url(#glow-emerald)">
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M 10 20 L 110 20 C 120 20, 120 80, 130 80 L 230 80" />
          </circle>
          <circle r="3" fill="#10b981" filter="url(#glow-emerald)">
            <animateMotion dur="2s" repeatCount="indefinite" path="M 10 50 L 230 50" />
          </circle>
          <circle r="3" fill="#10b981" filter="url(#glow-emerald)">
            <animateMotion dur="3.5s" repeatCount="indefinite" path="M 10 80 L 110 80 C 120 80, 120 20, 130 20 L 230 20" />
          </circle>
          
          <circle r="3.5" fill="#34d399" filter="url(#glow-emerald)">
            <animateMotion dur="2.8s" begin="1.4s" repeatCount="indefinite" path="M 10 20 L 110 20 C 120 20, 120 80, 130 80 L 230 80" />
          </circle>
          <circle r="3.5" fill="#34d399" filter="url(#glow-emerald)">
            <animateMotion dur="2s" begin="0.8s" repeatCount="indefinite" path="M 10 50 L 230 50" />
          </circle>
        </svg>

        {/* Floating Code Console inside Node Card */}
        <div className="absolute bottom-2 left-3 font-mono text-[8px] text-emerald-500/80 bg-zinc-950/80 px-2 py-0.5 rounded border border-emerald-950/30">
          EVENT_LOOP: ACTIVE | V8: v12.16
        </div>
      </div>
      
      <div className="font-mono text-[9px] text-zinc-500 flex justify-between px-2">
        <span>[CLUSTER] FORK_OK</span>
        <span>THREAD_POOL: 4</span>
      </div>
    </div>
  );
};

// 3. Tailwind CSS: Responsive wireframe box model animator
const TailwindWireframe = () => {
  const [breakpoint, setBreakpoint] = useState('desktop');

  useEffect(() => {
    const cycle = ['desktop', 'tablet', 'mobile'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % cycle.length;
      setBreakpoint(cycle[idx]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const widthClasses = {
    desktop: 'w-[190px] h-[90px]',
    tablet: 'w-[140px] h-[90px]',
    mobile: 'w-[85px] h-[95px]',
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-1">
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Outer Device Mockup */}
        <motion.div
          animate={breakpoint}
          layout
          className={`border border-blue-500/30 bg-zinc-900/40 rounded-xl p-2 flex flex-col gap-1.5 transition-all duration-700 ${widthClasses[breakpoint]}`}
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-zinc-800 pb-1">
            <div className="w-10 h-2 bg-blue-500/20 rounded" />
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500/10 border border-blue-500/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500/10 border border-blue-500/30" />
            </div>
          </div>

          {/* Grid Layout that wraps based on width */}
          <div className="flex-1 grid grid-cols-3 gap-1">
            <div className="col-span-3 md:col-span-1 bg-zinc-800/40 border border-zinc-700/20 rounded p-1 flex flex-col gap-1">
              <div className="w-full h-2 bg-blue-500/20 rounded" />
              <div className="w-2/3 h-1.5 bg-zinc-700/20 rounded" />
            </div>
            
            <div className={`col-span-3 md:col-span-2 bg-zinc-800/40 border border-zinc-700/20 rounded p-1 flex flex-col gap-1.5 ${breakpoint === 'mobile' ? 'col-span-3' : breakpoint === 'tablet' ? 'col-span-2' : ''}`}>
              <div className="w-full h-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded" />
              <div className="grid grid-cols-2 gap-1">
                <div className="w-full h-2 bg-zinc-700/20 rounded" />
                <div className="w-full h-2 bg-zinc-700/20 rounded" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="w-full flex justify-between items-center px-2 font-mono text-[9px] text-zinc-500 mt-2">
        <span className="text-blue-400 font-bold">@media ({breakpoint === 'desktop' ? 'lg' : breakpoint === 'tablet' ? 'md' : 'sm'})</span>
        <span>FLEX / GRID ENGINE</span>
      </div>
    </div>
  );
};

// 4. Next.js: Server to Client Hydration sequence
const NextHydration = () => {
  const [stage, setStage] = useState(0); // 0: Idle, 1: Request, 2: SSR, 3: Hydrated

  useEffect(() => {
    const timer = setInterval(() => {
      setStage(prev => (prev + 1) % 4);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-1">
      <div className="flex-1 flex items-center justify-around px-2">
        {/* Server Node */}
        <div className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-xl bg-zinc-900 border flex items-center justify-center transition-all duration-500 ${stage === 1 || stage === 2 ? 'border-purple-500 bg-purple-950/20 shadow-[0_0_12px_rgba(168,85,247,0.3)]' : 'border-zinc-800'}`}>
            <svg className="w-6 h-6 text-zinc-400 group-hover:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span className="text-[8px] font-mono mt-1 text-zinc-500">SERVER (SSR)</span>
        </div>

        {/* Transfer pathway */}
        <div className="flex-1 h-0.5 relative mx-2 bg-zinc-800 overflow-hidden">
          {stage === 1 && (
            <motion.div
              initial={{ left: '0%' }}
              animate={{ left: '100%' }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="absolute top-0 w-4 h-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
            />
          )}
          {stage === 2 && (
            <motion.div
              initial={{ left: '100%' }}
              animate={{ left: '0%' }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="absolute top-0 w-6 h-full bg-purple-500 shadow-[0_0_8px_#a855f7]"
            />
          )}
        </div>

        {/* Client Node */}
        <div className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-xl bg-zinc-900 border flex items-center justify-center transition-all duration-500 ${stage === 3 ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_12px_rgba(6,182,212,0.3)]' : 'border-zinc-800'}`}>
            <svg className="w-6 h-6 text-zinc-400 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-[8px] font-mono mt-1 text-zinc-500">CLIENT (DOM)</span>
        </div>
      </div>

      <div className="font-mono text-[9px] text-center text-zinc-400 bg-zinc-900/40 py-1 rounded-lg border border-zinc-800/50 mx-2">
        {stage === 0 && <span className="text-zinc-500">// STAGE: IDLE</span>}
        {stage === 1 && <span className="text-cyan-400">STAGE: ROUTE GET / {'→'} CLIENT DISPATCH</span>}
        {stage === 2 && <span className="text-purple-400">STAGE: PRE-RENDERING HTML BUNDLE</span>}
        {stage === 3 && <span className="text-green-400">STAGE: HYDRATION COMPLETED (INTERACTIVE) ✓</span>}
      </div>
    </div>
  );
};

// 5. MySQL: Database index search and rows fetch animation
const MySQLScan = () => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [status, setStatus] = useState('IDLE');

  useEffect(() => {
    let row = 0;
    const interval = setInterval(() => {
      setStatus('SCANNING');
      const scanTimer = setInterval(() => {
        setActiveIndex(row);
        row++;
        if (row > 3) {
          clearInterval(scanTimer);
          setActiveIndex(2); // Match found row
          setStatus('MATCHED');
          setTimeout(() => {
            row = 0;
            setActiveIndex(-1);
            setStatus('IDLE');
          }, 1200);
        }
      }, 300);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-1">
      <div className="flex-1 flex gap-4 px-2 items-center justify-center">
        {/* Table representation */}
        <div className="bg-[#07070a] border border-zinc-800 rounded-lg p-2 flex-1 font-mono text-[8px] text-zinc-400">
          <div className="border-b border-zinc-800 pb-1 mb-1 font-bold text-amber-500 flex justify-between">
            <span>TABLE: USERS</span>
            <span>ID_PRIMARY</span>
          </div>
          <div className="flex flex-col gap-1">
            {[
              { id: '0x0A', name: 'admin' },
              { id: '0x0B', name: 'moderator' },
              { id: '0x0C', name: 'basu_dev' }, // Match target
              { id: '0x0D', name: 'guest_user' }
            ].map((user, idx) => (
              <div
                key={idx}
                className={`flex justify-between px-1 py-0.5 rounded transition-colors duration-200 ${
                  activeIndex === idx
                    ? status === 'MATCHED'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'bg-zinc-800/80 text-white'
                    : ''
                }`}
              >
                <span>{user.id}</span>
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Index schematic */}
        <div className="flex flex-col gap-2 font-mono text-[8px] text-zinc-500">
          <div className="border border-zinc-800 rounded p-1 bg-zinc-900/30">
            <span className="text-amber-500 block font-bold">B-TREE INDEX</span>
            <span>root -&gt; leaf_node</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${status === 'SCANNING' ? 'bg-amber-500 animate-ping' : status === 'MATCHED' ? 'bg-green-500' : 'bg-zinc-700'}`} />
            <span>{status}</span>
          </div>
        </div>
      </div>

      <div className="font-mono text-[9px] text-zinc-500 flex justify-between px-2">
        <span>QUERY: JOIN ON PK</span>
        <span className="text-amber-500/90 font-bold">LATENCY: 0.24ms</span>
      </div>
    </div>
  );
};

// 6. Express.js: Request / response route pipeline
const ExpressRouter = () => {
  const [activeStep, setActiveStep] = useState(-1);
  const [responseCode, setResponseCode] = useState('');

  useEffect(() => {
    const cycle = async () => {
      while (true) {
        // Step 1: CORS
        setActiveStep(0);
        await new Promise(resolve => setTimeout(resolve, 400));
        // Step 2: Auth
        setActiveStep(1);
        await new Promise(resolve => setTimeout(resolve, 500));
        // Step 3: Validator
        setActiveStep(2);
        await new Promise(resolve => setTimeout(resolve, 400));
        // Step 4: Controller
        setActiveStep(3);
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Response
        setActiveStep(4);
        setResponseCode(Math.random() > 0.15 ? '200 OK' : '401 UNAUTHORIZED');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Reset
        setActiveStep(-1);
        setResponseCode('');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    };
    cycle();
  }, []);

  const steps = ['CORS', 'JWT_AUTH', 'VALIDATE', 'HANDLER'];

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-1">
      <div className="flex-1 flex flex-col justify-center items-center gap-3">
        {/* Middleware Flow Pipeline */}
        <div className="flex items-center justify-between w-full px-2">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className={`px-2 py-1 rounded text-[8px] font-mono border transition-all duration-300 ${
                activeStep === idx
                  ? 'border-pink-500 bg-pink-950/20 text-white shadow-[0_0_8px_rgba(236,72,153,0.3)] font-bold'
                  : 'border-zinc-800 bg-zinc-900/30 text-zinc-500'
              }`}>
                {step}
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-[1px] ${activeStep > idx ? 'bg-pink-500' : 'bg-zinc-800'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Live Terminal Log */}
        <div className="w-[90%] bg-zinc-950/80 border border-zinc-900 rounded px-3 py-1.5 font-mono text-[9px] min-h-[28px] flex items-center justify-between">
          <span className="text-zinc-500">POST /api/v1/auth/session</span>
          {activeStep === 4 ? (
            <span className={`font-bold ${responseCode === '200 OK' ? 'text-green-400' : 'text-red-400'}`}>
              {responseCode}
            </span>
          ) : activeStep >= 0 ? (
            <span className="text-pink-400 animate-pulse">PROCESSING...</span>
          ) : (
            <span className="text-zinc-700">AWAITING REQUEST</span>
          )}
        </div>
      </div>

      <div className="font-mono text-[9px] text-zinc-500 flex justify-between px-2">
        <span>EXPRESS_GATEWAY</span>
        <span>PING: 8ms</span>
      </div>
    </div>
  );
};

// 7. TypeScript: Code typechecker scanner simulation
const TypeScriptChecker = () => {
  const [scanning, setScanning] = useState(true);
  const [success, setSuccess] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanning(true);
      setTimeout(() => {
        setScanning(false);
        setSuccess(Math.random() > 0.05);
      }, 2000);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-1">
      <div className="flex-1 bg-zinc-950/70 border border-zinc-900 rounded-xl p-3 relative overflow-hidden flex flex-col justify-between min-h-[110px]">
        {/* Code snippet */}
        <div className="font-mono text-[8px] text-blue-400 leading-normal">
          <span className="text-purple-400">type</span> <span className="text-yellow-300">Payload&lt;T&gt;</span> = &#123;<br />
          &nbsp;&nbsp;status: <span className="text-green-300">"success"</span> | <span className="text-red-300">"error"</span>;<br />
          &nbsp;&nbsp;data: T;<br />
          &nbsp;&nbsp;timestamp: <span className="text-blue-300">number</span>;<br />
          &#125;;
        </div>

        {/* Laser scanner line */}
        {scanning && (
          <motion.div
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-[1.5px] bg-blue-400/80 shadow-[0_0_8px_#3b82f6] pointer-events-none"
          />
        )}

        {/* Checker Telemetry Console */}
        <div className="border-t border-zinc-900 pt-1.5 mt-2 flex justify-between items-center font-mono text-[8px]">
          <div className="flex flex-col text-zinc-500">
            <span>$ tsc --noEmit</span>
            {scanning ? (
              <span className="text-blue-400 animate-pulse">Running static analyzer...</span>
            ) : success ? (
              <span className="text-green-400">Diagnostics: 0 Errors (OK)</span>
            ) : (
              <span className="text-red-400">Compile Error: TS2322</span>
            )}
          </div>
          
          <div className="flex items-center">
            {scanning ? (
              <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : success ? (
              <span className="text-green-400 font-bold bg-green-500/10 border border-green-500/30 px-1.5 py-0.5 rounded">PASSED</span>
            ) : (
              <span className="text-red-400 font-bold bg-red-500/10 border border-red-500/30 px-1.5 py-0.5 rounded">FAILED</span>
            )}
          </div>
        </div>
      </div>

      <div className="font-mono text-[9px] text-zinc-500 flex justify-between px-2 mt-1">
        <span>STATIC TYPE CHECKER</span>
        <span>strictNullChecks: true</span>
      </div>
    </div>
  );
};

// 8. Three.js: Rotating 3D wireframe polyhedron Canvas 2D
const ThreeCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Define 3D vertices of an octahedron
    const vertices = [
      { x: 0, y: 1.5, z: 0 },
      { x: 0, y: -1.5, z: 0 },
      { x: 1.2, y: 0, z: 1.2 },
      { x: -1.2, y: 0, z: 1.2 },
      { x: 1.2, y: 0, z: -1.2 },
      { x: -1.2, y: 0, z: -1.2 }
    ];

    // Define indices forming edges of the octahedron
    const edges = [
      [0, 2], [0, 3], [0, 4], [0, 5], // Top pyramid edges
      [1, 2], [1, 3], [1, 4], [1, 5], // Bottom pyramid edges
      [2, 3], [3, 5], [5, 4], [4, 2]  // Middle square ring
    ];

    let angleX = 0.006;
    let angleY = 0.009;
    let angleZ = 0.004;

    const rotateX = (point, rad) => {
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const y = point.y * cos - point.z * sin;
      const z = point.y * sin + point.z * cos;
      return { ...point, y, z };
    };

    const rotateY = (point, rad) => {
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const x = point.x * cos + point.z * sin;
      const z = -point.x * sin + point.z * cos;
      return { ...point, x, z };
    };

    const rotateZ = (point, rad) => {
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const x = point.x * cos - point.y * sin;
      const y = point.x * sin + point.y * cos;
      return { ...point, x, y };
    };

    let curRotationX = 0;
    let curRotationY = 0;
    let curRotationZ = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const scale = 36;
      const fov = 180;

      curRotationX += angleX;
      curRotationY += angleY;
      curRotationZ += angleZ;

      // Project vertices to 2D
      const projected = vertices.map(v => {
        let r = rotateX(v, curRotationX);
        r = rotateY(r, curRotationY);
        r = rotateZ(r, curRotationZ);

        // Perspective projection formula
        const perspective = fov / (fov + r.z);
        return {
          x: cx + r.x * scale * perspective,
          y: cy + r.y * scale * perspective,
          z: r.z
        };
      });

      // Draw Edges
      ctx.lineWidth = 1.5;
      edges.forEach(edge => {
        const p1 = projected[edge[0]];
        const p2 = projected[edge[1]];
        
        // Depth-based color shading (closer is brighter neon pink, further is darker purple)
        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.2, Math.min(1, (1.5 - avgZ) / 3));
        
        ctx.strokeStyle = `rgba(236, 72, 153, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Draw Nodes
      projected.forEach(p => {
        const dotSize = 4 * (fov / (fov + p.z));
        ctx.fillStyle = '#ec4899';
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, dotSize > 0 ? dotSize : 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-1">
      <div className="flex-1 flex justify-center items-center">
        <canvas ref={canvasRef} width="160" height="110" className="opacity-90 filter drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]" />
      </div>
      <div className="font-mono text-[9px] text-zinc-500 flex justify-between px-2 mt-1">
        <span>RENDERER: WEBGL3D_OCTA</span>
        <span>GL_POLYGONS: 8</span>
      </div>
    </div>
  );
};

// 9. GSAP: Easing bezier curve animation with speed graphs
const GSAPEasing = () => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between py-1">
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <div className="relative w-44 h-20 bg-[#050507]/60 border border-zinc-900 rounded-lg overflow-hidden flex items-center justify-center p-2">
          {/* Easing Graph Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(132,204,22,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(132,204,22,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
          
          <svg className="w-full h-full" viewBox="0 0 160 80">
            {/* The Easing Curve Line */}
            <path
              d="M 15 65 C 50 65, 70 15, 145 15"
              fill="none"
              stroke="rgba(132, 204, 22, 0.25)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <path
              d="M 15 65 C 50 65, 70 15, 145 15"
              fill="none"
              stroke="#84cc16"
              strokeWidth="1.5"
            />

            {/* Glowing slide node */}
            <circle r="4.5" fill="#a3e635" filter="drop-shadow(0 0 4px #84cc16)">
              <animateMotion
                dur="2.5s"
                repeatCount="indefinite"
                path="M 15 65 C 50 65, 70 15, 145 15"
                keyTimes="0; 0.1; 0.5; 0.9; 1"
                calcMode="spline"
                keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1"
              />
            </circle>
          </svg>
          
          <span className="absolute top-1 left-2 font-mono text-[7px] text-zinc-500">EASE: customEase.inOut</span>
        </div>

        {/* Speed graphs indicators */}
        <div className="flex gap-2 w-[90%] justify-between items-center text-[7px] font-mono text-zinc-500">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
            <span>ACCEL: 2.4m/s²</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>DECEL: 4.8m/s²</span>
          </div>
        </div>
      </div>

      <div className="font-mono text-[9px] text-zinc-500 flex justify-between px-2">
        <span>GSAP.TICKER: 120Hz</span>
        <span>EASE: CUSTOM_BEZIER</span>
      </div>
    </div>
  );
};

// 10. Figma: Vector pen cursor drawing path anchors
const FigmaVector = () => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between py-1">
      <div className="flex-1 flex justify-center items-center">
        <div className="relative w-44 h-24 bg-[#050507]/40 border border-zinc-900/60 rounded-xl overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 170 90">
            {/* Base grid points */}
            <pattern id="dotpattern" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.7" fill="rgba(236, 72, 153, 0.15)" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dotpattern)" />

            {/* Bezier drawing trace path */}
            <path
              id="figmapath"
              d="M 20 60 C 50 10, 110 80, 150 30"
              fill="none"
              stroke="#ec4899"
              strokeWidth="1.5"
              strokeDasharray="400"
              strokeDashoffset="400"
              className="animate-[drawCurve_6s_ease-in-out_infinite]"
            />
            
            {/* Anchor point markers */}
            <rect x="18" y="58" width="4" height="4" fill="#00f0ff" stroke="#ec4899" strokeWidth="1" />
            <rect x="148" y="28" width="4" height="4" fill="#00f0ff" stroke="#ec4899" strokeWidth="1" />
            
            {/* Draw handle lines at mid-points */}
            <line x1="80" y1="45" x2="65" y2="20" stroke="rgba(0,240,255,0.4)" strokeWidth="0.8" />
            <circle cx="65" cy="20" r="2" fill="#00f0ff" />
            <line x1="80" y1="45" x2="95" y2="70" stroke="rgba(0,240,255,0.4)" strokeWidth="0.8" />
            <circle cx="95" cy="70" r="2" fill="#00f0ff" />
            <rect x="78" y="43" width="4" height="4" fill="#ffffff" stroke="#00f0ff" strokeWidth="1" />

            {/* Interactive Pen tool cursor following path */}
            <g>
              <animateMotion
                dur="6s"
                repeatCount="indefinite"
                path="M 20 60 C 50 10, 110 80, 150 30"
              />
              {/* Pen Vector Icon */}
              <path
                d="M 0 0 L 3 -10 L 8 -12 L 11 -8 L 8 -3 L 13 4 L 14 7 L 11 8 Z"
                fill="#ffffff"
                stroke="#18181b"
                strokeWidth="1"
                transform="rotate(-40) translate(-3, -12)"
              />
              <circle cx="0" cy="0" r="1.5" fill="#00f0ff" />
            </g>
          </svg>
        </div>
      </div>

      <div className="font-mono text-[9px] text-zinc-500 flex justify-between px-2">
        <span>TOOL: VECTOR_PEN</span>
        <span>CURVES: BEZIER</span>
      </div>
    </div>
  );
};

// 11. Workspace Arsenal: Badge collection with hover neon flashes
const ArsenalBadges = () => {
  const tools = [
    { name: 'Git', style: 'border-red-500/20 text-red-400 bg-red-950/10 hover:shadow-[0_0_10px_rgba(239,68,68,0.2)]' },
    { name: 'GitHub', style: 'border-zinc-700 text-zinc-200 bg-zinc-900/40 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]' },
    { name: 'VS Code', style: 'border-blue-500/20 text-blue-400 bg-blue-950/10 hover:shadow-[0_0_10px_rgba(59,130,246,0.2)]' },
    { name: 'Postman', style: 'border-orange-500/20 text-orange-400 bg-orange-950/10 hover:shadow-[0_0_10px_rgba(249,115,22,0.2)]' },
    { name: 'Vite', style: 'border-purple-500/20 text-purple-400 bg-purple-950/10 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)]' },
    { name: 'Docker', style: 'border-cyan-500/20 text-cyan-400 bg-cyan-950/10 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]' }
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-1">
      <div className="flex-1 flex flex-wrap gap-2 justify-center items-center px-1">
        {tools.map((t, idx) => (
          <span
            key={idx}
            className={`px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-wider uppercase transition-all duration-300 select-none ${t.style}`}
          >
            {t.name}
          </span>
        ))}
      </div>
      <div className="font-mono text-[9px] text-zinc-500 flex justify-between px-2">
        <span>SYS.DEV_TOOLS</span>
        <span>WORKSPACE: READY</span>
      </div>
    </div>
  );
};


// --- Main NeoBentoSkills Component ---
const NeoBentoSkills = () => {
  // Container variant for staggering cards viewport scroll animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  return (
    <section className="relative w-full py-32 bg-[#000000] overflow-hidden flex flex-col items-center">
      {/* CSS stylesheet block for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes borderTrace {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes drawCurve {
          0%, 100% {
            stroke-dashoffset: 400;
          }
          45%, 55% {
            stroke-dashoffset: 0;
          }
        }
      `}} />

      {/* Decorative futuristic grids and localized neon gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.03),transparent_70%)] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/5 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-40 left-10 w-96 h-96 bg-pink-500/3 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8 z-10">
        
        {/* Section Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-cyan-400 font-mono tracking-widest text-xs uppercase block mb-3 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
              // TELEMETRY & SYSTEM CAPABILITIES
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white">
              <span style={{ color: '#22D3EE' }}>Skills</span>
            </h2>
          </div>
          <p className="text-zinc-400 max-w-md text-sm md:text-base leading-relaxed">
            Hover over modules to experience spring-based 3D tilts, cursor tracking neon lighting, and high-tech SVG telemetry.
          </p>
        </div>

        {/* Bento Grid layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto"
        >
          
          {/* Card 1: React.js (Col-span 2) */}
          <BentoCard
            title="React.js"
            subtitle="Holographic UI Architecture"
            glowColor="cyan"
            index={1}
            className="md:col-span-2 md:row-span-2 min-h-[300px]"
          >
            <ReactAtom />
          </BentoCard>

          {/* Card 2: Node.js (Col-span 1, Row-span 2) */}
          <BentoCard
            title="Node.js"
            subtitle="Asynchronous Backplane"
            glowColor="emerald"
            index={2}
            className="md:col-span-1 md:row-span-2 min-h-[300px]"
          >
            <NodePipes />
          </BentoCard>

          {/* Card 3: Next.js (Col-span 1) */}
          <BentoCard
            title="Next.js"
            subtitle="Production Meta-Framework"
            glowColor="purple"
            index={3}
            className="md:col-span-1"
          >
            <NextHydration />
          </BentoCard>

          {/* Card 4: Tailwind CSS (Col-span 1) */}
          <BentoCard
            title="Tailwind CSS"
            subtitle="Fluid Box Layout Engine"
            glowColor="blue"
            index={4}
            className="md:col-span-1"
          >
            <TailwindWireframe />
          </BentoCard>

          {/* Card 5: TypeScript (Col-span 1) */}
          <BentoCard
            title="TypeScript"
            subtitle="Type-Safe Code Compiler"
            glowColor="blue"
            index={5}
            className="md:col-span-1"
          >
            <TypeScriptChecker />
          </BentoCard>

          {/* Card 6: MySQL (Col-span 1) */}
          <BentoCard
            title="MySQL"
            subtitle="Relational Schema Pool"
            glowColor="amber"
            index={6}
            className="md:col-span-1"
          >
            <MySQLScan />
          </BentoCard>

          {/* Card 7: Express.js (Col-span 1) */}
          <BentoCard
            title="Express.js"
            subtitle="REST API Pipeline Gateway"
            glowColor="magenta"
            index={7}
            className="md:col-span-1"
          >
            <ExpressRouter />
          </BentoCard>

          {/* Card 8: Three.js (Col-span 1) */}
          <BentoCard
            title="Three.js"
            subtitle="WebGL Vector Projection"
            glowColor="magenta"
            index={8}
            className="md:col-span-1"
          >
            <ThreeCanvas />
          </BentoCard>

          {/* Card 9: GSAP (Col-span 1) */}
          <BentoCard
            title="GSAP"
            subtitle="Kinetic Motion Scheduler"
            glowColor="lime"
            index={9}
            className="md:col-span-1"
          >
            <GSAPEasing />
          </BentoCard>

          {/* Card 10: Figma (Col-span 1) */}
          <BentoCard
            title="Figma"
            subtitle="Vector UI/UX Canvas editor"
            glowColor="magenta"
            index={10}
            className="md:col-span-1"
          >
            <FigmaVector />
          </BentoCard>

          {/* Card 11: Arsenal (Col-span 1) */}
          <BentoCard
            title="Workspace"
            subtitle="Integrated Developer Toolkit"
            glowColor="purple"
            index={11}
            className="md:col-span-1"
          >
            <ArsenalBadges />
          </BentoCard>

        </motion.div>
      </div>
    </section>
  );
};

export default NeoBentoSkills;
