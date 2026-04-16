'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, Environment, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef();
  
  const [positions] = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return [positions];
  }, []);

  useFrame((state) => {
    ref.current.rotation.x = state.clock.getElapsedTime() * 0.05;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.03;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#2563eb"
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function FloatingShapes() {
  return (
    <group>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Sphere args={[0.5, 32, 32]} position={[-2, 1, 0]}>
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.2} roughness={0} metalness={0.8} />
        </Sphere>
      </Float>
      <Float speed={3} rotationIntensity={2} floatIntensity={1}>
        <mesh position={[2, -1, 1]}>
          <octahedronGeometry args={[0.4]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.2} roughness={0} metalness={0.8} />
        </mesh>
      </Float>
      <Float speed={4} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[0, -2, -2]}>
          <torusGeometry args={[0.3, 0.1, 16, 32]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.2} roughness={0} metalness={0.8} />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <Environment preset="apartment" />
        <ParticleField />
        <FloatingShapes />
      </Canvas>
    </div>
  );
}
