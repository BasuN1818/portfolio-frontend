import React, { useRef, useState, useCallback, useEffect } from 'react';

/* ─────────────────────────────────────────────
   CSS injected once — keyframes & utilities
   ───────────────────────────────────────────── */
const FUTURISTIC_CSS = `
  @keyframes futuristicBorderSpin {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes futuristicShimmer {
    0%   { left: -100%; }
    100% { left: 200%; }
  }
  @keyframes futuristicScanLine {
    0%   { top: -2px; opacity: 0; }
    15%  { opacity: 0.6; }
    85%  { opacity: 0.6; }
    100% { top: calc(100% + 2px); opacity: 0; }
  }
  @keyframes futuristicPulseRing {
    0%   { transform: scale(0.8); opacity: 0.8; }
    100% { transform: scale(2.5); opacity: 0; }
  }
  @keyframes futuristicBounce {
    0%, 100% { transform: translateY(0); }
    30%      { transform: translateY(-6px); }
    60%      { transform: translateY(2px); }
  }
  @keyframes futuristicSpinner {
    0%   { stroke-dashoffset: 157; }
    50%  { stroke-dashoffset: 40; }
    100% { stroke-dashoffset: 157; transform: rotate(360deg); }
  }
  @keyframes futuristicCheckDraw {
    0%   { stroke-dashoffset: 30; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes futuristicGlowPulse {
    0%, 100% { box-shadow: 0 0 15px rgba(34,211,238,0.15), 0 0 30px rgba(34,211,238,0.05); }
    50%      { box-shadow: 0 0 25px rgba(34,211,238,0.3), 0 0 50px rgba(34,211,238,0.1); }
  }
`;

let cssInjected = false;
const injectCSS = () => {
  if (cssInjected) return;
  cssInjected = true;
  const style = document.createElement('style');
  style.textContent = FUTURISTIC_CSS;
  document.head.appendChild(style);
};

/* ═══════════════════════════════════════════════
   1. FUTURISTIC 3D BUTTON
   ═══════════════════════════════════════════════ */
export const Futuristic3DButton = ({
  children = 'View My Work',
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}) => {
  const btnRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  useEffect(injectCSS, []);

  /* --- Mouse-tracking 3D tilt --- */
  const handleMouseMove = useCallback((e) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 → 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: -y * 18, rotateY: x * 18 });
  }, []);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  /* --- Split text into letter spans for stagger animation --- */
  const text = typeof children === 'string' ? children : '';
  const letters = text.split('');

  return (
    <div style={{ perspective: '800px' }} className={`inline-block ${className}`}>
      <button
        ref={btnRef}
        type={type}
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isHovered ? 1.05 : 1})`,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
          transformStyle: 'preserve-3d',
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        }}
        className={`
          group relative px-8 py-4 rounded-xl cursor-pointer select-none outline-none
          border border-transparent overflow-hidden
          disabled:opacity-50 disabled:cursor-not-allowed
          focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black
          active:!scale-[0.97]
        `}
      >
        {/* ── Layer 1: Glassmorphism dark background ── */}
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: isHovered
              ? 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(236,72,153,0.06) 100%)'
              : 'linear-gradient(135deg, rgba(9,9,11,0.95) 0%, rgba(24,24,27,0.9) 100%)',
            backdropFilter: 'blur(12px)',
            transition: 'background 0.3s ease',
          }}
        />

        {/* ── Layer 2: Animated pulsing gradient border ── */}
        <div
          className="absolute -inset-[1px] rounded-xl -z-10"
          style={{
            background: 'linear-gradient(135deg, #22D3EE, #3B82F6, #8B5CF6, #EC4899, #22D3EE)',
            backgroundSize: '300% 300%',
            animation: 'futuristicBorderSpin 4s ease infinite',
            opacity: isHovered ? 1 : 0.4,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* ── Layer 3: Layered 3D depth shadows ── */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: isHovered
              ? '0 -2px 10px rgba(34,211,238,0.15), 0 8px 25px rgba(0,0,0,0.6), 0 0 40px rgba(34,211,238,0.1)'
              : '0 -1px 4px rgba(255,255,255,0.03), 0 4px 12px rgba(0,0,0,0.4)',
            transition: 'box-shadow 0.3s ease',
          }}
        />

        {/* ── Layer 4: Holographic shimmer sweep on hover ── */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
          style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease' }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '60%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
              transform: 'skewX(-20deg)',
              animation: isHovered ? 'futuristicShimmer 1.5s ease-in-out infinite' : 'none',
            }}
          />
        </div>

        {/* ── Layer 5: Scan-line overlay ── */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
          style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease' }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent 20%, rgba(34,211,238,0.4) 50%, transparent 80%)',
              animation: isHovered ? 'futuristicScanLine 2.5s ease-in-out infinite' : 'none',
            }}
          />
        </div>

        {/* ── Text with slide-up reveal animation ── */}
        <div className="relative z-10 overflow-hidden" style={{ height: '1.5em' }}>
          {/* Primary text — slides up on hover */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '1.5em',
              transform: isHovered ? 'translateY(-100%)' : 'translateY(0)',
              transition: 'transform 0.35s cubic-bezier(0.65, 0, 0.35, 1)',
            }}
          >
            {letters.length > 0 ? letters.map((letter, i) => (
              <span
                key={i}
                className="inline-block font-bold text-sm tracking-[0.15em] uppercase"
                style={{
                  color: '#e4e4e7',
                  transitionDelay: `${i * 15}ms`,
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            )) : (
              <span className="font-bold text-sm tracking-[0.15em] uppercase text-zinc-200">
                {children}
              </span>
            )}
          </div>

          {/* Duplicate text — slides in from below */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '1.5em',
              transform: isHovered ? 'translateY(-100%)' : 'translateY(0)',
              transition: 'transform 0.35s cubic-bezier(0.65, 0, 0.35, 1)',
            }}
          >
            {letters.length > 0 ? letters.map((letter, i) => (
              <span
                key={i}
                className="inline-block font-bold text-sm tracking-[0.15em] uppercase"
                style={{
                  color: '#22D3EE',
                  transitionDelay: `${i * 15}ms`,
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            )) : (
              <span className="font-bold text-sm tracking-[0.15em] uppercase text-cyan-400">
                {children}
              </span>
            )}
          </div>
        </div>
      </button>
    </div>
  );
};


/* ═══════════════════════════════════════════════
   2. DOWNLOAD RESUME BUTTON
   ═══════════════════════════════════════════════ */
export const DownloadResumeButton = ({
  href,
  fileName = 'Resume.pdf',
  label = 'Download Resume',
  className = '',
}) => {
  const btnRef = useRef(null);
  const [state, setState] = useState('idle'); // idle | downloading | complete
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [progress, setProgress] = useState(0);

  useEffect(injectCSS, []);

  /* --- 3D tilt --- */
  const handleMouseMove = useCallback((e) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: -y * 14, rotateY: x * 14 });
  }, []);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  /* --- Download handler with progress simulation --- */
  const handleClick = () => {
    if (state !== 'idle') return;
    setState('downloading');
    setProgress(0);

    // Simulate progress
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setProgress(100);

        // Trigger real download
        const a = document.createElement('a');
        a.href = href;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Show checkmark
        setTimeout(() => {
          setState('complete');
          // Revert after 2 seconds
          setTimeout(() => {
            setState('idle');
            setProgress(0);
          }, 2000);
        }, 300);
      } else {
        setProgress(p);
      }
    }, 120);
  };

  /* --- Split text for animation --- */
  const letters = label.split('');

  return (
    <div style={{ perspective: '800px' }} className={`inline-block ${className}`}>
      <button
        ref={btnRef}
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-label={label}
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isHovered && state === 'idle' ? 1.05 : 1})`,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          transformStyle: 'preserve-3d',
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        }}
        className={`
          group relative rounded-xl cursor-pointer select-none outline-none
          border border-transparent overflow-hidden
          focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black
          active:!scale-[0.97]
          ${state === 'downloading' ? 'px-6 py-4' : 'px-8 py-4'}
        `}
      >
        {/* ── Glassmorphism background ── */}
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: state === 'complete'
              ? 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,95,70,0.1) 100%)'
              : isHovered
              ? 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(236,72,153,0.06) 100%)'
              : 'linear-gradient(135deg, rgba(9,9,11,0.95) 0%, rgba(24,24,27,0.9) 100%)',
            backdropFilter: 'blur(12px)',
            transition: 'background 0.4s ease',
          }}
        />

        {/* ── Animated gradient border ── */}
        <div
          className="absolute -inset-[1px] rounded-xl -z-10"
          style={{
            background: state === 'complete'
              ? 'linear-gradient(135deg, #10B981, #34D399, #10B981)'
              : 'linear-gradient(135deg, #22D3EE, #3B82F6, #8B5CF6, #22D3EE)',
            backgroundSize: '300% 300%',
            animation: 'futuristicBorderSpin 4s ease infinite',
            opacity: state !== 'idle' ? 1 : (isHovered ? 1 : 0.4),
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* ── 3D depth shadows ── */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: isHovered || state !== 'idle'
              ? '0 -2px 10px rgba(34,211,238,0.15), 0 8px 25px rgba(0,0,0,0.6), 0 0 40px rgba(34,211,238,0.1)'
              : '0 -1px 4px rgba(255,255,255,0.03), 0 4px 12px rgba(0,0,0,0.4)',
            transition: 'box-shadow 0.3s ease',
          }}
        />

        {/* ── Shimmer sweep ── */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
          style={{ opacity: isHovered && state === 'idle' ? 1 : 0, transition: 'opacity 0.3s ease' }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '60%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
              transform: 'skewX(-20deg)',
              animation: isHovered && state === 'idle' ? 'futuristicShimmer 1.5s ease-in-out infinite' : 'none',
            }}
          />
        </div>

        {/* ── Scan line ── */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
          style={{ opacity: isHovered && state === 'idle' ? 1 : 0, transition: 'opacity 0.3s ease' }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent 20%, rgba(34,211,238,0.4) 50%, transparent 80%)',
              animation: isHovered && state === 'idle' ? 'futuristicScanLine 2.5s ease-in-out infinite' : 'none',
            }}
          />
        </div>

        {/* ── Pulse ring burst on complete ── */}
        {state === 'complete' && (
          <>
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                border: '2px solid rgba(16,185,129,0.5)',
                animation: 'futuristicPulseRing 0.8s ease-out forwards',
              }}
            />
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                border: '2px solid rgba(16,185,129,0.3)',
                animation: 'futuristicPulseRing 0.8s ease-out 0.15s forwards',
              }}
            />
          </>
        )}

        {/* ── CONTENT: Idle State ── */}
        <div
          className="relative z-10 flex items-center gap-3"
          style={{
            opacity: state === 'idle' ? 1 : 0,
            transform: state === 'idle' ? 'scale(1)' : 'scale(0.8)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            pointerEvents: state === 'idle' ? 'auto' : 'none',
            position: state === 'idle' ? 'relative' : 'absolute',
            inset: state !== 'idle' ? 0 : undefined,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Download icon with bounce on hover */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              color: isHovered ? '#22D3EE' : '#a1a1aa',
              animation: isHovered ? 'futuristicBounce 0.6s ease infinite' : 'none',
              transition: 'color 0.3s ease',
              flexShrink: 0,
            }}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>

          {/* Text with slide animation */}
          <div className="overflow-hidden" style={{ height: '1.5em' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '1.5em',
                transform: isHovered ? 'translateY(-100%)' : 'translateY(0)',
                transition: 'transform 0.35s cubic-bezier(0.65, 0, 0.35, 1)',
              }}
            >
              {letters.map((letter, i) => (
                <span
                  key={i}
                  className="inline-block font-bold text-sm tracking-[0.12em] uppercase"
                  style={{ color: '#e4e4e7' }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '1.5em',
                transform: isHovered ? 'translateY(-100%)' : 'translateY(0)',
                transition: 'transform 0.35s cubic-bezier(0.65, 0, 0.35, 1)',
              }}
            >
              {letters.map((letter, i) => (
                <span
                  key={i}
                  className="inline-block font-bold text-sm tracking-[0.12em] uppercase"
                  style={{ color: '#22D3EE' }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── CONTENT: Downloading State (Spinner) ── */}
        <div
          className="relative z-10 flex items-center justify-center gap-3"
          style={{
            opacity: state === 'downloading' ? 1 : 0,
            transform: state === 'downloading' ? 'scale(1)' : 'scale(0.5)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            pointerEvents: 'none',
            position: state === 'downloading' ? 'relative' : 'absolute',
            inset: state !== 'downloading' ? 0 : undefined,
          }}
        >
          {/* Circular progress */}
          <svg width="24" height="24" viewBox="0 0 28 28" style={{ flexShrink: 0 }}>
            {/* Background track */}
            <circle
              cx="14" cy="14" r="11"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="2.5"
            />
            {/* Progress arc */}
            <circle
              cx="14" cy="14" r="11"
              fill="none"
              stroke="#22D3EE"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 11}`}
              strokeDashoffset={`${2 * Math.PI * 11 * (1 - progress / 100)}`}
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
                transition: 'stroke-dashoffset 0.15s ease',
                filter: 'drop-shadow(0 0 4px rgba(34,211,238,0.6))',
              }}
            />
          </svg>
          <span
            className="font-bold text-sm tracking-[0.12em] uppercase"
            style={{ color: '#22D3EE' }}
          >
            {Math.floor(progress)}%
          </span>
        </div>

        {/* ── CONTENT: Complete State (Checkmark) ── */}
        <div
          className="relative z-10 flex items-center justify-center gap-3"
          style={{
            opacity: state === 'complete' ? 1 : 0,
            transform: state === 'complete' ? 'scale(1)' : 'scale(0.5)',
            transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s',
            pointerEvents: 'none',
            position: state === 'complete' ? 'relative' : 'absolute',
            inset: state !== 'complete' ? 0 : undefined,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12" cy="12" r="10"
              stroke="#10B981"
              strokeWidth="1.5"
              opacity="0.3"
            />
            <polyline
              points="8 12 11 15 16 9"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="30"
              style={{
                animation: 'futuristicCheckDraw 0.4s ease forwards',
              }}
            />
          </svg>
          <span
            className="font-bold text-sm tracking-[0.12em] uppercase"
            style={{ color: '#10B981' }}
          >
            Downloaded
          </span>
        </div>
      </button>
    </div>
  );
};

export default Futuristic3DButton;
