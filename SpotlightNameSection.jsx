import React, { useRef, useCallback } from 'react';

const SpotlightNameSection = () => {
  const textWrapperRef = useRef(null);
  const overlayRef = useRef(null);
  const rafRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const textWrapper = textWrapperRef.current;
    const overlay = overlayRef.current;
    if (!textWrapper || !overlay) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const rect = textWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      overlay.style.WebkitMaskImage = `radial-gradient(circle 150px at ${x}px ${y}px, black 0%, transparent 100%)`;
      overlay.style.maskImage = `radial-gradient(circle 150px at ${x}px ${y}px, black 0%, transparent 100%)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    overlay.style.WebkitMaskImage = `radial-gradient(circle 150px at -999px -999px, black 0%, transparent 100%)`;
    overlay.style.maskImage = `radial-gradient(circle 150px at -999px -999px, black 0%, transparent 100%)`;
  }, []);

  // Common text sizing classes for both layers to stay perfectly aligned
  const textClasses = "text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] font-black tracking-[0.08em] uppercase select-none leading-none";

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full py-24 md:py-32 bg-black flex items-center justify-center overflow-hidden select-none border-t border-zinc-900/50 cursor-default"
    >
      {/* Subtle scan lines background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-0" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[radial-gradient(ellipse,rgba(34,211,238,0.04)_0%,transparent_70%)] blur-[60px] pointer-events-none z-0" />

      <div className="relative w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center z-10">

        {/* Eyebrow */}
        <span className="text-[10px] font-mono tracking-[0.35em] text-zinc-600 uppercase mb-6">
          // HOVER TO REVEAL //
        </span>

        {/* Double-layer text container — coordinate reference for mouse tracking */}
        <div ref={textWrapperRef} className="relative inline-block">

          {/* ======= BASE LAYER: Thin outline only ======= */}
          {/* Transparent fill + visible white/gray stroke = outline text */}
          <h2
            className={textClasses}
            style={{
              fontFamily: "'Arial', 'Helvetica', sans-serif",
              color: 'transparent',
              fontSize: '10rem',
              WebkitTextStroke: '1.5px rgba(255,255,255,0.4)',
            }}
          >
            BASANAGOUD
          </h2>

          {/* ======= OVERLAY LAYER: Cyan gradient fill, revealed by spotlight mask ======= */}
          {/* Only visible where the radial-gradient mask is, rest stays hidden = outline visible */}
          <h2
            ref={overlayRef}
            className={`absolute inset-0 ${textClasses} pointer-events-none`}
            style={{
              fontFamily: "'Arial', 'Helvetica,', sans-serif",
              color: 'transparent',
              fontSize: '10rem',
              background: 'linear-gradient(135deg, #22D3EE 0%, #06B6D4 40%, #0891B2 70%, #22D3EE 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: '0px transparent',
              WebkitMaskImage: 'radial-gradient(circle 150px at -999px -999px, black 0%, transparent 100%)',
              maskImage: 'radial-gradient(circle 150px at -999px -999px, black 0%, transparent 100%)',
            }}
          >
            BASANAGOUD
          </h2>
        </div>

        {/* Bottom decorative line */}
        <div className="mt-6 w-16 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
      </div>
    </section>
  );
};

export default SpotlightNameSection;
