import { Suspense, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  BoxGeometry,
  BufferGeometry,
  ConeGeometry,
  IcosahedronGeometry,
  Mesh,
  OctahedronGeometry,
  SphereGeometry,
  TetrahedronGeometry,
  TorusGeometry,
  TorusKnotGeometry,
} from 'three';
import { useIsLowPowerViewport, usePrefersReducedMotion } from '@/lib/motion';

type Vec3 = [number, number, number];

// Animated wireframe geometry component
const AnimatedGeometry = ({
  geometry,
  position,
  rotationSpeed = [0.005, 0.005, 0.005],
  mouseEffect = false,
  animate = true,
}: {
  geometry: BufferGeometry;
  position: Vec3;
  rotationSpeed?: Vec3;
  mouseEffect?: boolean;
  animate?: boolean;
}) => {
  const meshRef = useRef<Mesh>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mouseEffect || !animate) return;
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseEffect, animate]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh || !animate) return;

    mesh.rotation.x += rotationSpeed[0];
    mesh.rotation.y += rotationSpeed[1];
    mesh.rotation.z += rotationSpeed[2];

    if (mouseEffect) {
      const targetRotationX = mousePosition.current.y * 0.15;
      const targetRotationY = mousePosition.current.x * 0.15;
      mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.05;
      mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.05;
    }

    mesh.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.5) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <primitive object={geometry} attach="geometry" />
      <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.6} />
    </mesh>
  );
};

const createGeometries = (shapes: 'mixed' | 'geometric' | 'organic'): BufferGeometry[] => {
  switch (shapes) {
    case 'geometric':
      return [
        new BoxGeometry(2, 2, 2),
        new ConeGeometry(1, 2, 8),
        new OctahedronGeometry(1.5),
        new TetrahedronGeometry(1.5),
      ];
    case 'organic':
      return [
        new SphereGeometry(1.5, 16, 16),
        new TorusGeometry(1, 0.3, 8, 16),
        new TorusKnotGeometry(1, 0.3, 64, 8),
        new IcosahedronGeometry(1.5),
      ];
    default:
      return [
        new BoxGeometry(2, 2, 2),
        new SphereGeometry(1.5, 16, 16),
        new TorusGeometry(1, 0.3, 8, 16),
        new OctahedronGeometry(1.5),
      ];
  }
};

const POSITIONS: Vec3[] = [
  [-6, 0, -2],
  [6, 2, -3],
  [-4, -3, -1],
  [5, -1, -4],
];

// Main Three.js scene component
const ThreeScene = ({
  className = '',
  mouseEffect = false,
  shapes = 'mixed',
}: {
  className?: string;
  mouseEffect?: boolean;
  shapes?: 'mixed' | 'geometric' | 'organic';
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const lowPower = useIsLowPowerViewport();

  // Created once per `shapes` value (previously rebuilt on every render) and
  // disposed on change/unmount so GPU buffers are released.
  const geometries = useMemo(() => createGeometries(shapes), [shapes]);
  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries]);

  // Lighter scene on phones / touch devices: fewer shapes, no pointer parallax.
  const visible = lowPower ? geometries.slice(0, 2) : geometries;

  return (
    <div className={`relative w-full h-full ${className}`} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        className="absolute inset-0"
        style={{ background: 'transparent' }}
        // Cap pixel ratio; render a single still frame when motion is reduced.
        dpr={lowPower ? [1, 1.5] : [1, 2]}
        frameloop={reducedMotion ? 'demand' : 'always'}
        gl={{ powerPreference: lowPower ? 'low-power' : 'high-performance' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />

          {visible.map((geometry, index) => (
            <AnimatedGeometry
              key={index}
              geometry={geometry}
              position={POSITIONS[index]}
              rotationSpeed={[
                0.005 + index * 0.002,
                0.005 + index * 0.001,
                0.005 + index * 0.003,
              ]}
              mouseEffect={mouseEffect && !lowPower}
              animate={!reducedMotion}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeScene;
