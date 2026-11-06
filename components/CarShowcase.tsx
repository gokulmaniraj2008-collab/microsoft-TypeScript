"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type CameraPreset = "front" | "rear" | "side" | "top" | "interior";

type CarShowcaseProps = {
  paint: string;
  wheelStyle: string;
  cameraPreset: CameraPreset;
  doorOpen: number;
  bonnetOpen: number;
  bootOpen: number;
};

const cameraViews: Record<CameraPreset, [number, number, number]> = {
  front: [0, 2.1, 6.3],
  rear: [0, 2.1, -6.3],
  side: [6.3, 1.8, 0],
  top: [0, 8.2, 0.2],
  interior: [0, 1.55, 0.15],
};

function Wheel({ x, z, wheelStyle }: { x: number; z: number; wheelStyle: string }) {
  const rimColor = wheelStyle === "track" ? "#aeb8c2" : wheelStyle === "sport" ? "#7d8792" : "#c5cbd1";
  const spokeCount = wheelStyle === "track" ? 10 : wheelStyle === "sport" ? 7 : 5;
  return (
    <group position={[x, 0.48, z]} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.47, 0.47, 0.3, 48]} />
        <meshStandardMaterial color="#090b0e" roughness={0.82} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.158, 0]} castShadow>
        <cylinderGeometry args={[0.31, 0.31, 0.018, 48]} />
        <meshStandardMaterial color={rimColor} metalness={0.92} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.171, 0]}>
        <cylinderGeometry args={[0.105, 0.105, 0.025, 32]} />
        <meshStandardMaterial color="#171c22" metalness={0.8} roughness={0.3} />
      </mesh>
      {Array.from({ length: spokeCount }, (_, i) => (
        <mesh key={i} position={[0, 0.174, 0]} rotation={[0, (i / spokeCount) * Math.PI * 2, 0]}>
          <boxGeometry args={[0.045, 0.022, 0.52]} />
          <meshStandardMaterial color={rimColor} metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.03, 24]} />
        <meshStandardMaterial color="#d9e0e7" metalness={1} roughness={0.18} />
      </mesh>
      {Array.from({ length: 24 }, (_, i) => (
        <mesh key={i} position={[0, 0, 0]} rotation={[0, 0, (i / 24) * Math.PI * 2]}>
          <boxGeometry args={[0.025, 0.035, 0.49]} />
          <meshStandardMaterial color="#252a30" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Door({ side, open }: { side: -1 | 1; open: number }) {
  const pivot = useRef<THREE.Group>(null);
  useEffect(() => {
    if (pivot.current) pivot.current.rotation.y = side * open * 0.95;
  }, [open, side]);
  return (
    <group ref={pivot} position={[side * 0.91, 0.83, 0.05]}>
      <RoundedBox args={[0.12, 0.66, 1.52]} radius={0.08} smoothness={4} position={[side * 0.04, -0.12, 0]} castShadow>
        <meshPhysicalMaterial color="#202831" metalness={0.72} roughness={0.28} />
      </RoundedBox>
      <mesh position={[side * 0.045, 0.31, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.035, 0.38, 1.32]} />
        <meshPhysicalMaterial color="#101d2b" metalness={0.45} roughness={0.12} transparent opacity={0.78} />
      </mesh>
      <mesh position={[side * 0.11, -0.1, -0.1]}>
        <boxGeometry args={[0.025, 0.035, 0.18]} />
        <meshStandardMaterial color="#c7cdd2" metalness={0.95} roughness={0.2} />
      </mesh>
      <mesh position={[side * 0.1, -0.3, 0.43]}>
        <boxGeometry args={[0.02, 0.08, 0.06]} />
        <meshStandardMaterial color="#bfc7cf" metalness={0.85} roughness={0.24} />
      </mesh>
    </group>
  );
}

function Vehicle({ paint, wheelStyle, cameraPreset, doorOpen, bonnetOpen, bootOpen }: CarShowcaseProps) {
  const { camera } = useThree();
  const bodyMaterial = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: paint, metalness: 0.82, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.12 }),
    [paint]
  );

  useEffect(() => {
    const view = cameraViews[cameraPreset];
    camera.position.set(view[0], view[1], view[2]);
    camera.lookAt(0, cameraPreset === "interior" ? 1.1 : 0.8, 0);
  }, [camera, cameraPreset]);

  const hoodRef = useRef<THREE.Group>(null);
  const trunkRef = useRef<THREE.Group>(null);
  useEffect(() => {
    if (hoodRef.current) hoodRef.current.rotation.x = -bonnetOpen * 0.62;
    if (trunkRef.current) trunkRef.current.rotation.x = bootOpen * 0.5;
  }, [bonnetOpen, bootOpen]);

  return (
    <group>
      <RoundedBox position={[0, 0.53, 0]} args={[2.05, 0.48, 4.55]} radius={0.24} smoothness={6} castShadow receiveShadow material={bodyMaterial} />
      <RoundedBox position={[0, 0.78, -0.02]} args={[1.94, 0.3, 3.72]} radius={0.18} smoothness={5} castShadow material={bodyMaterial} />

      <group ref={hoodRef} position={[0, 0.76, 1.38]}>
        <RoundedBox position={[0, 0.13, 0.47]} args={[1.88, 0.2, 1.22]} radius={0.12} smoothness={5} castShadow material={bodyMaterial} />
        <mesh position={[0, 0.245, 0.42]}>
          <boxGeometry args={[0.72, 0.018, 0.5]} />
          <meshStandardMaterial color="#303a44" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      <group ref={trunkRef} position={[0, 0.78, -1.52]}>
        <RoundedBox position={[0, 0.1, -0.42]} args={[1.88, 0.18, 0.95]} radius={0.1} smoothness={5} castShadow material={bodyMaterial} />
      </group>

      <RoundedBox position={[0, 1.16, -0.25]} args={[1.72, 0.72, 1.92]} radius={0.34} smoothness={8} castShadow material={bodyMaterial} />
      <RoundedBox position={[0, 1.57, -0.28]} args={[1.5, 0.13, 1.22]} radius={0.22} smoothness={8} castShadow material={bodyMaterial} />
      <mesh position={[0, 1.25, 0.73]} rotation={[-0.43, 0, 0]}>
        <boxGeometry args={[1.48, 0.58, 0.035]} />
        <meshPhysicalMaterial color="#152536" metalness={0.45} roughness={0.1} transparent opacity={0.78} />
      </mesh>
      <mesh position={[0, 1.23, -1.18]} rotation={[0.42, 0, 0]}>
        <boxGeometry args={[1.4, 0.5, 0.035]} />
        <meshPhysicalMaterial color="#152536" metalness={0.45} roughness={0.1} transparent opacity={0.78} />
      </mesh>
      <mesh position={[0, 1.2, -0.25]}>
        <boxGeometry args={[0.035, 0.62, 1.65]} />
        <meshStandardMaterial color="#080d13" metalness={0.3} roughness={0.35} />
      </mesh>

      <mesh position={[0, 0.94, 0.05]}>
        <boxGeometry args={[1.54, 0.12, 1.48]} />
        <meshStandardMaterial color="#151b22" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.02, -0.72]}>
        <boxGeometry args={[1.45, 0.48, 0.2]} />
        <meshStandardMaterial color="#171c22" roughness={0.8} />
      </mesh>
      {[-0.48, 0.48].map((x) => (
        <group key={x} position={[x, 1.0, -0.32]}>
          <RoundedBox args={[0.42, 0.52, 0.46]} radius={0.12} smoothness={5} castShadow>
            <meshStandardMaterial color="#171c23" roughness={0.86} />
          </RoundedBox>
          <RoundedBox position={[0, 0.32, -0.16]} args={[0.38, 0.22, 0.16]} radius={0.08} smoothness={4}>
            <meshStandardMaterial color="#202a34" roughness={0.75} />
          </RoundedBox>
        </group>
      ))}

      <Door side={-1} open={doorOpen} />
      <Door side={1} open={doorOpen} />

      <Wheel x={-1.02} z={1.42} wheelStyle={wheelStyle} />
      <Wheel x={1.02} z={1.42} wheelStyle={wheelStyle} />
      <Wheel x={-1.02} z={-1.42} wheelStyle={wheelStyle} />
      <Wheel x={1.02} z={-1.42} wheelStyle={wheelStyle} />

      {[-0.67, 0.67].map((x) => (
        <group key={x} position={[x, 0.79, 2.08]}>
          <mesh castShadow>
            <RoundedBox args={[0.46, 0.15, 0.12]} radius={0.06} smoothness={4} />
            <meshPhysicalMaterial color="#e8f4ff" emissive="#b8dfff" emissiveIntensity={1.1} metalness={0.35} roughness={0.18} />
          </mesh>
          <mesh position={[0, -0.14, 0.015]}>
            <boxGeometry args={[0.35, 0.025, 0.025]} />
            <meshStandardMaterial color="#f4f7fa" emissive="#dbeeff" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}
      <RoundedBox position={[0, 0.52, 2.13]} args={[0.72, 0.2, 0.08]} radius={0.035} smoothness={4}>
        <meshStandardMaterial color="#10151b" metalness={0.8} roughness={0.28} />
      </RoundedBox>
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} position={[-0.31 + i * 0.078, 0.52, 2.18]}>
          <boxGeometry args={[0.025, 0.13, 0.018]} />
          <meshStandardMaterial color="#89939e" metalness={0.85} roughness={0.24} />
        </mesh>
      ))}
      {[-0.7, 0.7].map((x) => (
        <mesh key={x} position={[x, 0.78, -2.08]}>
          <RoundedBox args={[0.48, 0.14, 0.1]} radius={0.06} smoothness={4} />
          <meshStandardMaterial color="#7b101a" emissive="#8b0714" emissiveIntensity={0.7} roughness={0.25} />
        </mesh>
      ))}
      <mesh position={[0, 0.38, -2.18]}>
        <boxGeometry args={[1.45, 0.12, 0.08]} />
        <meshStandardMaterial color="#151b22" metalness={0.65} roughness={0.3} />
      </mesh>

      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.96, 1.18, 0.56]}>
          <mesh position={[side * 0.13, 0.02, 0]}>
            <boxGeometry args={[0.28, 0.08, 0.16]} />
            <meshStandardMaterial color="#171d24" metalness={0.65} roughness={0.3} />
          </mesh>
          <RoundedBox position={[side * 0.23, 0.06, 0]} args={[0.18, 0.14, 0.28]} radius={0.05} smoothness={4}>
            <meshPhysicalMaterial color="#101820" metalness={0.5} roughness={0.15} />
          </RoundedBox>
        </group>
      ))}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[1.45, 0.12, 3.45]} />
        <meshStandardMaterial color="#0b1016" roughness={0.95} />
      </mesh>
    </group>
  );
}

export default function CarShowcase(props: CarShowcaseProps) {
  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_50%_42%,#1a2634_0%,#080d14_58%,#05080d_100%)] sm:h-[430px]">
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: cameraViews.front, fov: 38 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={["#070b10"]} />
        <ambientLight intensity={0.8} />
        <hemisphereLight args={["#d8e8ff", "#10151d", 1.1]} />
        <directionalLight position={[5, 8, 5]} intensity={2.5} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-5, 4, -4]} intensity={1.4} color="#8dbdff" />
        <spotLight position={[0, 6, 2]} intensity={1.8} angle={0.55} penumbra={0.8} color="#ffffff" />
        <Vehicle {...props} />
        <ContactShadows position={[0, 0.015, 0]} opacity={0.42} scale={8} blur={2.8} far={4} />
        <OrbitControls makeDefault enableDamping dampingFactor={0.08} minDistance={4.2} maxDistance={10} maxPolarAngle={Math.PI / 2.05} target={[0, 0.8, 0]} />
      </Canvas>
      <div className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[9px] uppercase tracking-[0.3em] text-white/55 backdrop-blur">
        Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
}
