import React from 'react';

const Footer = () => {
  return (
    <footer className="relative w-full border-t border-zinc-900 bg-[#020202] py-12 px-6 md:px-12 lg:px-24 overflow-hidden z-20">
      
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent shadow-[0_0_20px_rgba(6,182,212,0.5)]"></div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        
        {/* Brand/Name Section */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
              <span className="text-white font-black text-sm tracking-tighter">BN</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-widest uppercase group-hover:text-cyan-400 transition-colors">
              Basanagoud <span className="text-zinc-500">Naduvinamani</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-sm font-medium tracking-wide">
            Full-Stack Web Developer
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-12">
          {/* Email */}
          <a 
            href="mailto:basanagoudanaduvinamani18@gmail.com"
            className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-cyan-400 transition-colors">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <span className="text-sm font-medium tracking-wider">basanagoudanaduvinamani18@gmail.com</span>
          </a>

          {/* Phone */}
          <a 
            href="tel:+919035242718"
            className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-cyan-400 transition-colors">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <span className="text-sm font-medium tracking-wider font-mono">+91 9035242718</span>
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 pt-6 border-t border-zinc-900/50 flex justify-center text-center">
        <p className="text-zinc-600 text-xs tracking-widest uppercase flex items-center gap-2">
          &copy; {new Date().getFullYear()} Basanagoud Naduvinamani <span className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse"></span> All Rights Reserved.
        </p>
      </div>

    </footer>
  );
};

export default Footer;
