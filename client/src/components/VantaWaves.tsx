import { useEffect, useRef } from 'react';
import { useIsLowPowerViewport, usePrefersReducedMotion } from '@/lib/motion';

interface VantaEffect {
  destroy: () => void;
}
interface VantaGlobal {
  WAVES: (options: Record<string, unknown>) => VantaEffect;
}

declare global {
  interface Window {
    VANTA?: VantaGlobal;
    THREE?: unknown;
  }
}

// Pinned versions with Subresource Integrity, so a compromised or changed CDN
// file cannot run in visitors' browsers. (Previously "vanta@latest", unverified.)
const THREE_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js';
const THREE_SRI = 'sha384-DXar47anhP2p0NKLdo4cUCrnUtBBp/r91y336ez5hAeL8XPMqKND66/jv8ocrYAL';
const VANTA_SRC = 'https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.waves.min.js';
const VANTA_SRI = 'sha384-fs5VqUnBAfynHwt9bbuBxdgqyNG/vUAEV0bbNR1WkKlgIJLlK+jPRNHPNcpKUkKg';

const pending = new Map<string, Promise<void>>();

function loadScript(src: string, integrity: string): Promise<void> {
  const existing = pending.get(src);
  if (existing) return existing;
  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.integrity = integrity;
    script.crossOrigin = 'anonymous';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      pending.delete(src);
      script.remove();
      reject(new Error(`Failed to load ${src}`));
    };
    document.head.appendChild(script);
  });
  pending.set(src, promise);
  return promise;
}

const VantaWaves = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const lowPower = useIsLowPowerViewport();

  useEffect(() => {
    // Skip the animated background entirely for reduced-motion visitors.
    if (reducedMotion) return;

    let cancelled = false;
    let effect: VantaEffect | null = null;

    (async () => {
      try {
        if (!window.THREE) await loadScript(THREE_SRC, THREE_SRI);
        if (!window.VANTA) await loadScript(VANTA_SRC, VANTA_SRI);
        if (cancelled || !vantaRef.current || !window.VANTA) return;
        effect = window.VANTA.WAVES({
          el: vantaRef.current,
          mouseControls: !lowPower,
          touchControls: false,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x050505,
          shininess: 30,
          waveHeight: 15,
          waveSpeed: lowPower ? 0.4 : 0.75,
          zoom: 0.65,
        });
      } catch (error) {
        // The page works without the background; just report it.
        console.warn('Vanta background unavailable:', error);
      }
    })();

    return () => {
      cancelled = true;
      effect?.destroy();
      effect = null;
    };
  }, [reducedMotion, lowPower]);

  return (
    <div
      ref={vantaRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};

export default VantaWaves;
