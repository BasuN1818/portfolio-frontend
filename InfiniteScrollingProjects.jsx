import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const projectsData = [
  {
    id: 'p1',
    name: 'E-Commerce Nexus',
    subtitle: 'High-performance headless storefront.',
    techStack: ['Next.js', 'Tailwind', 'Stripe'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    link: '#',
    backType: 'commerce',
    logs: [
      'POST /api/checkout - 200 OK',
      'Stripe session: active',
      'PaymentIntent verified',
      'Stock update: success',
      'Dispatched receipt to client'
    ]
  },
  {
    id: 'p2',
    name: 'Neural Analytics',
    subtitle: 'Real-time AI data visualization dashboard.',
    techStack: ['React', 'D3.js', 'Python'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    link: '#',
    backType: 'analytics',
    logs: [
      'Model initialized: PyTorch-v2',
      'Epoch 200/200: loss 0.012',
      'WebSocket stream connected',
      'Aggregating neural nodes...',
      'Plotting metrics: 120ms latency'
    ]
  },
  {
    id: 'p3',
    name: 'Vanguard OS',
    subtitle: 'Web-based operating system interface.',
    techStack: ['React', 'Framer', 'Firebase'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    link: '#',
    backType: 'os',
    logs: [
      'System booting...',
      'Mounting virtual_env/c/',
      'CPU: 12% | RAM: 512MB/16GB',
      'Display: 2560x1440 WebGL',
      'Vanguard kernel: stable'
    ]
  },
  {
    id: 'p4',
    name: 'Lumina Arch',
    subtitle: 'Architectural portfolio & 3D viewer.',
    techStack: ['Three.js', 'React', 'GSAP'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    link: '#',
    backType: 'three',
    logs: [
      'Initializing WebGL2 context',
      'Compiling Fragment Shader...',
      'Loaded mesh: architecture_3d',
      'Camera focal length set: 35mm',
      'Render loop: 60fps stable'
    ]
  },
  {
    id: 'p5',
    name: 'Cryptic Exchange',
    subtitle: 'Secure cryptocurrency trading platform.',
    techStack: ['Node.js', 'WebSockets', 'React'],
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=800&auto=format&fit=crop',
    link: '#',
    backType: 'crypto',
    logs: [
      'WebSocket listener loaded',
      'Subscribing: BTCUSDT@trade',
      'Orderbook bid/ask matching...',
      'Secure wallet handshake OK',
      'Broadcasting ledger update'
    ]
  }
];

const loopData = [...projectsData, ...projectsData];

const ProjectCardBack = ({ type, logs, techStack }) => {
  const [activeLogIdx, setActiveLogIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLogIdx((prev) => (prev + 1) % logs.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [logs]);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#070709] border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between overflow-hidden">
      {/* CSS-based Grid Lines in Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0" />

      {/* Purple Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[40px] pointer-events-none rounded-full z-0" />

      <div className="relative z-10 flex-1 flex flex-col justify-between h-full">
        {/* Terminal Header */}
        <div className="flex justify-between items-center pb-2 border-b border-zinc-800/80">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500/60" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <span className="w-2 h-2 rounded-full bg-green-500/60" />
          </div>
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">// LOGS ACTIVE</span>
        </div>

        {/* Live typing console or interactive viz */}
        <div className="my-4 flex-1 flex flex-col justify-center font-mono text-[10px] text-zinc-400 gap-1.5">
          {logs.map((log, idx) => (
            <div key={idx} className={`flex items-center gap-1.5 transition-opacity duration-300 ${idx === activeLogIdx ? 'text-cyan-400' : 'opacity-40'}`}>
              <span className="text-zinc-600 font-bold">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
          {type === 'analytics' && (
            <div className="mt-3 h-10 flex items-end justify-between gap-1 w-full px-2 border-t border-zinc-800/60 pt-2">
              {[60, 40, 80, 50, 90, 70, 50, 85].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-cyan-500/30 rounded-t-sm animate-pulse"
                  style={{ height: `${h}%`, animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          )}
          {type === 'crypto' && (
            <div className="mt-3 flex items-center justify-between text-[9px] border-t border-zinc-800/60 pt-2 text-zinc-500">
              <span>BTC: <strong className="text-green-400">$67,241.50</strong></span>
              <span>ETH: <strong className="text-purple-400">$3,422.80</strong></span>
            </div>
          )}
        </div>

        {/* Tech Stack Chips & Action Link */}
        <div className="pt-2 border-t border-zinc-800/80">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {techStack.map((tech) => (
              <span key={tech} className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/20 border border-purple-500/20 rounded-full">
                {tech}
              </span>
            ))}
          </div>
          <div className="w-full flex items-center justify-between text-xs text-white bg-zinc-900/60 hover:bg-cyan-500/20 border border-zinc-800 hover:border-cyan-500/30 py-2 px-4 rounded-xl transition-all duration-300">
            <span className="font-bold uppercase tracking-wider text-[10px]">Launch Console</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfiniteScrollingProjects = () => {
  const trackRef = useRef(null);
  const tweenRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    // Run scrolling tween loop using GSAP
    tweenRef.current = gsap.to(trackRef.current, {
      xPercent: -50,
      ease: 'none',
      duration: 35,
      repeat: -1,
    });

    return () => {
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, []);

  const handleMouseEnter = (id) => {
    setHoveredId(id);
    if (tweenRef.current) tweenRef.current.pause();
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    if (tweenRef.current) tweenRef.current.play();
  };

  return (
    <section className="relative w-full py-28 bg-[#000000] overflow-hidden font-sans border-t border-zinc-900 z-20">

      {/* Background radial soft cyan gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[200px] bg-cyan-900/10 blur-[120px] pointer-events-none rounded-full" />

      {/* 3D Flip Styles embedded natively */}
      <style>{`
        .project-card-container {
          perspective: 1200px;
        }
        .project-card-inner {
          transition: transform 0.75s cubic-bezier(0.2, 0.8, 0.2, 1);
          transform-style: preserve-3d;
        }
        .project-card-container:hover .project-card-inner {
          transform: rotateY(180deg);
        }
        .project-card-front, .project-card-back {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .project-card-back {
          transform: rotateY(180deg);
        }
      `}</style>

      {/* Section Header */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 mb-14">
        <span className="text-purple-400 font-mono tracking-widest text-xs uppercase block mb-3">
          // RECENT PRODUCTIONS
        </span>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase">
          <span style={{ color: '#22D3EE' }}>Projects</span>
        </h2>
      </div>

      {/* Infinite Horizontal Loop */}
      <div className="relative w-full overflow-hidden py-6">

        {/* Fading left/right bounds */}
        <div className="absolute top-0 left-0 w-20 md:w-40 h-full bg-gradient-to-r from-[#000000] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-20 md:w-40 h-full bg-gradient-to-l from-[#000000] to-transparent z-10 pointer-events-none" />

        <div
          ref={trackRef}
          className="flex gap-8 w-max px-6 md:px-10 will-change-transform"
          style={{ width: 'max-content' }}
        >
          {loopData.map((project, index) => {
            const isHovered = hoveredId === project.id;
            const isAnotherHovered = hoveredId !== null && hoveredId !== project.id;

            return (
              <div
                key={`${project.id}-${index}`}
                onMouseEnter={() => handleMouseEnter(project.id)}
                onMouseLeave={handleMouseLeave}
                className={`project-card-container relative flex-shrink-0 w-[260px] md:w-[340px] h-[340px] md:h-[420px] cursor-pointer transition-all duration-500 ${isHovered ? 'z-20 scale-[1.03]' : ''
                  } ${isAnotherHovered ? 'blur-[3px] opacity-40 scale-[0.98]' : 'opacity-100'}`}
              >
                <div className="project-card-inner w-full h-full relative">

                  {/* FRONT SIDE */}
                  <div className="project-card-front absolute inset-0 w-full h-full rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800/80">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 hover:scale-105"
                    />
                    {/* Shadow masking gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    {/* Card Label tag */}
                    <div className="absolute top-4 left-4 px-2.5 py-1 text-[8px] font-mono uppercase bg-zinc-900/80 border border-zinc-800 text-zinc-400 rounded-md">
                      Module // {project.id}
                    </div>

                    {/* Typography */}
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end">
                      <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase leading-none">
                        {project.name}
                      </h3>
                      <p className="text-xs text-zinc-400 font-medium mt-2 leading-relaxed line-clamp-2">
                        {project.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* BACK SIDE (3D Code Console) */}
                  <div className="project-card-back absolute inset-0 w-full h-full">
                    <ProjectCardBack
                      type={project.backType}
                      logs={project.logs}
                      techStack={project.techStack}
                    />
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InfiniteScrollingProjects;
