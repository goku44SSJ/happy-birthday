import React, { Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, Html, Text, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// --- STYLING CONSTANTS ---
const CLAY_MATERIAL = new THREE.MeshStandardMaterial({
  color: "#ff8f8f", // Base clay pink
  roughness: 1,     // Matte finish
  metalness: 0,
});

const BOX_COLOR = "#ff6b6b";
const RIBBON_COLOR = "#ff0000";
const WALL_THICKNESS = 0.2;
const BOX_SIZE = 4;

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#ffe0e0' }}>
      <Canvas shadows camera={{ position: [0, 5, 12], fov: 35 }}>
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-bias={-0.0001} castShadow />
        <Environment preset="sunset" />
        
        <ScrollControls pages={6} damping={0.2}>
          <Experience />
        </ScrollControls>
      </Canvas>
    </div>
  );
}

function Experience() {
  const scroll = useScroll();
  const sceneRef = useRef();
  
  // Animation Logic using useFrame to interpolate based on scroll.offset
  useFrame((state) => {
    const offset = scroll.offset; // 0 to 1
    
    // 1. Camera Movement (Pan from overview to inside)
    // Start: [0, 5, 12] -> Zoom In: [0, 1, 4] -> Focus on frames
    const camPos = state.camera.position;
    
    if (offset < 0.2) {
      // Intro: Static overview
      camPos.set(0, 5 - offset * 5, 12 - offset * 10);
    } else if (offset >= 0.2 && offset < 0.8) {
        // Inside the room logic (handled within Room component usually, but simple lerp here)
        // We gently bob the camera or move it closer to walls
    }
  });

  return (
    <>
      <group ref={sceneRef}>
        {/* The Gift Box & Diorama */}
        <GiftBox scroll={scroll} />
        
        {/* The Finale Heart (Hidden initially) */}
        <Finale scroll={scroll} />
      </group>
      
      {/* Ground Shadow for Clay look */}
      <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={20} blur={2} far={4} color="#8a4b4b" />
    </>
  );
}