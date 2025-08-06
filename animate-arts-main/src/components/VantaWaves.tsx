import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

const VantaWaves = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    // Load Three.js and Vanta.js
    const loadScripts = async () => {
      // Load Three.js
      if (!window.THREE) {
        const threeScript = document.createElement('script');
        threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js';
        threeScript.async = true;
        document.head.appendChild(threeScript);
        
        await new Promise((resolve) => {
          threeScript.onload = resolve;
        });
      }

      // Load Vanta Waves
      if (!window.VANTA) {
        const vantaScript = document.createElement('script');
        vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js';
        vantaScript.async = true;
        document.head.appendChild(vantaScript);
        
        await new Promise((resolve) => {
          vantaScript.onload = resolve;
        });
      }

      // Initialize Vanta effect
      if (vantaRef.current && window.VANTA && !vantaEffect.current) {
        vantaEffect.current = window.VANTA.WAVES({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x050505,
          shininess: 30,
          waveHeight: 15,
          waveSpeed: 0.75,
          zoom: 0.65,
        });
      }
    };

    loadScripts();

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={vantaRef} 
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

export default VantaWaves;