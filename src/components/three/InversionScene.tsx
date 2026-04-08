import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const VoxelCloud = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particlesCount = 12000;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const col = new Float32Array(particlesCount * 3);
    const colorRed = new THREE.Color(0xef4444);
    const colorYellow = new THREE.Color(0xeab308);
    const colorGreen = new THREE.Color(0x22c55e);
    const coreCenter = new THREE.Vector3(2, -5, -3);
    const coreRadius = 8;
    const transitionRadius = 14;

    for (let i = 0; i < particlesCount; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 40;
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;

      const distToCore = Math.sqrt(
        Math.pow(x - coreCenter.x, 2) + Math.pow(y - coreCenter.y, 2) + Math.pow(z - coreCenter.z, 2)
      );
      const noise = (Math.random() - 0.5) * 4;
      const effectiveDist = distToCore + noise;

      let c = colorRed;
      if (effectiveDist < coreRadius) c = colorGreen;
      else if (effectiveDist < transitionRadius) c = colorYellow;

      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.size = 0.5 + Math.sin(clock.getElapsedTime() * 2) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.6} vertexColors transparent opacity={0.7} blending={THREE.AdditiveBlending} />
    </points>
  );
};

const TargetBox = () => {
  const geo = useMemo(() => {
    const g = new THREE.BoxGeometry(18, 16, 18);
    return new THREE.EdgesGeometry(g);
  }, []);

  return (
    <lineSegments position={[2, -5, -3]} geometry={geo}>
      <lineBasicMaterial color={0x22c55e} />
    </lineSegments>
  );
};

const ScanPlane = ({ onDepthChange }: { onDepthChange?: (depth: string) => void }) => {
  const planeRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  const edgesGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(45, 45);
    return new THREE.EdgesGeometry(g);
  }, []);

  useFrame(({ clock }) => {
    const scanY = Math.sin(clock.getElapsedTime()) * 15;
    if (planeRef.current) planeRef.current.position.y = scanY;
    if (lineRef.current) lineRef.current.position.y = scanY;
    if (onDepthChange) {
      const mappedDepth = 4 + ((15 - scanY) / 30) * 4;
      onDepthChange(`-${mappedDepth.toFixed(2)} km`);
    }
  });

  return (
    <>
      <mesh ref={planeRef} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[45, 45]} />
        <meshBasicMaterial color={0x0EA5E9} transparent opacity={0.2} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <lineSegments ref={lineRef} rotation={[Math.PI / 2, 0, 0]} geometry={edgesGeo}>
        <lineBasicMaterial color={0x0EA5E9} />
      </lineSegments>
    </>
  );
};

const SurfaceGrid = () => (
  <gridHelper args={[60, 20, 0xEA580C, 0x1E293B]} position={[0, 15, 0]} />
);

interface InversionSceneProps {
  onDepthChange?: (depth: string) => void;
}

const InversionScene = ({ onDepthChange }: InversionSceneProps) => {
  return (
    <Canvas
      camera={{ position: [40, 30, 50], fov: 45, near: 0.1, far: 1000 }}
      style={{ background: "black" }}
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[20, 50, 20]} intensity={0.8} />
      <fogExp2 attach="fog" args={["#0B0F19", 0.015]} />
      <group>
        <SurfaceGrid />
        <VoxelCloud />
        <TargetBox />
        <ScanPlane onDepthChange={onDepthChange} />
      </group>
      <OrbitControls enableDamping dampingFactor={0.05} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
};

export default InversionScene;
