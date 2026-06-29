import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutPremiumSection = ({ image }) => {
  const containerRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);

  useEffect(() => {
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;

    if (!leftCol || !rightCol) return;

    // ScrollTrigger animation for the columns
    gsap.fromTo(leftCol,
      { x: -50, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        }
      }
    );

    gsap.fromTo(rightCol.children,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full py-24 bg-transparent text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row gap-16 items-center">

        {/* Left Column (Sharp Grayscale Portrait with Right 1/4 Gradient Fade) */}
        <div
          ref={leftColRef}
          className="relative w-full lg:w-1/2 aspect-[4/5] lg:aspect-[3/4] rounded-3xl overflow-hidden bg-black border border-white/5 shadow-2xl"
        >
          {/* Grayscale Base Portrait (High Quality, No Blur) */}
          <img
            src={image || "./image1.png"}
            alt="Portrait Base"
            className="w-full h-full object-cover grayscale contrast-110"
          />

          {/* Right 1/4 black gradient overlay to blend into background */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_75%,#000000_100%)] pointer-events-none z-10" />
        </div>

        {/* Right Column (Professional Narrative & Details) */}
        <div ref={rightColRef} className="w-full lg:w-1/2 flex flex-col gap-8 z-10">

          {/* Header */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-[1px] bg-cyan-400"></div>
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400">Introduction</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold italic tracking-tight text-white uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ABOUT ME.
            </h2>
          </div>

          {/* Narrative */}
          <p className="text-base md:text-lg text-white/60 leading-relaxed font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
            I am <span className="text-white font-medium">Basanagoud Naduvinamani</span>, a BCA student with a passion for software development and technology. A detail-oriented software developer specializing in leveraging core concepts in <span className="text-cyan-400">Java</span> and modern web technologies (<span className="text-white/80">HTML, CSS, JavaScript, UI/UX, MySQL</span>) to build elegant, high-performance applications with clean architecture and precision.
          </p>

          {/* Interactive Cards Section */}
          <div className="flex flex-col gap-4 mt-2">

            {/* Card 1 */}
            <div className="group relative p-5 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_10px_#22d3ee]"></div>
              <div className="flex items-start gap-4 relative z-10">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-white tracking-wide mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Core Technical Stack</h3>
                  <p className="text-[13px] text-white/50 leading-relaxed">Backend &amp; Core Logic: Java, Python (as needed), Software Architecture Principles.</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative p-5 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_10px_#3b82f6]"></div>
              <div className="flex items-start gap-4 relative z-10">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-blue-500 drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-white tracking-wide mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Web Engineering &amp; Development</h3>
                  <p className="text-[13px] text-white/50 leading-relaxed">HTML, CSS, JavaScript (ES6+), Modern React.js (hooks, context), responsive design, Git.</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative p-5 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_10px_#c084fc]"></div>
              <div className="flex items-start gap-4 relative z-10">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-purple-400 drop-shadow-[0_0_6px_rgba(192,132,252,0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-white tracking-wide mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Problem Solving &amp; Systems</h3>
                  <p className="text-[13px] text-white/50 leading-relaxed">Algorithmic efficiency, data structures, MySQL database design and optimization.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPremiumSection;
