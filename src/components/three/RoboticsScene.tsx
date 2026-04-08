import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

const Tunnel = () => (
  <group>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[4, 4, 60, 32]} />
      <meshStandardMaterial color={0x64748B} roughness={1} metalness={0.1} side={THREE.BackSide} />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[3.95, 3.95, 60, 16, 20]} />
      <meshBasicMaterial color={0x94A3B8} wireframe transparent opacity={0.4} />
    </mesh>
  </group>
);

const Robot = () => {
  const reamerRef = useRef<THREE.Group>(null);
  const robotRef = useRef<THREE.Group>(null);
  const particleRef = useRef<THREE.Points>(null);

  const particlesCount = 300;
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const vel: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < particlesCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 2.0;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.sin(angle) * r;
      pos[i * 3 + 2] = -3.5;
      vel.push({
        x: Math.cos(angle) * (Math.random() * 0.1),
        y: Math.sin(angle) * (Math.random() * 0.1),
        z: Math.random() * 0.4 + 0.1,
      });
    }
    return { positions: pos, velocities: vel };
  }, []);

  const pads = useMemo(() => {
    const items: JSX.Element[] = [];
    for (let i = 0; i < 4; i++) {
      items.push(
        <group key={i} rotation={[0, 0, (Math.PI / 2) * i]} scale={1.4}>
          <mesh position={[0, 1.25, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 2.5, 8]} />
            <meshStandardMaterial color={0x94A3B8} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 2.5, 0]}>
            <boxGeometry args={[1.5, 0.2, 3]} />
            <meshStandardMaterial color={0x475569} metalness={0.4} roughness={0.9} />
          </mesh>
        </group>
      );
    }
    return items;
  }, []);

  const teeth = useMemo(() => {
    const items: JSX.Element[] = [];
    for (let i = 0; i < 12; i++) {
      items.push(
        <mesh
          key={i}
          position={[Math.cos(i * Math.PI / 6) * 1.9, Math.sin(i * Math.PI / 6) * 1.9, -0.6]}
          rotation={[0.2, 0, i * Math.PI / 6]}
        >
          <boxGeometry args={[0.3, 0.5, 0.4]} />
          <meshStandardMaterial color={0x0a0a0a} metalness={0.5} roughness={0.9} />
        </mesh>
      );
    }
    return items;
  }, []);

  useFrame(() => {
    if (reamerRef.current) reamerRef.current.rotation.z += 0.1;
    if (robotRef.current) robotRef.current.position.z -= 0.01;

    if (particleRef.current) {
      const pos = particleRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        pos[i * 3] += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;
        if (pos[i * 3 + 2] > 5) {
          const angle = Math.random() * Math.PI * 2;
          pos[i * 3] = Math.cos(angle) * 2.0;
          pos[i * 3 + 1] = Math.sin(angle) * 2.0;
          pos[i * 3 + 2] = -3.5;
        }
      }
      particleRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={robotRef}>
      {/* Chassis */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 5, 16]} />
        <meshStandardMaterial color={0x2563EB} emissive={0x1D4ED8} emissiveIntensity={0.5} metalness={0.8} roughness={0.4} />
        <Html position={[0, 2, 0]} center distanceFactor={25}>
          <div className="px-2 py-1 bg-black/60 backdrop-blur-sm border border-blue-500/50 text-[10px] text-white rounded font-mono whitespace-nowrap">
            AUTONOMOUS ROBOTICS CHASSIS
          </div>
        </Html>
      </mesh>
      {/* Sensor Rings */}
      <mesh position={[0, 0, 1.5]}>
        <torusGeometry args={[1.25, 0.05, 16, 32]} />
        <meshBasicMaterial color={0x0EA5E9} />
      </mesh>
      <mesh position={[0, 0, -1.5]}>
        <torusGeometry args={[1.25, 0.05, 16, 32]} />
        <meshBasicMaterial color={0x0EA5E9} />
      </mesh>
      {/* Stabilizer Pads */}
      {pads}
      {/* Reamer */}
      <group ref={reamerRef} position={[0, 0, -3]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.0, 1.8, 1.5, 16]} />
          <meshStandardMaterial color={0xCBD5E1} metalness={0.9} roughness={0.2} />
        </mesh>
        {teeth}
        <Html position={[0, 2, 0]} center distanceFactor={20}>
          <div className="px-2 py-1 bg-black/60 backdrop-blur-sm border border-red-500/50 text-[10px] text-white rounded font-mono whitespace-nowrap">
            MECHANICAL REAMER
          </div>
        </Html>
      </group>
      {/* Debris Particles */}
      <points ref={particleRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={0xEA580C} size={0.15} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
};

const RoboticsScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 100 }}
      style={{ background: "black" }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 2]} intensity={3} distance={30} />
      <pointLight position={[0, 0, -20]} color={0xEA580C} intensity={2} distance={50} />
      <fogExp2 attach="fog" args={["#000000", 0.05]} />
      <Tunnel />
      <Robot />
      <OrbitControls enableDamping dampingFactor={0.05} maxDistance={8} />
    </Canvas>
  );
};

export default RoboticsScene;
