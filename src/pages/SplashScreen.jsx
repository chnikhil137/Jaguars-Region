import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Sparkles, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { supabase } from '../services/supabase';
import './SplashScreen.css';

// Atmospheric floating elements
function Atmosphere() {
  const particlesRef = useRef();

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      particlesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <group ref={particlesRef}>
      <Sparkles count={400} scale={20} size={4} speed={0.4} opacity={0.3} color="#E50914" />
      <Sparkles count={200} scale={15} size={2} speed={0.2} opacity={0.2} color="#ffffff" />
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#E50914" />
      <pointLight position={[-5, -5, -5]} intensity={0.2} color="#ffffff" />
    </group>
  );
}

export default function SplashScreen() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('intro'); // intro -> logo -> routing

  useEffect(() => {
    // Sequence Timeline
    const t1 = setTimeout(() => {
      setPhase('logo');
    }, 1000); // 1s: start showing logo

    const t2 = setTimeout(() => {
      setPhase('routing');
    }, 4500); // 4.5s: fade out

    const t3 = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/home');
      } else {
        navigate('/auth');
      }
    }, 5500); // 5.5s: navigate

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [navigate]);

  return (
    <div className="splash-screen">
      {/* 3D Background */}
      <div className="splash-canvas-container">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', 5, 20]} />
          <Atmosphere />
        </Canvas>
      </div>

      {/* Cinematic Text Overlay */}
      <div className="splash-overlay">
        <AnimatePresence>
          {phase === 'logo' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="splash-logo-container"
            >
              <h1 className="splash-title">JAGUARS REGION</h1>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, delay: 0.5, ease: 'easeInOut' }}
                className="splash-line"
              />
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="splash-subtitle"
              >
                THE AGGRESSIVE FILM COMMUNITY
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
