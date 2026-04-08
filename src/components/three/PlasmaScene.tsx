import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

const PlasmaSimulation = () => {
  const plasmaArcRef = useRef<THREE.Mesh>(null);
  const plasmaCoreRef = useRef<THREE.Mesh>(null);
  const plasmaLightRef = useRef<THREE.PointLight>(null);
  const drillStringRef = useRef<THREE.Mesh>(null);
  const toolHeadRef = useRef<THREE.Mesh>(null);
  const particleRef = useRef<THREE.Points>(null);

  const particlesCount = 200;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const vel: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = 6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      vel.push({
        x: -Math.random() * 0.5 - 0.1,
        y: (Math.random() - 0.5) * 0.2,
        z: (Math.random() - 0.5) * 0.2,
      });
    }
    return { positions: pos, velocities: vel };
  }, []);

  // Telemetry pulses
  const pulseRefs = useRef<THREE.Mesh[]>([]);

  useFrame(() => {
    // Flicker plasma
    const scale = 0.8 + Math.random() * 0.4;
    if (plasmaArcRef.current) plasmaArcRef.current.scale.set(scale, 1, scale);
    if (plasmaCoreRef.current) plasmaCoreRef.current.scale.set(scale, 1, scale);
    if (plasmaLightRef.current) plasmaLightRef.current.intensity = 2 + Math.random() * 2;

    // Rotate drill string
    if (drillStringRef.current) drillStringRef.current.rotation.x += 0.02;
    if (toolHeadRef.current) toolHeadRef.current.rotation.x += 0.02;

    // Animate pulses
    pulseRefs.current.forEach((p) => {
      if (p) {
        p.position.x -= 0.2;
        if (p.position.x < -20) p.position.x = 2;
      }
    });

    // Animate particles
    if (particleRef.current) {
      const pos = particleRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        pos[i * 3] += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;
        if (pos[i * 3] < -10) {
          pos[i * 3] = 6;
          pos[i * 3 + 1] = (Math.random() - 0.5) * 3;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
        }
      }
      particleRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Tunnel */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[4, 4, 40, 16]} />
        <meshStandardMaterial color={0x94A3B8} roughness={0.9} side={THREE.BackSide} wireframe transparent opacity={0.8} />
      </mesh>

      {/* Drill String */}
      <mesh ref={drillStringRef} rotation={[0, 0, Math.PI / 2]} position={[-14.5, 0, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 20, 16]} />
        <meshStandardMaterial color={0x475569} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* AI Robotics Module */}
      <group position={[-2.5, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.6, 1.6, 4, 8]} />
          <meshStandardMaterial color={0x2563EB} emissive={0x1D4ED8} emissiveIntensity={0.5} metalness={0.7} roughness={0.3} />
          <Html position={[0, -2, 0]} center distanceFactor={25}>
            <div className="px-2 py-1 bg-black/60 backdrop-blur-sm border border-blue-500/50 text-[10px] text-white rounded font-mono whitespace-nowrap">
              AI ROBOTICS MODULE
            </div>
          </Html>
        </mesh>
        {/* LED Rings */}
        <mesh rotation={[0, Math.PI / 2, 0]} position={[1.5, 0, 0]}>
          <torusGeometry args={[1.65, 0.05, 16, 16]} />
          <meshBasicMaterial color={0x06b6d4} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]} position={[-1.5, 0, 0]}>
          <torusGeometry args={[1.65, 0.05, 16, 16]} />
          <meshBasicMaterial color={0x06b6d4} />
        </mesh>
        {/* Stabilizer pads */}
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[
              0,
              i % 2 === 0 ? (i === 0 ? 1.8 : -1.8) : 0,
              i % 2 !== 0 ? (i === 1 ? 1.8 : -1.8) : 0,
            ]}
            rotation={[i % 2 !== 0 ? Math.PI / 2 : 0, 0, 0]}
          >
            <boxGeometry args={[2, 0.4, 0.8]} />
            <meshStandardMaterial color={0x333333} metalness={0.5} roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Tool Head */}
      <mesh ref={toolHeadRef} rotation={[0, 0, -Math.PI / 2]} position={[1.0, 0, 0]}>
        <cylinderGeometry args={[1.5, 0.5, 3, 16]} />
        <meshStandardMaterial color={0x0a0a0a} metalness={0.9} roughness={0.8} />
      </mesh>

      {/* Fiber Optic Line */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[-12, 1.45, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 25, 8]} />
        <meshBasicMaterial color={0x0EA5E9} />
      </mesh>

      {/* Telemetry Pulses */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) pulseRefs.current[i] = el; }}
          position={[-20 + i * 8, 1.45, 0]}
        >
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshBasicMaterial color={0xffffff} />
        </mesh>
      ))}

      {/* Plasma Arc */}
      <mesh ref={plasmaArcRef} rotation={[0, 0, -Math.PI / 2]} position={[4.0, 0, 0]}>
        <cylinderGeometry args={[0.1, 1.2, 3, 16]} />
        <meshBasicMaterial color={0xD8B4FE} transparent opacity={0.9} blending={THREE.AdditiveBlending} />
        <Html position={[0, -2, 0]} center distanceFactor={25}>
          <div className="px-2 py-1 bg-black/60 backdrop-blur-sm border border-purple-500/50 text-[10px] text-white rounded font-mono whitespace-nowrap">
            PLASMA ARC (THERMAL SPALLATION)
          </div>
        </Html>
      </mesh>

      {/* Plasma Core */}
      <mesh ref={plasmaCoreRef} rotation={[0, 0, -Math.PI / 2]} position={[3.7, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.4, 2.5, 16]} />
        <meshBasicMaterial color={0xffffff} transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </mesh>

      <pointLight ref={plasmaLightRef} position={[0, 0, 0]} color={0xD8B4FE} intensity={6} distance={20} />

      {/* Spallation Particles */}
      <points ref={particleRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={0xEA580C} size={0.15} transparent opacity={0.8} />
      </points>
    </group>
  );
};

const PlasmaScene = () => {
  return (
    <Canvas
      camera={{ position: [-15, 5, -20], fov: 50, near: 0.1, far: 100 }}
      style={{ background: "black" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[-10, 20, -10]} intensity={1.2} />
      <pointLight position={[-5, 0, 0]} intensity={3} distance={40} />
      <fogExp2 attach="fog" args={["#000000", 0.03]} />
      <PlasmaSimulation />
      <OrbitControls enableDamping dampingFactor={0.05} />
    </Canvas>
  );
};

export default PlasmaScene;
