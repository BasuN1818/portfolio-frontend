import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Futuristic3DButton, DownloadResumeButton } from './FuturisticButton';
import resumePdf from './Basanagoud_Naduvinamani_Resume-v2.pdf';
// --- SVG Icon Components ---
const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

// --- Typing Animation Component ---
const TypingSubtitle = () => {
  const roles = [
    'Full Stack Developer',
    '3D Web Developer',
    'UI/UX Enthusiast',
    'Software Architect',
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout;

    if (!isDeleting && charIndex <= currentRole.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentRole.substring(0, charIndex));
        setCharIndex(charIndex + 1);
      }, 80);
    } else if (!isDeleting && charIndex > currentRole.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentRole.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, 40);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex]);

  return (
    <span className="text-cyan-400 font-medium">
      {displayText}
      <span className="animate-pulse text-cyan-300 ml-0.5">|</span>
    </span>
  );
};

// --- Subtle Particle Canvas Background ---
const ParticleField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate soft drifting particles
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.3 + 0.05,
    }));

    const render = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${p.opacity})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};

// --- Social Icon Button ---
const SocialButton = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="group relative w-10 h-10 flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition-all duration-300 hover:border-cyan-500/50 hover:text-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:bg-cyan-500/5"
  >
    <Icon />
  </a>
);

// --- Main PremiumHero Component ---
const PremiumHero = ({ image }) => {
  const handleScrollToProjects = useCallback(() => {
    const el = document.getElementById('projects');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  // Stagger animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 },
    },
  };

  return (
    <section className="relative w-full min-h-screen bg-black overflow-hidden flex items-center">
      {/* Background Layers */}
      <ParticleField />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0" />

      {/* Ambient glow orbs — kept behind content */}
      <div className="absolute top-[15%] left-[5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.08)_0%,transparent_70%)] blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.06)_0%,transparent_70%)] blur-[80px] pointer-events-none z-0" />

      {/* Main Content Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen lg:min-h-0 lg:h-screen">

          {/* === LEFT COLUMN: Text Content === */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center order-1 pt-24 lg:pt-0"
          >
            {/* Eyebrow label */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-[11px] font-mono tracking-[0.25em] text-cyan-400 uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                Welcome to my portfolio
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-4"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Hi, I'm{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-400">
                Basanagoud
              </span>
            </motion.h1>

            {/* Typing Subtitle */}
            <motion.div
              variants={fadeUp}
              className="text-lg sm:text-xl text-zinc-300 mb-6 h-8 flex items-center"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              <TypingSubtitle />
            </motion.div>

            {/* Bio */}
            <motion.p
              variants={fadeUp}
              className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-lg mb-8"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              I architect and build high-performance web applications with modern technologies. 
              Passionate about crafting exceptional digital experiences that merge clean code with stunning design.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-10">
              {/* Primary Button */}
              <Futuristic3DButton onClick={handleScrollToProjects}>
                View My Work
              </Futuristic3DButton>

              {/* Download Resume Button */}
              <DownloadResumeButton
                href={resumePdf}
                fileName="Basanagoud_Naduvinamani_Resume-v2.pdf"
                label="Download Resume"
              />
            </motion.div>

            {/* Social Icons Row */}
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <SocialButton href="https://github.com/BasuN1818" icon={GithubIcon} label="GitHub" />
              <SocialButton href="https://www.linkedin.com/in/basanagoud-naduvinamani-3a8055378/" icon={LinkedInIcon} label="LinkedIn" />
              <SocialButton href="https://x.com/" icon={TwitterIcon} label="Twitter/X" />
              <SocialButton href="mailto:basanagoudanaduvinamani18@gmail.com" icon={MailIcon} label="Email" />
            </motion.div>
          </motion.div>

          {/* === RIGHT COLUMN: Photo === */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center order-2 relative"
          >
            {/* Glassmorphism gradient blob behind photo */}
            <div className="absolute w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] lg:w-[440px] lg:h-[440px] rounded-full bg-gradient-to-br from-cyan-500/10 via-teal-500/5 to-purple-500/10 blur-[60px] pointer-events-none" />

            {/* Photo Container with animated border */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              {/* Animated gradient border ring */}
              <div
                className="absolute -inset-[3px] rounded-2xl lg:rounded-3xl opacity-70"
                style={{
                  background: 'linear-gradient(135deg, #22D3EE, #06B6D4, #8B5CF6, #22D3EE)',
                  backgroundSize: '300% 300%',
                  animation: 'gradientBorderSpin 4s ease infinite',
                }}
              />

              {/* Photo frame */}
              <div className="relative w-[280px] h-[340px] sm:w-[320px] sm:h-[380px] lg:w-[360px] lg:h-[430px] rounded-2xl lg:rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl shadow-black/40">
                {image ? (
                  <img
                    src={image}
                    alt="Basanagoud Naduvinamani"
                    className="w-full h-full object-cover object-top"
                    style={{ objectPosition: 'center 15%' }}
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-zinc-600 text-6xl font-bold">
                    BN
                  </div>
                )}

                {/* Subtle bottom gradient overlay for depth */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>

              {/* "Available for work" floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-5 px-4 py-2 rounded-full bg-zinc-900/90 border border-zinc-800 backdrop-blur-sm shadow-lg flex items-center gap-2"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-zinc-300 tracking-wide">Available for work</span>
              </motion.div>

              {/* Decorative corner accent */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-lg pointer-events-none" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-500/40 rounded-br-lg pointer-events-none" />
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* CSS Keyframes for animated gradient border */}
      <style>{`
        @keyframes gradientBorderSpin {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
};

export default PremiumHero;
