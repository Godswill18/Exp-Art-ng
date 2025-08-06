import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import * as THREE from 'three';

// Animated wireframe geometry component
const AnimatedGeometry = ({ 
  geometry, 
  position, 
  rotationSpeed = [0.005, 0.005, 0.005],
  mouseEffect = false 
}: {
  geometry: any;
  position: [number, number, number];
  rotationSpeed?: [number, number, number];
  mouseEffect?: boolean;
}) => {
  const meshRef = useRef<Mesh>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (mouseEffect) {
      const handleMouseMove = (event: MouseEvent) => {
        mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseEffect]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Base rotation
      meshRef.current.rotation.x += rotationSpeed[0];
      meshRef.current.rotation.y += rotationSpeed[1];
      meshRef.current.rotation.z += rotationSpeed[2];

      // Mouse-based parallax effect
      if (mouseEffect) {
        const targetRotationX = mousePosition.current.y * 0.15;
        const targetRotationY = mousePosition.current.x * 0.15;
        
        meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.05;
        meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.05;
      }

      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <primitive object={geometry} />
      <meshBasicMaterial 
        color="#6366f1" 
        wireframe={true} 
        transparent={true} 
        opacity={0.6}
      />
    </mesh>
  );
};

// Main Three.js scene component
const ThreeScene = ({ 
  className = "",
  mouseEffect = false,
  shapes = 'mixed'
}: {
  className?: string;
  mouseEffect?: boolean;
  shapes?: 'mixed' | 'geometric' | 'organic';
}) => {
  const getGeometries = () => {
    switch (shapes) {
      case 'geometric':
        return [
          new THREE.BoxGeometry(2, 2, 2),
          new THREE.ConeGeometry(1, 2, 8),
          new THREE.OctahedronGeometry(1.5),
          new THREE.TetrahedronGeometry(1.5),
        ];
      case 'organic':
        return [
          new THREE.SphereGeometry(1.5, 16, 16),
          new THREE.TorusGeometry(1, 0.3, 8, 16),
          new THREE.TorusKnotGeometry(1, 0.3, 64, 8),
          new THREE.IcosahedronGeometry(1.5),
        ];
      default:
        return [
          new THREE.BoxGeometry(2, 2, 2),
          new THREE.SphereGeometry(1.5, 16, 16),
          new THREE.TorusGeometry(1, 0.3, 8, 16),
          new THREE.OctahedronGeometry(1.5),
        ];
    }
  };

  const geometries = getGeometries();
  const positions: [number, number, number][] = [
    [-6, 0, -2],
    [6, 2, -3],
    [-4, -3, -1],
    [5, -1, -4],
  ];

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        className="absolute inset-0"
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          {geometries.map((geometry, index) => (
            <AnimatedGeometry
              key={index}
              geometry={geometry}
              position={positions[index]}
              rotationSpeed={[
                0.005 + index * 0.002,
                0.005 + index * 0.001,
                0.005 + index * 0.003
              ]}
              mouseEffect={mouseEffect}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeScene;