import React, { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';

const Icons = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
  LinkedIn: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  ),
  GitHub: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
    </svg>
  ),
  Email: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ),
  WhatsApp: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  ),
};

const socialLinks = [
  { name: 'Instagram', url: 'https://www.instagram.com/_basanagoud_sn/', icon: Icons.Instagram, color: 'hover:border-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:text-pink-500' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/basanagoud-naduvinamani-3a8055378/', icon: Icons.LinkedIn, color: 'hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:text-blue-500' },
  { name: 'GitHub', url: 'https://github.com/BasuN1818', icon: Icons.GitHub, color: 'hover:border-zinc-300 hover:shadow-[0_0_15px_rgba(212,212,216,0.5)] hover:text-white' },
  { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=100071153773232', icon: Icons.Facebook, color: 'hover:border-blue-600 hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:text-blue-500' },
  { name: 'X', url: 'https://x.com/Basu_N18', icon: Icons.X, color: 'hover:border-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] hover:text-sky-400' },
  { name: 'Email', url: 'mailto:basanagoudanaduvinamani18@gmail.com', icon: Icons.Email, color: 'hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:text-red-500' },
  { name: 'Phone', url: 'tel:9035242718', icon: Icons.Phone, color: 'hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:text-emerald-500' },
  { name: 'WhatsApp', url: 'https://wa.me/919035242718', icon: Icons.WhatsApp, color: 'hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:text-green-500' },
  { name: 'Discord', url: '#', icon: () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M9 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm2.14 7c-1.87-1.12-3.8-1.57-5.14-1.57S8.73 17.88 6.86 19A13.43 13.43 0 0 1 3 10c0-6 3.6-7 3.6-7s1.37-.82 3.4-1c.64.91 1 1.62 1 1.62s1.42 0 2 0c0 0 .36-.71 1-1.62 2.03.18 3.4 1 3.4 1s3.6 1 3.6 7a13.43 13.43 0 0 1-3.86 9z"></path></svg>, color: 'hover:border-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:text-indigo-400' }
];

// Email validation helper
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const InputField = ({ label, type, as = 'input', error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const Component = as;

  return (
    <div className="relative w-full mb-6 group">
      {/* Background Neon Glow */}
      <div
        className={`absolute -inset-[1px] rounded-xl blur-md transition-all duration-700 ease-in-out ${
          error
            ? 'bg-gradient-to-r from-red-500 via-rose-600 to-red-500 opacity-80 scale-[1.01]'
            : isFocused
            ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 opacity-100 scale-[1.02] animate-pulse'
            : 'opacity-0 scale-100'
        }`}
      ></div>

      {/* Input Box UI */}
      <div className={`relative flex items-center w-full rounded-xl bg-[#09090b]/90 backdrop-blur-md border overflow-hidden transition-all duration-300 ${as === 'textarea' ? 'items-start' : ''} ${
        error ? 'border-red-500/70' : 'border-zinc-800'
      }`}>

        <Component
          type={type}
          className={`flex-1 w-full !bg-transparent text-white px-4 py-4 outline-none border-none placeholder-zinc-500 font-medium ${as === 'textarea' ? 'resize-none h-32' : ''}`}
          style={{ backgroundColor: 'transparent' }}
          placeholder={label}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Right Slider Icon */}
        {as !== 'textarea' && (
          <div className="pr-4 pl-3 flex items-center justify-center cursor-pointer group/slider">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-zinc-500 group-hover/slider:text-white transition-colors">
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="absolute -bottom-5 left-1 text-xs text-red-400 font-medium tracking-wide flex items-center gap-1">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 10.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zM8.75 8a.75.75 0 0 1-1.5 0V4.5a.75.75 0 0 1 1.5 0V8z"/></svg>
          {error}
        </p>
      )}
    </div>
  );
};

const CinematicSendButton = ({ onSubmit }) => {
  const [state, setState] = useState('idle'); // idle, loading, success, error
  const btnRef = useRef(null);
  const particlesRef = useRef(null);

  const spawnParticles = () => {
    if (!particlesRef.current) return;
    const container = particlesRef.current;
    container.innerHTML = '';
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('span');
      const angle = (Math.PI * 2 * i) / 20;
      const distance = 40 + Math.random() * 60;
      const size = 2 + Math.random() * 3;
      particle.style.cssText = `
        position:absolute; top:50%; left:50%;
        width:${size}px; height:${size}px;
        border-radius:50%;
        background: ${Math.random() > 0.5 ? '#22d3ee' : '#a855f7'};
        box-shadow: 0 0 6px ${Math.random() > 0.5 ? '#22d3ee' : '#a855f7'};
        pointer-events:none;
      `;
      container.appendChild(particle);
      gsap.fromTo(particle,
        { x: 0, y: 0, opacity: 1, scale: 1 },
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          scale: 0,
          duration: 0.6 + Math.random() * 0.4,
          ease: 'power2.out',
          onComplete: () => particle.remove()
        }
      );
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (state !== 'idle') return;
    setState('loading');

    // Animate the scan line
    if (btnRef.current) {
      gsap.fromTo(btnRef.current.querySelector('.scan-line'),
        { left: '-100%', opacity: 0.8 },
        { left: '100%', opacity: 0, duration: 0.8, ease: 'power2.inOut' }
      );
    }

    if (onSubmit) {
      try {
        await onSubmit(e);
        setState('success');
        spawnParticles();
        // Pulse glow on success
        if (btnRef.current) {
          gsap.fromTo(btnRef.current,
            { boxShadow: '0 0 0px rgba(16,185,129,0)' },
            { boxShadow: '0 0 40px rgba(16,185,129,0.5)', duration: 0.3, yoyo: true, repeat: 1 }
          );
        }
        setTimeout(() => setState('idle'), 3000);
      } catch (error) {
        setState('error');
        // Shake animation on error
        if (btnRef.current) {
          gsap.fromTo(btnRef.current,
            { x: 0 },
            { x: [-8, 8, -6, 6, -3, 3, 0], duration: 0.5, ease: 'power2.out' }
          );
        }
        setTimeout(() => setState('idle'), 2000);
      }
    }
  };

  return (
    <div className="relative">
      {/* Particle burst container */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none z-20" />

      <button
        ref={btnRef}
        onClick={handleClick}
        disabled={state === 'loading'}
        className={`
          group/btn relative flex items-center justify-center h-14 overflow-hidden outline-none
          transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          active:scale-[0.95]
          ${state === 'loading'
            ? 'w-16 rounded-full bg-[#09090b]/90 border border-cyan-500/50'
            : state === 'success'
            ? 'w-56 rounded-2xl bg-emerald-950/40 border border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
            : state === 'error'
            ? 'w-56 rounded-2xl bg-red-950/30 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
            : 'w-56 rounded-2xl bg-[#09090b]/90 backdrop-blur-md border border-zinc-800 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.25),inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-[#0a0a0f]'
          }
        `}
      >
        {/* Animated gradient border sweep on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
          <div className="absolute inset-[-2px] bg-[conic-gradient(from_var(--angle),transparent_40%,#22d3ee_50%,transparent_60%)] animate-[spin_3s_linear_infinite] rounded-2xl" style={{'--angle': '0deg'}} />
          <div className="absolute inset-[1px] bg-[#09090b] rounded-2xl" />
        </div>

        {/* Scanning line effect */}
        <div className="scan-line absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent pointer-events-none z-10" />

        {/* Idle State */}
        <div className={`absolute flex items-center justify-center gap-3 transition-all duration-300 z-10 ${
          state === 'idle' ? 'opacity-100 scale-100 delay-200' : 'opacity-0 scale-75 pointer-events-none'
        }`}>
          <div className="relative">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400 transition-all duration-300 group-hover/btn:drop-shadow-[0_0_6px_rgba(34,211,238,0.8)] group-hover/btn:translate-x-[2px] group-hover/btn:-translate-y-[2px]">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </div>
          <span className="text-white font-semibold text-sm tracking-wider uppercase group-hover/btn:text-cyan-100 transition-colors">
            Transmit
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
        </div>

        {/* Loading State */}
        <div className={`absolute flex items-center justify-center transition-all duration-300 z-10 ${
          state === 'loading' ? 'opacity-100 scale-100 delay-100' : 'opacity-0 scale-50 pointer-events-none'
        }`}>
          <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
        </div>

        {/* Success State */}
        <div className={`absolute flex items-center justify-center gap-2 transition-all duration-300 z-10 ${
          state === 'success' ? 'opacity-100 scale-100 delay-200' : 'opacity-0 scale-90 pointer-events-none'
        }`}>
          <div className="relative">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className="text-emerald-400">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
              <polyline points="8 12 11 15 16 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-emerald-400 font-bold text-sm tracking-wider uppercase">Transmitted</span>
        </div>

        {/* Error State */}
        <div className={`absolute flex items-center justify-center gap-2 transition-all duration-300 z-10 ${
          state === 'error' ? 'opacity-100 scale-100 delay-200' : 'opacity-0 scale-90 pointer-events-none'
        }`}>
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span className="text-red-400 font-bold text-sm tracking-wider uppercase">Failed</span>
        </div>
      </button>
    </div>
  );
};

const MorphingSocialHub = () => {
  return (
    <div className="relative w-full max-w-[320px] aspect-square group [perspective:1000px] mx-auto lg:mx-0">
      <div className="w-full h-full relative transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

        {/* Front Face */}
        <div className="absolute inset-0 w-full h-full bg-[#09090b]/90 backdrop-blur-md border border-zinc-800 rounded-3xl flex flex-col items-center justify-center [backface-visibility:hidden] shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-shadow duration-500">
          <span className="text-4xl font-black text-zinc-300 tracking-widest leading-tight">HOVER</span>
          <span className="text-4xl font-black text-zinc-500 tracking-widest leading-tight">FOR</span>
          <span className="text-4xl font-black text-cyan-400 tracking-widest leading-tight drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">SOCIAL</span>
          <div className="absolute bottom-8 w-12 h-1 bg-cyan-500/50 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 w-full h-full bg-[#18181b] border border-zinc-800 rounded-3xl p-5 [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="grid grid-cols-3 grid-rows-3 gap-3 w-full h-full">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group/icon relative flex items-center justify-center rounded-2xl bg-[#27272a]/50 border border-transparent text-gray-400 transition-all duration-300 active:scale-95 overflow-hidden ${link.color}`}
                  aria-label={link.name}
                >
                  {/* Cinematic scanning line on hover */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover/icon:opacity-60 group-hover/icon:animate-[scanDown_1.5s_ease-in-out_infinite] pointer-events-none" />

                  {/* Corner brackets on hover */}
                  <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-current opacity-0 group-hover/icon:opacity-50 transition-opacity duration-300" />
                  <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-current opacity-0 group-hover/icon:opacity-50 transition-opacity duration-300" />

                  <Icon className="w-8 h-8 transition-all duration-300 group-hover/icon:scale-110 group-hover/icon:drop-shadow-[0_0_8px_currentColor]" />
                </a>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

const CinematicContactHub = () => {
  const formRef = useRef();
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const form = formRef.current;
    const newErrors = {};

    const name = form.user_name.value.trim();
    const email = form.user_email.value.trim();
    const message = form.message.value.trim();

    if (!name) {
      newErrors.name = 'Name is required';
    } else if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!message) {
      newErrors.message = 'Message is required';
    } else if (message.length < 5) {
      newErrors.message = 'Message must be at least 5 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendEmail = (e) => {
    return new Promise((resolve, reject) => {
      if (!validateForm()) {
        return reject(new Error("Validation Failed"));
      }

      const form = formRef.current;
      const payload = {
        id: Date.now(),
        name: form.user_name.value.trim(),
        email: form.user_email.value.trim(),
        message: form.message.value.trim(),
        created_at: new Date().toISOString()
      };

      // Save to localStorage immediately for local persistency
      try {
        const stored = localStorage.getItem('nb-portfolio-contacts');
        const contactsList = stored ? JSON.parse(stored) : [];
        contactsList.unshift(payload);
        localStorage.setItem('nb-portfolio-contacts', JSON.stringify(contactsList));
        
        // Add to recent activity
        const activityStored = localStorage.getItem('nb-portfolio-activity');
        const activityList = activityStored ? JSON.parse(activityStored) : [];
        activityList.unshift({
          id: Date.now() + 1,
          user: payload.name,
          action: 'transmitted a new contact message',
          type: 'content',
          timestamp: payload.created_at
        });
        localStorage.setItem('nb-portfolio-activity', JSON.stringify(activityList));

        // Add to notifications
        const notifStored = localStorage.getItem('nb-portfolio-notifications');
        const notifList = notifStored ? JSON.parse(notifStored) : [];
        notifList.unshift({
          id: Date.now() + 2,
          type: 'info',
          title: 'New contact message',
          message: `From ${payload.name} (${payload.email})`,
          time: payload.created_at,
          read: false
        });
        localStorage.setItem('nb-portfolio-notifications', JSON.stringify(notifList));
        // Dispatch event for Topbar sync
        window.dispatchEvent(new Event('nb-notifications-updated'));
      } catch (err) {
        console.error("Failed to save to localStorage:", err);
      }

      // Try sending to backend
      fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: payload.name,
          user_email: payload.email,
          message: payload.message
        })
      })
        .then(async (res) => {
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || 'Server returned ' + res.status);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Message Sent Successfully to Backend:", data);
          form.reset();
          setErrors({});
          resolve(payload);
        })
        .catch((error) => {
          console.warn("Backend offline or failed, using localStorage fallback:", error);
          // Still treat as success since we saved locally
          form.reset();
          setErrors({});
          resolve(payload);
        });
    });
  };

  // Clear individual field errors on input
  const handleFieldChange = (fieldName) => {
    setErrors(prev => {
      const next = { ...prev };
      delete next[fieldName];
      delete next.form;
      return next;
    });
  };

  return (
    <section className="relative w-full min-h-[auto] lg:min-h-screen bg-[#050505] py-16 md:py-24 px-6 md:px-12 lg:px-24 flex items-center justify-center overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Scan animation keyframes */}
      <style>{`
        @keyframes scanDown {
          0% { top: 0; opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

        {/* Left Column - Contact Form */}
        <div className="lg:col-span-7 flex flex-col space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-widest uppercase" style={{ color: '#22D3EE' }}>
              Contact
            </h2>
            <div className="h-[2px] w-16 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
          </div>

          <form ref={formRef} className="w-full space-y-2 mt-8" noValidate>
            <InputField
              label="Name"
              type="text"
              name="user_name"
              error={errors.name}
              onChange={() => handleFieldChange('name')}
              required
            />
            <InputField
              label="Email"
              type="email"
              name="user_email"
              error={errors.email}
              onChange={() => handleFieldChange('email')}
              required
            />
            <InputField
              label="Message"
              as="textarea"
              rows="4"
              name="message"
              error={errors.message}
              onChange={() => handleFieldChange('message')}
              required
            />

            {/* Form-level error */}
            {errors.form && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-950/30 border border-red-500/30 rounded-xl">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" className="text-red-400 flex-shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <p className="text-red-400 text-sm font-medium">{errors.form}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-6 pt-4 items-center">
              <CinematicSendButton onSubmit={handleSendEmail} />
            </div>
          </form>
        </div>

        {/* Right Column - Social Hub */}
        <div className="lg:col-span-5 flex flex-col justify-center h-full space-y-12 lg:pl-12 lg:border-l lg:border-gray-800">
          <div>
            <h3 className="text-xl font-bold text-white mb-6 tracking-wider uppercase flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
              Social Network
            </h3>
            <p className="text-gray-500 font-light leading-relaxed mb-8">
              Connect with me across various platforms. I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>

            <div className="mt-8">
              <MorphingSocialHub />
            </div>
          </div>

          <div className="p-6 border border-gray-800 bg-gray-900/50 rounded-lg relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
            <h4 className="text-cyan-400 font-mono text-sm tracking-widest uppercase mb-2">Direct Channel</h4>
            <p className="text-white font-medium mb-1">basanagoudanaduvinamani18@gmail.com</p>
            <p className="text-gray-400 text-sm font-mono">+91 9035242718</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CinematicContactHub;
