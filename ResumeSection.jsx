import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { DownloadResumeButton } from './FuturisticButton';
import imageBase from './image1.png';
import resumePdf from './Basanagoud_Naduvinamani_Resume-v2.pdf';

const FloatingBN = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* 3D (B)(N) Background Elements */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-cyan-500/10 font-black text-6xl md:text-9xl"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotateX: Math.random() * 360,
            rotateY: Math.random() * 360,
            rotateZ: Math.random() * 360,
            scale: Math.random() * 1.5 + 0.5,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotateX: Math.random() * 360 + 360,
            rotateY: Math.random() * 360 + 360,
            rotateZ: Math.random() * 360 + 360,
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {i % 2 === 0 ? 'B' : 'N'}
        </motion.div>
      ))}

      {/* BN Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30rem] md:text-[40rem] font-black text-cyan-500/[0.03] tracking-tighter mix-blend-overlay">
        BN
      </div>
    </div>
  );
};

const CinematicDownload = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500;
    const interval = 30;
    let current = 0;

    const timer = setInterval(() => {
      current += (interval / duration) * 100;
      if (current >= 100) {
        setProgress(100);
        clearInterval(timer);
        setTimeout(onComplete, 400); // Wait a bit before completing
      } else {
        setProgress(current);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Circle math
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
    >
      <div className="relative flex flex-col items-center">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/20 blur-[50px] rounded-full"></div>

        {/* Circular Progress */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            {/* Background track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="4"
            />
            {/* Progress line */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-75 ease-linear"
              style={{ filter: "drop-shadow(0 0 8px rgba(6,182,212,0.8))" }}
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-light text-white font-mono">{Math.floor(progress)}<span className="text-cyan-500 text-lg">%</span></span>
          </div>
        </div>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-8 text-cyan-500/80 tracking-[0.3em] text-sm uppercase font-semibold"
        >
          Decrypting File
        </motion.div>
      </div>
    </motion.div>
  );
};

const ResumeSection = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const imageRotateX = useTransform(scrollYProgress, [0, 1], [10, -10]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full bg-black py-24 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      <FloatingBN />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left Column - Resume Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-tighter">
              DOSSIER
            </h2>
            <div className="h-1 w-24 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
          </div>

          <div className="space-y-8 text-gray-300 font-light leading-relaxed">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-cyan-500/50 transition-colors duration-500 group">
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Basanagoud Naduvinamani</h3>
              <p className="text-cyan-500 mb-4 tracking-widest text-sm font-mono uppercase">Full-Stack Web Developer</p>
              <p className="text-sm border-l-2 border-cyan-500/30 pl-4 py-1">
                Detail-oriented and highly motivated Full-Stack Developer and current BCA student
                with a solid foundation in modern frontend frameworks, backend architecture, and
                database management. Passionate about building high-performance web applications,
                scaling systems, and exploring futuristic UI/UX designs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-cyan-500/50 transition-colors duration-500 group">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                  Education
                </h4>
                <p className="font-semibold text-gray-200">KLE Society's College, Gokak</p>
                <p className="text-sm text-gray-400">BCA | 2025 — 2028</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-cyan-500/50 transition-colors duration-500 group">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  Core Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Next.js', 'Tailwind', 'GSAP', 'Node.js', 'Java'].map(skill => (
                    <span key={skill} className="px-3 py-1 text-xs font-mono rounded-full bg-white/5 border border-white/10 text-cyan-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-cyan-500/50 transition-colors duration-500 group">
              <h4 className="text-xl font-bold text-white mb-4">Key Projects</h4>
              <div className="space-y-6">
                <div>
                  <h5 className="text-cyan-400 font-semibold mb-2">E-Sports Infrastructure Platform</h5>
                  <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                    <li>Engineered secure web platform using PHP/MySQL for tournament ops.</li>
                    <li>Implemented 2FA OTP security for admin panels.</li>
                    <li>Automated financial module with dynamic QR-code uploads.</li>
                  </ul>
                </div>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <div>
                  <h5 className="text-cyan-400 font-semibold mb-2">Immersive 3D Portfolio</h5>
                  <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                    <li>Architected cinema-grade portfolio using React, Tailwind, GSAP, R3F.</li>
                    <li>Developed multi-stage, scroll-driven interactive 3D scene.</li>
                    <li>Engineered highly responsive mouse-tracking reveal states.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3D Download Button */}
            <DownloadResumeButton
              href={resumePdf}
              fileName="Basanagoud_Naduvinamani_Resume-v2.pdf"
              label="Download Dossier"
              className="w-full md:w-auto"
            />
          </div>
        </motion.div>

        {/* Right Column - 3D Cinematic Image */}
        <motion.div
          style={{ y: imageY, rotateX: imageRotateX, transformStyle: 'preserve-3d' }}
          className="relative perspective-[2000px] hidden lg:block"
        >
          {/* Main cinematic cut container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.3)] border border-cyan-500/30 group"
          >
            {/* Cinematic crop top/bottom bars */}
            <div className="absolute top-0 left-0 w-full h-12 bg-black/80 backdrop-blur-md z-20 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-full h-12 bg-black/80 backdrop-blur-md z-20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>

            {/* Scanning line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.8)] z-20 animate-[scan_3s_ease-in-out_infinite]"></div>

            <img
              src={imageBase}
              alt="Profile"
              className="w-full h-full object-cover object-center filter grayscale hover:grayscale-0 transition-all duration-700 ease-in-out scale-110 group-hover:scale-100"
            />

            {/* Holographic overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-blue-600/20 mix-blend-overlay z-10 pointer-events-none"></div>

            {/* HUD Elements */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-500 z-20 opacity-50"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500 z-20 opacity-50"></div>
          </motion.div>

          {/* 3D layered background plates */}
          <div className="absolute -inset-4 bg-cyan-500/10 rounded-3xl transform translate-z-[-50px] blur-xl"></div>
          <div className="absolute -inset-8 border border-blue-500/20 rounded-3xl transform translate-z-[-100px] scale-95 opacity-50"></div>
        </motion.div>

      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default ResumeSection;
