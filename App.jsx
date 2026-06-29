import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import CustomCursor from './CustomCursor';
import Navbar from './Navbar';
import PremiumHero from './PremiumHero';
import AboutPremiumSection from './AboutPremiumSection';
import NeoBentoSkills from './NeoBentoSkills';
import InfiniteScrollingProjects from './InfiniteScrollingProjects';
import ResumeSection from './ResumeSection';
import CinematicContactHub from './CinematicContactHub';
import Footer from './Footer';
import ThreeBackground from './ThreeBackground';
import AdminApp from './admin/AdminApp';
import SpotlightNameSection from './SpotlightNameSection';

import imageBase from './image1.png';

// --- Antigravity Floating Wrapper Component ---
export const AntigravityFloat = ({ children, delay = 0, duration = 6, yOffset = 12 }) => {
  return (
    <motion.div
      animate={{
        y: [0, -yOffset, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay
      }}
    >
      {children}
    </motion.div>
  );
};

// --- Magnetic Mouse Attraction Wrapper Component ---
export const Magnetic = ({ children, range = 60, strength = 0.35 }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = el.getBoundingClientRect();
    
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < range) {
      setPosition({
        x: distanceX * strength,
        y: distanceY * strength
      });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

// Portfolio site component — all original sections
function PortfolioSite() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1.0,
      smoothTouch: false,
      touchMultiplier: 2.0,
      infinite: false,
    });

    // Synchronize Lenis scroll updates with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Coordinate with GSAP requestAnimationFrame ticker
    const rafCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
    };
  }, []);

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden font-sans selection:bg-cyan-500/30">
      <ThreeBackground />
      <CustomCursor />
      <Navbar />
      
      {/* Hero Section */}
      <div id="home">
        <PremiumHero image={imageBase} />
      </div>
      
      {/* About Section */}
      <div id="about">
        <AboutPremiumSection image={imageBase} />
      </div>
      
      {/* Skills Section */}
      <div id="skills">
        <NeoBentoSkills />
      </div>

      {/* Projects Showcase */}
      <div id="projects">
        <InfiniteScrollingProjects />
      </div>


      {/* Resume Section */}
      <div id="resume">
        <ResumeSection />
      </div>

      {/* Contact Section */}
      <div id="contact">
        <CinematicContactHub />
      </div>

      {/* Spotlight Name Section */}
      <SpotlightNameSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/*" element={<PortfolioSite />} />
    </Routes>
  );
}

export default App;
