import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Set up scene, camera, renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.022);

    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 28;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Clear out existing children if react strict mode runs twice
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Texture generation
    const charTex = (char, rgba) => {
      const sz = 128;
      const cv = document.createElement('canvas');
      cv.width = sz;
      cv.height = sz;
      const ctx = cv.getContext('2d');
      ctx.font = `800 ${sz * 0.78}px 'Space Grotesk', 'Inter', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = rgba;
      ctx.fillText(char, sz / 2, sz / 2);
      return new THREE.CanvasTexture(cv);
    };

    const texPool = [
      charTex('N', 'rgba(255,255,255,0.95)'),
      charTex('N', 'rgba(200,200,200,0.6)'),
      charTex('N', 'rgba(130,130,130,0.35)'),
      charTex('N', 'rgba(70,70,70,0.2)'),
      charTex('B', 'rgba(255,255,255,0.95)'),
      charTex('B', 'rgba(200,200,200,0.6)'),
      charTex('B', 'rgba(130,130,130,0.35)'),
      charTex('B', 'rgba(70,70,70,0.2)'),
    ];

    const COUNT = 360;
    const sprites = [];

    for (let i = 0; i < COUNT; i++) {
      const mat = new THREE.SpriteMaterial({
        map: texPool[Math.floor(Math.random() * texPool.length)],
        transparent: true,
        opacity: Math.random() * 0.55 + 0.08,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const sp = new THREE.Sprite(mat);
      const spread = 65;
      
      sp.position.set(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread * 0.65,
        (Math.random() - 0.5) * 38
      );
      
      const s = Math.random() * 1.3 + 0.25;
      sp.scale.set(s, s, 1);
      
      sp.userData = {
        vx: (Math.random() - 0.5) * 0.007,
        baseY: sp.position.y,
        amp: Math.random() * 0.35 + 0.1,
        freq: Math.random() * 0.25 + 0.12,
        phase: Math.random() * Math.PI * 2,
        opBase: mat.opacity,
      };
      
      scene.add(sp);
      sprites.push(sp);
    }

    // Parallax values
    let pmx = 0;
    let pmy = 0;

    const onMouseMove = (e) => {
      pmx = (e.clientX / window.innerWidth - 0.5) * 2;
      pmy = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onResize);

    // Animation Loop
    let t = 0;
    let reqId;

    const loop = () => {
      reqId = requestAnimationFrame(loop);
      t += 0.008;

      camera.position.x += (pmx * 2.5 - camera.position.x) * 0.018;
      camera.position.y += (pmy * 1.2 - camera.position.y) * 0.018;
      camera.lookAt(scene.position);

      sprites.forEach(sp => {
        const ud = sp.userData;
        sp.position.x += ud.vx;
        sp.position.y = ud.baseY + Math.sin(t * ud.freq + ud.phase) * ud.amp;

        if (sp.position.x > 35) sp.position.x = -35;
        if (sp.position.x < -35) sp.position.x = 35;

        sp.material.opacity = ud.opBase * (0.55 + 0.45 * Math.sin(t * 0.4 + ud.phase));
      });

      renderer.render(scene, camera);
    };

    loop();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(reqId);
      
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
      
      // Cleanup Three.js memory
      scene.clear();
      renderer.dispose();
      sprites.forEach(sp => sp.material.dispose());
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

export default ThreeBackground;
