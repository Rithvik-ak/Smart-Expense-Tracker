'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, Environment, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef();
  
  const [positions] = useMemo(() => {
    const positions = new Float32Array(800 * 3);
    for (let i = 0; i < 800; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return [positions];
  }, []);

  useFrame((state) => {
    ref.current.rotation.x = state.clock.getElapsedTime() * 0.03;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8ab4f8"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function FloatingShapes() {
  const torusRef = useRef();
  const octaRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    torusRef.current.rotation.x = Math.sin(t / 4);
    torusRef.current.rotation.y = Math.sin(t / 2);
    octaRef.current.rotation.y = t * 0.5;
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
        <mesh position={[-3, 1.5, -1]} scale={1.5}>
          <icosahedronGeometry args={[1, 0]} />
          <MeshTransmissionMaterial 
             backside
             backsideThickness={1}
             thickness={0.5}
             roughness={0}
             transmission={1}
             ior={1.5}
             chromaticAberration={0.4}
             transparent
             color="#3b82f6"
          />
        </mesh>
      </Float>
      <Float speed={2.5} rotationIntensity={2} floatIntensity={1}>
        <mesh ref={octaRef} position={[3, -1, 1]} scale={1.2}>
          <torusKnotGeometry args={[0.5, 0.2, 100, 16]} />
          <MeshTransmissionMaterial 
             backside
             thickness={1}
             roughness={0}
             transmission={1}
             ior={1.2}
             chromaticAberration={0.8}
             color="#8b5cf6"
          />
        </mesh>
      </Float>
      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        <mesh ref={torusRef} position={[0, -2.5, -2]} scale={1.3}>
          <torusGeometry args={[1, 0.3, 16, 50]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} wireframe />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 7], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#4f46e5" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#e11d48" />
        <Environment preset="city" />
        <ParticleField />
        <FloatingShapes />
      </Canvas>
    </div>
  );
}
