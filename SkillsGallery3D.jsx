import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Environment, SpotLight, useCursor, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Tech stack data
const skillsData = [
  { name: 'React', desc: 'UI Library', color: '#00f0ff', pos: [-4, 2, 0] },
  { name: 'Node.js', desc: 'Runtime Engine', color: '#a855f7', pos: [0, 3, -2] },
  { name: 'Tailwind', desc: 'Utility CSS', color: '#3b82f6', pos: [4, 1.5, 1] },
  { name: 'Next.js', desc: 'React Framework', color: '#ffffff', pos: [-3, -2, 2] },
  { name: 'MySQL', desc: 'Database', color: '#f59e0b', pos: [2, -3, -1] },
  { name: 'Express', desc: 'Backend API', color: '#10b981', pos: [0, 0, 3] },
  { name: 'TypeScript', desc: 'Static Typing', color: '#3178c6', pos: [-5, -1, -3] },
  { name: 'Three.js', desc: 'WebGL 3D', color: '#ff0055', pos: [5, -2, -2] },
  { name: 'Figma', desc: 'UI/UX Design', color: '#f24e1e', pos: [3, 4, -4] },
  { name: 'GSAP', desc: 'Animations', color: '#88ce02', pos: [-6, 3, -1] },
  { name: 'Git', desc: 'Version Control', color: '#f1502f', pos: [1, -5, -3] },
  { name: 'MongoDB', desc: 'NoSQL DB', color: '#47a248', pos: [-2, -5, 0] },
];

// Single frosted glass card
const SkillCard = ({ name, desc, color, pos }) => {
  const meshRef = useRef(null);
  const glowRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  
  useCursor(hovered);

  // Animate hover state scaling and HUD glow
  useFrame((state, delta) => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.1 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // HUD elements tilt towards the camera slightly when hovered
      if (hovered) {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, (state.mouse.x * Math.PI) / 6, 0.1);
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -(state.mouse.y * Math.PI) / 6, 0.1);
      } else {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.05);
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.05);
      }
    }
    
    if (glowRef.current) {
      const targetIntensity = hovered ? 3.5 : 0.8;
      glowRef.current.intensity = THREE.MathUtils.lerp(glowRef.current.intensity, targetIntensity, 0.1);
    }
  });

  return (
    <Float
      speed={hovered ? 0.5 : 2} 
      rotationIntensity={1.5} 
      floatIntensity={hovered ? 0.5 : 3}
      position={pos}
    >
      <group 
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        {/* The Translucent Frosted Glass Card Geometry */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3, 4, 0.1]} />
          <MeshTransmissionMaterial 
            backside
            samples={4}
            thickness={0.2}
            roughness={0.4}
            chromaticAberration={0.05}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.3}
            temporalDistortion={0.1}
            clearcoat={1}
            attenuationDistance={0.5}
            attenuationColor={color}
            color="#ffffff"
          />
        </mesh>

        {/* Card Border Glow (simulated via edge highlight) */}
        <mesh position={[0, 0, 0]} scale={[1.02, 1.02, 1.02]}>
          <boxGeometry args={[3, 4, 0.1]} />
          <meshBasicMaterial color={hovered ? color : '#222222'} wireframe transparent opacity={0.3} />
        </mesh>

        {/* Localized pulsating backlighting */}
        <pointLight ref={glowRef} distance={10} color={color} intensity={0.8} position={[0, 0, -1]} />

        {/* Front HUD Elements */}
        <group position={[0, 0, 0.06]}>
          <Text
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
            fontSize={0.45}
            fontWeight={900}
            color={hovered ? '#ffffff' : color}
            anchorY="bottom"
            position={[0, 0.2, 0]}
            maxWidth={2.8}
            textAlign="center"
          >
            {name}
          </Text>
          
          <Text
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
            fontSize={0.18}
            color="#a0a0a0"
            anchorY="top"
            position={[0, -0.2, 0]}
            maxWidth={2.6}
            textAlign="center"
          >
            {desc}
          </Text>

          {/* Decorative HUD Lines */}
          <mesh position={[0, -1.2, 0]}>
            <planeGeometry args={[2, 0.02]} />
            <meshBasicMaterial color={color} transparent opacity={hovered ? 0.8 : 0.2} />
          </mesh>
          <mesh position={[-1, 1.5, 0]}>
            <circleGeometry args={[0.08, 16]} />
            <meshBasicMaterial color={color} transparent opacity={hovered ? 1 : 0.3} />
          </mesh>
          <Text
            fontSize={0.1}
            color={color}
            position={[1, 1.5, 0]}
          >
            SYS.OP.OK
          </Text>
        </group>
      </group>
    </Float>
  );
};

// Controls the entire cluster's perspective tilt based on mouse position
const ClusterController = ({ children }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const { x, y } = state.pointer; // normalized mouse coordinates -1 to +1
    
    // Smooth realistic perspective tilt
    const targetRotX = (y * Math.PI) / 12; // max tilt
    const targetRotY = (x * Math.PI) / 12;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
  });

  return <group ref={groupRef}>{children}</group>;
};

const SkillsGallery3D = () => {
  React.useEffect(() => {
    AOS.init({ once: true, easing: 'ease-out-cubic' });
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[800px] bg-black overflow-hidden flex flex-col">
      {/* Background radial gradient to frame the vast void */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,20,40,0.4),transparent_70%)] pointer-events-none z-0" />

      {/* Header Overlay */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 text-center w-full px-4 pointer-events-none" data-aos="fade-down">
        <span className="text-cyan-400 font-mono tracking-widest text-xs uppercase block mb-3 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
          // SPATIAL ARSENAL
        </span>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white drop-shadow-lg">
          Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500">Tech Core</span>
        </h2>
        <p className="text-zinc-400 max-w-md mx-auto mt-4 text-sm md:text-base leading-relaxed drop-shadow-md">
          Navigate the 3D void. Hover over modules to initialize full telemetry and holographic HUD arrays.
        </p>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 0, 10], fov: 60 }} 
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
          dpr={[1, 2]}
        >
          {/* Ambient lighting to maintain base visibility */}
          <ambientLight intensity={0.2} />
          
          {/* Environment map for realistic frosted glass reflections */}
          <Environment preset="city" />
          
          {/* Subtle directional light for depth */}
          <directionalLight position={[10, 10, 5]} intensity={0.5} color="#4444ff" />

          {/* Spatial Cluster containing all cards */}
          <ClusterController>
            {skillsData.map((skill, index) => (
              <SkillCard key={index} {...skill} />
            ))}
          </ClusterController>

        </Canvas>
      </div>
      
      {/* Footer Vignette Overlay */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
    </section>
  );
};

export default SkillsGallery3D;
