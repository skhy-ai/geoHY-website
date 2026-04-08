import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Surface Plant Components
const SurfacePlant = () => {
  const metalMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.3 }), []);
  const glassWater = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x0EA5E9, transparent: true, opacity: 0.4, metalness: 0.1, roughness: 0.1 }), []);
  const glassCO2 = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xA855F7, transparent: true, opacity: 0.4, metalness: 0.1, roughness: 0.1 }), []);
  const glassHy10 = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x22D3EE, transparent: true, opacity: 0.4, metalness: 0.1, roughness: 0.1 }), []);
  const glassHC = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xFBBF24, transparent: true, opacity: 0.4, metalness: 0.1, roughness: 0.1 }), []);
  const hxMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x333333, emissive: new THREE.Color(0x9A3412), metalness: 0.8, roughness: 0.4 }), []);

  return (
    <group>
      {/* Base pad */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[25, 25, 1, 64]} />
        <meshStandardMaterial color={0x1E293B} />
      </mesh>

      {/* Wellhead */}
      <mesh position={[0, 1.5, 0]} material={metalMat}>
        <cylinderGeometry args={[1.5, 1.5, 3, 16]} />
      </mesh>

      {/* Water Supply Tank */}
      <mesh position={[-12, 4, 8]} material={glassWater}>
        <cylinderGeometry args={[3, 3, 8, 32]} />
      </mesh>
      <mesh position={[-12, 3.5, 8]}>
        <cylinderGeometry args={[2.8, 2.8, 7, 32]} />
        <meshBasicMaterial color={0x0EA5E9} />
      </mesh>

      {/* CO2 Supply Sphere */}
      <mesh position={[-12, 4, -8]} material={glassCO2}>
        <sphereGeometry args={[4, 32, 32]} />
      </mesh>
      <mesh position={[-12, 4, -8]}>
        <sphereGeometry args={[3.8, 32, 32]} />
        <meshBasicMaterial color={0xA855F7} />
      </mesh>

      {/* Heat Exchanger */}
      <mesh position={[8, 2, 0]} material={hxMat}>
        <boxGeometry args={[6, 4, 8]} />
      </mesh>

      {/* Separator */}
      <mesh position={[16, 7, 0]} material={metalMat}>
        <cylinderGeometry args={[2, 2, 14, 32]} />
      </mesh>

      {/* Hy10 Storage */}
      <mesh position={[24, 3.5, 8]} material={glassHy10}>
        <sphereGeometry args={[3.5, 32, 32]} />
      </mesh>
      <mesh position={[24, 3.5, 8]}>
        <sphereGeometry args={[3.3, 32, 32]} />
        <meshBasicMaterial color={0x22D3EE} />
      </mesh>

      {/* HC Storage */}
      <mesh position={[24, 3, -8]} rotation={[Math.PI / 2, 0, 0]} material={glassHC}>
        <cylinderGeometry args={[3, 3, 10, 32]} />
      </mesh>
      <mesh position={[24, 3, -8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.8, 2.8, 9.8, 32]} />
        <meshBasicMaterial color={0xFBBF24} />
      </mesh>
    </group>
  );
};

// ORC Turbine
const ORCTurbine = () => {
  const rotorRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (rotorRef.current) rotorRef.current.rotateY(0.15);
  });

  const blades = useMemo(() => {
    const items: JSX.Element[] = [];
    for (let s = 0; s < 4; s++) {
      const stageY = -2.2 + s * 1.46;
      for (let i = 0; i < 12; i++) {
        items.push(
          <mesh
            key={`${s}-${i}`}
            position={[0, stageY, 0]}
            rotation={[Math.PI / 6, (i * Math.PI * 2) / 12, 0]}
          >
            <boxGeometry args={[0.4, 1.6, 0.05]} />
            <meshStandardMaterial color={0x94A3B8} metalness={0.8} roughness={0.2} />
          </mesh>
        );
      }
    }
    return items;
  }, []);

  return (
    <group position={[8, 2.2, -10]}>
      {/* Base */}
      <mesh position={[0, -1.6, 0]}>
        <boxGeometry args={[4, 1.2, 3]} />
        <meshStandardMaterial color={0x333333} />
      </mesh>
      {/* Housing */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[2.2, 2.2, 6, 32]} />
        <meshStandardMaterial color={0x4C1D95} metalness={0.6} roughness={0.4} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Rotor */}
      <group ref={rotorRef} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.4, 0.4, 6.5, 16]} />
          <meshStandardMaterial color={0x475569} metalness={0.9} roughness={0.3} />
        </mesh>
        {blades}
      </group>
    </group>
  );
};

// Derrick
const Derrick = () => {
  const geo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.5, 3, 16, 4);
    return new THREE.EdgesGeometry(g);
  }, []);

  return (
    <lineSegments position={[0, 8, 0]} geometry={geo}>
      <lineBasicMaterial color={0xF97316} />
    </lineSegments>
  );
};

// Underground structure
const Underground = () => {
  const lateralMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xEA580C, metalness: 0.5, roughness: 0.5, emissive: new THREE.Color(0x7C2D12) }), []);

  const branches = useMemo(() => {
    const items: JSX.Element[] = [];
    for (let i = -15; i <= 15; i += 5) {
      items.push(
        <mesh key={i} rotation={[0, 0, Math.PI / 2]} position={[0, 0, i]} material={lateralMat}>
          <cylinderGeometry args={[0.4, 0.4, 20, 16]} />
        </mesh>
      );
    }
    return items;
  }, [lateralMat]);

  return (
    <group>
      {/* Earth Crust wireframe layers */}
      <mesh position={[0, -20, 0]}>
        <cylinderGeometry args={[30, 30, 40, 16]} />
        <meshBasicMaterial color={0x1E293B} wireframe transparent opacity={0.15} />
      </mesh>
      <mesh position={[0, -60, 0]}>
        <cylinderGeometry args={[30, 30, 40, 16]} />
        <meshBasicMaterial color={0xEA580C} wireframe transparent opacity={0.08} />
      </mesh>

      {/* Vertical Wellbore */}
      <mesh position={[0, -40, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 80, 16]} />
        <meshStandardMaterial color={0x475569} metalness={0.9} roughness={0.1} transparent opacity={0.6} />
      </mesh>

      {/* Lattice Network */}
      <group position={[0, -78, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={lateralMat}>
          <cylinderGeometry args={[0.6, 0.6, 40, 16]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[10, 0, 0]} material={lateralMat}>
          <cylinderGeometry args={[0.4, 0.4, 40, 16]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[-10, 0, 0]} material={lateralMat}>
          <cylinderGeometry args={[0.4, 0.4, 40, 16]} />
        </mesh>
        {branches}
      </group>
    </group>
  );
};

// Particle System
const ParticleSystem = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particlesCount = 800;

  const P_WH = useMemo(() => new THREE.Vector3(0, 2, 0), []);
  const P_H2O = useMemo(() => new THREE.Vector3(-12, 2, 8), []);
  const P_CO2 = useMemo(() => new THREE.Vector3(-12, 2, -8), []);
  const P_HX = useMemo(() => new THREE.Vector3(8, 2, 0), []);
  const P_SEP = useMemo(() => new THREE.Vector3(16, 2, 0), []);
  const P_HY10 = useMemo(() => new THREE.Vector3(24, 2, 8), []);
  const P_HC = useMemo(() => new THREE.Vector3(24, 2, -8), []);

  const colors = useMemo(() => ({
    water_down: new THREE.Color(0x0EA5E9),
    co2_down: new THREE.Color(0xA855F7),
    react: new THREE.Color(0xEF4444),
    hc: new THREE.Color(0xFBBF24),
    hy10: new THREE.Color(0x22D3EE),
    water_up: new THREE.Color(0x3B82F6),
  }), []);

  const states = ["surf_inject", "bore_down", "lattice", "bore_up", "surf_hx", "surf_sep", "surf_store"];

  const { positions, colorArr, particleData } = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const col = new Float32Array(particlesCount * 3);
    const data: Array<{
      state: string; type: number; product: string; speed: number;
      latticeLife: number; angle: number; radius: number; latDirX: number; latDirZ: number;
    }> = [];

    for (let i = 0; i < particlesCount; i++) {
      const initState = states[Math.floor(Math.random() * states.length)];
      const pType = Math.random();
      data.push({
        state: initState, type: pType, product: "",
        speed: 0.3 + Math.random() * 0.3,
        latticeLife: Math.random() * 80,
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 0.6,
        latDirX: 0, latDirZ: 0,
      });
      pos[i * 3] = 0;
      pos[i * 3 + 1] = Math.random() * -78;
      pos[i * 3 + 2] = 0;

      let c = pType > 0.5 ? colors.water_down : colors.co2_down;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colorArr: col, particleData: data };
  }, [colors]);

  const moveTowards = useCallback((cx: number, cy: number, cz: number, target: THREE.Vector3, speed: number) => {
    const dx = target.x - cx, dy = target.y - cy, dz = target.z - cz;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist < speed) return { x: target.x, y: target.y, z: target.z, reached: true };
    return { x: cx + (dx / dist) * speed, y: cy + (dy / dist) * speed, z: cz + (dz / dist) * speed, reached: false };
  }, []);

  const updateColor = useCallback((col: Float32Array, i: number, state: string, type: number, product: string) => {
    let c = colors.water_down;
    if (state === "surf_inject" || state === "bore_down") c = type > 0.5 ? colors.water_down : colors.co2_down;
    else if (state === "lattice") c = colors.react;
    else {
      if (product === "hc") c = colors.hc;
      else if (product === "hy10") c = colors.hy10;
      else c = colors.water_up;
    }
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }, [colors]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const col = pointsRef.current.geometry.attributes.color.array as Float32Array;

    for (let i = 0; i < particlesCount; i++) {
      let x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
      const d = particleData[i];

      if (d.state === "bore_down") {
        y -= d.speed;
        d.angle += 0.05;
        x = Math.cos(d.angle) * d.radius;
        z = Math.sin(d.angle) * d.radius;
        if (y < -78) {
          d.state = "lattice"; y = -78;
          d.latticeLife = 60 + Math.random() * 60;
          if (Math.random() > 0.5) { d.latDirX = (Math.random() > 0.5 ? 1 : -1) * d.speed; d.latDirZ = 0; }
          else { d.latDirX = 0; d.latDirZ = (Math.random() > 0.5 ? 1 : -1) * d.speed; }
          updateColor(col, i, "lattice", d.type, d.product);
        }
      } else if (d.state === "lattice") {
        x += d.latDirX; z += d.latDirZ;
        d.latticeLife--;
        if (x > 15 || x < -15) d.latDirX *= -1;
        if (z > 15 || z < -15) d.latDirZ *= -1;
        if (d.latticeLife <= 0) {
          d.state = "bore_up";
          const r = Math.random();
          if (r < 0.3) d.product = "hc";
          else if (r < 0.7) d.product = "hy10";
          else d.product = "water";
          updateColor(col, i, "bore_up", d.type, d.product);
        }
      } else if (d.state === "bore_up") {
        y += d.speed;
        x += (0 - x) * 0.1; z += (0 - z) * 0.1;
        if (y >= 0) { y = 0; d.state = "surf_hx"; }
      } else if (d.state === "surf_hx") {
        const res = moveTowards(x, y, z, P_HX, d.speed);
        x = res.x; y = res.y; z = res.z;
        if (res.reached) d.state = "surf_sep";
      } else if (d.state === "surf_sep") {
        const res = moveTowards(x, y, z, P_SEP, d.speed);
        x = res.x; y = res.y; z = res.z;
        if (res.reached) d.state = "surf_store";
      } else if (d.state === "surf_store") {
        let target = P_H2O;
        if (d.product === "hc") target = P_HC;
        if (d.product === "hy10") target = P_HY10;
        const res = moveTowards(x, y, z, target, d.speed);
        x = res.x; y = res.y; z = res.z;
        if (res.reached) {
          d.state = "surf_inject";
          d.type = Math.random();
          const source = d.type > 0.5 ? P_H2O : P_CO2;
          x = source.x + (Math.random() - 0.5) * 2;
          y = source.y;
          z = source.z + (Math.random() - 0.5) * 2;
          updateColor(col, i, "surf_inject", d.type, d.product);
        }
      } else if (d.state === "surf_inject") {
        const res = moveTowards(x, y, z, P_WH, d.speed);
        x = res.x; y = res.y; z = res.z;
        if (res.reached) d.state = "bore_down";
      }

      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colorArr, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.8} vertexColors transparent opacity={0.9} blending={THREE.AdditiveBlending} />
    </points>
  );
};

// Piping
const Piping = () => {
  const pipeMat = useMemo(() => new THREE.LineBasicMaterial({ color: 0x94A3B8 }), []);
  const pipes = useMemo(() => {
    const segments: [THREE.Vector3, THREE.Vector3][] = [
      [new THREE.Vector3(-12, 2, 8), new THREE.Vector3(0, 2, 0)],
      [new THREE.Vector3(-12, 2, -8), new THREE.Vector3(0, 2, 0)],
      [new THREE.Vector3(0, 2, 0), new THREE.Vector3(8, 2, 0)],
      [new THREE.Vector3(8, 2, 0), new THREE.Vector3(16, 2, 0)],
      [new THREE.Vector3(8, 2, 0), new THREE.Vector3(8, 2, -10)],
      [new THREE.Vector3(16, 2, 0), new THREE.Vector3(24, 2, 8)],
      [new THREE.Vector3(16, 2, 0), new THREE.Vector3(24, 2, -8)],
    ];
    return segments;
  }, []);

  return (
    <>
      {pipes.map(([a, b], i) => {
        const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
        return <primitive key={i} object={new THREE.Line(geo, pipeMat)} />;
      })}
    </>
  );
};

// Slow auto-rotation group
const RotatingGroup = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.001;
  });

  return (
    <group ref={groupRef}>
      <SurfacePlant />
      <ORCTurbine />
      <Derrick />
      <Underground />
      <ParticleSystem />
      <Piping />
    </group>
  );
};

const ReactorScene = () => {
  return (
    <Canvas
      camera={{ position: [40, 20, 60], fov: 45, near: 0.1, far: 1000 }}
      style={{ background: "#0B0F19" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[50, 100, 50]} intensity={0.8} />
      <pointLight position={[0, -90, 0]} color={0xEA580C} intensity={2} distance={200} />
      <fog attach="fog" args={["#0B0F19", 100, 400]} />
      <RotatingGroup />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2 + 0.1}
        target={[0, -10, 0]}
      />
    </Canvas>
  );
};

export default ReactorScene;
