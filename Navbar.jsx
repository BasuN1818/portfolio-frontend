import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import logo from './logo.png';

// --- Matrix Text Scrambler Component ---
const chars = "X01_#@$!%&*[]<>";

const MatrixText = ({ text, isHovered }) => {
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
    }, 25);

    return () => clearInterval(interval);
  }, [isHovered, text]);

  return <span className="font-mono">{displayText}</span>;
};

// --- Magnetic Pull Link Wrapper ---
const MagneticLink = ({ children }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 100, damping: 12, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 100, damping: 12, mass: 0.1 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = el.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Scale movement to max 12px pull
    x.set((clientX - centerX) * 0.25);
    y.set((clientY - centerY) * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
};

// --- Interactive Link Button Component ---
const NavLink = ({ tab, activeTab, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = activeTab === tab;

  return (
    <MagneticLink>
      <button
        onClick={() => onClick(tab)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative px-5 py-2 rounded-xl text-sm font-bold tracking-wider uppercase transition-colors duration-300 outline-none select-none ${
          isActive ? 'text-cyan-400' : 'text-zinc-500 hover:text-white'
        }`}
      >
        {/* Dynamic sliding indicator pill */}
        {isActive && (
          <motion.div
            layoutId="activeNavCapsule"
            className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/30 rounded-xl -z-10 shadow-[0_0_15px_rgba(6,182,212,0.18)]"
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          />
        )}
        <MatrixText text={tab} isHovered={isHovered || isActive} />
      </button>
    </MagneticLink>
  );
};

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [mobOpen, setMobOpen] = useState(false);
  const isScrollingRef = useRef(false);

  const tabs = ['Home', 'About', 'Skills', 'Projects', 'Resume', 'Contact'];

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobOpen(false);
    
    // Set scrolling flag to prevent scroll tracker from fighting with click selection
    isScrollingRef.current = true;

    const sectionId = tab.toLowerCase();
    const element = document.getElementById(sectionId);
    
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }

    // Release flag after smooth scroll completes
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  };

  // Section active tracking scroll logic
  useEffect(() => {
    const sections = ['home', 'about', 'skills', 'projects', 'resume', 'contact'];
    let scrollRunning = false;

    const handleScroll = () => {
      if (scrollRunning || isScrollingRef.current) return;
      scrollRunning = true;

      requestAnimationFrame(() => {
        const scrollPos = window.scrollY + window.innerHeight / 3;
        let currentSection = 'home';

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;
            if (scrollPos >= elementTop && scrollPos < elementTop + elementHeight) {
              currentSection = section;
            }
          }
        }

        const tabName = currentSection.charAt(0).toUpperCase() + currentSection.slice(1);
        setActiveTab(tabName);
        scrollRunning = false;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed top-6 left-0 right-0 mx-auto w-[92%] max-w-7xl flex items-center justify-between py-3.5 px-6 md:px-8 bg-[#09090b]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl z-[1000] shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.06)]"
      >
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => handleNavClick('Home')}
        >
          <img 
            src={logo} 
            alt="Logo" 
            className="h-9 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Desktop Navbar Links */}
        <div className="hidden md:flex items-center gap-1.5">
          {tabs.map((tab) => (
            <NavLink
              key={tab}
              tab={tab}
              activeTab={activeTab}
              onClick={handleNavClick}
            />
          ))}
        </div>

        {/* Right Action Contact Button */}
        <div className="flex items-center gap-3">
          <MagneticLink>
            <button 
              onClick={() => handleNavClick('Contact')}
              className="hidden md:flex relative overflow-hidden items-center gap-2.5 px-5 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 rounded-xl text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] group"
            >
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <span>Contact</span>
            </button>
          </MagneticLink>
          
          {/* Mobile Hamburguer Toggle */}
          <button 
            onClick={() => setMobOpen(!mobOpen)}
            className="flex md:hidden items-center gap-2 px-4 py-2 bg-[#09090b] border border-zinc-800 rounded-full text-[9px] font-mono font-bold tracking-widest text-zinc-400 hover:text-white"
          >
            <span>{mobOpen ? 'CLOSE' : 'MENU'}</span>
            <div className="flex flex-col gap-1 w-3 items-end">
              <span className={`h-0.5 w-3 bg-current transition-transform duration-300 ${mobOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`h-0.5 w-2 bg-current transition-opacity duration-300 ${mobOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-3 bg-current transition-transform duration-300 ${mobOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[900] flex flex-col items-center justify-center gap-4"
          >
            {tabs.map((tab, idx) => (
              <motion.div 
                key={tab}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ delay: idx * 0.05, type: 'spring', stiffness: 200, damping: 18 }}
                onClick={() => handleNavClick(tab)}
                className={`text-3xl font-black font-mono tracking-wider py-2 cursor-pointer uppercase transition-all duration-300 hover:tracking-widest ${
                  activeTab === tab ? 'text-cyan-400 font-bold' : 'text-zinc-600 hover:text-white'
                }`}
              >
                {tab}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
