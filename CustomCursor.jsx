import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Use GSAP quickTo for best performance
    const xDot = gsap.quickTo(dot, "x", { duration: 0.02, ease: "none" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.02, ease: "none" });
    
    const xRing = gsap.quickTo(ring, "x", { duration: 0.15, ease: "power4.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.15, ease: "power4.out" });

    const onMouseMove = (e) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    document.addEventListener('mousemove', onMouseMove);

    // Hover effect logic
    const handleMouseOver = (e) => {
      const target = e.target.closest('button, a, .hover-target');
      if (target) {
        gsap.to(ring, { scale: 1.9, borderColor: 'rgba(34,211,238,0.8)', backgroundColor: 'rgba(34,211,238,0.1)', duration: 0.3, ease: 'power2.out' });
        gsap.to(dot, { scale: 0.4, duration: 0.3 });
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('button, a, .hover-target');
      if (target) {
        gsap.to(ring, { scale: 1, borderColor: 'rgba(34,211,238,0.4)', backgroundColor: 'transparent', duration: 0.3 });
        gsap.to(dot, { scale: 1, duration: 0.3 });
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      <div 
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      />
      <div 
        ref={ringRef}
        className="fixed top-0 left-0 w-[38px] h-[38px] border-[1.5px] border-cyan-400/40 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
};

export default CustomCursor;
