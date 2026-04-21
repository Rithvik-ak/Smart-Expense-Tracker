'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

function BudgetRing({ percentage }) {
  const meshRef = useRef();
  const innerMeshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(t / 2) * 0.1;
      meshRef.current.rotation.y = t * 0.2;
    }
  });

  const radius = 2;
  const tubeRadius = 0.4;
  const segments = 64;

  const color = percentage > 90 ? '#ef4444' : percentage > 70 ? '#f59e0b' : '#3b82f6';

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <torusGeometry args={[radius, tubeRadius, 16, segments]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={0.5} 
            metalness={0.8} 
            roughness={0.2} 
          />
        </mesh>
        
        {/* Inner sphere to represent the "core" of the budget */}
        <mesh ref={innerMeshRef}>
          <sphereGeometry args={[radius - 0.5, 32, 32]} />
          <meshStandardMaterial 
            color="#1e293b" 
            metalness={0.9} 
            roughness={0.1} 
            transparent 
            opacity={0.8} 
          />
        </mesh>

        <Text
          position={[0, 0, 0.5]}
          fontSize={0.6}
          color="white"
          font="/fonts/Geist-Bold.ttf" // Fallback if font doesn't load
          anchorX="center"
          anchorY="middle"
        >
          {`${Math.round(percentage)}%`}
        </Text>
      </Float>
    </group>
  );
}

export default function BudgetScene({ percentage = 0 }) {
  return (
    <div className="h-[300px] w-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        <Environment preset="studio" />
        
        <BudgetRing percentage={percentage} />
        
        <ContactShadows position={[0, -3, 0]} opacity={0.2} scale={10} blur={3} far={4} />
      </Canvas>
    </div>
  );
}
